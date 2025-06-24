# Read values from AWS SSM Parameter Store
data "aws_ssm_parameter" "cluster_name" {
  name = "/http/${var.environment}/ecs_cluster_name"
}

data "aws_ssm_parameter" "vpc_id" {
  name = "/networking/${var.environment}/vpc_id"
}

data "aws_ssm_parameter" "public_subnets" {
  name = "/networking/${var.environment}/public_subnets"
}

data "aws_ssm_parameter" "private_subnets" {
  name = "/networking/${var.environment}/private_subnets"
}

# Convert comma-separated subnet IDs to list
locals {
  host_in     = "public"
  subnet_ids  = local.host_in == "public" ? split(",", data.aws_ssm_parameter.public_subnets.value) : split(",", data.aws_ssm_parameter.private_subnets.value)
  name_prefix = "ui-${var.environment}"

  port = 8090
}

data "aws_ssm_parameter" "listener_arn" {
  name = "/http/${var.environment}/alb_listener_https_arn"
}

resource "aws_lb_target_group" "telehealth" {
  name        = "${local.name_prefix}-tg"
  port        = local.port
  protocol    = "HTTP"
  vpc_id      = data.aws_ssm_parameter.vpc_id.value
  target_type = "ip"
  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener_rule" "api_forward" {
  listener_arn = data.aws_ssm_parameter.listener_arn.value
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.telehealth.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

resource "aws_ecs_service" "telehealth" {
  depends_on      = [aws_lb_listener_rule.api_forward]
  name            = "${local.name_prefix}-service"
  cluster         = data.aws_ssm_parameter.cluster_name.value
  task_definition = aws_ecs_task_definition.telehealth.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = local.subnet_ids
    security_groups  = [aws_security_group.ecs_service.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.telehealth.arn
    container_name   = "app"
    container_port   = local.port
  }
}