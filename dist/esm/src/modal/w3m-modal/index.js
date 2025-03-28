var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ConstantsUtil } from '@reown/appkit-common';
import { ApiController, AssetUtil, ChainController, CoreHelperUtil, ModalController, OptionsController, RouterController, SIWXUtil, SnackController, ThemeController } from '@reown/appkit-core';
import { UiHelperUtil, customElement, initializeTheming } from '@reown/appkit-ui';
import styles from './styles.js';
const SCROLL_LOCK = 'scroll-lock';
let W3mModal = class W3mModal extends LitElement {
    constructor() {
        super();
        this.unsubscribe = [];
        this.abortController = undefined;
        this.hasPrefetched = false;
        this.enableEmbedded = OptionsController.state.enableEmbedded;
        this.open = ModalController.state.open;
        this.caipAddress = ChainController.state.activeCaipAddress;
        this.caipNetwork = ChainController.state.activeCaipNetwork;
        this.shake = ModalController.state.shake;
        this.initializeTheming();
        ApiController.prefetchAnalyticsConfig();
        this.unsubscribe.push(...[
            ModalController.subscribeKey('open', val => (val ? this.onOpen() : this.onClose())),
            ModalController.subscribeKey('shake', val => (this.shake = val)),
            ChainController.subscribeKey('activeCaipNetwork', val => this.onNewNetwork(val)),
            ChainController.subscribeKey('activeCaipAddress', val => this.onNewAddress(val)),
            OptionsController.subscribeKey('enableEmbedded', val => (this.enableEmbedded = val))
        ]);
    }
    firstUpdated() {
        AssetUtil.fetchNetworkImage(this.caipNetwork?.assets?.imageId);
        if (this.caipAddress) {
            if (this.enableEmbedded) {
                ModalController.close();
                this.prefetch();
                return;
            }
            this.onNewAddress(this.caipAddress);
        }
        if (this.open) {
            this.onOpen();
        }
        if (this.enableEmbedded) {
            this.prefetch();
        }
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe());
        this.onRemoveKeyboardListener();
    }
    render() {
        this.style.cssText = `
      --local-border-bottom-mobile-radius: ${this.enableEmbedded ? 'clamp(0px, var(--wui-border-radius-l), 44px)' : '0px'};
    `;
        if (this.enableEmbedded) {
            return html `${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `;
        }
        return this.open
            ? html `
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `
            : null;
    }
    contentTemplate() {
        return html ` <wui-card
      shake="${this.shake}"
      data-embedded="${ifDefined(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`;
    }
    async onOverlayClick(event) {
        if (event.target === event.currentTarget) {
            await this.handleClose();
        }
    }
    async handleClose() {
        const isUnsupportedChain = RouterController.state.view === 'UnsupportedChain';
        if (isUnsupportedChain || (await SIWXUtil.isSIWXCloseDisabled())) {
            ModalController.shake();
        }
        else {
            ModalController.close();
        }
    }
    initializeTheming() {
        const { themeVariables, themeMode } = ThemeController.state;
        const defaultThemeMode = UiHelperUtil.getColorTheme(themeMode);
        initializeTheming(themeVariables, defaultThemeMode);
    }
    onClose() {
        this.open = false;
        this.classList.remove('open');
        this.onScrollUnlock();
        SnackController.hide();
        this.onRemoveKeyboardListener();
    }
    onOpen() {
        this.prefetch();
        this.open = true;
        this.classList.add('open');
        this.onScrollLock();
        this.onAddKeyboardListener();
    }
    onScrollLock() {
        const styleTag = document.createElement('style');
        styleTag.dataset['w3m'] = SCROLL_LOCK;
        styleTag.textContent = `
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `;
        document.head.appendChild(styleTag);
    }
    onScrollUnlock() {
        const styleTag = document.head.querySelector(`style[data-w3m="${SCROLL_LOCK}"]`);
        if (styleTag) {
            styleTag.remove();
        }
    }
    onAddKeyboardListener() {
        this.abortController = new AbortController();
        const card = this.shadowRoot?.querySelector('wui-card');
        card?.focus();
        window.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.handleClose();
            }
            else if (event.key === 'Tab') {
                const { tagName } = event.target;
                if (tagName && !tagName.includes('W3M-') && !tagName.includes('WUI-')) {
                    card?.focus();
                }
            }
        }, this.abortController);
    }
    onRemoveKeyboardListener() {
        this.abortController?.abort();
        this.abortController = undefined;
    }
    async onNewAddress(caipAddress) {
        const isSwitchingNamespace = ChainController.state.isSwitchingNamespace;
        const nextConnected = CoreHelperUtil.getPlainAddress(caipAddress);
        const isDisconnectedInSameNamespace = !nextConnected && !isSwitchingNamespace;
        const isSwitchingNamespaceAndConnected = isSwitchingNamespace && nextConnected;
        if (isDisconnectedInSameNamespace) {
            ModalController.close();
        }
        else if (isSwitchingNamespaceAndConnected) {
            RouterController.goBack();
        }
        await SIWXUtil.initializeIfEnabled();
        this.caipAddress = caipAddress;
        ChainController.setIsSwitchingNamespace(false);
    }
    onNewNetwork(nextCaipNetwork) {
        AssetUtil.fetchNetworkImage(nextCaipNetwork?.assets?.imageId);
        const prevCaipNetworkId = this.caipNetwork?.caipNetworkId?.toString();
        const nextNetworkId = nextCaipNetwork?.caipNetworkId?.toString();
        const networkChanged = prevCaipNetworkId && nextNetworkId && prevCaipNetworkId !== nextNetworkId;
        const isSwitchingNamespace = ChainController.state.isSwitchingNamespace;
        const isUnsupportedNetwork = this.caipNetwork?.name === ConstantsUtil.UNSUPPORTED_NETWORK_NAME;
        const isConnectingExternal = RouterController.state.view === 'ConnectingExternal';
        const isNotConnected = !this.caipAddress;
        const isNetworkChangedInSameNamespace = networkChanged && !isUnsupportedNetwork && !isSwitchingNamespace;
        const isUnsupportedNetworkScreen = RouterController.state.view === 'UnsupportedChain';
        if (!isConnectingExternal &&
            (isNotConnected || isUnsupportedNetworkScreen || isNetworkChangedInSameNamespace)) {
            RouterController.goBack();
        }
        this.caipNetwork = nextCaipNetwork;
    }
    prefetch() {
        if (!this.hasPrefetched) {
            this.hasPrefetched = true;
            ApiController.prefetch();
        }
    }
};
W3mModal.styles = styles;
__decorate([
    property({ type: Boolean })
], W3mModal.prototype, "enableEmbedded", void 0);
__decorate([
    state()
], W3mModal.prototype, "open", void 0);
__decorate([
    state()
], W3mModal.prototype, "caipAddress", void 0);
__decorate([
    state()
], W3mModal.prototype, "caipNetwork", void 0);
__decorate([
    state()
], W3mModal.prototype, "shake", void 0);
W3mModal = __decorate([
    customElement('w3m-modal')
], W3mModal);
export { W3mModal };
//# sourceMappingURL=index.js.map