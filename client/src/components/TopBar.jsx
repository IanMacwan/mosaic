export default function TopBar() {
  return (
    <div className="sticky top-0 z-30 w-full bg-base-100/90 backdrop-blur-sm border-b border-base-300 shadow-md">
      <div className="max-w-full px-4 sm:px-6 lg:px-12 py-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Describe the healthcare you need..."
          className="input input-bordered w-full bg-base-100 text-base-content"
        />
        <button className="btn btn-primary">Search</button>
      </div>
    </div>
  );
}