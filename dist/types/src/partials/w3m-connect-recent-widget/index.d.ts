import { LitElement } from 'lit';
export declare class W3mConnectRecentWidget extends LitElement {
    private unsubscribe;
    tabIdx?: number;
    private connectors;
    private loading;
    constructor();
    render(): import("lit").TemplateResult<1> | null;
    private onConnectWallet;
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-connect-recent-widget': W3mConnectRecentWidget;
    }
}
