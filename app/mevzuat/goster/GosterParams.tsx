'use client'

import { useSearchParams } from 'next/navigation'
import MaddeClient from '../[kanunId]/[id]/MaddeClient'

export default function GosterParams() {
    const sp = useSearchParams()
    const kanunId = sp.get('kanunId') || ''
    const id = sp.get('id') || ''

    if (!kanunId || !id) {
        return (
            <p className="text-charcoal/60 text-sm">
                Madde parametreleri eksik. Lütfen mevzuat listesinden bir madde seçin.
            </p>
        )
    }

    return <MaddeClient kanunId={kanunId} id={id} />
}
