import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark } from 'lucide-react';

interface FormData {
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    iban_number: string;
    logo: File | null;
    active: boolean;
}

interface Props {
    data: FormData;
    errors: Partial<Record<keyof FormData, string>>;
    processing: boolean;
    existingLogoUrl?: string | null;
    onSubmit: (e: React.FormEvent) => void;
    setData: (key: keyof FormData, value: string | boolean | File | null) => void;
}

export default function BankDetailForm({ data, errors, processing, existingLogoUrl, onSubmit, setData }: Props) {
    return (
        <form onSubmit={onSubmit} className="max-w-lg space-y-5">
            <div className="space-y-1">
                <Label>Bank Name</Label>
                <Input
                    placeholder="e.g. Meezan Bank"
                    value={data.bank_name}
                    onChange={(e) => setData('bank_name', e.target.value)}
                    required
                />
                {errors.bank_name && <p className="text-xs text-destructive">{errors.bank_name}</p>}
            </div>

            <div className="space-y-1">
                <Label>Account Holder Name</Label>
                <Input
                    placeholder="e.g. AL Abrar Group of Travels"
                    value={data.account_holder_name}
                    onChange={(e) => setData('account_holder_name', e.target.value)}
                    required
                />
                {errors.account_holder_name && <p className="text-xs text-destructive">{errors.account_holder_name}</p>}
            </div>

            <div className="space-y-1">
                <Label>Account Number</Label>
                <Input
                    placeholder="e.g. 0123456789012345"
                    value={data.account_number}
                    onChange={(e) => setData('account_number', e.target.value)}
                    required
                />
                {errors.account_number && <p className="text-xs text-destructive">{errors.account_number}</p>}
            </div>

            <div className="space-y-1">
                <Label>IBAN Number <span className="text-muted-foreground">(optional)</span></Label>
                <Input
                    placeholder="e.g. PK36MZNB0123456789012345"
                    value={data.iban_number}
                    onChange={(e) => setData('iban_number', e.target.value)}
                />
                {errors.iban_number && <p className="text-xs text-destructive">{errors.iban_number}</p>}
            </div>

            <div className="space-y-1">
                <Label>Bank Logo <span className="text-muted-foreground">(optional)</span></Label>
                {existingLogoUrl && (
                    <div className="mb-2 flex items-center gap-3">
                        <img src={existingLogoUrl} alt="Current logo" className="h-12 w-20 rounded-md border object-contain p-1" />
                        <span className="text-xs text-muted-foreground">Current logo — upload a new one to replace</span>
                    </div>
                )}
                {!existingLogoUrl && (
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-12 w-20 items-center justify-center rounded-md border bg-gray-50">
                            <Landmark className="h-5 w-5 text-gray-300" />
                        </div>
                    </div>
                )}
                <ImageUpload onChange={(file) => setData('logo', file)} error={errors.logo} />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="active"
                    checked={data.active}
                    onChange={(e) => setData('active', e.target.checked)}
                    className="rounded"
                />
                <Label htmlFor="active">Show on website</Label>
            </div>

            <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                Save Bank Detail
            </Button>
        </form>
    );
}
