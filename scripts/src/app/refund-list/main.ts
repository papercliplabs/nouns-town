import dotenv from "dotenv";
import { createClient, http, fallback, getAddress, zeroAddress, Address } from "viem";
import { getContractEvents, multicall, readContract } from "viem/actions";
import { base } from "viem/chains";
import { eventTicketAbi } from "../../abis/eventTicketAbi";
import { Parser } from "json2csv";
import * as fs from "fs";

dotenv.config();

const TICKET_CONTRACT_ADDRESS = getAddress("0x04Db84527ecC5414B7FaDaeBE03fcADD978Ef5dF");

const basePublicClient = createClient({
  chain: base,
  transport: fallback([
    http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`),
    http("https://mainnet.base.org"),
  ]),
});

async function getMinters() {
  const mintEvents = await getContractEvents(basePublicClient, {
    address: TICKET_CONTRACT_ADDRESS,
    abi: eventTicketAbi,
    eventName: "Transfer",
    args: { from: zeroAddress },
    fromBlock: BigInt(19565505),
  });

  const minters = mintEvents.reduce(
    (acc, event) => {
      acc[Number(event.args.tokenId!)] = event.args.to!;
      return acc;
    },
    {} as Record<number, Address>
  );

  return minters;
}

async function getTicketInfo(id: number, minter: Address) {
  const [owner, redeemed] = await multicall(basePublicClient, {
    contracts: [
      {
        abi: eventTicketAbi,
        address: TICKET_CONTRACT_ADDRESS,
        functionName: "ownerOf",
        args: [BigInt(id)],
      },
      {
        abi: eventTicketAbi,
        address: TICKET_CONTRACT_ADDRESS,
        functionName: "redeemedTokens",
        args: [BigInt(id)],
      },
    ],
    allowFailure: false,
  });

  return { id, minter, owner, redeemed };
}

async function main() {
  const minters = await getMinters();

  const promises = [];
  for (let [id, minter] of Object.entries(minters)) {
    promises.push(getTicketInfo(Number(id), minter));
  }

  const info = await Promise.all(promises);
  console.log(info);

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(info);

  // Write the CSV data to a file
  fs.writeFileSync("refund-list.csv", csv);
}

main();
