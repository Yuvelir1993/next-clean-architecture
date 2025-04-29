resource "aws_cognito_user_pool" "pool" {
  name = "clean-architecture-next-user-pool"

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = false
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  username_attributes = ["email"]

  tags = {
    App = "NextJsAuthCleanArchitecture"
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name                = "clean-architecture-next-user-pool-client"
  user_pool_id        = aws_cognito_user_pool.pool.id
  explicit_auth_flows = ["ALLOW_ADMIN_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

resource "aws_dynamodb_table" "projects" {
  name         = "Projects"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  tags = {
    App = "NextJsAuthCleanArchitecture"
  }
}

