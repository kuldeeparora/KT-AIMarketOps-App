"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = getAllOrders;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
/**
 * Fetch all orders from SellerDynamics with paging and error handling.
 * @param options GetOrdersOptions
 * @returns Promise<Order[]>
 */
async function getAllOrders({ encryptedLogin, retailerId, pageSize = 5000, endpoint, }) {
    var _a;
    let pageNumber = 1;
    let allOrders = [];
    let end = false;
    let hasErrored = false;
    while (!end && !hasErrored) {
        const response = await callSellerDynamicsOrdersAPI({
            encryptedLogin,
            retailerId,
            pageNumber,
            pageSize,
            endpoint,
        });
        if (!response.IsError) {
            if (((_a = response.Orders) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                allOrders = allOrders.concat(response.Orders);
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
    return allOrders;
}
// Helper to call the SellerDynamics SOAP API and parse the response
async function callSellerDynamicsOrdersAPI({ encryptedLogin, retailerId, pageNumber, pageSize, endpoint, }) {
    var _a;
    // Build SOAP XML request (adjust method name and params as needed)
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetOrders xmlns="http://www.sellerdynamics.com/">
          <encryptedLogin>${encryptedLogin}</encryptedLogin>
          <retailerId>${retailerId}</retailerId>
          <pageNumber>${pageNumber}</pageNumber>
          <pageSize>${pageSize}</pageSize>
        </GetOrders>
      </soap:Body>
    </soap:Envelope>`;
    const { data } = await axios_1.default.post(endpoint, xml, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'http://www.sellerdynamics.com/GetOrders',
        },
    });
    // Parse XML response
    const result = await (0, xml2js_1.parseStringPromise)(data, { explicitArray: false });
    // Extract and normalize response (adjust as needed)
    const body = result['soap:Envelope']['soap:Body']['GetOrdersResponse']['GetOrdersResult'];
    return {
        IsError: body.IsError === 'true',
        More: body.More === 'true',
        Orders: Array.isArray((_a = body.Orders) === null || _a === void 0 ? void 0 : _a.Order)
            ? body.Orders.Order.map((o) => ({
                OrderId: o.OrderId,
                // ...map other fields
            }))
            : [],
    };
}
