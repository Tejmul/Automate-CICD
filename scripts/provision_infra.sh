#!/usr/bin/env bash
set -euo pipefail

# Phase 2 Terraform provisioning helper
# Usage:
#   ./scripts/provision_infra.sh
# Optional:
#   AUTO_APPROVE=true ./scripts/provision_infra.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TF_DIR="$ROOT_DIR/terraform"

if ! command -v terraform >/dev/null 2>&1; then
  echo "Terraform CLI is not installed. Install Terraform and re-run."
  exit 1
fi

if [ ! -f "$TF_DIR/terraform.tfvars" ]; then
  echo "terraform.tfvars not found. Creating from terraform.tfvars.example..."
  cp "$TF_DIR/terraform.tfvars.example" "$TF_DIR/terraform.tfvars"
  echo "Created $TF_DIR/terraform.tfvars"
  echo "Update values in terraform.tfvars, then run again."
  exit 1
fi

cd "$TF_DIR"

echo "==> Terraform init"
terraform init -input=false

echo "==> Terraform validate"
terraform validate

echo "==> Terraform plan"
terraform plan -out=tfplan

if [ "${AUTO_APPROVE:-false}" = "true" ]; then
  echo "==> Terraform apply (auto-approve)"
  terraform apply -auto-approve tfplan
else
  echo "==> Terraform apply"
  terraform apply tfplan
fi

echo "==> Outputs"
terraform output

