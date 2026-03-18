import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './ui/layout/AppShell'
import { HomePage } from './ui/pages/HomePage'
import { CatalogPage } from './ui/pages/CatalogPage'
import { ProductPage } from './ui/pages/ProductPage'
import { CartPage } from './ui/pages/CartPage'
import { WishlistPage } from './ui/pages/WishlistPage'
import { OrdersPage } from './ui/pages/OrdersPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'shop',
                element: <CatalogPage />,
            },
            {
                path: 'product/:id',
                element: <ProductPage />,
            },
            {
                path: 'cart',
                element: <CartPage />,
            },
            {
                path: 'wishlist',
                element: <WishlistPage />,
            },
            {
                path: 'orders',
                element: <OrdersPage />,
            },
        ],
    },
])

