import { LitElement } from 'lit';
import { type CaipNetwork } from '@reown/appkit-common';
export declare class W3mWalletSendDetails extends LitElement {
    static styles: import("lit").CSSResult;
    receiverAddress?: string;
    caipNetwork?: CaipNetwork;
    networkFee?: number;
    render(): import("lit").TemplateResult<1>;
    private networkTemplate;
    private onNetworkClick;
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-wallet-send-details': W3mWalletSendDetails;
    }
}
