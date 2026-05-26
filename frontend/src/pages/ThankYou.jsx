import { useLocation, Link } from 'react-router-dom'

export default function ThankYou() {
  const { state } = useLocation()

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
      <p className="text-gray-500 mb-1">Thank you for shopping with ShopZone.</p>
      {state?.orderId && (
        <p className="text-gray-500 mb-6">
          Your order <span className="font-semibold text-blue-600">#{state.orderId}</span> has been confirmed.
        </p>
      )}

      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-left">
        <h2 className="font-semibold text-green-800 mb-3">What happens next?</h2>
        <ul className="space-y-2 text-sm text-green-700">
          <li className="flex items-start gap-2"><span className="mt-0.5">📦</span> Your order is being prepared</li>
          <li className="flex items-start gap-2"><span className="mt-0.5">🚚</span> You will receive a shipping confirmation soon</li>
          <li className="flex items-start gap-2"><span className="mt-0.5">✅</span> Track your order in the Orders section</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/orders"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          View My Orders
        </Link>
        <Link
          to="/products"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
