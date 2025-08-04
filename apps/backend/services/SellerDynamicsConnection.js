
import { soapRequest } from './sellerDynamicsUtils.js';

class SellerDynamicsConnection {
  constructor(config) {
    this.config = config;
  }

  async request(operation, bodyXml, soapAction) {
    return soapRequest({
      operation,
      bodyXml,
      soapAction,
      config: this.config,
      retryAttempts: this.config.retryAttempts,
      timeout: this.config.timeout
    });
  }
}

export default SellerDynamicsConnection;