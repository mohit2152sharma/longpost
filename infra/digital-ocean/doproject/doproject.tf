variable "project_name" {
  type = string
}

variable "project_description" {
  type = string
}

variable "project_purpose" {
  type = string
}

variable "project_environment" {
  type = string
}



resource "digitalocean_project" "doproject" {
  name        = var.project_name
  description = var.project_description
  purpose     = var.project_purpose
  environment = var.project_environment

  resources = [
    digitalocean_kubernetes_cluster.docluster.urn
  ]
}
