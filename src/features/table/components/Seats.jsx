
import { memo, useMemo } from 'react';

const Seats = memo(function Seats({ shape, seats }) {
  const positions = useMemo(() => {
    if (shape === 'round' || shape === 'square') {
      if (seats === 2) return ['top', 'bottom'];
      if (seats === 4) return ['top', 'right', 'bottom', 'left'];
      if (seats >= 6)
        return ['top', 'right', 'bottom', 'left', 'top-left', 'top-right'];
      return ['top', 'right', 'bottom', 'left'];
    }
    if (shape === 'rect') {
      if (seats === 4) return ['top-1', 'top-2', 'bottom-1', 'bottom-2'];
      if (seats === 6)
        return ['top-1', 'top-2', 'bottom-1', 'bottom-2', 'left', 'right'];
      if (seats >= 8)
        return [
          'top-1',
          'top-2',
          'top-3',
          'bottom-1',
          'bottom-2',
          'bottom-3',
          'left',
          'right',
        ];
      return ['top-1', 'top-2', 'bottom-1', 'bottom-2'];
    }
    return [];
  }, [shape, seats]);

  return (
    <div className="table-seats">
      {positions.map((pos, i) => (
        <span key={i} className={`seat seat-${pos}`} />
      ))}
    </div>
  );
});

export default Seats;