import { Identifier } from '@dashevo/wasm-dpp';
import { Platform } from '../../Platform';
/**
 * Register names to the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string} name - name
 * @param {Object} records - records object having only one of the following items
 * @param {string} [records.identity]
 * @param identity - identity
 *
 * @returns registered domain document
 */
export declare function register(this: Platform, name: string, records: {
    identity?: Identifier | string;
}, identity: {
    getId(): Identifier;
    getPublicKeyById(number: number): any;
}): Promise<any>;
export default register;
