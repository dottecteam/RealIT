interface StepItemProps {
  step: string
  title: string
  desc: string
}

export function StepItem({ step, title, desc }: StepItemProps) {
  return (
    <div className="flex flex-col items-center relative z-10 flex-1 px-2 md:px-4 group">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-gray-50 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 transition-all duration-500 rounded-full flex items-center justify-center font-black text-xl md:text-2xl mb-5 md:mb-8 shadow-xl shadow-black/5">
        {step}
      </div>
      <h3 className="font-black text-gray-900 mb-2 md:mb-3 text-base md:text-lg">
        {title}
      </h3>
      <p className="text-sm text-gray-500 font-medium max-w-[200px] leading-relaxed">
        {desc}
      </p>
    </div>
  )
}