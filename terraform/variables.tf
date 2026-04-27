# ── General ──────────────────────────────────────────────────────────────────

variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short name for the project (used in resource naming)"
  type        = string
  default     = "automate-cicd"
}

variable "environment" {
  description = "Deployment environment (dev / staging / prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

# ── S3 ────────────────────────────────────────────────────────────────────────

variable "force_destroy" {
  description = "Allow Terraform to delete the bucket even if it contains objects"
  type        = bool
  default     = false
}

variable "kms_key_arn" {
  description = "ARN of a KMS key for S3 encryption. Leave empty to use AES-256 (SSE-S3)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "enable_lifecycle" {
  description = "Enable S3 lifecycle rules to transition objects to cheaper storage tiers"
  type        = bool
  default     = false
}
