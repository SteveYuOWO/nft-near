import {
  Context,
  PersistentMap,
  logging,
  ContractPromise,
} from "near-sdk-core";
import { AccountId } from "../../utils";
import {
  INearNFTCore,
  ResolveArgs,
  Token,
  TransferArgs,
} from "./nft_interface";

@nearBindgen
export class NFTContract implements INearNFTCore {
  private tokenOwnerById: PersistentMap<string, AccountId> = new PersistentMap(
    "o"
  );

  nft_transfer(receiver_id: string, token_id: string, memo: string): void {
    this.internal_transfer(receiver_id, token_id, memo);
  }

  nft_transfer_call(
    receiver_id: string,
    token_id: string,
    memo: string,
    msg: string
  ): void {
    this.internal_transfer(receiver_id, token_id, memo);

    const owner_id = Context.predecessor;
    const args: TransferArgs = {
      owner_id,
      receiver_id,
      token_id,
    };

    const resolveArgs: ResolveArgs = {
      owner_id,
      receiver_id,
      token_id,
    };

    ContractPromise.create(
      receiver_id,
      "nft_on_transfer",
      args.encode(),
      25_000_000_000_000
    ).then(
      Context.contractName,
      "nft_resolve_transfer",
      resolveArgs.encode(),
      25_000_000_000_000
    );
  }

  nft_on_transfer(
    owner_id: AccountId,
    receiver_id: AccountId,
    token_id: string
  ): boolean {
    return true;
  }

  nft_resolve_transfer(
    owner_id: AccountId,
    receiver_id: AccountId,
    token_id: string
  ): boolean {
    const results = ContractPromise.getResults();
    for (let i = 0; i < results.length; i++) {
      if (results[i].failed) {
        this.tokenOwnerById.set(token_id, owner_id);
        return false;
      }
    }
    return true;
  }

  nft_token(token_id: string): Token | null {
    const owner_id = this.tokenOwnerById.get(token_id);
    if (!owner_id) {
      return null;
    }
    return {
      id: token_id,
      owner_id: owner_id!,
    };
  }

  private internal_transfer(
    receiver_id: AccountId,
    token_id: string,
    memo: string
  ): void {
    const nft = this.nft_token(token_id);
    if (!nft) {
      throw new Error("no token found");
    }

    const caller = Context.predecessor;
    assert(caller == nft.owner_id, "only owner can transfer");

    this.tokenOwnerById.set(token_id, receiver_id);

    logging.log(
      `NFT ${token_id} transfered from ${caller} to ${receiver_id}, memo ${memo}`
    );
  }

  mint(token_id: string, owner_id: AccountId): Token {
    // 给owner铸造一枚nft
    const owner = this.tokenOwnerById.get(token_id);
    if (owner) {
      throw new Error("Token already exist");
    }
    this.tokenOwnerById.set(token_id, owner_id);
    return {
      id: token_id,
      owner_id,
    };
  }
}
