import React, { useState } from 'react';

const AddProductForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'USDT',
        category: '',
        image_url: '',
        token_address: '0x0000000000000000000000000000000000000000',
        seller_id: 1 // Mock seller ID
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Product</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Product Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        required
                    />

                    <select name="currency" value={formData.currency} onChange={handleChange}>
                        <option value="USDT">USDT</option>
                        <option value="ETH">ETH</option>
                        <option value="BTC">BTC</option>
                    </select>

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
