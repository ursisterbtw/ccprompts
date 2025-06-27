#!/usr/bin/env node

/**
 * Test script for CommandRegistry
 * Demonstrates registry functionality with real data
 */

const CommandRegistry = require('./CommandRegistry');

async function testRegistry() {
  try {
    console.log('🧪 Testing Command Registry\n');
    
    const registry = new CommandRegistry();
    
    // Test 1: Get all commands
    console.log('📋 All Commands by Phase:');
    const allCommands = registry.getAllCommands();
    Object.entries(allCommands).forEach(([phase, data]) => {
      console.log(`  ${phase}: ${data.count} commands`);
      console.log(`    ${data.commands.join(', ')}`);
    });
    
    // Test 2: Get specific command
    console.log('\n🔍 Command Details:');
    const bootstrapCmd = registry.getCommand('bootstrap-project');
    if (bootstrapCmd) {
      console.log(`  Name: ${bootstrapCmd.name}`);
      console.log(`  Phase: ${bootstrapCmd.phase}`);
      console.log(`  Description: ${bootstrapCmd.description}`);
      console.log(`  Complexity: ${bootstrapCmd.complexity}`);
      console.log(`  Time: ${bootstrapCmd.estimated_time}`);
    }
    
    // Test 3: Search commands
    console.log('\n🔎 Search Results for "security":');
    const searchResults = registry.searchCommands('security');
    searchResults.forEach(cmd => {
      console.log(`  ${cmd.name} (${cmd.phase}) - ${cmd.description}`);
    });
    
    // Test 4: Parameter validation
    console.log('\n✅ Parameter Validation:');
    const validation = registry.validateCommandParameters('bootstrap-project', {
      type: 'web-app',
      technology: 'typescript',
      deployment: 'cloud'
    });
    console.log(`  Valid: ${validation.valid}`);
    if (!validation.valid) {
      console.log(`  Errors: ${validation.errors.join(', ')}`);
    }
    
    // Test 5: Registry statistics
    console.log('\n📊 Registry Statistics:');
    const stats = registry.getRegistryStats();
    console.log(`  Total Commands: ${stats.total_commands}`);
    console.log(`  Complexity Distribution:`);
    console.log(`    Low: ${stats.complexity_distribution.low}`);
    console.log(`    Medium: ${stats.complexity_distribution.medium}`);
    console.log(`    High: ${stats.complexity_distribution.high}`);
    console.log(`  Average Time: ${stats.average_time} minutes`);
    
    console.log('\n✅ Command Registry test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testRegistry();
}

module.exports = testRegistry;