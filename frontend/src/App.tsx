import React, { useState, useEffect } from 'react';
import { AppStateManager, AppState } from './core/AppState';
import { HomePage } from './pages/HomePage';
import { CreateListingPage } from './pages/CreateListingPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { useTelegram } from './hooks/useTelegram';
import { apiService } from './services/api';
import './styles/simple.css';

interface AppProps { }

function App() {
    const [appState, setAppState] = useState<AppState>({ page: 'home' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);
    const { showMainButton, hideMainButton } = useTelegram();

    const stateManager = new AppStateManager(appState, setAppState);

    useEffect(() => {
        initializeTelegram();
    }, []);

    const initializeTelegram = () => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            setIsReady(true);

            if (tg.initDataUnsafe?.user) {
                setUser(tg.initDataUnsafe.user);
                authenticateUser(tg.initDataUnsafe.user);
            }
            tg.expand();
        }
    };

    const authenticateUser = async (user: any) => {
        try {
            await apiService.telegramAuth({
                telegram_id: user.id,
                username: user.username,
                first_name: user.first_name,
            });
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    };

    const handleNavigate = (page: string, data?: any) => {
        switch (page) {
            case 'home':
                stateManager.navigateToHome();
                break;
            case 'listing':
                stateManager.navigateToListing(data.listingId);
                break;
            case 'checkout':
                stateManager.navigateToCheckout(data.listing);
                break;
            case 'order':
                stateManager.navigateToOrder(data.orderId);
                break;
            case 'create':
                stateManager.navigateToCreate();
                break;
        }
    };

    const handleBack = () => {
        const { page } = appState;
        switch (page) {
            case 'listing':
            case 'checkout':
            case 'create':
                stateManager.navigateToHome();
                break;
            case 'order':
                stateManager.navigateToHome();
                break;
            default:
                stateManager.navigateToHome();
        }
    };

    if (!isReady) {
        return (
            <div className="loading">
                <div>Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container text-center">
                <h1 className="text-2xl font-bold mb-4">Crypto Marketplace</h1>
                <p>Please open this app from Telegram</p>
            </div>
        );
    }

    return (
        <div className="container">
            {appState.page === 'home' && (
                <HomePage
                    onNavigate={handleNavigate}
                    onBack={handleBack}
                />
            )}

            {appState.page === 'create' && (
                <CreateListingPage
                    onNavigate={handleNavigate}
                    onBack={handleBack}
                />
            )}

            {appState.page === 'listing' && (
                <ListingDetailPage
                    listingId={appState.data?.listingId}
                    onNavigate={handleNavigate}
                    onBack={handleBack}
                />
            )}

            {appState.page === 'checkout' && (
                <CheckoutPage
                    listing={appState.data?.listing}
                    onNavigate={handleNavigate}
                    onBack={handleBack}
                />
            )}

            {appState.page === 'order' && (
                <div className="text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <h2 className="text-xl font-bold mb-2">Order Created!</h2>
                    <p className="mb-4">Order ID: {appState.data?.orderId?.slice(0, 10)}...</p>
                    <button onClick={() => handleNavigate('home')} className="button">
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;