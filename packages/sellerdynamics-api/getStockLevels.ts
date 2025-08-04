import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export interface StockLevel {
  SKU: string;
  Quantity: number;
  // ...other fields as needed
}

export interface GetStockLevelsOptions {
  encryptedLogin: string;
  retailerId: string;
  pageSize?: number;
  endpoint: string; // SellerDynamics SOAP endpoint URL
}

/**
 * Fetch all stock levels from SellerDynamics with paging and error handling.
 * @param options GetStockLevelsOptions
 * @returns Promise<StockLevel[]>
 */
export async function getAllStockLevels({
  encryptedLogin,
  retailerId,
  pageSize = 5000,
  endpoint,
}: GetStockLevelsOptions): Promise<StockLevel[]> {
  let pageNumber = 1;
  let allStock: StockLevel[] = [];
  let end = false;
  let hasErrored = false;

  while (!end && !hasErrored) {
    if (pageNumber < 1) {
      console.error('Invalid pageNumber:', pageNumber, '- must be 1 or more. Forcing to 1.');
      pageNumber = 1;
    }
    console.log('Fetching SellerDynamics pageNumber:', pageNumber);
    const response = await callSellerDynamicsStockAPI({
      encryptedLogin,
      retailerId,
      pageNumber,
      pageSize,
      endpoint,
    });

    if (!response.IsError) {
      if (response.StockLevels?.length > 0) {
        allStock = allStock.concat(response.StockLevels);
      }
      if (response.More) {
        pageNumber++;
      } else {
        end = true;
      }
    } else {
      hasErrored = true;
      console.error('SellerDynamics API error:', response.ErrorMessage || response);
    }
  }
  return allStock;
}

// Helper to call the SellerDynamics SOAP API and parse the response
async function callSellerDynamicsStockAPI({
  encryptedLogin,
  retailerId,
  pageNumber,
  pageSize,
  endpoint,
}: GetStockLevelsOptions & { pageNumber: number }): Promise<any> {
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

    console.log('SOAPAction:', 'http://www.sellerdynamics.com/GetStockLevels');
    console.log('XML:', xml);

  const { data } = await axios.post(endpoint, xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'https://my.sellerdynamics.com/GetStockLevels',
    },
  });

  // Parse XML response
  const result = await parseStringPromise(data, { explicitArray: false });
  // Extract and normalize response (you may need to adjust this based on actual response structure)
  const body = result['soap:Envelope']['soap:Body']['GetStockLevelsResponse']['GetStockLevelsResult'];
  return {
    IsError: body.IsError === 'true',
    More: body.More === 'true',
    ErrorMessage: body.ErrorMessage,
    StockLevels: Array.isArray(body.StockLevels?.StockLevel)
      ? body.StockLevels.StockLevel.map((s: any) => ({
          SKU: s.SKU,
          Quantity: Number(s.Quantity),
        }))
      : [],
  };
} 