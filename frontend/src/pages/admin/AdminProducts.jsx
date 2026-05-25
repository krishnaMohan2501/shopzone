import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    api.get('/products?size=100').then(r => setProducts(r.data.content || []))
    api.get('/categories').then(r => setCategories(r.data))
  }
  useEffect(load, [])

  const submit = async e => {
    e.preventDefault()
    const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), categoryId: form.categoryId || null }
    if (editing) await api.put(`/products/${editing}`, data)
    else await api.post('/products', data)
    setForm(emptyForm); setEditing(null); setShowForm(false); load()
  }

  const edit = p => {
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, imageUrl: p.imageUrl || '', categoryId: p.category?.id || '' })
    setEditing(p.id); setShowForm(true)
  }

  const del = async id => {
    if (confirm('Delete this product?')) { await api.delete(`/products/${id}`); load() }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm) }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-2 text-xl font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
          {['name','description','imageUrl'].map(f => (
            <div key={f} className={f === 'description' ? 'col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f}</label>
              <input type="text" value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})}
                required={f==='name'}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input type="number" step="0.01" min="0.01" required value={form.price}
              onChange={e => setForm({...form,price:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input type="number" min="0" required value={form.stock}
              onChange={e => setForm({...form,stock:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.categoryId} onChange={e => setForm({...form,categoryId:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">None</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            {editing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{['Image','Name','Category','Price','Stock','Actions'].map(h=>(
              <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={p.imageUrl || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 object-cover rounded" />
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name || '-'}</td>
                <td className="px-4 py-3 font-bold text-blue-600">₹{p.price}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => edit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => del(p.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
