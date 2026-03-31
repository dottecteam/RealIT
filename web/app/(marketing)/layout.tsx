import Link from "next/link";

// Componentes
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Navbar/>

            <main className="flex-grow">
                {children}
            </main>

            <Footer/>
        </div>
    );
}