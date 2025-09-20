// Telegram Mini App types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          link_color: string;
          button_color: string;
          button_text_color: string;
          secondary_bg_color: string;
          hint_color: string;
          bg_color: string;
          text_color: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface Listing {
  id: number;
  title: string;
  price: number;
  currency: string;
  category: string;
  seller: string;
  seller_rating: number;
  created_at: string;
  description?: string;
  metadata_cid?: string;
  image_url?: string;
  image_cid?: string;
}

export interface Order {
  order_id: string;
  listing: {
    title: string;
    price: number;
  };
  buyer: string;
  seller: string;
  amount: number;
  status: 'created' | 'paid' | 'delivered' | 'confirmed' | 'disputed' | 'completed' | 'cancelled';
  delivery_cid?: string;
  created_at: string;
  deadline: string;
}

export interface CreateListingData {
  seller_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  token_address: string;
  category: string;
  metadata_cid?: string;
  image_data_url?: string;
}

export interface CreateOrderData {
  listing_id: number;
  buyer_id: string;
  amount: number;
  token_address: string;
}
