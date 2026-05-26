import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
  const { cart, addToCart, updateItem, removeItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const cartItem = cart.items?.find(i => i.product.id === product.id)

  const withBusy = fn => async () => {
    if (busy) return
    setBusy(true)
    try { await fn() } finally { setBusy(false) }
  }

  const handleAdd = withBusy(() => {
    if (!user) { navigate('/login'); return Promise.resolve() }
    return addToCart(product.id)
  })

  const handleIncrease = withBusy(() => updateItem(cartItem.id, cartItem.quantity + 1))
  const handleDecrease = withBusy(() => {
    if (cartItem.quantity === 1) return removeItem(cartItem.id)
    return updateItem(cartItem.id, cartItem.quantity - 1)
  })

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover hover:opacity-90 transition"
        />
      </Link>
      <div className="p-4">
        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
          {product.category?.name || 'Uncategorized'}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {cartItem ? (
          <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
            <button
              onClick={handleDecrease}
              disabled={busy}
              className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-100 disabled:opacity-40 rounded-full text-xl font-bold transition"
            >
              −
            </button>
            <span className="font-semibold text-blue-700 text-base w-6 text-center">
              {busy ? '…' : cartItem.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={busy}
              className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-100 disabled:opacity-40 rounded-full text-xl font-bold transition"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || busy}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded-lg transition font-medium"
          >
            {busy ? 'Adding…' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  )
}
