
data "aws_ssm_parameter" "alb_sg" {
  name = "/http/alb/subnet_id"
}

locals {
  alb_security_group_id = data.aws_ssm_parameter.alb_sg.value
}


resource "aws_security_group" "ecs_service" {
  name        = "${local.name_prefix}-sg"
  description = "Allow ingress from ALB and egress to internet"
  vpc_id      = data.aws_ssm_parameter.vpc_id.value

  ingress {
    from_port       = local.port
    to_port         = local.port
    protocol        = "tcp"
    security_groups = [local.alb_security_group_id]
    description     = "Allow HTTP from ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "${local.name_prefix}-sg"
  }
}