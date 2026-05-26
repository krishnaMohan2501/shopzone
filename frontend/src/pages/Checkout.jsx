import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { cart } = useCart()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const total = cart.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0

  const place = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data: order } = await api.post('/orders', { shippingAddress: address })
      navigate('/payment', { state: { orderId: order.id, total, address } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={place}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
          <textarea required rows={4} value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter your full shipping address..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button type="submit" disabled={loading || !cart.items?.length}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60">
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {cart.items?.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-b-0">
            <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
            <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
