/**
 * JSON-LD'yi `<script type="application/ld+json">` içine güvenle basar (Aylık plan G03).
 *
 * JSON.stringify "<" karakterini kaçırmaz: içerikte (karar özeti, kavram başlığı, rehber metni)
 * "</script>" geçerse betik bloğu erken kapanır ve sonrası HTML olarak yorumlanır (XSS).
 * <, >, & ve satır/paragraf ayırıcıları (U+2028/U+2029) kaçış dizisiyle yazılır; JSON'un anlamı değişmez.
 */

// Ayırıcılar kaynakta harf olarak yazılmaz: JS'te satır sonu sayılır ve düzenli ifadeyi kırar.
const SATIR_AYIRICI = String.fromCharCode(0x2028);
const PARAGRAF_AYIRICI = String.fromCharCode(0x2029);

export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replaceAll(SATIR_AYIRICI, "\\u2028")
    .replaceAll(PARAGRAF_AYIRICI, "\\u2029");
}
