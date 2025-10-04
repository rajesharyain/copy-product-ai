import productData from '../data/product.json';

/**
 * Product Service Utility Functions
 * Handles fetching and processing product data
 */

/**
 * Fetches product data from the mock JSON file
 * @returns {Promise<Object>} Product data object
 */
export const fetchProductData = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: productData,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/**
 * Gets product by ID (for future use with multiple products)
 * @param {string} productId - The product ID to fetch
 * @returns {Promise<Object>} Product data object
 */
export const getProductById = async (productId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For now, return the single product data
    // In a real app, this would filter by productId
    if (productData.id === productId) {
      return {
        success: true,
        data: productData,
        error: null
      };
    } else {
      return {
        success: false,
        data: null,
        error: 'Product not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/**
 * Processes product data and returns structured information
 * @param {Object} product - Raw product data
 * @returns {Object} Processed product data
 */
export const processProductData = (product) => {
  if (!product) return null;

  return {
    // Basic info
    id: product.id,
    title: product.title,
    brand: product.brand,
    description: product.description,
    shortDescription: product.short_description,
    
    // Pricing
    pricing: {
      current: product.price.current,
      original: product.price.original,
      currency: product.price.currency,
      discountPercentage: product.price.discount_percentage,
      isOnSale: product.price.current < product.price.original
    },
    
    // Images
    images: {
      primary: product.images.find(img => img.is_primary) || product.images[0],
      all: product.images,
      count: product.images.length
    },
    
    // Variants
    variants: product.variants.map(variant => ({
      id: variant.id,
      name: variant.name,
      color: variant.color,
      price: variant.price,
      inStock: variant.in_stock,
      stockQuantity: variant.stock_quantity
    })),
    
    // Specifications
    specifications: product.specifications,
    
    // Features
    features: product.features,
    
    // Reviews summary
    reviews: {
      averageRating: product.reviews.average_rating,
      totalReviews: product.reviews.total_reviews,
      ratingDistribution: product.reviews.rating_distribution,
      recentReviews: product.reviews.recent_reviews.slice(0, 3) // Get latest 3 reviews
    },
    
    // Availability
    availability: {
      inStock: product.availability.in_stock,
      stockQuantity: product.availability.stock_quantity,
      shippingInfo: product.availability.shipping_info
    },
    
    // Metadata
    category: product.category,
    tags: product.tags,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
};

/**
 * Gets formatted price string
 * @param {number} price - The price value
 * @param {string} currency - The currency code
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

/**
 * Gets stock status message
 * @param {Object} availability - Availability object
 * @returns {string} Stock status message
 */
export const getStockStatus = (availability) => {
  if (!availability.in_stock) {
    return 'Out of Stock';
  }
  
  if (availability.stock_quantity <= 10) {
    return `Only ${availability.stock_quantity} left in stock`;
  }
  
  return 'In Stock';
};

/**
 * Gets average rating stars
 * @param {number} rating - Average rating (0-5)
 * @returns {string} Star representation
 */
export const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
};

/**
 * Validates if a product URL is valid
 * @param {string} url - The URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export const isValidProductUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Extracts domain from product URL
 * @param {string} url - The product URL
 * @returns {string} Domain name
 */
export const extractDomainFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'Unknown';
  }
};
