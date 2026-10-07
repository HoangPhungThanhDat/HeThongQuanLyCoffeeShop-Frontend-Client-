import { useState, useEffect } from 'react';

import productApi from '@/api/productApi';
import categoryApi from '@/api/categoryApi';

import { useReservation } from './hooks/useReservation';
import { useAddToCart } from './hooks/useAddToCart';
import { useAddingStatus } from './hooks/useMenuSocket';

import ReservationBar from './components/ReservationBar';
import MenuHeader from './components/MenuHeader';
import MenuSearchBar from './components/MenuSearchBar';
import MenuInfoBar from './components/MenuInfoBar';
import MenuProductGrid from './components/MenuProductGrid';
import MenuCartCTA from './components/MenuCartCTA';
import MenuLoading from './components/MenuLoading';

import '@/assets/css/MenuOrderPage.css';
import '@/assets/css/loader.css';

/* Helper: đảm bảo luôn trả về array dù backend trả List hay PageResponse */
const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content; // Spring Page
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

export default function MenuOrderPage() {
  /* ============ STATE ============ */
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /* ============ HOOKS ============ */
  const { selectedTable, countdown, isUrgent, cancelReservation } =
    useReservation();
  const addingStatus = useAddingStatus();
  const { addToCart } = useAddToCart();

  /* ============ FETCH CATEGORIES ============ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(ensureArray(res.data));
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  /* ============ FETCH PRODUCTS ============ */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const start = Date.now();

      try {
        // ⭐ Khi chọn category → gọi getByCategory (trả về List)
        // ⭐ Khi "Tất cả" → gọi getMenuProducts (endpoint mới, trả về List toàn bộ)
        const res = selectedCategory
          ? await productApi.getByCategory(selectedCategory)
          : await productApi.getMenuProducts();

        setProducts(ensureArray(res.data));
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
        setProducts([]);
      } finally {
        const remaining = Math.max(800 - (Date.now() - start), 0);
        setTimeout(() => setLoading(false), remaining);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  /* ============ FILTER ============ */
  const filteredProducts = Array.isArray(products)
    ? products.filter((p) =>
        p?.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()),
      )
    : [];

  const currentCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  /* ============ LOADING ============ */
  if (loading) return <MenuLoading />;

  /* ============ RENDER ============ */
  return (
    <section className="mop-wrapper">
      <ReservationBar
        selectedTable={selectedTable}
        countdown={countdown}
        isUrgent={isUrgent}
        onCancel={cancelReservation}
      />

      {/* BG DECOR */}
      <div className="mop-bg-decor">
        <div className="mop-blob mop-blob-1" />
        <div className="mop-blob mop-blob-2" />
        <div className="mop-blob mop-blob-3" />
      </div>

      <div className="container mop-container">
        <MenuHeader />

        <MenuSearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* TABS */}
        <div className="mop-tabs-wrapper">
          <div className="mop-tabs">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`mop-tab ${selectedCategory === null ? 'mop-tab-active' : ''}`}
            >
              <span className="mop-tab-icon">
                <i className="bi bi-grid-fill" />
              </span>
              <span className="mop-tab-label">Tất cả</span>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`mop-tab ${
                  selectedCategory === category.id ? 'mop-tab-active' : ''
                }`}
              >
                <span className="mop-tab-icon">
                  <i className="bi bi-cup-hot-fill" />
                </span>
                <span className="mop-tab-label">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <MenuInfoBar
          categoryName={currentCategoryName}
          count={filteredProducts.length}
        />

        <MenuProductGrid
          products={filteredProducts}
          addingStatus={addingStatus}
          searchTerm={searchTerm}
          onAddToCart={addToCart}
        />

        <MenuCartCTA />
      </div>
    </section>
  );
}