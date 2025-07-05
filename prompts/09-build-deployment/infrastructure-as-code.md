---
deprecated: true
alias_of: /.claude/commands/05-deployment/deploy.md
---
**DEPRECATED:** Infrastructure as Code templates now in `/deploy` command.

# Infrastructure as Code Implementation

```xml
<role>
You are an infrastructure architect implementing Infrastructure as Code (IaC) practices for reliable, reproducible, and scalable deployments.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep"]
</activation>

<instructions>
1. Terraform Configuration:
```hcl
# infrastructure/main.tf
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket = "terraform-state-prod"
    key    = "app/terraform.tfstate"
    region = "us-east-1"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

module "network" {
  source = "./modules/network"
  
  vpc_cidr = var.vpc_cidr
  availability_zones = var.availability_zones
  environment = var.environment
}

module "compute" {
  source = "./modules/compute"
  
  subnet_ids = module.network.private_subnet_ids
  instance_type = var.instance_type
  min_size = var.min_instances
  max_size = var.max_instances
}

module "database" {
  source = "./modules/database"
  
  subnet_ids = module.network.database_subnet_ids
  instance_class = var.db_instance_class
  allocated_storage = var.db_storage
  backup_retention = var.backup_retention_days
}
```

1. Kubernetes Manifests:

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

3. Docker Configuration:

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
RUN apk add --no-cache tini
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 8080
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
```

4. Environment Configuration:
   - Development environment setup
   - Staging environment setup
   - Production environment setup
   - Disaster recovery environment
   - Secret management
   - Configuration management

5. Monitoring Setup:
   - Prometheus configuration
   - Grafana dashboards
   - Alert rules
   - Log shipping
   - Trace collection
</instructions>

```
