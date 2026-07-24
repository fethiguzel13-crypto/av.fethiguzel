/**
 * WCAG skip navigation — required on high-quality accessible legal sites.
 */
export default function SkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-accent focus:text-white focus:px-5 focus:py-3 focus:rounded-full focus:font-bold focus:text-sm focus:shadow-lift"
        >
            İçeriğe atla
        </a>
    );
}
