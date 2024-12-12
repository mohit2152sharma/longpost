# Tell terraform to use the provider and select a version.
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}


# Set the variable value in *.tfvars file
# or using the -var="hcloud_token=..." CLI option
variable "hcloud_token" {
  sensitive = true
  type      = string
}

variable "ssh_key_filepath" {
  type    = string
  default = null
}

# Configure the Hetzner Cloud Provider
provider "hcloud" {
  token = var.hcloud_token
}


locals {
  labels = {
    env : "prod"
    dokploy : "true"
    kube : "false"
  }
  ssh_key = file(var.ssh_key_filepath)
}

# Create a resource for creating hetzner ipv4 key
resource "hcloud_primary_ip" "ipv4" {
  name          = "longpost-prod-ipv4"
  type          = "ipv4"
  assignee_type = "server"
  datacenter    = "nbg1-dc3"
  auto_delete   = false
  labels        = local.labels
}

# Create a Hetzner Cloud server
resource "hcloud_server" "server" {
  name        = "longpost-prod"
  server_type = "cax11"
  image       = "ubuntu-24.04"
  ssh_keys    = ["mohit-macbook-pro"]
  labels      = local.labels

  # Optional
  location = "nbg1"

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
    ipv4         = hcloud_primary_ip.ipv4.id
  }

  lifecycle {
    ignore_changes = [ssh_keys]
  }

  connection {
    type        = "ssh"
    user        = "root"
    host        = self.ipv4_address
    private_key = local.ssh_key
    port        = 22
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "curl -sSL https://dokploy.com/install.sh | sh",
    ]
  }
}

