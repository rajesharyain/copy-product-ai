import { useState } from 'react'
import productData from '../data/product.json'
import { formatPrice, getRatingStars } from '../utils/productService'

const ProductPage = () => {
  const [selectedVariant, setSelectedVariant] = useState(productData.variants[0])
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${selectedVariant.name} ${productData.title} to cart!`)
  }

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${quantity} ${selectedVariant.name} ${productData.title}!`)
  }

  return (
    <div className="product-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">{productData.title}</h1>
              <p className="hero-subtitle">{productData.short_description}</p>
              
              {/* Rating */}
              <div className="hero-rating">
                <span className="rating-stars">{getRatingStars(productData.reviews.average_rating)}</span>
                <span className="rating-text">
                  {productData.reviews.average_rating} ({productData.reviews.total_reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="hero-price">
                <span className="current-price">
                  {formatPrice(productData.price.current, productData.price.currency)}
                </span>
                {productData.price.current < productData.price.original && (
                  <>
                    <span className="original-price">
                      {formatPrice(productData.price.original, productData.price.currency)}
                    </span>
                    <span className="discount-badge">
                      {productData.price.discount_percentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Variant Selection */}
              <div className="variant-selection">
                <h3>Choose Color:</h3>
                <div className="variant-options">
                  {productData.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`variant-btn ${selectedVariant.id === variant.id ? 'selected' : ''} ${!variant.in_stock ? 'disabled' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.in_stock}
                    >
                      <div 
                        className="variant-color" 
                        style={{ backgroundColor: variant.color }}
                      />
                      <span>{variant.name}</span>
                      {!variant.in_stock && <span className="out-of-stock">Out of Stock</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="quantity-selection">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="hero-cta">
                <button className="btn btn-primary btn-large" onClick={handleBuyNow}>
                  Buy Now - {formatPrice(productData.price.current * quantity, productData.price.currency)}
                </button>
                <button className="btn btn-secondary btn-large" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="trust-indicators">
                <div className="trust-item">
                  <span className="trust-icon">🚚</span>
                  <span>Free Shipping</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">🔒</span>
                  <span>Secure Payment</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">↩️</span>
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <img 
                src={productData.images[0].url} 
                alt={productData.images[0].alt}
                className="main-product-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <h2 className="section-title">Why Choose {productData.brand}?</h2>
          <div className="benefits-grid">
            {productData.features.map((feature, index) => (
              <div key={index} className="benefit-item">
                <div className="benefit-icon">
                  {index === 0 && '🎧'}
                  {index === 1 && '🔋'}
                  {index === 2 && '🔇'}
                  {index === 3 && '⚡'}
                  {index === 4 && '📱'}
                  {index === 5 && '🎵'}
                  {index === 6 && '🔗'}
                </div>
                <h3 className="benefit-title">{feature}</h3>
                <p className="benefit-description">
                  {index === 0 && 'Experience crystal-clear audio with advanced noise cancellation technology.'}
                  {index === 1 && 'Enjoy up to 30 hours of continuous playback on a single charge.'}
                  {index === 2 && 'Block out distractions with our premium active noise cancellation.'}
                  {index === 3 && 'Get 3 hours of playback with just 5 minutes of quick charging.'}
                  {index === 4 && 'Comfortable padding designed for all-day listening sessions.'}
                  {index === 5 && 'Compact foldable design perfect for travel and storage.'}
                  {index === 6 && 'Seamlessly connect to multiple devices with Bluetooth 5.0.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="reviews-summary">
            <div className="rating-overview">
              <div className="rating-score">{productData.reviews.average_rating}</div>
              <div className="rating-stars-large">{getRatingStars(productData.reviews.average_rating)}</div>
              <div className="rating-count">Based on {productData.reviews.total_reviews} reviews</div>
            </div>
            <div className="rating-breakdown">
              {Object.entries(productData.reviews.rating_distribution).reverse().map(([rating, count]) => (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating}★</span>
                  <div className="rating-progress">
                    <div 
                      className="rating-fill" 
                      style={{ width: `${(count / productData.reviews.total_reviews) * 100}%` }}
                    />
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="reviews-grid">
            {productData.reviews.recent_reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <h4 className="reviewer-name">{review.user_name}</h4>
                    <div className="review-rating">{getRatingStars(review.rating)}</div>
                  </div>
                  <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                </div>
                <h5 className="review-title">{review.title}</h5>
                <p className="review-text">{review.comment}</p>
                {review.verified_purchase && (
                  <div className="verified-badge">✓ Verified Purchase</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="guarantee-section">
        <div className="guarantee-container">
          <div className="guarantee-content">
            <div className="guarantee-icon">🛡️</div>
            <div className="guarantee-text">
              <h2 className="guarantee-title">100% Satisfaction Guarantee</h2>
              <p className="guarantee-description">
                We're confident you'll love your {productData.brand} {productData.title}. 
                If you're not completely satisfied within 30 days, return it for a full refund. 
                No questions asked.
              </p>
              <div className="guarantee-features">
                <div className="guarantee-feature">
                  <span className="feature-icon">✓</span>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="guarantee-feature">
                  <span className="feature-icon">✓</span>
                  <span>Free return shipping</span>
                </div>
                <div className="guarantee-feature">
                  <span className="feature-icon">✓</span>
                  <span>2-year manufacturer warranty</span>
                </div>
                <div className="guarantee-feature">
                  <span className="feature-icon">✓</span>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <div className="final-cta-content">
            <h2 className="final-cta-title">Ready to Experience Premium Audio?</h2>
            <p className="final-cta-subtitle">
              Join thousands of satisfied customers who chose {productData.brand} for their audio needs.
            </p>
            <div className="final-cta-price">
              <span className="final-price">
                {formatPrice(productData.price.current, productData.price.currency)}
              </span>
              {productData.price.current < productData.price.original && (
                <span className="final-original-price">
                  {formatPrice(productData.price.original, productData.price.currency)}
                </span>
              )}
            </div>
            <div className="final-cta-buttons">
              <button className="btn btn-primary btn-large" onClick={handleBuyNow}>
                Order Now - Limited Time Offer!
              </button>
              <button className="btn btn-outline btn-large" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
            <div className="urgency-message">
              ⚡ Only {productData.availability.stock_quantity} left in stock! Order now to secure yours.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductPage
