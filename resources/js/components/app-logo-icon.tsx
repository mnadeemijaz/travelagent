interface AppLogoIconProps {
    className?: string;
}

export default function AppLogoIcon({ className }: AppLogoIconProps) {
    return (
        <img src="/storage/icon.ico" alt="Al Abrar Travels" className={className} />
    );
}
