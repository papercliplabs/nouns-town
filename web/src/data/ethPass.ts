"use server";

interface EthPassScanReturnType {
  success: boolean;
  data: any;
}

export async function ethPassScan(barcode: string): Promise<EthPassScanReturnType> {
  const resp = await fetch(`https://api.ethpass.xyz/api/v0/scan?data=${barcode}`, {
    method: "GET",
    headers: {
      "X-API-KEY": process.env.MOONPAY_API_KEY!,
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  let success = resp.ok;
  const data = await resp.json();

  return { success, data };
}
