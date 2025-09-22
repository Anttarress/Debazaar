import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AddProductForm from './components/AddProductForm';
import { api } from './services/api';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [telegramUser, setTelegramUser] = useState(null);

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

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getListings();
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

    return (
        <div className="app">
            <div className="header">
                <div className="header-content">
                    <h1>Crypto Marketplace</h1>
                    {telegramUser && (
                        <div className="user-info">
                            Welcome, {telegramUser.first_name}!
                        </div>
                    )}
                </div>
                <button
                    className="add-product-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Product
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {showAddForm && (
                <AddProductForm
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handleAddProduct}
                />
            )}
        </div>
    );
}

export default App;
