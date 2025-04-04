import type React from "react"

interface ProductSvgIllustrationProps {
  svgType: string
  className?: string
}

export const ProductSvgIllustration: React.FC<ProductSvgIllustrationProps> = ({
  svgType,
  className = "w-full h-full",
}) => {
  const svgMap: Record<string, JSX.Element> = {
    "copper-vessel": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M200 50C160 50 130 70 130 100H270C270 70 240 50 200 50Z" fill="#B45309" />
        <path d="M130 100H270V220C270 240 240 250 200 250C160 250 130 240 130 220V100Z" fill="#F59E0B" />
        <path d="M130 100H270V120C270 140 240 150 200 150C160 150 130 140 130 120V100Z" fill="#B45309" />
        <path d="M150 150V220" stroke="#92400E" strokeWidth="8" strokeLinecap="round" />
        <path d="M250 150V220" stroke="#92400E" strokeWidth="8" strokeLinecap="round" />
        <path d="M180 180C180 180 200 200 220 180" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="200" cy="250" rx="70" ry="10" fill="#B45309" />
        <path
          d="M120 100C120 100 100 120 100 150C100 180 120 200 120 200"
          stroke="#B45309"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M280 100C280 100 300 120 300 150C300 180 280 200 280 200"
          stroke="#B45309"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    ),
    "sacred-book": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M100 70H300V230H100V70Z" fill="#F59E0B" />
        <path d="M100 70H300V90H100V70Z" fill="#B45309" />
        <path d="M100 210H300V230H100V210Z" fill="#B45309" />
        <path d="M200 70V230" stroke="#92400E" strokeWidth="4" />
        <path d="M150 120H180" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M150 140H190" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M150 160H170" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M220 120H250" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M220 140H260" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M220 160H240" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M150 180H180" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M220 180H250" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 70C100 70 120 50 150 50H250C280 50 300 70 300 70" stroke="#92400E" strokeWidth="4" />
        <path d="M100 230C100 230 120 250 150 250H250C280 250 300 230 300 230" stroke="#92400E" strokeWidth="4" />
        <path d="M120 90L120 210" stroke="#92400E" strokeWidth="2" />
        <path d="M280 90L280 210" stroke="#92400E" strokeWidth="2" />
      </svg>
    ),
    "pooja-items": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <rect x="120" y="180" width="160" height="80" rx="5" fill="#F59E0B" />
        <rect x="140" y="180" width="120" height="10" fill="#B45309" />
        <path d="M160 180V160C160 140 180 130 200 130C220 130 240 140 240 160V180" stroke="#92400E" strokeWidth="4" />
        <circle cx="200" cy="100" r="30" fill="#F59E0B" />
        <path
          d="M190 90L200 100L220 80"
          stroke="#FEF3C7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="150" y="200" width="30" height="40" rx="2" fill="#FEF3C7" />
        <rect x="190" y="200" width="20" height="40" rx="2" fill="#FEF3C7" />
        <rect x="220" y="200" width="30" height="40" rx="2" fill="#FEF3C7" />
        <path d="M150 220H180" stroke="#F59E0B" strokeWidth="2" />
        <path d="M190 220H210" stroke="#F59E0B" strokeWidth="2" />
        <path d="M220 220H250" stroke="#F59E0B" strokeWidth="2" />
      </svg>
    ),
    "havan-items": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M150 200H250L230 250H170L150 200Z" fill="#F59E0B" />
        <path d="M170 250H230C230 250 220 270 200 270C180 270 170 250 170 250Z" fill="#B45309" />
        <path d="M150 200H250C250 200 230 180 200 180C170 180 150 200 150 200Z" fill="#B45309" />
        <path
          d="M200 180C200 180 180 160 180 140C180 120 190 110 200 110C210 110 220 120 220 140C220 160 200 180 200 180Z"
          fill="#F97316"
        />
        <path d="M190 140C190 140 200 150 210 140" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M180 160C180 160 200 180 220 160" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M170 180C170 180 200 210 230 180" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M160 200C160 200 200 240 240 200" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M200 110V80" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <path d="M180 120L160 100" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <path d="M220 120L240 100" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    "traditional-clothing": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M150 80H250V250H150V80Z" fill="#F59E0B" />
        <path d="M150 80H250V100H150V80Z" fill="#B45309" />
        <path d="M150 230H250V250H150V230Z" fill="#B45309" />
        <path d="M170 100V230" stroke="#92400E" strokeWidth="2" />
        <path d="M230 100V230" stroke="#92400E" strokeWidth="2" />
        <path d="M150 80C150 80 170 60 200 60C230 60 250 80 250 80" stroke="#92400E" strokeWidth="4" />
        <path d="M180 60C180 60 190 40 200 40C210 40 220 60 220 60" stroke="#92400E" strokeWidth="4" />
        <path d="M190 140C190 140 200 150 210 140" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M190 160C190 160 200 170 210 160" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M190 180C190 180 200 190 210 180" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="200" cy="120" r="10" stroke="#FEF3C7" strokeWidth="2" />
      </svg>
    ),
    "sacred-mala": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <circle cx="200" cy="150" r="100" stroke="#B45309" strokeWidth="8" />
        <circle cx="200" cy="150" r="80" stroke="#F59E0B" strokeWidth="8" />
        <circle cx="200" cy="150" r="60" stroke="#B45309" strokeWidth="8" />
        <circle cx="200" cy="50" r="8" fill="#B45309" />
        <circle cx="200" cy="250" r="8" fill="#B45309" />
        <circle cx="100" cy="150" r="8" fill="#B45309" />
        <circle cx="300" cy="150" r="8" fill="#B45309" />
        <circle cx="129" cy="79" r="8" fill="#B45309" />
        <circle cx="271" cy="79" r="8" fill="#B45309" />
        <circle cx="129" cy="221" r="8" fill="#B45309" />
        <circle cx="271" cy="221" r="8" fill="#B45309" />
        <circle cx="200" cy="150" r="20" fill="#F59E0B" />
        <path
          d="M190 140L200 150L220 130"
          stroke="#FEF3C7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "sacred-idol": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path
          d="M200 50C180 50 170 70 170 80C170 100 180 110 190 120L170 200H230L210 120C220 110 230 100 230 80C230 70 220 50 200 50Z"
          fill="#F59E0B"
        />
        <path d="M170 200H230L240 250H160L170 200Z" fill="#B45309" />
        <path d="M180 120H220" stroke="#92400E" strokeWidth="4" />
        <circle cx="190" cy="90" r="5" fill="#92400E" />
        <circle cx="210" cy="90" r="5" fill="#92400E" />
        <path d="M190 100C190 100 200 110 210 100" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <path d="M200 120V200" stroke="#92400E" strokeWidth="2" />
        <path d="M160 250H240" stroke="#92400E" strokeWidth="4" />
        <path d="M190 250V270" stroke="#92400E" strokeWidth="4" />
        <path d="M210 250V270" stroke="#92400E" strokeWidth="4" />
        <path d="M190 270H210" stroke="#92400E" strokeWidth="4" />
      </svg>
    ),
    prasad: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <rect x="120" y="80" width="160" height="160" rx="10" fill="#F59E0B" />
        <rect x="120" y="120" width="160" height="10" fill="#B45309" />
        <rect x="120" y="190" width="160" height="10" fill="#B45309" />
        <path d="M200 80V240" stroke="#92400E" strokeWidth="4" />
        <rect x="140" y="140" width="40" height="40" rx="5" fill="#FEF3C7" />
        <rect x="220" y="140" width="40" height="40" rx="5" fill="#FEF3C7" />
        <path d="M150 160H170" stroke="#F59E0B" strokeWidth="2" />
        <path d="M160 150V170" stroke="#F59E0B" strokeWidth="2" />
        <path d="M230 160H250" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="160" cy="100" r="10" fill="#FEF3C7" />
        <circle cx="240" cy="100" r="10" fill="#FEF3C7" />
        <path d="M150 100H170" stroke="#F59E0B" strokeWidth="2" />
        <path d="M230 100H250" stroke="#F59E0B" strokeWidth="2" />
        <path d="M160 90V110" stroke="#F59E0B" strokeWidth="2" />
      </svg>
    ),
    "sacred-water": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M150 120H250V240C250 250 230 260 200 260C170 260 150 250 150 240V120Z" fill="#60A5FA" />
        <path d="M150 120H250V140C250 150 230 160 200 160C170 160 150 150 150 140V120Z" fill="#2563EB" />
        <path d="M170 120V80C170 70 180 60 200 60C220 60 230 70 230 80V120" stroke="#92400E" strokeWidth="4" />
        <path d="M180 180C180 180 200 200 220 180" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />
        <path d="M170 200C170 200 200 230 230 200" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />
        <path d="M160 220C160 220 200 260 240 220" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />
        <circle cx="200" cy="60" r="10" fill="#F59E0B" />
        <path d="M190 50L200 60L220 40" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "sacred-flag": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M200 50V250" stroke="#92400E" strokeWidth="8" />
        <path d="M200 50H300L280 100H200V50Z" fill="#F59E0B" />
        <path d="M200 100H280L260 150H200V100Z" fill="#F59E0B" />
        <path d="M200 150H260L240 200H200V150Z" fill="#F59E0B" />
        <path d="M220 75L240 75" stroke="#FEF3C7" strokeWidth="2" />
        <path d="M220 125L240 125" stroke="#FEF3C7" strokeWidth="2" />
        <path d="M220 175L240 175" stroke="#FEF3C7" strokeWidth="2" />
        <circle cx="260" cy="75" r="10" fill="#B45309" />
        <circle cx="240" cy="125" r="10" fill="#B45309" />
        <circle cx="220" cy="175" r="10" fill="#B45309" />
        <path d="M160 250H240" stroke="#92400E" strokeWidth="4" />
      </svg>
    ),
    fragrance: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M180 100H220L230 130H170L180 100Z" fill="#B45309" />
        <path d="M170 130H230V220C230 230 220 240 200 240C180 240 170 230 170 220V130Z" fill="#F59E0B" />
        <path d="M170 130H230V150C230 160 220 170 200 170C180 170 170 160 170 150V130Z" fill="#B45309" />
        <path d="M180 100C180 100 190 80 200 80C210 80 220 100 220 100" stroke="#92400E" strokeWidth="4" />
        <path d="M200 80V60" stroke="#92400E" strokeWidth="4" />
        <circle cx="200" cy="50" r="10" fill="#F59E0B" />
        <path d="M190 170V220" stroke="#92400E" strokeWidth="2" />
        <path d="M210 170V220" stroke="#92400E" strokeWidth="2" />
        <path d="M180 190H220" stroke="#92400E" strokeWidth="2" />
        <path d="M180 210H220" stroke="#92400E" strokeWidth="2" />
      </svg>
    ),
    "havan-kund": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M120 200C120 200 160 240 200 240C240 240 280 200 280 200H120Z" fill="#F59E0B" />
        <path d="M140 200V160C140 140 160 120 200 120C240 120 260 140 260 160V200" stroke="#92400E" strokeWidth="4" />
        <path d="M160 160V200" stroke="#92400E" strokeWidth="4" />
        <path d="M240 160V200" stroke="#92400E" strokeWidth="4" />
        <path d="M200 120V100" stroke="#92400E" strokeWidth="4" />
        <path d="M180 130L160 110" stroke="#92400E" strokeWidth="4" />
        <path d="M220 130L240 110" stroke="#92400E" strokeWidth="4" />
        <path d="M180 200C180 200 200 220 220 200" stroke="#92400E" strokeWidth="4" />
        <path d="M160 180C160 180 200 220 240 180" stroke="#92400E" strokeWidth="4" />
        <path d="M140 160C140 160 200 240 260 160" stroke="#92400E" strokeWidth="4" />
        <path d="M200 240V260" stroke="#92400E" strokeWidth="4" />
        <path d="M160 250H240" stroke="#92400E" strokeWidth="4" />
      </svg>
    ),
    "sacred-wood": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <rect x="140" y="80" width="40" height="160" rx="5" fill="#B45309" />
        <rect x="220" y="80" width="40" height="160" rx="5" fill="#B45309" />
        <rect x="140" y="120" width="120" height="20" rx="5" fill="#92400E" />
        <rect x="140" y="180" width="120" height="20" rx="5" fill="#92400E" />
        <path d="M150 100L170 100" stroke="#F59E0B" strokeWidth="2" />
        <path d="M150 140L170 140" stroke="#F59E0B" strokeWidth="2" />
        <path d="M150 160L170 160" stroke="#F59E0B" strokeWidth="2" />
        <path d="M150 200L170 200" stroke="#F59E0B" strokeWidth="2" />
        <path d="M150 220L170 220" stroke="#F59E0B" strokeWidth="2" />
        <path d="M230 100L250 100" stroke="#F59E0B" strokeWidth="2" />
        <path d="M230 140L250 140" stroke="#F59E0B" strokeWidth="2" />
        <path d="M230 160L250 160" stroke="#F59E0B" strokeWidth="2" />
        <path d="M230 200L250 200" stroke="#F59E0B" strokeWidth="2" />
        <path d="M230 220L250 220" stroke="#F59E0B" strokeWidth="2" />
      </svg>
    ),
    "cow-ghee": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M150 120H250V240C250 250 230 260 200 260C170 260 150 250 150 240V120Z" fill="#FBBF24" />
        <path d="M150 120H250V140C250 150 230 160 200 160C170 160 150 150 150 140V120Z" fill="#F59E0B" />
        <path d="M170 120V80C170 70 180 60 200 60C220 60 230 70 230 80V120" stroke="#92400E" strokeWidth="4" />
        <circle cx="200" cy="200" r="30" fill="#F59E0B" />
        <path
          d="M190 190L200 200L220 180"
          stroke="#FEF3C7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M180 160V240" stroke="#FEF3C7" strokeWidth="2" />
        <path d="M220 160V240" stroke="#FEF3C7" strokeWidth="2" />
      </svg>
    ),
    "cowdung-cake": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <circle cx="200" cy="150" r="80" fill="#92400E" />
        <circle cx="200" cy="150" r="60" fill="#B45309" />
        <circle cx="200" cy="150" r="40" fill="#F59E0B" />
        <path d="M160 150H240" stroke="#FEF3C7" strokeWidth="4" />
        <path d="M200 110V190" stroke="#FEF3C7" strokeWidth="4" />
        <path d="M170 120L230 180" stroke="#FEF3C7" strokeWidth="2" />
        <path d="M170 180L230 120" stroke="#FEF3C7" strokeWidth="2" />
        <circle cx="140" cy="110" r="15" fill="#B45309" />
        <circle cx="260" cy="110" r="15" fill="#B45309" />
        <circle cx="140" cy="190" r="15" fill="#B45309" />
        <circle cx="260" cy="190" r="15" fill="#B45309" />
      </svg>
    ),
    gaumutra: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M170 100H230V220C230 230 220 240 200 240C180 240 170 230 170 220V100Z" fill="#FBBF24" />
        <path d="M170 100H230V120C230 130 220 140 200 140C180 140 170 130 170 120V100Z" fill="#F59E0B" />
        <path d="M180 100V80C180 70 190 60 200 60C210 60 220 70 220 80V100" stroke="#92400E" strokeWidth="4" />
        <path d="M180 80H220" stroke="#92400E" strokeWidth="4" />
        <path d="M190 60V80" stroke="#92400E" strokeWidth="4" />
        <path d="M210 60V80" stroke="#92400E" strokeWidth="4" />
        <path d="M180 160C180 160 200 180 220 160" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M180 180C180 180 200 200 220 180" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M180 200C180 200 200 220 220 200" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M200 240V260" stroke="#92400E" strokeWidth="4" />
        <path d="M180 260H220" stroke="#92400E" strokeWidth="4" />
      </svg>
    ),
    dhoop: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M200 250V150" stroke="#92400E" strokeWidth="8" />
        <path
          d="M200 150C200 150 180 130 180 110C180 90 190 80 200 80C210 80 220 90 220 110C220 130 200 150 200 150Z"
          fill="#F59E0B"
        />
        <path d="M180 110C180 110 200 130 220 110" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        <path d="M200 80V50" stroke="#92400E" strokeWidth="4" />
        <path d="M190 60C190 60 200 40 210 60" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <path d="M180 70C180 70 200 30 220 70" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <path d="M170 80C170 80 200 20 230 80" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <rect x="180" y="250" width="40" height="20" rx="5" fill="#B45309" />
      </svg>
    ),
    agarbatti: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <path d="M200 250V150" stroke="#92400E" strokeWidth="4" />
        <path d="M200 150V80" stroke="#B45309" strokeWidth="4" />
        <path d="M200 80V40" stroke="#92400E" strokeWidth="4" />
        <path d="M190 50C190 50 200 30 210 50" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <path d="M180 60C180 60 200 20 220 60" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <path d="M170 70C170 70 200 10 230 70" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <rect x="180" y="150" width="40" height="20" rx="5" fill="#F59E0B" />
        <rect x="190" y="250" width="20" height="20" rx="5" fill="#B45309" />
        <path d="M180 160H220" stroke="#FEF3C7" strokeWidth="2" />
        <path d="M200 150V170" stroke="#FEF3C7" strokeWidth="2" />
      </svg>
    ),
  }

  return (
    svgMap[svgType] || (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" className={className}>
        <rect width="400" height="300" fill="#FFF7ED" />
        <circle cx="200" cy="150" r="80" stroke="#F59E0B" strokeWidth="8" />
        <path d="M160 150H240" stroke="#F59E0B" strokeWidth="8" />
        <path d="M200 110V190" stroke="#F59E0B" strokeWidth="8" />
      </svg>
    )
  )
}

