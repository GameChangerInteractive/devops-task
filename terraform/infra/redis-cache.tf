resource "azurerm_resource_group" "redisxmpl" {
  name     = "redisxmpl-resources"
  location = "westus"
}

resource "azurerm_redis_cache" "redisxmpl" {
  name                = "redisxmpl-cache"
  location            = azurerm_resource_group.redisxmpl.location
  resource_group_name = azurerm_resource_group.redisxmpl.name
  capacity            = 2
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  redis_configuration {
  }
}
