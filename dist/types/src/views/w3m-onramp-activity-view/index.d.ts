import { LitElement } from 'lit';
export declare class W3mOnRampActivityView extends LitElement {
    static styles: import("lit").CSSResult;
    private unsubscribe;
    private refetchTimeout?;
    protected selectedOnRampProvider: import("@reown/appkit-core").OnRampProvider | null;
    protected loading: boolean;
    private coinbaseTransactions;
    private tokenImages;
    constructor();
    render(): import("lit").TemplateResult<1>;
    private templateTransactions;
    private templateTransactionsByYear;
    private fetchTransactions;
    private fetchCoinbaseTransactions;
    private refetchLoadingTransactions;
    private templateLoading;
}
declare global {
    interface HTMLElementTagNameMap {
        'w3m-onramp-activity-view': W3mOnRampActivityView;
    }
}
