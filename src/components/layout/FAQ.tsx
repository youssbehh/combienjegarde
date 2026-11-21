interface Props {
  items: { question: string; answer: string }[];
  titre?: string;
  className?: string;
}

export default function FAQ({ items, titre = 'Questions fréquentes', className = '' }: Props) {
  if (items.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="font-titre font-bold text-bleu-marine text-2xl mb-6">{titre}</h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details key={item.question} className="bg-white rounded-card shadow-card group">
            <summary className="p-5 font-titre font-semibold text-bleu-marine cursor-pointer list-none flex justify-between items-center gap-4">
              {item.question}
              <span aria-hidden="true" className="text-vert-menthe font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="px-5 pb-5 font-corps text-sm text-gris-fonce leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
