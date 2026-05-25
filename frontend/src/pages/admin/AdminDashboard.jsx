import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your ShopZone store</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link to="/admin/products"
          className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition group">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold group-hover:text-blue-600 transition">Manage Products</h2>
          <p className="text-gray-500 mt-1">Add, edit, or delete products</p>
        </Link>
        <Link to="/admin/orders"
          className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition group">
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold group-hover:text-blue-600 transition">Manage Orders</h2>
          <p className="text-gray-500 mt-1">View and update order statuses</p>
        </Link>
      </div>
    </div>
  )
}
