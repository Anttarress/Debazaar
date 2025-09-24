import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { api } from '../services/api';
import './MyProductsModal.css';

const MyProductsModal = ({ onClose, telegramUser, authUser, onProductClick }) => {
    const [userProducts, setUserProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUserProducts();
    }, [authUser, telegramUser]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadUserProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const userId = authUser?.user_id || telegramUser?.id;

            if (!userId) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            const data = await api.getUserProducts(userId);
            setUserProducts(data.listings || []);
        } catch (err) {
            console.error('Error loading user products:', err);
            setError('Failed to load your products');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const renderEmptyState = () => (
        <div className="empty-products-state">
            <div className="empty-icon">📦</div>
            <h3>You don't have any products yet</h3>
            <p>Start selling by creating your first product listing!</p>
            <button
                className="start-selling-btn"
                onClick={onClose}
            >
                Start Selling
            </button>
        </div>
    );

    const renderProductsList = () => (
        <div className="my-products-grid">
            {userProducts.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onWatchClick={onProductClick}
                />
            ))}
        </div>
    );

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="my-products-modal">
                <div className="modal-header">
                    <h2>My Products</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>


                <div className="modal-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner">⏳</div>
                            <p>Loading your products...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <div className="error-icon">⚠️</div>
                            <p>{error}</p>
                            <button
                                className="retry-btn"
                                onClick={loadUserProducts}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : userProducts.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <>
                            <div className="products-header">
                                <p>{userProducts.length} product{userProducts.length !== 1 ? 's' : ''} found</p>
                            </div>
                            {renderProductsList()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProductsModal;
