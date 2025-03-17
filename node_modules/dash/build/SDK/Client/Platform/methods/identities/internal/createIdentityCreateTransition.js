"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIdentityCreateTransition = void 0;
var wasm_dpp_1 = require("@dashevo/wasm-dpp");
/**
 * Creates a funding transaction for the platform identity
 *  and returns one-time key to sign the state transition
 * @param {Platform} this
 * @param {AssetLockProof} assetLockProof - asset lock transaction proof
 *  for the identity create transition
 * @param {PrivateKey} assetLockPrivateKey - private key used in asset lock
 * @return {{identity: Identity, identityCreateTransition: IdentityCreateTransition}}
 *  - identity, state transition and index of the key used to create it
 * that can be used to sign registration/top-up state transition
 */
function createIdentityCreateTransition(assetLockProof, assetLockPrivateKey) {
    return __awaiter(this, void 0, void 0, function () {
        var platform, account, dpp, identityIndex, identityMasterPrivateKey, identityMasterPublicKey, masterKey, identityHighAuthPrivateKey, identityHighAuthPublicKey, highAuthKey, identityCriticalAuthPrivateKey, identityCriticalAuthPublicKey, criticalAuthKey, identityTransferPrivateKey, identityTransferPublicKey, transferKey, identity, identityCreateTransition, _a, stMasterKey, stHighAuthKey, stCriticalAuthKey, stTransferKey;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    platform = this;
                    return [4 /*yield*/, platform.initialize()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, platform.client.getWalletAccount()];
                case 2:
                    account = _b.sent();
                    dpp = platform.dpp;
                    return [4 /*yield*/, account.getUnusedIdentityIndex()];
                case 3:
                    identityIndex = _b.sent();
                    identityMasterPrivateKey = account.identities
                        .getIdentityHDKeyByIndex(identityIndex, 0).privateKey;
                    identityMasterPublicKey = identityMasterPrivateKey.toPublicKey();
                    masterKey = new wasm_dpp_1.IdentityPublicKey(1);
                    masterKey.setId(0);
                    masterKey.setData(identityMasterPublicKey.toBuffer());
                    masterKey.setSecurityLevel(wasm_dpp_1.IdentityPublicKey.SECURITY_LEVELS.MASTER);
                    identityHighAuthPrivateKey = account.identities
                        .getIdentityHDKeyByIndex(identityIndex, 1).privateKey;
                    identityHighAuthPublicKey = identityHighAuthPrivateKey.toPublicKey();
                    highAuthKey = new wasm_dpp_1.IdentityPublicKey(1);
                    highAuthKey.setId(1);
                    highAuthKey.setData(identityHighAuthPublicKey.toBuffer());
                    highAuthKey.setSecurityLevel(wasm_dpp_1.IdentityPublicKey.SECURITY_LEVELS.HIGH);
                    identityCriticalAuthPrivateKey = account.identities
                        .getIdentityHDKeyByIndex(identityIndex, 2).privateKey;
                    identityCriticalAuthPublicKey = identityCriticalAuthPrivateKey.toPublicKey();
                    criticalAuthKey = new wasm_dpp_1.IdentityPublicKey(1);
                    criticalAuthKey.setId(2);
                    criticalAuthKey.setData(identityCriticalAuthPublicKey.toBuffer());
                    criticalAuthKey.setSecurityLevel(wasm_dpp_1.IdentityPublicKey.SECURITY_LEVELS.CRITICAL);
                    identityTransferPrivateKey = account.identities
                        .getIdentityHDKeyByIndex(identityIndex, 3).privateKey;
                    identityTransferPublicKey = identityTransferPrivateKey.toPublicKey();
                    transferKey = new wasm_dpp_1.IdentityPublicKey(1);
                    transferKey.setId(3);
                    transferKey.setPurpose(wasm_dpp_1.IdentityPublicKey.PURPOSES.TRANSFER);
                    transferKey.setData(identityTransferPublicKey.toBuffer());
                    transferKey.setSecurityLevel(wasm_dpp_1.IdentityPublicKey.SECURITY_LEVELS.CRITICAL);
                    identity = dpp.identity.create(assetLockProof.createIdentifier(), [masterKey, highAuthKey, criticalAuthKey, transferKey]);
                    identityCreateTransition = dpp.identity.createIdentityCreateTransition(identity, assetLockProof);
                    _a = identityCreateTransition.getPublicKeys(), stMasterKey = _a[0], stHighAuthKey = _a[1], stCriticalAuthKey = _a[2], stTransferKey = _a[3];
                    // Sign master key
                    identityCreateTransition.signByPrivateKey(identityMasterPrivateKey.toBuffer(), wasm_dpp_1.IdentityPublicKey.TYPES.ECDSA_SECP256K1);
                    stMasterKey.setSignature(identityCreateTransition.getSignature());
                    identityCreateTransition.setSignature(undefined);
                    // Sign high auth key
                    identityCreateTransition.signByPrivateKey(identityHighAuthPrivateKey.toBuffer(), wasm_dpp_1.IdentityPublicKey.TYPES.ECDSA_SECP256K1);
                    stHighAuthKey.setSignature(identityCreateTransition.getSignature());
                    identityCreateTransition.setSignature(undefined);
                    // Sign critical auth key
                    identityCreateTransition.signByPrivateKey(identityCriticalAuthPrivateKey.toBuffer(), wasm_dpp_1.IdentityPublicKey.TYPES.ECDSA_SECP256K1);
                    stCriticalAuthKey.setSignature(identityCreateTransition.getSignature());
                    identityCreateTransition.setSignature(undefined);
                    // Sign transfer key
                    identityCreateTransition.signByPrivateKey(identityTransferPrivateKey.toBuffer(), wasm_dpp_1.IdentityPublicKey.TYPES.ECDSA_SECP256K1);
                    stTransferKey.setSignature(identityCreateTransition.getSignature());
                    identityCreateTransition.setSignature(undefined);
                    // Set public keys back after updating their signatures
                    identityCreateTransition.setPublicKeys([
                        stMasterKey, stHighAuthKey, stCriticalAuthKey, stTransferKey,
                    ]);
                    // Sign and validate state transition
                    identityCreateTransition
                        .signByPrivateKey(assetLockPrivateKey.toBuffer(), wasm_dpp_1.IdentityPublicKey.TYPES.ECDSA_SECP256K1);
                    // TODO(versioning): restore
                    // @ts-ignore
                    // const result = await dpp.stateTransition.validateBasic(
                    //   identityCreateTransition,
                    //   // TODO(v0.24-backport): get rid of this once decided
                    //   //  whether we need execution context in wasm bindings
                    //   new StateTransitionExecutionContext(),
                    // );
                    // if (!result.isValid()) {
                    //   const messages = result.getErrors().map((error) => error.message);
                    //   throw new Error(`StateTransition is invalid - ${JSON.stringify(messages)}`);
                    // }
                    return [2 /*return*/, { identity: identity, identityCreateTransition: identityCreateTransition, identityIndex: identityIndex }];
            }
        });
    });
}
exports.createIdentityCreateTransition = createIdentityCreateTransition;
exports.default = createIdentityCreateTransition;
//# sourceMappingURL=createIdentityCreateTransition.js.map