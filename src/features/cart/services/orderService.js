// src/features/cart/services/orderService.js
import OrderAPI from '@/api/orderApi';
import OrderItemAPI from '@/api/orderItemApi';
import TableAPI from '@/api/tableApi';
import ProductAPI from '@/api/productApi';
import BillAPI from '@/api/billApi';
import socket from '@/lib/socket';

/**
 * Tạo datetime theo format Việt Nam (yyyy-MM-ddTHH:mm:ss)
 */
const getVietnamDateTime = () => {
  const d = new Date();
  return (
    `${d.getFullYear()}-` +
    `${String(d.getMonth() + 1).padStart(2, '0')}-` +
    `${String(d.getDate()).padStart(2, '0')}T` +
    `${String(d.getHours()).padStart(2, '0')}:` +
    `${String(d.getMinutes()).padStart(2, '0')}:` +
    `${String(d.getSeconds()).padStart(2, '0')}`
  );
};

/**
 * 1. Tạo đơn hàng
 */
const createOrder = async ({ tableId, totalAmount, notes }) => {
  const response = await OrderAPI.create({
    table: { id: tableId },
    totalAmount,
    status: 'PENDING',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return response.data || response;
};

/**
 * 2. Tạo chi tiết đơn hàng (order items)
 */
const createOrderItems = async ({ orderId, cart }) => {
  const items = cart.map((item) => ({
    order: { id: orderId },
    product: { id: item.id },
    quantity: item.qty,
    price: item.price,
    subtotal: item.price * item.qty,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  for (const item of items) {
    await OrderItemAPI.create(item);
  }
  return items;
};

/**
 * 3. Tạo hóa đơn
 */
const createBill = async ({ orderId, totalAmount, notes, tableNumber }) => {
  const response = await BillAPI.create({
    order: { id: orderId },
    totalAmount,
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    notes: notes
      ? `Ghi chú: ${notes}. Bàn số ${tableNumber}`
      : `Khách đặt hàng tại bàn số ${tableNumber}`,
    issuedAt: getVietnamDateTime(),
  });
  return response.data || response;
};

/**
 * 4. Cập nhật trạng thái bàn → RESERVED
 */
const reserveTable = async (tableId) => {
  await TableAPI.updateStatus(tableId, 'RESERVED');
};

/**
 * 5. Giảm tồn kho (không throw nếu lỗi)
 */
const reduceStock = async (cart) => {
  const results = [];
  for (const item of cart) {
    try {
      await ProductAPI.updateStock(item.id, item.qty);
      results.push({ id: item.id, ok: true });
    } catch (err) {
      console.warn(`⚠️ Không giảm được kho ${item.name}:`, err);
      results.push({ id: item.id, ok: false, error: err });
    }
  }
  return results;
};

/**
 * 6. Gửi socket thông báo cho staff
 */
const notifyStaff = ({ tableNumber, totalPrice, notes, cart }) => {
  socket.emit('order-submitted', {
    tableNumber,
    orderTime: new Date().toLocaleString(),
    totalPrice,
    status: 'PENDING',
    notes: notes || '',
    items: cart.map((item) => ({
      productName: item.name,
      quantity: item.qty,
      price: item.price,
    })),
  });
};

/**
 * 7. Tạo dữ liệu tracking lưu localStorage
 */
const buildOrderTrackingData = ({
  orderId,
  tableNumber,
  cart,
  total,
  notes,
}) => {
  const now = new Date();
  return {
    orderNumber: orderId,
    tableNumber,
    date: now.toLocaleDateString('vi-VN'),
    time: now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    items: cart.map((item) => ({
      name: item.name,
      quantity: item.qty,
      price: item.price,
      image: item.image || '☕',
    })),
    total,
    note: notes || '',
    status: 'PENDING',
    estimatedTime: '15-20 phút',
    createdAt: getVietnamDateTime(),
    paymentMethod: 'CASH',
  };
};

/**
 * 🎯 HÀM CHÍNH: Tạo order + bill + tracking (pipeline)
 */
export const createOrderAndBill = async ({
  selectedTable,
  cart,
  total,
  notes,
}) => {
  console.log('🔄 [1/5] Tạo đơn hàng...');
  const createdOrder = await createOrder({
    tableId: selectedTable.id,
    totalAmount: total,
    notes,
  });
  console.log('✅ [1/5] Đơn hàng ID:', createdOrder.id);

  console.log('🔄 [2/5] Tạo chi tiết đơn hàng...');
  await createOrderItems({ orderId: createdOrder.id, cart });
  console.log('✅ [2/5] Chi tiết đơn hàng OK');

  console.log('🔄 [3/5] Tạo hóa đơn...');
  const bill = await createBill({
    orderId: createdOrder.id,
    totalAmount: total,
    notes,
    tableNumber: selectedTable.tableNumber,
  });
  console.log('✅ [3/5] Hóa đơn ID:', bill.id);

  console.log('🔄 [4/5] Cập nhật bàn → RESERVED');
  await reserveTable(selectedTable.id);
  console.log('✅ [4/5] Bàn đã RESERVED');

  console.log('🔄 [5/5] Giảm tồn kho...');
  await reduceStock(cart);

  notifyStaff({
    tableNumber: selectedTable.tableNumber,
    totalPrice: total,
    notes,
    cart,
  });

  const orderTrackingData = buildOrderTrackingData({
    orderId: createdOrder.id,
    tableNumber: selectedTable.tableNumber,
    cart,
    total,
    notes,
  });

  localStorage.setItem('currentOrder', JSON.stringify(orderTrackingData));

  return { createdOrder, orderTrackingData };
};