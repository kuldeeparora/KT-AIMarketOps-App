# Enhanced Inventory API Documentation

## Overview

The enhanced Inventory API provides comprehensive inventory management capabilities with advanced filtering, sorting, and pagination support. It integrates with SellerDynamics SOAP API to provide real-time inventory data.

## Endpoints

### GET `/api/inventory`

Returns paginated inventory data with support for advanced filtering and sorting.

#### Query Parameters

##### Sorting
- `sortBy`: Field to sort by. Valid values: `SKU`, `ProductName`, `Vendor`, `Quantity`, `QuantityAllocated`, `SupplierStockLevel`, `ProductType`, `Price`, `LastUpdated`
- `sortOrder`: Sort order. Valid values: `asc`, `desc` (default: `asc`)

##### Filtering
- `search`: Search term to filter by SKU, ProductName, Vendor, ProductType, or Location
- `vendor`: Filter by vendor name (partial match, case insensitive)
- `productType`: Filter by product type (partial match, case insensitive)  
- `location`: Filter by warehouse location (partial match, case insensitive)
- `isActive`: Filter by active status (`true`, `false`)
- `minQuantity`: Minimum quantity filter (number)
- `maxQuantity`: Maximum quantity filter (number)
- `minPrice`: Minimum price filter (number)
- `maxPrice`: Maximum price filter (number)
- `minCost`: Minimum cost filter (number)
- `maxCost`: Maximum cost filter (number)

##### Pagination
- `page`: Page number (default: 1, minimum: 1)
- `limit`: Items per page (default: 50, maximum: 1000)
- `offset`: Skip items (alternative to page-based pagination)

#### Example Requests

```bash
# Basic request with pagination
GET /api/inventory?page=1&limit=20

# Search for electronics with sorting
GET /api/inventory?search=electronics&sortBy=ProductName&sortOrder=asc

# Complex filtering
GET /api/inventory?vendor=acme&minQuantity=10&maxPrice=100&isActive=true

# Offset-based pagination
GET /api/inventory?offset=50&limit=25
```

#### Response Format

```json
{
  "data": [
    {
      "SKU": "PROD-001",
      "ProductName": "Widget A",
      "Vendor": "ACME Corp",
      "Quantity": 150,
      "QuantityAllocated": 25,
      "SupplierStockLevel": 175,
      "ProductType": "Electronics",
      "Price": 29.99,
      "Cost": 19.99,
      "Weight": 1.5,
      "LastUpdated": "2024-01-15T10:30:00Z",
      "IsActive": true,
      "Location": "Warehouse A"
    }
  ],
  "total": 1250,
  "page": 1,
  "totalPages": 25,
  "limit": 50,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "error": null,
  "queryOptions": {
    "page": 1,
    "limit": 50,
    "sortOrder": "asc"
  },
  "processingStats": {
    "originalCount": 1250,
    "filteredCount": 1250,
    "sortBy": null,
    "sortOrder": "asc",
    "appliedFilters": []
  }
}
```

### GET `/api/inventory/filter-stats`

Returns statistics about available filter options and data ranges.

#### Response Format

```json
{
  "totalProducts": 1250,
  "filteredProducts": 1250,
  "vendors": ["ACME Corp", "Beta Industries", "Gamma Solutions"],
  "productTypes": ["Electronics", "Tools", "Hardware"],
  "locations": ["Warehouse A", "Warehouse B", "Distribution Center"],
  "quantityRange": {
    "min": 0,
    "max": 5000
  },
  "priceRange": {
    "min": 5.99,
    "max": 999.99
  },
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `405`: Method not allowed (only GET supported)
- `500`: Internal server error

### Error Response Format
```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "totalPages": 1,
  "limit": 50,
  "hasNextPage": false,
  "hasPreviousPage": false,
  "error": "Error message describing what went wrong",
  "queryOptions": {}
}
```

## Implementation Details

### Data Processing Pipeline
1. **Validation**: Query parameters are validated and sanitized
2. **Fetching**: Data retrieved from SellerDynamics API (minimum 5000 items per API call)
3. **Filtering**: Applied in order: search, vendor, productType, location, quantity ranges, price ranges, isActive
4. **Sorting**: Applied after filtering using specified field and order
5. **Pagination**: Applied last to return requested page/offset range

### Performance Considerations
- Maximum limit of 1000 items per request
- SellerDynamics API has minimum page size requirement of 5000 items
- Complex filters may impact response time on large datasets
- Data is processed in memory - consider caching for production use

### Data Normalization
The API normalizes data from SellerDynamics into a consistent format:
- Numeric fields are converted to numbers
- Missing fields get default values
- Boolean fields are properly typed
- Timestamps are in ISO format

## Testing

### Unit Tests
- `/utils/inventory.test.ts`: Tests for filtering and sorting logic
- `/lib/sellerdynamicsProvider.test.ts`: Tests for data provider
- `/api/inventory.test.ts`: Tests for API endpoint
- `/api/filter-stats.test.ts`: Tests for filter stats endpoint

### Integration Tests
- `/integration/inventory-api.test.ts`: End-to-end API testing

### Running Tests
```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run specific test file
npm test -- inventory.test.ts

# Run with coverage
npm test -- --coverage
```

## TypeScript Types

### Core Types
```typescript
interface StockLevel {
  SKU: string;
  ProductName: string;
  Vendor: string;
  Quantity: number;
  QuantityAllocated: number;
  SupplierStockLevel: number;
  ProductType: string;
  Price?: number;
  Cost?: number;
  Weight?: number;
  LastUpdated?: string;
  IsActive?: boolean;
  Location?: string;
  [key: string]: any;
}

interface InventoryQueryOptions {
  sortBy?: 'SKU' | 'ProductName' | 'Vendor' | 'Quantity' | 'QuantityAllocated' | 'SupplierStockLevel' | 'ProductType' | 'Price' | 'LastUpdated';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  vendor?: string;
  productType?: string;
  location?: string;
  isActive?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  minCost?: number;
  maxCost?: number;
  page?: number;
  limit?: number;
  offset?: number;
}
```

## Environment Variables

Required environment variables for SellerDynamics integration:
- `SELLERDYNAMICS_ENCRYPTED_LOGIN`: Encrypted login credentials
- `SELLERDYNAMICS_RETAILER_ID`: Retailer identifier
- `SELLERDYNAMICS_SOAP_ENDPOINT`: SOAP API endpoint URL

## Usage Examples

### Frontend Integration
```javascript
// Fetch inventory with filters
const fetchInventory = async (filters) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/inventory?${params}`);
  return response.json();
};

// Get filter options for UI
const fetchFilterStats = async () => {
  const response = await fetch('/api/inventory/filter-stats');
  return response.json();
};

// Example usage
const data = await fetchInventory({
  search: 'widget',
  vendor: 'ACME',
  minQuantity: 10,
  sortBy: 'ProductName',
  page: 1,
  limit: 20
});
```

### React Hook Example
```javascript
const useInventory = (filters) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchInventory(filters);
        setData(result);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filters]);
  
  return { data, loading };
};
```
