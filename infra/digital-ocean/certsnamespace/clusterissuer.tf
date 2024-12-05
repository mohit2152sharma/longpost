# resource "kubernetes_manifest" "clusterissuer" {
#   manifest = {
#     apiVersion = "cert-manager.io/v1"
#     kind       = "ClusterIssuer"
#
#     metadata = {
#       name = "clusterissuer"
#     }
#
#     spec = {
#       acme = {
#         email  = var.ACME_EMAIL
#         server = var.ACME_SERVER
#
#         privateKeySecretRef = {
#           name = "clusterissuer-secret"
#         }
#
#         solvers = [{
#           dns01 = {
#             digitalocean = {
#               tokenSecretRef = {
#                 name = kubernetes_secret.dotoksecret.metadata[0].name
#                 key  = "access-token"
#               }
#             }
#           }
#         }]
#       }
#     }
#   }
# }

resource "kubectl_manifest" "clusterissuer" {
  depends_on = [helm_release.certmanagerrelease]
  yaml_body  = <<YAML
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: clusterissuer
spec:
  acme:
    email: ${var.ACME_EMAIL}
    server: ${var.ACME_SERVER}
    privateKeySecretRef:
      name: clusterissuer-secret
    solvers:
      - dns01:
          digitalocean:
            tokenSecretRef:
              name: ${kubernetes_secret.dotoksecret.metadata[0].name}
              key: access-token
YAML
}
