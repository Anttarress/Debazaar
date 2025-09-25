import React from 'react';
import { formatPriceWithCurrency } from '../utils/priceFormatter';

const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="product-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="product-detail-header">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="product-detail-content">
                    <div className="product-detail-left">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.title} className="product-detail-image" />
                        ) : (
                            <div className="product-detail-placeholder">No Image Available</div>
                        )}
                    </div>

                    <div className="product-detail-right">
                        <div className="product-detail-info">
                            <h2 className="product-detail-title">{product.title}</h2>

                            <div className="product-detail-price">
                                <span className="current-price">{formatPriceWithCurrency(product.price, product.currency)}</span>
                            </div>

                            <div className="product-detail-seller">
                                <div className="seller-info">
                                    <span className="seller-name">Sold by: {product.seller.username}</span>
                                    <span className="seller-rating">★ {product.seller_rating.toFixed(1)} rating</span>
                                </div>
                            </div>

                            <div className="product-detail-category">
                                <span className="category-label">Category:</span>
                                <span className="category-value">{product.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </div>

                            <div className="product-detail-payment">
                                <span className="payment-label">Payment Method:</span>
                                <span className="payment-value">{product.payment_method === 'escrow' ? 'Using escrow' : 'Direct'}</span>
                            </div>

                            <div className="product-detail-arbitration">
                                <span className="arbitration-label">Dispute Resolution:</span>
                                <span className="arbitration-value">{product.arbitration_method?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'File Hash Verification'}</span>
                            </div>

                            {product.access_duration_days && (
                                <div className="product-detail-access">
                                    <span className="access-label">Access Duration:</span>
                                    <span className="access-value">{product.access_duration_days} days</span>
                                </div>
                            )}

                            {product.requires_license_key && (
                                <div className="product-detail-license">
                                    <span className="license-badge">🔑 License Key Required</span>
                                </div>
                            )}

                            <div className="product-detail-description">
                                <h3>Description</h3>
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="product-detail-actions">
                            <button className="buy-button-large">Buy It Now</button>
                            <button className="add-to-cart-button">Add to Cart</button>
                            <button className="watch-button-large">Add to Watchlist</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;

