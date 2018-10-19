const computedVariables = require('../index.js')

// set innerWidth
computedVariables(
  '--innerWidth',
  () => window.innerWidth,
  window,
  ['load']
)

// set innerHeight
computedVariables(
  '--innerHeight',
  () => window.innerHeight,
  window,
  ['load']
)

// set cursor X position
computedVariables(
  '--cursorX',
  (v, e) => e.clientX || e.touches[0].clientX,
  window,
  ['mousemove', 'touchmove']
)

// set cursorY position
computedVariables(
  '--cursorY', 
  (v, e) => e.clientY || e.touches[0].clientY,
  window,
  ['mousemove', 'touchmove']
)