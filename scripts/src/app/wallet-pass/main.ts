import dotenv from "dotenv";

dotenv.config();

const MOONPAY_API_KEY = process.env.MOONPAY_API_KEY!;

async function main() {
  issuePass();
  // scanPass("0x8378861f9f843f33a9ccd69e2179fa5bada681ffa4f130511f87937f66befe34");
}

async function scanPass(barcode: string) {
  const resp = fetch(`https://api.ethpass.xyz/api/v0/scan?data=${barcode}`, {
    method: "GET",
    headers: {
      "X-API-KEY": MOONPAY_API_KEY,
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  const data = await resp.then((r) => r.json());

  console.log(data);
}

async function issuePass() {
  const resp = fetch("https://api.ethpass.xyz/v0/passes", {
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
      // externalId: "test-external-id",
      barcode: {
        // message: "test barcode msg",
        format: "QR",
        // encoded: false,
        redirect: {
          url: "https://tickets.nounstown.wtf",
        },
      },
    }),
  });

  const data = await resp.then((r) => r.json());

  console.log(data);
}

main();
