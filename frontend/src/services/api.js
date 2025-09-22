
const API_BASE = 'https://debazaar.click/api';

export const api = {
    // Get all listings
    getListings: async () => {
        console.log('here in this function');
        const url = `${API_BASE}/listings/`;
        console.log('url: ', url);
        const response = await fetch(url);
        console.log(response);
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
