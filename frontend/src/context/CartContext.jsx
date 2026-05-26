import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [] })

  useEffect(() => {
    if (user) api.get('/cart').then(r => setCart(r.data)).catch(() => {})
    else setCart({ items: [] })
  }, [user])

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/items', { productId, quantity })
    setCart(data)
  }

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity })
    setCart(data)
  }

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`)
    setCart(data)
  }

  const refreshCart = async () => {
    if (user) api.get('/cart').then(r => setCart(r.data)).catch(() => {})
    else setCart({ items: [] })
  }

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
