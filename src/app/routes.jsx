// src/app/routes.jsx
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import MainLayout from '@/layouts/MainLayout';
import MinimalLayout from '@/layouts/MinimalLayout'; 

// Pages
import HomePage from '@/features/home/HomePage';
import MenuPage from '@/features/menu/MenuPage';
import CartPage from '@/features/cart/CartPage';
import TableSelectPage from '@/features/table/TableSelectPage';
import OrderStatusPage from '@/features/order/OrderStatusPage';
import PaymentResultPage from '@/features/payment/PaymentResultPage';
import MomoResultPage from '@/features/payment/MomoResultPage';
import AboutPage from '@/features/about/AboutPage';
import ContactPage from '@/features/contact/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';
import MenuOrderPage from '@/features/menu/MenuOrderPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />
        <Route path={ROUTES.TABLE_SELECT} element={<TableSelectPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.MENU_ORDER} element={<MenuOrderPage />} />
      </Route>

      <Route element={<MinimalLayout />}>
        <Route path={ROUTES.ORDER_STATUS_DETAIL} element={<OrderStatusPage />} />
        {/* Payment result  */}
        <Route path={ROUTES.PAYMENT_RESULT} element={<PaymentResultPage />} />
        <Route path={ROUTES.MOMO_RESULT} element={<MomoResultPage />} />
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}