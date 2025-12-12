# Conductor Agent Rules

This directory contains mode-specific rules and configurations for the Conductor agent.

## Purpose

The Conductor agent is the main orchestration agent that manages the complete development lifecycle:
- Planning phase coordination
- Implementation cycle management
- Review coordination
- Commit management

## Mode Configurations

Add mode-specific configuration files here to customize Conductor behavior for different scenarios:

### Example Modes
- **strict-mode**: Extra validation and quality checks at each phase
- **rapid-mode**: Streamlined workflow for quick iterations
- **documentation-mode**: Enhanced documentation generation at each phase
- **security-mode**: Additional security reviews and vulnerability scanning

## Configuration Format

Create mode configuration files as Markdown or YAML:
- `{mode-name}.md` - Markdown-based rules and instructions
- `{mode-name}.yaml` - Structured configuration parameters

## Usage

Reference these modes when invoking the Conductor agent to apply specific behaviors and workflows.
