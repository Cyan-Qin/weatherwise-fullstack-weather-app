type Props = {
  advice: string[];
};

export default function AdvicePanel({ advice }: Props) {
  return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Travel & Weather Advice</h3>
          <ul className="mt-4 space-y-3">
              {advice.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-slate-50 p-4">
                      {item}
                  </li>
              ))}
          </ul>
      </section>
  );
}