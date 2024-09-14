import { sendDirectCastBatch } from "./sendDirectCast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/supabase";
import { getFarcasterUsers } from "./farcasterUser";

const UUID = "aed9c3cc-8a1e-4fa1-b66d-b8b44ff51c47"; // Prevents resending message to a user twice
const MESSAGE = `Action required: Nouns Town ticket mint starts now!

we are releasing tickets in batches, and batch #1 is now available to mint - https://www.tickets.nounstown.wtf/2024

once a batch is minted out, we'll release a new batch - or maybe not 😉

looking forward to seeing you in october!

stay nounish ⌐◨-◨`;

async function main() {
  // const uuid = uuidv4();
  // console.log("UUID", uuid);

  const resp = await supabase.from("nouns-town-waitlist").select("fid");
  const fids = resp.data?.map((r: any) => r.fid) ?? [];
  console.log(fids);

  const users = await getFarcasterUsers(fids);

  // Sort so we send to power users first
  users.sort((a, b) => (a.powerBadge === b.powerBadge ? 0 : a.powerBadge ? -1 : 1));

  // TEMP: only send to non-power (already sent to power)
  const nonPowerUsers = users.filter((u) => !u.powerBadge);

  await sendDirectCastBatch({
    // recipientFids: users.map((u) => u.fid),
    recipientFids: nonPowerUsers.map((u) => u.fid),
    message: MESSAGE,
    idempotencyKey: UUID,
  });
}

main();
