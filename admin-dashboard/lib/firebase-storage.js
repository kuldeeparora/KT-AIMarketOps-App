import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  uploadBytesResumable
} from 'firebase/storage';
import { storage } from './firebase';

export const storageUtils = {
  // Upload a file
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        size: snapshot.metadata.size,
        contentType: snapshot.metadata.contentType
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload with progress tracking
  uploadFileWithProgress(file, path, onProgress) {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        throw error;
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress(100, downloadURL);
      }
    );

    return uploadTask;
  },

  // Get download URL
  async getFileURL(path) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  // Delete a file
  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // List files in a directory
  async listFiles(path) {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      
      const files = [];
      for (const item of result.items) {
        const url = await getDownloadURL(item);
        files.push({
          name: item.name,
          fullPath: item.fullPath,
          url
        });
      }
      
      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
};

// Specific storage utilities for different file types
export const imageStorage = {
  async uploadImage(file, userId) {
    const timestamp = Date.now();
    const path = `users/${userId}/images/${timestamp}_${file.name}`;
    return storageUtils.uploadFile(file, path);
  },

  async uploadProductImage(file, productId) {
    const timestamp = Date.now();
    const path = `products/${productId}/images/${timestamp}_${file.name}`;
    return storageUtils.uploadFile(file, path);
  },

  async uploadProfilePicture(file, userId) {
    const path = `users/${userId}/profile/${file.name}`;
    return storageUtils.uploadFile(file, path);
  }
};

export const documentStorage = {
  async uploadDocument(file, userId, category) {
    const timestamp = Date.now();
    const path = `users/${userId}/documents/${category}/${timestamp}_${file.name}`;
    return storageUtils.uploadFile(file, path);
  },

  async uploadInvoice(file, orderId) {
    const timestamp = Date.now();
    const path = `orders/${orderId}/invoices/${timestamp}_${file.name}`;
    return storageUtils.uploadFile(file, path);
  }
};

export const backupStorage = {
  async uploadBackup(file, backupType) {
    const timestamp = Date.now();
    const path = `backups/${backupType}/${timestamp}_${file.name}`;
    return storageUtils.uploadFile(file, path);
  },

  async listBackups(backupType) {
    const path = `backups/${backupType}`;
    return storageUtils.listFiles(path);
  }
}; 