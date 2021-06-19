resource "azurerm_resource_group" "redisxmpl" {
  name     = "${var.prefix}-resources"
  location = "${var.location}"
}

# NOTE: the Name used for Redis needs to be globally unique
resource "azurerm_redis_cache" "redisxmpl" {
  name                = "${var.prefix}-redis"
  location            = "${azurerm_resource_group.redisxmpl.location}"
  resource_group_name = "${azurerm_resource_group.redisxmpl.name}"
  capacity            = 0
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
}