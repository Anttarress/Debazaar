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
        delivery_method: '',
        arbitration_method: '',
        file_hash: '',
        access_duration_days: 30,
        requires_license_key: false,
        seller_id: 1 // Mock seller ID
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
                        placeholder="Price (e.g., 0.001 for BTC, 1.50 for USDT)"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.00000001"
                        min="0"
                        required
                    />

                    <select name="currency" value={formData.currency} onChange={handleChange}>
                        <option value="USDT">USDT (Tether USD)</option>
                        <option value="USDC">USDC (USD Coin)</option>
                        <option value="BTC">BTC (Bitcoin)</option>
                    </select>

                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <optgroup label="📚 Educational Content">
                            <option value="online_courses">Online Courses & Training</option>
                            <option value="ebooks_guides">E-books & Guides</option>
                            <option value="research_reports">Research Reports & Playbooks</option>
                            <option value="cheat_sheets">Cheat Sheets & Templates</option>
                        </optgroup>
                        <optgroup label="🎨 Creative Assets">
                            <option value="graphic_design">Graphic Design Templates</option>
                            <option value="website_themes">Website Themes & UI Kits</option>
                            <option value="stock_media">Stock Photography & Illustrations</option>
                            <option value="video_templates">Video Editing Templates</option>
                        </optgroup>
                        <optgroup label="💻 Software & Development">
                            <option value="code_scripts">Scripts & Code Snippets</option>
                            <option value="dev_tools">Developer Tools & Plugins</option>
                            <option value="extensions">Browser Extensions & Add-ons</option>
                        </optgroup>
                        <optgroup label="📊 Business & Productivity">
                            <option value="spreadsheets">Spreadsheets & Dashboards</option>
                            <option value="business_templates">Business Templates & Documents</option>
                            <option value="marketing_kits">Marketing Kits & Creatives</option>
                            <option value="automation_workflows">Automation Workflows</option>
                        </optgroup>
                        <optgroup label="🛠️ Digital Services">
                            <option value="consulting">Consulting & Advisory</option>
                            <option value="custom_development">Custom Development</option>
                            <option value="design_services">Design Services</option>
                        </optgroup>
                        <option value="other">Other Digital Products</option>
                    </select>

                    <input
                        type="url"
                        name="image_url"
                        placeholder="Image URL (required)"
                        value={formData.image_url}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-field-group">
                        <label className="form-label">Delivery Method</label>
                        <select name="delivery_method" value={formData.delivery_method} onChange={handleChange}>
                            <option value="">Auto-select based on category</option>
                            <option value="file_download">File Download</option>
                            <option value="encrypted_link">Encrypted Download Link</option>
                            <option value="streaming_access">Streaming Access</option>
                            <option value="repository_access">Repository Access</option>
                            <option value="email_delivery">Email Delivery</option>
                            <option value="custom_delivery">Custom Delivery Method</option>
                        </select>
                    </div>

                    <div className="form-field-group">
                        <label className="form-label">Dispute Resolution Method</label>
                        <select name="arbitration_method" value={formData.arbitration_method} onChange={handleChange}>
                            <option value="">Auto-select based on category</option>
                            <option value="file_hash_verification">File Hash Verification</option>
                            <option value="content_audit">Content Audit</option>
                            <option value="usage_verification">Usage Verification</option>
                            <option value="expert_review">Expert Review</option>
                            <option value="community_voting">Community Voting</option>
                            <option value="automated_testing">Automated Testing</option>
                        </select>
                    </div>

                    <div className="form-field-group">
                        <label className="form-label">File Hash (SHA-256)</label>
                        <input
                            type="text"
                            name="file_hash"
                            placeholder="Enter SHA-256 hash for file verification"
                            value={formData.file_hash}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field-group">
                        <label className="form-label">Access Duration</label>
                        <input
                            type="number"
                            name="access_duration_days"
                            placeholder="e.g., 30 (days buyer can access content)"
                            value={formData.access_duration_days}
                            onChange={handleChange}
                            min="1"
                            max="365"
                        />
                    </div>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="requires_license_key"
                            checked={formData.requires_license_key}
                            onChange={handleChange}
                        />
                        Requires License Key
                    </label>

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
