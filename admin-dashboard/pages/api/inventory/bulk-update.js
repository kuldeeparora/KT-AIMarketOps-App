import formidable from 'formidable';
import fs from 'fs';
import xlsx from 'xlsx';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

    // Read the Excel file
    const workbook = xlsx.readFile(file.filepath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate required columns
    const requiredColumns = ['SKU', 'Stock', 'Price'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

    if (missingColumns.length > 0) {
      return res.status(400).json({
        error: `Missing required columns: ${missingColumns.join(', ')}`});
    }

    // Process the data
    const updates = data.map(row => ({
      sku: row.SKU,
      stock: parseInt(row.Stock) || 0,
      price: parseFloat(row.Price) || 0,
      cost: parseFloat(row.Cost) || 0,
      supplier: row.Supplier || '',
      location: row.Location || ''}));

    // Update inventory in both Shopify and SellerDynamics
    const updatePromises = updates.map(async update => {
      try {
        // Update Shopify
        await fetch(`${process.env.SHOPIFY_API_URL}/products.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN},
          body: JSON.stringify({
            product: {
              sku: update.sku,
              inventory_quantity: update.stock,
              price: update.price}})});

        // Update SellerDynamics
        await fetch(`${process.env.SELLERDYNAMICS_API_URL}/inventory/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SELLERDYNAMICS_API_KEY}`},
          body: JSON.stringify({
            sku: update.sku,
            currentStock: update.stock,
            price: update.price,
            cost: update.cost,
            supplier: update.supplier,
            location: update.location,
            lastUpdated: new Date().toISOString()})});

        return { sku: update.sku, status: 'success' };
  } catch (error) {
        console.error(`Error updating ${update.sku}:`, error);
        return { sku: update.sku, status: 'error', error: error.message };
  }
    });

    const results = await Promise.allSettled(updatePromises);

    // Clean up uploaded file
    fs.unlinkSync(file.filepath);

    const successful = results.filter(
      r => r.status === 'fulfilled' && r.value.status === 'success'
    ).length;
    const failed = results.length - successful;

    return res.status(200).json({
      message: `Bulk update completed. ${successful} successful, ${failed} failed.`,
      results: results.map(r =>
        r.status === 'fulfilled' ? r.value : { status: 'error', error: r.reason }
      ),
      summary: {
    total: results.length,
        successful,
        failed}});
  } catch (error) {
    console.error('Bulk update error:', error);
    return res.status(500).json({ error: 'Bulk update failed' });
  }
}
