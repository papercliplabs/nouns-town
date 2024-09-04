import { BaseError, ContractFunctionRevertedError, InsufficientFundsError, UserRejectedRequestError } from "viem";
import { WaitForTransactionReceiptErrorType, WriteContractErrorType } from "wagmi/actions";

const eventTicketErrorMappings: Record<string, string> = {
  SaleNotActive: "Oops, the sale is not currently active, check back later.",
  SoldOut: "Oops, we're sold out for now, check back later.",
  AlreadyMintedMaxPerWallet: "You already minted, only 1 per wallet!",
};

export function parseWriteContractError(
  writeContractError: WriteContractErrorType | null,
  waitForTransactionReceiptError: WaitForTransactionReceiptErrorType | null
) {
  let fallback = "Unknown error";

  if (writeContractError) {
    const revertError = (writeContractError as BaseError).walk(
      (error) => error instanceof ContractFunctionRevertedError
    );

    if (writeContractError instanceof BaseError) {
      console.log(writeContractError.shortMessage);
      if (writeContractError.walk((e) => e instanceof InsufficientFundsError)) {
        return "Wallet has insufficient balance.";
      } else if (
        writeContractError.walk((e) => e instanceof UserRejectedRequestError) ||
        writeContractError.details?.includes("User reject") ||
        writeContractError.shortMessage.includes("User reject")
      ) {
        return "User rejected transaction request.";
      } else if (
        revertError instanceof ContractFunctionRevertedError &&
        eventTicketErrorMappings[revertError.data?.errorName ?? ""]
      ) {
        // Custom error
        return eventTicketErrorMappings[revertError.data?.errorName ?? ""];
      } else if (writeContractError.shortMessage) {
        fallback = writeContractError.shortMessage;
      }
    }
  } else if (waitForTransactionReceiptError) {
    fallback = "Unknown error waiting for transaction";
  }

  // TODO: log this for investigation
  return fallback + " - we're looking into this, check back shortly.";
}
