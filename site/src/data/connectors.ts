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

  // Added for the connectors explainer (/explain/connectors/).
  protocol: {
    analogy: fact(
      'a USB-C port for AI applications',
      'The MCP documentation compares MCP to "a USB-C port for AI applications": one standard way to connect them to outside systems.',
      'https://modelcontextprotocol.io/docs/getting-started/intro',
    ),
    primitives: fact(
      ['tools', 'resources', 'prompts'],
      'An MCP server offers three kinds of thing: tools, which the model decides to call; resources, which the application reads in as context; and prompts, which the user invokes.',
      'https://modelcontextprotocol.io/docs/learn/server-concepts',
    ),
    specVersion: fact('2026-07-28', 'The current version of the MCP specification is dated 28 July 2026.', 'https://modelcontextprotocol.io/docs/learn/server-concepts', { unit: 'date' }),
    tsSdk: fact(
      '@modelcontextprotocol/server',
      'The official TypeScript SDK for writing an MCP server is the @modelcontextprotocol/server package (version 2), which implements the 2026-07-28 specification.',
      'https://github.com/modelcontextprotocol/typescript-sdk',
    ),
    registry: fact('registry.modelcontextprotocol.io', 'The official MCP Registry, at registry.modelcontextprotocol.io, lists public MCP servers.', 'https://registry.modelcontextprotocol.io/'),
  },
  claudeCodeMcp: {
    add: fact(
      'claude mcp add',
      'In Claude Code, add a remote server with claude mcp add --transport http <name> <url> and a local one with claude mcp add <name> -- <command>. Sign in to a server that needs it through /mcp.',
      'https://code.claude.com/docs/en/mcp',
    ),
    sseDeprecated: fact(true, 'Claude Code treats the older SSE transport as deprecated and recommends HTTP servers where available.', 'https://code.claude.com/docs/en/mcp'),
    projectApproval: fact(
      true,
      'Claude Code asks before it uses servers from a project\'s .mcp.json in an interactive session. Non-interactive runs (claude -p, the Agent SDK) load them without asking.',
      'https://code.claude.com/docs/en/mcp',
    ),
    outputLimit: fact(25000, 'Claude Code caps an MCP tool result at 25,000 tokens by default (MAX_MCP_OUTPUT_TOKENS changes it) and warns when a result passes 10,000.', 'https://code.claude.com/docs/en/mcp', { unit: 'tokens' }),
    toolSearchModes: fact(
      ['unset or true: deferred', 'auto', 'auto:N', 'false'],
      'ENABLE_TOOL_SEARCH controls deferral in Claude Code: unset or true defers every MCP tool; auto loads tools up front while their definitions take under 10% of the context window; auto:N sets that percentage; false loads everything up front.',
      'https://code.claude.com/docs/en/mcp',
    ),
    descriptionLimit: fact(
      4096,
      'Claude Code cuts server instructions and up-front tool descriptions at 4,096 characters, and descriptions loaded through tool search at 16,384.',
      'https://code.claude.com/docs/en/mcp',
    ),
    resourcesAndPrompts: fact(
      '@server:protocol://path, /server:prompt',
      'In Claude Code, MCP resources are pulled in with @ mentions (@server:protocol://resource/path) and MCP prompts appear as commands (/servername:promptname).',
      'https://code.claude.com/docs/en/mcp',
    ),
    trust: fact(
      'verify you trust each server',
      'Claude Code\'s docs: "Verify you trust each server before connecting it. Servers that fetch external content can expose you to prompt injection risk."',
      'https://code.claude.com/docs/en/mcp',
    ),
    directory: fact(
      'reviewed, not audited',
      'Anthropic reviews connectors against its listing criteria before adding them to the Anthropic Directory (claude.ai/directory), but does not security-audit or manage any MCP server.',
      'https://code.claude.com/docs/en/security',
    ),
    serve: fact('claude mcp serve', 'claude mcp serve runs Claude Code itself as a stdio MCP server that other applications can connect to.', 'https://code.claude.com/docs/en/mcp'),
  },
  codexMcp: {
    add: fact(
      'codex mcp add',
      'In Codex, add a local server with codex mcp add <name> -- <command> or a remote one with codex mcp add <name> --url <url>, sign in with codex mcp login <name>, and list active servers with /mcp.',
      'https://learn.chatgpt.com/docs/extend/mcp',
    ),
    toolFilters: fact(
      ['enabled_tools', 'disabled_tools'],
      'A Codex MCP server entry can allow or block individual tools (enabled_tools, disabled_tools) and set an approval mode per tool.',
      'https://learn.chatgpt.com/docs/extend/mcp',
    ),
    timeouts: fact(
      10,
      'By default Codex waits 10 seconds for an MCP server to start (startup_timeout_sec) and 60 seconds for a tool call (tool_timeout_sec).',
      'https://learn.chatgpt.com/docs/extend/mcp',
    ),
    plugins: fact('plugins', 'OpenAI packages MCP connections for ChatGPT as plugins, which can also bundle skills.', 'https://learn.chatgpt.com/docs/extend/mcp'),
  },
  t3codeMore: {
    harnessConfig: fact(
      "uses the harness's configuration",
      "T3 Code uses Claude Code's login and configuration; on a remote connection, the Claude configuration on the connected server.",
      'https://github.com/pingdotgg/t3code/blob/main/docs/user/providers-claude.md',
    ),
    access: fact(
      ['Read only', 'Supervised', 'Full access'],
      'When an outside agent first signs in to a T3 Code environment, you approve it and choose its access level (Read only, Supervised or Full access). Sign-ins last 30 days and can be revoked in Settings.',
      'https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md',
    ),
  },
  servers: {
    playwright: fact(
      '@playwright/mcp',
      'Playwright MCP, from Microsoft, lets an agent drive a real browser through Playwright. Apache-2.0.',
      'https://github.com/microsoft/playwright-mcp',
    ),
    chromeDevtools: fact(
      'chrome-devtools-mcp',
      'Chrome DevTools MCP lets a coding agent inspect and debug a live Chrome. Its README warns that it exposes the browser\'s content to the MCP client.',
      'https://github.com/ChromeDevTools/chrome-devtools-mcp',
    ),
    github: fact(
      'api.githubcopilot.com/mcp/',
      'GitHub\'s MCP server connects agents to GitHub (issues, pull requests, code). It is hosted at api.githubcopilot.com/mcp/, and a --read-only flag leaves out every write tool. MIT.',
      'https://github.com/github/github-mcp-server',
    ),
    linear: fact('mcp.linear.app/mcp', 'Linear\'s MCP server, at mcp.linear.app/mcp, gives an agent access to your Linear issues and projects.', 'https://linear.app/docs/mcp'),
    supabase: fact(
      'mcp.supabase.com/mcp',
      'Supabase\'s MCP server, at mcp.supabase.com/mcp, can run SQL, apply migrations and read logs. Adding ?read_only=true runs every query as a read-only database user.',
      'https://supabase.com/docs/guides/getting-started/mcp',
    ),
    figma: fact('mcp.figma.com/mcp', 'Figma\'s remote MCP server, at mcp.figma.com/mcp, brings Figma designs into an agent\'s work.', 'https://developers.figma.com/docs/figma-mcp-server/'),
  },
} as const;
