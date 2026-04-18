import TripForm from './form';
interface Vehicle { id: number; name: string; }
export default function TripsCreate(props: { vehicles: Vehicle[] }) { return <TripForm vehicles={props.vehicles} />; }
