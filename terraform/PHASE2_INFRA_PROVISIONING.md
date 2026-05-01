# Phase 2 - Infrastructure Provisioning (Terraform)

This document completes the Phase 2 checklist and provides exact commands to run.

## Checklist Status

- [x] Terraform configuration exists for S3 infrastructure
- [x] Unique bucket name configured
- [x] Versioning enabled
- [x] Encryption enabled
- [x] Public access blocked
- [ ] `terraform init` executed locally (requires Terraform CLI installed)
- [ ] `terraform validate` executed locally (requires Terraform CLI installed)
- [ ] `terraform plan` executed with AWS credentials
- [ ] `terraform apply` executed with AWS credentials

## Requirement Mapping

### 1) Unique bucket name

- Implemented in `main.tf` using:
  - `random_id.bucket_suffix`
  - `local.bucket_name = "${var.project_name}-${var.environment}-${random_id.bucket_suffix.hex}"`
- This guarantees globally unique S3 bucket names.

### 2) Versioning enabled

- Implemented via `aws_s3_bucket_versioning.main` with status `Enabled`.

### 3) Encryption enabled

- Implemented via `aws_s3_bucket_server_side_encryption_configuration.main`.
- Defaults to `AES256` (SSE-S3).
- Optional KMS support through `kms_key_arn`.

### 4) Public access blocked

- Implemented via `aws_s3_bucket_public_access_block.main` with all four protections enabled:
  - `block_public_acls = true`
  - `block_public_policy = true`
  - `ignore_public_acls = true`
  - `restrict_public_buckets = true`

## How To Run Phase 2 End-to-End

From repo root:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` for your environment.

Then run:

```bash
terraform init -input=false
terraform validate
terraform plan -out=tfplan
terraform apply -auto-approve tfplan
```

## Verify Created Infrastructure

```bash
terraform output
```

Important outputs:

- `bucket_name`
- `bucket_arn`
- `versioning_status`
- `encryption_algorithm`

## Prerequisites

- Terraform CLI installed (`terraform -v`)
- AWS credentials configured (`aws configure` or environment variables)
- AWS IAM permissions for S3 and related actions used by this configuration
