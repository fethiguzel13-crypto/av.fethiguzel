/**
 * Aç/kapa anahtarı — Ayarlar ve Takip ekranlarının ortak düğmesi.
 *
 * Dokunma kutusu 56×44, görünen ray 48×28. Kapalı ray `--ink-4`: kâğıt
 * zeminde 3,2:1, metin dışı öğe eşiğinin (WCAG 1.4.11, 3:1) üstünde. Takip
 * ekranındaki eski kopya 48×28 kutu ve %18 siyah rayla (1,46:1) kalmıştı;
 * iki ekran artık aynı bileşeni çizer (G21, design-audit «bileşen»).
 */
export default function Anahtar({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => void onChange(!checked)}
      className="shrink-0 grid place-items-center w-14 h-11 -mr-1 rounded-xl tap"
    >
      <span
        className="block w-12 h-7 rounded-full p-0.5 transition-colors"
        style={{ background: checked ? 'var(--brand)' : 'var(--ink-4)' }}
      >
        <span
          className="block w-6 h-6 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </span>
    </button>
  );
}
