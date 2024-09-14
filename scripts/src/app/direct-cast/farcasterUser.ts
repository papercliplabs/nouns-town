import dotenv from "dotenv";

dotenv.config();

const CHUNK_SIZE = 100;

interface FarcasterUser {
  fid: number;
  username: string;
  powerBadge: boolean;
}

export async function getFarcasterUsers(fids: number[]): Promise<FarcasterUser[]> {
  let users: FarcasterUser[] = [];
  for (let i = 0; i < fids.length; i += CHUNK_SIZE) {
    const slice = fids.slice(i, i + CHUNK_SIZE);
    const resp = await getBatchOfUsers(slice);
    users = [...users, ...resp];
  }

  return users;
}

async function getBatchOfUsers(fids: number[]) {
  const urlParams = new URLSearchParams({
    fids: fids.reduce((acc, fid) => acc + fid + ",", "").slice(0, -1),
    viewer_fid: "749097",
  });

  const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?${urlParams.toString()}`, {
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY!,
    },
  });

  const data = await response.json();

  return data.users.map((u: any) => ({
    fid: u.fid,
    username: u.username,
    powerBadge: u.power_badge,
  }));
}
