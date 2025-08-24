/**
 * Format order number for display in the UI
 * @param {string|object} transaction - Transaction object or order number string
 * @returns {string} Formatted order number for display
 */
export const formatOrderNumber = (transaction) => {
  // If it's a transaction object, extract orderNumber
  const orderNumber = typeof transaction === 'string' ? transaction : transaction?.orderNumber;
  
  if (!orderNumber) {
    // Fallback to transaction ID if no order number
    const id = typeof transaction === 'string' ? transaction : transaction?._id;
    if (id && id.length === 24) {
      // For MongoDB ObjectIDs, create a readable format
      return `ORD-${new Date().getFullYear()}-${id.substr(-6).toUpperCase()}`;
    }
    return 'N/A';
  }
  
  // If it's already in the correct format, return as is
  if (orderNumber.startsWith('ORD-')) {
    return orderNumber;
  }
  
  return orderNumber;
};

/**
 * Get order number display style classes
 * @param {string} status - Transaction status
 * @returns {string} CSS classes for styling
 */
export const getOrderNumberClasses = (status) => {
  const baseClasses = 'font-mono font-semibold text-sm';
  
  switch (status) {
    case 'success':
      return `${baseClasses} text-green-600`;
    case 'failed':
      return `${baseClasses} text-red-600`;
    case 'pending':
      return `${baseClasses} text-yellow-600`;
    default:
      return `${baseClasses} text-blue-600`;
  }
};

/**
 * Parse order number components
 * @param {string} orderNumber - Order number in format ORD-YYYY-XXXXXX
 * @returns {object|null} Parsed components or null if invalid
 */
export const parseOrderNumber = (orderNumber) => {
  if (!orderNumber || !orderNumber.startsWith('ORD-')) {
    return null;
  }
  
  const parts = orderNumber.split('-');
  if (parts.length !== 3) {
    return null;
  }
  
  const year = parseInt(parts[1]);
  const sequence = parseInt(parts[2]);
  
  if (isNaN(year) || isNaN(sequence)) {
    return null;
  }
  
  return {
    year,
    sequence,
    formatted: orderNumber
  };
};

/**
 * Copy order number to clipboard
 * @param {string} orderNumber - Order number to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyOrderNumber = async (orderNumber) => {
  try {
    await navigator.clipboard.writeText(orderNumber);
    return true;
  } catch (error) {
    console.error('Failed to copy order number:', error);
    return false;
  }
};
