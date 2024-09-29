import { supabase } from "../../supabase";
import { Pass } from "./types";

export async function setPassRedemptions(redemptions: Pass[]) {
  const { error } = await supabase.from("nouns-town-passes").upsert(
    redemptions.map((redemption) => ({
      email: redemption.user.email,
      passUrl: redemption.url,
      nftType: redemption.user.nftType,
      nftId: Number(redemption.user.nftId),
    }))
  );

  if (error) {
    console.error("Failed to upsert pass redemption", error);
  }
}

export async function getRedeemedNounIds(): Promise<bigint[]> {
  const { error, data } = await supabase.from("nouns-town-passes").select("nftId").eq("nftType", "noun").limit(1000);

  if (error || !data) {
    throw Error(`Failed to get redeemed noun ids ${error?.message}`);
  }

  return data.map((row: any) => BigInt(row.nftId));
}
