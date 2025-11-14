export const colors = {
  brand: '#df2b2b',
  ink: '#0b0b0f',
  inkWeak: '#6b7280',
  dark: '#0e1116',
  rule: '#e5e7eb',
  light: '#eef2f7',
};

export const metrics = {
  navH: 56,
  maxW: 1200,
  bpMd: 900,
  bpSm: 540,
};

export const clamp = (min:number, val:number, max:number)=> Math.max(min, Math.min(val, max));

export const typeScale = {
  h1: (w:number)=> clamp(38, w*0.05, 54),
  h2: (w:number)=> clamp(30, w*0.036, 36),
  h3: (w:number)=> clamp(20, w*0.024, 26),
  lead: (w:number)=> clamp(18, w*0.021, 22),
  dTitle: (w:number)=> clamp(18, w*0.022, 20),
  metricNum: (w:number)=> clamp(100, w*0.12, 180),
  metricUnit: (w:number)=> clamp(22, w*0.03, 40),
};
