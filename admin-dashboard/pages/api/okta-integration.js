import OktaService from '../../server/okta-service';
import { logger, performanceMonitor } from '../../server/monitoring-system';

const oktaService = new OktaService();

export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    const { action, ...data } = req.body;

    switch (req.method) {
      case 'GET':
        await handleGetRequest(req, res);
        break;
      case 'POST':
        await handlePostRequest(req, res);
        break;
      case 'PUT':
        await handlePutRequest(req, res);
        break;
      case 'DELETE':
        await handleDeleteRequest(req, res);
        break;
      default: res.status(405).json({ error: 'Method not allowed' });
  }

    // Track API performance
    const duration = (Date.now() - startTime) / 1000;
    performanceMonitor.trackApiCall('okta-integration', 'success', duration);
  } catch (error) {
    logger.error('OKTA integration API error:', error);

    const duration = (Date.now() - startTime) / 1000;
    performanceMonitor.trackApiCall('okta-integration', 'error', duration);

    res.status(500).json({
      error: 'Internal server error',
      message: error.message});
  }
}

async function handleGetRequest(req, res) {
  const { action } = req.query;

  switch (action) {
    case 'status': {
      const status = await oktaService.getConfigurationStatus();
      res.status(200).json(status);
      break;
    }

    case 'users': {
      const users = await oktaService.syncUsers();
      res.status(200).json({ users, count: users.length });
      break;
    }

    case 'user': {
      const { userId } = req.query;
      if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
      }
      const user = await oktaService.getUserProfile(userId);
      res.status(200).json(user);
      break;
    }

    case 'search': {
      const { query } = req.query;
      if (!query) {
        res.status(400).json({ error: 'Search query required' });
        return;
      }
      const searchResults = await oktaService.searchUsers(query);
      res.status(200).json({ users: searchResults, count: searchResults.length });
      break;
    }

    case 'groups': {
      const { userId: groupUserId } = req.query;
      if (!groupUserId) {
        res.status(400).json({ error: 'User ID required' });
        return;
      }
      const groups = await oktaService.getUserGroups(groupUserId);
      res.status(200).json({ groups });
      break;
    }

    default: res.status(400).json({ error: 'Invalid action' });
  }
}

async function handlePostRequest(req, res) {
  const { action } = req.body;

  switch (action) {
    case 'create-user': {
      const { userData } = req.body;
      if (!userData) {
        res.status(400).json({ error: 'User data required' });
        return;
      }
      const newUser = await oktaService.createUser(userData);
      res.status(201).json(newUser);
      break;
    }

    case 'add-to-group': {
      const { userId, groupId } = req.body;
      if (!userId || !groupId) {
        res.status(400).json({ error: 'User ID and Group ID required' });
        return;
      }
      await oktaService.addUserToGroup(userId, groupId);
      res.status(200).json({ message: 'User added to group successfully' });
      break;
    }

    case 'verify-token': {
      const { token } = req.body;
      if (!token) {
        res.status(400).json({ error: 'Token required' });
        return;
      }
      const verification = await oktaService.verifyToken(token);
      res.status(200).json(verification);
      break;
    }

    default: res.status(400).json({ error: 'Invalid action' });
  }
}

async function handlePutRequest(req, res) {
  const { action } = req.body;

  switch (action) {
    case 'update-user': {
      const { userId, userData } = req.body;
      if (!userId || !userData) {
        res.status(400).json({ error: 'User ID and user data required' });
        return;
      }
      const updatedUser = await oktaService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
      break;
    }

    default: res.status(400).json({ error: 'Invalid action' });
  }
}

async function handleDeleteRequest(req, res) {
  const { action } = req.body;

  switch (action) {
    case 'deactivate-user': {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
      }
      await oktaService.deactivateUser(userId);
      res.status(200).json({ message: 'User deactivated successfully' });
      break;
    }

    case 'remove-from-group': {
      const { userId: removeUserId, groupId } = req.body;
      if (!removeUserId || !groupId) {
        res.status(400).json({ error: 'User ID and Group ID required' });
        return;
      }
      await oktaService.removeUserFromGroup(removeUserId, groupId);
      res.status(200).json({ message: 'User removed from group successfully' });
      break;
    }

    default: res.status(400).json({ error: 'Invalid action' });
  }
}
