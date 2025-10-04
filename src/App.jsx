import { useState } from 'react'
import { fetchProductData, processProductData, formatPrice, getStockStatus, getRatingStars, isValidProductUrl, extractDomainFromUrl, generateSalesCopy } from './utils/productService'
import ProductPage from './components/ProductPage'

function App() {
  const [productUrl, setProductUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [productData, setProductData] = useState(null)
  const [salesCopy, setSalesCopy] = useState(null)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState('analyzer') // 'analyzer', 'product', or 'scraper'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!productUrl.trim()) {
      setError('Please enter a product URL')
      return
    }

    if (!isValidProductUrl(productUrl)) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // Fetch product data from backend scraping API
      const result = await fetchProductData(productUrl)
      
      if (result.success) {
        const processedData = processProductData(result.data)
        setProductData(processedData)
        
        // Generate AI-enhanced sales copy
        const generatedCopy = generateSalesCopy(result.data)
        setSalesCopy(generatedCopy)
        
        console.log('Product data loaded:', processedData)
        console.log('Sales copy generated:', generatedCopy)
      } else {
        setError(result.error || 'Failed to load product data')
      }
    } catch (err) {
      setError('An error occurred while processing the URL')
    } finally {
      setIsLoading(false)
    }
  }

  // Navigation component
  const Navigation = () => (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Product AI</h2>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'analyzer' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analyzer')}
          >
            URL Analyzer
          </button>
          <button 
            className={`nav-link ${currentPage === 'product' ? 'active' : ''}`}
            onClick={() => setCurrentPage('product')}
          >
            Product Page
          </button>
          <button 
            className={`nav-link ${currentPage === 'scraper' ? 'active' : ''}`}
            onClick={() => setCurrentPage('scraper')}
          >
            Sales Page Generator
          </button>
        </div>
      </div>
    </nav>
  )

  // Render ProductPage if currentPage is 'product'
  if (currentPage === 'product') {
    return (
      <>
        <Navigation />
        <ProductPage productData={productData} />
      </>
    )
  }

  // Render Scraper iframe if currentPage is 'scraper'
  if (currentPage === 'scraper') {
    return (
      <>
        <Navigation />
        <div className="container">
          <div className="max-width">
            <div className="card mb-6">
              <div className="card-header">
                <h1 className="card-title">Sales Page Generator</h1>
                <p className="card-description">
                  Generate compelling sales landing pages from any product URL
                </p>
              </div>
              <div className="card-content">
                <iframe 
                  src="http://localhost:5000" 
                  width="100%" 
                  height="800" 
                  style={{border: 'none', borderRadius: '10px'}}
                  title="Sales Page Generator"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="max-width">
          {/* Header Card */}
          <div className="card mb-6">
            <div className="card-header">
              <h1 className="card-title">Product URL Analyzer</h1>
              <p className="card-description">
                Paste a product URL below to analyze product details
              </p>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <input
                    type="url"
                    placeholder="https://example.com/product"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="form-input"
                  />
                  {error && (
                    <p className="error-message">{error}</p>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!productUrl.trim() || isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Product'}
                </button>
              </form>
            </div>
          </div>

        {/* Product Data Display */}
        {productData && (
          <div className="grid grid-cols-2">
            {/* Product Images */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Product Images</h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <img 
                    src={productData.images.primary.url} 
                    alt={productData.images.primary.alt}
                    className="product-image"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {productData.images.all.slice(1).map((image, index) => (
                      <img 
                        key={index}
                        src={image.url} 
                        alt={image.alt}
                        className="product-image-small"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">{productData.title}</h2>
                <p className="card-description">by {productData.brand}</p>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(productData.pricing.current, productData.pricing.currency)}
                      </span>
                      {productData.pricing.isOnSale && (
                        <span className="text-lg text-gray-500" style={{textDecoration: 'line-through'}}>
                          {formatPrice(productData.pricing.original, productData.pricing.currency)}
                        </span>
                      )}
                    </div>
                    {productData.pricing.isOnSale && (
                      <span className="text-sm text-green-600 font-medium">
                        {productData.pricing.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">{getRatingStars(productData.reviews.averageRating)}</span>
                    <span className="text-sm text-gray-600">
                      {productData.reviews.averageRating} ({productData.reviews.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="text-sm">
                    <span className={`font-medium ${productData.availability.inStock ? 'text-green-600' : 'text-red-500'}`}>
                      {getStockStatus(productData.availability)}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{productData.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {productData.features.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Variants */}
                  <div>
                    <h4 className="font-medium mb-2">Available Colors</h4>
                    <div className="flex gap-2">
                      {productData.variants.map((variant) => (
                        <div 
                          key={variant.id}
                          className={`color-variant ${!variant.inStock ? 'disabled' : ''}`}
                          style={{ backgroundColor: variant.color }}
                          title={`${variant.name} - ${variant.inStock ? 'In Stock' : 'Out of Stock'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales Copy Display */}
        {salesCopy && (
          <div className="card mt-6">
            <div className="card-header">
              <h2 className="card-title">AI-Generated Sales Copy</h2>
              <p className="card-description">
                AI-enhanced marketing content for this product
              </p>
            </div>
            <div className="card-content">
              <div className="space-y-6">
                {/* Headline */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Headline:</h3>
                  <p className="text-lg font-medium text-blue-600 bg-blue-50 p-3 rounded-lg">
                    {salesCopy.headline}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sales Description:</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {salesCopy.description}
                  </p>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Benefits:</h3>
                  <ul className="space-y-2">
                    {salesCopy.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 bg-green-50 p-3 rounded-lg">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Call to Action:</h3>
                  <p className="text-lg font-semibold text-orange-600 bg-orange-50 p-3 rounded-lg">
                    {salesCopy.callToAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}

export default App
