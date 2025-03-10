var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { OptionsController } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
import styles from './styles.js';
let W3mConnectSocialsView = class W3mConnectSocialsView extends LitElement {
    constructor() {
        super(...arguments);
        this.checked = false;
    }
    render() {
        const { termsConditionsUrl, privacyPolicyUrl } = OptionsController.state;
        const legalCheckbox = OptionsController.state.features?.legalCheckbox;
        const legalUrl = termsConditionsUrl || privacyPolicyUrl;
        const showLegalCheckbox = Boolean(legalUrl) && Boolean(legalCheckbox);
        const disabled = showLegalCheckbox && !this.checked;
        const tabIndex = disabled ? -1 : undefined;
        return html `
      <w3m-legal-checkbox @checkboxChange=${this.onCheckboxChange.bind(this)}></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${showLegalCheckbox ? ['0', 's', 's', 's'] : 's'}
        gap="xs"
        class=${ifDefined(disabled ? 'disabled' : undefined)}
      >
        <w3m-social-login-list tabIdx=${ifDefined(tabIndex)}></w3m-social-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `;
    }
    onCheckboxChange(event) {
        this.checked = Boolean(event.detail);
    }
};
W3mConnectSocialsView.styles = styles;
__decorate([
    state()
], W3mConnectSocialsView.prototype, "checked", void 0);
W3mConnectSocialsView = __decorate([
    customElement('w3m-connect-socials-view')
], W3mConnectSocialsView);
export { W3mConnectSocialsView };
//# sourceMappingURL=index.js.map