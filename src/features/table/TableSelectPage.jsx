
import { useEffect, useState, useMemo } from 'react';

import TableAPI from '@/api/tableApi';
import socket from '@/lib/socket';
import { SOCKET_EVENTS } from './constants';

import { generateFloorLayout, mergeTablesWithAPI } from './utils/floorLayout';
import { countTablesByStatus, groupTablesByArea } from './utils/statusHelpers';
import { showErrorAlert } from './utils/tableAlert';

import { useTableHolds } from './hooks/useTableHolds';
import { useTableSelection } from './hooks/useTableSelection';
import { useCountdown } from './hooks/useCountdown';

import TableLoading from './components/TableLoading';
import TableStats from './components/TableStats';
import TableFilter from './components/TableFilter';
import FloorMap from './components/FloorMap';
import ConfirmBar from './components/ConfirmBar';

import '@/assets/css/ChonBan.css';

export default function TableSelectPage() {
  /* ============ STATE ============ */
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [mySocketId, setMySocketId] = useState(null);

  /* ============ TRACK SOCKET ID ============ */
  useEffect(() => {
    const init = () => {
      if (socket.connected && socket.id) {
        setMySocketId(socket.id);
        setTimeout(() => socket.emit(SOCKET_EVENTS.GET_HOLDS), 300);
      }
    };

    const handleConnect = () => {
      setMySocketId(socket.id);
      setTimeout(() => socket.emit(SOCKET_EVENTS.GET_HOLDS), 300);
    };

    init();
    socket.on('connect', handleConnect);
    return () => socket.off('connect', handleConnect);
  }, []);

  /* ============ FETCH TABLES ============ */
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await TableAPI.getAll();
        const tablesData = response.data || response;

        if (!tablesData?.length) throw new Error('API không trả về dữ liệu bàn');

        const layout = generateFloorLayout(tablesData.length);
        const merged = mergeTablesWithAPI(layout, tablesData);
        setTables(merged);
      } catch (error) {
        console.error('❌ Lỗi:', error);
        showErrorAlert();
        setTables([]);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchTables();
  }, []);

  /* ============ HOOKS ============ */
  const { heldTables, reservedTables, myHeldTable, getHoldInfo } =
    useTableHolds(mySocketId);

  const { selectedTable, setSelectedTable, selectTable, confirmTable } =
    useTableSelection({ tables, heldTables, reservedTables, myHeldTable });

  // Đếm ngược cho bàn mình đang giữ
  const myHoldExpiresAt = myHeldTable
    ? heldTables[myHeldTable]?.expiresAt || null
    : null;
  const countdown = useCountdown(myHoldExpiresAt);

  // Sync selectedTable khi socket confirm
  useEffect(() => {
    if (myHeldTable) setSelectedTable(myHeldTable);
  }, [myHeldTable, setSelectedTable]);

  /* ============ COMPUTED ============ */
  const counts = useMemo(() => countTablesByStatus(tables), [tables]);

  const groupedTables = useMemo(
    () => groupTablesByArea(tables, filter),
    [tables, filter],
  );

  /* ============ LOADING ============ */
  if (loading) return <TableLoading />;

  /* ============ RENDER ============ */
  return (
    <div className="ts-wrapper">
      <div className="ts-bg-decor">
        <div className="ts-blob ts-blob-1" />
        <div className="ts-blob ts-blob-2" />
        <div className="ts-blob ts-blob-3" />
      </div>

      <div className="container ts-container">
        <header className="ts-header">
          <span className="ts-eyebrow">
            <span className="ts-eyebrow-line" />
            <i className="bi bi-shop" />
            Đặt bàn tại quán
            <span className="ts-eyebrow-line" />
          </span>
          <h1 className="ts-title">
            Sơ đồ <em>bàn</em>
          </h1>
          <p className="ts-desc">
            Nhấn vào bàn còn trống trên sơ đồ để chọn vị trí ngồi của bạn
          </p>
        </header>

        <TableStats
          total={tables.length}
          available={counts.available}
          occupied={counts.occupied}
          reserved={counts.reserved}
        />

        <TableFilter
          filter={filter}
          onChange={setFilter}
          counts={counts}
          total={tables.length}
        />

        <FloorMap
          groupedTables={groupedTables}
          tables={tables}
          selectedTable={selectedTable}
          myHeldTable={myHeldTable}
          countdown={countdown}
          filter={filter}
          getHoldInfo={getHoldInfo}
          onSelect={selectTable}
        />

        <ConfirmBar
          selectedTable={selectedTable}
          myHeldTable={myHeldTable}
          countdown={countdown}
          onConfirm={confirmTable}
        />
      </div>
    </div>
  );
}