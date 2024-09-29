import dotenv from "dotenv";
import { getUsersToIssuePasses } from "./users";
import { ethpassIssuePasses } from "./ethpass";
import { setPassRedemptions } from "./storage";
import { redeemTicketNfts } from "./nft";

dotenv.config();

const CSV_FILE_PATH = "./src/app/wallet-pass/deform.csv";

async function main() {
  // Get users to issue passes to
  const users = await getUsersToIssuePasses(CSV_FILE_PATH);

  console.log("USERS", users);

  // Mark tickets as redeemed (makes them non-transferable)
  // await redeemTicketNfts(users.filter((user) => user.nftType == "ticket").map((user) => user.nftId));

  // Create Passes
  const passRedemptions = await ethpassIssuePasses(users);

  console.log("REDEMPTIONS", passRedemptions);

  // Store redemption URLs to database
  await setPassRedemptions(passRedemptions);
}

main();
