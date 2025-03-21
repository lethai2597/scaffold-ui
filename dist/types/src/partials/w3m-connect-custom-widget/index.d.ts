import { LitElement } from 'lit';
export declare class W3mConnectCustomWidget extends LitElement {
    private unsubscribe;
    tabIdx?: number;
    private connectors;
    private loading;
    constructor();
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1> | null;
    private filterOutDuplicateWallets;
    private onConnectWallet;
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-connect-custom-widget': W3mConnectCustomWidget;
    }
}
