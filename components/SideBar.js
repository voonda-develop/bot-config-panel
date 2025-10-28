"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function Sidebar() {
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const links = [
        { href: "/admin-bot", label: "Administrar Bot" },
        { href: "/upload-autos", label: "Subir Archivo de Automóviles" },
        { href: "/vehiculos", label: "Gestión de Vehículos" }
    ]

    return (
        <aside className='w-64 bg-gray-100 h-screen p-4 border-r'>
            <Image src='/voonda.jpg' alt='VOONDA' width={160} height={60} className='mb-6' />
            <nav className='space-y-2'>
                {links.map((link) => (
                    <Link key={link.href} href={link.href} className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === link.href ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
