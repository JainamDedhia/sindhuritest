export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-4 gap-6">
        {["Products", "Banners", "Enquiries", "Sold Out"].map((title) => (
          <div
            key={title}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >
            <p className="text-sm text-neutral-500">{title}</p>
            <p className="text-2xl font-semibold mt-2">12</p>
          </div>
        ))}
      </div>
    </div>
  );
}
