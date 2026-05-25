import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          🛒 ShopZone
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/products" className="hover:text-blue-200 transition">Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="relative hover:text-blue-200">
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:text-blue-200">Orders</Link>
              {isAdmin && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
              <button onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
