// src/features/cart/components/OrderNotesInput.jsx
const MAX_LEN = 200;

export default function OrderNotesInput({ value, onChange }) {
  return (
    <div className="mb-3">
      <label htmlFor="orderNotes" className="form-label fw-semibold">
        <i className="bi bi-pencil-square me-1"></i> Ghi chú đơn hàng
      </label>
      <textarea
        id="orderNotes"
        className="form-control"
        rows="3"
        placeholder="Ví dụ: Ít đá, nhiều đường, không sữa..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_LEN}
        style={{
          resize: 'none',
          borderColor: '#d4a574',
          borderRadius: '8px',
        }}
      />
      <small className="text-muted d-block mt-1">
        {value.length}/{MAX_LEN} ký tự
      </small>
    </div>
  );
}