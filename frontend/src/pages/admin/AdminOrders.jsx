import { useEffect, useState } from 'react'
import api from '../../api/axios'

const STATUSES = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED']
const statusColors = {
  PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700',
  SHIPPED:'bg-purple-100 text-purple-700', DELIVERED:'bg-green-100 text-green-700',
  CANCELLED:'bg-red-100 text-red-600'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  const load = () => api.get('/orders/admin/all').then(r => setOrders(r.data))
  useEffect(load, [])

  const updateStatus = async (id, status) => {
    await api.put(`/orders/admin/${id}/status`, { status })
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 border-b gap-4">
              <div>
                <span className="font-bold">Order #{order.id}</span>
                <span className="text-gray-500 text-sm ml-3">{order.user?.name} ({order.user?.email})</span>
                <span className="text-gray-400 text-sm ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600">₹{order.totalAmount}</span>
                <select value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${statusColors[order.status]} cursor-pointer`}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-sm mb-2">📍 {order.shippingAddress}</p>
              <div className="space-y-1">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
