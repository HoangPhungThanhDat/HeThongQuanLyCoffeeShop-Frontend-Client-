
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import ProductDetailModal from '@/features/menu/components/ProductDetailModal';

import { getStatusIndex, isPaidStatus } from './utils/statusHelpers';
import { showToast } from './utils/orderToast';
import {
  readOrderFromStorage,
  saveOrderToStorage,
  fetchLatestOrder,
} from './services/orderTrackingService';

import { useOrderSocket } from './hooks/useOrderSocket';
import { useOrderActions } from './hooks/useOrderActions';
import { usePayment } from './hooks/usePayment';

import OrderLoading from './components/OrderLoading';
import OrderEmptyState from './components/OrderEmptyState';
import ConnectionStatus from './components/ConnectionStatus';
import OrderTopBar from './components/OrderTopBar';
import OrderInfoCard from './components/OrderInfoCard';
import PaymentMethods from './components/PaymentMethods';
import PaymentSuccessCard from './components/PaymentSuccessCard';
import StatusTimelineCard from './components/StatusTimelineCard';
import HelpCard from './components/HelpCard';

import '@/assets/css/TrangThaiDonHang.css';

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  /* ============ STATE ============ */
  const [orderDetails, setOrderDetails] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const bumpRefreshKey = useCallback(() => setRefreshKey((k) => k + 1), []);

  /* ============ LOAD ORDER ============ */
  useEffect(() => {
    const loadOrder = async () => {
      const parsed = readOrderFromStorage();

      if (!parsed) {
        setLoading(false);
        showToast(
          'warning',
          'Không tìm thấy đơn hàng',
          'Vui lòng đặt hàng trước',
        );
        setTimeout(() => navigate(ROUTES.HOME), 2000);
        return;
      }

      setOrderDetails(parsed);
      setCurrentStatus(getStatusIndex(parsed.status));

      // Fetch order mới nhất từ server
      const latest = await fetchLatestOrder(parsed.orderNumber);
      if (latest && latest.status && latest.status !== parsed.status) {
        const updated = {
          ...parsed,
          status: latest.status,
          paymentMethod: latest.paymentMethod || parsed.paymentMethod,
          updatedAt: new Date().toISOString(),
        };
        setOrderDetails(updated);
        setCurrentStatus(getStatusIndex(latest.status));
        saveOrderToStorage(updated);
      }

      setLoading(false);
    };

    loadOrder();
  }, [orderId, navigate]);

  /* ============ SOCKET ============ */
  const { isConnected } = useOrderSocket({
    orderDetails,
    setOrderDetails,
    setCurrentStatus,
    setIsCallingStaff: () => {}, // placeholder, sẽ override bên dưới
    bumpRefreshKey,
  });

  /* ============ ACTIONS ============ */
  // Cần isConnected trước → dùng hook sau khi có state
  const { isCallingStaff, cancelOrder, callStaff } = useOrderActions({
    orderDetails,
    isConnected,
  });

  /* ============ PAYMENT ============ */
  const { isProcessingPayment, payWithVNPay, payWithMoMo, payWithCash } =
    usePayment({ orderDetails, onCallStaff: callStaff });

  /* ============ RENDER: LOADING ============ */
  if (loading) return <OrderLoading />;

  /* ============ RENDER: EMPTY ============ */
  if (!orderDetails) {
    return <OrderEmptyState onBack={() => navigate(ROUTES.HOME)} />;
  }

  const isPaid = isPaidStatus(orderDetails.status);
  const isCancelled = orderDetails.status === 'CANCELLED';
  const showPaymentForm = !isCancelled && currentStatus >= 4 && !isPaid;

  /* ============ MAIN RENDER ============ */
  return (
    <div className="ot-wrapper">
      <div className="ot-bg-decor">
        <div className="ot-blob ot-blob-1"></div>
        <div className="ot-blob ot-blob-2"></div>
        <div className="ot-blob ot-blob-3"></div>
      </div>

      <ConnectionStatus isConnected={isConnected} />

      <div className="container position-relative">
        <OrderTopBar
          isConnected={isConnected}
          onBack={() => navigate(ROUTES.HOME)}
        />

        <div className="ot-main-grid">
          {/* ============ LEFT COLUMN ============ */}
          <div className="ot-left-col">
            <OrderInfoCard
              orderDetails={orderDetails}
              currentStatus={currentStatus}
              isPaid={isPaid}
              refreshKey={refreshKey}
              onAddItems={() => setShowAddModal(true)}
              onCancel={cancelOrder}
            />

            {showPaymentForm && (
              <PaymentMethods
                total={orderDetails.total}
                disabled={isProcessingPayment}
                onPayMoMo={payWithMoMo}
                onPayVNPay={payWithVNPay}
                onPayCash={payWithCash}
              />
            )}

            {isPaid && !isCancelled && (
              <PaymentSuccessCard orderDetails={orderDetails} />
            )}
          </div>

          {/* ============ RIGHT COLUMN ============ */}
          <div className="ot-right-col">
            <StatusTimelineCard
              currentStatus={currentStatus}
              orderTime={orderDetails.time}
              estimatedTime={orderDetails.estimatedTime}
            />

            <HelpCard
              isCallingStaff={isCallingStaff}
              isConnected={isConnected}
              onCallStaff={callStaff}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <ProductDetailModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          currentOrder={orderDetails}
          onAddItems={(newItems) => console.log('✅ Đã chọn món:', newItems)}
        />
      )}
    </div>
  );
}