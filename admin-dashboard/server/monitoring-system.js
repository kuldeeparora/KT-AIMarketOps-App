const logger = require('./logger');

const performanceMonitor = {
  trackApiCall: (endpoint, status, duration) => {
    logger.info(`API Call: ${endpoint} - ${status} - ${duration}s`);
  }
};

module.exports = {
  logger,
  performanceMonitor
};