import { Listing } from '../types/telegram';

export type AppPage = 'home' | 'listing' | 'checkout' | 'order' | 'create';

export interface AppState {
  page: AppPage;
  data?: any;
}

export class AppStateManager {
  private state: AppState;
  private setState: (state: AppState) => void;

  constructor(initialState: AppState, setState: (state: AppState) => void) {
    this.state = initialState;
    this.setState = setState;
  }

  navigateToHome = () => {
    this.setState({ page: 'home' });
  };

  navigateToListing = (listingId: number) => {
    this.setState({ page: 'listing', data: { listingId } });
  };

  navigateToCheckout = (listing: Listing) => {
    this.setState({ page: 'checkout', data: { listing } });
  };

  navigateToOrder = (orderId: string) => {
    this.setState({ page: 'order', data: { orderId } });
  };

  navigateToCreate = () => {
    this.setState({ page: 'create' });
  };

  getCurrentPage = (): AppPage => this.state.page;
  getCurrentData = (): any => this.state.data;
}




