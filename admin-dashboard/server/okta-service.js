const axios = require('axios');
const logger = require('./logger');

class OktaService {
  constructor() {
    this.baseUrl = process.env.OKTA_DOMAIN;
    this.clientId = process.env.OKTA_CLIENT_ID;
    this.clientSecret = process.env.OKTA_CLIENT_SECRET;
    this.apiToken = process.env.OKTA_API_TOKEN;
    this.organization = process.env.OKTA_ORG;
    
    this.httpClient = axios.create({
      baseURL: `https://${this.baseUrl}`,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  // Get access token for API calls
  async getAccessToken() {
    try {
      const response = await this.httpClient.post('/oauth2/v1/token', {
        grant_type: 'client_credentials',
        scope: 'okta.users.read okta.users.manage okta.groups.read'
  }, {
        auth: {
    username: this.clientId,
          password: this.clientSecret
  }
      });

      return response.data.access_token;
    } catch (error) {
      logger.error('Failed to get OKTA access token:', error);
      throw new Error('OKTA authentication failed');
    }
  }

  // Get API headers with authentication
  async getAuthHeaders() {
    const token = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  // Sync users from OKTA to local system
  async syncUsers() {
    try {
      logger.info('Starting OKTA user synchronization');
      
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get('/api/v1/users', {
        headers,
        params: {
    limit: 200,
          status: 'ACTIVE'
  }
      });

      const users = response.data.map(user => this.mapOktaUser(user));
      
      logger.info(`Synced ${users.length} users from OKTA`);
      return users;
    } catch (error) {
      logger.error('Failed to sync users from OKTA:', error);
      throw error;
    }
  }

  // Map OKTA user to local user format
  mapOktaUser(oktaUser) {
    return {
      id: oktaUser.id,
      email: oktaUser.profile.email,
      name: `${oktaUser.profile.firstName} ${oktaUser.profile.lastName}`,
      role: this.mapOktaGroupToRole(oktaUser.groups),
      status: oktaUser.status === 'ACTIVE' ? 'Active' : 'Inactive',
      department: oktaUser.profile.department || 'Unknown',
      lastLogin: oktaUser.lastLogin ? new Date(oktaUser.lastLogin).toISOString() : null,
      oktaId: oktaUser.id,
      permissions: this.getPermissionsFromGroups(oktaUser.groups),
      profile: {
    firstName: oktaUser.profile.firstName,
        lastName: oktaUser.profile.lastName,
        title: oktaUser.profile.title,
        department: oktaUser.profile.department,
        phoneNumber: oktaUser.profile.phoneNumber,
        employeeNumber: oktaUser.profile.employeeNumber
  }
    };
  }

  // Map OKTA groups to local roles
  mapOktaGroupToRole(groups) {
    if (!groups || groups.length === 0) return 'User';
    
    const groupNames = groups.map(group => group.profile.name.toLowerCase());
    
    if (groupNames.includes('admin') || groupNames.includes('administrators')) {
      return 'Admin';
    } else if (groupNames.includes('manager') || groupNames.includes('managers')) {
      return 'Manager';
    } else if (groupNames.includes('supervisor') || groupNames.includes('supervisors')) {
      return 'Supervisor';
    } else {
      return 'User';
    }
  }

  // Get permissions from OKTA groups
  getPermissionsFromGroups(groups) {
    if (!groups || groups.length === 0) return ['read'];
    
    const permissions = new Set(['read']);
    const groupNames = groups.map(group => group.profile.name.toLowerCase());
    
    if (groupNames.includes('admin') || groupNames.includes('administrators')) {
      permissions.add('write');
      permissions.add('delete');
      permissions.add('admin');
    } else if (groupNames.includes('manager') || groupNames.includes('managers')) {
      permissions.add('write');
      permissions.add('manage');
    } else if (groupNames.includes('supervisor') || groupNames.includes('supervisors')) {
      permissions.add('write');
    }
    
    return Array.from(permissions);
  }

  // Create user in OKTA
  async createUser(userData) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.post('/api/v1/users', {
        profile: {
    firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          login: userData.email,
          department: userData.department,
          title: userData.title
  },
        credentials: {
    password: {
            value: userData.password
  }
        }
      }, { headers });

      return response.data;
    } catch (error) {
      logger.error('Failed to create user in OKTA:', error);
      throw error;
    }
  }

  // Update user in OKTA
  async updateUser(userId, userData) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.put(`/api/v1/users/${userId}`, {
        profile: {
    firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          department: userData.department,
          title: userData.title
  }
      }, { headers });

      return response.data;
    } catch (error) {
      logger.error('Failed to update user in OKTA:', error);
      throw error;
    }
  }

