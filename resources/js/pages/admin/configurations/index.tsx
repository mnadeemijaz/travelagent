import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export interface CompanyConfig {
    company_name: string;
    address: string;
    tagline: string;
    phone: string;
    email: string;
    adult_rate: number;
    child_rate: number;
    infant_rate: number;
    sr_rate: number;
    makkah_contact1_name: string;
    makkah_contact1_phone: string;
    makkah_contact2_name: string;
    makkah_contact2_phone: string;
    madina_contact1_name: string;
    madina_contact1_phone: string;
    madina_contact2_name: string;
    madina_contact2_phone: string;
    contact_name: string;
    contact_phone: string;
}

interface Props {
    configuration: CompanyConfig;
    configSaved?: boolean;
}

export default function CompanyConfigurationForm({ configuration, configSaved = false }: Props) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        company_name:           configuration.company_name ?? '',
        address:                configuration.address ?? '',
        tagline:                configuration.tagline ?? '',
        phone:                  configuration.phone ?? '',
        email:                  configuration.email ?? '',
        adult_rate:             String(configuration.adult_rate  ?? 0),
        child_rate:             String(configuration.child_rate  ?? 0),
        infant_rate:            String(configuration.infant_rate ?? 0),
        sr_rate:                String(configuration.sr_rate     ?? 1),
        makkah_contact1_name:   configuration.makkah_contact1_name ?? '',
        makkah_contact1_phone:  configuration.makkah_contact1_phone ?? '',
        makkah_contact2_name:   configuration.makkah_contact2_name ?? '',
        makkah_contact2_phone:  configuration.makkah_contact2_phone ?? '',
        madina_contact1_name:   configuration.madina_contact1_name ?? '',
        madina_contact1_phone:  configuration.madina_contact1_phone ?? '',
        madina_contact2_name:   configuration.madina_contact2_name ?? '',
        madina_contact2_phone:  configuration.madina_contact2_phone ?? '',
        contact_name:  configuration.contact_name ?? '',
        contact_phone:  configuration.contact_phone ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.configurations.update'));
    };

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Company Configuration"
                description="Update the company details shown in the website footer"
            />

            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="cfg-company-name">Company Name</Label>
                    <Input
                        id="cfg-company-name"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        placeholder="AL Abrar Group of Travels"
                        required
                    />
                    <InputError message={errors.company_name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cfg-tagline">Company Tagline</Label>
                    <Input
                        id="cfg-tagline"
                        value={data.tagline}
                        onChange={(e) => setData('tagline', e.target.value)}
                        placeholder="Your trusted partner for travel services."
                    />
                    <InputError message={errors.tagline} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cfg-address">Address</Label>
                    <textarea
                        id="cfg-address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Main Bazaar, Near Telecom Exchange, Islamabad"
                        rows={3}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cfg-phone">Phone Number</Label>
                    <Input
                        id="cfg-phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="+92 311 1234567"
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cfg-email">Email Address</Label>
                    <Input
                        id="cfg-email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="info@company.com"
                    />
                    <InputError message={errors.email} />
                </div>

                {/* Default Voucher Rates */}
                <div className="border-t pt-4">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">Default Voucher Rates</p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cfg-adult-rate">Adult Rate</Label>
                            <Input
                                id="cfg-adult-rate"
                                type="number" min={0} step="0.01"
                                value={data.adult_rate}
                                onChange={(e) => setData('adult_rate', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.adult_rate} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cfg-child-rate">Child Rate</Label>
                            <Input
                                id="cfg-child-rate"
                                type="number" min={0} step="0.01"
                                value={data.child_rate}
                                onChange={(e) => setData('child_rate', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.child_rate} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cfg-infant-rate">Infant Rate</Label>
                            <Input
                                id="cfg-infant-rate"
                                type="number" min={0} step="0.01"
                                value={data.infant_rate}
                                onChange={(e) => setData('infant_rate', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.infant_rate} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cfg-sr-rate">SR Rate</Label>
                            <Input
                                id="cfg-sr-rate"
                                type="number" min={0} step="0.0001"
                                value={data.sr_rate}
                                onChange={(e) => setData('sr_rate', e.target.value)}
                                placeholder="1.00"
                            />
                            <InputError message={errors.sr_rate} />
                        </div>
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="border-t pt-4">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">Emergency Contacts (shown on vouchers)</p>

                    {/* Makkah */}
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Makkah</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                        <div className="grid gap-2">
                            <Label htmlFor="makkah1-name">Contact 1 — Name</Label>
                            <Input id="makkah1-name" placeholder="e.g. Ahmed Ali"
                                value={data.makkah_contact1_name}
                                onChange={e => setData('makkah_contact1_name', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="makkah1-phone">Contact 1 — Phone</Label>
                            <Input id="makkah1-phone" placeholder="+966 5X XXX XXXX"
                                value={data.makkah_contact1_phone}
                                onChange={e => setData('makkah_contact1_phone', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="makkah2-name">Contact 2 — Name</Label>
                            <Input id="makkah2-name" placeholder="e.g. Hassan Khan"
                                value={data.makkah_contact2_name}
                                onChange={e => setData('makkah_contact2_name', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="makkah2-phone">Contact 2 — Phone</Label>
                            <Input id="makkah2-phone" placeholder="+966 5X XXX XXXX"
                                value={data.makkah_contact2_phone}
                                onChange={e => setData('makkah_contact2_phone', e.target.value)} />
                        </div>
                    </div>

                    {/* Madina */}
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Madina</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="madina1-name">Contact 1 — Name</Label>
                            <Input id="madina1-name" placeholder="e.g. Usman Shah"
                                value={data.madina_contact1_name}
                                onChange={e => setData('madina_contact1_name', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="madina1-phone">Contact 1 — Phone</Label>
                            <Input id="madina1-phone" placeholder="+966 5X XXX XXXX"
                                value={data.madina_contact1_phone}
                                onChange={e => setData('madina_contact1_phone', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="madina2-name">Contact 2 — Name</Label>
                            <Input id="madina2-name" placeholder="e.g. Bilal Hussain"
                                value={data.madina_contact2_name}
                                onChange={e => setData('madina_contact2_name', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="madina2-phone">Contact 2 — Phone</Label>
                            <Input id="madina2-phone" placeholder="+966 5X XXX XXXX"
                                value={data.madina_contact2_phone}
                                onChange={e => setData('madina_contact2_phone', e.target.value)} />
                        </div>
                    </div>
                </div>
                {/* Emergency Contacts if no hotel selected */}
                <div className="border-t pt-4">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">Emergency Contacts if Only Transport (shown on vouchers)</p>

                    {/* Makkah */}
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact-name">Contact Name</Label>
                            <Input id="contact-name" placeholder="e.g. Ahmed Ali"
                                value={data.contact_name}
                                onChange={e => setData('contact_name', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact-phone">Contact Phone</Label>
                            <Input id="contact-phone" placeholder="+966 5X XXX XXXX"
                                value={data.contact_phone}
                                onChange={e => setData('contact_phone', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save Configuration</Button>

                    <Transition
                        show={recentlySuccessful || configSaved}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neutral-600">Saved</p>
                    </Transition>
                </div>
            </form>

            <div className="border-t pt-6">
                <p className="mb-3 text-sm font-medium text-muted-foreground">Database Backup</p>
                <a
                    href={route('admin.configurations.backup')}
                    className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3M12 3a4 4 0 00-4 4v1H5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2h-3V7a4 4 0 00-4-4z" />
                    </svg>
                    Backup Database
                </a>
                <p className="mt-2 text-xs text-muted-foreground">Downloads a full SQL dump of the database.</p>
            </div>
        </div>
    );
}
