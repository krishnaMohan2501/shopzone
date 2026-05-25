import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '0')

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams({ page, size: 9 })
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    api.get(`/products?${params}`).then(r => {
      setProducts(r.data.content || [])
      setTotalPages(r.data.totalPages || 0)
    })
  }, [search, category, page])

  const update = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    p.set('page', '0')
    setSearchParams(p)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text" placeholder="Search products..."
          value={search}
          onChange={e => update('search', e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={e => update('category', e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i}
              onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', i); setSearchParams(p) }}
              className={`w-10 h-10 rounded-lg font-medium transition ${page === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-blue-50'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
