import { permanentRedirect } from 'next/navigation';

/** Turkish alias for English-speaking lawyer page (SEO + UX). Kalıcı (308): geçici 307 site haritasında yönlendirme sinyali veriyordu (G06b). */
export default function IngilizceAvukatRedirect() {
    permanentRedirect('/english-speaking-lawyer');
}
