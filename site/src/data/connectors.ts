// MCP and connectors: how agents reach outside systems. Per-harness config
// paths are in harnesses.ts.
import { fact } from './types.ts';

export const connectors = {
  mcp: {
    definition: fact(
      'an open-source standard for connecting AI applications to external systems',
      'The Model Context Protocol describes itself as "an open-source standard for connecting AI applications to external systems".',
      'https://modelcontextprotocol.io/',
    ),
    transports: fact(
      ['stdio', 'streamable HTTP'],
      'An MCP server runs either as a local process the agent starts (stdio) or at an address it connects to (streamable HTTP).',
      'https://learn.chatgpt.com/docs/extend/mcp',
    ),
  },
  claudeCode: {
    toolSearch: fact(
      'deferred',
      'In Claude Code, MCP tool definitions are deferred by default: only tool names and server instructions enter context until a tool is used.',
      'https://code.claude.com/docs/en/costs',
    ),
    cliCheaper: fact(
      'CLI tools are more context-efficient',
      'Anthropic notes that command-line tools such as gh, aws, gcloud and sentry-cli are still more context-efficient than MCP servers, because they add no per-tool listing.',
      'https://code.claude.com/docs/en/costs',
    ),
    scopes: fact(
      ['local', 'project', 'user'],
      'Claude Code has three MCP scopes: local (the default, this project only), project (shared through .mcp.json) and user (all your projects).',
      'https://code.claude.com/docs/en/mcp',
    ),
  },
  t3code: {
    server: fact(
      true,
      'T3 Code runs an MCP server per environment, so agents it did not start (Claude Code or Codex in your own terminal, ChatGPT, MCP-capable bots) can work with it.',
      'https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md',
    ),
  },
} as const;
