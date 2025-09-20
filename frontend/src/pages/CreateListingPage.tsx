import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { useTelegram } from '../hooks/useTelegram';

interface CreateListingPageProps {
    onNavigate: (page: string, data?: any) => void;
    onBack: () => void;
}

const categories = [
    { value: 'templates', label: 'Templates' },
    { value: 'graphics', label: 'Graphics' },
    { value: 'photos', label: 'Photos' },
    { value: 'videos', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'fonts', label: 'Fonts' },
    { value: 'ebooks', label: 'E-books' },
    { value: 'courses', label: 'Courses' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' },
];

export const CreateListingPage: React.FC<CreateListingPageProps> = ({
    onNavigate,
    onBack,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'templates',
        currency: 'USDT',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user, showBackButton, hideBackButton, showMainButton, hideMainButton, hapticFeedback } = useTelegram();

    useEffect(() => {
        showBackButton(onBack);
        return () => hideBackButton();
    }, [onBack, showBackButton, hideBackButton]);

    useEffect(() => {
        showMainButton('Create Listing', handleSubmit);
        return () => hideMainButton();
    }, [showMainButton, hideMainButton]);

    useEffect(() => {
        updateMainButton();
    }, [formData, selectedImage, loading, submitted]);

    const updateMainButton = () => {
        const priceValue = parseFloat(formData.price);
        const isPriceValid = !isNaN(priceValue) && priceValue > 0;
        const isFormValid = formData.title && formData.description && isPriceValid && selectedImage && !loading && !submitted;

        const tg = window.Telegram?.WebApp;
        if (tg) {
            if (isFormValid) {
                tg.MainButton.setText(loading ? 'Creating...' : submitted ? 'Success!' : 'Create Listing');
                tg.MainButton.enable();
                tg.MainButton.show();
            } else {
                tg.MainButton.disable();
                tg.MainButton.hide();
            }
        }
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                setError('Image size must be less than 1MB');
                return;
            }

            setSelectedImage(file);
            setError(null);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!user || !selectedImage || loading || submitted) return;

        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.MainButton.disable();
            tg.MainButton.setText('Creating...');
        }

        try {
            setSubmitted(true);
            setLoading(true);
            setError(null);

            // Upload image
            const uploadResponse = await apiService.uploadFile(selectedImage);

            // Validate price
            const priceValue = parseFloat(formData.price);
            if (isNaN(priceValue) || priceValue <= 0) {
                throw new Error('Please enter a valid price greater than 0');
            }

            // Create listing
            const listingData = {
                seller_id: user.id.toString(),
                title: formData.title,
                description: formData.description,
                price: priceValue,
                currency: formData.currency,
                token_address: '0x1234567890123456789012345678901234567890',
                category: formData.category,
                image_data_url: uploadResponse.data_url,
            };

            await apiService.createListing(listingData);
            hapticFeedback('notification', 'success');

            setTimeout(() => {
                onNavigate('home');
            }, 1000);
        } catch (error) {
            console.error('Error creating listing:', error);
            setError(error instanceof Error ? error.message : 'Failed to create listing');
            setSubmitted(false);

            if (tg) {
                tg.MainButton.enable();
                tg.MainButton.setText('Create Listing');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="loading">
                <div>
                    <h2 className="text-xl font-bold mb-2">Creating Your Listing...</h2>
                    <p>Uploading image and setting up your product</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Create New Listing</h1>
                <p className="text-gray-600">Share your digital products with the community</p>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="card mb-4">
                <h3 className="font-semibold mb-3">Product Image</h3>

                {!imagePreview ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded p-8 text-center cursor-pointer"
                    >
                        <div className="text-2xl mb-2">📸</div>
                        <div className="font-semibold mb-1">Add Product Image</div>
                        <div className="text-sm text-gray-600">Click to upload • Max 1MB</div>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-full h-32 object-cover rounded"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedImage(null);
                                setImagePreview(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded w-6 h-6 flex-center"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                />
            </div>

            <div className="card mb-4">
                <h3 className="font-semibold mb-3">Basic Information</h3>

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">Product Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        placeholder="e.g., Premium Photoshop Templates Pack"
                        className="input"
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-600">
                        {formData.title.length}/100 characters
                    </div>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Describe your product..."
                        rows={3}
                        className="input"
                        maxLength={500}
                    />
                    <div className="text-xs text-gray-600">
                        {formData.description.length}/500 characters
                    </div>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => updateFormData('category', e.target.value)}
                        className="input"
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card">
                <h3 className="font-semibold mb-3">Pricing</h3>

                <div className="flex">
                    <div className="flex-1 mr-2">
                        <label className="block text-sm font-semibold mb-1">Price *</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => updateFormData('price', e.target.value)}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            className="input"
                        />
                    </div>
                    <div className="w-24">
                        <label className="block text-sm font-semibold mb-1">Currency</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => updateFormData('currency', e.target.value)}
                            className="input"
                        >
                            <option value="USDT">USDT</option>
                            <option value="USDC">USDC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};