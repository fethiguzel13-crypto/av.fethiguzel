export const dynamic = 'force-static'

export default function DeployCheckPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-cream p-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-charcoal mb-2">Deploy OK</h1>
                <p className="text-charcoal/60 text-sm font-mono">
                    build-marker: 2026-07-29-hesaplama-bilgi-links-v1
                </p>
                <p className="mt-4 text-sm text-charcoal/50">
                    Madde: App Router + static SEO HTML · /bilgi 553 · hesaplama→bilgi iç link
                </p>
                <p className="mt-2 flex flex-wrap justify-center gap-3">
                    <a href="/mevzuat/tbk/madde-1" className="text-accent font-semibold text-sm">
                        TBK Madde 1 test →
                    </a>
                    <a href="/bilgi/kidem-tazminati-nasil-alinir" className="text-accent font-semibold text-sm">
                        Kıdem rehber →
                    </a>
                    <a href="/hesaplama/kidem" className="text-accent font-semibold text-sm">
                        Kıdem hesap →
                    </a>
                </p>
            </div>
        </main>
    )
}
