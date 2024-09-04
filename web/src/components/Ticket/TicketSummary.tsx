interface TicketSummaryParams {
  priceFormatted: string;
  currentSupply: number;
  maxSupply: number;
}

export default function TicketSummary({ priceFormatted, currentSupply, maxSupply }: TicketSummaryParams) {
  return (
    <div className="flex w-full items-end justify-between font-bold">
      <div className="flex flex-col gap-2">
        <span>Deposit</span>
        <span className="heading-5">{priceFormatted} ETH</span>
      </div>
      <div className="flex flex-col justify-end gap-2 text-end">
        <span>Supply</span>
        <span className="heading-5">
          {currentSupply}/{maxSupply}
        </span>
      </div>
    </div>
  );
}
