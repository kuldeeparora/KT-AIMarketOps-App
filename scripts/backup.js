#!/usr/bin/env node

/**
 * 💾 Backup Script
 * Automated backup system for Kent Traders platform
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

class BackupManager {
  constructor() {
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.backupName = `kent-traders-backup-${this.timestamp}`;
  }

  async ensureBackupDirectory() {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${this.backupDir}`);
    }
  }

  async backupThemeFiles() {
    console.log('🎨 Backing up theme files...');
    
    const themeBackupPath = path.join(this.backupDir, `${this.backupName}-theme.zip`);
    
    return new Promise((resolve, reject) => {
      const output = require('fs').createWriteStream(themeBackupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        console.log(`✅ Theme backup completed: ${archive.pointer()} bytes`);
        resolve(themeBackupPath);
      });
      
      archive.on('error', reject);
      archive.pipe(output);
      
      // Add theme directories
      const themeDirs = ['layout', 'templates', 'sections', 'snippets', 'assets', 'locales'];
      themeDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (require('fs').existsSync(dirPath)) {
          archive.directory(dirPath, dir);
        }
      });
      
      archive.finalize();
    });
  }

  async backupConfiguration() {
    console.log('⚙️ Backing up configuration files...');
    
    const configFiles = [
      'package.json',
      'package-lock.json',
      '.env.example',
      '.eslintrc.json',
      '.prettierrc.json',
      '.stylelintrc.json',
      'lighthouserc.json',
      'ecosystem.config.json'
    ];
    
    const configBackupPath = path.join(this.backupDir, `${this.backupName}-config.zip`);
    
    return new Promise((resolve, reject) => {
      const output = require('fs').createWriteStream(configBackupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        console.log(`✅ Configuration backup completed: ${archive.pointer()} bytes`);
        resolve(configBackupPath);
      });
      
      archive.on('error', reject);
      archive.pipe(output);
      
      configFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        if (require('fs').existsSync(filePath)) {
          archive.file(filePath, { name: file });
        }
      });
      
      // Add important directories
      const importantDirs = ['.github', 'docs', 'scripts'];
      importantDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (require('fs').existsSync(dirPath)) {
          archive.directory(dirPath, dir);
        }
      });
      
      archive.finalize();
    });
  }

  async backupPlugins() {
    console.log('🔌 Backing up plugins...');
    
    const pluginsBackupPath = path.join(this.backupDir, `${this.backupName}-plugins.zip`);
    
    return new Promise((resolve, reject) => {
      const output = require('fs').createWriteStream(pluginsBackupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        console.log(`✅ Plugins backup completed: ${archive.pointer()} bytes`);
        resolve(pluginsBackupPath);
      });
      
      archive.on('error', reject);
      archive.pipe(output);
      
      // Add plugin directories
      const pluginDirs = ['plugins', 'core', 'customer-portal', 'admin-dashboard', 'shopify-smartops-ai'];
      pluginDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (require('fs').existsSync(dirPath)) {
          archive.directory(dirPath, dir, (data) => {
            // Exclude node_modules and build artifacts
            if (data.name.includes('node_modules') || 
                data.name.includes('dist') || 
                data.name.includes('.next')) {
              return false;
            }
            return data;
          });
        }
      });
      
      archive.finalize();
    });
  }

  async backupDatabase() {
    console.log('🗄️ Backing up database/logs...');
    
    const dbBackupPath = path.join(this.backupDir, `${this.backupName}-data.zip`);
    
    return new Promise((resolve, reject) => {
      const output = require('fs').createWriteStream(dbBackupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        console.log(`✅ Data backup completed: ${archive.pointer()} bytes`);
        resolve(dbBackupPath);
      });
      
      archive.on('error', reject);
      archive.pipe(output);
      
      // Add data directories
      const dataDirs = ['logs', 'test'];
      dataDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (require('fs').existsSync(dirPath)) {
          archive.directory(dirPath, dir);
        }
      });
      
      // Add test scripts and reports
      const testFiles = require('fs').readdirSync(path.join(__dirname, '..'))
        .filter(file => file.includes('test') && file.endsWith('.js'))
        .concat(['COMPLETE-TESTING-REPORT.md', 'DEPLOYMENT-GUIDE.md']);
      
      testFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        if (require('fs').existsSync(filePath)) {
          archive.file(filePath, { name: file });
        }
      });
      
      archive.finalize();
    });
  }

  async createGitBackup() {
    console.log('📦 Creating git repository backup...');
    
    try {
      const gitBackupPath = path.join(this.backupDir, `${this.backupName}-git.bundle`);
      execSync(`git bundle create "${gitBackupPath}" --all`, {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log(`✅ Git backup completed: ${gitBackupPath}`);
      return gitBackupPath;
    } catch (error) {
      console.warn('⚠️ Git backup failed:', error.message);
      return null;
    }
  }

  async generateBackupManifest(backupPaths) {
    const manifest = {
      timestamp: new Date().toISOString(),
      backupName: this.backupName,
      version: require('../package.json').version,
      files: backupPaths.filter(Boolean).map(filePath => ({
        name: path.basename(filePath),
        path: filePath,
        size: require('fs').statSync(filePath).size
      })),
      checksums: {}
    };
    
    // Generate checksums
    const crypto = require('crypto');
    for (const file of manifest.files) {
      const content = require('fs').readFileSync(file.path);
      manifest.checksums[file.name] = crypto.createHash('sha256').update(content).digest('hex');
    }
    
    const manifestPath = path.join(this.backupDir, `${this.backupName}-manifest.json`);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`📋 Backup manifest created: ${manifestPath}`);
    return manifestPath;
  }

  async cleanupOldBackups(keepDays = 30) {
    console.log(`🧹 Cleaning up backups older than ${keepDays} days...`);
    
    try {
      const files = await fs.readdir(this.backupDir);
      const cutoffTime = Date.now() - (keepDays * 24 * 60 * 60 * 1000);
      
      let deletedCount = 0;
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filePath);
          deletedCount++;
          console.log(`🗑️ Deleted old backup: ${file}`);
        }
      }
      
      console.log(`✅ Cleanup completed: ${deletedCount} files removed`);
    } catch (error) {
      console.warn('⚠️ Cleanup failed:', error.message);
    }
  }

  async run() {
    console.log('🚀 Starting Kent Traders Backup Process...\n');
    
    try {
      await this.ensureBackupDirectory();
      
      const backupPaths = await Promise.all([
        this.backupThemeFiles(),
        this.backupConfiguration(),
        this.backupPlugins(),
        this.backupDatabase(),
        this.createGitBackup()
      ]);
      
      const manifestPath = await this.generateBackupManifest(backupPaths);
      
      console.log('\n📊 BACKUP SUMMARY');
      console.log('=================');
      console.log(`Backup Name: ${this.backupName}`);
      console.log(`Location: ${this.backupDir}`);
      console.log(`Files Created: ${backupPaths.filter(Boolean).length + 1}`); // +1 for manifest
      
      const totalSize = backupPaths
        .filter(Boolean)
        .reduce((total, filePath) => {
          return total + require('fs').statSync(filePath).size;
        }, 0);
      
      console.log(`Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Manifest: ${manifestPath}`);
      
      await this.cleanupOldBackups();
      
      console.log('\n✅ Backup completed successfully!');
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      process.exit(1);
    }
  }
}

// Run backup if called directly
if (require.main === module) {
  const backup = new BackupManager();
  backup.run();
}

module.exports = BackupManager;
