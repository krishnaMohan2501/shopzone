import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { refreshCart } = useCart()
  const [processing, setProcessing] = useState(false)
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })

  if (!state?.orderId) {
    navigate('/')
    return null
  }

  const formatCardNumber = v =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = v =>
    v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2')

  const handlePay = async e => {
    e.preventDefault()
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    await refreshCart()
    navigate('/thank-you', { state: { orderId: state.orderId, total: state.total } })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Secure Payment</h1>
        <p className="text-gray-500 mt-1">Order #{state.orderId} · ₹{Number(state.total).toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex gap-2 mb-6">
          {['💳 Visa', '💳 Mastercard', '💳 RuPay'].map(b => (
            <span key={b} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{b}</span>
          ))}
        </div>

        <form onSubmit={handlePay} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              required
              type="text"
              placeholder="Name on card"
              value={card.name}
              onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              required
              type="text"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input
                required
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                required
                type="password"
                placeholder="···"
                maxLength={4}
                value={card.cvv}
                onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex justify-between text-sm">
            <span className="text-gray-600">Total to pay</span>
            <span className="font-bold text-blue-600 text-base">₹{Number(state.total).toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Processing Payment...
              </>
            ) : (
              <>🔒 Pay ₹{Number(state.total).toFixed(2)}</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">🔒 256-bit SSL encrypted · Payments are always successful</p>
      </div>
    </div>
  )
}
