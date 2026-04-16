import { UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
    currentUrl?: string;
    onChange: (file: File | null) => void;
    error?: string;
}

export function ImageUpload({ currentUrl, onChange, error }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    function handleFile(file: File | null) {
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onChange(file);
    }

    function clear(e: React.MouseEvent) {
        e.stopPropagation();
        setPreview(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    const displayUrl = preview ?? currentUrl ?? null;

    return (
        <div>
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0] ?? null); }}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                    error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50'
                } ${displayUrl ? 'h-48' : 'h-36'}`}
            >
                {displayUrl ? (
                    <>
                        <img src={displayUrl} alt="preview" className="h-full w-full rounded-xl object-cover" />
                        <button
                            type="button"
                            onClick={clear}
                            className="absolute top-2 right-2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                        >
                            <X className="h-4 w-4 text-gray-600" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <UploadCloud className="h-8 w-8" />
                        <p className="text-sm">Click or drag image here</p>
                        <p className="text-xs">PNG, JPG, WebP · max 2 MB</p>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
