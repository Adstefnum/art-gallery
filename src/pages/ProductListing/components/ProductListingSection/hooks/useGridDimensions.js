import { useState, useEffect, useRef } from 'react';

export const useGridDimensions = (COLUMN_WIDTH) => {
  const containerRef = useRef(null);
  const [numColumns, setNumColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const columns = Math.floor(width / COLUMN_WIDTH);
        setNumColumns(Math.max(1, columns));
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [COLUMN_WIDTH]);

  return { containerRef, numColumns };
}; 