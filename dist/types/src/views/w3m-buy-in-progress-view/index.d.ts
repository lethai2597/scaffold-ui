import { LitElement } from 'lit';
export declare class W3mBuyInProgressView extends LitElement {
    static styles: import("lit").CSSResult;
    private unsubscribe;
    private intervalId?;
    protected selectedOnRampProvider: import("@reown/appkit-core").OnRampProvider | null;
    protected uri: string | undefined;
    protected ready: boolean;
    private showRetry;
    buffering: boolean;
    private error;
    private startTime;
    isMobile: boolean;
    onRetry?: (() => void) | (() => Promise<void>);
    constructor();
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
    private watchTransactions;
    private initializeCoinbaseTransactions;
    private watchCoinbaseTransactions;
    private onTryAgain;
    private tryAgainTemplate;
    private loaderTemplate;
    private onCopyUri;
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-buy-in-progress-view': W3mBuyInProgressView;
    }
}
