import SectorForm from './form';
interface Sector { id: number; name: string; }
export default function SectorsEdit(props: { sector: Sector }) { return <SectorForm sector={props.sector} />; }
