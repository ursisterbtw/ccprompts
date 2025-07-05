import { dag, Container, object, func } from "@dagger.io/dagger"

/**
 * Safety container system for running potentially dangerous commands
 */
@object()
class SafetyContainer {
  
  /**
   * Create a secure Ubuntu container with basic tools
   */
  @func()
  baseContainer(): Container {
    return dag
      .container()
      .from("ubuntu:22.04")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", 
        "curl", 
        "wget", 
        "git", 
        "vim", 
        "nano", 
        "jq", 
        "build-essential",
        "python3",
        "python3-pip",
        "nodejs",
        "npm"
      ])
      .withWorkdir("/workspace")
  }

  /**
   * Create a container with project files mounted (read-only)
   */
  @func()
  projectContainer(projectPath: string): Container {
    return this.baseContainer()
      .withDirectory("/workspace", dag.host().directory(projectPath), {
        exclude: ["node_modules", ".git", "dist", "build", "tmp", "*.log"]
      })
  }

  /**
   * Run a command safely in isolation
   */
  @func()
  async runSafeCommand(
    command: string,
    projectPath: string = ".",
    environment: { [key: string]: string } = {}
  ): Promise<string> {
    const container = this.projectContainer(projectPath)
    
    // Set environment variables
    let containerWithEnv = container
    for (const [key, value] of Object.entries(environment)) {
      containerWithEnv = containerWithEnv.withEnvVariable(key, value)
    }
    
    // Execute the command
    return await containerWithEnv
      .withExec(["sh", "-c", command])
      .stdout()
  }

  /**
   * Create a development container with common tools
   */
  @func()
  devContainer(): Container {
    return this.baseContainer()
      .withExec(["npm", "install", "-g", "typescript", "@types/node"])
      .withExec(["pip3", "install", "black", "flake8", "mypy"])
      .withEnvVariable("NODE_ENV", "development")
  }

  /**
   * Run security scanning in isolation
   */
  @func()
  async securityScan(projectPath: string): Promise<string> {
    return await this.projectContainer(projectPath)
      .withExec(["npm", "audit", "--json"])
      .stdout()
  }

  /**
   * Test container with cleanup
   */
  @func()
  async testCommand(
    command: string,
    projectPath: string = ".",
    cleanup: boolean = true
  ): Promise<string> {
    const result = await this.runSafeCommand(command, projectPath)
    
    if (cleanup) {
      // Container automatically cleaned up by Dagger
      console.log("Container cleanup completed")
    }
    
    return result
  }
}