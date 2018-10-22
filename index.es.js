export default function(
  name = '',
  func = () => '',
  selector = window,
  events = ['load', 'resize', 'input', 'click', 'recompute']
) {

  // Reads individual CSS rules from a CSS rule list
  const readStylesheet = stylesheet =>
    Array.from(stylesheet.cssRules).map(rule =>

      // If the rule contains its own CSS rule list
      rule.cssRules

      // process this rule as a rule list
      ? readStylesheet(rule)

      // Otherwise red the rule as a CSS rule
      : readRule(rule)
    )

  // For any CSS rule or DOM node
  const readRule = rule => {

    // Check if any declared properties start with the supplied name
    const props = Array.from(rule.style).filter(prop => prop.startsWith(name))

    // If any matching properties are found
    if (props.length) {
      props.forEach(prop =>

        // Set a new property ending with `-value`
        rule.style.setProperty(
          `${prop}-value`,

          // That's equal to the initial value of the matching property
          rule.style.getPropertyValue(prop)
        )
      )
    }
    // If there are matching properties
    return props.length

    // Return the CSS rule or DOM node
    ? rule

    // Otherwise return nothing
    : null
  }

  // Flatten infinitely nested arrays into a single list
  const flattenArray = arr =>
    arr.filter(item => item).reduce(
      (acc, child) => acc.concat(
        Array.isArray(child)
        ? flattenArray(child)
        : child
      ),
      []
    )

  // Try to parse a string as JSON
  const attemptJSON = string => {
    try {
      const values = JSON.parse(string)
      if (values) {
        return values
      }
    } catch (e) {
      return ''
    }
  }

  // Process CSS rule or DOM node
  const processRule = (rules, e) =>
    rules.forEach(rule => 
      Array.from(rule.style)

        // Find custom properties matching our name
        .filter(prop => prop.startsWith(name) && prop.endsWith('-value') === false)
        .forEach(prop => {
          rule.style.setProperty(

            // Set the CSS variable
            prop,

            // To the output of the supplied function
            func(

              // Given the initial value parsed as JSON
              attemptJSON(rule.style.getPropertyValue(`${prop}-value`)),

              // The event object for the event recomputing the variable
              e,

              // and a reference to the original CSS rule or DOM node
              rule
            )
          )
        })
    )

  const registerEvent = (target, event, rules) =>
    target.addEventListener(
      event,
      e => processRule(rules, e)
    )

  // Rules to be processed
  const rules = [

    // Contain all matching CSS rules from CSSOM
    ...flattenArray(
      Array.from(document.styleSheets).map(
        stylesheet => readStylesheet(stylesheet)
      )
    ),

    // Plus all matching HTML elements from DOM
    ...flattenArray(
      Array.from(document.querySelectorAll('*')).map(
        tag => readRule(tag)
      )
    )
  ]

  if (selector === window) {

    return events.forEach(event =>
      registerEvent(window, event, rules)
    )

  } else {

    return document.querySelectorAll(selector).forEach(tag =>
      events.forEach(event =>
        registerEvent(tag, event, rules)
      )
    )

  }

}