const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CodeExecutionService {
  constructor() {
    this.supportedLanguages = {
      javascript: {
        extension: 'js',
        command: 'node',
        timeout: 5000 // 5 seconds
      },
      python: {
        extension: 'py',
        command: 'python',
        timeout: 5000
      },
      java: {
        extension: 'java',
        command: 'java',
        timeout: 10000
      },
      cpp: {
        extension: 'cpp',
        command: 'g++',
        timeout: 5000
      }
    };

    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  async executeCode(code, language) {
    if (!this.supportedLanguages[language]) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const fileId = uuidv4();
    const { extension, command, timeout } = this.supportedLanguages[language];
    const fileName = `${fileId}.${extension}`;
    const filePath = path.join(this.tempDir, fileName);

    try {
      // Write code to temporary file
      await fs.writeFile(filePath, code);

      // Execute code based on language
      let output = '';
      switch (language) {
        case 'javascript':
          output = await this.executeJavaScript(filePath, timeout);
          break;
        case 'python':
          output = await this.executePython(filePath, timeout);
          break;
        case 'java':
          output = await this.executeJava(filePath, code, timeout);
          break;
        case 'cpp':
          output = await this.executeCpp(filePath, timeout);
          break;
      }

      return { output };
    } catch (error) {
      return { error: error.message };
    } finally {
      // Cleanup temporary files
      try {
        await fs.unlink(filePath);
        if (language === 'java') {
          const classFile = path.join(this.tempDir, `${fileId}.class`);
          await fs.unlink(classFile).catch(() => {});
        } else if (language === 'cpp') {
          const execFile = path.join(this.tempDir, `${fileId}.exe`);
          await fs.unlink(execFile).catch(() => {});
        }
      } catch (error) {
        console.error('Error cleaning up temporary files:', error);
      }
    }
  }

  executeCommand(command, timeout) {
    return new Promise((resolve, reject) => {
      const process = exec(command, {
        timeout,
        maxBuffer: 1024 * 1024 // 1MB output limit
      });

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data;
      });

      process.stderr.on('data', (data) => {
        error += data;
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(error || 'Execution failed'));
        }
      });

      process.on('error', (err) => {
        reject(err);
      });
    });
  }

  async executeJavaScript(filePath, timeout) {
    return this.executeCommand(`${this.supportedLanguages.javascript.command} ${filePath}`, timeout);
  }

  async executePython(filePath, timeout) {
    return this.executeCommand(`${this.supportedLanguages.python.command} ${filePath}`, timeout);
  }

  async executeJava(filePath, code, timeout) {
    // Extract class name from code
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    if (!classMatch) {
      throw new Error('No public class found in Java code');
    }
    const className = classMatch[1];

    // Compile and run
    await this.executeCommand(`javac ${filePath}`);
    return this.executeCommand(`java -cp ${this.tempDir} ${className}`, timeout);
  }

  async executeCpp(filePath, timeout) {
    const outputFile = filePath.replace('.cpp', '.exe');
    await this.executeCommand(`${this.supportedLanguages.cpp.command} ${filePath} -o ${outputFile}`);
    return this.executeCommand(outputFile, timeout);
  }
}

module.exports = new CodeExecutionService();