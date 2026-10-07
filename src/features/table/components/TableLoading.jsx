

export default function TableLoading() {
    return (
      <div className="ts-loading-wrapper">
        <div className="ts-coffee-loader">
          <div className="ts-cup">
            <div className="ts-steam ts-steam1"></div>
            <div className="ts-steam ts-steam2"></div>
            <div className="ts-steam ts-steam3"></div>
          </div>
          <div className="ts-cup-saucer"></div>
        </div>
        <p className="ts-loading-text">Đang tải sơ đồ bàn...</p>
        <p className="ts-loading-subtext">Vui lòng chờ trong giây lát ☕</p>
      </div>
    );
  }