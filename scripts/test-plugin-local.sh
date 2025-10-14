#!/usr/bin/env bash
# Test Plugin Locally - Setup script for testing ccprompts as a Claude Code plugin

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Get the absolute path to the ccprompts directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

info "CC Prompts Plugin - Local Testing Setup"
echo ""

# Step 1: Verify plugin structure
info "Step 1: Verifying plugin structure..."

if [[ ! -f "$PLUGIN_DIR/.claude-plugin/plugin.json" ]]; then
    error "Plugin manifest not found at $PLUGIN_DIR/.claude-plugin/plugin.json"
    exit 1
fi
success "Plugin manifest found"

if [[ ! -L "$PLUGIN_DIR/commands" ]] || [[ ! -L "$PLUGIN_DIR/agents" ]]; then
    error "Symlinks not found. Run this from the ccprompts directory."
    exit 1
fi
success "Symlinks verified"

# Count commands and agents
COMMAND_COUNT=$(find "$PLUGIN_DIR/.claude/commands" -name "*.md" -type f | wc -l)
AGENT_COUNT=$(find "$PLUGIN_DIR/.claude/agents" -name "*.md" -type f | wc -l)

success "Found $COMMAND_COUNT commands and $AGENT_COUNT agents"
echo ""

# Step 2: Create test marketplace structure
info "Step 2: Creating test marketplace..."

TEST_MARKETPLACE_DIR="${PLUGIN_TEST_DIR:-$HOME/.ccprompts-test-marketplace}"

if [[ -d "$TEST_MARKETPLACE_DIR" ]]; then
    warning "Test marketplace already exists at $TEST_MARKETPLACE_DIR"
    read -p "Remove and recreate? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$TEST_MARKETPLACE_DIR"
    else
        info "Keeping existing marketplace"
    fi
fi

mkdir -p "$TEST_MARKETPLACE_DIR/.claude-plugin"

# Create marketplace.json
cat > "$TEST_MARKETPLACE_DIR/.claude-plugin/marketplace.json" <<EOF
{
  "name": "ccprompts-test",
  "displayName": "CC Prompts Test Marketplace",
  "description": "Local test marketplace for CC Prompts development",
  "version": "1.0.0",
  "owner": {
    "name": "Local Development"
  },
  "plugins": [
    {
      "name": "ccprompts",
      "displayName": "CC Prompts - Development Version",
      "source": "$PLUGIN_DIR",
      "description": "Local development version of CC Prompts",
      "version": "0.2.0-dev",
      "categories": ["Development", "Testing"]
    }
  ]
}
EOF

success "Test marketplace created at $TEST_MARKETPLACE_DIR"
echo ""

# Step 3: Display installation instructions
info "Step 3: Installation Instructions"
echo ""
echo "To test the plugin in Claude Code:"
echo ""
echo "1. Start Claude Code:"
echo "   ${GREEN}claude${NC}"
echo ""
echo "2. Add the test marketplace:"
echo "   ${GREEN}/plugin marketplace add $TEST_MARKETPLACE_DIR${NC}"
echo ""
echo "3. Install the plugin:"
echo "   ${GREEN}/plugin install ccprompts@ccprompts-test${NC}"
echo ""
echo "4. Restart Claude Code to load the plugin"
echo ""
echo "5. Verify installation:"
echo "   ${GREEN}/help${NC}  (should show new commands)"
echo "   ${GREEN}/analyze-project${NC}  (test a command)"
echo "   ${GREEN}/agents${NC}  (view available agents)"
echo ""

# Step 4: Provide update instructions
info "Step 4: Testing Changes"
echo ""
echo "After making changes to commands or agents:"
echo ""
echo "1. Uninstall the current version:"
echo "   ${GREEN}/plugin uninstall ccprompts@ccprompts-test${NC}"
echo ""
echo "2. Reinstall to test changes:"
echo "   ${GREEN}/plugin install ccprompts@ccprompts-test${NC}"
echo ""
echo "3. Restart Claude Code"
echo ""

# Step 5: Cleanup instructions
info "Step 5: Cleanup"
echo ""
echo "To remove the test marketplace:"
echo "   ${GREEN}rm -rf $TEST_MARKETPLACE_DIR${NC}"
echo ""
echo "To remove from Claude Code:"
echo "   ${GREEN}/plugin marketplace remove ccprompts-test${NC}"
echo ""

success "Local testing setup complete!"
echo ""

# Optional: Offer to open Claude Code
read -p "Open Claude Code now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Starting Claude Code..."
    if command -v claude >/dev/null 2>&1; then
        claude || warning "Could not start Claude Code. Please start it manually."
    else
        error "'claude' command not found. Please ensure Claude Code is installed and in your PATH."
    fi
fi
