# Environment Variables for Real SellerDynamics Database

## Database Configuration
```bash
# SellerDynamics Database
SELLERDYNAMICS_DB_HOST=your-db-host.com
SELLERDYNAMICS_DB_PORT=3306
SELLERDYNAMICS_DB_USER=your-username
SELLERDYNAMICS_DB_PASSWORD=your-password
SELLERDYNAMICS_DB_NAME=sellerdynamics
```

## API Configuration (for real API)
```bash
# SellerDynamics API
SELLERDYNAMICS_SOAP_ENDPOINT=https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx
SELLERDYNAMICS_ENCRYPTED_LOGIN=your-encrypted-login
SELLERDYNAMICS_RETAILER_ID=your-retailer-id
SELLERDYNAMICS_PAGE_SIZE=5000
SELLERDYNAMICS_MAX_PAGES=100
```

## Application Configuration
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Installation Steps

### 1. Install MySQL Driver
```bash
npm install mysql2
```

### 2. Create .env file
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Update API to use real database
Replace the simulation functions in:
- `admin-dashboard/pages/api/sellerdynamics.js`
- `admin-dashboard/pages/api/sellerdynamics/update.js`

### 4. Test Connection
```bash
curl -s http://localhost:3001/api/sellerdynamics | jq '.meta.note'
# Should return: "Using real database data"
``` 