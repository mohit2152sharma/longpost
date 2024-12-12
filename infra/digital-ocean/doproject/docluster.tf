variable "cluster_name" {
  type = string
}

variable "cluster_region" {
  type = string
}

resource "digitalocean_kubernetes_cluster" "docluster" {
  name    = var.cluster_name
  region  = var.cluster_region
  version = "1.31.1-do.4"

  node_pool {
    name       = "worker-pool"
    size       = "s-2vcpu-2gb"
    node_count = 1
  }
}
