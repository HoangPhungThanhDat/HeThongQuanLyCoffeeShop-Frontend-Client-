

export default function OrderNoteBox({ note }) {
    if (!note) return null;
  
    return (
      <div className="ot-note-box">
        <div className="ot-note-icon">📝</div>
        <div>
          <div className="ot-note-title">Ghi chú của bạn</div>
          <div className="ot-note-text">{note}</div>
        </div>
      </div>
    );
  }