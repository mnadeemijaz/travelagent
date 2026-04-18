import HotelForm from './form';
interface TourPkg { id: number; name: string; }
export default function HotelsCreate(props: { packages?: TourPkg[] }) {
    return <HotelForm packages={props.packages} />;
}
