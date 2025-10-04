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

/**
 * Generates AI-enhanced sales copy for a product
 * @param {Object} productData - The product data object
 * @returns {Object} Generated sales copy with headline, description, benefits, and CTA
 */
export const generateSalesCopy = (productData) => {
  if (!productData) {
    return {
      headline: "Premium Product",
      description: "Experience the difference with our premium product.",
      benefits: [
        "High-quality materials",
        "Excellent customer service",
        "Great value for money"
      ],
      callToAction: "Order now and experience the difference!"
    };
  }

  // Extract key product information
  const { title, brand, price, features, reviews, availability } = productData;
  const isOnSale = price.current < price.original;
  const discountPercentage = price.discount_percentage;
  const averageRating = reviews.average_rating;
  const totalReviews = reviews.total_reviews;
  const stockQuantity = availability.stock_quantity;

  // Generate compelling headline
  const headline = generateHeadline(title, brand, isOnSale, discountPercentage);

  // Generate persuasive description
  const description = generateDescription(title, brand, features, averageRating, totalReviews);

  // Generate 3 key benefits
  const benefits = generateBenefits(features, price, availability);

  // Generate call-to-action
  const callToAction = generateCallToAction(isOnSale, stockQuantity, price);

  return {
    headline,
    description,
    benefits,
    callToAction
  };
};

/**
 * Generates a compelling headline
 */
const generateHeadline = (title, brand, isOnSale, discountPercentage) => {
  const headlines = [
    `${brand} ${title} - Premium Quality at Unbeatable Price`,
    `Transform Your Experience with ${brand} ${title}`,
    `The ${brand} ${title} That Everyone's Talking About`,
    `Premium ${brand} ${title} - Now Available`,
    `Experience Excellence with ${brand} ${title}`
  ];

  if (isOnSale && discountPercentage >= 20) {
    return `${brand} ${title} - ${discountPercentage}% OFF Limited Time Offer!`;
  }

  return headlines[Math.floor(Math.random() * headlines.length)];
};

/**
 * Generates persuasive product description
 */
const generateDescription = (title, brand, features, averageRating, totalReviews) => {
  const topFeatures = features.slice(0, 3);
  const featureText = topFeatures.join(', ');
  
  return `Discover the ${brand} ${title} - a premium product designed for excellence. With ${featureText}, this product delivers outstanding performance and reliability. Rated ${averageRating} stars by ${totalReviews} satisfied customers, it's the perfect choice for those who demand quality and innovation. Experience the difference that ${brand} brings to your daily routine.`;
};

/**
 * Generates 3 key benefits
 */
const generateBenefits = (features, price, availability) => {
  const benefits = [];
  
  // Benefit 1: Key feature
  if (features.length > 0) {
    benefits.push(`✨ ${features[0]} - Experience superior performance`);
  }
  
  // Benefit 2: Value proposition
  const isOnSale = price.current < price.original;
  if (isOnSale) {
    benefits.push(`💰 Amazing Value - Save ${price.discount_percentage}% on this premium product`);
  } else {
    benefits.push(`💰 Excellent Value - Premium quality at a competitive price`);
  }
  
  // Benefit 3: Trust/Convenience
  if (availability.shipping_info.free_shipping) {
    benefits.push(`🚚 Free Shipping - Get it delivered to your door at no extra cost`);
  } else {
    benefits.push(`🔒 Secure Purchase - 30-day money-back guarantee included`);
  }
  
  return benefits;
};

/**
 * Generates persuasive call-to-action
 */
const generateCallToAction = (isOnSale, stockQuantity, price) => {
  const urgency = stockQuantity <= 10 ? "Only " + stockQuantity + " left in stock! " : "";
  const saleUrgency = isOnSale ? "Limited time offer! " : "";
  
  const ctas = [
    `${urgency}${saleUrgency}Order now and transform your experience today!`,
    `${urgency}${saleUrgency}Don't miss out - secure yours before they're gone!`,
    `${urgency}${saleUrgency}Join thousands of satisfied customers - order now!`,
    `${urgency}${saleUrgency}Experience the difference - click to order now!`,
    `${urgency}${saleUrgency}Get yours today and see why everyone loves this product!`
  ];
  
  return ctas[Math.floor(Math.random() * ctas.length)];
};
