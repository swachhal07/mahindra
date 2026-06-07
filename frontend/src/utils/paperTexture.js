// Paper-grain texture: cream tones baked directly into the noise so no blend mode is needed.
// Single feTurbulence with 4 octaves captures both fine fibers and coarse specks in one pass.
export const PAPER_TEXTURE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0.22 0.78  0 0 0 0.22 0.76  0 0 0 0.22 0.72  0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

export const PAPER_BG_STYLE = {
  backgroundColor: '#FAF7F2',
  backgroundImage: PAPER_TEXTURE,
  backgroundSize: '600px 600px',
  backgroundRepeat: 'repeat',
};
