var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { NumberUtil } from '@reown/appkit-common';
import { AccountController, ChainController, CoreHelperUtil, EventsController, ModalController, RouterController, SwapController } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
import { W3mFrameRpcConstants } from '@reown/appkit-wallet';
import styles from './styles.js';
let W3mSwapView = class W3mSwapView extends LitElement {
    constructor() {
        super();
        this.unsubscribe = [];
        this.detailsOpen = false;
        this.caipNetworkId = ChainController.state.activeCaipNetwork?.caipNetworkId;
        this.initialized = SwapController.state.initialized;
        this.loadingQuote = SwapController.state.loadingQuote;
        this.loadingPrices = SwapController.state.loadingPrices;
        this.loadingTransaction = SwapController.state.loadingTransaction;
        this.sourceToken = SwapController.state.sourceToken;
        this.sourceTokenAmount = SwapController.state.sourceTokenAmount;
        this.sourceTokenPriceInUSD = SwapController.state.sourceTokenPriceInUSD;
        this.toToken = SwapController.state.toToken;
        this.toTokenAmount = SwapController.state.toTokenAmount;
        this.toTokenPriceInUSD = SwapController.state.toTokenPriceInUSD;
        this.inputError = SwapController.state.inputError;
        this.gasPriceInUSD = SwapController.state.gasPriceInUSD;
        this.fetchError = SwapController.state.fetchError;
        this.onDebouncedGetSwapCalldata = CoreHelperUtil.debounce(async () => {
            await SwapController.swapTokens();
        }, 200);
        ChainController.subscribeKey('activeCaipNetwork', newCaipNetwork => {
            if (this.caipNetworkId !== newCaipNetwork?.caipNetworkId) {
                this.caipNetworkId = newCaipNetwork?.caipNetworkId;
                SwapController.resetState();
                SwapController.initializeState();
            }
        });
        this.unsubscribe.push(...[
            ModalController.subscribeKey('open', isOpen => {
                if (!isOpen) {
                    SwapController.resetState();
                }
            }),
            RouterController.subscribeKey('view', newRoute => {
                if (!newRoute.includes('Swap')) {
                    SwapController.resetValues();
                }
            }),
            SwapController.subscribe(newState => {
                this.initialized = newState.initialized;
                this.loadingQuote = newState.loadingQuote;
                this.loadingPrices = newState.loadingPrices;
                this.loadingTransaction = newState.loadingTransaction;
                this.sourceToken = newState.sourceToken;
                this.sourceTokenAmount = newState.sourceTokenAmount;
                this.sourceTokenPriceInUSD = newState.sourceTokenPriceInUSD;
                this.toToken = newState.toToken;
                this.toTokenAmount = newState.toTokenAmount;
                this.toTokenPriceInUSD = newState.toTokenPriceInUSD;
                this.inputError = newState.inputError;
                this.gasPriceInUSD = newState.gasPriceInUSD;
                this.fetchError = newState.fetchError;
            })
        ]);
    }
    firstUpdated() {
        SwapController.initializeState();
        this.watchTokensAndValues();
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe?.());
        clearInterval(this.interval);
    }
    render() {
        return html `
      <wui-flex flexDirection="column" .padding=${['0', 'l', 'l', 'l']} gap="s">
        ${this.initialized ? this.templateSwap() : this.templateLoading()}
      </wui-flex>
    `;
    }
    watchTokensAndValues() {
        this.interval = setInterval(() => {
            SwapController.getNetworkTokenPrice();
            SwapController.getMyTokensWithBalance();
            SwapController.swapTokens();
        }, 10_000);
    }
    templateSwap() {
        return html `
      <wui-flex flexDirection="column" gap="s">
        <wui-flex flexDirection="column" alignItems="center" gap="xs" class="swap-inputs-container">
          ${this.templateTokenInput('sourceToken', this.sourceToken)}
          ${this.templateTokenInput('toToken', this.toToken)} ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateDetails()} ${this.templateActionButton()}
      </wui-flex>
    `;
    }
    actionButtonLabel() {
        if (this.fetchError) {
            return 'Swap';
        }
        if (!this.sourceToken || !this.toToken) {
            return 'Select token';
        }
        if (!this.sourceTokenAmount) {
            return 'Enter amount';
        }
        if (this.inputError) {
            return this.inputError;
        }
        return 'Review swap';
    }
    templateReplaceTokensButton() {
        return html `
      <wui-flex class="replace-tokens-button-container">
        <button @click=${this.onSwitchTokens.bind(this)}>
          <wui-icon name="recycleHorizontal" color="fg-250" size="lg"></wui-icon>
        </button>
      </wui-flex>
    `;
    }
    templateLoading() {
        return html `
      <wui-flex flexDirection="column" gap="l">
        <wui-flex flexDirection="column" alignItems="center" gap="xs" class="swap-inputs-container">
          <w3m-swap-input-skeleton target="sourceToken"></w3m-swap-input-skeleton>
          <w3m-swap-input-skeleton target="toToken"></w3m-swap-input-skeleton>
          ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateActionButton()}
      </wui-flex>
    `;
    }
    templateTokenInput(target, token) {
        const myToken = SwapController.state.myTokensWithBalance?.find(ct => ct?.address === token?.address);
        const amount = target === 'toToken' ? this.toTokenAmount : this.sourceTokenAmount;
        const price = target === 'toToken' ? this.toTokenPriceInUSD : this.sourceTokenPriceInUSD;
        const marketValue = NumberUtil.parseLocalStringToNumber(amount) * price;
        return html `<w3m-swap-input
      .value=${target === 'toToken' ? this.toTokenAmount : this.sourceTokenAmount}
      .disabled=${target === 'toToken'}
      .onSetAmount=${this.handleChangeAmount.bind(this)}
      target=${target}
      .token=${token}
      .balance=${myToken?.quantity?.numeric}
      .price=${myToken?.price}
      .marketValue=${marketValue}
      .onSetMaxValue=${this.onSetMaxValue.bind(this)}
    ></w3m-swap-input>`;
    }
    onSetMaxValue(target, balance) {
        const token = target === 'sourceToken' ? this.sourceToken : this.toToken;
        const isNetworkToken = token?.address === ChainController.getActiveNetworkTokenAddress();
        let value = '0';
        if (!balance) {
            value = '0';
            this.handleChangeAmount(target, value);
            return;
        }
        if (!this.gasPriceInUSD) {
            value = balance;
            this.handleChangeAmount(target, value);
            return;
        }
        const amountOfTokenGasRequires = NumberUtil.bigNumber(this.gasPriceInUSD.toFixed(5)).div(this.sourceTokenPriceInUSD);
        const maxValue = isNetworkToken
            ? NumberUtil.bigNumber(balance).minus(amountOfTokenGasRequires)
            : NumberUtil.bigNumber(balance);
        this.handleChangeAmount(target, maxValue.gt(0) ? maxValue.toFixed(20) : '0');
    }
    templateDetails() {
        if (!this.sourceToken || !this.toToken || this.inputError) {
            return null;
        }
        return html `<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`;
    }
    handleChangeAmount(target, value) {
        SwapController.clearError();
        if (target === 'sourceToken') {
            SwapController.setSourceTokenAmount(value);
        }
        else {
            SwapController.setToTokenAmount(value);
        }
        this.onDebouncedGetSwapCalldata();
    }
    templateActionButton() {
        const haveNoTokenSelected = !this.toToken || !this.sourceToken;
        const haveNoAmount = !this.sourceTokenAmount;
        const loading = this.loadingQuote || this.loadingPrices || this.loadingTransaction;
        const disabled = loading || haveNoTokenSelected || haveNoAmount || this.inputError;
        return html ` <wui-flex gap="xs">
      <wui-button
        data-testid="swap-action-button"
        class="action-button"
        fullWidth
        size="lg"
        borderRadius="xs"
        variant=${haveNoTokenSelected ? 'neutral' : 'main'}
        .loading=${loading}
        .disabled=${disabled}
        @click=${this.onSwapPreview.bind(this)}
      >
        ${this.actionButtonLabel()}
      </wui-button>
    </wui-flex>`;
    }
    onSwitchTokens() {
        SwapController.switchTokens();
    }
    onSwapPreview() {
        if (this.fetchError) {
            SwapController.swapTokens();
            return;
        }
        EventsController.sendEvent({
            type: 'track',
            event: 'INITIATE_SWAP',
            properties: {
                network: this.caipNetworkId || '',
                swapFromToken: this.sourceToken?.symbol || '',
                swapToToken: this.toToken?.symbol || '',
                swapFromAmount: this.sourceTokenAmount || '',
                swapToAmount: this.toTokenAmount || '',
                isSmartAccount: AccountController.state.preferredAccountType ===
                    W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT
            }
        });
        RouterController.push('SwapPreview');
    }
};
W3mSwapView.styles = styles;
__decorate([
    state()
], W3mSwapView.prototype, "interval", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "detailsOpen", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "caipNetworkId", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "initialized", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "loadingQuote", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "loadingPrices", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "loadingTransaction", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "sourceToken", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "sourceTokenAmount", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "sourceTokenPriceInUSD", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "toToken", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "toTokenAmount", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "toTokenPriceInUSD", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "inputError", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "gasPriceInUSD", void 0);
__decorate([
    state()
], W3mSwapView.prototype, "fetchError", void 0);
W3mSwapView = __decorate([
    customElement('w3m-swap-view')
], W3mSwapView);
export { W3mSwapView };
//# sourceMappingURL=index.js.map