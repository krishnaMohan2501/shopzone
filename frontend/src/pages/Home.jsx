import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    api.get('/products?size=6').then(r => setFeatured(r.data.content || []))
  }, [])

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopZone</h1>
        <p className="text-xl text-blue-100 mb-8">Discover amazing products at great prices</p>
        <Link to="/products"
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg transition shadow-lg">
          Shop Now
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/products"
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full transition">
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  )
}
