import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            {product.image_url && (
                <img src={product.image_url} alt={product.title} className="product-image" />
            )}
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                    <span className="product-price">${product.price} {product.currency}</span>
                    <span className="product-seller">by {product.seller.username}</span>
                </div>
                <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className="product-rating">★ {product.seller_rating.toFixed(1)}</span>
                </div>
                <div className="product-actions">
                    <button className="buy-now-btn">Buy It Now</button>
                    <button className="watch-btn">Watch</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
