
const API_BASE = process.env.REACT_APP_API_URL || 'https://debazaar.click/api';

export const api = {
    // Get all listings
    getListings: async () => {
        const response = await fetch(`${API_BASE}/listings/`);
        if (!response.ok) throw new Error('Failed to fetch listings');
        return response.json();
    },

    createListing: async (listingData) => {
        const response = await fetch(`${API_BASE}/listings/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listingData)
        });
        if (!response.ok) throw new Error('Failed to create listing');
        return response.json();
    }
};
