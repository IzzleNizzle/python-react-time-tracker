terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table_item" "time_tracker_db" {
  table_name = aws_dynamodb_table.time_tracker_db.name
  hash_key   = aws_dynamodb_table.time_tracker_db.hash_key
  range_key  = aws_dynamodb_table.time_tracker_db.range_key

  item = <<ITEM
{
  "User": {"S": "user123"},
  "Timestamp": {"S": "2022-12-12"},
  "Activity": {"S": "Coding"}
}
ITEM

}

resource "aws_dynamodb_table" "time_tracker_db" {
  name           = "time_tracker_db"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  tags = {
    Environment = "Production"
    Name        = var.instance_name
    World       = "time-tracker"
  }
  hash_key  = "User"
  range_key = "Timestamp"

  attribute {
    name = "User"
    type = "S"
  }

  attribute {
    name = "Timestamp"
    type = "S"
  }

}

# Create an IAM role for Lambda function
resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"
  tags = {
    Environment = "Production"
    World       = "time-tracker"
  }
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the necessary policies to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_execution_role_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_execution_role.name
}

# Create a Lambda function
resource "aws_lambda_function" "my_lambda_function" {
  function_name    = "my_lambda_function"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "index.handler"
  runtime          = "nodejs14.x"
  filename         = "lambda_test/function.zip"
  source_code_hash = filebase64sha256("lambda_test/function.zip")
  tags             = { Environment = "Production" }

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.time_tracker_db.name
    }
  }
}
