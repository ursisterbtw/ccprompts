# Multi-stage optimized development container for ccprompts
# Base: Ubuntu 22.04 with essential development tools

# Stage 1: Base development environment
FROM ubuntu:25.04 AS base

# Avoid prompts from apt
ARG DEBIAN_FRONTEND=noninteractive

# Essential system packages and development tools
RUN apt-get update && apt-get install -y \
    # Core system tools
    curl \
    wget \
    git \
    gpg \
    ca-certificates \
    software-properties-common \
    build-essential \
    pkg-config \
    # Shell and CLI tools
    zsh \
    fish \
    tmux \
    vim \
    nano \
    htop \
    tree \
    jq \
    yq \
    # Network and security tools
    openssh-client \
    gnupg2 \
    unzip \
    zip \
    # Development utilities
    make \
    cmake \
    autoconf \
    automake \
    libtool \
    # Clean up
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Stage 2: Programming language runtimes
FROM base AS languages

# Install Node.js 20 LTS via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Bun (fast JavaScript runtime)
RUN curl -fsSL https://bun.sh/install | bash \
    && echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc

# Install Python 3.12 and pip
RUN apt-get update && apt-get install -y \
    python3.12 \
    python3.12-dev \
    python3.12-venv \
    python3-pip \
    && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install uv (fast Python package manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc

# Install Rust toolchain
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && echo 'source ~/.cargo/env' >> ~/.bashrc

# Install Go
ENV GO_VERSION=1.21.5
RUN wget https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz \
    && rm go${GO_VERSION}.linux-amd64.tar.gz \
    && echo 'export PATH="/usr/local/go/bin:$PATH"' >> ~/.bashrc

# Stage 3: Development tools and CLI utilities
FROM languages AS dev-tools

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Docker CLI (for Docker-in-Docker scenarios)
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli docker-compose-plugin \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl

# Install Terraform
ENV TERRAFORM_VERSION=1.6.6
RUN wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
    && unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
    && mv terraform /usr/local/bin/ \
    && rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip

# Install Dagger CLI
RUN curl -L https://dl.dagger.io/dagger/install.sh | sh \
    && mv bin/dagger /usr/local/bin/

# Stage 4: Final development container
FROM dev-tools AS final

# Create non-root user
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Switch to non-root user
USER $USERNAME

# Install Oh My Zsh for better shell experience
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
    && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Configure shell environment
RUN echo 'export PATH="$HOME/.bun/bin:$HOME/.cargo/bin:/usr/local/go/bin:$PATH"' >> ~/.zshrc \
    && echo 'plugins=(git docker docker-compose kubectl terraform golang python rust zsh-autosuggestions zsh-syntax-highlighting)' >> ~/.zshrc

# Install global development tools
RUN npm install -g \
    typescript \
    @types/node \
    eslint \
    prettier \
    markdownlint-cli \
    markdown-link-check \
    @vscode/vsce

# Install Python development tools
RUN python3 -m pip install --user \
    ruff \
    black \
    mypy \
    pytest \
    httpx \
    pydantic \
    typer \
    rich

# Set working directory
WORKDIR /workspace

# Configure git to be container-friendly
RUN git config --global init.defaultBranch main \
    && git config --global pull.rebase false \
    && git config --global safe.directory '*'

# Expose common development ports
EXPOSE 3000 8000 8080 5000 9000

# Default command
CMD ["zsh"]