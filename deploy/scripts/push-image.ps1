# Variables - update these as needed
$region = "us-east-1"
$accountId = (aws sts get-caller-identity --query Account --output text)
$repository = "telehealth-ui"
$imageTag = "0.0.9"



# ECR login
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin "$accountId.dkr.ecr.$region.amazonaws.com"

# Tag the image
docker tag "ui:${imageTag}" "${accountId}.dkr.ecr.${region}.amazonaws.com/${repository}:${imageTag}"

# Push the image
docker push "${accountId}.dkr.ecr.${region}.amazonaws.com/${repository}:${imageTag}"