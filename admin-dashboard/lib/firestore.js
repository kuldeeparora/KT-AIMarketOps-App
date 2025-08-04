import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Generic CRUD operations
export const firestoreUtils = {
  // Create a document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Get a single document
  async get(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Get all documents from a collection
  async getAll(collectionName, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      // Apply conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  },

  // Update a document
  async update(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { id: docId, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  async delete(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { id: docId };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Real-time listener
  subscribe(collectionName, callback, conditions = []) {
    let q = collection(db, collectionName);
    
    // Apply conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    return onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    });
  },

  // Batch operations
  async batchWrite(operations) {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(operation => {
        const { type, collection, id, data } = operation;
        const docRef = doc(db, collection, id);
        
        switch (type) {
          case 'create':
            batch.set(docRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
            break;
          case 'update':
            batch.update(docRef, { ...data, updatedAt: new Date() });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error in batch operation:', error);
      throw error;
    }
  }
};

// Specific collections utilities
export const usersCollection = {
  async createUser(userData) {
    return firestoreUtils.create('users', userData);
  },
  
  async getUser(userId) {
    return firestoreUtils.get('users', userId);
  },
  
  async updateUser(userId, userData) {
    return firestoreUtils.update('users', userId, userData);
  },
  
  async getAllUsers() {
    return firestoreUtils.getAll('users');
  }
};

export const inventoryCollection = {
  async createItem(itemData) {
    return firestoreUtils.create('inventory', itemData);
  },
  
  async getItem(itemId) {
    return firestoreUtils.get('inventory', itemId);
  },
  
  async updateItem(itemId, itemData) {
    return firestoreUtils.update('inventory', itemId, itemData);
  },
  
  async deleteItem(itemId) {
    return firestoreUtils.delete('inventory', itemId);
  },
  
  async getLowStockItems() {
    return firestoreUtils.getAll('inventory', [
      { field: 'stockLevel', operator: '<=', value: 10 }
    ]);
  },
  
  async getItemsByCategory(category) {
    return firestoreUtils.getAll('inventory', [
      { field: 'category', operator: '==', value: category }
    ]);
  }
};

export const ordersCollection = {
  async createOrder(orderData) {
    return firestoreUtils.create('orders', orderData);
  },
  
  async getOrder(orderId) {
    return firestoreUtils.get('orders', orderId);
  },
  
  async updateOrder(orderId, orderData) {
    return firestoreUtils.update('orders', orderId, orderData);
  },
  
  async getOrdersByStatus(status) {
    return firestoreUtils.getAll('orders', [
      { field: 'status', operator: '==', value: status }
    ]);
  },
  
  async getRecentOrders(limit = 10) {
    return firestoreUtils.getAll('orders', [], { orderBy: 'createdAt', limit });
  }
};

export const analyticsCollection = {
  async createAnalytics(analyticsData) {
    return firestoreUtils.create('analytics', analyticsData);
  },
  
  async getAnalyticsByDate(date) {
    return firestoreUtils.getAll('analytics', [
      { field: 'date', operator: '==', value: date }
    ]);
  },
  
  async getAnalyticsByType(type) {
    return firestoreUtils.getAll('analytics', [
      { field: 'type', operator: '==', value: type }
    ]);
  }
}; 