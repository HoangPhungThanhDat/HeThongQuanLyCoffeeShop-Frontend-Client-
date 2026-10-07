

export default function OrderLoading() {
    return (
      <div className="ot-loading-wrapper">
        <div className="ot-coffee-loader">
          <div className="ot-cup">
            <div className="ot-steam ot-steam1"></div>
            <div className="ot-steam ot-steam2"></div>
            <div className="ot-steam ot-steam3"></div>
          </div>
          <div className="ot-cup-saucer"></div>
        </div>
        <p className="ot-loading-text">Đang tải đơn hàng...</p>
        <p className="ot-loading-subtext">Vui lòng chờ trong giây lát ☕</p>
      </div>
    );
  }