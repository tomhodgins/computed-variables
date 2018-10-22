# computed-variables

Easy to use event-driven CSS variables

## About

Computed Variables is a JavaScript plugin that allows CSS variables to subscribe to events happening in the browser, and have their values updated by simple JavaScript functions on an as-needed basis.

Have you ever wished you could access values from your CSS stylesheets that JavaScript is aware of, but CSS can't quite reach? By using computed variables you can expose things like the window dimensions or scroll positions, properties of elements, any math JavaScript can compute, cursor and pointer events, custom easing functions, and more.

Similar in concept to [jsincss](https://github.com/tomhodgins/jsincss), except jsincss is for rules and stylesheets, and computed variables is for CSS variables.

## Downloading

You can download computed-variables and add it to your codebase manually, or download it with npm:

```bash
npm install computed-variables
```

Another option is linking to the module directly from a CDN like unpkg:

```html
<script type=module>
  import computedVariables from 'https://unpkg.com/computed-variables/index.es.js'
</script>
```

## Importing

You can import the plugin into your own JavaScript modules in a couple of ways.

The first way is using the native [`import` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) in JavaScript. Here you can assign any name you want to the function you are importing, and you only need to provide a path to the plugin's `index.es.js` file:

```js
import computedVariables from './index.es.js'
```

You can also use `require()` to load this plugin instead with a bundler like Webpack or Parcel:

```js
const computedVariables = require('computed-variables')
```

Once you have imported this plugin into your module, you can use the plugin as `computedVariables()`

## Usage

The main goal of the plugin is to create recipes for CSS variables that can be computed and re-computed when certain events happen in the window, or on individual tags. You want to define a name for the variables you will be watching and computing, as well as supply a JavaScript function for calculating the current value CSS should use.

The plugin has the following format:

```js
computedVariables(name, func, selector, events)
```

- `name` is a string starting with `--` that the custom selector(s) should match

- `func` is a JavaScript function that accepts three arguments:
- - `value`: the value originally set to the property in CSS or HTML
- - `event`: the event object from JavaScript when the style recomputed
- - `tag`: the CSS rule or DOM tag containing the custom property

- `selector` is string containing either `'window'` or a CSS selector

- `events` is an array of events to add event listeners for, quoted as strings: (eg. `['load', resize']`)

The default `selector` is `window`, and the default list of `events` is `['load', 'resize', 'input', 'click', 'recompute']`.

You can also create and listen for custom events with JavaScript using `new Event()` and `dispatchEvent()` for total control over when computed-variables recomputes styles.

## Examples

### Exposing browser viewport dimensions to CSS

This example shows and example of exposing properties from the `window` object, on the `load` and `resize` event:

```html
<script type=module>
  import computedVarcViables from 'https://unpkg.com/computed-variables/index.es.js';

  computedVariables(
    '--inner',
    value => window[value],
    window,
    ['load', 'resize']
  )
</script>
```

This means it will go through the DOM and CSSOM looking for CSS rules or DOM nodes with styles that contain a custom CSS variable starting with `--inner`, which would match both `--innerWidth` and `--innerHeight` for example, and it would set their value to the property on the `window` object that matches the string we write in our CSS. This means a rule like this:

```css
:root {
  --innerWidth: "innerWidth";
  --innerHeight: "innerHeight";
}
```

Would result in the `<html>` tag having a `--innerWidth` property getting the value of `window.innerWidth` every time the variable recomputes. And likewise the `--innerHeight` variable gets the value of `window.innerHeight` every time the variable recomputes.

Alternatively, we can also write custom variables in HTML in addition to CSS - suppose we had this in our DOM instead:

```html
<html style='
  --innerWidth: "innerWidth";
  --innerHeight: "innerHeight";
'>
```

This would result in functionally the same thing - the `<html>` element would have custom `--innerWidth` and `--innerHeight` variables that equalled their `window.innerWidth` and `window.innerHeight`.

### Exposing mouse and touch pointer coordinates

```css
:root {
  --cursorX: "clientX";
  --cursorY: "clientY";
}
```

```js
computedVariables(
  '--cursor',
  (value, event) => event[value] || event.touches[0][value],
  window,
  ['mousemove', 'touchstart']
)
```

With this recipe we can watch the mouse or first touch point cursor coordinates, and use them in CSS with `var(--cursorX)` and `var(--cursorY)`. This will update every `mousemove` and `touchmove` event, allowing you to use the mouse cursor position in your CSS styles.

## Exposing element dimensions and offset

```html
<div style='
  --offsetWidth: "offsetWidth";
  --offsetHeight: "offsetHeight";
  --offsetLeft: "offsetLeft";
  --offsetTop: "offsetTop";
'></div>
```

```js
computedVariables(
  '--offset',
  (value, event, tag) => tag[value],
  window,
  ['load', 'resize']
)
```

This recipe uses custom properties on DOM nodes (rather than in CSS stylesheets). By looking for all custom properties on tags that begin with `--offset` and reading the property expressed as the initial value, we can read and use the tag's `offsetWidth`, `offsetHeight`, `offsetLeft`, and `offsetTop` properties, and keep those updated every `load` and `resize` event.

For a demo that uses the last two recipes, check out:

- [Box Shadow (exposing cursor events and element properties)](https://codepen.io/tomhodgins/pen/XxYjqV)

### Exposing window scroll position via `document.scrollingElement`

```css
:root {
  --window-scroll-top: "scrollTop";
  --window-scroll-left: "scrollLeft";
}
```

```js
computedVariables(
  '--window-scroll-',
  value => document.scrollingElement[value],
  window,
  ['load', 'scroll']
)
```

This recipe let's CSS authors create varaibles like `--scroll-top` or `--scroll-left` which can be used to expose `document.scrollingElement.scrollTop` or `document.scrollingElement.scrollLeft` (or other things) to CSS, updated whenever the window loads or scrolls.

### Exposing element scroll position

```html
<textarea style='
  --element-scroll-top: "scrollTop";
'>
```

```js
computedVariables(
  '--element-scroll-',
  (value, event, tag) => tag[value],
  '[style*="--element-scroll-"]',
  ['scroll']
)
```

This recipe looks for any custom properties that start with `--element-scroll-` and will expose the properties of each matching DOM node that has such a property that matches the initial value given. Here we can use it to create a CSS variable on a `<textarea>` element that exposes that tag's `scrollTop` property to CSS, and with computed-variables we're able to only listen to the `scroll` events only on tags whose `style=""` attribute contains `--element-scroll-` inline.

To see the last two example in action, check out this demo:

- [Scrolling demo (exposing `document.scrollingElement` and element scroll positions)](https://codepen.io/tomhodgins/pen/BqPjpe)

### Generating random numbers in CSS

```css
:root {
  --random-1: 1;
  --random-2: 10;
  --random-3: 50;
}
```

```js
computedVariables(
  '--random-',
  value => Math.random() * value,
  window,
  ['load']
)
```

This recipe would look for any CSS variable that started with `--random-` and would return a random number between `0` and the supplied value when the page first loads. For `--random-1` the value supplied is `1`, so the number returned will be between 0-10. For `--random-2` the value supplied is `10`, so the number returned will be between 0-10. And for `--random-3` the value supplied is `50`, so the number returned will be between 0-50.

### Picking from an array of choices

```css
:root {
  --choice-1: ["black", "white"];
  --choice-2: ["red", "green", "blue"];
}
```

```js
computedVariables(
  '--choice-',
  value => value[Math.floor(Math.random() * value.length)],
  window,
  ['load']
)
```

This recipe would take an array expressed in CSS and return a random choice from one of the supplied options, once when the page loads.

You can see an example of the last two recipes in the following demo:

- [Computed Variables Plugin](https://codepen.io/tomhodgins/pen/JmvNoQ)