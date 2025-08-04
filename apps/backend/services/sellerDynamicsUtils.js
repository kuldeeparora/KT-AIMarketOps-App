// sellerDynamicsUtils.js
// Shared utilities for SellerDynamics API integration
import fetch from 'node-fetch';
import { parseString } from 'xml2js';

export function buildSOAPRequest(operation, data, config) {
  // Common structure for all operations
  const encryptedLogin = config.encryptedLogin;
  const retailerId = data.retailerId || config.retailerId;
  
  if (operation === 'GetStockLevels') {
    const pageNumber = data.pageNumber || 1;
    const pageSize = data.pageSize || 100;
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <GetStockLevels xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${pageNumber}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetStockLevels>
  </soap:Body>
</soap:Envelope>`;
  }
  
  if (operation === 'GetOrderHistory') {
    const pageNumber = data.pageNumber || 1;
    const pageSize = data.pageSize || 200;
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <GetOrderHistory xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${pageNumber}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetOrderHistory>
  </soap:Body>
</soap:Envelope>`;
  }
  
  if (operation === 'GetSalesOrders') {
    const pageNumber = data.pageNumber || 1;
    const pageSize = data.pageSize || 200;
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Header>
    <AuthHeader xmlns="https://my.sellerdynamics.com/api/">
      <ApiKey>${config.apiKey || 'your_sellerdynamics_api_key_here'}</ApiKey>
    </AuthHeader>
  </soap:Header>
  <soap:Body>
    <GetSalesOrders xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${pageNumber}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetSalesOrders>
  </soap:Body>
</soap:Envelope>`;
  }
  
  if (operation === 'GetOrders') {
    const pageNumber = data.pageNumber || 1;
    const pageSize = data.pageSize || 200;
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <GetOrders xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${pageNumber}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetOrders>
  </soap:Body>
</soap:Envelope>`;
  }

  if (operation === 'GetCustomerOrders') {
    const pageNumber = data.pageNumber || 1;
    const pageSize = data.pageSize || 200;
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <GetCustomerOrders xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${pageNumber}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetCustomerOrders>
  </soap:Body>
</soap:Envelope>`;
  }

  if (operation === 'GetInvoices') {
    const pageNumber = data.pageNumber || 1;
    const pageSize = data.pageSize || 200;
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <GetInvoices xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${pageNumber}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetInvoices>
  </soap:Body>
</soap:Envelope>`;
  }
  
  if (operation === 'GetSalesReport') {
    const startDate = data.startDate || '';
    const endDate = data.endDate || '';
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Header>
    <AuthHeader xmlns="https://my.sellerdynamics.com/api/">
      <ApiKey>${config.apiKey || 'your_sellerdynamics_api_key_here'}</ApiKey>
    </AuthHeader>
  </soap:Header>
  <soap:Body>
    <GetSalesReport xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <startDate>${startDate}</startDate>
      <endDate>${endDate}</endDate>
    </GetSalesReport>
  </soap:Body>
</soap:Envelope>`;
  }
  
  if (operation === 'GetRetailerMarketplaces') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Header>
    <AuthHeader xmlns="https://my.sellerdynamics.com/api/">
      <ApiKey>${config.apiKey || 'your_sellerdynamics_api_key_here'}</ApiKey>
    </AuthHeader>
  </soap:Header>
  <soap:Body>
    <GetRetailerMarketplaces xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
    </GetRetailerMarketplaces>
  </soap:Body>
</soap:Envelope>`;
  }
  
  if (operation === 'GetSettlementData') {
    const startDate = data.startDate || '';
    const endDate = data.endDate || '';
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Header>
    <AuthHeader xmlns="https://my.sellerdynamics.com/api/">
      <ApiKey>${config.apiKey || 'your_sellerdynamics_api_key_here'}</ApiKey>
    </AuthHeader>
  </soap:Header>
  <soap:Body>
    <GetSettlementData xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <startDate>${startDate}</startDate>
      <endDate>${endDate}</endDate>
    </GetSettlementData>
  </soap:Body>
</soap:Envelope>`;
  }
  
  // Default: fallback to old logic for other operations
  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <${operation} xmlns="https://my.sellerdynamics.com/">
      ${buildSOAPParameters(data)}
    </${operation}>
  </soap:Body>
</soap:Envelope>`;
  return soapEnvelope;
}

export function buildSOAPParameters(data) {
  let params = '';
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach(item => {
        params += `<${key}>${escapeXml(item)}</${key}>`;
      });
    } else {
      params += `<${key}>${escapeXml(value)}</${key}>`;
    }
  }
  return params;
}

export function escapeXml(text) {
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function soapRequest({ operation, bodyXml, soapAction, config, retryAttempts = 3, timeout = 30000 }) {
  let lastError;
  let alternativeActions = [
    soapAction,
    `"${operation}"`,
    `"http://www.sellerdynamics.com/${operation}"`,
    `"https://my.sellerdynamics.com/${operation}"`,
    `"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/${operation}"`
  ];
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    for (const currentSoapAction of alternativeActions) {
      try {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': currentSoapAction
          },
          body: bodyXml,
          timeout
        });
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`SellerDynamics API error: ${response.status} ${response.statusText}`);
        }
        return text;
      } catch (error) {
        lastError = error;
        if (error.message.includes('Server did not recognize the value of HTTP Header SOAPAction')) {
          continue;
        }
        break;
      }
    }
    if (attempt < retryAttempts) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export function parseSoapXml(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
