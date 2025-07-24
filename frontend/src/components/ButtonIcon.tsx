import React from 'react'

interface ButttonIconProps {
    href?: string
    onClick?: () => void
    icons: React.ReactNode
    title: string
}

function ButttonIcon({ onClick, icons, title }: ButttonIconProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center h-max p-3 text-xs font-semibold text-white bg-gradient-to-br from-pink-500 to-purple-700 rounded-md shadow-md transition hover:brightness-110"
        >
            {icons}
            {title}
        </button>
    )
}

export default ButttonIcon
