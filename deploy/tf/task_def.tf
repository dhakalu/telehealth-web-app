locals {
  repo_name   = "telehealth-ui"
}

data "aws_caller_identity" "current" {}

data "aws_iam_role" "ecs_execution_role" {
  name = "AmazonECSTaskExecutionRole"
}

resource "aws_cloudwatch_log_group" "ecs_task" {
  name              = "/ecs/${local.name_prefix}-task"
  retention_in_days = 3
}

resource "aws_ecs_task_definition" "telehealth" {
  family                   = "${local.name_prefix}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn = data.aws_iam_role.ecs_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${local.repo_name}:${var.image_tag}"
      essential = true
      portMappings = [
        {
          containerPort = local.port
          hostPort      = local.port
        }
      ]
      environment = [
        {
          name = "API_BASE_URL"
          value = "https://${var.environment}.amruta.online/api"
        },
        # {
        #   name  = "PORT"
        #   value = "${local.port}"
        # },
        {
          name  = "ENVIRONMENT"
          value = var.environment
        },
        {
          name  = "VERSION"
          value = var.image_tag
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_task.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}