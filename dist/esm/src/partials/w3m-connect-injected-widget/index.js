var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ApiController, AssetUtil, ConnectionController, ConnectorController, CoreHelperUtil, RouterController } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
let W3mConnectInjectedWidget = class W3mConnectInjectedWidget extends LitElement {
    constructor() {
        super();
        this.unsubscribe = [];
        this.tabIdx = undefined;
        this.connectors = ConnectorController.state.connectors;
        this.unsubscribe.push(ConnectorController.subscribeKey('connectors', val => (this.connectors = val)));
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe());
    }
    render() {
        const injectedConnectors = this.connectors.filter(connector => connector.type === 'INJECTED');
        if (!injectedConnectors?.length ||
            (injectedConnectors.length === 1 &&
                injectedConnectors[0]?.name === 'Browser Wallet' &&
                !CoreHelperUtil.isMobile())) {
            this.style.cssText = `display: none`;
            return null;
        }
        return html `
      <wui-flex flexDirection="column" gap="xs">
        ${injectedConnectors.map(connector => {
            if (!CoreHelperUtil.isMobile() && connector.name === 'Browser Wallet') {
                return null;
            }
            const walletRDNS = connector.info?.rdns;
            if (!walletRDNS && !ConnectionController.checkInstalled(undefined)) {
                this.style.cssText = `display: none`;
                return null;
            }
            if (walletRDNS && ApiController.state.excludedRDNS) {
                if (ApiController.state.excludedRDNS.includes(walletRDNS)) {
                    return null;
                }
            }
            return html `
            <wui-list-wallet
              imageSrc=${ifDefined(AssetUtil.getConnectorImage(connector))}
              .installed=${true}
              name=${connector.name ?? 'Unknown'}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${connector.id}`}
              @click=${() => this.onConnector(connector)}
              tabIdx=${ifDefined(this.tabIdx)}
            >
            </wui-list-wallet>
          `;
        })}
      </wui-flex>
    `;
    }
    onConnector(connector) {
        ConnectorController.setActiveConnector(connector);
        RouterController.push('ConnectingExternal', { connector });
    }
};
__decorate([
    property()
], W3mConnectInjectedWidget.prototype, "tabIdx", void 0);
__decorate([
    state()
], W3mConnectInjectedWidget.prototype, "connectors", void 0);
W3mConnectInjectedWidget = __decorate([
    customElement('w3m-connect-injected-widget')
], W3mConnectInjectedWidget);
export { W3mConnectInjectedWidget };
//# sourceMappingURL=index.js.map