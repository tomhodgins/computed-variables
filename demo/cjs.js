const computedVariables = require('../index.js')

// innerWidth and innerHeight
computedVariables(
  '--inner',
  v => window[v],
  window,
  ['load', 'resize']
)

// cursor X and Y coordinates
computedVariables(
  '--cursor',
  (v, e) => e[v] || e.touches[0][v],
  window,
  ['mousemove', 'touchmove']
)