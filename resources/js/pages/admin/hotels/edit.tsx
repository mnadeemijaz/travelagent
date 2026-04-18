import HotelForm from './form';
interface Hotel { id: number; name: string; city_name: string | null; room_type: string | null; pkg_type: string | null; }
interface TourPkg { id: number; name: string; }
export default function HotelsEdit(props: { hotel: Hotel; packages?: TourPkg[] }) {
    return <HotelForm hotel={props.hotel} packages={props.packages} />;
}
