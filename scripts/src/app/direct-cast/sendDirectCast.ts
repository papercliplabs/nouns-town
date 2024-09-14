import dotenv from "dotenv";

dotenv.config();

const DIRECT_CAST_RATE_LIMIT_COUNT = 5;
const DIRECT_CAST_RATE_LIMIT_TIME_S = 65; // 300; // 5min safe from testing (spec is 1min, not accurate)

interface SendDirectCastParams {
  recipientFid: number;
  message: string;
  idempotencyKey: string;
}

export async function sendDirectCast(payload: SendDirectCastParams, apiKey?: string): Promise<boolean> {
  try {
    const resp = await fetch("https://api.warpcast.com/v2/ext-send-direct-cast", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey ?? process.env.WARPCAST_DIRECT_CAST_API_KEY!}`,
      },
      body: JSON.stringify(payload),
    });

    if (resp.ok) {
      return true;
    }

    if (resp.status === 429) {
      console.error("Rate limited");
    } else if (resp.status == 403) {
      console.error("Recipient unable to receive DC");
    } else {
      console.error("Unknown error", resp.status, await resp.text());
    }

    return false;
  } catch (e) {
    let msg = "";
    if (e instanceof Error) {
      msg = e.message + " - " + e.stack;
    }
    console.error(`Caught error sending cast - ${JSON.stringify(payload)} - ${e} - ${msg}`);
    return false;
  }
}

interface SendDirectCastBatchParams {
  recipientFids: number[];
  message: string;
  idempotencyKey: string;
}

export async function sendDirectCastBatch({ recipientFids, ...rest }: SendDirectCastBatchParams, apiKey?: string) {
  for (let start = 0; start < recipientFids.length; start += DIRECT_CAST_RATE_LIMIT_COUNT) {
    const slice = recipientFids.slice(start, start + DIRECT_CAST_RATE_LIMIT_COUNT);
    console.log(
      `Sending batch ${start / DIRECT_CAST_RATE_LIMIT_COUNT} (${Math.max(recipientFids.length - start - DIRECT_CAST_RATE_LIMIT_COUNT, 0)} users remaining): ${slice}`
    );
    await Promise.all(slice.map((fid) => sendDirectCast({ recipientFid: fid, ...rest }, apiKey)));

    // Sleep for rate limit time
    await new Promise((r) => setTimeout(r, DIRECT_CAST_RATE_LIMIT_TIME_S * 1000));
  }
}
