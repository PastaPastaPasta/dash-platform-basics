"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditWithdrawal = exports.STATUSES = void 0;
var dashcore_lib_1 = require("@dashevo/dashcore-lib");
var broadcastStateTransition_1 = __importDefault(require("../../broadcastStateTransition"));
var signStateTransition_1 = require("../../signStateTransition");
var fibonacci_1 = require("../../../../../utils/fibonacci");
exports.STATUSES = {
    PENDING: 0,
    POOLED: 1,
    BROADCASTED: 2,
    COMPLETED: 3,
};
// Implement remaining pooling types when they ready on drive side
var DEFAULT_POOLING = 0;
// TODO: add to dashcore-lib
// Asset unlock TX size is fixed with the default pooling
// since it has zero inputs and only one output
var ASSET_UNLOCK_TX_SIZE = 190;
// Minimal accepted core fee per byte to avoid low fee error from core
var MIN_ASSET_UNLOCK_CORE_FEE_PER_BYTE = 1;
// Minimal withdrawal amount in credits to avoid dust error from core
var MINIMAL_WITHDRAWAL_AMOUNT = ASSET_UNLOCK_TX_SIZE * MIN_ASSET_UNLOCK_CORE_FEE_PER_BYTE * 1000;
/** Creates platform credits withdrawal request
 * @param identity - identity to withdraw from
 * @param amount - amount of credits to withdraw
 * @param options - withdrawal options
 * @param [options] - withdrawal options
 * @param [options.toAddress] - withdrawal destination address
 */
function creditWithdrawal(identity, amount, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var dpp, outputScriptBytes, toAddress, outputScript, balance, minRelayFeePerByte, coreFeePerByte, identityNonce, identityCreditWithdrawalTransition, stateTransitionResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.initialize()];
                case 1:
                    _a.sent();
                    // eslint-disable-next-line no-param-reassign
                    options = __assign({ signingKeyIndex: 3 }, options);
                    dpp = this.dpp;
                    if (options.toAddress) {
                        toAddress = void 0;
                        try {
                            toAddress = new dashcore_lib_1.Address(options.toAddress, this.client.network);
                        }
                        catch (e) {
                            throw new Error("Invalid core recipient \"" + options.toAddress + "\" for network " + this.client.network);
                        }
                        outputScript = dashcore_lib_1.Script.buildPublicKeyHashOut(toAddress);
                        // @ts-ignore
                        outputScriptBytes = outputScript.toBuffer();
                        this.logger.debug("[Identity#creditWithdrawal] credits withdrawal from " + identity.getId().toString() + " to " + toAddress.toString() + " with amount " + amount);
                    }
                    else {
                        this.logger.debug("[Identity#creditWithdrawal] credits withdrawal from " + identity.getId().toString() + " to recent withdrawal address with amount " + amount);
                    }
                    balance = identity.getBalance();
                    if (amount > balance) {
                        throw new Error("Withdrawal amount \"" + amount + "\" is bigger that identity balance \"" + balance + "\"");
                    }
                    if (amount < MINIMAL_WITHDRAWAL_AMOUNT) {
                        throw new Error("Withdrawal amount \"" + amount + "\" is less than minimal allowed withdrawal amount \"" + MINIMAL_WITHDRAWAL_AMOUNT + "\"");
                    }
                    if (!this.client.wallet) {
                        throw new Error('Wallet is not initialized');
                    }
                    minRelayFeePerByte = Math.ceil(this.client.wallet.storage
                        .getDefaultChainStore().state.fees.minRelay / 1000);
                    coreFeePerByte = fibonacci_1.nearestGreaterFibonacci(minRelayFeePerByte);
                    return [4 /*yield*/, this.nonceManager.bumpIdentityNonce(identity.getId())];
                case 2:
                    identityNonce = _a.sent();
                    identityCreditWithdrawalTransition = dpp.identity
                        .createIdentityCreditWithdrawalTransition(identity.getId(), BigInt(amount), coreFeePerByte, DEFAULT_POOLING, outputScriptBytes, BigInt(identityNonce));
                    this.logger.silly('[Identity#creditWithdrawal] Created IdentityCreditWithdrawalTransition');
                    return [4 /*yield*/, signStateTransition_1.signStateTransition(this, identityCreditWithdrawalTransition, identity, options.signingKeyIndex)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, broadcastStateTransition_1.default(this, identityCreditWithdrawalTransition, {
                            skipValidation: true,
                        })];
                case 4:
                    stateTransitionResult = _a.sent();
                    this.logger.silly('[Identity#creditWithdrawal] Broadcasted IdentityCreditWithdrawalTransition');
                    return [2 /*return*/, stateTransitionResult.metadata];
            }
        });
    });
}
exports.creditWithdrawal = creditWithdrawal;
exports.default = creditWithdrawal;
//# sourceMappingURL=creditWithdrawal.js.map