export const dynamic = 'force-static'

export default function DeployCheckPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-cream p-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-charcoal mb-2">Deploy OK</h1>
                <p className="text-charcoal/60 text-sm font-mono">
                    build-marker: 2026-07-25-prebuild-noop-v3
                </p>
                <p className="mt-4 text-sm text-charcoal/50">
                    Madde: App Router + jsDelivr · prebuild ~0s (no pack gunzip)
                </p>
                <p className="mt-2">
                    <a href="/mevzuat/tbk/madde-1" className="text-accent font-semibold text-sm">
                        TBK Madde 1 test →
                    </a>
                </p>
            </div>
        </main>
    )
}
