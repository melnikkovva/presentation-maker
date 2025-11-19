import React from 'react';
import styles from './ResizeHandle.module.css';

type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

type ResizeHandlesSimpleProps = {
  onMouseDown: (axis: ResizeHandleAxis, event: React.MouseEvent) => void;
}

export function ResizeHandles({ onMouseDown }: ResizeHandlesSimpleProps) {
  const getHandleStyle = (axis: ResizeHandleAxis): React.CSSProperties => {
    switch (axis) {
      case 'nw': return { left: -4, top: -4, cursor: 'nw-resize' };
      case 'n':  return { left: '50%', top: -4, cursor: 'n-resize', transform: 'translateX(-50%)' };
      case 'ne': return { right: -4, top: -4, cursor: 'ne-resize' };
      case 'w':  return { left: -4, top: '50%', cursor: 'w-resize', transform: 'translateY(-50%)' };
      case 'e':  return { right: -4, top: '50%', cursor: 'e-resize', transform: 'translateY(-50%)' };
      case 'sw': return { left: -4, bottom: -4, cursor: 'sw-resize' };
      case 's':  return { left: '50%', bottom: -4, cursor: 's-resize', transform: 'translateX(-50%)' };
      case 'se': return { right: -4, bottom: -4, cursor: 'se-resize' };
      default:   return {};
    }
  };

  const axes: ResizeHandleAxis[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

  return (
    <>
      {axes.map(axis => (
        <div
          key={axis}
          className={styles.resizeHandle}
          style={getHandleStyle(axis)}
          onMouseDown={(e) => {
            onMouseDown(axis, e);
          }}
        />
      ))}
    </>
  );
}