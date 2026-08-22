import type { VatandasArticle } from '@/lib/vatandas-rehberi';
import { primaryStamp, type RehberClock } from '@/lib/vatandas-rehberi/visual-plan';
import {
    PAPER_SRC,
    buildVisualScene,
    cropPosition,
    pickObjects,
} from '@/lib/vatandas-rehberi/visual-scene';

export default function RehberHero({
    article,
    clocks,
}: {
    article: VatandasArticle;
    clocks: RehberClock[];
}) {
    const stamp = primaryStamp(clocks, article);
    const scene = buildVisualScene(
        article.slug,
        article.category,
        stamp,
        article.keywords?.[0] || article.category
    );
    const crop = cropPosition(scene.seed);
    const obj = pickObjects(scene.seed).a;
    const rot = ((scene.seed % 13) - 6) * 0.45;
    const objLeft = scene.layout === 'desk-right' || scene.layout === 'diptych';

    return (
        <figure className="mb-10 rehber-hero">
            <div className="relative overflow-hidden rounded-[1.6rem] sm:rounded-[2rem] border border-charcoal/10 bg-[#e6dfd0] h-[228px] sm:h-[300px] shadow-soft">
                <img
                    src={PAPER_SRC}
                    alt=""
                    width={1280}
                    height={720}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: crop }}
                />
                <img
                    src={obj}
                    alt=""
                    width={1024}
                    height={1024}
                    className="absolute object-cover shadow-lift"
                    style={{
                        width: '42%',
                        height: '78%',
                        top: '12%',
                        left: objLeft ? '6%' : 'auto',
                        right: objLeft ? 'auto' : '7%',
                        borderRadius: '0.4rem',
                        transform: `rotate(${rot}deg)`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/25 via-transparent to-charcoal/10" />

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="inline-block bg-primary text-cream font-mono text-[10px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-sm shadow-soft">
                        {article.category}
                    </span>
                </div>

                <div
                    className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 min-w-[5.75rem] rounded-sm bg-accent text-cream px-3.5 py-2.5 text-center shadow-lift"
                    style={{ transform: `rotate(${((scene.seed % 7) - 3) * 0.5}deg)` }}
                >
                    <p className="font-drama text-[1.7rem] sm:text-[2rem] leading-none font-semibold m-0">
                        {stamp}
                    </p>
                </div>
            </div>
            <figcaption className="sr-only">
                {article.h1} — {article.category}
                {stamp ? `, öne çıkan süre: ${stamp}` : ''}
            </figcaption>
        </figure>
    );
}
