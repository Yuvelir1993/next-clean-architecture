resource "aws_cognito_user_pool" "pool" {
  name = "clean-architecture-next-user-pool"
  #   not setting password_policy because it will then be synchronized with app schemas validations. for now it's not needed
}

resource "aws_cognito_user_pool_client" "client" {
  name                = "clean-architecture-next-user-pool-client"
  user_pool_id        = aws_cognito_user_pool.pool.id
  explicit_auth_flows = ["ALLOW_ADMIN_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}
