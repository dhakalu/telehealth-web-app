variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Name the environment"
  type        = string
  default     = "dev"
}

variable "ecr_repo_name" {
  description = "ECR repo to pull the image from"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag to use for the ECS task"
  type        = string
  default     = "0.0.10"
}


