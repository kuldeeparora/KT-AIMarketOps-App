import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'sellerdynamics');
const CACHE_FILE = path.join(DATA_DIR, 'cache.json');
const SYNC_LOG_FILE = path.join(DATA_DIR, 'sync-log.json');

// Ensure data directory exists,
  function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Save data to cache,
  export function saveToCache(data, metadata = {}) {
  try {
    ensureDataDirectory();
    
    const cacheData = {
      data,
  metadata: {
        ...metadata,
  lastUpdated: new Date().toISOString(),
    version: '1.0'
  }
    };
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    
    
    // Log sync activity,
  logSyncActivity(metadata);
    
    return true;
  } catch (error) {
    console.error('[SellerDynamics Storage] Error saving to cache:', error);
    return false;
  }
}

// Load data from cache,
  export function loadFromCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return null;
    }
    
    const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    
    return cacheData;
  } catch (error) {
    console.error('[SellerDynamics Storage] Error loading from cache:', error);
    return null;
  }
}

// Get specific data from cache,
  export function getCachedData(type) {
  try {
    const cache = loadFromCache();
    if (!cache || !cache.data) {
      return null;
    }
    
    return cache.data[type] || null;
  } catch (error) {
    console.error(`[SellerDynamics Storage] Error getting cached ${type}:`, error);
    return null;
  }
}

// Check if cache is fresh (within specified hours)
export function isCacheFresh(hours = 1) {
  try {
    const cache = loadFromCache();
    if (!cache || !cache.metadata || !cache.metadata.lastUpdated) {
      return false;
    }
    
    const lastUpdated = new Date(cache.metadata.lastUpdated);
    const now = new Date();
    const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);
    
    return hoursDiff < hours;
  } catch (error) {
    console.error('[SellerDynamics Storage] Error checking cache freshness:', error);
    return false;
  }
}

// Log sync activity,
  function logSyncActivity(metadata) {
  try {
    ensureDataDirectory();
    
    let syncLog = [];
    if (fs.existsSync(SYNC_LOG_FILE)) {
      syncLog = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'));
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    // Keep only last 100 entries,
  syncLog.unshift(logEntry);
    syncLog = syncLog.slice(0, 100);
    
    fs.writeFileSync(SYNC_LOG_FILE, JSON.stringify(syncLog, null, 2));
  } catch (error) {
    console.error('[SellerDynamics Storage] Error logging sync activity:', error);
  }
}

// Get sync history,
  export function getSyncHistory(limit = 10) {
  try {
    if (!fs.existsSync(SYNC_LOG_FILE)) {
      return [];
    }
    
    const syncLog = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'));
    return syncLog.slice(0, limit);
  } catch (error) {
    console.error('[SellerDynamics Storage] Error getting sync history:', error);
    return [];
  }
}

// Clear cache,
  export function clearCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
      
    }
    return true;
  } catch (error) {
    console.error('[SellerDynamics Storage] Error clearing cache:', error);
    return false;
  }
}

// Get cache statistics,
  export function getCacheStats() {
  try {
    const cache = loadFromCache();
    if (!cache) {
      return {
        exists: false,
        lastUpdated: null,
        dataTypes: [],
        totalRecords: 0
  };
    }
    
    const dataTypes = Object.keys(cache.data || {});
    const totalRecords = dataTypes.reduce((total, type) => {
      const data = cache.data[type];
      if (Array.isArray(data)) {
        return total + data.length;
      } else if (data && typeof data === 'object') {
        return total + Object.keys(data).length;
      }
      return total;
    }, 0);
    
    return {
      exists: true,
      lastUpdated: cache.metadata?.lastUpdated,
      dataTypes,
      totalRecords,
      version: cache.metadata?.version
  };
  } catch (error) {
    console.error('[SellerDynamics Storage] Error getting cache stats:', error);
    return {
      exists: false,
      lastUpdated: null,
      dataTypes: [],
      totalRecords: 0
  };
  }
}

// Export data for backup,
  export function exportData() {
  try {
    const cache = loadFromCache();
    if (!cache) {
      return null;
    }
    
    const exportData = {
      ...cache,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0'
  };
    
    return exportData;
  } catch (error) {
    console.error('[SellerDynamics Storage] Error exporting data:', error);
    return null;
  }
}

// Import data from backup,
  export function importData(importData) {
  try {
    if (!importData || !importData.data) {
      throw new Error('Invalid import data');
    }
    
    const success = saveToCache(importData.data, {
      ...importData.metadata,
  imported: true,
    importedAt: new Date().toISOString()
  });
    
    return success;
  } catch (error) {
    console.error('[SellerDynamics Storage] Error importing data:', error);
    return false;
  }
} 