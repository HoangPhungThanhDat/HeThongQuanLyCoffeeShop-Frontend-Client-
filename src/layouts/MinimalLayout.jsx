// src/layouts/MinimalLayout.jsx
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function MinimalLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}