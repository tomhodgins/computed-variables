const computedVariables = require('../index.js')

// innerWidth and innerHeight
computedVariables(
  '--inner',
  value => window[value],
  window,
  ['load', 'resize']
)

// cursor X and Y coordinates
computedVariables(
  '--cursor',
  (value, event) => event[value] || event.touches[0][value],
  window,
  ['mousemove', 'touchmove']
)