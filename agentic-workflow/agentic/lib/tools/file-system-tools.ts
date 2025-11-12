/**
 * Comprehensive File System and Development Tools for Agent-Based Software Development
 * 
 * Provides file operations, git, bash execution, search tools, and parallel batch operations
 * for AI agents to build, modify, and manage software projects.
 * 
 * All operations are safe and sandboxed to a workspace directory.
 */

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { glob } from 'glob';

const execAsync = promisify(exec);

// =========================================================================
// Type Definitions
// =========================================================================

interface OperationResult {
  success: boolean;
  error?: string;
  // Allow arbitrary extra fields from different operations without narrowing
  [key: string]: unknown;
}

interface FileResult extends OperationResult {
  path?: string;
  content?: string;
  size?: number;
  lines?: number;
}

interface DirectoryItem {
  path: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
}

interface DirectoryResult extends OperationResult {
  path?: string;
  items?: DirectoryItem[];
  count?: number;
}

interface BashResult extends OperationResult {
  command?: string;
  stdout?: string;
  stderr?: string;
  return_code?: number;
}

interface GrepMatch {
  file: string;
  line: number;
  content: string;
}

interface GrepResult extends OperationResult {
  pattern?: string;
  matches?: GrepMatch[];
  count?: number;
  method?: string;
}

export interface ProjectStructure {
  directories?: string[];
  files?: Record<string, string>;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: TreeNode[];
}

interface BatchTask {
  operation: string;
  args: Record<string, string | number | boolean>;
}

interface BatchResult extends OperationResult {
  results?: Array<OperationResult & { task: BatchTask }> | undefined;
  total_tasks?: number;
  successes?: number;
  failures?: number;
}

interface OperationLog {
  timestamp: string;
  operation: string;
  [key: string]: string | number | boolean | undefined;
}

// =========================================================================
// Main FileSystemTools Class
// =========================================================================

export class FileSystemTools {
  private workspaceRoot: string;
  private operationsLog: OperationLog[] = [];

  /**
   * Initialize file system tools with a workspace root.
   * 
   * @param workspaceRoot - Root directory for all operations
   */
  constructor(workspaceRoot: string = process.env.AGENT_WORKSPACE_ROOT || './agent_workspace') {
    this.workspaceRoot = path.resolve(workspaceRoot);
    
    // Ensure workspace exists
    if (!fsSync.existsSync(this.workspaceRoot)) {
      fsSync.mkdirSync(this.workspaceRoot, { recursive: true });
    }

    console.log('✓ File System Tools initialized');
    console.log(`  Workspace: ${this.workspaceRoot}`);
  }

  /**
   * Resolve a path within the workspace (security check).
   */
  private resolvePath(filePath: string): string {
    const fullPath = path.resolve(this.workspaceRoot, filePath);

    // Security: Ensure path is within workspace
    if (!fullPath.startsWith(this.workspaceRoot)) {
      throw new Error(
        `Security error: Path '${filePath}' attempts to escape workspace`
      );
    }

    return fullPath;
  }

  /**
   * Log an operation for tracking.
   */
  private logOperation(operation: string, details: Record<string, unknown>): void {
    this.operationsLog.push({
      timestamp: new Date().toISOString(),
      operation,
      ...details,
    });
  }

  // =========================================================================
  // Core File Operations
  // =========================================================================

