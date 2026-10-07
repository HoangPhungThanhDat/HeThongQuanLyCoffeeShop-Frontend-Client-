

export default function MenuLoading() {
    return (
      <div className="mm-loading-wrapper">
        <div className="mm-coffee-loader">
          <div className="mm-cup">
            <div className="mm-steam mm-steam1"></div>
            <div className="mm-steam mm-steam2"></div>
            <div className="mm-steam mm-steam3"></div>
          </div>
          <div className="mm-cup-saucer"></div>
        </div>
        <p className="mm-loading-text">Đang pha chế menu cà phê của bạn... ☕</p>
        <p className="mm-loading-subtext">Vui lòng chờ trong giây lát</p>
      </div>
    );
  }