import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export interface CustomerOrder {
  OrderId: string;
  OrderNumber: string;
  CustomerName: string;
  CustomerEmail: string;
  OrderDate: string;
  TotalAmount: number;
  Status: string;
  Marketplace: string;
  // ...other fields as needed
}

export interface GetOrdersOptions {
  encryptedLogin: string;
  retailerId: string;
  fromDate: Date;
  toDate: Date;
  orderType?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  pageSize?: number;
  endpoint: string; // SellerDynamics SOAP endpoint URL
}

/**
 * Fetch customer orders from SellerDynamics with paging and error handling.
 * @param options GetOrdersOptions
 * @returns Promise<CustomerOrder[]>
 */
export async function getCustomerOrders({
  encryptedLogin,
  retailerId,
  fromDate,
  toDate,
  orderType = 'PENDING',
  pageSize = 100,
  endpoint,
}: GetOrdersOptions): Promise<CustomerOrder[]> {
  let pageNumber = 1;
  let allOrders: CustomerOrder[] = [];
  let end = false;
  let hasErrored = false;

  while (!end && !hasErrored) {
    console.log('Fetching SellerDynamics orders pageNumber:', pageNumber);
    const response = await callSellerDynamicsOrdersAPI({
      encryptedLogin,
      retailerId,
      fromDate,
      toDate,
      orderType,
      pageNumber,
      pageSize,
      endpoint,
    });

    if (!response.IsError) {
      if (response.Customers?.length > 0) {
        // Process each customer's orders
        response.Customers.forEach((customer: any) => {
          if (customer.Orders?.Order) {
            const orders = Array.isArray(customer.Orders.Order) 
              ? customer.Orders.Order 
              : [customer.Orders.Order];
            
            orders.forEach((order: any) => {
              allOrders.push({
                OrderId: order.OrderId,
                OrderNumber: order.OrderNumber,
                CustomerName: customer.CustomerName || 'Unknown',
                CustomerEmail: customer.CustomerEmail || '',
                OrderDate: order.OrderDate,
                TotalAmount: Number(order.TotalAmount || 0),
                Status: order.Status || 'Pending',
                Marketplace: order.Marketplace || 'Unknown',
              });
            });
          }
        });
      }
      
      // Check if we have more pages
      if (response.Pagination && response.Pagination.PageSize) {
        const totalProcessed = pageNumber * response.Pagination.PageSize;
        if (totalProcessed >= response.Pagination.RecordsAffected) {
          end = true;
        } else {
          pageNumber++;
        }
      } else {
        end = true;
      }
    } else {
      hasErrored = true;
      console.error('SellerDynamics Orders API error:', response.ErrorMessage || response);
    }
  }
  return allOrders;
}

// Helper to call the SellerDynamics SOAP API and parse the response
async function callSellerDynamicsOrdersAPI({
  encryptedLogin,
  retailerId,
  fromDate,
  toDate,
  orderType,
  pageNumber,
  pageSize,
  endpoint,
}: GetOrdersOptions & { pageNumber: number }): Promise<any> {
  // Format dates for SOAP request
  const fromDateStr = fromDate.toISOString().split('T')[0];
  const toDateStr = toDate.toISOString().split('T')[0];

  // Build SOAP XML request for GetCustomerOrders
  const xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetCustomerOrders xmlns="https://my.sellerdynamics.com/">
          <encryptedLogin>${encryptedLogin}</encryptedLogin>
          <retailerId>${retailerId}</retailerId>
          <orderType>${orderType}</orderType>
          <fromDate>${fromDateStr}</fromDate>
          <toDate>${toDateStr}</toDate>
          <pageNumber>${pageNumber}</pageNumber>
          <pageSize>${pageSize}</pageSize>
        </GetCustomerOrders>
      </soap:Body>
    </soap:Envelope>`;

  console.log('SOAPAction:', 'https://my.sellerdynamics.com/GetCustomerOrders');
  console.log('XML:', xml);

  const { data } = await axios.post(endpoint, xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'https://my.sellerdynamics.com/GetCustomerOrders',
    },
  });

  // Parse XML response
  const result = await parseStringPromise(data, { explicitArray: false });
  
  // Extract and normalize response
  const body = result['soap:Envelope']['soap:Body']['GetCustomerOrdersResponse']['GetCustomerOrdersResult'];
  
  return {
    IsError: body.IsError === 'true',
    ErrorMessage: body.ErrorMessage,
    Customers: Array.isArray(body.Customers?.Customer)
      ? body.Customers.Customer
      : body.Customers?.Customer ? [body.Customers.Customer] : [],
    Pagination: body.Pagination || {},
  };
} 