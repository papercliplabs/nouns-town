import dotenv from "dotenv";
import { createClient, http, fallback, createWalletClient, Hex } from "viem";
import { mainnet, base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

export const mainnetPublicClient = createClient({
  chain: mainnet,
  transport: fallback([
    http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`),
    http("https://mainnet.gateway.tenderly.co"),
  ]),
});

export const basePublicClient = createClient({
  chain: base,
  transport: fallback([
    http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`),
    http("https://mainnet.base.org"),
  ]),
});

const redeemerOwnerAccount = privateKeyToAccount(process.env.REDEEMER_OWNER_PRIVATE_KEY! as Hex);
export const redeemerWalletClient = createWalletClient({
  account: redeemerOwnerAccount,
  chain: base,
  transport: fallback([
    http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`),
    http("https://mainnet.base.org"),
  ]),
});
