import FlightForm from './form';
interface Flight { id: number; name: string; bsp: string | null; }
export default function FlightsEdit(props: { flight: Flight }) { return <FlightForm flight={props.flight} />; }