  // Delete user from OKTA
  async deleteUser(userId) {
    try {
      const headers = await this.getAuthHeaders();
      await this.httpClient.delete(`/api/v1/users/${userId}`, { headers });
      return true;
    } catch (error) {
      logger.error('Failed to delete user from OKTA:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUser(userId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get(`/api/v1/users/${userId}`, { headers });
      return this.mapOktaUser(response.data);
    } catch (error) {
      logger.error('Failed to get user from OKTA:', error);
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get('/api/v1/users', {
        headers,
        params: {
    q: email,
          limit: 1
  }
      });

      if (response.data.length > 0) {
        return this.mapOktaUser(response.data[0]);
      }
      return null;
    } catch (error) {
      logger.error('Failed to get user by email from OKTA:', error);
      throw error;
    }
  }

  // Get all groups
  async getGroups() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get('/api/v1/groups', { headers });
      return response.data;
    } catch (error) {
      logger.error('Failed to get groups from OKTA:', error);
      throw error;
    }
  }

  // Add user to group
  async addUserToGroup(userId, groupId) {
    try {
      const headers = await this.getAuthHeaders();
      await this.httpClient.put(`/api/v1/groups/${groupId}/users/${userId}`, {}, { headers });
      return true;
    } catch (error) {
      logger.error('Failed to add user to group in OKTA:', error);
      throw error;
    }
  }

  // Remove user from group
  async removeUserFromGroup(userId, groupId) {
    try {
      const headers = await this.getAuthHeaders();
      await this.httpClient.delete(`/api/v1/groups/${groupId}/users/${userId}`, { headers });
      return true;
    } catch (error) {
      logger.error('Failed to remove user from group in OKTA:', error);
      throw error;
    }
  }

  // Get user groups
  async getUserGroups(userId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get(`/api/v1/users/${userId}/groups`, { headers });
      return response.data;
    } catch (error) {
      logger.error('Failed to get user groups from OKTA:', error);
      throw error;
    }
  }

  // Deactivate user
  async deleteUser(userId) {
    try {
      const headers = await this.getAuthHeaders();
      await this.httpClient.post(`/api/v1/users/${userId}/lifecycle/deactivate`, {}, { headers });
      return true;
    } catch (error) {
      logger.error('Failed to deactivate user in OKTA:', error);
      throw error;
    }
  }

  // Reactivate user
  async reactivateUser(userId) {
    try {
      const headers = await this.getAuthHeaders();
      await this.httpClient.post(`/api/v1/users/${userId}/lifecycle/activate`, {}, { headers });
      return true;
    } catch (error) {
      logger.error('Failed to reactivate user in OKTA:', error);
      throw error;
    }
  }

  // Reset user password
  async resetUserPassword(userId, sendEmail = true) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.post(`/api/v1/users/${userId}/lifecycle/reset_password`, {
        sendEmail
      }, { headers });
      return response.data;
    } catch (error) {
      logger.error('Failed to reset user password in OKTA:', error);
      throw error;
    }
  }

  // Get user sessions
  async getUserSessions(userId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get(`/api/v1/users/${userId}/sessions`, { headers });
      return response.data;
    } catch (error) {
      logger.error('Failed to get user sessions from OKTA:', error);
      throw error;
    }
  }

  // End user session
  async endUserSession(userId, sessionId) {
    try {
      const headers = await this.getAuthHeaders();
      await this.httpClient.delete(`/api/v1/users/${userId}/sessions/${sessionId}`, { headers });
      return true;
    } catch (error) {
      logger.error('Failed to end user session in OKTA:', error);
      throw error;
    }
  }

  // Get user factors (MFA)
  async getUserFactors(userId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get(`/api/v1/users/${userId}/factors`, { headers });
      return response.data;
    } catch (error) {
      logger.error('Failed to get user factors from OKTA:', error);
      throw error;
    }
  }

  // Enroll user in MFA factor
  async enrollUserFactor(userId, factorType) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.post(`/api/v1/users/${userId}/factors`, {
        factorType
      }, { headers });
      return response.data;
    } catch (error) {
      logger.error('Failed to enroll user factor in OKTA:', error);
      throw error;
    }
  }

  // Verify MFA factor
  async verifyUserFactor(userId, factorId, passCode) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.post(`/api/v1/users/${userId}/factors/${factorId}/verify`, {
        passCode
      }, { headers });
      return response.data;
    } catch (error) {
      logger.error('Failed to verify user factor in OKTA:', error);
      throw error;
    }
  }

  // Get configuration status
  async getConfigurationStatus() {
    try {
      const isConfigured = !!(this.baseUrl && this.clientId && this.clientSecret && this.apiToken);
      
      if (!isConfigured) {
        return {
          configured: false,
          message: 'OKTA configuration is incomplete',
          missingFields: []
        };
      }

      // Test connection
      const headers = await this.getAuthHeaders();
      await this.httpClient.get('/api/v1/users?limit=1', { headers });

      return {
        configured: true,
        message: 'OKTA integration is working properly',
        domain: this.baseUrl,
        organization: this.organization
      };
    } catch (error) {
      logger.error('OKTA configuration test failed:', error);
      return {
        configured: false,
        message: 'OKTA connection failed',
        error: error.message
      };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get(`/api/v1/users/${userId}`, { headers });
      return this.mapOktaUser(response.data);
    } catch (error) {
      logger.error('Failed to get user profile from OKTA:', error);
      throw error;
    }
  }

  // Search users
  async searchUsers(query) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.httpClient.get('/api/v1/users', {
        headers,
        params: {
          q: query,
          limit: 50
        }
      });

      return response.data.map(user => this.mapOktaUser(user));
    } catch (error) {
      logger.error('Failed to search users in OKTA:', error);
      throw error;
    }
  }

  // Deactivate user (alias for deleteUser)
  async deactivateUser(userId) {
    return this.deleteUser(userId);
  }

  // Verify token
  async verifyToken(token) {
    try {
      const response = await this.httpClient.get('/oauth2/v1/introspect', {
        params: {
          token: token,
          token_type_hint: 'access_token'
        },
        auth: {
          username: this.clientId,
          password: this.clientSecret
        }
      });

      return {
        valid: response.data.active,
        user: response.data.sub,
        scope: response.data.scope,
        expiresAt: response.data.exp
      };
    } catch (error) {
      logger.error('Failed to verify token in OKTA:', error);
      throw error;
    }
  }
}

module.exports = OktaService; 