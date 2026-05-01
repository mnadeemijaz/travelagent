export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-white">
                <img src="/storage/icon.ico" alt="Al Abrar Travels" className="size-7 object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Al Abrar Group of Travels</span>
            </div>
        </>
    );
}
