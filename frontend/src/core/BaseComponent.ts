import React from 'react';

export interface BaseComponentProps {
    // Base props for all components
}

export abstract class BaseComponent<P extends BaseComponentProps = BaseComponentProps, S = {}> extends React.Component<P, S> {
    protected get telegram() {
        return window.Telegram?.WebApp;
    }
}
