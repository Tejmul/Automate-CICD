# ============================================================
# ECR Repository (use existing if AWS Academy)
# ============================================================
data "aws_ecr_repository" "existing" {
  count = var.use_aws_academy ? 1 : 0
  name  = "${var.project_name}-repo"
}

resource "aws_ecr_repository" "app" {
  count                = var.use_aws_academy ? 0 : 1
  name                 = "${var.project_name}-repo"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = var.project_name
  }
}

locals {
  ecr_repository_url  = var.use_aws_academy ? data.aws_ecr_repository.existing[0].repository_url : aws_ecr_repository.app[0].repository_url
  ecr_repository_name = var.use_aws_academy ? data.aws_ecr_repository.existing[0].name : aws_ecr_repository.app[0].name
}

# Lifecycle policy — keep only last 5 images (skip for AWS Academy)
resource "aws_ecr_lifecycle_policy" "app" {
  count      = var.use_aws_academy ? 0 : 1
  repository = local.ecr_repository_name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 5 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = {
        type = "expire"
      }
    }]
  })
}

# ============================================================
# ECS Cluster
# ============================================================
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  tags = {
    Project = var.project_name
  }
}

# ============================================================
# CloudWatch Log Group for ECS tasks (use existing if AWS Academy)
# ============================================================
data "aws_cloudwatch_log_group" "existing" {
  count = var.use_aws_academy ? 1 : 0
  name  = "/ecs/${var.project_name}"
}

resource "aws_cloudwatch_log_group" "ecs" {
  count             = var.use_aws_academy ? 0 : 1
  name              = "/ecs/${var.project_name}"
  retention_in_days = 7

  tags = {
    Project = var.project_name
  }
}

locals {
  cloudwatch_log_group_name = var.use_aws_academy ? data.aws_cloudwatch_log_group.existing[0].name : aws_cloudwatch_log_group.ecs[0].name
}

# ============================================================
# IAM — Use LabRole for AWS Academy, create role otherwise
# ============================================================
data "aws_caller_identity" "current" {}

locals {
  lab_role_arn       = var.lab_role_arn != "" ? var.lab_role_arn : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  execution_role_arn = var.use_aws_academy ? local.lab_role_arn : aws_iam_role.ecs_task_execution[0].arn
}

resource "aws_iam_role" "ecs_task_execution" {
  count = var.use_aws_academy ? 0 : 1
  name  = "${var.project_name}-ecs-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = {
    Project = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  count      = var.use_aws_academy ? 0 : 1
  role       = aws_iam_role.ecs_task_execution[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ============================================================
# ECS Task Definition (Fargate)
# ============================================================
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = local.execution_role_arn

  container_definitions = jsonencode([{
    name      = "${var.project_name}-container"
    image     = "${local.ecr_repository_url}:latest"
    essential = true

    portMappings = [{
      containerPort = 5001
      protocol      = "tcp"
    }]

    environment = [
      { name = "NODE_ENV", value = "production" },
      { name = "PORT", value = "5001" }
    ]

    healthCheck = {
      command     = ["CMD-SHELL", "node -e \"fetch('http://127.0.0.1:5001/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\""]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 10
    }

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = local.cloudwatch_log_group_name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = {
    Project = var.project_name
  }
}

# ============================================================
# Use default VPC + subnets for simplicity
# ============================================================
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ============================================================
# Security Group — allow inbound on 5001 + all outbound
# ============================================================
data "aws_security_group" "existing" {
  count  = var.use_aws_academy ? 1 : 0
  name   = "${var.project_name}-ecs-sg"
  vpc_id = data.aws_vpc.default.id
}

resource "aws_security_group" "ecs_service" {
  count       = var.use_aws_academy ? 0 : 1
  name        = "${var.project_name}-ecs-sg"
  description = "Allow inbound traffic on port 5001"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Project = var.project_name
  }
}

locals {
  security_group_id = var.use_aws_academy ? data.aws_security_group.existing[0].id : aws_security_group.ecs_service[0].id
}

# ============================================================
# ECS Service (Fargate) - use existing if AWS Academy
# ============================================================
data "aws_ecs_service" "existing" {
  count        = var.use_aws_academy ? 1 : 0
  service_name = "${var.project_name}-service"
  cluster_arn  = aws_ecs_cluster.main.arn
}

resource "aws_ecs_service" "app" {
  count           = var.use_aws_academy ? 0 : 1
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [local.security_group_id]
    assign_public_ip = true
  }

  force_new_deployment = true

  tags = {
    Project = var.project_name
  }
}

locals {
  ecs_service_name = var.use_aws_academy ? data.aws_ecs_service.existing[0].service_name : aws_ecs_service.app[0].name
}

# ============================================================
# Outputs
# ============================================================
output "ecr_repository_url" {
  description = "ECR repository URL for docker push"
  value       = local.ecr_repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = local.ecs_service_name
}
