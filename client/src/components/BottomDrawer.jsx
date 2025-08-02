import facilities from '../data/mockFacilities';

export default function BottomDrawer() {
  return (
    <div className="w-full h-[600px] overflow-y-auto rounded-2xl bg-base-100/80 backdrop-blur-lg shadow-2xl p-6 border border-base-300">
      <h2 className="mb-4 text-xl font-bold text-secondary">Gemini's Suggestions</h2>
      <div className="flex flex-col gap-4">
        {facilities.map((f) => (
          <div key={f.id} className="card bg-base-300/80 backdrop-blur-md shadow-md p-4 rounded-xl">
            <h3 className="card-title text-accent-content text-base">{f.name}</h3>
            <p className="text-sm text-base-content">{f.type} • <span className={f.open ? 'text-success' : 'text-error'}>{f.open ? 'Open' : 'Closed'}</span></p>
            <div className="mt-3 flex gap-2">
              <button className="btn btn-sm btn-outline btn-success">Ask Gemini</button>
              <button className="btn btn-sm btn-outline btn-info">Get Directions</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
