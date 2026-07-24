import { redirect } from 'next/navigation';

/** Turkish alias for English-speaking lawyer page (SEO + UX). */
export default function IngilizceAvukatRedirect() {
    redirect('/english-speaking-lawyer');
}
