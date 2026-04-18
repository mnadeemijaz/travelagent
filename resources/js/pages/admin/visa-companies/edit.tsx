import VisaCompanyForm from './form';
interface VisaCompany { id: number; name: string; contact: string | null; }
export default function VisaCompaniesEdit(props: { visaCompany: VisaCompany }) { return <VisaCompanyForm visaCompany={props.visaCompany} />; }
