output "CLUSTER_ISSUER_NAME" {
  # value = kubectl_manifest.clusterissuer.name
  value = kubectl_manifest.clusterissuer.name
  # value       = kubernetes_manifest.clusterissuer.manifest.metadata.name
  description = "Name used by ingress rules to identify where certificate requests within the cluster will be handled"
}
