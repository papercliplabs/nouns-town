import { Pass, User } from "./types";
import dotenv from "dotenv";

dotenv.config();

const MOONPAY_API_KEY = process.env.MOONPAY_API_KEY!;

export async function ethpassIssuePasses(users: User[]): Promise<Pass[]> {
  // Issue pass for all users
  const promises = users.map((user) => issuePass(user));
  const passRedemptionUrls = await Promise.all(promises);

  return users.map((user, i) => ({ user, url: passRedemptionUrls[i] }));
}

async function issuePass(user: User): Promise<string> {
  const resp = await fetch("https://api.ethpass.xyz/v0/passes", {
    method: "POST",
    headers: {
      "X-API-KEY": MOONPAY_API_KEY,
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      wallet: {
        chain: {
          name: "evm",
          network: 8453,
        },
        address: "0xD11C5194EfEF0b836277EA149cfe23d178b60242",
        requireUniqueSignature: false,
        signature:
          "0xd098ea8cd740abc668e40767de3b1e60a6d7c8fcb25bab430337c2776870b6c00e2335e993da58d5f3796186b10d13edd70b384a9ba36cb4a5b5d7d344adc83e1c",
        signatureMessage: "TESTING",
      },
      templateId: "e2128581-5d66-4cd0-86a5-090448823888",
      barcode: {
        message: user.name,
      },
      layout: {
        universal: {
          logoText: "Nouns Town LA",
          organizationName: "Nouns Town LA",
          headerFields: [
            {
              alignment: "right",
              label: "Name",
              value: user.name,
            },
          ],
          secondaryFields: [
            {
              alignment: "left",
              label: user.nftType === "noun" ? "Nouner" : "Ticket #",
              value: user.nftId.toString(),
            },
            {
              alignment: "right",
              label: "Address (Oct 9)",
              value: "2272 Venice Blvd",
            },
          ],
        },
      },
    }),
  });

  if (!resp.ok) {
    console.error("Failed to issue pass", await resp.text());
    return "ERROR";
  }

  const data = await resp.json();

  return data["distribution"]["claimUrl"];
}
