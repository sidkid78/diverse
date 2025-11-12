/**
 * Integration of enhanced file system tools with the dynamic agent orchestrator.
 *
 * This module provides a unified interface for AI agents to interact with file system
 * operations, command execution, and project management tools. All tools are exposed
 * as Gemini API Tool objects for seamless integration with Google's Generative AI.
 *
 * Key Features:
 *   - File operations (create, read, update, delete)
 *   - Directory management
 *   - Project structure creation
 *   - Bash command execution
 *   - Git operations
 *   - File search (grep and glob patterns)
 *   - Batch operations for parallel task execution
 *   - Optional Google Search grounding integration
 *
 * @example
 * ```typescript
 * const manager = new AgentToolsManager("./my_workspace");
 * const tools = manager.getToolDeclarations();
 * const result = await manager.executeTool("create_file", {
 *   path: "hello.ts",
 *   content: "console.log('Hello, World!');"
 * });
 * ```
 */

import { Tool, Type } from '@google/genai';
import { FileSystemTools, type ProjectStructure } from './file-system-tools';

// =========================================================================
// Type Definitions
// =========================================================================

interface ToolExecutionLog {
  tool: string;
  arguments: Record<string, unknown>;
  result: unknown;
  timestamp: string;
}

interface ToolExecutionResult {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

// =========================================================================
// AgentToolsManager Class
// =========================================================================

/**
 * Manages all tools available to AI agents.
 *
 * This class serves as the central hub for tool management, providing:
 * - Tool declaration generation for Gemini API
 * - Tool execution with error handling
 * - Execution logging for debugging and auditing
 */
export class AgentToolsManager {
  private fsTools: FileSystemTools;
  private toolExecutionLog: ToolExecutionLog[] = [];

  /**
   * Initialize the Agent Tools Manager.
   *
   * @param workspaceRoot - Root directory for workspace operations
   */
  constructor(workspaceRoot: string = process.env.AGENT_WORKSPACE_ROOT || './agent_workspace') {
    this.fsTools = new FileSystemTools(workspaceRoot);
    console.log('✓ Agent Tools Manager initialized');
  }

  /**
   * Get tool declarations for the Gemini API.
   *
   * Generates a list of Tool objects containing function declarations for all
   * available operations. These declarations define the interface that AI agents
   * use to interact with the system.
   *
   * @param includeSearch - If true, includes Google Search grounding tool.
   *                        Note: Some models do not support mixing function calling
   *                        with search grounding in the same request.
   * @returns List of Tool objects containing function declarations
   *          and optionally the Google Search tool.
   *
   * @note All function declarations include detailed parameter schemas with:
   *       - Type information
   *       - Descriptions for AI understanding
   *       - Required vs optional parameters
   *       - Enum constraints where applicable
   */
  getToolDeclarations(includeSearch: boolean = false): Tool[] {
    // Create all function declarations
    const functionDeclarations: types.FunctionDeclaration[] = [
      // =========================================================
      // File Operations
      // =========================================================
      {
        name: 'create_file',
        description:
          'Create a new file with content. Use this to write code files, configuration files, documentation, etc.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description:
                "File path relative to workspace (e.g., 'src/main.ts')",
            },
            content: {
              type: types.Type.STRING,
              description: 'Complete file content to write',
            },
            overwrite: {
              type: types.Type.BOOLEAN,
              description: 'Whether to overwrite if file exists',
            },
          },
          required: ['path', 'content'],
        },
      },

