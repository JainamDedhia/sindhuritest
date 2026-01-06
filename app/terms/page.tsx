export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
      <div className="prose prose-gray">
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using Sinduri Jewellers, you accept and agree to be bound by these terms...</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. User Account</h2>
        <p>You are responsible for maintaining the confidentiality of your account...</p>
        
        {/* Add more sections as needed */}
      </div>
    </div>
  )
}