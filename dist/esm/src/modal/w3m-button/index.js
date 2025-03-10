var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ChainController, ModalController } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
import styles from './styles.js';
class W3mButtonBase extends LitElement {
    constructor() {
        super(...arguments);
        this.unsubscribe = [];
        this.disabled = false;
        this.balance = undefined;
        this.size = undefined;
        this.label = undefined;
        this.loadingLabel = undefined;
        this.charsStart = 4;
        this.charsEnd = 6;
        this.caipAddress = ChainController.state.activeCaipAddress;
        this.isLoading = ModalController.state.loading;
    }
    firstUpdated() {
        this.unsubscribe.push(ChainController.subscribeKey('activeCaipAddress', val => (this.caipAddress = val)), ModalController.subscribeKey('loading', val => (this.isLoading = val)));
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe());
    }
    render() {
        return this.caipAddress && !this.isLoading
            ? html `
          <appkit-account-button
            .disabled=${Boolean(this.disabled)}
            balance=${ifDefined(this.balance)}
            .charsStart=${ifDefined(this.charsStart)}
            .charsEnd=${ifDefined(this.charsEnd)}
          >
          </appkit-account-button>
        `
            : html `
          <appkit-connect-button
            size=${ifDefined(this.size)}
            label=${ifDefined(this.label)}
            loadingLabel=${ifDefined(this.loadingLabel)}
          ></appkit-connect-button>
        `;
    }
}
W3mButtonBase.styles = styles;
__decorate([
    property({ type: Boolean })
], W3mButtonBase.prototype, "disabled", void 0);
__decorate([
    property()
], W3mButtonBase.prototype, "balance", void 0);
__decorate([
    property()
], W3mButtonBase.prototype, "size", void 0);
__decorate([
    property()
], W3mButtonBase.prototype, "label", void 0);
__decorate([
    property()
], W3mButtonBase.prototype, "loadingLabel", void 0);
__decorate([
    property()
], W3mButtonBase.prototype, "charsStart", void 0);
__decorate([
    property()
], W3mButtonBase.prototype, "charsEnd", void 0);
__decorate([
    state()
], W3mButtonBase.prototype, "caipAddress", void 0);
__decorate([
    state()
], W3mButtonBase.prototype, "isLoading", void 0);
let W3mButton = class W3mButton extends W3mButtonBase {
};
W3mButton = __decorate([
    customElement('w3m-button')
], W3mButton);
export { W3mButton };
let AppKitButton = class AppKitButton extends W3mButtonBase {
};
AppKitButton = __decorate([
    customElement('appkit-button')
], AppKitButton);
export { AppKitButton };
//# sourceMappingURL=index.js.map