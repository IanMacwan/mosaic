export default function InfoPanel() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 mt-12 mb-16 flex justify-center">
      <div className="w-full max-w-7xl rounded-2xl bg-base-100/80 backdrop-blur-lg shadow-2xl p-8 text-center border border-base-300">
        <h2 className="text-3xl font-bold mb-3 text-secondary-content">Find Your Perfect Healthcare Match</h2>
        <p className="text-base text-base-content mb-8 max-w-3xl mx-auto">
          Tell our AI assistant what type of care you need, and we'll find culturally competent, accessible providers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: 1,
              title: 'Describe Your Needs',
              desc: 'Tell us what care you’re looking for.',
            },
            {
              step: 2,
              title: 'Get Matched',
              desc: 'AI finds culturally competent providers.',
            },
            {
              step: 3,
              title: 'Book Care',
              desc: 'Connect with the right provider.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="card bg-base-300/80 backdrop-blur-md p-6 shadow-md rounded-xl"
            >
              <div className="text-3xl font-bold text-accent mb-2">{item.step}</div>
              <h3 className="font-semibold text-lg text-accent-content mb-1">{item.title}</h3>
              <p className="text-sm text-base-content">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-accent font-medium">
          <span>🟢 Language preferences</span>
          <span>🟢 Insurance acceptance</span>
          <span>🟢 Accessibility needs</span>
        </div>
      </div>
    </section>
  );
}
