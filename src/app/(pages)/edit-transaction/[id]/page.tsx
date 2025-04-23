import { getTransaction } from "@/lib/api";
import TransactionForm from "@/components/templates/TransactionForm";

export default async function EditTransaction({
  params,
}: {
  params: { id: string };
}) {
  return <TransactionForm transaction={transaction} />;
}
