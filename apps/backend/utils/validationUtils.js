// validationUtils.js
/**
 * Validate inventory item fields and business logic
 * @param {Object} item
 * @returns {Array} errors
 */
export function validateInventoryItem(item) {
  const errors = [];
  if (!item.sku) errors.push('Missing SKU');
  if (!item.name) errors.push('Missing product name');
  if (isNaN(item.quantity) || item.quantity < 0) errors.push(`Invalid quantity (${item.quantity})`);
  if (isNaN(item.price) || item.price < 0) errors.push(`Invalid price (${item.price})`);
  if (item.minThreshold > item.maxStock) errors.push(`Min threshold (${item.minThreshold}) cannot be greater than max stock (${item.maxStock})`);
  return errors;
}

/**
 * Validate an array of inventory items
 */
export function validateInventoryData(data) {
  const errors = [];
  data.forEach((item, i) => {
    const itemErrors = validateInventoryItem(item);
    if (itemErrors.length) errors.push(`Row ${i + 1}: ${itemErrors.join(', ')}`);
  });
  return {
    isValid: errors.length === 0,
    errors
  };
}
