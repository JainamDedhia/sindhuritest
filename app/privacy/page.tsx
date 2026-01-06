export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-gray">
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p>We collect your name, email, phone number when you create an account...</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p>Your WhatsApp number is used for order updates and customer support...</p>
        
        {/* Add more sections as needed */}
      </div>
    </div>
  )
}