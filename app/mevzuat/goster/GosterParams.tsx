'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import MaddeClient from '../[kanunId]/[id]/MaddeClient'

/**
 * Resolve kanunId/id from:
 * 1) query (?kanunId=&id=) — direct /mevzuat/goster links
 * 2) path (/mevzuat/tmk/madde-1) — middleware rewrite keeps pretty URL
 */
export default function GosterParams() {
    const pathname = usePathname() || ''
    const sp = useSearchParams()

    let kanunId = sp.get('kanunId') || ''
    let id = sp.get('id') || ''

    if (!kanunId || !id) {
        const m = pathname.match(/^\/mevzuat\/([^/]+)\/([^/]+)\/?$/)
        if (m && m[1] !== 'goster') {
            kanunId = decodeURIComponent(m[1])
            id = decodeURIComponent(m[2])
        }
    }

    if (!kanunId || !id) {
        return (
            <p className="text-charcoal/60 text-sm">
                Madde parametreleri eksik. Lütfen mevzuat listesinden bir madde seçin.
            </p>
        )
    }

    return <MaddeClient kanunId={kanunId} id={id} />
}
