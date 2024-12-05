module "doproject" {
  source              = "./doproject"
  project_name        = "longpost"
  project_description = "social media growth platform"
  project_purpose     = "social media growth platform"
  project_environment = "development"
  cluster_name        = "longpost-cluster-dev"
  cluster_region      = "sfo3"
}

module "icnamespace" {
  source    = "./icnamespace"
  HOST_NAME = var.HOST_NAME
}

module "certsnamespace" {
  source      = "./certsnamespace"
  DO_TOKEN    = var.DO_TOKEN
  ACME_EMAIL  = var.ACME_EMAIL
  ACME_SERVER = var.ACME_SERVER
}

module "wwwnamespace" {
  source              = "./longpost"
  APP_NAME            = "www"
  HOST_NAME           = var.HOST_NAME
  CLUSTER_ISSUER_NAME = module.certsnamespace.CLUSTER_ISSUER_NAME
}
