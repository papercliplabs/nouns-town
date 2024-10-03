"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ethPassScan } from "@/data/ethPass";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type ScanStatus = "idle" | "loading" | "valid" | "invalid";

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");

  // Setup scanner
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }
    const qrScanner = new QrScanner(
      videoElement,
      async (result) => {
        await scanPass(result.data);
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: true,
        maxScansPerSecond: 1,
      }
    );
    scannerRef.current = qrScanner;
    qrScanner.start().catch((error) => console.error(error));
    return () => qrScanner.stop();
  }, []);

  const reset = useCallback(() => {
    setScanStatus("idle");
    scannerRef.current?.stop();
    scannerRef.current?.start();
  }, [setScanStatus]);

  const scanPass = useCallback(
    async (barcode: string) => {
      setScanStatus("loading");
      scannerRef.current?.pause(); // Stop scanner so we don't get more scans until modal is dismissed
      const { success, data } = await ethPassScan(barcode!);
      console.log("DEBUG SCAN", data);
      setScanStatus(success ? "valid" : "invalid");
    },
    [setScanStatus]
  );

  return (
    <>
      <div className="flex h-dvh items-center justify-center self-center">
        <video
          ref={videoRef}
          className="aspect-square h-[360px] rounded-xl bg-black/20 object-cover"
          muted
          id="scanner"
        />
      </div>
      <Dialog open={scanStatus != "idle"} onOpenChange={(open) => (open ? {} : reset())}>
        <DialogContent>
          <DialogTitle hidden>Scan Result</DialogTitle>
          <div className="flex h-[300px] flex-col justify-between gap-4">
            <div className="flex grow flex-col items-center justify-center gap-2">
              <div
                className={clsx(
                  "h-12 w-12 rounded-full",
                  scanStatus == "valid" && "bg-green-400",
                  scanStatus == "invalid" && "bg-semantic-negative",
                  scanStatus == "loading" && "animate-pulse bg-gray-300"
                )}
              />
              <h4>{scanStatus}</h4>
            </div>
            <Button onClick={reset} variant="secondary" size="md" className="w-full">
              Scan another pass
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
