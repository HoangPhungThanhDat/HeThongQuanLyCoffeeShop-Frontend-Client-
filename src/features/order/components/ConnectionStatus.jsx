
import { WifiOff } from 'lucide-react';

export default function ConnectionStatus({ isConnected }) {
  if (isConnected) return null;

  return (
    <div className="ot-connection-status">
      <WifiOff size={16} />
      Mất kết nối - Đang kết nối lại...
    </div>
  );
}