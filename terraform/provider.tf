terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.86.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}
