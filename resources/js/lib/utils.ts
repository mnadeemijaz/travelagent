import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format a date string (YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY) to DD/MM/YYYY for display. */
export function fmtDate(val: string | null | undefined): string {
    if (!val) return '—';
    // YYYY-MM-DD (ISO / database format)
    const iso = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    // DD-MM-YYYY (old dash format)
    const dash = val.match(/^(\d{2})-(\d{2})-(\d{4})/);
    if (dash) return `${dash[1]}/${dash[2]}/${dash[3]}`;
    // Already DD/MM/YYYY or unknown
    return val;
}
