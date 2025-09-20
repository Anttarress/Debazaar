import { Listing, Order, CreateListingData, CreateOrderData } from '../types/telegram';

const API_BASE_URL = process.env.REACT_APP_API_URL || (
    window.location.hostname === 'localhost'
        ? 'http://localhost:8001/api'
        : '/api'  // Use relative path - Caddy proxies this
);

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        console.log('=== HTTP REQUEST ===');
        console.log('URL:', url);
        console.log('Method:', config.method || 'GET');
        console.log('Headers:', config.headers);
        console.log('Body:', config.body);

        const response = await fetch(url, config);

        console.log('=== HTTP RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error Response Body:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Success Response Body:', result);
        return result;
    }

    // Auth
    async telegramAuth(userData: {
        telegram_id: number;
        username?: string;
        first_name?: string;
    }) {
        return this.request<{
            success: boolean;
            user_id: number;
            username: string;
            telegram_id: number;
        }>('/auth/telegram/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Listings
    async getListings(): Promise<{ listings: Listing[] }> {
        return this.request<{ listings: Listing[] }>('/listings/');
    }

    async getListing(id: number): Promise<Listing> {
        return this.request<Listing>(`/listings/${id}/`);
    }

    async createListing(data: CreateListingData): Promise<{
        id: number;
        title: string;
        price: number;
        status: string;
    }> {
        console.log('=== FRONTEND CREATE LISTING START ===');
        console.log('Data being sent:', data);
        console.log('Data stringified:', JSON.stringify(data));

        try {
            const result = await this.request<{
                id: number;
                title: string;
                price: number;
                status: string;
            }>('/listings/', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            console.log('=== FRONTEND CREATE LISTING SUCCESS ===');
            console.log('Response received:', result);
            return result;
        } catch (error) {
            console.log('=== FRONTEND CREATE LISTING ERROR ===');
            console.error('Error:', error);
            throw error;
        }
    }

    // Orders
    async createOrder(data: CreateOrderData): Promise<{
        order_id: string;
        status: string;
        amount: number;
        deadline: string;
        escrow_created: boolean;
    }> {
        return this.request('/orders/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getOrder(orderId: string): Promise<Order> {
        return this.request<Order>(`/orders/${orderId}/`);
    }

    async mockDeposit(orderId: string, buyerAddress: string): Promise<{
        success: boolean;
        status: string;
        tx_hash: string;
    }> {
        return this.request(`/orders/${orderId}/deposit/`, {
            method: 'POST',
            body: JSON.stringify({ buyer_address: buyerAddress }),
        });
    }

    async confirmDelivery(orderId: string): Promise<{
        success: boolean;
        status: string;
    }> {
        return this.request(`/orders/${orderId}/confirm/`, {
            method: 'POST',
        });
    }

    // File upload - convert to base64
    async uploadFile(file: File): Promise<{
        data_url: string;
        filename: string;
        size: number;
    }> {
        // Limit file size to 1MB for base64 storage
        if (file.size > 1 * 1024 * 1024) {
            throw new Error('File too large. Maximum size is 1MB.');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/upload/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} - ${errorText}`);
            }

            return response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Upload failed');
        }
    }
}

export const apiService = new ApiService();

