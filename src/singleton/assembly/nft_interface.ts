import {AccountId} from '../../utils';

export class Token {
  id: string;
  owner_id: AccountId;
}

export interface INearNFTCore {
  nft_transfer(
    receiver_id: AccountId,
    token_id: string,
    memo: string,
  ): void

  nft_transfer_call(
    receiver_id: AccountId,
    token_id: string,
    memo: string,
    msg: string,
  ): void

  nft_token(token_id: string): Token | null
}

@nearBindgen
export class TransferArgs {
  owner_id: AccountId;
  receiver_id: string;
  token_id: string;
}

@nearBindgen
export class ResolveArgs {
  owner_id: AccountId;
  receiver_id: string;
  token_id: string;
}

export interface INearReceiver {
  nft_on_transfer(
    owner_id: string,
    receiver_id: string,
    token_id: string,
  ): void
}