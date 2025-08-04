"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStockLevels = getAllStockLevels;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
/**
 * Fetch all stock levels from SellerDynamics with paging and error handling.
 * @param options GetStockLevelsOptions
 * @returns Promise<StockLevel[]>
 */
async function getAllStockLevels({ encryptedLogin, retailerId, pageSize = 5000, endpoint, }) {
    var _a;
    let pageNumber = 1;
    let allStock = [];
    let end = false;
    let hasErrored = false;
    while (!end && !hasErrored) {
        const response = await callSellerDynamicsStockAPI({
            encryptedLogin,
            retailerId,
            pageNumber,
            pageSize,
            endpoint,
        });
        if (!response.IsError) {
            if (((_a = response.StockLevels) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                allStock = allStock.concat(response.StockLevels);
            }
            if (response.More) {
                pageNumber++;
            }
            else {
                end = true;
            }
        }
        else {
            hasErrored = true;
            // Optionally throw or log error
        }
    }
    return allStock;
}
// Helper to call the SellerDynamics SOAP API and parse the response
async function callSellerDynamicsStockAPI({ encryptedLogin, retailerId, pageNumber, pageSize, endpoint, }) {
    var _a;
    // Build SOAP XML request
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetStockLevels xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${pageNumber}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetStockLevels>
  </soap:Body>
</soap:Envelope>`;
    console.log('SOAPAction:', 'https://my.sellerdynamics.com/GetStockLevels');
    console.log('XML:', xml);
    
    let data;
    try {
        const response = await axios_1.default.post(endpoint, xml, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'https://my.sellerdynamics.com/GetStockLevels',
            },
        });
        data = response.data;
    } catch (axiosError) {
        console.error('Axios request failed:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            responseData: axiosError.response?.data?.substring(0, 500) + '...',
            config: {
                url: axiosError.config?.url,
                method: axiosError.config?.method,
                headers: axiosError.config?.headers
            }
        });
        
        // Return error structure instead of throwing
        return {
            IsError: true,
            More: false,
            StockLevels: [],
            ErrorMessage: `HTTP ${axiosError.response?.status}: ${axiosError.message}. Response: ${axiosError.response?.data?.substring(0, 200) || 'No response data'}`
        };
    }
    
    console.log('Raw SellerDynamics response:', data.substring(0, 500) + '...');
    
    // Parse XML response
    let result;
    try {
        result = await (0, xml2js_1.parseStringPromise)(data, { explicitArray: false });
    } catch (parseError) {
        console.error('XML parsing failed:', parseError.message);
        console.log('Raw data that failed to parse:', data.substring(0, 1000));
        return {
            IsError: true,
            More: false,
            StockLevels: [],
            ErrorMessage: `XML parsing failed: ${parseError.message}`
        };
    }
    
    console.log('Parsed XML structure:', JSON.stringify(result, null, 2).substring(0, 1000) + '...');
    
    // Extract and normalize response (you may need to adjust this based on actual response structure)
    let body;
    try {
        body = result['soap:Envelope']['soap:Body']['GetStockLevelsResponse']['GetStockLevelsResult'];
    } catch (e) {
        console.error('Error parsing SOAP response structure:', e);
        console.log('Full parsed result:', JSON.stringify(result, null, 2));
        return {
            IsError: true,
            More: false,
            StockLevels: [],
            ErrorMessage: 'Failed to parse SOAP response structure'
        };
    }
    
    console.log('GetStockLevelsResult body:', JSON.stringify(body, null, 2));
    
    if (body.IsError === 'true') {
        console.log('SellerDynamics API returned error:', body.ErrorMessage || 'Unknown error');
        return {
            IsError: true,
            More: false,
            StockLevels: [],
            ErrorMessage: body.ErrorMessage || 'API returned error'
        };
    }
    
    let stockLevels = [];
    if (body.StockLevels && (body.StockLevels.StockLevel || body.StockLevels.StockLevelItem)) {
        // Handle both StockLevel and StockLevelItem structures
        const stockLevelData = body.StockLevels.StockLevelItem || body.StockLevels.StockLevel;
        const stockLevelArray = Array.isArray(stockLevelData) 
            ? stockLevelData 
            : [stockLevelData];
            
        console.log('Processing stock levels:', stockLevelArray.length, 'items');
        console.log('First stock level item:', JSON.stringify(stockLevelArray[0], null, 2));
        
        stockLevels = stockLevelArray.map((s) => ({
            SKU: s.SKU,
            Quantity: Number(s.Quantity) || 0,
            ProductName: s.ProductName || s.ProductTitle || s.Title || `Product ${s.SKU}`,
            Vendor: s.Vendor || s.Supplier || s.Brand || 'Unknown Vendor',
            QuantityAllocated: Number(s.QuantityAllocated) || Number(s.AllocatedQuantity) || 0,
            SupplierStockLevel: Number(s.SupplierStockLevel) || Number(s.SupplierStock) || Number(s.Quantity) || 0,
            ProductType: s.ProductType || s.Category || s.Type || 'General',
            Price: Number(s.Price) || Number(s.UnitPrice) || 0,
            Cost: Number(s.Cost) || Number(s.UnitCost) || 0,
            CreatedAt: s.CreatedAt || s.DateCreated || new Date().toISOString(),
            UpdatedAt: s.UpdatedAt || s.LastModified || new Date().toISOString()
        }));
    } else {
        console.log('No StockLevels found in response. Available fields:', Object.keys(body));
    }
    
    return {
        IsError: body.IsError === 'true',
        More: body.More === 'true',
        StockLevels: stockLevels,
    };
}
