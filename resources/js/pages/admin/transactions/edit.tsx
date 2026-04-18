import TransactionForm from './form';
interface Agent { id: number; name: string; }
interface Transaction { id: number; account_id: number; account_type: string; payment_type: 'dr' | 'cr'; date: string; detail: string | null; amount: string; voucher_id: number | null; }
export default function TransactionsEdit(props: { transaction: Transaction; agents: Agent[] }) {
    return <TransactionForm transaction={props.transaction} agents={props.agents} />;
}
