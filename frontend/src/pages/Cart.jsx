import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateItem, removeItem } = useCart()
  const navigate = useNavigate()
  const [busyId, setBusyId] = useState(null)

  const withBusy = (id, fn) => async () => {
    if (busyId) return
    setBusyId(id)
    try { await fn() } finally { setBusyId(null) }
  }

  const items = Array.isArray(cart.items) ? cart.items : []
  const total = items.reduce((sum, i) => sum + (Number(i.product?.price) || 0) * (i.quantity || 0), 0)

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-6xl mb-4">🛒</p>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
        Browse Products
      </Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
            <img src={item.product.imageUrl || 'https://via.placeholder.com/80'}
              alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-blue-600 font-bold">₹{item.product.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={withBusy(item.id, () => updateItem(item.id, item.quantity - 1))}
                disabled={busyId === item.id}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 font-bold transition">−</button>
              <span className="w-8 text-center font-medium">{busyId === item.id ? '…' : item.quantity}</span>
              <button onClick={withBusy(item.id, () => updateItem(item.id, item.quantity + 1))}
                disabled={busyId === item.id}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 font-bold transition">+</button>
            </div>
            <p className="w-24 text-right font-bold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
            <button onClick={withBusy(item.id, () => removeItem(item.id))}
              disabled={busyId === item.id}
              className="text-red-400 hover:text-red-600 disabled:opacity-40 transition ml-2">✕</button>
          </div>
        ))}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <span className="text-xl font-bold">Total: ₹{total.toFixed(2)}</span>
          <button onClick={() => navigate('/checkout')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
