"use server";

import { deleteTransaction } from "./api";

export async function deleteTransactionAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Transaction ID is required");
  }
  await deleteTransaction(id);
}
