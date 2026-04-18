import TripForm from './form';
interface Vehicle { id: number; name: string; }
interface Trip { id: number; name: string; vehicle_id: number | null; price: string | null; }
export default function TripsEdit(props: { trip: Trip; vehicles: Vehicle[] }) { return <TripForm trip={props.trip} vehicles={props.vehicles} />; }
