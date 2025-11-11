export function AboutUs() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative mb-12">
          <div className="bg-[#324557] rounded-lg py-6 px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#B99B75]">ABOUT US | من نحن</h2>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-12 h-0.5 bg-[#B99B75]"></div>
        </div>

        {/* Content Box */}
        <div className="border-2 border-[#B99B75]/30 rounded-3xl p-8 md:p-12 bg-background/50 relative">
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#324557]"></div>
            ))}
          </div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#B99B75]/30 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#B99B75]/30 rounded-br-lg"></div>

          {/* Arabic Text */}
          <div className="mb-8 text-right" dir="rtl">
            <p className="text-[#B99B75] text-lg md:text-xl leading-relaxed font-serif">
              شركة متخصصة في تشغيل وإدارة الفنادق في المملكة العربية السعودية، حيث نعمل على تقديم خدمات ضيافة مميزة
              ترتقي لتطلعات زوار المملكة، بفضل خبرة إداريينا الطويلة في قطاع الضيافة، نضمن تجربة إقامة مريحة ومتميزة
              تعكس أعلى معايير الجودة والاحترافية.
            </p>
          </div>

          {/* Divider Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#B99B75]/30 to-transparent mb-8"></div>

          {/* English Text */}
          <div className="text-left">
            <p className="text-[#B99B75] text-lg md:text-xl leading-relaxed">
              A specialized company in operating and managing hotels in KSA, dedicated to providing exceptional
              hospitality services that meet the aspirations of visitors to Kingdom. With the extensive experience of
              our management team in the hospitality sector, we ensure a comfortable and distinguished stay that
              reflects the highest standards of quality and professionalism.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
