// src/features/home/HomePage.jsx
import HeroSection from './components/HeroSection';
import LatestProducts from './components/LatestProducts';
import MenuSection from '@/features/menu/MenuPage';
import AboutPage from '@/features/about/AboutPage';
import ReviewSection from '@/features/review/ReviewSection';
import ContactPage from '@/features/contact/ContactPage';   

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestProducts />
      <MenuSection />
      <AboutPage />
      <ReviewSection />
      <ContactPage />        {/* 👈 section liên hệ */}
    </>
  );
}