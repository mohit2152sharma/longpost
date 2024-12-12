terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.34.1"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.26.0"

    }

    helm = {
      source  = "hashicorp/helm"
      version = "2.12.1"
    }

    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.7.0"
    }
  }
}

provider "digitalocean" {
  token = var.DO_TOKEN
}

provider "kubernetes" {
  host                   = module.doproject.CLUSTER_HOST
  token                  = module.doproject.CLUSTER_TOKEN
  cluster_ca_certificate = module.doproject.CLUSTER_CA
}

provider "helm" {
  kubernetes {
    host                   = module.doproject.CLUSTER_HOST
    token                  = module.doproject.CLUSTER_TOKEN
    cluster_ca_certificate = module.doproject.CLUSTER_CA
  }
}

provider "kubectl" {
  host                   = module.doproject.CLUSTER_HOST
  cluster_ca_certificate = module.doproject.CLUSTER_CA
  token                  = module.doproject.CLUSTER_TOKEN
  load_config_file       = false
}
