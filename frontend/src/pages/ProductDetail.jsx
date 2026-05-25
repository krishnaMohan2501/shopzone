import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data))
  }, [id])

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }
    await addToCart(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img src={product.imageUrl || 'https://via.placeholder.com/500'} alt={product.name}
          className="w-full md:w-96 h-80 object-cover" />
        <div className="p-8 flex-1">
          <p className="text-blue-600 text-sm font-medium uppercase mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">₹{product.price}</p>
          <p className={`text-sm mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <input type="number" min="1" max={product.stock} value={qty}
              onChange={e => setQty(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
              className="border rounded-lg px-3 py-2 w-20 text-center" />
          </div>
          <button onClick={handleAdd} disabled={product.stock === 0}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition ${added ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-300`}>
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
