var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccountController, AssetUtil, ChainController, CoreHelperUtil } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
import { W3mFrameRpcConstants } from '@reown/appkit-wallet';
import styles from './styles.js';
let W3mWalletCompatibleNetworksView = class W3mWalletCompatibleNetworksView extends LitElement {
    constructor() {
        super();
        this.unsubscribe = [];
        this.preferredAccountType = AccountController.state.preferredAccountType;
        this.unsubscribe.push(AccountController.subscribeKey('preferredAccountType', val => {
            this.preferredAccountType = val;
        }));
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe());
    }
    render() {
        return html ` <wui-flex
      flexDirection="column"
      .padding=${['xs', 's', 'm', 's']}
      gap="xs"
    >
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`;
    }
    networkTemplate() {
        const requestedCaipNetworks = ChainController.getAllRequestedCaipNetworks();
        const approvedCaipNetworkIds = ChainController.getAllApprovedCaipNetworkIds();
        const caipNetwork = ChainController.state.activeCaipNetwork;
        const isNetworkEnabledForSmartAccounts = ChainController.checkIfSmartAccountEnabled();
        let sortedNetworks = CoreHelperUtil.sortRequestedNetworks(approvedCaipNetworkIds, requestedCaipNetworks);
        if (isNetworkEnabledForSmartAccounts &&
            this.preferredAccountType === W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT) {
            if (!caipNetwork) {
                return null;
            }
            sortedNetworks = [caipNetwork];
        }
        return sortedNetworks.map(network => html `
        <wui-list-network
          imageSrc=${ifDefined(AssetUtil.getNetworkImage(network))}
          name=${network.name ?? 'Unknown'}
          ?transparent=${true}
        >
        </wui-list-network>
      `);
    }
};
W3mWalletCompatibleNetworksView.styles = styles;
__decorate([
    state()
], W3mWalletCompatibleNetworksView.prototype, "preferredAccountType", void 0);
W3mWalletCompatibleNetworksView = __decorate([
    customElement('w3m-wallet-compatible-networks-view')
], W3mWalletCompatibleNetworksView);
export { W3mWalletCompatibleNetworksView };
//# sourceMappingURL=index.js.map