import { LitElement } from 'lit';
import type { WuiConnectButton } from '@reown/appkit-ui';
declare class W3mConnectButtonBase extends LitElement {
    private unsubscribe;
    size?: WuiConnectButton['size'];
    label?: string | undefined;
    loadingLabel?: string | undefined;
    private open;
    private loading;
    constructor();
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
    private onClick;
}
export declare class W3mConnectButton extends W3mConnectButtonBase {
}
export declare class AppKitConnectButton extends W3mConnectButtonBase {
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-connect-button': W3mConnectButton;
        'appkit-connect-button': AppKitConnectButton;
    }
}
export {};
