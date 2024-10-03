import { getAreTicketNftsRedeemed, getNftOwners } from "./nft";
import { getRedeemedNounIds } from "./storage";
import { User } from "./types";
import { isAddressEqual, getAddress } from "viem";
import fs from "fs";
import csv from "csv-parser";

const WALLET_ADDRESS_KEY = "What is your wallet address? - Wallet Address";
const NOUN_IDS_KEY = "Verify you're a Nouner-NFT-tokenIds";
const TICKET_IDS_KEY = "Verify you hold the Nouns Town LA Pass-NFT-tokenIds";
const NAME_KEY = "What is your full name?";
const EMAIL_KEY = "What is your email?";

// Get all users to issue passes too
export async function getUsersToIssuePasses(csvFilePath: string): Promise<User[]> {
  const allUsers = await parseCsv(csvFilePath);

  const allTicketUsers = allUsers.filter((user) => user.nftType === "ticket");
  const allNounUsers = allUsers.filter((user) => user.nftType === "noun");

  const [validTicketUsers, validNounUsers] = await Promise.all([
    filterForValidTicketUsers(allTicketUsers),
    filterForValidNounUsers(allNounUsers),
  ]);

  return [...validTicketUsers, ...validNounUsers];
}

async function parseCsv(csvFilePath: string): Promise<User[]> {
  return await new Promise(function (resolve, reject) {
    const users: User[] = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data: any) => {
        const ticketIds: bigint[] = data[TICKET_IDS_KEY].split(",").map((id: string) => BigInt(id));
        const nounsIds: bigint[] = data[NOUN_IDS_KEY].split(",").map((id: string) => BigInt(id));

        if (nounsIds[0] == BigInt(0) && ticketIds[0] == BigInt(0)) {
          throw Error("No NFTs found for user");
        }

        // Prioritize noun over ticket
        const nftType = nounsIds[0] == BigInt(0) ? "ticket" : "noun";

        const user: User = {
          walletAddress: getAddress(data[WALLET_ADDRESS_KEY]),

          name: data[NAME_KEY],
          email: data[EMAIL_KEY],

          nftType,
          nftId: nftType == "ticket" ? ticketIds[0] : nounsIds[0],
        };
        users.push(user);
      })
      .on("end", () => {
        // Need this to close it up
        resolve(users);
      })
      .on("error", reject);
  });
}

async function filterForValidTicketUsers(users: User[]): Promise<User[]> {
  const reversedUsers = users.reverse();
  const ids = reversedUsers.map((user) => user.nftId);
  const [owners, areRedeemed] = await Promise.all([getNftOwners("ticket", ids), getAreTicketNftsRedeemed(ids)]);

  const idUsed: Record<number, boolean> = {};

  const filteredUsers: User[] = [];
  for (const [i, user] of reversedUsers.entries()) {
    if (isAddressEqual(user.walletAddress, owners[i]) && !areRedeemed[i] && !idUsed[Number(user.nftId)]) {
      filteredUsers.push(user);
      idUsed[Number(user.nftId)] = true; // Mark used, so there are no double claims
    } else {
      console.log("Token User filtered: ", user, owners[i], !areRedeemed[i]);
    }
  }

  return filteredUsers;
}

async function filterForValidNounUsers(users: User[]): Promise<User[]> {
  const ids = users.map((user) => user.nftId);
  const [owners, redeemedNounIds] = await Promise.all([getNftOwners("noun", ids), getRedeemedNounIds()]);

  const idUsed: Record<number, boolean> = {};

  const filteredUsers: User[] = [];
  for (const [i, user] of users.entries()) {
    if (
      isAddressEqual(user.walletAddress, owners[i]) &&
      !redeemedNounIds.includes(user.nftId) &&
      !idUsed[Number(user.nftId)]
    ) {
      filteredUsers.push(user);
      idUsed[Number(user.nftId)] = true; // Mark used, so there are no double claims
    } else {
      console.log("Noun User filtered: ", user, owners[i], redeemedNounIds);
    }
  }

  return filteredUsers;
}
