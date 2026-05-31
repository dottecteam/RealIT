import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    desc: string
}

export function FeatureCard({ icon: Icon, title, desc }: FeatureCardProps) {
    return (
        <div className="bg-white p-7 md:p-10 rounded-[24px] md:rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col items-start group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-2xl mb-6 md:mb-8 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <Icon className="text-primary group-hover:text-white w-6 h-6 md:w-7 md:h-7 transition-colors" />
            </div>
            <h3 className="font-black text-gray-900 mb-3 md:mb-4 text-lg md:text-xl tracking-tight">
                {title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
        </div>
    )
}