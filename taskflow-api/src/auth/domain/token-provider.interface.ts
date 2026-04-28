import { AccessTokenPayload } from './token-payload';
import { TokenPair } from './token-pair';

export interface TokenProvider {
  generate(payload: AccessTokenPayload): TokenPair;
  verifyAccess(token: string): AccessTokenPayload;
}
