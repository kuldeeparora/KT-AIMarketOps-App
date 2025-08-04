import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('admin');
  const [user, setUser] = useState({
    id: 1,
    name: 'Kuldeep Arora',
    email: 'kuldeep@kenttraders.co.uk',
    role: 'admin',
    permissions: ['read', 'write', 'admin', 'manage_users', 'manage_roles'],
    department: 'Administration',
    lastLogin: new Date().toISOString()
  });

  const updateRole = (newRole) => {
    setRole(newRole);
    setUser(prev => ({
      ...prev,
      role: newRole,
      permissions: getPermissionsForRole(newRole)
  }));
  };

  const getPermissionsForRole = (userRole) => {
    const rolePermissions = {
      admin: ['read', 'write', 'admin', 'manage_users', 'manage_roles', 'manage_inventory', 'manage_finance'],
      manager: ['read', 'write', 'manage_inventory', 'manage_finance'],
      accountant: ['read', 'write', 'manage_finance'],
      viewer: ['read']
  };
    return rolePermissions[userRole] || ['read'];
  };

  const hasPermission = (permission) => {
    return user.permissions.includes(permission) || user.permissions.includes('admin');
  };

  const canAccess = (requiredPermissions) => {
    if (typeof requiredPermissions === 'string') {
      return hasPermission(requiredPermissions);
    }
    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.some(permission => hasPermission(permission));
    }
    return true;
  };

  const value = {
    user,
    role,
    setRole: updateRole,
    hasPermission,
    canAccess,
    updateUser: setUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 