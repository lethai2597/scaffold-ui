var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { ChainController, RouterController, SendController } from '@reown/appkit-core';
import { UiHelperUtil, customElement } from '@reown/appkit-ui';
import styles from './styles.js';
let W3mWalletSendPreviewView = class W3mWalletSendPreviewView extends LitElement {
    constructor() {
        super();
        this.unsubscribe = [];
        this.token = SendController.state.token;
        this.sendTokenAmount = SendController.state.sendTokenAmount;
        this.receiverAddress = SendController.state.receiverAddress;
        this.receiverProfileName = SendController.state.receiverProfileName;
        this.receiverProfileImageUrl = SendController.state.receiverProfileImageUrl;
        this.gasPriceInUSD = SendController.state.gasPriceInUSD;
        this.caipNetwork = ChainController.state.activeCaipNetwork;
        this.unsubscribe.push(...[
            SendController.subscribe(val => {
                this.token = val.token;
                this.sendTokenAmount = val.sendTokenAmount;
                this.receiverAddress = val.receiverAddress;
                this.gasPriceInUSD = val.gasPriceInUSD;
                this.receiverProfileName = val.receiverProfileName;
                this.receiverProfileImageUrl = val.receiverProfileImageUrl;
            }),
            ChainController.subscribeKey('activeCaipNetwork', val => (this.caipNetwork = val))
        ]);
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe());
    }
    render() {
        return html ` <wui-flex flexDirection="column" .padding=${['0', 'l', 'l', 'l']}>
      <wui-flex gap="xs" flexDirection="column" .padding=${['0', 'xs', '0', 'xs']}>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-flex flexDirection="column" gap="4xs">
            <wui-text variant="small-400" color="fg-150">Send</wui-text>
            ${this.sendValueTemplate()}
          </wui-flex>
          <wui-preview-item
            text="${this.sendTokenAmount
            ? UiHelperUtil.roundNumber(this.sendTokenAmount, 6, 5)
            : 'unknown'} ${this.token?.symbol}"
            .imageSrc=${this.token?.iconUrl}
          ></wui-preview-item>
        </wui-flex>
        <wui-flex>
          <wui-icon color="fg-200" size="md" name="arrowBottom"></wui-icon>
        </wui-flex>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="small-400" color="fg-150">To</wui-text>
          <wui-preview-item
            text="${this.receiverProfileName
            ? UiHelperUtil.getTruncateString({
                string: this.receiverProfileName,
                charsStart: 20,
                charsEnd: 0,
                truncate: 'end'
            })
            : UiHelperUtil.getTruncateString({
                string: this.receiverAddress ? this.receiverAddress : '',
                charsStart: 4,
                charsEnd: 4,
                truncate: 'middle'
            })}"
            address=${this.receiverAddress ?? ''}
            .imageSrc=${this.receiverProfileImageUrl ?? undefined}
            .isAddress=${true}
          ></wui-preview-item>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" .padding=${['xxl', '0', '0', '0']}>
        <w3m-wallet-send-details
          .caipNetwork=${this.caipNetwork}
          .receiverAddress=${this.receiverAddress}
          .networkFee=${this.gasPriceInUSD}
        ></w3m-wallet-send-details>
        <wui-flex justifyContent="center" gap="xxs" .padding=${['s', '0', '0', '0']}>
          <wui-icon size="sm" color="fg-200" name="warningCircle"></wui-icon>
          <wui-text variant="small-400" color="fg-200">Review transaction carefully</wui-text>
        </wui-flex>
        <wui-flex justifyContent="center" gap="s" .padding=${['l', '0', '0', '0']}>
          <wui-button
            class="cancelButton"
            @click=${this.onCancelClick.bind(this)}
            size="lg"
            variant="neutral"
          >
            Cancel
          </wui-button>
          <wui-button
            class="sendButton"
            @click=${this.onSendClick.bind(this)}
            size="lg"
            variant="main"
          >
            Send
          </wui-button>
        </wui-flex>
      </wui-flex></wui-flex
    >`;
    }
    sendValueTemplate() {
        if (this.token && this.sendTokenAmount) {
            const price = this.token.price;
            const totalValue = price * this.sendTokenAmount;
            return html `<wui-text variant="paragraph-400" color="fg-100"
        >$${totalValue.toFixed(2)}</wui-text
      >`;
        }
        return null;
    }
    onSendClick() {
        SendController.sendToken();
    }
    onCancelClick() {
        RouterController.goBack();
    }
};
W3mWalletSendPreviewView.styles = styles;
__decorate([
    state()
], W3mWalletSendPreviewView.prototype, "token", void 0);
__decorate([
    state()
], W3mWalletSendPreviewView.prototype, "sendTokenAmount", void 0);
__decorate([
    state()
], W3mWalletSendPreviewView.prototype, "receiverAddress", void 0);
__decorate([
    state()
], W3mWalletSendPreviewView.prototype, "receiverProfileName", void 0);
__decorate([
    state()
], W3mWalletSendPreviewView.prototype, "receiverProfileImageUrl", void 0);
__decorate([
    state()
], W3mWalletSendPreviewView.prototype, "gasPriceInUSD", void 0);
__decorate([
    state()
], W3mWalletSendPreviewView.prototype, "caipNetwork", void 0);
W3mWalletSendPreviewView = __decorate([
    customElement('w3m-wallet-send-preview-view')
], W3mWalletSendPreviewView);
export { W3mWalletSendPreviewView };
//# sourceMappingURL=index.js.map