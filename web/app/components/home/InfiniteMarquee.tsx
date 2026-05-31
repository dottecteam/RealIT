interface MarqueeItem {
    val: string
    label: string
}

interface InfiniteMarqueeProps {
    items: MarqueeItem[]
    repeatCount?: number
}

export function InfiniteMarquee({ items, repeatCount = 4 }: InfiniteMarqueeProps) {
    const loopedItems = Array.from({ length: repeatCount }).flatMap(() => items)

    return (
        <section className="bg-secondary top-0 py-8 md:py-10 shadow-inner overflow-hidden">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] text-primary">
                {loopedItems.map((item, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center px-8 sm:px-12 md:px-16 border-r border-primary/20 last:border-r-0"
                    >
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
                            {item.val}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-1 md:mt-2 opacity-80">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}