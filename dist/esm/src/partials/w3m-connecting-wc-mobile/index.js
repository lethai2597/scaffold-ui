var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ConnectionController, ConstantsUtil, CoreHelperUtil, EventsController } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
import { W3mConnectingWidget } from '../../utils/w3m-connecting-widget/index.js';
let W3mConnectingWcMobile = class W3mConnectingWcMobile extends W3mConnectingWidget {
    constructor() {
        super();
        this.btnLabelTimeout = undefined;
        this.labelTimeout = undefined;
        this.onRender = () => {
            if (!this.ready && this.uri) {
                this.ready = true;
                this.onConnect?.();
            }
        };
        this.onConnect = () => {
            if (this.wallet?.mobile_link && this.uri) {
                try {
                    this.error = false;
                    const { mobile_link, name } = this.wallet;
                    const { redirect, href } = CoreHelperUtil.formatNativeUrl(mobile_link, this.uri);
                    ConnectionController.setWcLinking({ name, href });
                    ConnectionController.setRecentWallet(this.wallet);
                    const target = CoreHelperUtil.isIframe() ? '_top' : '_self';
                    CoreHelperUtil.openHref(redirect, target);
                    clearTimeout(this.labelTimeout);
                    this.secondaryLabel = ConstantsUtil.CONNECT_LABELS.MOBILE;
                }
                catch (e) {
                    EventsController.sendEvent({
                        type: 'track',
                        event: 'CONNECT_PROXY_ERROR',
                        properties: {
                            message: e instanceof Error ? e.message : 'Error parsing the deeplink',
                            uri: this.uri,
                            mobile_link: this.wallet.mobile_link,
                            name: this.wallet.name
                        }
                    });
                    this.error = true;
                }
            }
        };
        if (!this.wallet) {
            throw new Error('w3m-connecting-wc-mobile: No wallet provided');
        }
        this.secondaryBtnLabel = undefined;
        this.secondaryLabel = ConstantsUtil.CONNECT_LABELS.MOBILE;
        document.addEventListener('visibilitychange', this.onBuffering.bind(this));
        EventsController.sendEvent({
            type: 'track',
            event: 'SELECT_WALLET',
            properties: { name: this.wallet.name, platform: 'mobile' }
        });
        this.btnLabelTimeout = setTimeout(() => {
            this.secondaryBtnLabel = 'Try again';
            this.secondaryLabel = ConstantsUtil.CONNECT_LABELS.MOBILE;
        }, ConstantsUtil.FIVE_SEC_MS);
        this.labelTimeout = setTimeout(() => {
            this.secondaryLabel = `Hold tight... it's taking longer than expected`;
        }, ConstantsUtil.THREE_SEC_MS);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('visibilitychange', this.onBuffering.bind(this));
        clearTimeout(this.btnLabelTimeout);
        clearTimeout(this.labelTimeout);
    }
    onBuffering() {
        const isIos = CoreHelperUtil.isIos();
        if (document?.visibilityState === 'visible' && !this.error && isIos) {
            ConnectionController.setBuffering(true);
            setTimeout(() => {
                ConnectionController.setBuffering(false);
            }, 5000);
        }
    }
    onTryAgain() {
        if (!this.buffering) {
            ConnectionController.setWcError(false);
            this.onConnect();
        }
    }
};
W3mConnectingWcMobile = __decorate([
    customElement('w3m-connecting-wc-mobile')
], W3mConnectingWcMobile);
export { W3mConnectingWcMobile };
//# sourceMappingURL=index.js.map