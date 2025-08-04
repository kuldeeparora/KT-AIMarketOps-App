import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export interface Product {
  ProductId: string;
  // ...other fields as needed
}

export interface GetProductsOptions {
  encryptedLogin: string;
  retailerId: string;
  pageSize?: number;
  endpoint: string; // SellerDynamics SOAP endpoint URL
}

/**
 * Fetch all products from SellerDynamics with paging and error handling.
 * @param options GetProductsOptions
 * @returns Promise<Product[]>
 */
export async function getAllProducts({
  encryptedLogin,
  retailerId,
  pageSize = 5000,
  endpoint,
}: GetProductsOptions): Promise<Product[]> {
  let pageNumber = 1;
  let allProducts: Product[] = [];
  let end = false;
  let hasErrored = false;

  while (!end && !hasErrored) {
    const response = await callSellerDynamicsProductsAPI({
      encryptedLogin,
      retailerId,
      pageNumber,
      pageSize,
      endpoint,
    });

    if (!response.IsError) {
      if (response.Products?.length > 0) {
        allProducts = allProducts.concat(response.Products);
      }
      if (response.More) {
        pageNumber++;
      } else {
        end = true;
      }
    } else {
      hasErrored = true;
      // Optionally throw or log error
    }
  }
  return allProducts;
}

// Helper to call the SellerDynamics SOAP API and parse the response
async function callSellerDynamicsProductsAPI({
  encryptedLogin,
  retailerId,
  pageNumber,
  pageSize,
  endpoint,
}: GetProductsOptions & { pageNumber: number }): Promise<any> {
  // Build SOAP XML request (adjust method name and params as needed)
  const xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetProducts xmlns="http://www.sellerdynamics.com/">
          <encryptedLogin>${encryptedLogin}</encryptedLogin>
          <retailerId>${retailerId}</retailerId>
          <pageNumber>${pageNumber}</pageNumber>
          <pageSize>${pageSize}</pageSize>
        </GetProducts>
      </soap:Body>
    </soap:Envelope>`;

  const { data } = await axios.post(endpoint, xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://www.sellerdynamics.com/GetProducts',
    },
  });

  // Parse XML response
  const result = await parseStringPromise(data, { explicitArray: false });
  // Extract and normalize response (adjust as needed)
  const body = result['soap:Envelope']['soap:Body']['GetProductsResponse']['GetProductsResult'];
  return {
    IsError: body.IsError === 'true',
    More: body.More === 'true',
    Products: Array.isArray(body.Products?.Product)
      ? body.Products.Product.map((p: any) => ({
          ProductId: p.ProductId,
          // ...map other fields
        }))
      : [],
  };
} 