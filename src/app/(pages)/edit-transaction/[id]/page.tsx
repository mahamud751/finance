import { getTransaction } from "@/lib/api";
import TransactionForm from "@/components/templates/TransactionForm";

export default async function EditTransaction({
  params,
}: {
  params: { id: string };
}) {
  const transaction = await getTransaction(params.id);
  console.log("Edit page fetched transaction:", transaction);
  return <TransactionForm transaction={transaction} />;
}
