
import { ArrowLeft, Bell, Coffee, Wifi, WifiOff } from 'lucide-react';

export default function OrderTopBar({ isConnected, onBack }) {
  return (
    <div className="ot-top-bar">
      <div className="ot-brand">
        <button className="ot-back-btn" onClick={onBack} title="Về trang chủ">
          <ArrowLeft size={18} />
          <span>Trang chủ</span>
        </button>
        <div className="ot-brand-divider"></div>
        <div className="ot-brand-icon">
          <Coffee size={22} />
        </div>
        <div className="ot-brand-text">
          <h1>Coffee Shop</h1>
          <span>Theo dõi đơn hàng</span>
        </div>
      </div>

      <div className="ot-top-actions">
        <div
          className={`ot-connection-badge ${isConnected ? 'online' : 'offline'}`}
        >
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isConnected ? 'Online' : 'Offline'}</span>
        </div>
        <button className="ot-icon-btn" title="Thông báo">
          <Bell size={20} />
        </button>
      </div>
    </div>
  );
}