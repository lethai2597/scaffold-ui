import { LitElement } from 'lit';
import type { WuiAccountButton } from '@reown/appkit-ui';
declare class W3mAccountButtonBase extends LitElement {
    private unsubscribe;
    disabled?: WuiAccountButton['disabled'];
    balance?: 'show' | 'hide';
    charsStart?: WuiAccountButton['charsStart'];
    charsEnd?: WuiAccountButton['charsEnd'];
    private caipAddress;
    private balanceVal;
    private balanceSymbol;
    private profileName;
    private profileImage;
    private network;
    private networkImage;
    private isSupported;
    constructor();
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1> | null;
    private onClick;
}
export declare class W3mAccountButton extends W3mAccountButtonBase {
}
export declare class AppKitAccountButton extends W3mAccountButtonBase {
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-account-button': W3mAccountButton;
        'appkit-account-button': AppKitAccountButton;
    }
}
export {};
