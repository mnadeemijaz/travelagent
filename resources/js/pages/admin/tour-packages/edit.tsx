import TourPackageForm from './form';
interface TourPkg { id: number; name: string; }
export default function TourPackagesEdit(props: { tourPackage: TourPkg }) { return <TourPackageForm tourPackage={props.tourPackage} />; }
