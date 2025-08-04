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
async function getAllStockLevels({ encryptedLogin, retailerId, pageSize = 5000, endpoint }) {
    var _a;
    let pageNumber = 1;
    let allStock = [];
    let end = false;
    let hasErrored = false;
    while (!end && !hasErrored) {
        if (pageNumber < 1) {
            console.error('Invalid pageNumber:', pageNumber, '- must be 1 or more. Forcing to 1.');
            pageNumber = 1;
        }
        
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
            console.error('SellerDynamics API error:', response.ErrorMessage || response);
        }
    }
    return allStock;
}
// Helper to call the SellerDynamics SOAP API and parse the response
async function callSellerDynamicsStockAPI({ encryptedLogin, retailerId, pageNumber, pageSize, endpoint }) {
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
    
    
    const { data } = await axios_1.default.post(endpoint, xml, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'https://my.sellerdynamics.com/GetStockLevels',
        },
    });
    // Parse XML response
    const result = await (0, xml2js_1.parseStringPromise)(data, { explicitArray: false });
    // Extract and normalize response (you may need to adjust this based on actual response structure)
    const body = result['soap:Envelope']['soap:Body']['GetStockLevelsResponse']['GetStockLevelsResult'];
    return {
        IsError: body.IsError === 'true',
        More: body.More === 'true',
        ErrorMessage: body.ErrorMessage,
        StockLevels: Array.isArray((_a = body.StockLevels) === null || _a === void 0 ? void 0 : _a.StockLevel)
            ? body.StockLevels.StockLevel.map((s) => ({
                SKU: s.SKU,
                Quantity: Number(s.Quantity),
            }))
            : [],
    };
}