      {
        name: 'read_file',
        description: 'Read the contents of an existing file',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description: 'File path relative to workspace',
            },
          },
          required: ['path'],
        },
      },

      {
        name: 'update_file',
        description:
          'Update an existing file (replace, append, or prepend content)',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description: 'File path relative to workspace',
            },
            content: {
              type: types.Type.STRING,
              description: 'Content to add/replace',
            },
            mode: {
              type: types.Type.STRING,
              enum: ['replace', 'append', 'prepend'],
              description: 'How to update the file',
            },
          },
          required: ['path', 'content'],
        },
      },

      {
        name: 'delete_file',
        description: 'Delete a file',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description: 'File path relative to workspace',
            },
          },
          required: ['path'],
        },
      },

      // =========================================================
      // Directory Operations
      // =========================================================
      {
        name: 'create_directory',
        description: 'Create a new directory',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description: 'Directory path relative to workspace',
            },
            parents: {
              type: types.Type.BOOLEAN,
              description: 'Create parent directories if needed',
            },
          },
          required: ['path'],
        },
      },

      {
        name: 'list_directory',
        description: 'List contents of a directory',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description: 'Directory path relative to workspace',
            },
            recursive: {
              type: types.Type.BOOLEAN,
              description: 'List recursively',
            },
            include_hidden: {
              type: types.Type.BOOLEAN,
              description: 'Include hidden files',
            },
          },
        },
      },

      // =========================================================
      // Project Structure
      // =========================================================
      {
        name: 'create_project_structure',
        description:
          'Create a complete project structure with multiple directories and files at once',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            project_name: {
              type: types.Type.STRING,
              description: 'Name of the project',
            },
            structure: {
              type: types.Type.OBJECT,
              description:
                "Project structure with 'directories' and 'files'",
            },
          },
          required: ['project_name', 'structure'],
        },
      },

      {
        name: 'get_project_tree',
        description: 'Get a tree view of the project structure',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description: 'Root path for tree view',
            },
            max_depth: {
              type: types.Type.INTEGER,
              description: 'Maximum depth to traverse',
            },
          },
        },
      },

      {
        name: 'get_file_info',
        description: 'Get detailed information about a file',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            path: {
              type: types.Type.STRING,
              description: 'File path relative to workspace',
            },
          },
          required: ['path'],
        },
      },

      // =========================================================
      // Bash Command Execution
      // =========================================================
      {
        name: 'bash',
        description: 'Execute a bash command',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            command: {
              type: types.Type.STRING,
              description: 'Shell command to execute',
            },
            path: {
              type: types.Type.STRING,
              description: 'Working directory for the command',
            },
            timeout: {
              type: types.Type.INTEGER,
              description: 'Command timeout in seconds',
            },
          },
          required: ['command'],
        },
      },

      // =========================================================
      // Git Operations
      // =========================================================
      {
        name: 'git_operations',
        description: 'Perform git operations',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            operation: {
              type: types.Type.STRING,
              description:
                'Git operation (init, status, add, commit, push, pull, etc.)',
            },
            args: {
              type: types.Type.STRING,
              description: 'Space-separated arguments for the git command',
            },
            path: {
              type: types.Type.STRING,
              description: 'Repository path',
            },
          },
          required: ['operation'],
        },
      },

      // =========================================================
      // Grep File Search
      // =========================================================
      {
        name: 'grep_files',
        description: 'Search for a pattern in files',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            pattern: {
              type: types.Type.STRING,
              description: 'Search pattern (regex)',
            },
            full_search_path: {
              type: types.Type.STRING,
              description: 'Path to search in',
            },
            recursive: {
              type: types.Type.BOOLEAN,
              description: 'Whether to search recursively',
            },
            ignore_case: {
              type: types.Type.BOOLEAN,
              description: 'Case-insensitive search',
            },
            max_results: {
              type: types.Type.INTEGER,
              description: 'Maximum number of results',
            },
          },
          required: ['pattern'],
        },
      },

      // =========================================================
      // Glob Search
      // =========================================================
      {
        name: 'glob_search',
        description: 'Find files matching a glob pattern',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            pattern: {
              type: types.Type.STRING,
              description: "Glob pattern (e.g., '*.ts', '**/*.json')",
            },
            path: {
              type: types.Type.STRING,
              description: 'Path to search in',
            },
            recursive: {
              type: types.Type.BOOLEAN,
              description: 'Search recursively',
            },
          },
          required: ['pattern'],
        },
      },

      // =========================================================
      // Batch Operations
      // =========================================================
      {
        name: 'execute_batch',
        description: 'Execute multiple tasks in parallel',
        parameters: {
          type: types.Type.OBJECT,
          properties: {
            tasks: {
              type: types.Type.STRING,
              description: 'JSON string with list of task objects',
            },
            allowed_tools: {
              type: types.Type.ARRAY,
              items: { type: types.Type.STRING },
              description: 'List of allowed tools',
            },
            full_search_path: {
              type: types.Type.STRING,
              description: 'Default path for operations',
            },
            max_workers: {
              type: types.Type.INTEGER,
              description: 'Maximum parallel workers',
            },
          },
          required: ['tasks'],
        },
      },
    ];

    // Wrap all function declarations in a Tool object
    const tools: types.Tool[] = [{ functionDeclarations }];

    if (includeSearch) {
      tools.push({ googleSearch: {} });
    }

    return tools;
  }

  /**
   * Execute a tool with given arguments.
   *
   * @param toolName - Name of the tool to execute
   * @param args - Arguments for the tool
   * @returns Result of the tool execution
   */
  async executeTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<ToolExecutionResult> {
    // Map tool names to FileSystemTools methods
    const toolMap: Record<string, (...args: unknown[]) => Promise<ToolExecutionResult>> = {
      create_file: (...a) =>
        this.fsTools.createFile(String(a[0]), String(a[1] ?? ''), Boolean(a[2])),
      read_file: (...a) => this.fsTools.readFile(String(a[0])),
      update_file: (...a) =>
        this.fsTools.updateFile(
          String(a[0]),
          String(a[1] ?? ''),
          ((a[2] as 'replace' | 'append' | 'prepend') ?? 'replace')
        ),
      delete_file: (...a) => this.fsTools.deleteFile(String(a[0])),
      create_directory: (...a) =>
        this.fsTools.createDirectory(String(a[0]), a[1] === undefined ? true : Boolean(a[1])),
      list_directory: (...a) =>
        this.fsTools.listDirectory(
          String(a[0] ?? '.'),
          a[1] === undefined ? false : Boolean(a[1]),
          a[2] === undefined ? false : Boolean(a[2])
        ),
      create_project_structure: (...a) =>
        this.fsTools.createProjectStructure(String(a[0]), a[1] as ProjectStructure),
      get_project_tree: (...a) =>
        this.fsTools.getProjectTree(String(a[0] ?? '.'), a[1] === undefined ? 5 : Number(a[1])),
      get_file_info: (...a) => this.fsTools.getFileInfo(String(a[0])),
      bash: (...a) =>
        this.fsTools.bash(String(a[0]), String(a[1] ?? '.'), a[2] === undefined ? 30000 : Number(a[2])),
      git_operations: (...a) =>
        this.fsTools.gitOperations(String(a[0]), String(a[1] ?? ''), String(a[2] ?? '.')),
      grep_files: (...a) =>
        this.fsTools.grepFiles(
          String(a[0]),
          String(a[1] ?? '.'),
          a[2] === undefined ? true : Boolean(a[2]),
          a[3] === undefined ? false : Boolean(a[3]),
          a[4] === undefined ? 100 : Number(a[4])
        ),
      glob_search: (...a) =>
        this.fsTools.globSearch(String(a[0]), String(a[1] ?? '.'), a[2] === undefined ? true : Boolean(a[2])),
      execute_batch: (...a) =>
        this.fsTools.executeBatch(
          String(a[0]),
          Array.isArray(a[1]) ? (a[1] as string[]) : undefined,
          String(a[2] ?? '.'),
          a[3] === undefined ? 4 : Number(a[3])
        ),
    };

    if (!(toolName in toolMap)) {
      return {
        success: false,
        error: `Unknown tool: ${toolName}`,
      };
    }

    try {
      // Execute the tool with provided arguments
      const handler = toolMap[toolName];
      const rawResult = await handler(...Object.values(args));
      const result = rawResult as ToolExecutionResult;

      // Log the execution
      this.toolExecutionLog.push({
        tool: toolName,
        arguments: args,
        result,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Tool execution failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Get the absolute workspace path.
   *
   * @returns The absolute path to the workspace directory
   */
  getWorkspacePath(): string {
    return this.fsTools['workspaceRoot']; // Access private property
  }

  /**
   * Get the tool execution log.
   *
   * @returns Array of all tool executions with timestamps
   */
  getToolExecutionLog(): ToolExecutionLog[] {
    return this.toolExecutionLog;
  }

  /**
   * Clear the tool execution log.
   */
  clearToolExecutionLog(): void {
    this.toolExecutionLog = [];
  }

  /**
   * Save the tool execution log to a file.
   *
   * @param filename - Name of the file to save the log to
   * @returns Result of the save operation
   */
  async saveToolExecutionLog(
    filename: string = 'tool_execution_log.json'
  ): Promise<ToolExecutionResult> {
    try {
      const result = await this.fsTools.createFile(
        filename,
        JSON.stringify(this.toolExecutionLog, null, 2),
        true
      );

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

// Export default instance creator
export default AgentToolsManager;