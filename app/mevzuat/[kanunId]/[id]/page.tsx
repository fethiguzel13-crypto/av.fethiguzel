import type { Metadata } from 'next';
import MaddeViewer from './MaddeViewer';

type Props = { params: Promise<{ kanunId: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { kanunId, id } = await params;
    const label = `${kanunId.toUpperCase()} ${id.replace(/-/g, ' ')}`;
    return {
        title: `${label} | Mevzuat ve Akademik Şerh`,
        description: `${label} resmî metni ve akademik şerh — Av. Fethi Güzel Hukuk Portalı.`,
        alternates: {
            canonical: `https://avfethiguzel.com/mevzuat/${kanunId}/${id}`,
        },
        openGraph: {
            title: `${label} | Av. Fethi Güzel`,
            description: 'Resmî madde metni ve akademik şerh.',
            url: `https://avfethiguzel.com/mevzuat/${kanunId}/${id}`,
        },
    };
}

export default async function MaddePage({ params }: Props) {
    const { kanunId, id } = await params;
    return <MaddeViewer kanunId={kanunId} id={id} />;
}
