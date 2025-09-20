import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export interface BasePageProps extends BaseComponentProps {
  onBack?: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

export abstract class BasePage<P extends BasePageProps = BasePageProps, S = {}> extends BaseComponent<P, S> {
  componentDidMount() {
    if (this.props.onBack && this.telegram) {
      this.telegram.BackButton.onClick(this.props.onBack);
      this.telegram.BackButton.show();
    }
  }

  componentWillUnmount() {
    if (this.telegram) {
      this.telegram.BackButton.hide();
      this.telegram.MainButton.hide();
    }
  }

  protected navigate = (page: string, data?: any) => {
    if (this.props.onNavigate) {
      this.props.onNavigate(page, data);
    }
  };

  protected goBack = () => {
    if (this.props.onBack) {
      this.props.onBack();
    }
  };
}

