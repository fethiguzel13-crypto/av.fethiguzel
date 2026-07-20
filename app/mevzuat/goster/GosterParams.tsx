'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import MaddeClient from '../[kanunId]/[id]/MaddeClient'

function parseMaddeLocation(pathname: string, search: string): { kanunId: string; id: string } {
    const q = new URLSearchParams(search)
    let kanunId = q.get('kanunId') || ''
    let id = q.get('id') || ''

    if (!kanunId || !id) {
        const m = pathname.match(/^\/mevzuat\/([^/]+)\/([^/]+)\/?$/)
        if (m && m[1] !== 'goster') {
            kanunId = decodeURIComponent(m[1])
            id = decodeURIComponent(m[2])
        }
    }
    return { kanunId, id }
}

export default function GosterParams() {
    const pathname = usePathname() || ''
    const sp = useSearchParams()
    const [ids, setIds] = useState(() =>
        parseMaddeLocation(pathname, sp.toString() ? `?${sp.toString()}` : '')
    )

    // Re-resolve on client after hydration (window has true browser URL)
    useEffect(() => {
        if (typeof window === 'undefined') return
        setIds(parseMaddeLocation(window.location.pathname, window.location.search))
    }, [pathname, sp])

    const { kanunId, id } = ids

    if (!kanunId || !id) {
        return (
            <p className="text-charcoal/60 text-sm">
                Madde parametreleri eksik. Lütfen mevzuat listesinden bir madde seçin.
            </p>
        )
    }

    return <MaddeClient kanunId={kanunId} id={id} />
}
