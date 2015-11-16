var dev = true;

var s = document.createElement('script')
if (dev) {
  s.src = 'http://localhost:8000/node_modules/d3/d3.js'
} else {
  s.src = '//d3js.org/d3.v3.min.js'
}
document.body.appendChild(s);

(function(w) {
  var d3fxDuration = 1000
  var filterProperty = determineFilterPrefix()

  function determineFilterPrefix() {
    var options = ['filter', '-webkit-filter']
    var styles = w.getComputedStyle(document.body).cssText
    var propertyToUse = null;
    options.forEach(function(option) {
      if (styles.indexOf(option + ':') !== -1) {
        propertyToUse = option
      }
    })
    return propertyToUse
  }

  function randomInRange(range) {
    return Math.random() * (range[1] - range[0]) + range[0]
  }

  function transition(selector, duration) {
    if (arguments.length < 1) {
      selector = '*'
    }
    if (arguments.length < 2) {
      d3fxDuration = 1000
    }
    d3.selectAll(selector).style('transition', 'all ' + d3fxDuration + 'ms ease-in-out')
  }

  function transform(ranges) {
    var defaultRanges = {
      rotate: [0, 0],
      translate: [0, 0],
      skew: [0, 0],
      scale: [0, 0]
    }

    Object.keys(ranges).forEach(function(rangeKey) {
      defaultRanges[rangeKey] = ranges[rangeKey]
    })
    ranges = defaultRanges

    return function doIt() {
      var currentTransform = d3.transform(d3.select(this).style('transform'))
      var newTransform = {}
      Object.keys(ranges).forEach(function(rangeKey) {
        var range = ranges[rangeKey]
        if (rangeKey === 'rotate') {
          newTransform[rangeKey] =
            currentTransform[rangeKey] + randomInRange(range)
        } else if (rangeKey === 'skew') {
          newTransform[rangeKey] = randomInRange(range)
        } else {
          newTransform[rangeKey] = [randomInRange(range), randomInRange(range)]
        }
      })
      var transformString = 'translate(' + newTransform.translate[0] + 'px,' +
         newTransform.translate[1] + 'px)' +
        'rotate(' + newTransform.rotate + 'deg)' +
        'skewX(' + newTransform.skew + 'deg)' +
        'scale(' + newTransform.scale[0] + ',' + newTransform.scale[1] + ')'
      console.log(transformString)
      d3.select(this).style('transform', transformString)
      setTimeout(doIt.bind(this), d3fxDuration)
    }
  }

  function filter(ranges) {
    var defaultRanges = {
      blur: [0, 0],
      brightness: [1, 1],
      contrast: [1, 1],
      grayscale: [0, 0],
      invert: [0, 0],
      saturate: [1, 1],
      sepia: [0, 0]
    }
    Object.keys(ranges).forEach(function(rangeKey) {
      defaultRanges[rangeKey] = ranges[rangeKey]
    })
    ranges = defaultRanges


    var units = {
      blur: 'px',
      hueRotate: 'deg',
    }

    return function doIt() {
      var newFilters = {}
      var f = Object.keys(ranges).reduce(function(filterString, rangeKey) {
        var range = ranges[rangeKey]
        var newValue = randomInRange(range)
        newFilters[rangeKey] = newValue
        var unit = units[rangeKey] || ''
        var propertyName = rangeKey
        if (propertyName === 'hueRotate') {
          propertyName = 'hue-rotate'
        }
        filterString += propertyName + '(' + newValue + unit + ')'
        return filterString
      },'')
      console.log(f)
      d3.select(this).style(filterProperty, f)
      setTimeout(doIt.bind(this), d3fxDuration)
    }

  }

  var transformBehaviors = {
    default: {
      rotate: [-Math.PI, Math.PI],
      translate: [-100, 100],
      skew: [-10, 10],
      scale: [0.5, 2]
    },
    grow: {
      scale: [0.5, 2]
    },
    tilt: {
      skew: [-10, 10],
    },
    jitter: {
      translate: [-100, 100],
    },
    rotate: {
      rotate: [-Math.PI, Math.PI]
    }
  }

  var filterBehaviors = {
    default: {
      blur: [0, 5],
      brightness: [0, 1],
      contrast: [0, 2],
      grayscale: [0, 1],
      invert: [0, 1],
      saturate: [0, 2],
      sepia: [0, 1],
      hueRotate: [0, 360]
    },
    blur: {
      blur: [0, 5]
    },
    brightness: {
      brightness: [0, 2]
    },
    contrast: {
      contrast: [0, 2]
    },
    grayscale: {
      grayscale: [0, 1]
    },
    invert: {
      invert: [0, 1]
    },
    saturate: {
      saturate: [0, 2],
    },
    sepia: {
      sepia: [0, 1]
    },
    hueRotate: {
      hueRotate: [0, 360]
    }



  }
  w.d3fx = {
    transition: transition,
    transform: transform,
    TRANSFORMS: transformBehaviors,
    filter: filter,
    FILTERS: filterBehaviors
  }
})(window)