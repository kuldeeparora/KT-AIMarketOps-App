
import { parseSoapXml } from './sellerDynamicsUtils.js';

class SellerDynamicsParser {
  async parse(xmlString) {
    return new Promise((resolve, reject) => {
      parseSoapXml(xmlString, (err, result) => {
        if (err) {
          console.error('Error parsing SOAP response:', err);
          reject(err);
          return;
        }
        try {
          const soapResult = {};
          if (result['soap:Envelope'] && result['soap:Envelope']['soap:Body']) {
            const body = result['soap:Envelope']['soap:Body'];
            if (body.GetStockLevelsResponse) {
              const response = body.GetStockLevelsResponse;
              soapResult.products = this.extractProductsFromXMLResult(response);
              soapResult.totalValue = soapResult.products
                ? soapResult.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
                : 0;
              soapResult.lastUpdated = new Date().toISOString();
            } else if (body.UploadStockResponse) {
              const response = body.UploadStockResponse;
              soapResult.uploadedCount = this.extractUploadCountFromXMLResult(response);
              soapResult.errors = this.extractErrorsFromXMLResult(response);
            } else {
              soapResult.rawData = body;
            }
          }
          resolve(soapResult);
        } catch (error) {
          console.error('Error processing SOAP response:', error);
          reject(error);
        }
      });
    });
  }

  extractProductsFromXMLResult(response) {
    const products = [];
    try {
      let productNodes = [];
      if (response.GetStockLevelsResult) {
        const result = response.GetStockLevelsResult;
        if (result.Products && result.Products.Product) {
          productNodes = result.Products.Product;
        }
      }
      if (!Array.isArray(productNodes)) {
        productNodes = [productNodes];
      }
      productNodes.forEach(product => {
        if (product) {
          products.push({
            id: product.ID || product.Id || product.id || '',
            name: product.Name || product.name || '',
            sku: product.SKU || product.Sku || product.sku || '',
            quantity: parseInt(product.Quantity || product.quantity || '0'),
            price: parseFloat(product.Price || product.price || '0'),
            category: product.Category || product.category || 'Uncategorized',
            supplier: product.Supplier || product.supplier || 'Unknown',
            maxStock: parseInt(product.MaxStock || product.maxStock || '100'),
            reorderPoint: parseInt(product.ReorderPoint || product.reorderPoint || '10')
          });
        }
      });
    } catch (error) {
      console.error('Error extracting products from XML:', error);
    }
    return products;
  }

  extractUploadCountFromXMLResult(response) {
    // Implementation for extracting upload count
    return 0;
  }

  extractErrorsFromXMLResult(response) {
    // Implementation for extracting errors
    return [];
  }
}

export default SellerDynamicsParser;