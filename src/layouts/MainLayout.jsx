// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <>
      <Menu />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}