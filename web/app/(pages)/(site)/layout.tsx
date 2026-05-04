import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <Navbar />
            <main className="flex-grow min-h-0 relative">
                {children}
            </main>
            <Footer />
        </div>
    );
}