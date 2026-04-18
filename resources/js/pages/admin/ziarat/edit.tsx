import ZiaratForm from './form';
interface Ziarat { id: number; name: string; amount: string | null; }
export default function ZiaratEdit(props: { ziarat: Ziarat }) { return <ZiaratForm ziarat={props.ziarat} />; }
