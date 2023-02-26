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
