// Topographic contour path generated via marching squares over a heightmap of Gaussian peaks.
// Produces real iso-contours: closed loops around peaks, flowing lines through slopes.
export const TOPO_CONTOUR_PATH = (() => {
  const peaks = [
    { x: 230,  y: 220, h: 1.4, r: 230 },
    { x: 720,  y: 320, h: 1.5, r: 260 },
    { x: 1230, y: 240, h: 1.2, r: 200 },
    { x: 420,  y: 720, h: 1.3, r: 240 },
    { x: 1050, y: 700, h: 1.4, r: 250 },
  ];
  const heightAt = (x, y) => {
    let h = 0;
    for (const p of peaks) {
      const dx = x - p.x, dy = y - p.y;
      h += p.h * Math.exp(-(dx * dx + dy * dy) / (p.r * p.r));
    }
    return h;
  };

  const W = 1440, H = 900, cell = 14;
  const cols = Math.ceil(W / cell);
  const rows = Math.ceil(H / cell);
  const grid = new Float32Array((cols + 1) * (rows + 1));
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      grid[r * (cols + 1) + c] = heightAt(c * cell, r * cell);
    }
  }

  const levels = [0.06, 0.13, 0.21, 0.30, 0.40, 0.51, 0.63, 0.76, 0.90, 1.05];
  let d = '';
  for (const level of levels) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = c * cell, y0 = r * cell;
        const tl = grid[r * (cols + 1) + c];
        const tr = grid[r * (cols + 1) + c + 1];
        const br = grid[(r + 1) * (cols + 1) + c + 1];
        const bl = grid[(r + 1) * (cols + 1) + c];
        const code = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
        if (code === 0 || code === 15) continue;
        const top    = () => [x0 + cell * (level - tl) / (tr - tl), y0];
        const right  = () => [x0 + cell, y0 + cell * (level - tr) / (br - tr)];
        const bottom = () => [x0 + cell * (level - bl) / (br - bl), y0 + cell];
        const left   = () => [x0, y0 + cell * (level - tl) / (bl - tl)];
        let pairs;
        switch (code) {
          case 1:  pairs = [[left(), bottom()]]; break;
          case 2:  pairs = [[bottom(), right()]]; break;
          case 3:  pairs = [[left(), right()]]; break;
          case 4:  pairs = [[top(), right()]]; break;
          case 5:  pairs = [[top(), right()], [left(), bottom()]]; break;
          case 6:  pairs = [[top(), bottom()]]; break;
          case 7:  pairs = [[top(), left()]]; break;
          case 8:  pairs = [[top(), left()]]; break;
          case 9:  pairs = [[top(), bottom()]]; break;
          case 10: pairs = [[top(), left()], [bottom(), right()]]; break;
          case 11: pairs = [[top(), right()]]; break;
          case 12: pairs = [[left(), right()]]; break;
          case 13: pairs = [[bottom(), right()]]; break;
          case 14: pairs = [[left(), bottom()]]; break;
        }
        for (const [[x1, y1], [x2, y2]] of pairs) {
          d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
        }
      }
    }
  }
  return d;
})();
