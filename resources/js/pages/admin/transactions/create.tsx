import TransactionForm from './form';
interface Agent { id: number; name: string; }
export default function TransactionsCreate(props: { agents: Agent[] }) {
    return <TransactionForm agents={props.agents} />;
}
