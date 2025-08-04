import React, { useState, useEffect } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  ShoppingCart as OrderIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Info as InfoIcon} from '@mui/icons-material';

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Listen for notification events,
    const handleNotification = event => {
      const newNotification = {
        id: Date.now(),
        type: event.detail.type || 'info',
        title: event.detail.title || 'Notification',
        message: event.detail.message || 'New notification',
        timestamp: new Date().toISOString(),
        read: false};

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10,
      setOpen(true);
    };

    window.addEventListener('showNotification', handleNotification);

    return () => {
      window.removeEventListener('showNotification', handleNotification);
    };
  }, []);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setOpen(false);
  };

  const markAsRead = notificationId => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const getNotificationIcon = type => {
    switch (type) {
      case 'order':
        return <OrderIcon />;
      case 'inventory':
        return <InventoryIcon />;
      case 'warning': return <WarningIcon />;
      default: return <InfoIcon />;
  }
  };

  const getNotificationColor = type => {
    switch (type) {
      case 'order':
        return 'success';
      case 'inventory':
        return 'warning';
      case 'warning': return 'error';
      default: return 'info';
  }
  };

  return (
    <>
      {/* Notification Bell */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
  }}
      >
        <IconButton
          color='inherit'
          onClick={handleClick} sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
  }}
        >
          <Badge badgeContent={getUnreadCount()} color='error'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl} open={Boolean(anchorEl)}
        onClose={handleClose} PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflow: 'auto',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
  }}
        >
          <Typography variant='h6'>Notifications</Typography>
        </Box>

        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant='body,2' color='text.secondary'>
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          <List
            sx={{
              p: 0,
  }}
          >
            {notifications.map(notification => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => markAsRead(notification.id)} sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected',
  },
                  }}
                >
                  <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                  <ListItemText
                    primary={notification.title} 
                    secondary={
                      <React.Fragment>
                        <Typography variant='body2' color='text.secondary' component="div">
                          {notification.message}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' component="div">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>

      {/* Toast Notifications */}
      <Snackbar
        open={open} autoHideDuration={6000}
        onClose={handleNotificationClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleNotificationClose} severity={getNotificationColor(notifications[0]?.type)}
          action={
            <IconButton size='small' color='inherit' onClick={handleNotificationClose}>
              <CloseIcon fontSize='small' />
            </IconButton>
          }
        >
          {notifications[0]?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
