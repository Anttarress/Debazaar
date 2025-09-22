import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './components/ProductCard';
import AddProductForm from './components/AddProductForm';
import ProductDetailModal from './components/ProductDetailModal';
import { api } from './services/api';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [telegramUser, setTelegramUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        // Initialize Telegram WebApp
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;

            // Expand the app to full height
            tg.expand();

            // Get user data from Telegram
            if (tg.initDataUnsafe?.user) {
                const user = tg.initDataUnsafe.user;
                setTelegramUser(user);

                // Authenticate with your backend
                authenticateWithTelegram(user);
            }

            // Set theme colors
            tg.setHeaderColor('#2563eb');
            tg.setBackgroundColor('#ffffff');
        }

        loadProducts();
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const authenticateWithTelegram = async (user) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://debazaar.click/api'}/auth/telegram/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegram_id: user.id,
                    username: user.username,
                    first_name: user.first_name
                })
            });

            if (response.ok) {
                const authData = await response.json();
                console.log('Authenticated:', authData);
                // Store user session data if needed
            }
        } catch (err) {
            console.error('Telegram auth failed:', err);
        }
    };

    const loadProducts = async (searchParams = {}) => {
        try {
            setLoading(true);
            console.log('Loading products with params:', searchParams);
            const data = await api.getListings(searchParams);
            console.log('data: ', data);
            setProducts(data.listings || []);
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (productData) => {
        try {
            // Add telegram user ID to the product data
            const listingData = {
                ...productData,
                seller_id: telegramUser?.id || 1 // Use Telegram ID or fallback
            };
            await api.createListing(listingData);
            setShowAddForm(false);
            loadProducts(); // Refresh the product list
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Failed to add product. Please try again.');
        }
    };

    const handleWatchClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseProductDetail = () => {
        setSelectedProduct(null);
    };

    // Debounced search function
    const debouncedSearch = useCallback((query) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            const searchParams = query.trim() ? { search: query } : {};
            loadProducts(searchParams);
        }, 300); // 300ms delay

        setSearchTimeout(timeout);
    }, [searchTimeout]);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle search button click (optional - for immediate search)
    const handleSearchClick = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const searchParams = searchQuery.trim() ? { search: searchQuery } : {};
        loadProducts(searchParams);
    };

    return (
        <div className="app">
            <div className="header">
                <div className="header-left">
                    <h1>DeBazaar</h1>
                    {telegramUser && (
                        <div className="user-info">
                            Hi {telegramUser.first_name}!
                        </div>
                    )}
                </div>
                <div className="header-center">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button
                            className="search-btn"
                            onClick={handleSearchClick}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <button
                        className="sell-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        Sell
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onWatchClick={handleWatchClick}
                        />
                    ))}
                </div>
            )}

            {showAddForm && (
                <AddProductForm
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handleAddProduct}
                />
            )}

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={handleCloseProductDetail}
                />
            )}
        </div>
    );
}

export default App;
