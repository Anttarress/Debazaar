import { useState, useEffect } from 'react';
import { TelegramUser } from '../types/telegram';

export const useTelegram = () => {
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (tg) {
            tg.ready();
            setIsReady(true);

            if (tg.initDataUnsafe?.user) {
                setUser(tg.initDataUnsafe.user);
            }

            tg.expand();
        }
    }, []);

    const showMainButton = (text: string, onClick: () => void) => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.MainButton.setText(text);
            tg.MainButton.show();
            tg.MainButton.onClick(onClick);
        }
    };

    const hideMainButton = () => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.MainButton.hide();
        }
    };

    const showBackButton = (onClick: () => void) => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.show();
            tg.BackButton.onClick(onClick);
        }
    };

    const hideBackButton = () => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.hide();
        }
    };

    const hapticFeedback = (type: 'impact' | 'notification' | 'selection', style?: string) => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            switch (type) {
                case 'impact':
                    tg.HapticFeedback.impactOccurred(style as any || 'medium');
                    break;
                case 'notification':
                    tg.HapticFeedback.notificationOccurred(style as any || 'success');
                    break;
                case 'selection':
                    tg.HapticFeedback.selectionChanged();
                    break;
            }
        }
    };

    const showAlert = (message: string) => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.showAlert(message);
        } else {
            alert(message);
        }
    };

    const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.showConfirm(message, callback);
        } else {
            callback(window.confirm(message));
        }
    };

    return {
        user,
        isReady,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
        hapticFeedback,
        showAlert,
        showConfirm,
    };
};