  /**
   * Create a new file with content.
   */
  async createFile(
    filePath: string,
    content: string,
    overwrite: boolean = false
  ): Promise<FileResult> {
    try {
      const fullPath = this.resolvePath(filePath);

      if (fsSync.existsSync(fullPath) && !overwrite) {
        return {
          success: false,
          error: `File already exists: ${filePath}`,
          path: fullPath,
        };
      }

      // Ensure parent directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, 'utf-8');

      this.logOperation('create_file', {
        path: filePath,
        size: content.length,
      });

      return {
        success: true,
        path: fullPath,
        size: content.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Read file contents.
   */
  async readFile(filePath: string): Promise<FileResult> {
    try {
      const fullPath = this.resolvePath(filePath);

      if (!fsSync.existsSync(fullPath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      const content = await fs.readFile(fullPath, 'utf-8');

      return {
        success: true,
        path: fullPath,
        content,
        size: content.length,
        lines: content.split('\n').length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Update an existing file.
   */
  async updateFile(
    filePath: string,
    content: string,
    mode: 'replace' | 'append' | 'prepend' = 'replace'
  ): Promise<FileResult> {
    try {
      const fullPath = this.resolvePath(filePath);

      if (!fsSync.existsSync(fullPath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      let finalContent = content;

      if (mode === 'append') {
        const existing = await fs.readFile(fullPath, 'utf-8');
        finalContent = existing + content;
      } else if (mode === 'prepend') {
        const existing = await fs.readFile(fullPath, 'utf-8');
        finalContent = content + existing;
      } else if (mode !== 'replace') {
        return {
          success: false,
          error: `Invalid mode: ${mode}`,
        };
      }

      await fs.writeFile(fullPath, finalContent, 'utf-8');

      this.logOperation('update_file', { path: filePath, mode });

      return {
        success: true,
        path: fullPath,
        mode,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Delete a file.
   */
  async deleteFile(filePath: string): Promise<OperationResult> {
    try {
      const fullPath = this.resolvePath(filePath);

      if (!fsSync.existsSync(fullPath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      await fs.unlink(fullPath);
      this.logOperation('delete_file', { path: filePath });

      return {
        success: true,
        path: fullPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Create a directory.
   */
  async createDirectory(
    dirPath: string,
    parents: boolean = true
  ): Promise<OperationResult> {
    try {
      const fullPath = this.resolvePath(dirPath);
      await fs.mkdir(fullPath, { recursive: parents });
      this.logOperation('create_directory', { path: dirPath });

      return {
        success: true,
        path: fullPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * List directory contents.
   */
  async listDirectory(
    dirPath: string = '.',
    recursive: boolean = false,
    includeHidden: boolean = false
  ): Promise<DirectoryResult> {
    try {
      const fullPath = this.resolvePath(dirPath);

      if (!fsSync.existsSync(fullPath)) {
        return {
          success: false,
          error: `Directory not found: ${dirPath}`,
        };
      }

      const stat = await fs.stat(fullPath);
      if (!stat.isDirectory()) {
        return {
          success: false,
          error: `Not a directory: ${dirPath}`,
        };
      }

      const items: DirectoryItem[] = [];
      const pattern = recursive ? '**/*' : '*';
      const files = await glob(pattern, {
        cwd: fullPath,
        dot: includeHidden,
        absolute: true,
      });

      for (const file of files) {
        if (!includeHidden && path.basename(file).startsWith('.')) {
          continue;
        }

        const relPath = path.relative(this.workspaceRoot, file);
        const fileStat = await fs.stat(file);

        items.push({
          path: relPath,
          name: path.basename(file),
          type: fileStat.isDirectory() ? 'directory' : 'file',
          size: fileStat.isFile() ? fileStat.size : undefined,
        });
      }

      return {
        success: true,
        path: fullPath,
        items,
        count: items.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Create a complete project structure from a specification.
   */
  async createProjectStructure(
    projectName: string,
    structure: ProjectStructure
  ): Promise<OperationResult> {
    try {
      const createdItems: Array<{ type: string; path: string }> = [];

      // Create directories
      if (structure.directories) {
        for (const dir of structure.directories) {
          const fullDir = `${projectName}/${dir}`;
          const result = await this.createDirectory(fullDir);
          if (result.success) {
            createdItems.push({ type: 'directory', path: fullDir });
          }
        }
      }

      // Create files
      if (structure.files) {
        for (const [filePath, content] of Object.entries(structure.files)) {
          const fullFile = `${projectName}/${filePath}`;
          const result = await this.createFile(fullFile, content);
          if (result.success) {
            createdItems.push({ type: 'file', path: fullFile });
          }
        }
      }

      this.logOperation('create_project_structure', {
        project_name: projectName,
        items_created: createdItems.length,
      });

      return {
        success: true,
        project_name: projectName,
        created_items: createdItems,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get a tree view of the project structure.
   */
  async getProjectTree(
    dirPath: string = '.',
    maxDepth: number = 5
  ): Promise<OperationResult> {
    try {
      const fullPath = this.resolvePath(dirPath);

      const buildTree = async (
        currentPath: string,
        depth: number = 0
      ): Promise<TreeNode[]> => {
        if (depth >= maxDepth) {
          return [];
        }

        const items: TreeNode[] = [];
        try {
          const entries = await fs.readdir(currentPath, { withFileTypes: true });

          for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
            if (entry.name.startsWith('.')) {
              continue;
            }

            const fullEntryPath = path.join(currentPath, entry.name);
            const relPath = path.relative(this.workspaceRoot, fullEntryPath);

            const node: TreeNode = {
              name: entry.name,
              path: relPath,
              type: entry.isDirectory() ? 'directory' : 'file',
            };

            if (entry.isDirectory()) {
              node.children = await buildTree(fullEntryPath, depth + 1);
            } else {
              const stat = await fs.stat(fullEntryPath);
              node.size = stat.size;
            }

            items.push(node);
          }
        } catch {
          // Skip permission errors
        }

        return items;
      };

      const tree = await buildTree(fullPath);

      return {
        success: true,
        path: fullPath,
        tree,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get detailed information about a file.
   */
  async getFileInfo(filePath: string): Promise<OperationResult> {
    try {
      const fullPath = this.resolvePath(filePath);

      if (!fsSync.existsSync(fullPath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      const stat = await fs.stat(fullPath);

      const info: OperationResult = {
        success: true,
        path: fullPath,
        name: path.basename(fullPath),
        size: stat.size,
        created: stat.birthtime.toISOString(),
        modified: stat.mtime.toISOString(),
        is_file: stat.isFile(),
        is_directory: stat.isDirectory(),
      };

      if (stat.isFile()) {
        const content = await fs.readFile(fullPath, 'utf-8');
        info.lines = content.split('\n').length;
        info.extension = path.extname(fullPath);
      }

      return info;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // =========================================================================
  // Bash Command Execution
  // =========================================================================

  /**
   * Execute a bash command.
   */
  async bash(
    command: string,
    dirPath: string = '.',
    timeout: number = 30000
  ): Promise<BashResult> {
    try {
      // Use workspace root if path is "."
      const fullPath = dirPath === '.' ? this.workspaceRoot : this.resolvePath(dirPath);

      // Security: Prevent certain dangerous commands
      const dangerousPatterns = [
        /\brm\s+-rf\s+\//,
        /\bformat\b/,
        /\bmkfs\b/,
        /\bdd\b.*if=\/dev\//,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(command)) {
          return {
            success: false,
            error: `Dangerous command blocked: ${command}`,
          };
        }
      }

      // Execute command
      const { stdout, stderr } = await execAsync(command, {
        cwd: fullPath,
        timeout,
      });

      this.logOperation('bash', {
        command,
        path: dirPath,
        return_code: 0,
      });

      return {
        success: true,
        command,
        stdout,
        stderr,
        return_code: 0,
      };
    } catch (error: unknown) {
      // Narrow Node.js exec error shape
      const err = error as Partial<import('child_process').ExecException> & {
        stdout?: string;
        stderr?: string;
        code?: number | null;
        killed?: boolean;
        signal?: NodeJS.Signals | null;
        message?: string;
      };
      const isTimeout = Boolean(err?.killed) && err?.signal === 'SIGTERM';

      return {
        success: false,
        command,
        stdout: err?.stdout || '',
        stderr: err?.stderr || (typeof error === 'object' && error && 'message' in error ? String((error as unknown as { message?: string }).message) : String(error)),
        return_code: typeof err?.code === 'number' ? err.code : 1,
        error: isTimeout
          ? `Command timed out after ${timeout}ms`
          : (err?.message ?? String(error)),
      };
    }
  }

  // =========================================================================
  // Grep Search
  // =========================================================================

  /**
   * Search for a pattern in files using grep or fallback to TypeScript search.
   */
  async grepFiles(
    pattern: string,
    searchPath: string = '.',
    recursive: boolean = true,
    ignoreCase: boolean = false,
    maxResults: number = 100
  ): Promise<GrepResult> {
    try {
      const fullPath = this.resolvePath(searchPath);

      // Try system grep first (faster on Unix systems)
      try {
        return await this.systemGrep(
          pattern,
          fullPath,
          recursive,
          ignoreCase,
          maxResults
        );
      } catch {
        // Fall back to TypeScript grep
        return await this.typescriptGrep(
          pattern,
          fullPath,
          recursive,
          ignoreCase,
          maxResults
        );
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Use system grep command (faster on Unix systems).
   */
  private async systemGrep(
    pattern: string,
    searchPath: string,
    recursive: boolean,
    ignoreCase: boolean,
    maxResults: number
  ): Promise<GrepResult> {
    const cmd = ['grep', '-n']; // -n for line numbers

    if (recursive) {
      cmd.push('-r');
    }

    if (ignoreCase) {
      cmd.push('-i');
    }

    cmd.push(pattern);
    cmd.push(searchPath);

    const { stdout } = await execAsync(cmd.join(' '), { timeout: 30000 });

    // Parse grep output
    const matches: GrepMatch[] = [];
    const lines = stdout.split('\n').slice(0, maxResults);

    for (const line of lines) {
      const parts = line.split(':', 3);
      if (parts.length >= 3) {
        const filePath = parts[0];
        const lineNum = parseInt(parts[1], 10);
        const content = parts[2];

        matches.push({
          file: path.relative(this.workspaceRoot, filePath),
          line: lineNum,
          content: content.trim(),
        });
      }
    }

    return {
      success: true,
      pattern,
      matches,
      count: matches.length,
      method: 'system_grep',
    };
  }

  /**
   * TypeScript-based grep fallback.
   */
  private async typescriptGrep(
    pattern: string,
    searchPath: string,
    recursive: boolean,
    ignoreCase: boolean,
    maxResults: number
  ): Promise<GrepResult> {
    try {
      const flags = ignoreCase ? 'i' : '';
      const regex = new RegExp(pattern, flags);

      const matches: GrepMatch[] = [];

      // Determine which files to search
      const globPattern = recursive ? '**/*' : '*';
      const files = await glob(globPattern, {
        cwd: searchPath,
        absolute: true,
        nodir: true,
      });

      for (const file of files) {
        // Skip binary files
        const ext = path.extname(file);
        if (['.pyc', '.so', '.dll', '.exe', '.bin'].includes(ext)) {
          continue;
        }

        try {
          const content = await fs.readFile(file, 'utf-8');
          const lines = content.split('\n');

          for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            if (regex.test(lines[lineNum])) {
              const relPath = path.relative(this.workspaceRoot, file);

              matches.push({
                file: relPath,
                line: lineNum + 1,
                content: lines[lineNum].trim(),
              });

              if (matches.length >= maxResults) {
                break;
              }
            }
          }

          if (matches.length >= maxResults) {
            break;
          }
        } catch {
          // Skip files that can't be read
          continue;
        }
      }

      return {
        success: true,
        pattern,
        matches,
        count: matches.length,
        method: 'typescript_grep',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // =========================================================================
  // Git Operations
  // =========================================================================

  /**
   * Perform git operations.
   */
  async gitOperations(
    operation: string,
    args: string = '',
    dirPath: string = '.'
  ): Promise<BashResult> {
    try {
      // Use workspace root if path is "."
      const fullPath = dirPath === '.' ? this.workspaceRoot : this.resolvePath(dirPath);

      // Build git command
      const cmd = ['git', operation];

      // Add arguments
      if (args) {
        // Split arguments respecting quotes
        const argArray = args.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        cmd.push(...argArray.map(arg => arg.replace(/^"|"$/g, '')));
      }

      // Execute git command
      const { stdout, stderr } = await execAsync(cmd.join(' '), {
        cwd: fullPath,
        timeout: 30000,
      });

      this.logOperation('git_operations', {
        operation,
        args,
        return_code: 0,
      });

      return {
        success: true,
        operation,
        stdout,
        stderr,
        return_code: 0,
      };
    } catch (error: unknown) {
      // Narrow Node.js exec error shape
      const err = error as Partial<import('child_process').ExecException> & {
        stdout?: string;
        stderr?: string;
        code?: number | null;
        message?: string;
      };
      return {
        success: false,
        operation,
        stdout: err?.stdout || '',
        stderr:
          err?.stderr ||
          (typeof error === 'object' && error && 'message' in error
            ? String((error as { message?: string }).message)
            : String(error)),
        return_code: typeof err?.code === 'number' ? err.code : 1,
        error: err?.message ?? String(error),
      };
    }
  }

  // =========================================================================
  // Glob Search
  // =========================================================================

  /**
   * Find files matching a glob pattern.
   */
  async globSearch(
    pattern: string,
    searchPath: string = '.',
    recursive: boolean = true
  ): Promise<OperationResult> {
    try {
      // Use workspace root if path is "."
      const fullPath = searchPath === '.' ? this.workspaceRoot : this.resolvePath(searchPath);

      if (recursive && !pattern.startsWith('**/')) {
        pattern = `**/${pattern}`;
      }

      const files = await glob(pattern, {
        cwd: fullPath,
        absolute: true,
      });

      const matches: DirectoryItem[] = [];

      for (const file of files) {
        const relPath = path.relative(this.workspaceRoot, file);
        const stat = await fs.stat(file);

        matches.push({
          path: relPath,
          name: path.basename(file),
          type: stat.isDirectory() ? 'directory' : 'file',
          size: stat.isFile() ? stat.size : undefined,
        });
      }

      this.logOperation('glob_search', {
        pattern,
        path: searchPath,
        matches: matches.length,
      });

      return {
        success: true,
        pattern,
        matches,
        count: matches.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // =========================================================================
  // Batch Operations
  // =========================================================================

  /**
   * Execute multiple tasks in parallel.
   */
  async executeBatch(
    tasks: string,
    allowedTools?: string[],
    searchPath: string = '.',
    maxWorkers: number = 4
  ): Promise<BatchResult> {
    try {
      // Parse tasks JSON string
      const taskList: BatchTask[] = JSON.parse(tasks);

      if (!Array.isArray(taskList)) {
        return {
          success: false,
          error: 'Tasks must be a JSON string with a list of task objects',
        };
      }

      // Map operation names to methods
      const operationMap: Record<string, (...args: unknown[]) => Promise<OperationResult>> = {
        create_file: (...a) => this.createFile(String(a[0]), String(a[1] ?? ''), Boolean(a[2])),
        read_file: (...a) => this.readFile(String(a[0])),
        update_file: (...a) =>
          this.updateFile(
            String(a[0]),
            String(a[1] ?? ''),
            ((a[2] as 'replace' | 'append' | 'prepend') ?? 'replace')
          ),
        delete_file: (...a) => this.deleteFile(String(a[0])),
        create_directory: (...a) => this.createDirectory(String(a[0]), a[1] === undefined ? true : Boolean(a[1])),
        list_directory: (...a) =>
          this.listDirectory(
            String(a[0] ?? '.'),
            a[1] === undefined ? false : Boolean(a[1]),
            a[2] === undefined ? false : Boolean(a[2])
          ),
        bash: (...a) =>
          this.bash(String(a[0]), String(a[1] ?? '.'), a[2] === undefined ? 30000 : Number(a[2])),
        git_operations: (...a) =>
          this.gitOperations(String(a[0]), String(a[1] ?? ''), String(a[2] ?? '.')),
        grep_files: (...a) =>
          this.grepFiles(
            String(a[0]),
            String(a[1] ?? '.'),
            a[2] === undefined ? true : Boolean(a[2]),
            a[3] === undefined ? false : Boolean(a[3]),
            a[4] === undefined ? 100 : Number(a[4])
          ),
        glob_search: (...a) =>
          this.globSearch(String(a[0]), String(a[1] ?? '.'), a[2] === undefined ? true : Boolean(a[2])),
        get_file_info: (...a) => this.getFileInfo(String(a[0])),
        create_project_structure: (...a) => this.createProjectStructure(String(a[0]), a[1] as ProjectStructure),
        get_project_tree: (...a) =>
          this.getProjectTree(String(a[0] ?? '.'), a[1] === undefined ? 5 : Number(a[1])),
      };

      // Filter by allowed tools if specified
      const filteredOperations = allowedTools
        ? Object.fromEntries(
            Object.entries(operationMap).filter(([key]) =>
              allowedTools.includes(key)
            )
          )
        : operationMap;

      // Execute tasks in parallel with limited concurrency
      const results: Array<OperationResult & { task: BatchTask }> = [];
      const executing: Promise<void>[] = [];

      for (const task of taskList) {
        const promise = (async () => {
          const { operation, args } = task;

          // Add default path if not specified
          if (!args.path && !args.searchPath) {
            if (['grep_files'].includes(operation)) {
              args.searchPath = searchPath;
            } else if (['bash', 'git_operations', 'glob_search'].includes(operation)) {
              args.path = searchPath;
            }
          }

          if (!(operation in filteredOperations)) {
            results.push({
              task,
              success: false,
              error: `Unknown or disallowed operation: ${operation}`,
            });
            return;
          }

          try {
            const result = await filteredOperations[operation](...Object.values(args));
            results.push({
              task,
              ...result,
            });
          } catch (error) {
            results.push({
              task,
              success: false,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        })();

        executing.push(promise);

        // Limit concurrency
        if (executing.length >= maxWorkers) {
          await Promise.race(executing);
          executing.splice(
            executing.findIndex(p => p === promise),
            1
          );
        }
      }

      // Wait for remaining tasks
      await Promise.all(executing);

      // Count successes and failures
      const successes = results.filter(r => r.success).length;
      const failures = results.length - successes;

      this.logOperation('execute_batch', {
        total_tasks: taskList.length,
        successes,
        failures,
      });

      return {
        success: failures === 0,
        results,
        total_tasks: taskList.length,
        successes,
        failures,
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          success: false,
          error: 'Invalid JSON in tasks parameter',
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // =========================================================================
  // Operations Log
  // =========================================================================

  /**
   * Get all logged operations.
   */
  getOperationsLog(): OperationLog[] {
    return this.operationsLog;
  }

  /**
   * Save operations log to file.
   */
  async saveOperationsLog(filename: string = 'operations_log.json'): Promise<OperationResult> {
    try {
      const logPath = path.join(this.workspaceRoot, filename);

      await fs.writeFile(
        logPath,
        JSON.stringify(this.operationsLog, null, 2),
        'utf-8'
      );

      return {
        success: true,
        path: logPath,
        operations: this.operationsLog.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

// Export default instance
export default FileSystemTools;