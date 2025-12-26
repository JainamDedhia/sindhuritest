export default function CartPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Your Cart</h1>

      {/* Cart Item */}
      <div className="border p-4 rounded-md bg-gray-100 flex justify-between">
        <div>
          <p className="font-medium">Gold Ring</p>
          <p className="text-sm text-gray-600">₹45,000</p>
        </div>
        <button className="text-red-500">Remove</button>
      </div>

      {/* Enquiry */}
      <div className="border p-4 rounded-md space-y-3">
        <h2 className="font-semibold">Send Enquiry</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Your Name"
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Phone Number"
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Message"
        />

        <button className="w-full bg-gray-800 text-white py-2 rounded">
          Send Enquiry
        </button>
      </div>
    </main>
  );
}
