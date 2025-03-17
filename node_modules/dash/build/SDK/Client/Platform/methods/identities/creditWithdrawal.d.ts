import { Identity } from '@dashevo/wasm-dpp';
import { Metadata } from '@dashevo/dapi-client/lib/methods/platform/response/Metadata';
import { Platform } from '../../Platform';
export declare const STATUSES: {
    PENDING: number;
    POOLED: number;
    BROADCASTED: number;
    COMPLETED: number;
};
declare type WithdrawalOptions = {
    signingKeyIndex?: number;
    toAddress?: string;
};
/** Creates platform credits withdrawal request
 * @param identity - identity to withdraw from
 * @param amount - amount of credits to withdraw
 * @param options - withdrawal options
 * @param [options] - withdrawal options
 * @param [options.toAddress] - withdrawal destination address
 */
export declare function creditWithdrawal(this: Platform, identity: Identity, amount: number, options?: WithdrawalOptions): Promise<Metadata>;
export default creditWithdrawal;
