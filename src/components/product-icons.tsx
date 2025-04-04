import type React from "react"

interface ProductIconsProps {
  iconName: string
  className?: string
}

export const ProductIcons: React.FC<ProductIconsProps> = ({ iconName, className = "w-6 h-6" }) => {
  const iconMap: Record<string, JSX.Element> = {
    "copper-vessel": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M8 2h8l2 4H6l2-4z" />
        <path d="M4 6v2a8 8 0 0 0 16 0V6" />
        <path d="M8 12v8" />
        <path d="M16 12v8" />
        <path d="M8 20h8" />
      </svg>
    ),
    "sacred-book": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h6" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    ),
    "pooja-items": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
        <path d="M9 14h6" />
        <path d="M12 12v4" />
      </svg>
    ),
    "havan-items": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2v5" />
        <path d="M6 7h12" />
        <path d="M17 7l-5 5-5-5" />
        <path d="M18 16a5 5 0 0 0-6 0 5 5 0 0 0-6 0" />
        <path d="M12 12v10" />
      </svg>
    ),
    "traditional-clothing": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M6.5 2L2 6.5V17h6v5h8v-5h6V6.5L17.5 2h-11z" />
        <path d="M9.5 2v5a2.5 2.5 0 0 0 5 0V2" />
      </svg>
    ),
    "sacred-mala": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
      </svg>
    ),
    "sacred-idol": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2a3 3 0 0 0-3 3c0 1.6.8 3 2 4l-3 7h8l-3-7c1.2-1 2-2.4 2-4a3 3 0 0 0-3-3z" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M9 7h6" />
      </svg>
    ),
    prasad: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M6 12h12" />
        <path d="M6 20h12" />
        <path d="M6 4h12" />
        <path d="M18 4v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
        <path d="M12 4v16" />
      </svg>
    ),
    "sacred-water": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2v6" />
        <path d="M5.45 5.11L8 10" />
        <path d="M18.55 5.11L16 10" />
        <path d="M6 14a6 6 0 0 0 12 0c0-3.09-3.6-7-6-9.33C9.6 7 6 10.91 6 14z" />
      </svg>
    ),
    "sacred-flag": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 22V4c6-3 8 2 14-1v16c-6 3-8-2-14 1" />
        <path d="M4 2v20" />
      </svg>
    ),
    fragrance: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M8 3h8l2 4H6l2-4z" />
        <path d="M10 7v14" />
        <path d="M14 7v14" />
        <path d="M6 21h12" />
        <path d="M6 13h12" />
      </svg>
    ),
    "havan-kund": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 22a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z" />
        <path d="M8 13v-2" />
        <path d="M16 13v-2" />
        <path d="M12 13v-1" />
        <path d="M9 6c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.7-1.3 3-3 3" />
        <path d="M12 9v1" />
      </svg>
    ),
    "sacred-wood": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M8 5v14" />
        <path d="M16 5v14" />
        <path d="M8 5h8" />
        <path d="M8 19h8" />
        <path d="M8 12h8" />
      </svg>
    ),
    "cow-ghee": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M5.2 6.2l1.4 1.4" />
        <path d="M2 13h2" />
        <path d="M20 13h2" />
        <path d="M17.4 6.2l-1.4 1.4" />
        <path d="M8 20h8" />
        <path d="M12 3v2" />
        <circle cx="12" cy="13" r="5" />
      </svg>
    ),
    "cowdung-cake": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
    gaumutra: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M8 21h8" />
        <path d="M12 21v-2" />
        <path d="M10 5h4" />
        <path d="M8.8 9A6 6 0 0 0 8 12a6 6 0 0 0 12 0 6 6 0 0 0-.8-3" />
        <path d="M10 3v2" />
        <path d="M14 3v2" />
      </svg>
    ),
    dhoop: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2v5" />
        <path d="M12 19v3" />
        <path d="M12 12a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0 5z" />
        <path d="M16 12c0-2.5-4-3.5-4-3.5s-4 1-4 3.5 4 3.5 4 3.5 4-1 4-3.5z" />
        <path d="M12 12v4" />
      </svg>
    ),
    agarbatti: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2v7" />
        <path d="M12 22v-3" />
        <path d="M12 13v3" />
        <path d="M10 13h4" />
        <path d="M12 9c.5 0 1 .1 1.5.4l.6.2c.5.2.9.4.9.8.5.4.5.8.5 1.2 0 .3-.1.6-.4.9-.2.2-.6.5-1.1.7l-.5.2c-.5.2-1 .2-1.5.2s-1-.1-1.5-.4l-.6-.2c-.5-.2-.9-.4-.9-.8-.5-.4-.5-.8-.5-1.2 0-.3.1-.6.4-.9.2-.2.6-.5 1.1-.7l.5-.2c.5-.2 1-.2 1.5-.2z" />
      </svg>
    ),
  }

  return (
    iconMap[iconName] || (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    )
  )
}

