;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-account" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M793.6 316.991454C793.6 153.703982 661.792629 21.333333 499.2 21.333333 336.607371 21.333333 204.8 153.703982 204.8 316.991454 204.8 480.278923 336.607371 612.649572 499.2 612.649572 661.792629 612.649572 793.6 480.278923 793.6 316.991454ZM256 316.991454C256 182.101803 364.88435 72.752137 499.2 72.752137 633.51565 72.752137 742.4 182.101803 742.4 316.991454 742.4 451.881103 633.51565 561.230769 499.2 561.230769 364.88435 561.230769 256 451.881103 256 316.991454Z"  ></path>' +
    '' +
    '<path d="M0 998.290598 0 1024 25.6 1024 486.4 1024 998.4 1024 1024 1024 1024 998.290598C1024 767.462671 787.090923 561.230769 512 561.230769 495.448045 561.230769 478.989086 561.900892 462.660538 563.232578 448.568439 564.381869 485.255599 576.786276 486.4 590.938596 501.350035 589.719337 496.831226 612.649572 512 612.649572 760.310844 612.649572 972.8 797.623669 972.8 998.290598L998.4 972.581197 486.4 972.581197 25.6 972.581197 51.2 998.290598C51.2 861.757427 137.013906 736.945338 275.263548 667.439085 287.906261 661.082846 293.024384 645.637353 286.695191 632.94061 280.366001 620.243866 264.986234 615.103872 252.34352 621.460111 97.581613 699.268053 0 841.195691 0 998.290598Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-Password" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M784.554536 939.218058 239.444441 939.218058c-60.888765 0-110.249987-49.359174-110.249987-110.249987L129.194454 558.094828c0-60.888765 49.361221-110.249987 110.249987-110.249987l0-91.53167c0-152.221914 120.332622-268.461311 272.554536-268.461311S784.554536 204.091258 784.554536 356.313172l0 91.53167c60.888765 0 110.249987 49.361221 110.249987 110.249987l0 270.874267C894.804523 889.859907 845.443301 939.218058 784.554536 939.218058zM737.251184 356.313172c0-121.776508-103.471606-221.157959-225.251184-221.157959s-225.251184 99.381451-225.251184 221.157959l0 91.53167 450.501344 0L737.25016 356.313172zM847.500147 558.094828c0-30.442336-32.500205-62.945611-62.945611-62.945611L239.444441 495.149217c-30.445406 0-62.945611 32.503275-62.945611 62.945611l0 270.874267c0 30.445406 32.500205 66.015529 62.945611 66.015529l545.110095 0c30.445406 0 62.945611-35.570123 62.945611-66.015529L847.500147 558.094828zM525.780865 831.328839l-27.562752 0c-7.610328 0-13.780865-6.17156-13.780865-13.780865L484.437248 589.936023c0-7.612375 6.17156-13.780865 13.780865-13.780865l27.562752 0c7.610328 0 13.780865 6.16849 13.780865 13.780865l0 227.610928C539.562752 825.157279 533.391193 831.328839 525.780865 831.328839z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)