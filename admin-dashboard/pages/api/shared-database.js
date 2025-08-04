// Shared in-memory database for simulation
let inMemoryDatabase = [
  {
    sku: 'BG-NBS12',
    product_name: 'BG NBS12 Brushed Steel Light Switch',
    stock_level: 54,
    cost_price: 3.1,
    is_kit: false,
    good_id: '2114f210-f8cb-4a82-9eb3-1949ddb376a7',
    category: 'Electrical',
    vendor: 'BG',
    reorder_point: 10,
    last_updated: new Date().toISOString()},
  {
    sku: 'BG-EVOLVE-MB-4GANG-APPLIANCE',
    product_name: 'BG Evolve 4 Gang Appliance Module',
    stock_level: 8,
    cost_price: 12.5,
    is_kit: false,
    good_id: 'f45212f7-d99a-4e57-a3b5-7ab2061c70ba',
    category: 'Electrical',
    vendor: 'BG',
    reorder_point: 5,
    last_updated: new Date().toISOString()},
  {
    sku: 'WAGO-51253135',
    product_name: 'Wago 51253135 Connector',
    stock_level: 125,
    cost_price: 2.75,
    is_kit: false,
    good_id: '383646a7-823e-47bf-9695-3b7ea1d065bc',
    category: 'Connectors',
    vendor: 'Wago',
    reorder_point: 20,
    last_updated: new Date().toISOString()}];

export function getInMemoryDatabase() {
  return inMemoryDatabase;
}

export function updateInMemoryDatabase(sku, updates) {
  const productIndex = inMemoryDatabase.findIndex(p => p.sku === sku);
  if (productIndex !== -1) {
    inMemoryDatabase[productIndex] = {
      ...inMemoryDatabase[productIndex],
      ...updates,
      last_updated: new Date().toISOString()};
    return true;
  }
  return false;
}

export function getProductBySku(sku) {
  return inMemoryDatabase.find(p => p.sku === sku);
}
