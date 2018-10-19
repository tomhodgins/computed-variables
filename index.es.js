export default function(
  name = '',
  func = ()=>'',
  selector = window,
  events = ['load', 'resize', 'input', 'click']
) {

  const readStylesheet = stylesheet =>
    Array.from(stylesheet.cssRules).map(rule =>
      rule.cssRules
      ? readStylesheet(rule)
      : readRule(rule)
    )

  const readRule = rule => {
    const props = Array.from(rule.style).filter(prop => prop.startsWith(name))
    if (props.length) {
      props.forEach(prop =>
        rule.style.setProperty(
          `${prop}-value`,
          rule.style.getPropertyValue(prop)
        )
      )
    }
    return props.length
    ? rule
    : null
  }

  const flattenArray = arr =>
    arr.filter(item => item).reduce(
      (acc, child) => acc.concat(
        Array.isArray(child)
        ? flattenArray(child)
        : child
      ),
      []
    )

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

  const processRule = (rules, e) => 
    rules.forEach(rule => 
      Array.from(rule.style)
        .filter(prop => prop.startsWith(name) && prop.endsWith('-value') === false)
        .map(prop => {
          rule.style.setProperty(
            prop,
            func(
              attemptJSON(rule.style.getPropertyValue(`${prop}-value`)),
              e
            )
          )
        })
    )

  const registerEvent = (target, event, rules) =>
    target.addEventListener(
      event,
      e => processRule(rules, e)
    )

  const rules = flattenArray(
    Array.from(document.styleSheets).map(
      stylesheet => readStylesheet(stylesheet)
    )
  )

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