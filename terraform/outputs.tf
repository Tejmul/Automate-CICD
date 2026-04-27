output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.main.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.main.arn
}

output "bucket_region" {
  description = "AWS region the bucket was created in"
  value       = aws_s3_bucket.main.region
}

output "bucket_domain_name" {
  description = "Bucket domain name (for CloudFront origins etc.)"
  value       = aws_s3_bucket.main.bucket_domain_name
}

output "versioning_status" {
  description = "Versioning status on the bucket"
  value       = aws_s3_bucket_versioning.main.versioning_configuration[0].status
}

output "encryption_algorithm" {
  description = "SSE algorithm applied to the bucket"
  value       = aws_s3_bucket_server_side_encryption_configuration.main.rule[0].apply_server_side_encryption_by_default[0].sse_algorithm
}
