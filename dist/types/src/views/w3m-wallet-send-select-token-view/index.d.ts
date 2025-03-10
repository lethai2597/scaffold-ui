import { LitElement } from 'lit';
export declare class W3mSendSelectTokenView extends LitElement {
    static styles: import("lit").CSSResult;
    private unsubscribe;
    private tokenBalances;
    private tokens?;
    private filteredTokens?;
    private search;
    constructor();
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
    private templateSearchInput;
    private templateTokens;
    private onBuyClick;
    private onInputChange;
    private onDebouncedSearch;
    private handleTokenClick;
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-wallet-send-select-token-view': W3mSendSelectTokenView;
    }
}
