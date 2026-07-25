export const dynamic = 'force-static'

export default function DeployCheckPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-cream p-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-charcoal mb-2">Deploy OK</h1>
                <p className="text-charcoal/60 text-sm font-mono">
                    build-marker: 2026-07-25-app-router-madde-v1
                </p>
                <p className="mt-4 text-sm text-charcoal/50">
                    Madde sayfaları: App Router + jsDelivr packs
                </p>
            </div>
        </main>
    )
}
