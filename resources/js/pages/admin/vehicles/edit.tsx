import VehicleForm from './form';
interface Vehicle { id: number; name: string; sharing: number; }
export default function VehiclesEdit(props: { vehicle: Vehicle }) { return <VehicleForm vehicle={props.vehicle} />; }
