export const dynamic = 'force-static'

export default function DeployCheckPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-cream p-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-charcoal mb-2">Deploy OK</h1>
                <p className="text-charcoal/60 text-sm font-mono">build-marker: 61729d0f-ssg-madde-client</p>
            </div>
        </main>
    )
}
