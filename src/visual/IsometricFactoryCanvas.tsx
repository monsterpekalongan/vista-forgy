// Isometric Mini Factory Canvas — visual progress representation
import { useEffect, useRef } from 'react';

interface IsometricFactoryCanvasProps {
  masteredCount: number;
  totalNodes: number;
  width?: number;
  height?: number;
}

export function IsometricFactoryCanvas({
  masteredCount,
  totalNodes,
  width = 300,
  height = 180,
}: IsometricFactoryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Iso tile grid center
    const cx = width / 2;
    const cy = height / 2 + 20;

    const tileW = 32;
    const tileH = 16;
    const gridSize = 5;

    // Draw floor grid
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let y = -gridSize; y <= gridSize; y++) {
        const isoX = cx + (x - y) * (tileW / 2);
        const isoY = cy + (x + y) * (tileH / 2);

        ctx.beginPath();
        ctx.moveTo(isoX, isoY);
        ctx.lineTo(isoX + tileW / 2, isoY + tileH / 2);
        ctx.lineTo(isoX, isoY + tileH);
        ctx.lineTo(isoX - tileW / 2, isoY + tileH / 2);
        ctx.closePath();

        ctx.fillStyle = '#12161F';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.stroke();
      }
    }

    // Number of buildings based on mastered nodes
    const buildingsCount = Math.min(Math.floor((masteredCount / Math.max(totalNodes, 1)) * 12), 12);

    const positions = [
      { x: 0, y: 0, h: 40, color: '#F5A623', type: 'tower' },
      { x: -1, y: 1, h: 25, color: '#37C8F0', type: 'rack' },
      { x: 1, y: -1, h: 30, color: '#3DDC84', type: 'warehouse' },
      { x: -2, y: -1, h: 35, color: '#FF7A1A', type: 'chimney' },
      { x: 2, y: 1, h: 28, color: '#BB86FC', type: 'tower' },
      { x: 1, y: 2, h: 32, color: '#37C8F0', type: 'warehouse' },
      { x: -2, y: 2, h: 45, color: '#F5A623', type: 'tower' },
      { x: 2, y: -2, h: 20, color: '#3DDC84', type: 'rack' },
      { x: 0, y: -2, h: 50, color: '#FF7A1A', type: 'chimney' },
      { x: 0, y: 2, h: 38, color: '#37C8F0', type: 'tower' },
      { x: -1, y: -2, h: 28, color: '#BB86FC', type: 'warehouse' },
      { x: 1, y: -3, h: 42, color: '#F5A623', type: 'tower' },
    ];

    for (let i = 0; i < buildingsCount; i++) {
      const b = positions[i];
      const isoX = cx + (b.x - b.y) * (tileW / 2);
      const isoY = cy + (b.x + b.y) * (tileH / 2);

      drawBuilding(ctx, isoX, isoY, tileW, tileH, b.h, b.color);
    }
  }, [masteredCount, totalNodes, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, display: 'block', margin: '0 auto' }}
    />
  );
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bh: number,
  color: string
) {
  // Top face
  ctx.beginPath();
  ctx.moveTo(x, y - bh);
  ctx.lineTo(x + w / 2, y + h / 2 - bh);
  ctx.lineTo(x, y + h - bh);
  ctx.lineTo(x - w / 2, y + h / 2 - bh);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h / 2 - bh);
  ctx.lineTo(x, y + h - bh);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x - w / 2, y + h / 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h / 2 - bh);
  ctx.lineTo(x, y + h - bh);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();
}
