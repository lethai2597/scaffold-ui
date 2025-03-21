import { LitElement } from 'lit';
import type { Balance } from '@reown/appkit-common';
export declare class W3mInputToken extends LitElement {
    static styles: import("lit").CSSResult;
    token?: Balance;
    sendTokenAmount?: number;
    gasPriceInUSD?: number;
    gasPrice?: number;
    render(): import("lit").TemplateResult<1>;
    private buttonTemplate;
    private handleSelectButtonClick;
    private sendValueTemplate;
    private maxAmountTemplate;
    private actionTemplate;
    private onInputChange;
    private onMaxClick;
    private onBuyClick;
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-input-token': W3mInputToken;
    }
}
