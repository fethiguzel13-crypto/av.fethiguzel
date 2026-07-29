export const dynamic = 'force-static'

export default function DeployCheckPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-cream p-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-charcoal mb-2">Deploy OK</h1>
                <p className="text-charcoal/60 text-sm font-mono">
                    build-marker: 2026-07-29-seo-tbk13-visibility-v1
                </p>
                <p className="mt-4 text-sm text-charcoal/50">
                    SEO: TBK 13 title · /mevzuat/tbk hub · sitemap split · /bilgi nav
                </p>
                <p className="mt-2 flex flex-wrap justify-center gap-3">
                    <a href="/mevzuat/tbk/madde-13" className="text-accent font-semibold text-sm">
                        TBK 13 test →
                    </a>
                    <a href="/mevzuat/tbk" className="text-accent font-semibold text-sm">
                        TBK hub →
                    </a>
                    <a href="/bilgi" className="text-accent font-semibold text-sm">
                        Vatandaş rehberi →
                    </a>
                </p>
            </div>
        </main>
    )
}
