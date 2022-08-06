!(function (n, o, r, a) {
  "use strict";
  function e(t, e) {
    function i() {
      (s.options.originalVideoW = s.options.$video[0].videoWidth),
        (s.options.originalVideoH = s.options.$video[0].videoHeight),
        s.initialised || s.init();
    }
    var s = this;
    (this.element = t),
      (this.options = n.extend({}, c, e)),
      (this._defaults = c),
      (this._name = l),
      (this.options.$video = n(t)),
      this.detectBrowser(),
      this.shimRequestAnimationFrame(),
      (this.options.has3d = this.detect3d()),
      this.options.$videoWrap.css({
        position: "relative",
        overflow: "hidden",
        "z-index": "10",
      }),
      this.options.$video.css({ position: "absolute", "z-index": "1" }),
      this.options.$video.on("canplay canplaythrough", i),
      3 < this.options.$video[0].readyState && i();
  }
  var l = "backgroundVideo",
    c = {
      $videoWrap: n(".video-wrapper-inner"),
      $outerWrap: n(o),
      $window: n(o),
      minimumVideoWidth: 400,
      preventContextMenu: !1,
      parallax: !0,
      parallaxOptions: { effect: 1.5 },
      pauseVideoOnViewLoss: !1,
    };
  (e.prototype = {
    init: function () {
      var t = this;
      (this.initialised = !0),
        (this.lastPosition = -1),
        (this.ticking = !1),
        this.options.$window.resize(function () {
          t.positionObject();
        }),
        this.options.parallax &&
          this.options.$window.on("scroll", function () {
            t.update();
          }),
        this.options.pauseVideoOnViewLoss && this.playPauseVideo(),
        this.options.preventContextMenu &&
          this.options.$video.on("contextmenu", function () {
            return !1;
          }),
        this.options.$window.trigger("resize");
    },
    requestTick: function () {
      this.ticking ||
        (o.requestAnimationFrame(this.positionObject.bind(this)),
        (this.ticking = !0));
    },
    update: function () {
      (this.lastPosition = o.pageYOffset), this.requestTick();
    },
    detect3d: function () {
      var t,
        e,
        i = r.createElement("p"),
        s = {
          WebkitTransform: "-webkit-transform",
          OTransform: "-o-transform",
          MSTransform: "-ms-transform",
          MozTransform: "-moz-transform",
          transform: "transform",
        };
      for (t in (r.body.insertBefore(i, r.body.lastChild), s))
        i.style[t] !== a &&
          ((i.style[t] =
            "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)"),
          (e = o.getComputedStyle(i).getPropertyValue(s[t])));
      return i.parentNode.removeChild(i), e !== a && "none" !== e;
    },
    detectBrowser: function () {
      var t = navigator.userAgent.toLowerCase();
      -1 < t.indexOf("chrome") || -1 < t.indexOf("safari")
        ? ((this.options.browser = "webkit"),
          (this.options.browserPrexix = "-webkit-"))
        : -1 < t.indexOf("firefox")
        ? ((this.options.browser = "firefox"),
          (this.options.browserPrexix = "-moz-"))
        : -1 !== t.indexOf("MSIE") || 0 < t.indexOf("Trident/")
        ? ((this.options.browser = "ie"), (this.options.browserPrexix = "-ms-"))
        : -1 < t.indexOf("Opera") &&
          ((this.options.browser = "opera"),
          (this.options.browserPrexix = "-o-"));
    },
    scaleObject: function () {
      var t, e;
      return (
        this.options.$videoWrap.width(this.options.$outerWrap.width()),
        this.options.$videoWrap.height(this.options.$outerWrap.height()),
        (t = this.options.$window.width() / this.options.originalVideoW),
        (e =
          (e = this.options.$window.height() / this.options.originalVideoH) < t
            ? t
            : e) *
          this.options.originalVideoW <
          this.options.minimumVideoWidth &&
          (e = this.options.minimumVideoWidth / this.options.originalVideoW),
        this.options.$video.width(e * this.options.originalVideoW),
        this.options.$video.height(e * this.options.originalVideoH),
        {
          xPos:
            -parseInt(
              this.options.$video.width() - this.options.$window.width()
            ) / 2,
          yPos:
            parseInt(
              this.options.$video.height() - this.options.$window.height()
            ) / 2,
        }
      );
    },
    positionObject: function () {
      var t = this,
        e = o.pageYOffset,
        i = this.scaleObject(this.options.$video, t.options.$videoWrap),
        s = i.xPos,
        i = i.yPos,
        i = this.options.parallax
          ? 0 <= e
            ? this.calculateYPos(i, e)
            : this.calculateYPos(i, 0)
          : -i;
      t.options.has3d
        ? (this.options.$video.css(
            t.options.browserPrexix + "transform3d",
            "translate3d(-" + s + "px, " + i + "px, 0)"
          ),
          this.options.$video.css(
            "transform",
            "translate3d(" + s + "px, " + i + "px, 0)"
          ))
        : (this.options.$video.css(
            t.options.browserPrexix + "transform",
            "translate(-" + s + "px, " + i + "px)"
          ),
          this.options.$video.css(
            "transform",
            "translate(" + s + "px, " + i + "px)"
          )),
        (this.ticking = !1);
    },
    calculateYPos: function (t, e) {
      return -(
        (parseInt(this.options.$videoWrap.offset().top) - e) /
          this.options.parallaxOptions.effect +
        t
      );
    },
    disableParallax: function () {
      this.options.$window.unbind(".backgroundVideoParallax");
    },
    playPauseVideo: function () {
      var t = this;
      this.options.$window.on("scroll.backgroundVideoPlayPause", function () {
        t.options.$window.scrollTop() < t.options.$videoWrap.height()
          ? t.options.$video.get(0).play()
          : t.options.$video.get(0).pause();
      });
    },
    shimRequestAnimationFrame: function () {
      for (
        var n = 0, t = ["ms", "moz", "webkit", "o"], e = 0;
        e < t.length && !o.requestAnimationFrame;
        ++e
      )
        (o.requestAnimationFrame = o[t[e] + "RequestAnimationFrame"]),
          (o.cancelAnimationFrame =
            o[t[e] + "CancelAnimationFrame"] ||
            o[t[e] + "CancelRequestAnimationFrame"]);
      o.requestAnimationFrame ||
        (o.requestAnimationFrame = function (t) {
          var e = new Date().getTime(),
            i = Math.max(0, 16 - (e - n)),
            s = o.setTimeout(function () {
              t(e + i);
            }, i);
          return (n = e + i), s;
        }),
        o.cancelAnimationFrame ||
          (o.cancelAnimationFrame = function (t) {
            clearTimeout(t);
          });
    },
  }),
    (n.fn[l] = function (t) {
      return this.each(function () {
        n.data(this, "plugin_" + l) ||
          n.data(this, "plugin_" + l, new e(this, t));
      });
    });
})(jQuery, window, document),
  (function (t, e) {
    "object" == typeof exports && "object" == typeof module
      ? (module.exports = e())
      : "function" == typeof define && define.amd
      ? define([], e)
      : "object" == typeof exports
      ? (exports.ClipboardJS = e())
      : (t.ClipboardJS = e());
  })(this, function () {
    return (
      (i = {
        686: function (t, e, i) {
          "use strict";
          i.d(e, {
            default: function () {
              return s;
            },
          });
          var e = i(279),
            a = i.n(e),
            e = i(370),
            l = i.n(e),
            e = i(817),
            r = i.n(e);
          function c(t) {
            try {
              return document.execCommand(t);
            } catch (t) {
              return;
            }
          }
          function u(t) {
            return (t = r()(t)), c("cut"), t;
          }
          function h(t) {
            var e,
              i,
              s,
              n =
                1 < arguments.length && void 0 !== arguments[1]
                  ? arguments[1]
                  : { container: document.body },
              o = "";
            return (
              "string" == typeof t
                ? ((e = t),
                  (i = "rtl" === document.documentElement.getAttribute("dir")),
                  ((s = document.createElement("textarea")).style.fontSize =
                    "12pt"),
                  (s.style.border = "0"),
                  (s.style.padding = "0"),
                  (s.style.margin = "0"),
                  (s.style.position = "absolute"),
                  (s.style[i ? "right" : "left"] = "-9999px"),
                  (i =
                    window.pageYOffset || document.documentElement.scrollTop),
                  (s.style.top = "".concat(i, "px")),
                  s.setAttribute("readonly", ""),
                  (s.value = e),
                  n.container.appendChild(s),
                  (o = r()(s)),
                  c("copy"),
                  s.remove())
                : ((o = r()(t)), c("copy")),
              o
            );
          }
          function d(t) {
            return (d =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      "function" == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? "symbol"
                      : typeof t;
                  })(t);
          }
          function p(t) {
            return (p =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      "function" == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? "symbol"
                      : typeof t;
                  })(t);
          }
          function m(t, e) {
            for (var i = 0; i < e.length; i++) {
              var s = e[i];
              (s.enumerable = s.enumerable || !1),
                (s.configurable = !0),
                "value" in s && (s.writable = !0),
                Object.defineProperty(t, s.key, s);
            }
          }
          function g(t, e) {
            return (g =
              Object.setPrototypeOf ||
              function (t, e) {
                return (t.__proto__ = e), t;
              })(t, e);
          }
          function f(t) {
            return (f = Object.setPrototypeOf
              ? Object.getPrototypeOf
              : function (t) {
                  return t.__proto__ || Object.getPrototypeOf(t);
                })(t);
          }
          function y(t, e) {
            if (((t = "data-clipboard-".concat(t)), e.hasAttribute(t)))
              return e.getAttribute(t);
          }
          var s = (function () {
            !(function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function"
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: { value: t, writable: !0, configurable: !0 },
              })),
                e && g(t, e);
            })(r, a());
            var t,
              e,
              i,
              s,
              n,
              o =
                ((s = r),
                (n = (function () {
                  if ("undefined" == typeof Reflect || !Reflect.construct)
                    return !1;
                  if (Reflect.construct.sham) return !1;
                  if ("function" == typeof Proxy) return !0;
                  try {
                    return (
                      Date.prototype.toString.call(
                        Reflect.construct(Date, [], function () {})
                      ),
                      !0
                    );
                  } catch (t) {
                    return !1;
                  }
                })()),
                function () {
                  var t = f(s),
                    e = n
                      ? ((e = f(this).constructor),
                        Reflect.construct(t, arguments, e))
                      : t.apply(this, arguments),
                    t = this;
                  return !e || ("object" !== p(e) && "function" != typeof e)
                    ? (function () {
                        if (void 0 !== t) return t;
                        throw new ReferenceError(
                          "this hasn't been initialised - super() hasn't been called"
                        );
                      })()
                    : e;
                });
            function r(t, e) {
              var i;
              return (
                (function (t) {
                  if (!(t instanceof r))
                    throw new TypeError("Cannot call a class as a function");
                })(this),
                (i = o.call(this)).resolveOptions(e),
                i.listenClick(t),
                i
              );
            }
            return (
              (i = [
                {
                  key: "copy",
                  value: function (t) {
                    var e =
                      1 < arguments.length && void 0 !== arguments[1]
                        ? arguments[1]
                        : { container: document.body };
                    return h(t, e);
                  },
                },
                { key: "cut", value: u },
                {
                  key: "isSupported",
                  value: function () {
                    var t =
                        "string" ==
                        typeof (t =
                          0 < arguments.length && void 0 !== arguments[0]
                            ? arguments[0]
                            : ["copy", "cut"])
                          ? [t]
                          : t,
                      e = !!document.queryCommandSupported;
                    return (
                      t.forEach(function (t) {
                        e = e && !!document.queryCommandSupported(t);
                      }),
                      e
                    );
                  },
                },
              ]),
              (e = [
                {
                  key: "resolveOptions",
                  value: function () {
                    var t =
                      0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {};
                    (this.action =
                      "function" == typeof t.action
                        ? t.action
                        : this.defaultAction),
                      (this.target =
                        "function" == typeof t.target
                          ? t.target
                          : this.defaultTarget),
                      (this.text =
                        "function" == typeof t.text
                          ? t.text
                          : this.defaultText),
                      (this.container =
                        "object" === p(t.container)
                          ? t.container
                          : document.body);
                  },
                },
                {
                  key: "listenClick",
                  value: function (t) {
                    var e = this;
                    this.listener = l()(t, "click", function (t) {
                      return e.onClick(t);
                    });
                  },
                },
                {
                  key: "onClick",
                  value: function (t) {
                    var e = t.delegateTarget || t.currentTarget,
                      t = (function () {
                        var t =
                            void 0 ===
                            (i = (s =
                              0 < arguments.length && void 0 !== arguments[0]
                                ? arguments[0]
                                : {}).action)
                              ? "copy"
                              : i,
                          e = s.container,
                          i = s.target,
                          s = s.text;
                        if ("copy" !== t && "cut" !== t)
                          throw new Error(
                            'Invalid "action" value, use either "copy" or "cut"'
                          );
                        if (void 0 !== i) {
                          if (!i || "object" !== d(i) || 1 !== i.nodeType)
                            throw new Error(
                              'Invalid "target" value, use a valid Element'
                            );
                          if ("copy" === t && i.hasAttribute("disabled"))
                            throw new Error(
                              'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                            );
                          if (
                            "cut" === t &&
                            (i.hasAttribute("readonly") ||
                              i.hasAttribute("disabled"))
                          )
                            throw new Error(
                              'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes'
                            );
                        }
                        return s
                          ? h(s, { container: e })
                          : i
                          ? "cut" === t
                            ? u(i)
                            : h(i, { container: e })
                          : void 0;
                      })({
                        action: this.action(e),
                        container: this.container,
                        target: this.target(e),
                        text: this.text(e),
                      });
                    this.emit(t ? "success" : "error", {
                      action: this.action,
                      text: t,
                      trigger: e,
                      clearSelection: function () {
                        e && e.focus(),
                          document.activeElement.blur(),
                          window.getSelection().removeAllRanges();
                      },
                    });
                  },
                },
                {
                  key: "defaultAction",
                  value: function (t) {
                    return y("action", t);
                  },
                },
                {
                  key: "defaultTarget",
                  value: function (t) {
                    if ((t = y("target", t))) return document.querySelector(t);
                  },
                },
                {
                  key: "defaultText",
                  value: function (t) {
                    return y("text", t);
                  },
                },
                {
                  key: "destroy",
                  value: function () {
                    this.listener.destroy();
                  },
                },
              ]),
              m((t = r).prototype, e),
              m(t, i),
              r
            );
          })();
        },
        828: function (t) {
          var e;
          "undefined" == typeof Element ||
            Element.prototype.matches ||
            ((e = Element.prototype).matches =
              e.matchesSelector ||
              e.mozMatchesSelector ||
              e.msMatchesSelector ||
              e.oMatchesSelector ||
              e.webkitMatchesSelector),
            (t.exports = function (t, e) {
              for (; t && 9 !== t.nodeType; ) {
                if ("function" == typeof t.matches && t.matches(e)) return t;
                t = t.parentNode;
              }
            });
        },
        438: function (t, e, i) {
          var r = i(828);
          function o(t, e, i, s, n) {
            var o = function (e, i, t, s) {
              return function (t) {
                (t.delegateTarget = r(t.target, i)),
                  t.delegateTarget && s.call(e, t);
              };
            }.apply(this, arguments);
            return (
              t.addEventListener(i, o, n),
              {
                destroy: function () {
                  t.removeEventListener(i, o, n);
                },
              }
            );
          }
          t.exports = function (t, e, i, s, n) {
            return "function" == typeof t.addEventListener
              ? o.apply(null, arguments)
              : "function" == typeof i
              ? o.bind(null, document).apply(null, arguments)
              : ("string" == typeof t && (t = document.querySelectorAll(t)),
                Array.prototype.map.call(t, function (t) {
                  return o(t, e, i, s, n);
                }));
          };
        },
        879: function (t, i) {
          (i.node = function (t) {
            return void 0 !== t && t instanceof HTMLElement && 1 === t.nodeType;
          }),
            (i.nodeList = function (t) {
              var e = Object.prototype.toString.call(t);
              return (
                void 0 !== t &&
                ("[object NodeList]" === e ||
                  "[object HTMLCollection]" === e) &&
                "length" in t &&
                (0 === t.length || i.node(t[0]))
              );
            }),
            (i.string = function (t) {
              return "string" == typeof t || t instanceof String;
            }),
            (i.fn = function (t) {
              return "[object Function]" === Object.prototype.toString.call(t);
            });
        },
        370: function (t, e, i) {
          var c = i(879),
            u = i(438);
          t.exports = function (t, e, i) {
            if (!t && !e && !i) throw new Error("Missing required arguments");
            if (!c.string(e))
              throw new TypeError("Second argument must be a String");
            if (!c.fn(i))
              throw new TypeError("Third argument must be a Function");
            if (c.node(t))
              return (
                (r = t).addEventListener((a = e), (l = i)),
                {
                  destroy: function () {
                    r.removeEventListener(a, l);
                  },
                }
              );
            if (c.nodeList(t))
              return (
                (s = t),
                (n = e),
                (o = i),
                Array.prototype.forEach.call(s, function (t) {
                  t.addEventListener(n, o);
                }),
                {
                  destroy: function () {
                    Array.prototype.forEach.call(s, function (t) {
                      t.removeEventListener(n, o);
                    });
                  },
                }
              );
            if (c.string(t)) return u(document.body, t, e, i);
            throw new TypeError(
              "First argument must be a String, HTMLElement, HTMLCollection, or NodeList"
            );
            var s, n, o, r, a, l;
          };
        },
        817: function (t) {
          t.exports = function (t) {
            var e,
              i =
                "SELECT" === t.nodeName
                  ? (t.focus(), t.value)
                  : "INPUT" === t.nodeName || "TEXTAREA" === t.nodeName
                  ? ((e = t.hasAttribute("readonly")) ||
                      t.setAttribute("readonly", ""),
                    t.select(),
                    t.setSelectionRange(0, t.value.length),
                    e || t.removeAttribute("readonly"),
                    t.value)
                  : (t.hasAttribute("contenteditable") && t.focus(),
                    (i = window.getSelection()),
                    (e = document.createRange()).selectNodeContents(t),
                    i.removeAllRanges(),
                    i.addRange(e),
                    i.toString());
            return i;
          };
        },
        279: function (t) {
          function e() {}
          (e.prototype = {
            on: function (t, e, i) {
              var s = this.e || (this.e = {});
              return (s[t] || (s[t] = [])).push({ fn: e, ctx: i }), this;
            },
            once: function (t, e, i) {
              var s = this;
              function n() {
                s.off(t, n), e.apply(i, arguments);
              }
              return (n._ = e), this.on(t, n, i);
            },
            emit: function (t) {
              for (
                var e = [].slice.call(arguments, 1),
                  i = ((this.e || (this.e = {}))[t] || []).slice(),
                  s = 0,
                  n = i.length;
                s < n;
                s++
              )
                i[s].fn.apply(i[s].ctx, e);
              return this;
            },
            off: function (t, e) {
              var i = this.e || (this.e = {}),
                s = i[t],
                n = [];
              if (s && e)
                for (var o = 0, r = s.length; o < r; o++)
                  s[o].fn !== e && s[o].fn._ !== e && n.push(s[o]);
              return n.length ? (i[t] = n) : delete i[t], this;
            },
          }),
            (t.exports = e),
            (t.exports.TinyEmitter = e);
        },
      }),
      (n = {}),
      (s.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return s.d(e, { a: e }), e;
      }),
      (s.d = function (t, e) {
        for (var i in e)
          s.o(e, i) &&
            !s.o(t, i) &&
            Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
      }),
      (s.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      s(686).default
    );
    function s(t) {
      if (n[t]) return n[t].exports;
      var e = (n[t] = { exports: {} });
      return i[t](e, e.exports, s), e.exports;
    }
    var i, n;
  }),
  (function (t, e) {
    "object" == typeof exports && "object" == typeof module
      ? (module.exports = e())
      : "function" == typeof define && define.amd
      ? define([], e)
      : "object" == typeof exports
      ? (exports.counterUp = e())
      : (t.counterUp = e());
  })(self, function () {
    return (() => {
      "use strict";
      var s = {
          d: (t, e) => {
            for (var i in e)
              s.o(e, i) &&
                !s.o(t, i) &&
                Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
          },
          o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
          r: (t) => {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(t, "__esModule", { value: !0 });
          },
        },
        t = {};
      s.r(t), s.d(t, { default: () => e, divideNumbers: () => l });
      const e = (t, e = {}) => {
          const { action: i = "start", duration: s = 1e3, delay: n = 16 } = e;
          if ("stop" !== i) {
            if ((a(t), /[0-9]/.test(t.innerHTML))) {
              const o = l(t.innerHTML, {
                duration: s || t.getAttribute("data-duration"),
                delay: n || t.getAttribute("data-delay"),
              });
              (t._countUpOrigInnerHTML = t.innerHTML),
                (t.innerHTML = o[0] || "&nbsp;"),
                (t.style.visibility = "visible");
              const r = function () {
                (t.innerHTML = o.shift() || "&nbsp;"),
                  o.length
                    ? (clearTimeout(t.countUpTimeout),
                      (t.countUpTimeout = setTimeout(r, n)))
                    : (t._countUpOrigInnerHTML = void 0);
              };
              t.countUpTimeout = setTimeout(r, n);
            }
          } else a(t);
        },
        a = (t) => {
          clearTimeout(t.countUpTimeout),
            t._countUpOrigInnerHTML &&
              ((t.innerHTML = t._countUpOrigInnerHTML),
              (t._countUpOrigInnerHTML = void 0)),
            (t.style.visibility = "");
        },
        l = (t, e = {}) => {
          const { duration: n = 1e3, delay: i = 16 } = e,
            o = n / i,
            r = t.toString().split(/(<[^>]+>|[0-9.][,.0-9]*[0-9]*)/),
            a = [];
          for (let t = 0; t < o; t++) a.push("");
          for (let e = 0; e < r.length; e++)
            if (/([0-9.][,.0-9]*[0-9]*)/.test(r[e]) && !/<[^>]+>/.test(r[e])) {
              let i = r[e];
              const n = [...i.matchAll(/[.,]/g)]
                .map((t) => ({ char: t[0], i: i.length - t.index - 1 }))
                .sort((t, e) => t.i - e.i);
              i = i.replace(/[.,]/g, "");
              let s = a.length - 1;
              for (let e = o; 1 <= e; e--) {
                let t = parseInt((i / o) * e, 10);
                (t = n.reduce(
                  (t, { char: e, i }) =>
                    t.length <= i ? t : t.slice(0, -i) + e + t.slice(-i),
                  t.toString()
                )),
                  (a[s--] += t);
              }
            } else for (let t = 0; t < o; t++) a[t] += r[e];
          return (a[a.length] = t.toString()), a;
        };
      return t;
    })();
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof module && "object" == typeof module.exports
      ? (exports = t(require("jquery")))
      : t(jQuery);
  })(function (e) {
    function i(t) {
      var e = 7.5625,
        i = 2.75;
      return t < 1 / i
        ? e * t * t
        : t < 2 / i
        ? e * (t -= 1.5 / i) * t + 0.75
        : t < 2.5 / i
        ? e * (t -= 2.25 / i) * t + 0.9375
        : e * (t -= 2.625 / i) * t + 0.984375;
    }
    e.easing.jswing = e.easing.swing;
    var s = Math.pow,
      n = Math.sqrt,
      o = Math.sin,
      r = Math.cos,
      a = Math.PI,
      l = 1.70158,
      c = 1.525 * l,
      u = (2 * a) / 3,
      h = (2 * a) / 4.5;
    e.extend(e.easing, {
      def: "easeOutQuad",
      swing: function (t) {
        return e.easing[e.easing.def](t);
      },
      easeInQuad: function (t) {
        return t * t;
      },
      easeOutQuad: function (t) {
        return 1 - (1 - t) * (1 - t);
      },
      easeInOutQuad: function (t) {
        return t < 0.5 ? 2 * t * t : 1 - s(-2 * t + 2, 2) / 2;
      },
      easeInCubic: function (t) {
        return t * t * t;
      },
      easeOutCubic: function (t) {
        return 1 - s(1 - t, 3);
      },
      easeInOutCubic: function (t) {
        return t < 0.5 ? 4 * t * t * t : 1 - s(-2 * t + 2, 3) / 2;
      },
      easeInQuart: function (t) {
        return t * t * t * t;
      },
      easeOutQuart: function (t) {
        return 1 - s(1 - t, 4);
      },
      easeInOutQuart: function (t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - s(-2 * t + 2, 4) / 2;
      },
      easeInQuint: function (t) {
        return t * t * t * t * t;
      },
      easeOutQuint: function (t) {
        return 1 - s(1 - t, 5);
      },
      easeInOutQuint: function (t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 - s(-2 * t + 2, 5) / 2;
      },
      easeInSine: function (t) {
        return 1 - r((t * a) / 2);
      },
      easeOutSine: function (t) {
        return o((t * a) / 2);
      },
      easeInOutSine: function (t) {
        return -(r(a * t) - 1) / 2;
      },
      easeInExpo: function (t) {
        return 0 === t ? 0 : s(2, 10 * t - 10);
      },
      easeOutExpo: function (t) {
        return 1 === t ? 1 : 1 - s(2, -10 * t);
      },
      easeInOutExpo: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : t < 0.5
          ? s(2, 20 * t - 10) / 2
          : (2 - s(2, -20 * t + 10)) / 2;
      },
      easeInCirc: function (t) {
        return 1 - n(1 - s(t, 2));
      },
      easeOutCirc: function (t) {
        return n(1 - s(t - 1, 2));
      },
      easeInOutCirc: function (t) {
        return t < 0.5
          ? (1 - n(1 - s(2 * t, 2))) / 2
          : (n(1 - s(-2 * t + 2, 2)) + 1) / 2;
      },
      easeInElastic: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : -s(2, 10 * t - 10) * o((10 * t - 10.75) * u);
      },
      easeOutElastic: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : s(2, -10 * t) * o((10 * t - 0.75) * u) + 1;
      },
      easeInOutElastic: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : t < 0.5
          ? -(s(2, 20 * t - 10) * o((20 * t - 11.125) * h)) / 2
          : (s(2, -20 * t + 10) * o((20 * t - 11.125) * h)) / 2 + 1;
      },
      easeInBack: function (t) {
        return (1 + l) * t * t * t - l * t * t;
      },
      easeOutBack: function (t) {
        return 1 + (1 + l) * s(t - 1, 3) + l * s(t - 1, 2);
      },
      easeInOutBack: function (t) {
        return t < 0.5
          ? (s(2 * t, 2) * (7.189819 * t - c)) / 2
          : (s(2 * t - 2, 2) * ((1 + c) * (2 * t - 2) + c) + 2) / 2;
      },
      easeInBounce: function (t) {
        return 1 - i(1 - t);
      },
      easeOutBounce: i,
      easeInOutBounce: function (t) {
        return t < 0.5 ? (1 - i(1 - 2 * t)) / 2 : (1 + i(2 * t - 1)) / 2;
      },
    });
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define([], e)
      : "object" == typeof exports
      ? (module.exports = e())
      : (t.Headhesive = e());
  })(this, function () {
    "use strict";
    function t(i, s) {
      function n() {
        (u = l()), (c = null), (a = i.apply(o, r)), (o = r = null);
      }
      var o,
        r,
        a,
        l =
          Date.now ||
          function () {
            return new Date().getTime();
          },
        c = null,
        u = 0;
      return function () {
        var t = l(),
          e = s - (t - u);
        return (
          (o = this),
          (r = arguments),
          e <= 0
            ? (clearTimeout(c),
              (c = null),
              (u = t),
              (a = i.apply(o, r)),
              (o = r = null))
            : (c = c || setTimeout(n, e)),
          a
        );
      };
    }
    function e(t, e) {
      "querySelector" in document &&
        "addEventListener" in window &&
        ((this.visible = !1),
        (this.options = {
          offset: 300,
          offsetSide: "top",
          classes: {
            clone: "headhesive",
            stick: "headhesive--stick",
            unstick: "headhesive--unstick",
          },
          throttle: 250,
          onInit: function () {},
          onStick: function () {},
          onUnstick: function () {},
          onDestroy: function () {},
        }),
        (this.elem = "string" == typeof t ? document.querySelector(t) : t),
        (this.options = s(this.options, e)),
        this.init());
    }
    var s = function (t, e) {
      for (var i in e)
        e.hasOwnProperty(i) &&
          (t[i] = "object" == typeof e[i] ? s(t[i], e[i]) : e[i]);
      return t;
    };
    return (
      (e.prototype = {
        constructor: e,
        init: function () {
          if (
            ((this.clonedElem = this.elem.cloneNode(!0)),
            (this.clonedElem.className += " " + this.options.classes.clone),
            document.body.insertBefore(
              this.clonedElem,
              document.body.firstChild
            ),
            "number" == typeof this.options.offset)
          )
            this.scrollOffset = this.options.offset;
          else {
            if ("string" != typeof this.options.offset)
              throw new Error("Invalid offset: " + this.options.offset);
            this._setScrollOffset();
          }
          (this._throttleUpdate = t(
            this.update.bind(this),
            this.options.throttle
          )),
            (this._throttleScrollOffset = t(
              this._setScrollOffset.bind(this),
              this.options.throttle
            )),
            window.addEventListener("scroll", this._throttleUpdate, !1),
            window.addEventListener("resize", this._throttleScrollOffset, !1),
            this.options.onInit.call(this);
        },
        _setScrollOffset: function () {
          "string" == typeof this.options.offset &&
            (this.scrollOffset = (function (t, e) {
              for (var i = 0, s = t.offsetHeight; t; )
                (i += t.offsetTop), (t = t.offsetParent);
              return "bottom" === e && (i += s), i;
            })(
              document.querySelector(this.options.offset),
              this.options.offsetSide
            ));
        },
        destroy: function () {
          document.body.removeChild(this.clonedElem),
            window.removeEventListener("scroll", this._throttleUpdate),
            window.removeEventListener("resize", this._throttleScrollOffset),
            this.options.onDestroy.call(this);
        },
        stick: function () {
          this.visible ||
            ((this.clonedElem.className = this.clonedElem.className.replace(
              new RegExp(
                "(^|\\s)*" + this.options.classes.unstick + "(\\s|$)*",
                "g"
              ),
              ""
            )),
            (this.clonedElem.className += " " + this.options.classes.stick),
            (this.visible = !0),
            this.options.onStick.call(this));
        },
        unstick: function () {
          this.visible &&
            ((this.clonedElem.className = this.clonedElem.className.replace(
              new RegExp(
                "(^|\\s)*" + this.options.classes.stick + "(\\s|$)*",
                "g"
              ),
              ""
            )),
            (this.clonedElem.className += " " + this.options.classes.unstick),
            (this.visible = !1),
            this.options.onUnstick.call(this));
        },
        update: function () {
          (void 0 !== window.pageYOffset
            ? window.pageYOffset
            : (
                document.documentElement ||
                document.body.parentNode ||
                document.body
              ).scrollTop) > this.scrollOffset
            ? this.stick()
            : this.unstick();
        },
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("ev-emitter/ev-emitter", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            t = (i[t] = i[t] || []);
          return -1 == t.indexOf(e) && t.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {});
          return ((i[t] = i[t] || {})[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        t = this._events && this._events[t];
        if (t && t.length) {
          e = t.indexOf(e);
          return -1 != e && t.splice(e, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          (i = i.slice(0)), (e = e || []);
          for (
            var s = this._onceEvents && this._onceEvents[t], n = 0;
            n < i.length;
            n++
          ) {
            var o = i[n];
            s && s[o] && (this.off(t, o), delete s[o]), o.apply(this, e);
          }
          return this;
        }
      }),
      (e.allOff = function () {
        delete this._events, delete this._onceEvents;
      }),
      t
    );
  }),
  (function (e, i) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["ev-emitter/ev-emitter"], function (t) {
          return i(e, t);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = i(e, require("ev-emitter")))
      : (e.imagesLoaded = i(e, e.EvEmitter));
  })("undefined" != typeof window ? window : this, function (e, t) {
    function o(t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }
    function r(t, e, i) {
      if (!(this instanceof r)) return new r(t, e, i);
      var s,
        n = t;
      return (n = "string" == typeof t ? document.querySelectorAll(t) : n)
        ? ((this.elements =
            ((s = n),
            Array.isArray(s)
              ? s
              : "object" == typeof s && "number" == typeof s.length
              ? c.call(s)
              : [s])),
          (this.options = o({}, this.options)),
          "function" == typeof e ? (i = e) : o(this.options, e),
          i && this.on("always", i),
          this.getImages(),
          a && (this.jqDeferred = new a.Deferred()),
          void setTimeout(this.check.bind(this)))
        : void l.error("Bad element for imagesLoaded " + (n || t));
    }
    function i(t) {
      this.img = t;
    }
    function s(t, e) {
      (this.url = t), (this.element = e), (this.img = new Image());
    }
    var a = e.jQuery,
      l = e.console,
      c = Array.prototype.slice;
    ((r.prototype = Object.create(t.prototype)).options = {}),
      (r.prototype.getImages = function () {
        (this.images = []), this.elements.forEach(this.addElementImages, this);
      }),
      (r.prototype.addElementImages = function (t) {
        "IMG" == t.nodeName && this.addImage(t),
          !0 === this.options.background && this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && u[e]) {
          for (var i = t.querySelectorAll("img"), s = 0; s < i.length; s++) {
            var n = i[s];
            this.addImage(n);
          }
          if ("string" == typeof this.options.background)
            for (
              var o = t.querySelectorAll(this.options.background), s = 0;
              s < o.length;
              s++
            ) {
              var r = o[s];
              this.addElementBackgroundImages(r);
            }
        }
      });
    var u = { 1: !0, 9: !0, 11: !0 };
    return (
      (r.prototype.addElementBackgroundImages = function (t) {
        var e = getComputedStyle(t);
        if (e)
          for (
            var i = /url\((['"])?(.*?)\1\)/gi, s = i.exec(e.backgroundImage);
            null !== s;

          ) {
            var n = s && s[2];
            n && this.addBackground(n, t), (s = i.exec(e.backgroundImage));
          }
      }),
      (r.prototype.addImage = function (t) {
        t = new i(t);
        this.images.push(t);
      }),
      (r.prototype.addBackground = function (t, e) {
        e = new s(t, e);
        this.images.push(e);
      }),
      (r.prototype.check = function () {
        function e(t, e, i) {
          setTimeout(function () {
            s.progress(t, e, i);
          });
        }
        var s = this;
        return (
          (this.progressedCount = 0),
          (this.hasAnyBroken = !1),
          this.images.length
            ? void this.images.forEach(function (t) {
                t.once("progress", e), t.check();
              })
            : void this.complete()
        );
      }),
      (r.prototype.progress = function (t, e, i) {
        this.progressedCount++,
          (this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
          this.emitEvent("progress", [this, t, e]),
          this.jqDeferred &&
            this.jqDeferred.notify &&
            this.jqDeferred.notify(this, t),
          this.progressedCount == this.images.length && this.complete(),
          this.options.debug && l && l.log("progress: " + i, t, e);
      }),
      (r.prototype.complete = function () {
        var t = this.hasAnyBroken ? "fail" : "done";
        (this.isComplete = !0),
          this.emitEvent(t, [this]),
          this.emitEvent("always", [this]),
          this.jqDeferred &&
            ((t = this.hasAnyBroken ? "reject" : "resolve"),
            this.jqDeferred[t](this));
      }),
      ((i.prototype = Object.create(t.prototype)).check = function () {
        return this.getIsImageComplete()
          ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
          : ((this.proxyImage = new Image()),
            this.proxyImage.addEventListener("load", this),
            this.proxyImage.addEventListener("error", this),
            this.img.addEventListener("load", this),
            this.img.addEventListener("error", this),
            void (this.proxyImage.src = this.img.src));
      }),
      (i.prototype.getIsImageComplete = function () {
        return this.img.complete && this.img.naturalWidth;
      }),
      (i.prototype.confirm = function (t, e) {
        (this.isLoaded = t), this.emitEvent("progress", [this, this.img, e]);
      }),
      (i.prototype.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (i.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents();
      }),
      (i.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents();
      }),
      (i.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this),
          this.proxyImage.removeEventListener("error", this),
          this.img.removeEventListener("load", this),
          this.img.removeEventListener("error", this);
      }),
      ((s.prototype = Object.create(i.prototype)).check = function () {
        this.img.addEventListener("load", this),
          this.img.addEventListener("error", this),
          (this.img.src = this.url),
          this.getIsImageComplete() &&
            (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
            this.unbindEvents());
      }),
      (s.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this),
          this.img.removeEventListener("error", this);
      }),
      (s.prototype.confirm = function (t, e) {
        (this.isLoaded = t),
          this.emitEvent("progress", [this, this.element, e]);
      }),
      (r.makeJQueryPlugin = function (t) {
        (t = t || e.jQuery) &&
          ((a = t).fn.imagesLoaded = function (t, e) {
            return new r(this, t, e).jqDeferred.promise(a(this));
          });
      })(),
      r
    );
  }),
  (function (e, i) {
    "function" == typeof define && define.amd
      ? define("jquery-bridget/jquery-bridget", ["jquery"], function (t) {
          return i(e, t);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = i(e, require("jquery")))
      : (e.jQueryBridget = i(e, e.jQuery));
  })(window, function (t, e) {
    "use strict";
    function i(l, c, u) {
      (u = u || e || t.jQuery) &&
        (c.prototype.option ||
          (c.prototype.option = function (t) {
            u.isPlainObject(t) &&
              (this.options = u.extend(!0, this.options, t));
          }),
        (u.fn[l] = function (t) {
          if ("string" != typeof t)
            return (
              (a = t),
              this.each(function (t, e) {
                var i = u.data(e, l);
                i
                  ? (i.option(a), i._init())
                  : ((i = new c(e, a)), u.data(e, l, i));
              }),
              this
            );
          var s,
            n,
            o,
            r,
            a,
            e = h.call(arguments, 1);
          return (
            (n = e),
            (r = "$()." + l + '("' + (s = t) + '")'),
            (t = this).each(function (t, e) {
              var i = u.data(e, l);
              i
                ? (e = i[s]) && "_" != s.charAt(0)
                  ? ((i = e.apply(i, n)), (o = void 0 === o ? i : o))
                  : d(r + " is not a valid method")
                : d(l + " not initialized. Cannot call methods, i.e. " + r);
            }),
            void 0 !== o ? o : t
          );
        }),
        s(u));
    }
    function s(t) {
      !t || (t && t.bridget) || (t.bridget = i);
    }
    var h = Array.prototype.slice,
      n = t.console,
      d =
        void 0 === n
          ? function () {}
          : function (t) {
              n.error(t);
            };
    return s(e || t.jQuery), i;
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("ev-emitter/ev-emitter", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            t = (i[t] = i[t] || []);
          return -1 == t.indexOf(e) && t.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {});
          return ((i[t] = i[t] || {})[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        t = this._events && this._events[t];
        if (t && t.length) {
          e = t.indexOf(e);
          return -1 != e && t.splice(e, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          (i = i.slice(0)), (e = e || []);
          for (
            var s = this._onceEvents && this._onceEvents[t], n = 0;
            n < i.length;
            n++
          ) {
            var o = i[n];
            s && s[o] && (this.off(t, o), delete s[o]), o.apply(this, e);
          }
          return this;
        }
      }),
      (e.allOff = function () {
        delete this._events, delete this._onceEvents;
      }),
      t
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("get-size/get-size", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.getSize = e());
  })(window, function () {
    "use strict";
    function p(t) {
      var e = parseFloat(t);
      return -1 == t.indexOf("%") && !isNaN(e) && e;
    }
    function m(t) {
      t = getComputedStyle(t);
      return (
        t ||
          e(
            "Style returned " +
              t +
              ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"
          ),
        t
      );
    }
    function g(t) {
      if (
        (b ||
          ((b = !0),
          ((d = document.createElement("div")).style.width = "200px"),
          (d.style.padding = "1px 2px 3px 4px"),
          (d.style.borderStyle = "solid"),
          (d.style.borderWidth = "1px 2px 3px 4px"),
          (d.style.boxSizing = "border-box"),
          (h = document.body || document.documentElement).appendChild(d),
          (u = m(d)),
          (f = 200 == Math.round(p(u.width))),
          (g.isBoxSizeOuter = f),
          h.removeChild(d)),
        (t = "string" == typeof t ? document.querySelector(t) : t) &&
          "object" == typeof t &&
          t.nodeType)
      ) {
        var e = m(t);
        if ("none" == e.display)
          return (function () {
            for (
              var t = {
                  width: 0,
                  height: 0,
                  innerWidth: 0,
                  innerHeight: 0,
                  outerWidth: 0,
                  outerHeight: 0,
                },
                e = 0;
              e < v;
              e++
            )
              t[y[e]] = 0;
            return t;
          })();
        var i = {};
        (i.width = t.offsetWidth), (i.height = t.offsetHeight);
        for (
          var s = (i.isBorderBox = "border-box" == e.boxSizing), n = 0;
          n < v;
          n++
        ) {
          var o = y[n],
            r = e[o],
            r = parseFloat(r);
          i[o] = isNaN(r) ? 0 : r;
        }
        var a = i.paddingLeft + i.paddingRight,
          l = i.paddingTop + i.paddingBottom,
          c = i.marginLeft + i.marginRight,
          u = i.marginTop + i.marginBottom,
          h = i.borderLeftWidth + i.borderRightWidth,
          d = i.borderTopWidth + i.borderBottomWidth,
          t = s && f,
          s = p(e.width);
        !1 !== s && (i.width = s + (t ? 0 : a + h));
        s = p(e.height);
        return (
          !1 !== s && (i.height = s + (t ? 0 : l + d)),
          (i.innerWidth = i.width - (a + h)),
          (i.innerHeight = i.height - (l + d)),
          (i.outerWidth = i.width + c),
          (i.outerHeight = i.height + u),
          i
        );
      }
      var d, h, u;
    }
    var f,
      e =
        "undefined" == typeof console
          ? function () {}
          : function (t) {
              console.error(t);
            },
      y = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ],
      v = y.length,
      b = !1;
    return g;
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define("desandro-matches-selector/matches-selector", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.matchesSelector = e());
  })(window, function () {
    "use strict";
    var i = (function () {
      var t = window.Element.prototype;
      if (t.matches) return "matches";
      if (t.matchesSelector) return "matchesSelector";
      for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
        var s = e[i] + "MatchesSelector";
        if (t[s]) return s;
      }
    })();
    return function (t, e) {
      return t[i](e);
    };
  }),
  (function (e, i) {
    "function" == typeof define && define.amd
      ? define(
          "fizzy-ui-utils/utils",
          ["desandro-matches-selector/matches-selector"],
          function (t) {
            return i(e, t);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = i(e, require("desandro-matches-selector")))
      : (e.fizzyUIUtils = i(e, e.matchesSelector));
  })(window, function (i, o) {
    var l = {
        extend: function (t, e) {
          for (var i in e) t[i] = e[i];
          return t;
        },
        modulo: function (t, e) {
          return ((t % e) + e) % e;
        },
      },
      e = Array.prototype.slice;
    (l.makeArray = function (t) {
      return Array.isArray(t)
        ? t
        : null == t
        ? []
        : "object" == typeof t && "number" == typeof t.length
        ? e.call(t)
        : [t];
    }),
      (l.removeFrom = function (t, e) {
        e = t.indexOf(e);
        -1 != e && t.splice(e, 1);
      }),
      (l.getParent = function (t, e) {
        for (; t.parentNode && t != document.body; )
          if (((t = t.parentNode), o(t, e))) return t;
      }),
      (l.getQueryElement = function (t) {
        return "string" == typeof t ? document.querySelector(t) : t;
      }),
      (l.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (l.filterFindElements = function (t, s) {
        t = l.makeArray(t);
        var n = [];
        return (
          t.forEach(function (t) {
            if (t instanceof HTMLElement)
              if (s) {
                o(t, s) && n.push(t);
                for (var e = t.querySelectorAll(s), i = 0; i < e.length; i++)
                  n.push(e[i]);
              } else n.push(t);
          }),
          n
        );
      }),
      (l.debounceMethod = function (t, e, s) {
        s = s || 100;
        var n = t.prototype[e],
          o = e + "Timeout";
        t.prototype[e] = function () {
          var t = this[o];
          clearTimeout(t);
          var e = arguments,
            i = this;
          this[o] = setTimeout(function () {
            n.apply(i, e), delete i[o];
          }, s);
        };
      }),
      (l.docReady = function (t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e
          ? setTimeout(t)
          : document.addEventListener("DOMContentLoaded", t);
      }),
      (l.toDashed = function (t) {
        return t
          .replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + "-" + i;
          })
          .toLowerCase();
      });
    var c = i.console;
    return (
      (l.htmlInit = function (r, a) {
        l.docReady(function () {
          var t = l.toDashed(a),
            s = "data-" + t,
            e = document.querySelectorAll("[" + s + "]"),
            t = document.querySelectorAll(".js-" + t),
            t = l.makeArray(e).concat(l.makeArray(t)),
            n = s + "-options",
            o = i.jQuery;
          t.forEach(function (e) {
            var t = e.getAttribute(s) || e.getAttribute(n);
            try {
              i = t && JSON.parse(t);
            } catch (t) {
              return void (
                c &&
                c.error("Error parsing " + s + " on " + e.className + ": " + t)
              );
            }
            var i = new r(e, i);
            o && o.data(e, a, i);
          });
        });
      }),
      l
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "outlayer/item",
          ["ev-emitter/ev-emitter", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("ev-emitter"), require("get-size")))
      : ((t.Outlayer = {}), (t.Outlayer.Item = e(t.EvEmitter, t.getSize)));
  })(window, function (t, e) {
    "use strict";
    function i(t, e) {
      t &&
        ((this.element = t),
        (this.layout = e),
        (this.position = { x: 0, y: 0 }),
        this._create());
    }
    var s = document.documentElement.style,
      n = "string" == typeof s.transition ? "transition" : "WebkitTransition",
      o = "string" == typeof s.transform ? "transform" : "WebkitTransform",
      r = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend",
      }[n],
      a = {
        transform: o,
        transition: n,
        transitionDuration: n + "Duration",
        transitionProperty: n + "Property",
        transitionDelay: n + "Delay",
      },
      t = (i.prototype = Object.create(t.prototype));
    (t.constructor = i),
      (t._create = function () {
        (this._transn = { ingProperties: {}, clean: {}, onEnd: {} }),
          this.css({ position: "absolute" });
      }),
      (t.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (t.getSize = function () {
        this.size = e(this.element);
      }),
      (t.css = function (t) {
        var e,
          i = this.element.style;
        for (e in t) i[a[e] || e] = t[e];
      }),
      (t.getPosition = function () {
        var t = getComputedStyle(this.element),
          e = this.layout._getOption("originLeft"),
          i = this.layout._getOption("originTop"),
          s = t[e ? "left" : "right"],
          n = t[i ? "top" : "bottom"],
          o = parseFloat(s),
          r = parseFloat(n),
          t = this.layout.size;
        -1 != s.indexOf("%") && (o = (o / 100) * t.width),
          -1 != n.indexOf("%") && (r = (r / 100) * t.height),
          (o = isNaN(o) ? 0 : o),
          (r = isNaN(r) ? 0 : r),
          (o -= e ? t.paddingLeft : t.paddingRight),
          (r -= i ? t.paddingTop : t.paddingBottom),
          (this.position.x = o),
          (this.position.y = r);
      }),
      (t.layoutPosition = function () {
        var t = this.layout.size,
          e = {},
          i = this.layout._getOption("originLeft"),
          s = this.layout._getOption("originTop"),
          n = i ? "right" : "left",
          o = this.position.x + t[i ? "paddingLeft" : "paddingRight"];
        (e[i ? "left" : "right"] = this.getXValue(o)), (e[n] = "");
        (n = s ? "bottom" : "top"),
          (t = this.position.y + t[s ? "paddingTop" : "paddingBottom"]);
        (e[s ? "top" : "bottom"] = this.getYValue(t)),
          (e[n] = ""),
          this.css(e),
          this.emitEvent("layout", [this]);
      }),
      (t.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e
          ? (t / this.layout.size.width) * 100 + "%"
          : t + "px";
      }),
      (t.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e
          ? (t / this.layout.size.height) * 100 + "%"
          : t + "px";
      }),
      (t._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
          s = this.position.y,
          n = t == this.position.x && e == this.position.y;
        this.setPosition(t, e),
          !n || this.isTransitioning
            ? (((n = {}).transform = this.getTranslate(t - i, e - s)),
              this.transition({
                to: n,
                onTransitionEnd: { transform: this.layoutPosition },
                isCleaning: !0,
              }))
            : this.layoutPosition();
      }),
      (t.getTranslate = function (t, e) {
        return (
          "translate3d(" +
          (t = this.layout._getOption("originLeft") ? t : -t) +
          "px, " +
          (e = this.layout._getOption("originTop") ? e : -e) +
          "px, 0)"
        );
      }),
      (t.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition();
      }),
      (t.moveTo = t._transitionTo),
      (t.setPosition = function (t, e) {
        (this.position.x = parseFloat(t)), (this.position.y = parseFloat(e));
      }),
      (t._nonTransition = function (t) {
        for (var e in (this.css(t.to),
        t.isCleaning && this._removeStyles(t.to),
        t.onTransitionEnd))
          t.onTransitionEnd[e].call(this);
      }),
      (t.transition = function (t) {
        if (parseFloat(this.layout.options.transitionDuration)) {
          var e,
            i = this._transn;
          for (e in t.onTransitionEnd) i.onEnd[e] = t.onTransitionEnd[e];
          for (e in t.to)
            (i.ingProperties[e] = !0), t.isCleaning && (i.clean[e] = !0);
          t.from && (this.css(t.from), this.element.offsetHeight, 0),
            this.enableTransition(t.to),
            this.css(t.to),
            (this.isTransitioning = !0);
        } else this._nonTransition(t);
      });
    var l =
      "opacity," +
      o.replace(/([A-Z])/g, function (t) {
        return "-" + t.toLowerCase();
      });
    (t.enableTransition = function () {
      var t;
      this.isTransitioning ||
        ((t =
          "number" == typeof (t = this.layout.options.transitionDuration)
            ? t + "ms"
            : t),
        this.css({
          transitionProperty: l,
          transitionDuration: t,
          transitionDelay: this.staggerDelay || 0,
        }),
        this.element.addEventListener(r, this, !1));
    }),
      (t.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t);
      }),
      (t.onotransitionend = function (t) {
        this.ontransitionend(t);
      });
    var c = { "-webkit-transform": "transform" };
    (t.ontransitionend = function (t) {
      var e, i;
      t.target === this.element &&
        ((e = this._transn),
        (i = c[t.propertyName] || t.propertyName),
        delete e.ingProperties[i],
        (function (t) {
          for (var e in t) return;
          return 1;
        })(e.ingProperties) && this.disableTransition(),
        i in e.clean &&
          ((this.element.style[t.propertyName] = ""), delete e.clean[i]),
        i in e.onEnd && (e.onEnd[i].call(this), delete e.onEnd[i]),
        this.emitEvent("transitionEnd", [this]));
    }),
      (t.disableTransition = function () {
        this.removeTransitionStyles(),
          this.element.removeEventListener(r, this, !1),
          (this.isTransitioning = !1);
      }),
      (t._removeStyles = function (t) {
        var e,
          i = {};
        for (e in t) i[e] = "";
        this.css(i);
      });
    var u = {
      transitionProperty: "",
      transitionDuration: "",
      transitionDelay: "",
    };
    return (
      (t.removeTransitionStyles = function () {
        this.css(u);
      }),
      (t.stagger = function (t) {
        (t = isNaN(t) ? 0 : t), (this.staggerDelay = t + "ms");
      }),
      (t.removeElem = function () {
        this.element.parentNode.removeChild(this.element),
          this.css({ display: "" }),
          this.emitEvent("remove", [this]);
      }),
      (t.remove = function () {
        return n && parseFloat(this.layout.options.transitionDuration)
          ? (this.once("transitionEnd", function () {
              this.removeElem();
            }),
            void this.hide())
          : void this.removeElem();
      }),
      (t.reveal = function () {
        delete this.isHidden, this.css({ display: "" });
        var t = this.layout.options,
          e = {};
        (e[this.getHideRevealTransitionEndProperty("visibleStyle")] =
          this.onRevealTransitionEnd),
          this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (t.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal");
      }),
      (t.getHideRevealTransitionEndProperty = function (t) {
        var e,
          t = this.layout.options[t];
        if (t.opacity) return "opacity";
        for (e in t) return e;
      }),
      (t.hide = function () {
        (this.isHidden = !0), this.css({ display: "" });
        var t = this.layout.options,
          e = {};
        (e[this.getHideRevealTransitionEndProperty("hiddenStyle")] =
          this.onHideTransitionEnd),
          this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (t.onHideTransitionEnd = function () {
        this.isHidden &&
          (this.css({ display: "none" }), this.emitEvent("hide"));
      }),
      (t.destroy = function () {
        this.css({
          position: "",
          left: "",
          right: "",
          top: "",
          bottom: "",
          transition: "",
          transform: "",
        });
      }),
      i
    );
  }),
  (function (n, o) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(
          "outlayer/outlayer",
          [
            "ev-emitter/ev-emitter",
            "get-size/get-size",
            "fizzy-ui-utils/utils",
            "./item",
          ],
          function (t, e, i, s) {
            return o(n, t, e, i, s);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = o(
          n,
          require("ev-emitter"),
          require("get-size"),
          require("fizzy-ui-utils"),
          require("./item")
        ))
      : (n.Outlayer = o(
          n,
          n.EvEmitter,
          n.getSize,
          n.fizzyUIUtils,
          n.Outlayer.Item
        ));
  })(window, function (t, e, n, s, o) {
    "use strict";
    function r(t, e) {
      var i = s.getQueryElement(t);
      i
        ? ((this.element = i),
          c && (this.$element = c(this.element)),
          (this.options = s.extend({}, this.constructor.defaults)),
          this.option(e),
          (e = ++u),
          (this.element.outlayerGUID = e),
          (h[e] = this)._create(),
          this._getOption("initLayout") && this.layout())
        : l &&
          l.error(
            "Bad element for " + this.constructor.namespace + ": " + (i || t)
          );
    }
    function a(t) {
      function e() {
        t.apply(this, arguments);
      }
      return ((e.prototype = Object.create(t.prototype)).constructor = e);
    }
    function i() {}
    var l = t.console,
      c = t.jQuery,
      u = 0,
      h = {};
    (r.namespace = "outlayer"),
      (r.Item = o),
      (r.defaults = {
        containerStyle: { position: "relative" },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
        visibleStyle: { opacity: 1, transform: "scale(1)" },
      });
    var d = r.prototype;
    s.extend(d, e.prototype),
      (d.option = function (t) {
        s.extend(this.options, t);
      }),
      (d._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e]
          ? this.options[e]
          : this.options[t];
      }),
      (r.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer",
      }),
      (d._create = function () {
        this.reloadItems(),
          (this.stamps = []),
          this.stamp(this.options.stamp),
          s.extend(this.element.style, this.options.containerStyle),
          this._getOption("resize") && this.bindResize();
      }),
      (d.reloadItems = function () {
        this.items = this._itemize(this.element.children);
      }),
      (d._itemize = function (t) {
        for (
          var e = this._filterFindItemElements(t),
            i = this.constructor.Item,
            s = [],
            n = 0;
          n < e.length;
          n++
        ) {
          var o = new i(e[n], this);
          s.push(o);
        }
        return s;
      }),
      (d._filterFindItemElements = function (t) {
        return s.filterFindElements(t, this.options.itemSelector);
      }),
      (d.getItemElements = function () {
        return this.items.map(function (t) {
          return t.element;
        });
      }),
      (d.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"),
          t = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, t), (this._isLayoutInited = !0);
      }),
      (d._init = d.layout),
      (d._resetLayout = function () {
        this.getSize();
      }),
      (d.getSize = function () {
        this.size = n(this.element);
      }),
      (d._getMeasurement = function (t, e) {
        var i,
          s = this.options[t];
        s
          ? ("string" == typeof s
              ? (i = this.element.querySelector(s))
              : s instanceof HTMLElement && (i = s),
            (this[t] = i ? n(i)[e] : s))
          : (this[t] = 0);
      }),
      (d.layoutItems = function (t, e) {
        (t = this._getItemsForLayout(t)),
          this._layoutItems(t, e),
          this._postLayout();
      }),
      (d._getItemsForLayout = function (t) {
        return t.filter(function (t) {
          return !t.isIgnored;
        });
      }),
      (d._layoutItems = function (t, i) {
        var s;
        this._emitCompleteOnItems("layout", t),
          t &&
            t.length &&
            ((s = []),
            t.forEach(function (t) {
              var e = this._getItemLayoutPosition(t);
              (e.item = t), (e.isInstant = i || t.isLayoutInstant), s.push(e);
            }, this),
            this._processLayoutQueue(s));
      }),
      (d._getItemLayoutPosition = function () {
        return { x: 0, y: 0 };
      }),
      (d._processLayoutQueue = function (t) {
        this.updateStagger(),
          t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
          }, this);
      }),
      (d.updateStagger = function () {
        var t = this.options.stagger;
        return null == t
          ? void (this.stagger = 0)
          : ((this.stagger = (function (t) {
              if ("number" == typeof t) return t;
              var t = (e = t.match(/(^\d*\.?\d*)(\w*)/)) && e[1],
                e = e && e[2];
              return t.length ? (t = parseFloat(t)) * (p[e] || 1) : 0;
            })(t)),
            this.stagger);
      }),
      (d._positionItem = function (t, e, i, s, n) {
        s ? t.goTo(e, i) : (t.stagger(n * this.stagger), t.moveTo(e, i));
      }),
      (d._postLayout = function () {
        this.resizeContainer();
      }),
      (d.resizeContainer = function () {
        var t;
        !this._getOption("resizeContainer") ||
          ((t = this._getContainerSize()) &&
            (this._setContainerMeasure(t.width, !0),
            this._setContainerMeasure(t.height, !1)));
      }),
      (d._getContainerSize = i),
      (d._setContainerMeasure = function (t, e) {
        var i;
        void 0 !== t &&
          ((i = this.size).isBorderBox &&
            (t += e
              ? i.paddingLeft +
                i.paddingRight +
                i.borderLeftWidth +
                i.borderRightWidth
              : i.paddingBottom +
                i.paddingTop +
                i.borderTopWidth +
                i.borderBottomWidth),
          (t = Math.max(t, 0)),
          (this.element.style[e ? "width" : "height"] = t + "px"));
      }),
      (d._emitCompleteOnItems = function (e, t) {
        function i() {
          o.dispatchEvent(e + "Complete", null, [t]);
        }
        function s() {
          ++n == r && i();
        }
        var n,
          o = this,
          r = t.length;
        t && r
          ? ((n = 0),
            t.forEach(function (t) {
              t.once(e, s);
            }))
          : i();
      }),
      (d.dispatchEvent = function (t, e, i) {
        var s = e ? [e].concat(i) : i;
        this.emitEvent(t, s),
          c &&
            ((this.$element = this.$element || c(this.element)),
            e
              ? (((e = c.Event(e)).type = t), this.$element.trigger(e, i))
              : this.$element.trigger(t, i));
      }),
      (d.ignore = function (t) {
        t = this.getItem(t);
        t && (t.isIgnored = !0);
      }),
      (d.unignore = function (t) {
        t = this.getItem(t);
        t && delete t.isIgnored;
      }),
      (d.stamp = function (t) {
        (t = this._find(t)) &&
          ((this.stamps = this.stamps.concat(t)), t.forEach(this.ignore, this));
      }),
      (d.unstamp = function (t) {
        (t = this._find(t)) &&
          t.forEach(function (t) {
            s.removeFrom(this.stamps, t), this.unignore(t);
          }, this);
      }),
      (d._find = function (t) {
        if (t)
          return (
            "string" == typeof t && (t = this.element.querySelectorAll(t)),
            s.makeArray(t)
          );
      }),
      (d._manageStamps = function () {
        this.stamps &&
          this.stamps.length &&
          (this._getBoundingRect(),
          this.stamps.forEach(this._manageStamp, this));
      }),
      (d._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(),
          e = this.size;
        this._boundingRect = {
          left: t.left + e.paddingLeft + e.borderLeftWidth,
          top: t.top + e.paddingTop + e.borderTopWidth,
          right: t.right - (e.paddingRight + e.borderRightWidth),
          bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
        };
      }),
      (d._manageStamp = i),
      (d._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(),
          i = this._boundingRect,
          t = n(t);
        return {
          left: e.left - i.left - t.marginLeft,
          top: e.top - i.top - t.marginTop,
          right: i.right - e.right - t.marginRight,
          bottom: i.bottom - e.bottom - t.marginBottom,
        };
      }),
      (d.handleEvent = s.handleEvent),
      (d.bindResize = function () {
        t.addEventListener("resize", this), (this.isResizeBound = !0);
      }),
      (d.unbindResize = function () {
        t.removeEventListener("resize", this), (this.isResizeBound = !1);
      }),
      (d.onresize = function () {
        this.resize();
      }),
      s.debounceMethod(r, "onresize", 100),
      (d.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
      }),
      (d.needsResizeLayout = function () {
        var t = n(this.element);
        return this.size && t && t.innerWidth !== this.size.innerWidth;
      }),
      (d.addItems = function (t) {
        t = this._itemize(t);
        return t.length && (this.items = this.items.concat(t)), t;
      }),
      (d.appended = function (t) {
        t = this.addItems(t);
        t.length && (this.layoutItems(t, !0), this.reveal(t));
      }),
      (d.prepended = function (t) {
        var e = this._itemize(t);
        e.length &&
          ((t = this.items.slice(0)),
          (this.items = e.concat(t)),
          this._resetLayout(),
          this._manageStamps(),
          this.layoutItems(e, !0),
          this.reveal(e),
          this.layoutItems(t));
      }),
      (d.reveal = function (t) {
        var i;
        this._emitCompleteOnItems("reveal", t),
          t &&
            t.length &&
            ((i = this.updateStagger()),
            t.forEach(function (t, e) {
              t.stagger(e * i), t.reveal();
            }));
      }),
      (d.hide = function (t) {
        var i;
        this._emitCompleteOnItems("hide", t),
          t &&
            t.length &&
            ((i = this.updateStagger()),
            t.forEach(function (t, e) {
              t.stagger(e * i), t.hide();
            }));
      }),
      (d.revealItemElements = function (t) {
        t = this.getItems(t);
        this.reveal(t);
      }),
      (d.hideItemElements = function (t) {
        t = this.getItems(t);
        this.hide(t);
      }),
      (d.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
          var i = this.items[e];
          if (i.element == t) return i;
        }
      }),
      (d.getItems = function (t) {
        t = s.makeArray(t);
        var e = [];
        return (
          t.forEach(function (t) {
            t = this.getItem(t);
            t && e.push(t);
          }, this),
          e
        );
      }),
      (d.remove = function (t) {
        t = this.getItems(t);
        this._emitCompleteOnItems("remove", t),
          t &&
            t.length &&
            t.forEach(function (t) {
              t.remove(), s.removeFrom(this.items, t);
            }, this);
      }),
      (d.destroy = function () {
        var t = this.element.style;
        (t.height = ""),
          (t.position = ""),
          (t.width = ""),
          this.items.forEach(function (t) {
            t.destroy();
          }),
          this.unbindResize();
        t = this.element.outlayerGUID;
        delete h[t],
          delete this.element.outlayerGUID,
          c && c.removeData(this.element, this.constructor.namespace);
      }),
      (r.data = function (t) {
        t = (t = s.getQueryElement(t)) && t.outlayerGUID;
        return t && h[t];
      }),
      (r.create = function (t, e) {
        var i = a(r);
        return (
          (i.defaults = s.extend({}, r.defaults)),
          s.extend(i.defaults, e),
          (i.compatOptions = s.extend({}, r.compatOptions)),
          (i.namespace = t),
          (i.data = r.data),
          (i.Item = a(o)),
          s.htmlInit(i, t),
          c && c.bridget && c.bridget(t, i),
          i
        );
      });
    var p = { ms: 1, s: 1e3 };
    return (r.Item = o), r;
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/item", ["outlayer/outlayer"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer")))
      : ((t.Isotope = t.Isotope || {}), (t.Isotope.Item = e(t.Outlayer)));
  })(window, function (t) {
    "use strict";
    function e() {
      t.Item.apply(this, arguments);
    }
    var i = (e.prototype = Object.create(t.Item.prototype)),
      s = i._create;
    (i._create = function () {
      (this.id = this.layout.itemGUID++), s.call(this), (this.sortData = {});
    }),
      (i.updateSortData = function () {
        if (!this.isIgnored) {
          (this.sortData.id = this.id),
            (this.sortData["original-order"] = this.id),
            (this.sortData.random = Math.random());
          var t,
            e = this.layout.options.getSortData,
            i = this.layout._sorters;
          for (t in e) {
            var s = i[t];
            this.sortData[t] = s(this.element, this);
          }
        }
      });
    var n = i.destroy;
    return (
      (i.destroy = function () {
        n.apply(this, arguments), this.css({ display: "" });
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-mode",
          ["get-size/get-size", "outlayer/outlayer"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("get-size"), require("outlayer")))
      : ((t.Isotope = t.Isotope || {}),
        (t.Isotope.LayoutMode = e(t.getSize, t.Outlayer)));
  })(window, function (e, i) {
    "use strict";
    function s(t) {
      (this.isotope = t) &&
        ((this.options = t.options[this.namespace]),
        (this.element = t.element),
        (this.items = t.filteredItems),
        (this.size = t.size));
    }
    var n = s.prototype;
    return (
      [
        "_resetLayout",
        "_getItemLayoutPosition",
        "_manageStamp",
        "_getContainerSize",
        "_getElementOffset",
        "needsResizeLayout",
        "_getOption",
      ].forEach(function (t) {
        n[t] = function () {
          return i.prototype[t].apply(this.isotope, arguments);
        };
      }),
      (n.needsVerticalResizeLayout = function () {
        var t = e(this.isotope.element);
        return (
          this.isotope.size &&
          t &&
          t.innerHeight != this.isotope.size.innerHeight
        );
      }),
      (n._getMeasurement = function () {
        this.isotope._getMeasurement.apply(this, arguments);
      }),
      (n.getColumnWidth = function () {
        this.getSegmentSize("column", "Width");
      }),
      (n.getRowHeight = function () {
        this.getSegmentSize("row", "Height");
      }),
      (n.getSegmentSize = function (t, e) {
        var i = t + e,
          s = "outer" + e;
        this._getMeasurement(i, s),
          this[i] ||
            ((t = this.getFirstItemSize()),
            (this[i] = (t && t[s]) || this.isotope.size["inner" + e]));
      }),
      (n.getFirstItemSize = function () {
        var t = this.isotope.filteredItems[0];
        return t && t.element && e(t.element);
      }),
      (n.layout = function () {
        this.isotope.layout.apply(this.isotope, arguments);
      }),
      (n.getSize = function () {
        this.isotope.getSize(), (this.size = this.isotope.size);
      }),
      (s.modes = {}),
      (s.create = function (t, e) {
        function i() {
          s.apply(this, arguments);
        }
        return (
          ((i.prototype = Object.create(n)).constructor = i),
          e && (i.options = e),
          (s.modes[(i.prototype.namespace = t)] = i)
        );
      }),
      s
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "masonry-layout/masonry",
          ["outlayer/outlayer", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer"), require("get-size")))
      : (t.Masonry = e(t.Outlayer, t.getSize));
  })(window, function (t, a) {
    var e = t.create("masonry");
    e.compatOptions.fitWidth = "isFitWidth";
    t = e.prototype;
    return (
      (t._resetLayout = function () {
        this.getSize(),
          this._getMeasurement("columnWidth", "outerWidth"),
          this._getMeasurement("gutter", "outerWidth"),
          this.measureColumns(),
          (this.colYs = []);
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        (this.maxY = 0), (this.horizontalColIndex = 0);
      }),
      (t.measureColumns = function () {
        this.getContainerWidth(),
          this.columnWidth ||
            ((i = (e = this.items[0]) && e.element),
            (this.columnWidth = (i && a(i).outerWidth) || this.containerWidth));
        var t = (this.columnWidth += this.gutter),
          e = this.containerWidth + this.gutter,
          i = e / t,
          t = t - (e % t),
          i = Math[t && t < 1 ? "round" : "floor"](i);
        this.cols = Math.max(i, 1);
      }),
      (t.getContainerWidth = function () {
        var t = this._getOption("fitWidth")
            ? this.element.parentNode
            : this.element,
          t = a(t);
        this.containerWidth = t && t.innerWidth;
      }),
      (t._getItemLayoutPosition = function (t) {
        t.getSize();
        for (
          var e = t.size.outerWidth % this.columnWidth,
            i = Math[e && e < 1 ? "round" : "ceil"](
              t.size.outerWidth / this.columnWidth
            ),
            i = Math.min(i, this.cols),
            s = this[
              this.options.horizontalOrder
                ? "_getHorizontalColPosition"
                : "_getTopColPosition"
            ](i, t),
            e = { x: this.columnWidth * s.col, y: s.y },
            n = s.y + t.size.outerHeight,
            o = i + s.col,
            r = s.col;
          r < o;
          r++
        )
          this.colYs[r] = n;
        return e;
      }),
      (t._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t),
          t = Math.min.apply(Math, e);
        return { col: e.indexOf(t), y: t };
      }),
      (t._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, s = 0; s < i; s++)
          e[s] = this._getColGroupY(s, t);
        return e;
      }),
      (t._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        e = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, e);
      }),
      (t._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols,
          i = 1 < t && i + t > this.cols ? 0 : i,
          e = e.size.outerWidth && e.size.outerHeight;
        return (
          (this.horizontalColIndex = e ? i + t : this.horizontalColIndex),
          { col: i, y: this._getColGroupY(i, t) }
        );
      }),
      (t._manageStamp = function (t) {
        var e = a(t),
          i = this._getElementOffset(t),
          s = this._getOption("originLeft") ? i.left : i.right,
          t = s + e.outerWidth,
          s = Math.floor(s / this.columnWidth),
          s = Math.max(0, s),
          n = Math.floor(t / this.columnWidth);
        n -= t % this.columnWidth ? 0 : 1;
        for (
          var n = Math.min(this.cols - 1, n),
            o =
              (this._getOption("originTop") ? i.top : i.bottom) + e.outerHeight,
            r = s;
          r <= n;
          r++
        )
          this.colYs[r] = Math.max(o, this.colYs[r]);
      }),
      (t._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = { height: this.maxY };
        return (
          this._getOption("fitWidth") &&
            (t.width = this._getContainerFitWidth()),
          t
        );
      }),
      (t._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
        return (this.cols - t) * this.columnWidth - this.gutter;
      }),
      (t.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth;
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-modes/masonry",
          ["../layout-mode", "masonry-layout/masonry"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          require("../layout-mode"),
          require("masonry-layout")
        ))
      : e(t.Isotope.LayoutMode, t.Masonry);
  })(window, function (t, e) {
    "use strict";
    var i,
      t = t.create("masonry"),
      s = t.prototype,
      n = { _getElementOffset: !0, layout: !0, _getMeasurement: !0 };
    for (i in e.prototype) n[i] || (s[i] = e.prototype[i]);
    var o = s.measureColumns;
    s.measureColumns = function () {
      (this.items = this.isotope.filteredItems), o.call(this);
    };
    var r = s._getOption;
    return (
      (s._getOption = function (t) {
        return "fitWidth" == t
          ? void 0 !== this.options.isFitWidth
            ? this.options.isFitWidth
            : this.options.fitWidth
          : r.apply(this.isotope, arguments);
      }),
      t
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/fit-rows", ["../layout-mode"], e)
      : "object" == typeof exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("fitRows"),
      t = e.prototype;
    return (
      (t._resetLayout = function () {
        (this.x = 0),
          (this.y = 0),
          (this.maxY = 0),
          this._getMeasurement("gutter", "outerWidth");
      }),
      (t._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter,
          i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && ((this.x = 0), (this.y = this.maxY));
        i = { x: this.x, y: this.y };
        return (
          (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
          (this.x += e),
          i
        );
      }),
      (t._getContainerSize = function () {
        return { height: this.maxY };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/vertical", ["../layout-mode"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("vertical", { horizontalAlignment: 0 }),
      t = e.prototype;
    return (
      (t._resetLayout = function () {
        this.y = 0;
      }),
      (t._getItemLayoutPosition = function (t) {
        t.getSize();
        var e =
            (this.isotope.size.innerWidth - t.size.outerWidth) *
            this.options.horizontalAlignment,
          i = this.y;
        return (this.y += t.size.outerHeight), { x: e, y: i };
      }),
      (t._getContainerSize = function () {
        return { height: this.y };
      }),
      e
    );
  }),
  (function (r, a) {
    "function" == typeof define && define.amd
      ? define(
          [
            "outlayer/outlayer",
            "get-size/get-size",
            "desandro-matches-selector/matches-selector",
            "fizzy-ui-utils/utils",
            "isotope-layout/js/item",
            "isotope-layout/js/layout-mode",
            "isotope-layout/js/layout-modes/masonry",
            "isotope-layout/js/layout-modes/fit-rows",
            "isotope-layout/js/layout-modes/vertical",
          ],
          function (t, e, i, s, n, o) {
            return a(r, t, e, i, s, n, o);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = a(
          r,
          require("outlayer"),
          require("get-size"),
          require("desandro-matches-selector"),
          require("fizzy-ui-utils"),
          require("isotope-layout/js/item"),
          require("isotope-layout/js/layout-mode"),
          require("isotope-layout/js/layout-modes/masonry"),
          require("isotope-layout/js/layout-modes/fit-rows"),
          require("isotope-layout/js/layout-modes/vertical")
        ))
      : (r.Isotope = a(
          r,
          r.Outlayer,
          r.getSize,
          r.matchesSelector,
          r.fizzyUIUtils,
          r.Isotope.Item,
          r.Isotope.LayoutMode
        ));
  })(window, function (t, i, e, s, o, n, r) {
    var a = t.jQuery,
      l = String.prototype.trim
        ? function (t) {
            return t.trim();
          }
        : function (t) {
            return t.replace(/^\s+|\s+$/g, "");
          },
      c = i.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0,
      });
    (c.Item = n), (c.LayoutMode = r);
    n = c.prototype;
    (n._create = function () {
      for (var t in ((this.itemGUID = 0),
      (this._sorters = {}),
      this._getSorters(),
      i.prototype._create.call(this),
      (this.modes = {}),
      (this.filteredItems = this.items),
      (this.sortHistory = ["original-order"]),
      r.modes))
        this._initLayoutMode(t);
    }),
      (n.reloadItems = function () {
        (this.itemGUID = 0), i.prototype.reloadItems.call(this);
      }),
      (n._itemize = function () {
        for (
          var t = i.prototype._itemize.apply(this, arguments), e = 0;
          e < t.length;
          e++
        )
          t[e].id = this.itemGUID++;
        return this._updateItemsSortData(t), t;
      }),
      (n._initLayoutMode = function (t) {
        var e = r.modes[t],
          i = this.options[t] || {};
        (this.options[t] = e.options ? o.extend(e.options, i) : i),
          (this.modes[t] = new e(this));
      }),
      (n.layout = function () {
        return !this._isLayoutInited && this._getOption("initLayout")
          ? void this.arrange()
          : void this._layout();
      }),
      (n._layout = function () {
        var t = this._getIsInstant();
        this._resetLayout(),
          this._manageStamps(),
          this.layoutItems(this.filteredItems, t),
          (this._isLayoutInited = !0);
      }),
      (n.arrange = function (t) {
        this.option(t), this._getIsInstant();
        t = this._filter(this.items);
        (this.filteredItems = t.matches),
          this._bindArrangeComplete(),
          this._isInstant
            ? this._noTransition(this._hideReveal, [t])
            : this._hideReveal(t),
          this._sort(),
          this._layout();
      }),
      (n._init = n.arrange),
      (n._hideReveal = function (t) {
        this.reveal(t.needReveal), this.hide(t.needHide);
      }),
      (n._getIsInstant = function () {
        var t = this._getOption("layoutInstant"),
          t = void 0 !== t ? t : !this._isLayoutInited;
        return (this._isInstant = t);
      }),
      (n._bindArrangeComplete = function () {
        function t() {
          e &&
            i &&
            s &&
            n.dispatchEvent("arrangeComplete", null, [n.filteredItems]);
        }
        var e,
          i,
          s,
          n = this;
        this.once("layoutComplete", function () {
          (e = !0), t();
        }),
          this.once("hideComplete", function () {
            (i = !0), t();
          }),
          this.once("revealComplete", function () {
            (s = !0), t();
          });
      }),
      (n._filter = function (t) {
        for (
          var e = this.options.filter,
            i = [],
            s = [],
            n = [],
            o = this._getFilterTest((e = e || "*")),
            r = 0;
          r < t.length;
          r++
        ) {
          var a,
            l = t[r];
          l.isIgnored ||
            ((a = o(l)) && i.push(l),
            a && l.isHidden ? s.push(l) : a || l.isHidden || n.push(l));
        }
        return { matches: i, needReveal: s, needHide: n };
      }),
      (n._getFilterTest = function (e) {
        return a && this.options.isJQueryFiltering
          ? function (t) {
              return a(t.element).is(e);
            }
          : "function" == typeof e
          ? function (t) {
              return e(t.element);
            }
          : function (t) {
              return s(t.element, e);
            };
      }),
      (n.updateSortData = function (t) {
        t = t ? ((t = o.makeArray(t)), this.getItems(t)) : this.items;
        this._getSorters(), this._updateItemsSortData(t);
      }),
      (n._getSorters = function () {
        var t,
          e = this.options.getSortData;
        for (t in e) {
          var i = e[t];
          this._sorters[t] = u(i);
        }
      }),
      (n._updateItemsSortData = function (t) {
        for (var e = t && t.length, i = 0; e && i < e; i++)
          t[i].updateSortData();
      });
    var u = function (t) {
      if ("string" != typeof t) return t;
      var e,
        i,
        s = l(t).split(" "),
        n = s[0],
        t = (t = n.match(/^\[(.+)\]$/)) && t[1],
        o =
          ((i = n),
          (e = t)
            ? function (t) {
                return t.getAttribute(e);
              }
            : function (t) {
                t = t.querySelector(i);
                return t && t.textContent;
              }),
        r = c.sortDataParsers[s[1]];
      return r
        ? function (t) {
            return t && r(o(t));
          }
        : function (t) {
            return t && o(t);
          };
    };
    (c.sortDataParsers = {
      parseInt: function (t) {
        return parseInt(t, 10);
      },
      parseFloat: function (t) {
        return parseFloat(t);
      },
    }),
      (n._sort = function () {
        var t, r, a;
        this.options.sortBy &&
          ((t = o.makeArray(this.options.sortBy)),
          this._getIsSameSortBy(t) ||
            (this.sortHistory = t.concat(this.sortHistory)),
          (r = this.sortHistory),
          (a = this.options.sortAscending),
          this.filteredItems.sort(function (t, e) {
            for (var i = 0; i < r.length; i++) {
              var s = r[i],
                n = t.sortData[s],
                o = e.sortData[s];
              if (o < n || n < o)
                return (
                  (o < n ? 1 : -1) * ((void 0 !== a[s] ? a[s] : a) ? 1 : -1)
                );
            }
            return 0;
          }));
      }),
      (n._getIsSameSortBy = function (t) {
        for (var e = 0; e < t.length; e++)
          if (t[e] != this.sortHistory[e]) return !1;
        return !0;
      }),
      (n._mode = function () {
        var t = this.options.layoutMode,
          e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return (e.options = this.options[t]), e;
      }),
      (n._resetLayout = function () {
        i.prototype._resetLayout.call(this), this._mode()._resetLayout();
      }),
      (n._getItemLayoutPosition = function (t) {
        return this._mode()._getItemLayoutPosition(t);
      }),
      (n._manageStamp = function (t) {
        this._mode()._manageStamp(t);
      }),
      (n._getContainerSize = function () {
        return this._mode()._getContainerSize();
      }),
      (n.needsResizeLayout = function () {
        return this._mode().needsResizeLayout();
      }),
      (n.appended = function (t) {
        t = this.addItems(t);
        t.length &&
          ((t = this._filterRevealAdded(t)),
          (this.filteredItems = this.filteredItems.concat(t)));
      }),
      (n.prepended = function (t) {
        var e = this._itemize(t);
        e.length &&
          (this._resetLayout(),
          this._manageStamps(),
          (t = this._filterRevealAdded(e)),
          this.layoutItems(this.filteredItems),
          (this.filteredItems = t.concat(this.filteredItems)),
          (this.items = e.concat(this.items)));
      }),
      (n._filterRevealAdded = function (t) {
        t = this._filter(t);
        return (
          this.hide(t.needHide),
          this.reveal(t.matches),
          this.layoutItems(t.matches, !0),
          t.matches
        );
      }),
      (n.insert = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          for (var i, s = e.length, n = 0; n < s; n++)
            (i = e[n]), this.element.appendChild(i.element);
          t = this._filter(e).matches;
          for (n = 0; n < s; n++) e[n].isLayoutInstant = !0;
          for (this.arrange(), n = 0; n < s; n++) delete e[n].isLayoutInstant;
          this.reveal(t);
        }
      });
    var h = n.remove;
    return (
      (n.remove = function (t) {
        t = o.makeArray(t);
        var e = this.getItems(t);
        h.call(this, t);
        for (var i = e && e.length, s = 0; i && s < i; s++) {
          var n = e[s];
          o.removeFrom(this.filteredItems, n);
        }
      }),
      (n.shuffle = function () {
        for (var t = 0; t < this.items.length; t++)
          this.items[t].sortData.random = Math.random();
        (this.options.sortBy = "random"), this._sort(), this._layout();
      }),
      (n._noTransition = function (t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        e = t.apply(this, e);
        return (this.options.transitionDuration = i), e;
      }),
      (n.getFilteredItemElements = function () {
        return this.filteredItems.map(function (t) {
          return t.element;
        });
      }),
      c
    );
  });
class DoubleCenterException {
  constructor() {
    window.console.error(
      'iTooltip Error: positionX and positionY properties cannot be "center" at the same time.'
    );
  }
}
class iTooltip {
  constructor(t = "*") {
    this.objects = document.querySelectorAll("*" !== t ? t : "*[title]");
  }
  init(t = {}) {
    if (
      ((this.settings = Object.assign(
        {
          className: "tooltip",
          indentX: 10,
          indentY: 15,
          positionX: "right",
          positionY: "bottom",
        },
        t
      )),
      "center" === this.settings.positionX &&
        "center" === this.settings.positionY)
    )
      throw new DoubleCenterException();
    this.objects.forEach((t) => {
      t.getAttribute("title") &&
        (t.addEventListener("mouseenter", (t) => this.createTooltip(t)),
        t.addEventListener("mouseleave", (t) => this.removeTooltip(t)));
    });
  }
  createTooltip(t) {
    const e = t.target;
    (this.tooltip = document.createElement("div")),
      this.tooltip.classList.add(this.settings.className),
      (this.tooltip.innerHTML = e.getAttribute("title"));
    var i = t.target.className
      .split(" ")
      .find((t) => t.startsWith("itooltip-"));
    i && this.tooltip.classList.add(i),
      (this.tooltip.style.position = "absolute"),
      this.changePosition(t),
      e.removeAttribute("title"),
      document.body.appendChild(this.tooltip),
      e.addEventListener("mousemove", (t) => this.changePosition(t));
  }
  removeTooltip(t) {
    t.target.setAttribute("title", this.tooltip.innerHTML),
      this.tooltip.remove();
  }
  changePosition(t) {
    var [e, i] = this.getSizeTooltip(),
      s = this.getEdges(t),
      n = window.pageYOffset || document.documentElement.scrollTop;
    let o = t.pageY,
      r;
    if (
      ((r =
        "right" === this.settings.positionX
          ? s.right <= e
            ? t.clientX - e - this.settings.indentX
            : t.clientX + this.settings.indentX
          : "left" === this.settings.positionX
          ? s.left <= e
            ? s.left + this.settings.indentX
            : t.clientX - e - this.settings.indentX
          : s.left <= Math.round(e / 2)
          ? t.clientX - s.left
          : t.clientX - Math.round(e / 2)),
      "top" === this.settings.positionY)
    )
      o =
        s.top <= i
          ? n + t.clientY + this.settings.indentY
          : t.pageY - i - this.settings.indentY;
    else if ("bottom" === this.settings.positionY)
      o =
        s.bottom < i && s.top > i + this.settings.indentY
          ? t.pageY - i - this.settings.indentY
          : n + t.clientY + this.settings.indentY;
    else {
      let t = Math.round(i / 2);
      s.bottom <= t && (t = Math.round(i - s.bottom)),
        s.top <= t && (t = s.top),
        (o -= t);
    }
    (this.tooltip.style.top = `${o}px`), (this.tooltip.style.left = `${r}px`);
  }
  getSizeTooltip() {
    var t = this.tooltip.getBoundingClientRect();
    return [t.right - t.left, t.bottom - t.top];
  }
  getEdges(t) {
    var e = document.documentElement;
    return {
      left: t.clientX,
      right: e.clientWidth - t.clientX,
      top: t.clientY,
      bottom: e.clientHeight - t.clientY,
    };
  }
}
!(function (a) {
  a.fn.hmbrgr = function (t) {
    function n(t) {
      a(t).data("clickable", !0).find("span").eq(0).css({ top: i }),
        a(t).find("span").eq(1).css({ top: r }),
        a(t).find("span").eq(2).css({ top: s });
    }
    function e(s) {
      a(s).on("click", function (t) {
        var e, i;
        t.preventDefault(),
          a(this).data("clickable") &&
            (a(this).data("clickable", !1),
            a(s).toggleClass("cross"),
            a(s).hasClass("cross")
              ? (a((i = s))
                  .find("span")
                  .css({ top: r }),
                setTimeout(function () {
                  a(i).addClass(o.animation).data("clickable", !0),
                    a.isFunction(o.onOpen) && o.onOpen.call(this);
                }, o.speed))
              : (a((e = s)).removeClass(o.animation),
                setTimeout(function () {
                  n(e), a.isFunction(o.onClose) && o.onClose.call(this);
                }, o.speed)));
      });
    }
    var o = a.extend(
        {
          width: 60,
          height: 50,
          speed: 200,
          barHeight: 8,
          barRadius: 0,
          barColor: "#ffffff",
          animation: "expand",
          onInit: null,
          onOpen: null,
          onClose: null,
        },
        t
      ),
      i = 0,
      r = o.height / 2 - o.barHeight / 2,
      s = o.height - o.barHeight;
    return this.each(function () {
      (function (t) {
        a(t)
          .css({ width: o.width, height: o.height })
          .html("<span /><span /><span />")
          .find("span")
          .css({
            position: "absolute",
            width: "100%",
            height: o.barHeight,
            "border-radius": o.barRadius,
            "background-color": o.barColor,
            "transition-duration": o.speed + "ms",
          }),
          n(t),
          a.isFunction(o.onInit) && o.onInit.call(this);
      })(this),
        e(this);
    });
  };
})(jQuery),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t)
      : t(jQuery);
  })(function (l) {
    var c,
      u,
      t = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
      e =
        "onwheel" in window.document || 9 <= window.document.documentMode
          ? ["wheel"]
          : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
      h = Array.prototype.slice;
    if (l.event.fixHooks)
      for (var i = t.length; i; ) l.event.fixHooks[t[--i]] = l.event.mouseHooks;
    var d = (l.event.special.mousewheel = {
      version: "3.1.12",
      setup: function () {
        if (this.addEventListener)
          for (var t = e.length; t; ) this.addEventListener(e[--t], s, !1);
        else this.onmousewheel = s;
        l.data(this, "mousewheel-line-height", d.getLineHeight(this)),
          l.data(this, "mousewheel-page-height", d.getPageHeight(this));
      },
      teardown: function () {
        if (this.removeEventListener)
          for (var t = e.length; t; ) this.removeEventListener(e[--t], s, !1);
        else this.onmousewheel = null;
        l.removeData(this, "mousewheel-line-height"),
          l.removeData(this, "mousewheel-page-height");
      },
      getLineHeight: function (t) {
        var e = l(t);
        return (
          (t = e["offsetParent" in l.fn ? "offsetParent" : "parent"]())
            .length || (t = l("body")),
          parseInt(t.css("fontSize"), 10) ||
            parseInt(e.css("fontSize"), 10) ||
            16
        );
      },
      getPageHeight: function (t) {
        return l(t).height();
      },
      settings: { adjustOldDeltas: !0, normalizeOffset: !0 },
    });
    function s(t) {
      var e,
        i = t || window.event,
        s = h.call(arguments, 1),
        n = 0,
        o = 0,
        r = 0,
        a = 0;
      if (
        (((t = l.event.fix(i)).type = "mousewheel"),
        "detail" in i && (r = -1 * i.detail),
        "wheelDelta" in i && (r = i.wheelDelta),
        "wheelDeltaY" in i && (r = i.wheelDeltaY),
        "wheelDeltaX" in i && (o = -1 * i.wheelDeltaX),
        "axis" in i && i.axis === i.HORIZONTAL_AXIS && ((o = -1 * r), (r = 0)),
        (n = 0 === r ? o : r),
        "deltaY" in i && (n = r = -1 * i.deltaY),
        "deltaX" in i && ((o = i.deltaX), 0 === r && (n = -1 * o)),
        0 !== r || 0 !== o)
      )
        return (
          1 === i.deltaMode
            ? ((n *= e = l.data(this, "mousewheel-line-height")),
              (r *= e),
              (o *= e))
            : 2 === i.deltaMode &&
              ((n *= e = l.data(this, "mousewheel-page-height")),
              (r *= e),
              (o *= e)),
          (a = Math.max(Math.abs(r), Math.abs(o))),
          (!u || a < u) && m(i, (u = a)) && (u /= 40),
          m(i, a) && ((n /= 40), (o /= 40), (r /= 40)),
          (n = Math[1 <= n ? "floor" : "ceil"](n / u)),
          (o = Math[1 <= o ? "floor" : "ceil"](o / u)),
          (r = Math[1 <= r ? "floor" : "ceil"](r / u)),
          d.settings.normalizeOffset &&
            this.getBoundingClientRect &&
            ((a = this.getBoundingClientRect()),
            (t.offsetX = t.clientX - a.left),
            (t.offsetY = t.clientY - a.top)),
          (t.deltaX = o),
          (t.deltaY = r),
          (t.deltaFactor = u),
          (t.deltaMode = 0),
          s.unshift(t, n, o, r),
          c && window.clearTimeout(c),
          (c = window.setTimeout(p, 200)),
          (l.event.dispatch || l.event.handle).apply(this, s)
        );
    }
    function p() {
      u = null;
    }
    function m(t, e) {
      return (
        d.settings.adjustOldDeltas && "mousewheel" === t.type && e % 120 == 0
      );
    }
    l.fn.extend({
      mousewheel: function (t) {
        return t ? this.on("mousewheel", t) : this.trigger("mousewheel");
      },
      unmousewheel: function (t) {
        return this.off("mousewheel", t);
      },
    });
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof module && "object" == typeof module.exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function ($) {
    function initMouseDetection(t) {
      var o,
        r,
        e = ".smartmenus_mouse";
      mouseDetectionEnabled || t
        ? mouseDetectionEnabled &&
          t &&
          ($(document).off(e), (mouseDetectionEnabled = !1))
        : ((o = !0),
          (r = null),
          ((t = {
            mousemove: function (t) {
              var e,
                i,
                s,
                n = { x: t.pageX, y: t.pageY, timeStamp: new Date().getTime() };
              r &&
                ((e = Math.abs(r.x - n.x)),
                (i = Math.abs(r.y - n.y)),
                (0 < e || 0 < i) &&
                  e <= 4 &&
                  i <= 4 &&
                  n.timeStamp - r.timeStamp <= 300 &&
                  ((mouse = !0), o) &&
                  ((s = $(t.target).closest("a")).is("a") &&
                    $.each(menuTrees, function () {
                      return $.contains(this.$root[0], s[0])
                        ? (this.itemEnter({ currentTarget: s[0] }), !1)
                        : void 0;
                    }),
                  (o = !1))),
                (r = n);
            },
          })[
            touchEvents
              ? "touchstart"
              : "pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut"
          ] = function (t) {
            isTouchEvent(t.originalEvent) && (mouse = !1);
          }),
          $(document).on(getEventsNS(t, e)),
          (mouseDetectionEnabled = !0));
    }
    function isTouchEvent(t) {
      return !/^(4|mouse)$/.test(t.pointerType);
    }
    function getEventsNS(t, e) {
      e = e || "";
      var i,
        s = {};
      for (i in t) s[i.split(" ").join(e + " ") + e] = t[i];
      return s;
    }
    var menuTrees = [],
      mouse = !1,
      touchEvents = "ontouchstart" in window,
      mouseDetectionEnabled = !1,
      requestAnimationFrame =
        window.requestAnimationFrame ||
        function (t) {
          return setTimeout(t, 1e3 / 60);
        },
      cancelAnimationFrame =
        window.cancelAnimationFrame ||
        function (t) {
          clearTimeout(t);
        },
      canAnimate = !!$.fn.animate;
    return (
      ($.SmartMenus = function (t, e) {
        (this.$root = $(t)),
          (this.opts = e),
          (this.rootId = ""),
          (this.accessIdPrefix = ""),
          (this.$subArrow = null),
          (this.activatedItems = []),
          (this.visibleSubMenus = []),
          (this.showTimeout = 0),
          (this.hideTimeout = 0),
          (this.scrollTimeout = 0),
          (this.clickActivated = !1),
          (this.focusActivated = !1),
          (this.zIndexInc = 0),
          (this.idInc = 0),
          (this.$firstLink = null),
          (this.$firstSub = null),
          (this.disabled = !1),
          (this.$disableOverlay = null),
          (this.$touchScrollingSub = null),
          (this.cssTransforms3d =
            "perspective" in t.style || "webkitPerspective" in t.style),
          (this.wasCollapsible = !1),
          this.init();
      }),
      $.extend($.SmartMenus, {
        hideAll: function () {
          $.each(menuTrees, function () {
            this.menuHideAll();
          });
        },
        destroy: function () {
          for (; menuTrees.length; ) menuTrees[0].destroy();
          initMouseDetection(!0);
        },
        prototype: {
          init: function (t) {
            var i,
              s,
              n,
              o = this;
            t ||
              (menuTrees.push(this),
              (this.rootId = (
                new Date().getTime() +
                Math.random() +
                ""
              ).replace(/\D/g, "")),
              (this.accessIdPrefix = "sm-" + this.rootId + "-"),
              this.$root.hasClass("sm-rtl") &&
                (this.opts.rightToLeftSubMenus = !0),
              (t = ".smartmenus"),
              this.$root
                .data("smartmenus", this)
                .attr("data-smartmenus-id", this.rootId)
                .dataSM("level", 1)
                .on(
                  getEventsNS(
                    {
                      "mouseover focusin": $.proxy(this.rootOver, this),
                      "mouseout focusout": $.proxy(this.rootOut, this),
                      keydown: $.proxy(this.rootKeyDown, this),
                    },
                    ".smartmenus"
                  )
                )
                .on(
                  getEventsNS(
                    {
                      mouseenter: $.proxy(this.itemEnter, this),
                      mouseleave: $.proxy(this.itemLeave, this),
                      mousedown: $.proxy(this.itemDown, this),
                      focus: $.proxy(this.itemFocus, this),
                      blur: $.proxy(this.itemBlur, this),
                      click: $.proxy(this.itemClick, this),
                    },
                    ".smartmenus"
                  ),
                  "a"
                ),
              (t += this.rootId),
              this.opts.hideOnClick &&
                $(document).on(
                  getEventsNS(
                    {
                      touchstart: $.proxy(this.docTouchStart, this),
                      touchmove: $.proxy(this.docTouchMove, this),
                      touchend: $.proxy(this.docTouchEnd, this),
                      click: $.proxy(this.docClick, this),
                    },
                    t
                  )
                ),
              $(window).on(
                getEventsNS(
                  { "resize orientationchange": $.proxy(this.winResize, this) },
                  t
                )
              ),
              this.opts.subIndicators &&
                ((this.$subArrow = $("<span/>").addClass("sub-arrow")),
                this.opts.subIndicatorsText &&
                  this.$subArrow.html(this.opts.subIndicatorsText)),
              initMouseDetection()),
              (this.$firstSub = this.$root
                .find("ul")
                .each(function () {
                  o.menuInit($(this));
                })
                .eq(0)),
              (this.$firstLink = this.$root.find("a").eq(0)),
              this.opts.markCurrentItem &&
                ((i = /(index|default)\.[^#\?\/]*/i),
                (s = window.location.href.replace(i, "")),
                (n = s.replace(/#.*/, "")),
                this.$root.find("a:not(.mega-menu a)").each(function () {
                  var t = this.href.replace(i, ""),
                    e = $(this);
                  (t != s && t != n) ||
                    (e.addClass("current"),
                    o.opts.markCurrentTree &&
                      e
                        .parentsUntil("[data-smartmenus-id]", "ul")
                        .each(function () {
                          $(this).dataSM("parent-a").addClass("current");
                        }));
                })),
              (this.wasCollapsible = this.isCollapsible());
          },
          destroy: function (t) {
            var e;
            t ||
              ((e = ".smartmenus"),
              this.$root
                .removeData("smartmenus")
                .removeAttr("data-smartmenus-id")
                .removeDataSM("level")
                .off(".smartmenus"),
              (e += this.rootId),
              $(document).off(e),
              $(window).off(e),
              this.opts.subIndicators && (this.$subArrow = null)),
              this.menuHideAll();
            var i = this;
            this.$root
              .find("ul")
              .each(function () {
                var t = $(this);
                t.dataSM("scroll-arrows") && t.dataSM("scroll-arrows").remove(),
                  t.dataSM("shown-before") &&
                    ((i.opts.subMenusMinWidth || i.opts.subMenusMaxWidth) &&
                      t
                        .css({ width: "", minWidth: "", maxWidth: "" })
                        .removeClass("sm-nowrap"),
                    t.dataSM("scroll-arrows") &&
                      t.dataSM("scroll-arrows").remove(),
                    t.css({
                      zIndex: "",
                      top: "",
                      left: "",
                      marginLeft: "",
                      marginTop: "",
                      display: "",
                    })),
                  0 == (t.attr("id") || "").indexOf(i.accessIdPrefix) &&
                    t.removeAttr("id");
              })
              .removeDataSM("in-mega")
              .removeDataSM("shown-before")
              .removeDataSM("scroll-arrows")
              .removeDataSM("parent-a")
              .removeDataSM("level")
              .removeDataSM("beforefirstshowfired")
              .removeAttr("role")
              .removeAttr("aria-hidden")
              .removeAttr("aria-labelledby")
              .removeAttr("aria-expanded"),
              this.$root
                .find("a.has-submenu")
                .each(function () {
                  var t = $(this);
                  0 == t.attr("id").indexOf(i.accessIdPrefix) &&
                    t.removeAttr("id");
                })
                .removeClass("has-submenu")
                .removeDataSM("sub")
                .removeAttr("aria-haspopup")
                .removeAttr("aria-controls")
                .removeAttr("aria-expanded")
                .closest("li")
                .removeDataSM("sub"),
              this.opts.subIndicators &&
                this.$root.find("span.sub-arrow").remove(),
              this.opts.markCurrentItem &&
                this.$root.find("a.current").removeClass("current"),
              t ||
                ((this.$root = null),
                (this.$firstLink = null),
                (this.$firstSub = null),
                this.$disableOverlay &&
                  (this.$disableOverlay.remove(),
                  (this.$disableOverlay = null)),
                menuTrees.splice($.inArray(this, menuTrees), 1));
          },
          disable: function (t) {
            this.disabled ||
              (this.menuHideAll(),
              t ||
                this.opts.isPopup ||
                !this.$root.is(":visible") ||
                ((t = this.$root.offset()),
                (this.$disableOverlay = $(
                  '<div class="sm-jquery-disable-overlay"/>'
                )
                  .css({
                    position: "absolute",
                    top: t.top,
                    left: t.left,
                    width: this.$root.outerWidth(),
                    height: this.$root.outerHeight(),
                    zIndex: this.getStartZIndex(!0),
                    opacity: 0,
                  })
                  .appendTo(document.body))),
              (this.disabled = !0));
          },
          docClick: function (t) {
            return this.$touchScrollingSub
              ? void (this.$touchScrollingSub = null)
              : void (
                  ((this.visibleSubMenus.length &&
                    !$.contains(this.$root[0], t.target)) ||
                    $(t.target).closest("a").length) &&
                  this.menuHideAll()
                );
          },
          docTouchEnd: function () {
            var t;
            this.lastTouch &&
              (!this.visibleSubMenus.length ||
                (void 0 !== this.lastTouch.x2 &&
                  this.lastTouch.x1 != this.lastTouch.x2) ||
                (void 0 !== this.lastTouch.y2 &&
                  this.lastTouch.y1 != this.lastTouch.y2) ||
                (this.lastTouch.target &&
                  $.contains(this.$root[0], this.lastTouch.target)) ||
                (this.hideTimeout &&
                  (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
                ((t = this).hideTimeout = setTimeout(function () {
                  t.menuHideAll();
                }, 350))),
              (this.lastTouch = null));
          },
          docTouchMove: function (t) {
            this.lastTouch &&
              ((t = t.originalEvent.touches[0]),
              (this.lastTouch.x2 = t.pageX),
              (this.lastTouch.y2 = t.pageY));
          },
          docTouchStart: function (t) {
            t = t.originalEvent.touches[0];
            this.lastTouch = { x1: t.pageX, y1: t.pageY, target: t.target };
          },
          enable: function () {
            this.disabled &&
              (this.$disableOverlay &&
                (this.$disableOverlay.remove(), (this.$disableOverlay = null)),
              (this.disabled = !1));
          },
          getClosestMenu: function (t) {
            for (var e = $(t).closest("ul"); e.dataSM("in-mega"); )
              e = e.parent().closest("ul");
            return e[0] || null;
          },
          getHeight: function (t) {
            return this.getOffset(t, !0);
          },
          getOffset: function (t, e) {
            var i;
            "none" == t.css("display") &&
              ((i = {
                position: t[0].style.position,
                visibility: t[0].style.visibility,
              }),
              t.css({ position: "absolute", visibility: "hidden" }).show());
            var s = t[0].getBoundingClientRect && t[0].getBoundingClientRect(),
              s =
                s &&
                (e
                  ? s.height || s.bottom - s.top
                  : s.width || s.right - s.left);
            return (
              s || 0 === s || (s = e ? t[0].offsetHeight : t[0].offsetWidth),
              i && t.hide().css(i),
              s
            );
          },
          getStartZIndex: function (t) {
            var e = parseInt(this[t ? "$root" : "$firstSub"].css("z-index"));
            return (
              !t && isNaN(e) && (e = parseInt(this.$root.css("z-index"))),
              isNaN(e) ? 1 : e
            );
          },
          getTouchPoint: function (t) {
            return (
              (t.touches && t.touches[0]) ||
              (t.changedTouches && t.changedTouches[0]) ||
              t
            );
          },
          getViewport: function (t) {
            var e = t ? "Height" : "Width",
              t = document.documentElement["client" + e],
              e = window["inner" + e];
            return (t = e ? Math.min(t, e) : t);
          },
          getViewportHeight: function () {
            return this.getViewport(!0);
          },
          getViewportWidth: function () {
            return this.getViewport();
          },
          getWidth: function (t) {
            return this.getOffset(t);
          },
          handleEvents: function () {
            return !this.disabled && this.isCSSOn();
          },
          handleItemEvents: function (t) {
            return this.handleEvents() && !this.isLinkInMegaMenu(t);
          },
          isCollapsible: function () {
            return "static" == this.$firstSub.css("position");
          },
          isCSSOn: function () {
            return "inline" != this.$firstLink;
          },
          isFixed: function () {
            var t = "fixed" == this.$root.css("position");
            return (
              t ||
                this.$root.parentsUntil("body").each(function () {
                  return "fixed" == $(this).css("position")
                    ? !(t = !0)
                    : void 0;
                }),
              t
            );
          },
          isLinkInMegaMenu: function (t) {
            return $(this.getClosestMenu(t[0])).hasClass("mega-menu");
          },
          isTouchMode: function () {
            return !mouse || this.opts.noMouseOver || this.isCollapsible();
          },
          itemActivate: function (t, e) {
            var i,
              s,
              n = t.closest("ul"),
              o = n.dataSM("level");
            1 < o &&
              (!this.activatedItems[o - 2] ||
                this.activatedItems[o - 2][0] != n.dataSM("parent-a")[0]) &&
              ((i = this),
              $(n.parentsUntil("[data-smartmenus-id]", "ul").get().reverse())
                .add(n)
                .each(function () {
                  i.itemActivate($(this).dataSM("parent-a"));
                })),
              (this.isCollapsible() && !e) ||
                this.menuHideSubMenus(
                  this.activatedItems[o - 1] &&
                    this.activatedItems[o - 1][0] == t[0]
                    ? o
                    : o - 1
                ),
              (this.activatedItems[o - 1] = t),
              !1 !== this.$root.triggerHandler("activate.smapi", t[0]) &&
                (s = t.dataSM("sub")) &&
                (this.isTouchMode() ||
                  !this.opts.showOnClick ||
                  this.clickActivated) &&
                this.menuShow(s);
          },
          itemBlur: function (t) {
            t = $(t.currentTarget);
            this.handleItemEvents(t) &&
              this.$root.triggerHandler("blur.smapi", t[0]);
          },
          itemClick: function (t) {
            var e = $(t.currentTarget);
            if (this.handleItemEvents(e)) {
              if (
                this.$touchScrollingSub &&
                this.$touchScrollingSub[0] == e.closest("ul")[0]
              )
                return (
                  (this.$touchScrollingSub = null), t.stopPropagation(), !1
                );
              if (!1 === this.$root.triggerHandler("click.smapi", e[0]))
                return !1;
              var i = e.dataSM("sub"),
                s = !!i && 2 == i.dataSM("level");
              if (i) {
                var n = $(t.target).is(".sub-arrow"),
                  o = this.isCollapsible(),
                  r = /toggle$/.test(this.opts.collapsibleBehavior),
                  a = /link$/.test(this.opts.collapsibleBehavior),
                  t = /^accordion/.test(this.opts.collapsibleBehavior);
                if (i.is(":visible")) {
                  if (!o && this.opts.showOnClick && s)
                    return (
                      this.menuHide(i),
                      (this.clickActivated = !1),
                      (this.focusActivated = !1)
                    );
                  if (o && (r || n))
                    return this.itemActivate(e, t), this.menuHide(i), !1;
                } else if (
                  (!a || !o || n) &&
                  (!o &&
                    this.opts.showOnClick &&
                    s &&
                    (this.clickActivated = !0),
                  this.itemActivate(e, t),
                  i.is(":visible"))
                )
                  return !(this.focusActivated = !0);
              }
              return (
                !(
                  (!o && this.opts.showOnClick && s) ||
                  e.hasClass("disabled") ||
                  !1 === this.$root.triggerHandler("select.smapi", e[0])
                ) && void 0
              );
            }
          },
          itemDown: function (t) {
            t = $(t.currentTarget);
            this.handleItemEvents(t) && t.dataSM("mousedown", !0);
          },
          itemEnter: function (t) {
            var e,
              i = $(t.currentTarget);
            this.handleItemEvents(i) &&
              (this.isTouchMode() ||
                (this.showTimeout &&
                  (clearTimeout(this.showTimeout), (this.showTimeout = 0)),
                ((e = this).showTimeout = setTimeout(
                  function () {
                    e.itemActivate(i);
                  },
                  this.opts.showOnClick && 1 == i.closest("ul").dataSM("level")
                    ? 1
                    : this.opts.showTimeout
                ))),
              this.$root.triggerHandler("mouseenter.smapi", i[0]));
          },
          itemFocus: function (t) {
            t = $(t.currentTarget);
            this.handleItemEvents(t) &&
              (!this.focusActivated ||
                (this.isTouchMode() && t.dataSM("mousedown")) ||
                (this.activatedItems.length &&
                  this.activatedItems[this.activatedItems.length - 1][0] ==
                    t[0]) ||
                this.itemActivate(t, !0),
              this.$root.triggerHandler("focus.smapi", t[0]));
          },
          itemLeave: function (t) {
            t = $(t.currentTarget);
            this.handleItemEvents(t) &&
              (this.isTouchMode() ||
                (t[0].blur(),
                this.showTimeout &&
                  (clearTimeout(this.showTimeout), (this.showTimeout = 0))),
              t.removeDataSM("mousedown"),
              this.$root.triggerHandler("mouseleave.smapi", t[0]));
          },
          menuHide: function (t) {
            var e;
            !1 !== this.$root.triggerHandler("beforehide.smapi", t[0]) &&
              (canAnimate && t.stop(!0, !0), "none" != t.css("display")) &&
              ((e = function () {
                t.css("z-index", "");
              }),
              this.isCollapsible()
                ? canAnimate && this.opts.collapsibleHideFunction
                  ? this.opts.collapsibleHideFunction.call(this, t, e)
                  : t.hide(this.opts.collapsibleHideDuration, e)
                : canAnimate && this.opts.hideFunction
                ? this.opts.hideFunction.call(this, t, e)
                : t.hide(this.opts.hideDuration, e),
              t.dataSM("scroll") &&
                (this.menuScrollStop(t),
                t
                  .css({
                    "touch-action": "",
                    "-ms-touch-action": "",
                    "-webkit-transform": "",
                    transform: "",
                  })
                  .off(".smartmenus_scroll")
                  .removeDataSM("scroll")
                  .dataSM("scroll-arrows")
                  .hide()),
              t
                .dataSM("parent-a")
                .removeClass("highlighted")
                .attr("aria-expanded", "false"),
              t.attr({ "aria-expanded": "false", "aria-hidden": "true" }),
              (e = t.dataSM("level")),
              this.activatedItems.splice(e - 1, 1),
              this.visibleSubMenus.splice(
                $.inArray(t, this.visibleSubMenus),
                1
              ),
              this.$root.triggerHandler("hide.smapi", t[0]));
          },
          menuHideAll: function () {
            this.showTimeout &&
              (clearTimeout(this.showTimeout), (this.showTimeout = 0));
            for (
              var t = this.opts.isPopup ? 1 : 0,
                e = this.visibleSubMenus.length - 1;
              t <= e;
              e--
            )
              this.menuHide(this.visibleSubMenus[e]);
            this.opts.isPopup &&
              (canAnimate && this.$root.stop(!0, !0),
              this.$root.is(":visible") &&
                (canAnimate && this.opts.hideFunction
                  ? this.opts.hideFunction.call(this, this.$root)
                  : this.$root.hide(this.opts.hideDuration))),
              (this.activatedItems = []),
              (this.visibleSubMenus = []),
              (this.clickActivated = !1),
              (this.focusActivated = !1),
              (this.zIndexInc = 0),
              this.$root.triggerHandler("hideAll.smapi");
          },
          menuHideSubMenus: function (t) {
            for (var e = this.activatedItems.length - 1; t <= e; e--) {
              var i = this.activatedItems[e].dataSM("sub");
              i && this.menuHide(i);
            }
          },
          menuInit: function (t) {
            if (!t.dataSM("in-mega")) {
              t.hasClass("mega-menu") && t.find("ul").dataSM("in-mega", !0);
              for (
                var e = 2, i = t[0];
                (i = i.parentNode) != this.$root[0];

              )
                e++;
              var s = t.prevAll("a").eq(-1);
              (s = !s.length ? t.prevAll().find("a").eq(-1) : s)
                .addClass("has-submenu")
                .dataSM("sub", t),
                t
                  .dataSM("parent-a", s)
                  .dataSM("level", e)
                  .parent()
                  .dataSM("sub", t);
              var n = s.attr("id") || this.accessIdPrefix + ++this.idInc,
                o = t.attr("id") || this.accessIdPrefix + ++this.idInc;
              s.attr({
                id: n,
                "aria-haspopup": "true",
                "aria-controls": o,
                "aria-expanded": "false",
              }),
                t.attr({
                  id: o,
                  role: "group",
                  "aria-hidden": "true",
                  "aria-labelledby": n,
                  "aria-expanded": "false",
                }),
                this.opts.subIndicators &&
                  s[this.opts.subIndicatorsPos](this.$subArrow.clone());
            }
          },
          menuPosition: function (e) {
            var t,
              i,
              s = e.dataSM("parent-a"),
              n = s.closest("li"),
              o = n.parent(),
              r = e.dataSM("level"),
              a = this.getWidth(e),
              l = this.getHeight(e),
              c = s.offset(),
              u = c.left,
              h = c.top,
              d = this.getWidth(s),
              p = this.getHeight(s),
              m = $(window),
              g = m.scrollLeft(),
              f = m.scrollTop(),
              c = this.getViewportWidth(),
              s = this.getViewportHeight(),
              m =
                o.parent().is("[data-sm-horizontal-sub]") ||
                (2 == r && !o.hasClass("sm-vertical")),
              o =
                (this.opts.rightToLeftSubMenus && !n.is("[data-sm-reverse]")) ||
                (!this.opts.rightToLeftSubMenus && n.is("[data-sm-reverse]")),
              n =
                2 == r
                  ? this.opts.mainMenuSubOffsetX
                  : this.opts.subMenusSubOffsetX,
              r =
                2 == r
                  ? this.opts.mainMenuSubOffsetY
                  : this.opts.subMenusSubOffsetY,
              r = m
                ? ((t = o ? d - a - n : n),
                  this.opts.bottomToTopSubMenus ? -l - r : p + r)
                : ((t = o ? n - a : d - n),
                  this.opts.bottomToTopSubMenus ? p - r - l : r);
            this.opts.keepInViewport &&
              ((u = u + t),
              (h = h + r),
              o && u < g
                ? (t = m ? g - u + t : d - n)
                : !o && g + c < u + a && (t = m ? g + c - a - u + t : n - a),
              m ||
                (l < s && f + s < h + l
                  ? (r += f + s - l - h)
                  : (s <= l || h < f) && (r += f - h)),
              ((m && (f + s + 0.49 < h + l || h < f)) ||
                (!m && s + 0.49 < l)) &&
                ((i = this),
                e.dataSM("scroll-arrows") ||
                  e.dataSM(
                    "scroll-arrows",
                    $([
                      $(
                        '<span class="scroll-up"><span class="scroll-up-arrow"></span></span>'
                      )[0],
                      $(
                        '<span class="scroll-down"><span class="scroll-down-arrow"></span></span>'
                      )[0],
                    ])
                      .on({
                        mouseenter: function () {
                          (e.dataSM("scroll").up =
                            $(this).hasClass("scroll-up")),
                            i.menuScroll(e);
                        },
                        mouseleave: function (t) {
                          i.menuScrollStop(e), i.menuScrollOut(e, t);
                        },
                        "mousewheel DOMMouseScroll": function (t) {
                          t.preventDefault();
                        },
                      })
                      .insertAfter(e)
                  ),
                (s = ".smartmenus_scroll"),
                e
                  .dataSM("scroll", {
                    y: this.cssTransforms3d ? 0 : r - p,
                    step: 1,
                    itemH: p,
                    subH: l,
                    arrowDownH: this.getHeight(e.dataSM("scroll-arrows").eq(1)),
                  })
                  .on(
                    getEventsNS(
                      {
                        mouseover: function (t) {
                          i.menuScrollOver(e, t);
                        },
                        mouseout: function (t) {
                          i.menuScrollOut(e, t);
                        },
                        "mousewheel DOMMouseScroll": function (t) {
                          i.menuScrollMousewheel(e, t);
                        },
                      },
                      s
                    )
                  )
                  .dataSM("scroll-arrows")
                  .css({
                    top: "auto",
                    left: "0",
                    marginLeft: t + (parseInt(e.css("border-left-width")) || 0),
                    width:
                      a -
                      (parseInt(e.css("border-left-width")) || 0) -
                      (parseInt(e.css("border-right-width")) || 0),
                    zIndex: e.css("z-index"),
                  })
                  .eq(m && this.opts.bottomToTopSubMenus ? 0 : 1)
                  .show(),
                this.isFixed() &&
                  (((m = {})[
                    touchEvents
                      ? "touchstart touchmove touchend"
                      : "pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp"
                  ] = function (t) {
                    i.menuScrollTouch(e, t);
                  }),
                  e
                    .css({ "touch-action": "none", "-ms-touch-action": "none" })
                    .on(getEventsNS(m, s))))),
              e.css({
                top: "auto",
                left: "0",
                marginLeft: t,
                marginTop: r - p,
              });
          },
          menuScroll: function (t, e, i) {
            var s,
              n = t.dataSM("scroll"),
              o = t.dataSM("scroll-arrows"),
              r = n.up ? n.upEnd : n.downEnd;
            if (!e && n.momentum) {
              if (((n.momentum *= 0.92), (s = n.momentum) < 0.5))
                return void this.menuScrollStop(t);
            } else
              s =
                i ||
                (e || !this.opts.scrollAccelerate
                  ? this.opts.scrollStep
                  : Math.floor(n.step));
            var a,
              i = t.dataSM("level");
            this.activatedItems[i - 1] &&
              this.activatedItems[i - 1].dataSM("sub") &&
              this.activatedItems[i - 1].dataSM("sub").is(":visible") &&
              this.menuHideSubMenus(i - 1),
              (n.y =
                (n.up && n.y >= r) || (!n.up && r >= n.y)
                  ? n.y
                  : Math.abs(r - n.y) > s
                  ? n.y + (n.up ? s : -s)
                  : r),
              t.css(
                this.cssTransforms3d
                  ? {
                      "-webkit-transform": "translate3d(0, " + n.y + "px, 0)",
                      transform: "translate3d(0, " + n.y + "px, 0)",
                    }
                  : { marginTop: n.y }
              ),
              mouse &&
                ((n.up && n.y > n.downEnd) || (!n.up && n.y < n.upEnd)) &&
                o.eq(n.up ? 1 : 0).show(),
              n.y == r
                ? (mouse && o.eq(n.up ? 0 : 1).hide(), this.menuScrollStop(t))
                : e ||
                  (this.opts.scrollAccelerate &&
                    n.step < this.opts.scrollStep &&
                    (n.step += 0.2),
                  ((a = this).scrollTimeout = requestAnimationFrame(
                    function () {
                      a.menuScroll(t);
                    }
                  )));
          },
          menuScrollMousewheel: function (t, e) {
            var i;
            this.getClosestMenu(e.target) == t[0] &&
              ((i = 0 < ((e = e.originalEvent).wheelDelta || -e.detail)),
              t
                .dataSM("scroll-arrows")
                .eq(i ? 0 : 1)
                .is(":visible") &&
                ((t.dataSM("scroll").up = i), this.menuScroll(t, !0))),
              e.preventDefault();
          },
          menuScrollOut: function (t, e) {
            mouse &&
              (/^scroll-(up|down)/.test((e.relatedTarget || "").className) ||
                ((t[0] == e.relatedTarget ||
                  $.contains(t[0], e.relatedTarget)) &&
                  this.getClosestMenu(e.relatedTarget) == t[0]) ||
                t.dataSM("scroll-arrows").css("visibility", "hidden"));
          },
          menuScrollOver: function (t, e) {
            var i;
            mouse &&
              !/^scroll-(up|down)/.test(e.target.className) &&
              this.getClosestMenu(e.target) == t[0] &&
              (this.menuScrollRefreshData(t),
              (i = t.dataSM("scroll")),
              (e =
                $(window).scrollTop() -
                t.dataSM("parent-a").offset().top -
                i.itemH),
              t
                .dataSM("scroll-arrows")
                .eq(0)
                .css("margin-top", e)
                .end()
                .eq(1)
                .css("margin-top", e + this.getViewportHeight() - i.arrowDownH)
                .end()
                .css("visibility", "visible"));
          },
          menuScrollRefreshData: function (t) {
            var e = t.dataSM("scroll"),
              i =
                $(window).scrollTop() -
                t.dataSM("parent-a").offset().top -
                e.itemH;
            this.cssTransforms3d &&
              (i = -(parseFloat(t.css("margin-top")) - i)),
              $.extend(e, {
                upEnd: i,
                downEnd: i + this.getViewportHeight() - e.subH,
              });
          },
          menuScrollStop: function (t) {
            return this.scrollTimeout
              ? (cancelAnimationFrame(this.scrollTimeout),
                (this.scrollTimeout = 0),
                (t.dataSM("scroll").step = 1),
                !0)
              : void 0;
          },
          menuScrollTouch: function (t, e) {
            var i, s, n, o;
            isTouchEvent((e = e.originalEvent)) &&
              ((i = this.getTouchPoint(e)),
              this.getClosestMenu(i.target) == t[0] &&
                ((s = t.dataSM("scroll")),
                /(start|down)$/i.test(e.type)
                  ? (this.menuScrollStop(t)
                      ? (e.preventDefault(), (this.$touchScrollingSub = t))
                      : (this.$touchScrollingSub = null),
                    this.menuScrollRefreshData(t),
                    $.extend(s, {
                      touchStartY: i.pageY,
                      touchStartTime: e.timeStamp,
                    }))
                  : /move$/i.test(e.type)
                  ? (void 0 !==
                      (n = void 0 !== s.touchY ? s.touchY : s.touchStartY) &&
                      n != i.pageY &&
                      ((this.$touchScrollingSub = t),
                      (o = i.pageY > n),
                      void 0 !== s.up &&
                        s.up != o &&
                        $.extend(s, {
                          touchStartY: i.pageY,
                          touchStartTime: e.timeStamp,
                        }),
                      $.extend(s, { up: o, touchY: i.pageY }),
                      this.menuScroll(t, !0, Math.abs(i.pageY - n))),
                    e.preventDefault())
                  : void 0 !== s.touchY &&
                    ((s.momentum =
                      15 *
                      Math.pow(
                        Math.abs(i.pageY - s.touchStartY) /
                          (e.timeStamp - s.touchStartTime),
                        2
                      )) &&
                      (this.menuScrollStop(t),
                      this.menuScroll(t),
                      e.preventDefault()),
                    delete s.touchY)));
          },
          menuShow: function (t) {
            var e, i, s;
            (!t.dataSM("beforefirstshowfired") &&
              (t.dataSM("beforefirstshowfired", !0),
              !1 ===
                this.$root.triggerHandler("beforefirstshow.smapi", t[0]))) ||
              !1 === this.$root.triggerHandler("beforeshow.smapi", t[0]) ||
              (t.dataSM("shown-before", !0),
              canAnimate && t.stop(!0, !0),
              t.is(":visible")) ||
              ((e = t.dataSM("parent-a")),
              (i = this.isCollapsible()),
              (this.opts.keepHighlighted || i) && e.addClass("highlighted"),
              i
                ? t
                    .removeClass("sm-nowrap")
                    .css({
                      zIndex: "",
                      width: "auto",
                      minWidth: "",
                      maxWidth: "",
                      top: "",
                      left: "",
                      marginLeft: "",
                      marginTop: "",
                    })
                : (t.css(
                    "z-index",
                    (this.zIndexInc =
                      (this.zIndexInc || this.getStartZIndex()) + 1)
                  ),
                  (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) &&
                    (t
                      .css({ width: "auto", minWidth: "", maxWidth: "" })
                      .addClass("sm-nowrap"),
                    this.opts.subMenusMinWidth &&
                      t.css("min-width", this.opts.subMenusMinWidth),
                    this.opts.subMenusMaxWidth) &&
                    ((s = this.getWidth(t)),
                    t.css("max-width", this.opts.subMenusMaxWidth),
                    s > this.getWidth(t) &&
                      t
                        .removeClass("sm-nowrap")
                        .css("width", this.opts.subMenusMaxWidth)),
                  this.menuPosition(t)),
              (s = function () {
                t.css("overflow", "");
              }),
              i
                ? canAnimate && this.opts.collapsibleShowFunction
                  ? this.opts.collapsibleShowFunction.call(this, t, s)
                  : t.show(this.opts.collapsibleShowDuration, s)
                : canAnimate && this.opts.showFunction
                ? this.opts.showFunction.call(this, t, s)
                : t.show(this.opts.showDuration, s),
              e.attr("aria-expanded", "true"),
              t.attr({ "aria-expanded": "true", "aria-hidden": "false" }),
              this.visibleSubMenus.push(t),
              this.$root.triggerHandler("show.smapi", t[0]));
          },
          popupHide: function (t) {
            this.hideTimeout &&
              (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
            var e = this;
            this.hideTimeout = setTimeout(
              function () {
                e.menuHideAll();
              },
              t ? 1 : this.opts.hideTimeout
            );
          },
          popupShow: function (t, e) {
            var i;
            this.opts.isPopup
              ? (this.hideTimeout &&
                  (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
                this.$root.dataSM("shown-before", !0),
                canAnimate && this.$root.stop(!0, !0),
                this.$root.is(":visible") ||
                  (this.$root.css({ left: t, top: e }),
                  (i = this),
                  (e = function () {
                    i.$root.css("overflow", "");
                  }),
                  canAnimate && this.opts.showFunction
                    ? this.opts.showFunction.call(this, this.$root, e)
                    : this.$root.show(this.opts.showDuration, e),
                  (this.visibleSubMenus[0] = this.$root)))
              : alert(
                  'SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.'
                );
          },
          refresh: function () {
            this.destroy(!0), this.init(!0);
          },
          rootKeyDown: function (t) {
            if (this.handleEvents())
              switch (t.keyCode) {
                case 27:
                  var e = this.activatedItems[0];
                  e &&
                    (this.menuHideAll(),
                    e[0].focus(),
                    (i = e.dataSM("sub")) && this.menuHide(i));
                  break;
                case 32:
                  var i,
                    e = $(t.target);
                  e.is("a") &&
                    this.handleItemEvents(e) &&
                    (i = e.dataSM("sub")) &&
                    !i.is(":visible") &&
                    (this.itemClick({ currentTarget: t.target }),
                    t.preventDefault());
              }
          },
          rootOut: function (t) {
            var e;
            !this.handleEvents() ||
              this.isTouchMode() ||
              t.target == this.$root[0] ||
              (this.hideTimeout &&
                (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
              this.opts.showOnClick && this.opts.hideOnClick) ||
              ((e = this).hideTimeout = setTimeout(function () {
                e.menuHideAll();
              }, this.opts.hideTimeout));
          },
          rootOver: function (t) {
            this.handleEvents() &&
              !this.isTouchMode() &&
              t.target != this.$root[0] &&
              this.hideTimeout &&
              (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
          },
          winResize: function (t) {
            var e;
            this.handleEvents()
              ? ("onorientationchange" in window &&
                  "orientationchange" != t.type) ||
                ((e = this.isCollapsible()),
                (this.wasCollapsible && e) ||
                  (this.activatedItems.length &&
                    this.activatedItems[
                      this.activatedItems.length - 1
                    ][0].blur(),
                  this.menuHideAll()),
                (this.wasCollapsible = e))
              : this.$disableOverlay &&
                ((e = this.$root.offset()),
                this.$disableOverlay.css({
                  top: e.top,
                  left: e.left,
                  width: this.$root.outerWidth(),
                  height: this.$root.outerHeight(),
                }));
          },
        },
      }),
      ($.fn.dataSM = function (t, e) {
        return e
          ? this.data(t + "_smartmenus", e)
          : this.data(t + "_smartmenus");
      }),
      ($.fn.removeDataSM = function (t) {
        return this.removeData(t + "_smartmenus");
      }),
      ($.fn.smartmenus = function (options) {
        if ("string" != typeof options)
          return this.each(function () {
            var dataOpts = $(this).data("sm-options") || null;
            if (dataOpts && "object" != typeof dataOpts)
              try {
                dataOpts = eval("(" + dataOpts + ")");
              } catch (e) {
                (dataOpts = null),
                  alert(
                    'ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.'
                  );
              }
            new $.SmartMenus(
              this,
              $.extend({}, $.fn.smartmenus.defaults, options, dataOpts)
            );
          });
        var args = arguments,
          method = options;
        return (
          Array.prototype.shift.call(args),
          this.each(function () {
            var t = $(this).data("smartmenus");
            t && t[method] && t[method].apply(t, args);
          })
        );
      }),
      ($.fn.smartmenus.defaults = {
        isPopup: !1,
        mainMenuSubOffsetX: 0,
        mainMenuSubOffsetY: 0,
        subMenusSubOffsetX: 0,
        subMenusSubOffsetY: 0,
        subMenusMinWidth: "10rem",
        subMenusMaxWidth: "25rem",
        subIndicators: !0,
        subIndicatorsPos: "append",
        subIndicatorsText: "",
        scrollStep: 30,
        scrollAccelerate: !0,
        showTimeout: 200,
        hideTimeout: 200,
        showDuration: 0,
        showFunction: null,
        hideDuration: 0,
        hideFunction: function (t, e) {
          t.fadeOut(200, e);
        },
        collapsibleShowDuration: 0,
        collapsibleShowFunction: function (t, e) {
          t.slideDown(200, e);
        },
        collapsibleHideDuration: 0,
        collapsibleHideFunction: function (t, e) {
          t.slideUp(200, e);
        },
        showOnClick: !1,
        hideOnClick: !0,
        noMouseOver: !1,
        keepInViewport: !0,
        keepHighlighted: !0,
        markCurrentItem: !1,
        markCurrentTree: !0,
        rightToLeftSubMenus: !1,
        bottomToTopSubMenus: !1,
        collapsibleBehavior: "link",
      }),
      $
    );
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery", "smartmenus"], t)
      : "object" == typeof module && "object" == typeof module.exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (a) {
    return (
      a.extend((a.SmartMenus.Bootstrap = {}), {
        keydownFix: !1,
        init: function () {
          var t = a("ul.navbar-nav:not([data-sm-skip])");
          t.each(function () {
            var e,
              t,
              i,
              s = a(this),
              n = s.data("smartmenus");
            function o() {
              s.find("a.current").each(function () {
                var t = a(this);
                (t.hasClass("dropdown-item") ? t : t.parent()).addClass(
                  "active"
                );
              }),
                s.find("a.has-submenu").each(function () {
                  var t = a(this);
                  t.is('[data-toggle="dropdown"]') &&
                    t
                      .dataSM("bs-data-toggle-dropdown", !0)
                      .removeAttr("data-toggle"),
                    !e &&
                      t.hasClass("dropdown-toggle") &&
                      t
                        .dataSM("bs-dropdown-toggle", !0)
                        .removeClass("dropdown-toggle");
                });
            }
            function r(t) {
              var e = n.getViewportWidth();
              (e == i && !t) ||
                (n.isCollapsible()
                  ? s.addClass("sm-collapsible")
                  : s.removeClass("sm-collapsible"),
                (i = e));
            }
            n ||
              ((e = s.is("[data-sm-skip-collapsible-behavior]")),
              (t = s.hasClass("ml-auto") || 0 < s.prevAll(".mr-auto").length),
              s
                .smartmenus({
                  subMenusSubOffsetX: -8,
                  subMenusSubOffsetY: 0,
                  subIndicators: !e,
                  collapsibleShowFunction: null,
                  collapsibleHideFunction: null,
                  rightToLeftSubMenus: t,
                  bottomToTopSubMenus: 0 < s.closest(".fixed-bottom").length,
                  bootstrapHighlightClasses: "",
                })
                .on({
                  "show.smapi": function (t, e) {
                    var i = a(e),
                      e = i.dataSM("scroll-arrows");
                    e && e.css("background-color", i.css("background-color")),
                      i.parent().addClass("show"),
                      n.opts.keepHighlighted &&
                        2 < i.dataSM("level") &&
                        i
                          .prevAll("a")
                          .addClass(n.opts.bootstrapHighlightClasses);
                  },
                  "hide.smapi": function (t, e) {
                    e = a(e);
                    e.parent().removeClass("show"),
                      n.opts.keepHighlighted &&
                        2 < e.dataSM("level") &&
                        e
                          .prevAll("a")
                          .removeClass(n.opts.bootstrapHighlightClasses);
                  },
                }),
              (n = s.data("smartmenus")),
              o(),
              (n.refresh = function () {
                a.SmartMenus.prototype.refresh.call(this), o(), r(!0);
              }),
              (n.destroy = function (t) {
                s.find("a.current").each(function () {
                  var t = a(this);
                  (t.hasClass("active") ? t : t.parent()).removeClass("active");
                }),
                  s.find("a.has-submenu").each(function () {
                    var t = a(this);
                    t.dataSM("bs-dropdown-toggle") &&
                      t
                        .addClass("dropdown-toggle")
                        .removeDataSM("bs-dropdown-toggle"),
                      t.dataSM("bs-data-toggle-dropdown") &&
                        t
                          .attr("data-toggle", "dropdown")
                          .removeDataSM("bs-data-toggle-dropdown");
                  }),
                  a.SmartMenus.prototype.destroy.call(this, t);
              }),
              e && (n.opts.collapsibleBehavior = "toggle"),
              r(),
              a(window).on("resize.smartmenus" + n.rootId, r));
          }),
            t.length &&
              !a.SmartMenus.Bootstrap.keydownFix &&
              (a(document).off(
                "keydown.bs.dropdown.data-api",
                ".dropdown-menu"
              ),
              a.fn.dropdown &&
                a.fn.dropdown.Constructor &&
                "function" ==
                  typeof a.fn.dropdown.Constructor._dataApiKeydownHandler &&
                a(document).on(
                  "keydown.bs.dropdown.data-api",
                  ".dropdown-menu.show",
                  a.fn.dropdown.Constructor._dataApiKeydownHandler
                ),
              (a.SmartMenus.Bootstrap.keydownFix = !0));
        },
      }),
      a(a.SmartMenus.Bootstrap.init),
      a
    );
  }),
  (function () {
    "use strict";
    function e(t) {
      if (!t) throw new Error("No options passed to Waypoint constructor");
      if (!t.element)
        throw new Error("No element option passed to Waypoint constructor");
      if (!t.handler)
        throw new Error("No handler option passed to Waypoint constructor");
      (this.key = "waypoint-" + i),
        (this.options = e.Adapter.extend({}, e.defaults, t)),
        (this.element = this.options.element),
        (this.adapter = new e.Adapter(this.element)),
        (this.callback = t.handler),
        (this.axis = this.options.horizontal ? "horizontal" : "vertical"),
        (this.enabled = this.options.enabled),
        (this.triggerPoint = null),
        (this.group = e.Group.findOrCreate({
          name: this.options.group,
          axis: this.axis,
        })),
        (this.context = e.Context.findOrCreateByElement(this.options.context)),
        e.offsetAliases[this.options.offset] &&
          (this.options.offset = e.offsetAliases[this.options.offset]),
        this.group.add(this),
        this.context.add(this),
        (o[this.key] = this),
        (i += 1);
    }
    var i = 0,
      o = {};
    (e.prototype.queueTrigger = function (t) {
      this.group.queueTrigger(this, t);
    }),
      (e.prototype.trigger = function (t) {
        this.enabled && this.callback && this.callback.apply(this, t);
      }),
      (e.prototype.destroy = function () {
        this.context.remove(this), this.group.remove(this), delete o[this.key];
      }),
      (e.prototype.disable = function () {
        return (this.enabled = !1), this;
      }),
      (e.prototype.enable = function () {
        return this.context.refresh(), (this.enabled = !0), this;
      }),
      (e.prototype.next = function () {
        return this.group.next(this);
      }),
      (e.prototype.previous = function () {
        return this.group.previous(this);
      }),
      (e.invokeAll = function (t) {
        var e,
          i = [];
        for (e in o) i.push(o[e]);
        for (var s = 0, n = i.length; s < n; s++) i[s][t]();
      }),
      (e.destroyAll = function () {
        e.invokeAll("destroy");
      }),
      (e.disableAll = function () {
        e.invokeAll("disable");
      }),
      (e.enableAll = function () {
        for (var t in (e.Context.refreshAll(), o)) o[t].enabled = !0;
        return this;
      }),
      (e.refreshAll = function () {
        e.Context.refreshAll();
      }),
      (e.viewportHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight;
      }),
      (e.viewportWidth = function () {
        return document.documentElement.clientWidth;
      }),
      (e.adapters = []),
      (e.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0,
      }),
      (e.offsetAliases = {
        "bottom-in-view": function () {
          return this.context.innerHeight() - this.adapter.outerHeight();
        },
        "right-in-view": function () {
          return this.context.innerWidth() - this.adapter.outerWidth();
        },
      }),
      (window.Waypoint = e);
  })(),
  (function () {
    "use strict";
    function e(t) {
      window.setTimeout(t, 1e3 / 60);
    }
    function i(t) {
      (this.element = t),
        (this.Adapter = p.Adapter),
        (this.adapter = new this.Adapter(t)),
        (this.key = "waypoint-context-" + s),
        (this.didScroll = !1),
        (this.didResize = !1),
        (this.oldScroll = {
          x: this.adapter.scrollLeft(),
          y: this.adapter.scrollTop(),
        }),
        (this.waypoints = { vertical: {}, horizontal: {} }),
        (t.waypointContextKey = this.key),
        (n[t.waypointContextKey] = this),
        (s += 1),
        p.windowContext ||
          ((p.windowContext = !0), (p.windowContext = new i(window))),
        this.createThrottledScrollHandler(),
        this.createThrottledResizeHandler();
    }
    var s = 0,
      n = {},
      p = window.Waypoint,
      t = window.onload;
    (i.prototype.add = function (t) {
      var e = t.options.horizontal ? "horizontal" : "vertical";
      (this.waypoints[e][t.key] = t), this.refresh();
    }),
      (i.prototype.checkEmpty = function () {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
          e = this.Adapter.isEmptyObject(this.waypoints.vertical),
          i = this.element == this.element.window;
        t && e && !i && (this.adapter.off(".waypoints"), delete n[this.key]);
      }),
      (i.prototype.createThrottledResizeHandler = function () {
        function t() {
          e.handleResize(), (e.didResize = !1);
        }
        var e = this;
        this.adapter.on("resize.waypoints", function () {
          e.didResize || ((e.didResize = !0), p.requestAnimationFrame(t));
        });
      }),
      (i.prototype.createThrottledScrollHandler = function () {
        function t() {
          e.handleScroll(), (e.didScroll = !1);
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function () {
          (e.didScroll && !p.isTouch) ||
            ((e.didScroll = !0), p.requestAnimationFrame(t));
        });
      }),
      (i.prototype.handleResize = function () {
        p.Context.refreshAll();
      }),
      (i.prototype.handleScroll = function () {
        var t,
          e,
          i = {},
          s = {
            horizontal: {
              newScroll: this.adapter.scrollLeft(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left",
            },
            vertical: {
              newScroll: this.adapter.scrollTop(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up",
            },
          };
        for (t in s) {
          var n,
            o = s[t],
            r = o.newScroll > o.oldScroll ? o.forward : o.backward;
          for (n in this.waypoints[t]) {
            var a,
              l,
              c = this.waypoints[t][n];
            null !== c.triggerPoint &&
              ((a = o.oldScroll < c.triggerPoint),
              (l = o.newScroll >= c.triggerPoint),
              ((a && l) || (!a && !l)) &&
                (c.queueTrigger(r), (i[c.group.id] = c.group)));
          }
        }
        for (e in i) i[e].flushTriggers();
        this.oldScroll = { x: s.horizontal.newScroll, y: s.vertical.newScroll };
      }),
      (i.prototype.innerHeight = function () {
        return this.element == this.element.window
          ? p.viewportHeight()
          : this.adapter.innerHeight();
      }),
      (i.prototype.remove = function (t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty();
      }),
      (i.prototype.innerWidth = function () {
        return this.element == this.element.window
          ? p.viewportWidth()
          : this.adapter.innerWidth();
      }),
      (i.prototype.destroy = function () {
        var t,
          e = [];
        for (t in this.waypoints)
          for (var i in this.waypoints[t]) e.push(this.waypoints[t][i]);
        for (var s = 0, n = e.length; s < n; s++) e[s].destroy();
      }),
      (i.prototype.refresh = function () {
        var t,
          e,
          i = this.element == this.element.window,
          s = i ? void 0 : this.adapter.offset(),
          n = {};
        for (e in (this.handleScroll(),
        (t = {
          horizontal: {
            contextOffset: i ? 0 : s.left,
            contextScroll: i ? 0 : this.oldScroll.x,
            contextDimension: this.innerWidth(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
            offsetProp: "left",
          },
          vertical: {
            contextOffset: i ? 0 : s.top,
            contextScroll: i ? 0 : this.oldScroll.y,
            contextDimension: this.innerHeight(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
            offsetProp: "top",
          },
        }))) {
          var o,
            r = t[e];
          for (o in this.waypoints[e]) {
            var a,
              l = this.waypoints[e][o],
              c = l.options.offset,
              u = l.triggerPoint,
              h = 0,
              d = null == u;
            l.element !== l.element.window &&
              (h = l.adapter.offset()[r.offsetProp]),
              "function" == typeof c
                ? (c = c.apply(l))
                : "string" == typeof c &&
                  ((c = parseFloat(c)),
                  -1 < l.options.offset.indexOf("%") &&
                    (c = Math.ceil((r.contextDimension * c) / 100))),
              (a = r.contextScroll - r.contextOffset),
              (l.triggerPoint = Math.floor(h + a - c)),
              (a = u < r.oldScroll),
              (c = l.triggerPoint >= r.oldScroll),
              (u = !a && !c),
              !d && a && c
                ? (l.queueTrigger(r.backward), (n[l.group.id] = l.group))
                : ((!d && u) || (d && r.oldScroll >= l.triggerPoint)) &&
                  (l.queueTrigger(r.forward), (n[l.group.id] = l.group));
          }
        }
        return (
          p.requestAnimationFrame(function () {
            for (var t in n) n[t].flushTriggers();
          }),
          this
        );
      }),
      (i.findOrCreateByElement = function (t) {
        return i.findByElement(t) || new i(t);
      }),
      (i.refreshAll = function () {
        for (var t in n) n[t].refresh();
      }),
      (i.findByElement = function (t) {
        return n[t.waypointContextKey];
      }),
      (window.onload = function () {
        t && t(), i.refreshAll();
      }),
      (p.requestAnimationFrame = function (t) {
        (
          window.requestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          e
        ).call(window, t);
      }),
      (p.Context = i);
  })(),
  (function () {
    "use strict";
    function o(t, e) {
      return t.triggerPoint - e.triggerPoint;
    }
    function r(t, e) {
      return e.triggerPoint - t.triggerPoint;
    }
    function e(t) {
      (this.name = t.name),
        (this.axis = t.axis),
        (this.id = this.name + "-" + this.axis),
        (this.waypoints = []),
        this.clearTriggerQueues(),
        (i[this.axis][this.name] = this);
    }
    var i = { vertical: {}, horizontal: {} },
      s = window.Waypoint;
    (e.prototype.add = function (t) {
      this.waypoints.push(t);
    }),
      (e.prototype.clearTriggerQueues = function () {
        this.triggerQueues = { up: [], down: [], left: [], right: [] };
      }),
      (e.prototype.flushTriggers = function () {
        for (var t in this.triggerQueues) {
          var e = this.triggerQueues[t];
          e.sort("up" === t || "left" === t ? r : o);
          for (var i = 0, s = e.length; i < s; i += 1) {
            var n = e[i];
            (!n.options.continuous && i !== e.length - 1) || n.trigger([t]);
          }
        }
        this.clearTriggerQueues();
      }),
      (e.prototype.next = function (t) {
        this.waypoints.sort(o);
        t = s.Adapter.inArray(t, this.waypoints);
        return t === this.waypoints.length - 1 ? null : this.waypoints[t + 1];
      }),
      (e.prototype.previous = function (t) {
        this.waypoints.sort(o);
        t = s.Adapter.inArray(t, this.waypoints);
        return t ? this.waypoints[t - 1] : null;
      }),
      (e.prototype.queueTrigger = function (t, e) {
        this.triggerQueues[e].push(t);
      }),
      (e.prototype.remove = function (t) {
        t = s.Adapter.inArray(t, this.waypoints);
        -1 < t && this.waypoints.splice(t, 1);
      }),
      (e.prototype.first = function () {
        return this.waypoints[0];
      }),
      (e.prototype.last = function () {
        return this.waypoints[this.waypoints.length - 1];
      }),
      (e.findOrCreate = function (t) {
        return i[t.axis][t.name] || new e(t);
      }),
      (s.Group = e);
  })(),
  (function () {
    "use strict";
    function i(t) {
      this.$element = s(t);
    }
    var s = window.jQuery,
      t = window.Waypoint;
    s.each(
      [
        "innerHeight",
        "innerWidth",
        "off",
        "offset",
        "on",
        "outerHeight",
        "outerWidth",
        "scrollLeft",
        "scrollTop",
      ],
      function (t, e) {
        i.prototype[e] = function () {
          var t = Array.prototype.slice.call(arguments);
          return this.$element[e].apply(this.$element, t);
        };
      }
    ),
      s.each(["extend", "inArray", "isEmptyObject"], function (t, e) {
        i[e] = s[e];
      }),
      t.adapters.push({ name: "jquery", Adapter: i }),
      (t.Adapter = i);
  })(),
  (function () {
    "use strict";
    function t(s) {
      return function () {
        var e = [],
          i = arguments[0];
        return (
          s.isFunction(arguments[0]) &&
            ((i = s.extend({}, arguments[1])).handler = arguments[0]),
          this.each(function () {
            var t = s.extend({}, i, { element: this });
            "string" == typeof t.context &&
              (t.context = s(this).closest(t.context)[0]),
              e.push(new n(t));
          }),
          e
        );
      };
    }
    var n = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
      window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
  })(),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(["jquery"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("jquery")))
      : e(t.jQuery);
  })(this, function (d) {
    !(function () {
      "use strict";
      function e(t, e) {
        if (
          ((this.el = t),
          (this.$el = d(t)),
          (this.s = d.extend({}, i, e)),
          this.s.dynamic &&
            "undefined" !== this.s.dynamicEl &&
            this.s.dynamicEl.constructor === Array &&
            !this.s.dynamicEl.length)
        )
          throw "When using dynamic mode, you must also define dynamicEl as an Array.";
        return (
          (this.modules = {}),
          (this.lGalleryOn = !1),
          (this.lgBusy = !1),
          (this.hideBartimeout = !1),
          (this.isTouch = "ontouchstart" in document.documentElement),
          this.s.slideEndAnimatoin && (this.s.hideControlOnEnd = !1),
          this.s.dynamic
            ? (this.$items = this.s.dynamicEl)
            : "this" === this.s.selector
            ? (this.$items = this.$el)
            : "" !== this.s.selector
            ? this.s.selectWithin
              ? (this.$items = d(this.s.selectWithin).find(this.s.selector))
              : (this.$items = this.$el.find(d(this.s.selector)))
            : (this.$items = this.$el.children()),
          (this.$slide = ""),
          (this.$outer = ""),
          this.init(),
          this
        );
      }
      var i = {
        mode: "lg-slide",
        cssEasing: "ease",
        easing: "linear",
        speed: 600,
        height: "100%",
        width: "100%",
        addClass: "",
        startClass: "lg-start-zoom",
        backdropDuration: 150,
        hideBarsDelay: 6e3,
        useLeft: !1,
        closable: !0,
        loop: !0,
        escKey: !0,
        keyPress: !0,
        controls: !0,
        slideEndAnimatoin: !0,
        hideControlOnEnd: !1,
        mousewheel: !0,
        getCaptionFromTitleOrAlt: !0,
        appendSubHtmlTo: ".lg-sub-html",
        subHtmlSelectorRelative: !1,
        preload: 1,
        showAfterLoad: !0,
        selector: "",
        selectWithin: "",
        nextHtml: "",
        prevHtml: "",
        index: !1,
        iframeMaxWidth: "100%",
        download: !0,
        counter: !0,
        appendCounterTo: ".lg-toolbar",
        swipeThreshold: 50,
        enableSwipe: !0,
        enableDrag: !0,
        dynamic: !1,
        dynamicEl: [],
        galleryId: 1,
      };
      (e.prototype.init = function () {
        var t = this;
        t.s.preload > t.$items.length && (t.s.preload = t.$items.length);
        var e = window.location.hash;
        0 < e.indexOf("lg=" + this.s.galleryId) &&
          ((t.index = parseInt(e.split("&slide=")[1], 10)),
          d("body").addClass("lg-from-hash"),
          d("body").hasClass("lg-on") ||
            (setTimeout(function () {
              t.build(t.index);
            }),
            d("body").addClass("lg-on"))),
          t.s.dynamic
            ? (t.$el.trigger("onBeforeOpen.lg"),
              (t.index = t.s.index || 0),
              d("body").hasClass("lg-on") ||
                setTimeout(function () {
                  t.build(t.index), d("body").addClass("lg-on");
                }))
            : t.$items.on("click.lgcustom", function (e) {
                try {
                  e.preventDefault(), e.preventDefault();
                } catch (t) {
                  e.returnValue = !1;
                }
                t.$el.trigger("onBeforeOpen.lg"),
                  (t.index = t.s.index || t.$items.index(this)),
                  d("body").hasClass("lg-on") ||
                    (t.build(t.index), d("body").addClass("lg-on"));
              });
      }),
        (e.prototype.build = function (t) {
          var e = this;
          e.structure(),
            d.each(d.fn.lightGallery.modules, function (t) {
              e.modules[t] = new d.fn.lightGallery.modules[t](e.el);
            }),
            e.slide(t, !1, !1, !1),
            e.s.keyPress && e.keyPress(),
            1 < e.$items.length
              ? (e.arrow(),
                setTimeout(function () {
                  e.enableDrag(), e.enableSwipe();
                }, 50),
                e.s.mousewheel && e.mousewheel())
              : e.$slide.on("click.lg", function () {
                  e.$el.trigger("onSlideClick.lg");
                }),
            e.counter(),
            e.closeGallery(),
            e.$el.trigger("onAfterOpen.lg"),
            e.$outer.on("mousemove.lg click.lg touchstart.lg", function () {
              e.$outer.removeClass("lg-hide-items"),
                clearTimeout(e.hideBartimeout),
                (e.hideBartimeout = setTimeout(function () {
                  e.$outer.addClass("lg-hide-items");
                }, e.s.hideBarsDelay));
            }),
            e.$outer.trigger("mousemove.lg");
        }),
        (e.prototype.structure = function () {
          var t = "",
            e = "",
            i = 0,
            s = "",
            n = this;
          for (
            d("body").append('<div class="lg-backdrop"></div>'),
              d(".lg-backdrop").css(
                "transition-duration",
                this.s.backdropDuration + "ms"
              ),
              i = 0;
            i < this.$items.length;
            i++
          )
            t += '<div class="lg-item"></div>';
          this.s.controls &&
            1 < this.$items.length &&
            (e =
              '<div class="lg-actions"><button class="lg-prev lg-icon">' +
              this.s.prevHtml +
              '</button><button class="lg-next lg-icon">' +
              this.s.nextHtml +
              "</button></div>"),
            ".lg-sub-html" === this.s.appendSubHtmlTo &&
              (s = '<div class="lg-sub-html"></div>'),
            (s =
              '<div class="lg-outer ' +
              this.s.addClass +
              " " +
              this.s.startClass +
              '"><div class="lg" style="width:' +
              this.s.width +
              "; height:" +
              this.s.height +
              '"><div class="lg-inner">' +
              t +
              '</div><div class="lg-toolbar lg-group"><span class="lg-close lg-icon"></span></div>' +
              e +
              s +
              "</div></div>"),
            d("body").append(s),
            (this.$outer = d(".lg-outer")),
            (this.$slide = this.$outer.find(".lg-item")),
            this.s.useLeft
              ? (this.$outer.addClass("lg-use-left"),
                (this.s.mode = "lg-slide"))
              : this.$outer.addClass("lg-use-css3"),
            n.setTop(),
            d(window).on("resize.lg orientationchange.lg", function () {
              setTimeout(function () {
                n.setTop();
              }, 100);
            }),
            this.$slide.eq(this.index).addClass("lg-current"),
            this.doCss()
              ? this.$outer.addClass("lg-css3")
              : (this.$outer.addClass("lg-css"), (this.s.speed = 0)),
            this.$outer.addClass(this.s.mode),
            this.s.enableDrag &&
              1 < this.$items.length &&
              this.$outer.addClass("lg-grab"),
            this.s.showAfterLoad && this.$outer.addClass("lg-show-after-load"),
            this.doCss() &&
              ((s = this.$outer.find(".lg-inner")).css(
                "transition-timing-function",
                this.s.cssEasing
              ),
              s.css("transition-duration", this.s.speed + "ms")),
            setTimeout(function () {
              d(".lg-backdrop").addClass("in");
            }),
            setTimeout(function () {
              n.$outer.addClass("lg-visible");
            }, this.s.backdropDuration),
            this.s.download &&
              this.$outer
                .find(".lg-toolbar")
                .append(
                  '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'
                ),
            (this.prevScrollTop = d(window).scrollTop());
        }),
        (e.prototype.setTop = function () {
          var t, e, i;
          "100%" !== this.s.height &&
            ((e = ((t = d(window).height()) - parseInt(this.s.height, 10)) / 2),
            (i = this.$outer.find(".lg")),
            t >= parseInt(this.s.height, 10)
              ? i.css("top", e + "px")
              : i.css("top", "0px"));
        }),
        (e.prototype.doCss = function () {
          return !!(function () {
            for (
              var t = [
                  "transition",
                  "MozTransition",
                  "WebkitTransition",
                  "OTransition",
                  "msTransition",
                  "KhtmlTransition",
                ],
                e = document.documentElement,
                i = 0,
                i = 0;
              i < t.length;
              i++
            )
              if (t[i] in e.style) return 1;
          })();
        }),
        (e.prototype.isVideo = function (t, e) {
          var i = this.s.dynamic
            ? this.s.dynamicEl[e].html
            : this.$items.eq(e).attr("data-html");
          if (!t)
            return i
              ? { html5: !0 }
              : (console.error(
                  "lightGallery :- data-src is not pvovided on slide item " +
                    (e + 1) +
                    ". Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html"
                ),
                !1);
          var s = t.match(
              /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i
            ),
            i = t.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),
            e = t.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),
            t = t.match(
              /\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i
            );
          return s
            ? { youtube: s }
            : i
            ? { vimeo: i }
            : e
            ? { dailymotion: e }
            : t
            ? { vk: t }
            : void 0;
        }),
        (e.prototype.counter = function () {
          this.s.counter &&
            d(this.s.appendCounterTo).append(
              '<div id="lg-counter"><span id="lg-counter-current">' +
                (parseInt(this.index, 10) + 1) +
                '</span> / <span id="lg-counter-all">' +
                this.$items.length +
                "</span></div>"
            );
        }),
        (e.prototype.addHtml = function (t) {
          var e,
            i,
            s,
            n = null;
          this.s.dynamic
            ? this.s.dynamicEl[t].subHtmlUrl
              ? (e = this.s.dynamicEl[t].subHtmlUrl)
              : (n = this.s.dynamicEl[t].subHtml)
            : (i = this.$items.eq(t)).attr("data-sub-html-url")
            ? (e = i.attr("data-sub-html-url"))
            : ((n = i.attr("data-sub-html")),
              this.s.getCaptionFromTitleOrAlt &&
                !n &&
                (n = i.attr("title") || i.find("img").first().attr("alt"))),
            e ||
              (null != n
                ? ("." !== (s = n.substring(0, 1)) && "#" !== s) ||
                  (n = (
                    this.s.subHtmlSelectorRelative && !this.s.dynamic
                      ? i.find(n)
                      : d(n)
                  ).html())
                : (n = "")),
            ".lg-sub-html" === this.s.appendSubHtmlTo
              ? e
                ? this.$outer.find(this.s.appendSubHtmlTo).load(e)
                : this.$outer.find(this.s.appendSubHtmlTo).html(n)
              : e
              ? this.$slide.eq(t).load(e)
              : this.$slide.eq(t).append(n),
            null != n &&
              ("" === n
                ? this.$outer
                    .find(this.s.appendSubHtmlTo)
                    .addClass("lg-empty-html")
                : this.$outer
                    .find(this.s.appendSubHtmlTo)
                    .removeClass("lg-empty-html")),
            this.$el.trigger("onAfterAppendSubHtml.lg", [t]);
        }),
        (e.prototype.preload = function (t) {
          for (
            var e = 1, i = 1, e = 1;
            e <= this.s.preload && !(e >= this.$items.length - t);
            e++
          )
            this.loadContent(t + e, !1, 0);
          for (i = 1; i <= this.s.preload && !(t - i < 0); i++)
            this.loadContent(t - i, !1, 0);
        }),
        (e.prototype.loadContent = function (e, t, i) {
          var a,
            s,
            n,
            o,
            r = this,
            l = !1,
            c = function (t) {
              for (var e = [], i = [], s = 0; s < t.length; s++) {
                var n = t[s].split(" ");
                "" === n[0] && n.splice(0, 1), i.push(n[0]), e.push(n[1]);
              }
              for (var o = d(window).width(), r = 0; r < e.length; r++)
                if (parseInt(e[r], 10) > o) {
                  a = i[r];
                  break;
                }
            },
            u = r.s.dynamic
              ? (r.s.dynamicEl[e].poster &&
                  ((l = !0), (s = r.s.dynamicEl[e].poster)),
                (o = r.s.dynamicEl[e].html),
                (a = r.s.dynamicEl[e].src),
                r.s.dynamicEl[e].responsive &&
                  c(r.s.dynamicEl[e].responsive.split(",")),
                (n = r.s.dynamicEl[e].srcset),
                r.s.dynamicEl[e].sizes)
              : (r.$items.eq(e).attr("data-poster") &&
                  ((l = !0), (s = r.$items.eq(e).attr("data-poster"))),
                (o = r.$items.eq(e).attr("data-html")),
                (a =
                  r.$items.eq(e).attr("href") ||
                  r.$items.eq(e).attr("data-src")),
                r.$items.eq(e).attr("data-responsive") &&
                  c(r.$items.eq(e).attr("data-responsive").split(",")),
                (n = r.$items.eq(e).attr("data-srcset")),
                r.$items.eq(e).attr("data-sizes")),
            h = !1;
          r.s.dynamic
            ? r.s.dynamicEl[e].iframe && (h = !0)
            : "true" === r.$items.eq(e).attr("data-iframe") && (h = !0);
          c = r.isVideo(a, e);
          if (!r.$slide.eq(e).hasClass("lg-loaded")) {
            if (
              (h
                ? r.$slide
                    .eq(e)
                    .prepend(
                      '<div class="lg-video-cont lg-has-iframe" style="max-width:' +
                        r.s.iframeMaxWidth +
                        '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' +
                        a +
                        '"  allowfullscreen="true"></iframe></div></div>'
                    )
                : l
                ? ((h = ""),
                  (h =
                    c && c.youtube
                      ? "lg-has-youtube"
                      : c && c.vimeo
                      ? "lg-has-vimeo"
                      : "lg-has-html5"),
                  r.$slide
                    .eq(e)
                    .prepend(
                      '<div class="lg-video-cont ' +
                        h +
                        ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' +
                        s +
                        '" /></div></div>'
                    ))
                : c
                ? (r.$slide
                    .eq(e)
                    .prepend(
                      '<div class="lg-video-cont "><div class="lg-video"></div></div>'
                    ),
                  r.$el.trigger("hasVideo.lg", [e, a, o]))
                : r.$slide
                    .eq(e)
                    .prepend(
                      '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' +
                        a +
                        '" /></div>'
                    ),
              r.$el.trigger("onAferAppendSlide.lg", [e]),
              (o = r.$slide.eq(e).find(".lg-object")),
              u && o.attr("sizes", u),
              n)
            ) {
              o.attr("srcset", n);
              try {
                picturefill({ elements: [o[0]] });
              } catch (t) {
                console.warn(
                  "lightGallery :- If you want srcset to be supported for older browser please include picturefil version 2 javascript library in your document."
                );
              }
            }
            ".lg-sub-html" !== this.s.appendSubHtmlTo && r.addHtml(e),
              r.$slide.eq(e).addClass("lg-loaded");
          }
          r.$slide
            .eq(e)
            .find(".lg-object")
            .on("load.lg error.lg", function () {
              var t = 0;
              i && !d("body").hasClass("lg-from-hash") && (t = i),
                setTimeout(function () {
                  r.$slide.eq(e).addClass("lg-complete"),
                    r.$el.trigger("onSlideItemLoad.lg", [e, i || 0]);
                }, t);
            }),
            c && c.html5 && !l && r.$slide.eq(e).addClass("lg-complete"),
            !0 === t &&
              (r.$slide.eq(e).hasClass("lg-complete")
                ? r.preload(e)
                : r.$slide
                    .eq(e)
                    .find(".lg-object")
                    .on("load.lg error.lg", function () {
                      r.preload(e);
                    }));
        }),
        (e.prototype.slide = function (t, e, i, s) {
          var n,
            o,
            r,
            a,
            l,
            c = this.$outer.find(".lg-current").index(),
            u = this;
          (u.lGalleryOn && c === t) ||
            ((n = this.$slide.length),
            (o = u.lGalleryOn ? this.s.speed : 0),
            u.lgBusy ||
              (this.s.download &&
                ((r = u.s.dynamic
                  ? !1 !== u.s.dynamicEl[t].downloadUrl &&
                    (u.s.dynamicEl[t].downloadUrl || u.s.dynamicEl[t].src)
                  : "false" !== u.$items.eq(t).attr("data-download-url") &&
                    (u.$items.eq(t).attr("data-download-url") ||
                      u.$items.eq(t).attr("href") ||
                      u.$items.eq(t).attr("data-src")))
                  ? (d("#lg-download").attr("href", r),
                    u.$outer.removeClass("lg-hide-download"))
                  : u.$outer.addClass("lg-hide-download")),
              this.$el.trigger("onBeforeSlide.lg", [c, t, e, i]),
              (u.lgBusy = !0),
              clearTimeout(u.hideBartimeout),
              ".lg-sub-html" === this.s.appendSubHtmlTo &&
                setTimeout(function () {
                  u.addHtml(t);
                }, o),
              this.arrowDisable(t),
              s || (t < c ? (s = "prev") : c < t && (s = "next")),
              e
                ? (this.$slide.removeClass(
                    "lg-prev-slide lg-current lg-next-slide"
                  ),
                  2 < n
                    ? ((a = t - 1),
                      (l = t + 1),
                      ((0 === t && c === n - 1) || (t === n - 1 && 0 === c)) &&
                        ((l = 0), (a = n - 1)))
                    : ((a = 0), (l = 1)),
                  "prev" === s
                    ? u.$slide.eq(l).addClass("lg-next-slide")
                    : u.$slide.eq(a).addClass("lg-prev-slide"),
                  u.$slide.eq(t).addClass("lg-current"))
                : (u.$outer.addClass("lg-no-trans"),
                  this.$slide.removeClass("lg-prev-slide lg-next-slide"),
                  "prev" === s
                    ? (this.$slide.eq(t).addClass("lg-prev-slide"),
                      this.$slide.eq(c).addClass("lg-next-slide"))
                    : (this.$slide.eq(t).addClass("lg-next-slide"),
                      this.$slide.eq(c).addClass("lg-prev-slide")),
                  setTimeout(function () {
                    u.$slide.removeClass("lg-current"),
                      u.$slide.eq(t).addClass("lg-current"),
                      u.$outer.removeClass("lg-no-trans");
                  }, 50)),
              u.lGalleryOn
                ? (setTimeout(function () {
                    u.loadContent(t, !0, 0);
                  }, this.s.speed + 50),
                  setTimeout(function () {
                    (u.lgBusy = !1),
                      u.$el.trigger("onAfterSlide.lg", [c, t, e, i]);
                  }, this.s.speed))
                : (u.loadContent(t, !0, u.s.backdropDuration),
                  (u.lgBusy = !1),
                  u.$el.trigger("onAfterSlide.lg", [c, t, e, i])),
              (u.lGalleryOn = !0),
              this.s.counter && d("#lg-counter-current").text(t + 1)),
            (u.index = t));
        }),
        (e.prototype.goToNextSlide = function (t) {
          var e = this,
            i = e.s.loop;
          t && e.$slide.length < 3 && (i = !1),
            e.lgBusy ||
              (e.index + 1 < e.$slide.length
                ? (e.index++,
                  e.$el.trigger("onBeforeNextSlide.lg", [e.index]),
                  e.slide(e.index, t, !1, "next"))
                : i
                ? ((e.index = 0),
                  e.$el.trigger("onBeforeNextSlide.lg", [e.index]),
                  e.slide(e.index, t, !1, "next"))
                : e.s.slideEndAnimatoin &&
                  !t &&
                  (e.$outer.addClass("lg-right-end"),
                  setTimeout(function () {
                    e.$outer.removeClass("lg-right-end");
                  }, 400)));
        }),
        (e.prototype.goToPrevSlide = function (t) {
          var e = this,
            i = e.s.loop;
          t && e.$slide.length < 3 && (i = !1),
            e.lgBusy ||
              (0 < e.index
                ? (e.index--,
                  e.$el.trigger("onBeforePrevSlide.lg", [e.index, t]),
                  e.slide(e.index, t, !1, "prev"))
                : i
                ? ((e.index = e.$items.length - 1),
                  e.$el.trigger("onBeforePrevSlide.lg", [e.index, t]),
                  e.slide(e.index, t, !1, "prev"))
                : e.s.slideEndAnimatoin &&
                  !t &&
                  (e.$outer.addClass("lg-left-end"),
                  setTimeout(function () {
                    e.$outer.removeClass("lg-left-end");
                  }, 400)));
        }),
        (e.prototype.keyPress = function () {
          var e = this;
          1 < this.$items.length &&
            d(window).on("keyup.lg", function (t) {
              1 < e.$items.length &&
                (37 === t.keyCode && (t.preventDefault(), e.goToPrevSlide()),
                39 === t.keyCode && (t.preventDefault(), e.goToNextSlide()));
            }),
            d(window).on("keydown.lg", function (t) {
              !0 === e.s.escKey &&
                27 === t.keyCode &&
                (t.preventDefault(),
                e.$outer.hasClass("lg-thumb-open")
                  ? e.$outer.removeClass("lg-thumb-open")
                  : e.destroy());
            });
        }),
        (e.prototype.arrow = function () {
          var t = this;
          this.$outer.find(".lg-prev").on("click.lg", function () {
            t.goToPrevSlide();
          }),
            this.$outer.find(".lg-next").on("click.lg", function () {
              t.goToNextSlide();
            });
        }),
        (e.prototype.arrowDisable = function (t) {
          !this.s.loop &&
            this.s.hideControlOnEnd &&
            (t + 1 < this.$slide.length
              ? this.$outer
                  .find(".lg-next")
                  .removeAttr("disabled")
                  .removeClass("disabled")
              : this.$outer
                  .find(".lg-next")
                  .attr("disabled", "disabled")
                  .addClass("disabled"),
            0 < t
              ? this.$outer
                  .find(".lg-prev")
                  .removeAttr("disabled")
                  .removeClass("disabled")
              : this.$outer
                  .find(".lg-prev")
                  .attr("disabled", "disabled")
                  .addClass("disabled"));
        }),
        (e.prototype.setTranslate = function (t, e, i) {
          this.s.useLeft
            ? t.css("left", e)
            : t.css({
                transform: "translate3d(" + e + "px, " + i + "px, 0px)",
              });
        }),
        (e.prototype.touchMove = function (t, e) {
          t = e - t;
          15 < Math.abs(t) &&
            (this.$outer.addClass("lg-dragging"),
            this.setTranslate(this.$slide.eq(this.index), t, 0),
            this.setTranslate(
              d(".lg-prev-slide"),
              -this.$slide.eq(this.index).width() + t,
              0
            ),
            this.setTranslate(
              d(".lg-next-slide"),
              this.$slide.eq(this.index).width() + t,
              0
            ));
        }),
        (e.prototype.touchEnd = function (t) {
          var e = this;
          "lg-slide" !== e.s.mode && e.$outer.addClass("lg-slide"),
            this.$slide
              .not(".lg-current, .lg-prev-slide, .lg-next-slide")
              .css("opacity", "0"),
            setTimeout(function () {
              e.$outer.removeClass("lg-dragging"),
                t < 0 && Math.abs(t) > e.s.swipeThreshold
                  ? e.goToNextSlide(!0)
                  : 0 < t && Math.abs(t) > e.s.swipeThreshold
                  ? e.goToPrevSlide(!0)
                  : Math.abs(t) < 5 && e.$el.trigger("onSlideClick.lg"),
                e.$slide.removeAttr("style");
            }),
            setTimeout(function () {
              e.$outer.hasClass("lg-dragging") ||
                "lg-slide" === e.s.mode ||
                e.$outer.removeClass("lg-slide");
            }, e.s.speed + 100);
        }),
        (e.prototype.enableSwipe = function () {
          var e = this,
            i = 0,
            s = 0,
            n = !1;
          e.s.enableSwipe &&
            e.doCss() &&
            (e.$slide.on("touchstart.lg", function (t) {
              e.$outer.hasClass("lg-zoomed") ||
                e.lgBusy ||
                (t.preventDefault(),
                e.manageSwipeClass(),
                (i = t.originalEvent.targetTouches[0].pageX));
            }),
            e.$slide.on("touchmove.lg", function (t) {
              e.$outer.hasClass("lg-zoomed") ||
                (t.preventDefault(),
                (s = t.originalEvent.targetTouches[0].pageX),
                e.touchMove(i, s),
                (n = !0));
            }),
            e.$slide.on("touchend.lg", function () {
              e.$outer.hasClass("lg-zoomed") ||
                (n
                  ? ((n = !1), e.touchEnd(s - i))
                  : e.$el.trigger("onSlideClick.lg"));
            }));
        }),
        (e.prototype.enableDrag = function () {
          var e = this,
            i = 0,
            s = 0,
            n = !1,
            o = !1;
          e.s.enableDrag &&
            e.doCss() &&
            (e.$slide.on("mousedown.lg", function (t) {
              e.$outer.hasClass("lg-zoomed") ||
                e.lgBusy ||
                d(t.target).text().trim() ||
                (t.preventDefault(),
                e.manageSwipeClass(),
                (i = t.pageX),
                (n = !0),
                (e.$outer.scrollLeft += 1),
                --e.$outer.scrollLeft,
                e.$outer.removeClass("lg-grab").addClass("lg-grabbing"),
                e.$el.trigger("onDragstart.lg"));
            }),
            d(window).on("mousemove.lg", function (t) {
              n &&
                ((o = !0),
                (s = t.pageX),
                e.touchMove(i, s),
                e.$el.trigger("onDragmove.lg"));
            }),
            d(window).on("mouseup.lg", function (t) {
              o
                ? ((o = !1), e.touchEnd(s - i), e.$el.trigger("onDragend.lg"))
                : (d(t.target).hasClass("lg-object") ||
                    d(t.target).hasClass("lg-video-play")) &&
                  e.$el.trigger("onSlideClick.lg"),
                n &&
                  ((n = !1),
                  e.$outer.removeClass("lg-grabbing").addClass("lg-grab"));
            }));
        }),
        (e.prototype.manageSwipeClass = function () {
          var t = this.index + 1,
            e = this.index - 1;
          this.s.loop &&
            2 < this.$slide.length &&
            (0 === this.index
              ? (e = this.$slide.length - 1)
              : this.index === this.$slide.length - 1 && (t = 0)),
            this.$slide.removeClass("lg-next-slide lg-prev-slide"),
            -1 < e && this.$slide.eq(e).addClass("lg-prev-slide"),
            this.$slide.eq(t).addClass("lg-next-slide");
        }),
        (e.prototype.mousewheel = function () {
          var e = this;
          e.$outer.on("mousewheel.lg", function (t) {
            t.deltaY &&
              (0 < t.deltaY ? e.goToPrevSlide() : e.goToNextSlide(),
              t.preventDefault());
          });
        }),
        (e.prototype.closeGallery = function () {
          var e = this,
            i = !1;
          this.$outer.find(".lg-close").on("click.lg", function () {
            e.destroy();
          }),
            e.s.closable &&
              (e.$outer.on("mousedown.lg", function (t) {
                i = !!(
                  d(t.target).is(".lg-outer") ||
                  d(t.target).is(".lg-item ") ||
                  d(t.target).is(".lg-img-wrap")
                );
              }),
              e.$outer.on("mousemove.lg", function () {
                i = !1;
              }),
              e.$outer.on("mouseup.lg", function (t) {
                (d(t.target).is(".lg-outer") ||
                  d(t.target).is(".lg-item ") ||
                  (d(t.target).is(".lg-img-wrap") && i)) &&
                  (e.$outer.hasClass("lg-dragging") || e.destroy());
              }));
        }),
        (e.prototype.destroy = function (t) {
          var e = this;
          t ||
            (e.$el.trigger("onBeforeClose.lg"),
            d(window).scrollTop(e.prevScrollTop)),
            t &&
              (e.s.dynamic || this.$items.off("click.lg click.lgcustom"),
              d.removeData(e.el, "lightGallery")),
            this.$el.off(".lg.tm"),
            d.each(d.fn.lightGallery.modules, function (t) {
              e.modules[t] && e.modules[t].destroy();
            }),
            (this.lGalleryOn = !1),
            clearTimeout(e.hideBartimeout),
            (this.hideBartimeout = !1),
            d(window).off(".lg"),
            d("body").removeClass("lg-on lg-from-hash"),
            e.$outer && e.$outer.removeClass("lg-visible"),
            d(".lg-backdrop").removeClass("in"),
            setTimeout(function () {
              e.$outer && e.$outer.remove(),
                d(".lg-backdrop").remove(),
                t || e.$el.trigger("onCloseAfter.lg");
            }, e.s.backdropDuration + 50);
        }),
        (d.fn.lightGallery = function (t) {
          return this.each(function () {
            if (d.data(this, "lightGallery"))
              try {
                d(this).data("lightGallery").init();
              } catch (t) {
                console.error("lightGallery has not initiated properly");
              }
            else d.data(this, "lightGallery", new e(this, t));
          });
        }),
        (d.fn.lightGallery.modules = {});
    })();
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (i) {
    !(function () {
      "use strict";
      function t(t) {
        return (
          (this.core = i(t).data("lightGallery")),
          (this.$el = i(t)),
          !(this.core.$items.length < 2) &&
            ((this.core.s = i.extend({}, e, this.core.s)),
            (this.interval = !1),
            (this.fromAuto = !0),
            (this.canceledOnTouch = !1),
            (this.fourceAutoplayTemp = this.core.s.fourceAutoplay),
            this.core.doCss() || (this.core.s.progressBar = !1),
            this.init(),
            this)
        );
      }
      var e = {
        autoplay: !1,
        pause: 5e3,
        progressBar: !0,
        fourceAutoplay: !1,
        autoplayControls: !0,
        appendAutoplayControlsTo: ".lg-toolbar",
      };
      (t.prototype.init = function () {
        var t = this;
        t.core.s.autoplayControls && t.controls(),
          t.core.s.progressBar &&
            t.core.$outer
              .find(".lg")
              .append(
                '<div class="lg-progress-bar"><div class="lg-progress"></div></div>'
              ),
          t.progress(),
          t.core.s.autoplay &&
            t.$el.one("onSlideItemLoad.lg.tm", function () {
              t.startlAuto();
            }),
          t.$el.on("onDragstart.lg.tm touchstart.lg.tm", function () {
            t.interval && (t.cancelAuto(), (t.canceledOnTouch = !0));
          }),
          t.$el.on(
            "onDragend.lg.tm touchend.lg.tm onSlideClick.lg.tm",
            function () {
              !t.interval &&
                t.canceledOnTouch &&
                (t.startlAuto(), (t.canceledOnTouch = !1));
            }
          );
      }),
        (t.prototype.progress = function () {
          var t,
            e,
            i = this;
          i.$el.on("onBeforeSlide.lg.tm", function () {
            i.core.s.progressBar &&
              i.fromAuto &&
              ((t = i.core.$outer.find(".lg-progress-bar")),
              (e = i.core.$outer.find(".lg-progress")),
              i.interval &&
                (e.removeAttr("style"),
                t.removeClass("lg-start"),
                setTimeout(function () {
                  e.css(
                    "transition",
                    "width " + (i.core.s.speed + i.core.s.pause) + "ms ease 0s"
                  ),
                    t.addClass("lg-start");
                }, 20))),
              i.fromAuto || i.core.s.fourceAutoplay || i.cancelAuto(),
              (i.fromAuto = !1);
          });
        }),
        (t.prototype.controls = function () {
          var t = this;
          i(this.core.s.appendAutoplayControlsTo).append(
            '<span class="lg-autoplay-button lg-icon"></span>'
          ),
            t.core.$outer
              .find(".lg-autoplay-button")
              .on("click.lg", function () {
                i(t.core.$outer).hasClass("lg-show-autoplay")
                  ? (t.cancelAuto(), (t.core.s.fourceAutoplay = !1))
                  : t.interval ||
                    (t.startlAuto(),
                    (t.core.s.fourceAutoplay = t.fourceAutoplayTemp));
              });
        }),
        (t.prototype.startlAuto = function () {
          var t = this;
          t.core.$outer
            .find(".lg-progress")
            .css(
              "transition",
              "width " + (t.core.s.speed + t.core.s.pause) + "ms ease 0s"
            ),
            t.core.$outer.addClass("lg-show-autoplay"),
            t.core.$outer.find(".lg-progress-bar").addClass("lg-start"),
            (t.interval = setInterval(function () {
              t.core.index + 1 < t.core.$items.length
                ? t.core.index++
                : (t.core.index = 0),
                (t.fromAuto = !0),
                t.core.slide(t.core.index, !1, !1, "next");
            }, t.core.s.speed + t.core.s.pause));
        }),
        (t.prototype.cancelAuto = function () {
          clearInterval(this.interval),
            (this.interval = !1),
            this.core.$outer.find(".lg-progress").removeAttr("style"),
            this.core.$outer.removeClass("lg-show-autoplay"),
            this.core.$outer.find(".lg-progress-bar").removeClass("lg-start");
        }),
        (t.prototype.destroy = function () {
          this.cancelAuto(), this.core.$outer.find(".lg-progress-bar").remove();
        }),
        (i.fn.lightGallery.modules.autoplay = t);
    })();
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(["jquery"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("jquery")))
      : e(t.jQuery);
  })(this, function (s) {
    !(function () {
      "use strict";
      function e() {
        return (
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        );
      }
      function t(t) {
        return (
          (this.core = s(t).data("lightGallery")),
          (this.$el = s(t)),
          (this.core.s = s.extend({}, i, this.core.s)),
          this.init(),
          this
        );
      }
      var i = { fullScreen: !0 };
      (t.prototype.init = function () {
        this.core.s.fullScreen &&
          (document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled) &&
          (this.core.$outer
            .find(".lg-toolbar")
            .append('<span class="lg-fullscreen lg-icon"></span>'),
          this.fullScreen());
      }),
        (t.prototype.requestFullscreen = function () {
          var t = document.documentElement;
          t.requestFullscreen
            ? t.requestFullscreen()
            : t.msRequestFullscreen
            ? t.msRequestFullscreen()
            : t.mozRequestFullScreen
            ? t.mozRequestFullScreen()
            : t.webkitRequestFullscreen && t.webkitRequestFullscreen();
        }),
        (t.prototype.exitFullscreen = function () {
          document.exitFullscreen
            ? document.exitFullscreen()
            : document.msExitFullscreen
            ? document.msExitFullscreen()
            : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.webkitExitFullscreen && document.webkitExitFullscreen();
        }),
        (t.prototype.fullScreen = function () {
          var t = this;
          s(document).on(
            "fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg",
            function () {
              t.core.$outer.toggleClass("lg-fullscreen-on");
            }
          ),
            this.core.$outer.find(".lg-fullscreen").on("click.lg", function () {
              e() ? t.exitFullscreen() : t.requestFullscreen();
            });
        }),
        (t.prototype.destroy = function () {
          e() && this.exitFullscreen(),
            s(document).off(
              "fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg"
            );
        }),
        (s.fn.lightGallery.modules.fullscreen = t);
    })();
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (r) {
    !(function () {
      "use strict";
      function t(t) {
        return (
          (this.core = r(t).data("lightGallery")),
          (this.$el = r(t)),
          (this.core.s = r.extend({}, e, this.core.s)),
          this.core.s.pager && 1 < this.core.$items.length && this.init(),
          this
        );
      }
      var e = { pager: !1 };
      (t.prototype.init = function () {
        var s,
          t,
          e,
          i = this,
          n = "";
        if (
          (i.core.$outer
            .find(".lg")
            .append('<div class="lg-pager-outer"></div>'),
          i.core.s.dynamic)
        )
          for (var o = 0; o < i.core.s.dynamicEl.length; o++)
            n +=
              '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
              i.core.s.dynamicEl[o].thumb +
              '" /></div></span>';
        else
          i.core.$items.each(function () {
            i.core.s.exThumbImage
              ? (n +=
                  '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
                  r(this).attr(i.core.s.exThumbImage) +
                  '" /></div></span>')
              : (n +=
                  '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' +
                  r(this).find("img").attr("src") +
                  '" /></div></span>');
          });
        (t = i.core.$outer.find(".lg-pager-outer")).html(n),
          (s = i.core.$outer.find(".lg-pager-cont")).on(
            "click.lg touchend.lg",
            function () {
              var t = r(this);
              (i.core.index = t.index()),
                i.core.slide(i.core.index, !1, !0, !1);
            }
          ),
          t.on("mouseover.lg", function () {
            clearTimeout(e), t.addClass("lg-pager-hover");
          }),
          t.on("mouseout.lg", function () {
            e = setTimeout(function () {
              t.removeClass("lg-pager-hover");
            });
          }),
          i.core.$el.on("onBeforeSlide.lg.tm", function (t, e, i) {
            s.removeClass("lg-pager-active"),
              s.eq(i).addClass("lg-pager-active");
          });
      }),
        (t.prototype.destroy = function () {}),
        (r.fn.lightGallery.modules.pager = t);
    })();
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (a) {
    !(function () {
      "use strict";
      function t(t) {
        return (
          (this.core = a(t).data("lightGallery")),
          (this.core.s = a.extend({}, e, this.core.s)),
          (this.$el = a(t)),
          (this.$thumbOuter = null),
          (this.thumbOuterWidth = 0),
          (this.thumbTotalWidth =
            this.core.$items.length *
            (this.core.s.thumbWidth + this.core.s.thumbMargin)),
          (this.thumbIndex = this.core.index),
          this.core.s.animateThumb && (this.core.s.thumbHeight = "100%"),
          (this.left = 0),
          this.init(),
          this
        );
      }
      var e = {
        thumbnail: !0,
        animateThumb: !0,
        currentPagerPosition: "middle",
        thumbWidth: 100,
        thumbHeight: "80px",
        thumbContHeight: 100,
        thumbMargin: 5,
        exThumbImage: !1,
        showThumbByDefault: !0,
        toogleThumb: !0,
        pullCaptionUp: !0,
        enableThumbDrag: !0,
        enableThumbSwipe: !0,
        swipeThreshold: 50,
        loadYoutubeThumbnail: !0,
        youtubeThumbSize: 1,
        loadVimeoThumbnail: !0,
        vimeoThumbSize: "thumbnail_small",
        loadDailymotionThumbnail: !0,
      };
      (t.prototype.init = function () {
        var t = this;
        this.core.s.thumbnail &&
          1 < this.core.$items.length &&
          (this.core.s.showThumbByDefault &&
            setTimeout(function () {
              t.core.$outer.addClass("lg-thumb-open");
            }, 700),
          this.core.s.pullCaptionUp &&
            this.core.$outer.addClass("lg-pull-caption-up"),
          this.build(),
          this.core.s.animateThumb && this.core.doCss()
            ? (this.core.s.enableThumbDrag && this.enableThumbDrag(),
              this.core.s.enableThumbSwipe && this.enableThumbSwipe(),
              (this.thumbClickable = !1))
            : (this.thumbClickable = !0),
          this.toogle(),
          this.thumbkeyPress());
      }),
        (t.prototype.build = function () {
          function e(t, e, i) {
            var s,
              t = n.core.isVideo(t, i) || {},
              i = "";
            t.youtube || t.vimeo || t.dailymotion
              ? t.youtube
                ? (s = n.core.s.loadYoutubeThumbnail
                    ? "//img.youtube.com/vi/" +
                      t.youtube[1] +
                      "/" +
                      n.core.s.youtubeThumbSize +
                      ".jpg"
                    : e)
                : t.vimeo
                ? n.core.s.loadVimeoThumbnail
                  ? ((s = "//i.vimeocdn.com/video/error_" + r + ".jpg"),
                    (i = t.vimeo[1]))
                  : (s = e)
                : t.dailymotion &&
                  (s = n.core.s.loadDailymotionThumbnail
                    ? "//www.dailymotion.com/thumbnail/video/" +
                      t.dailymotion[1]
                    : e)
              : (s = e),
              (o +=
                '<div data-vimeo-id="' +
                i +
                '" class="lg-thumb-item" style="width:' +
                n.core.s.thumbWidth +
                "px; height: " +
                n.core.s.thumbHeight +
                "; margin-right: " +
                n.core.s.thumbMargin +
                'px"><img src="' +
                s +
                '" /></div>'),
              (i = "");
          }
          var t,
            n = this,
            o = "",
            r = "";
          switch (this.core.s.vimeoThumbSize) {
            case "thumbnail_large":
              r = "640";
              break;
            case "thumbnail_medium":
              r = "200x150";
              break;
            case "thumbnail_small":
              r = "100x75";
          }
          if (
            (n.core.$outer.addClass("lg-has-thumb"),
            n.core.$outer
              .find(".lg")
              .append(
                '<div class="lg-thumb-outer"><div class="lg-thumb lg-group"></div></div>'
              ),
            (n.$thumbOuter = n.core.$outer.find(".lg-thumb-outer")),
            (n.thumbOuterWidth = n.$thumbOuter.width()),
            n.core.s.animateThumb &&
              n.core.$outer
                .find(".lg-thumb")
                .css({ width: n.thumbTotalWidth + "px", position: "relative" }),
            this.core.s.animateThumb &&
              n.$thumbOuter.css("height", n.core.s.thumbContHeight + "px"),
            n.core.s.dynamic)
          )
            for (var i = 0; i < n.core.s.dynamicEl.length; i++)
              e(n.core.s.dynamicEl[i].src, n.core.s.dynamicEl[i].thumb, i);
          else
            n.core.$items.each(function (t) {
              n.core.s.exThumbImage
                ? e(
                    a(this).attr("href") || a(this).attr("data-src"),
                    a(this).attr(n.core.s.exThumbImage),
                    t
                  )
                : e(
                    a(this).attr("href") || a(this).attr("data-src"),
                    a(this).find("img").attr("src"),
                    t
                  );
            });
          n.core.$outer.find(".lg-thumb").html(o),
            (t = n.core.$outer.find(".lg-thumb-item")).each(function () {
              var e = a(this),
                t = e.attr("data-vimeo-id");
              t &&
                a.getJSON(
                  "//www.vimeo.com/api/v2/video/" + t + ".json?callback=?",
                  { format: "json" },
                  function (t) {
                    e.find("img").attr("src", t[0][n.core.s.vimeoThumbSize]);
                  }
                );
            }),
            t.eq(n.core.index).addClass("active"),
            n.core.$el.on("onBeforeSlide.lg.tm", function () {
              t.removeClass("active"), t.eq(n.core.index).addClass("active");
            }),
            t.on("click.lg touchend.lg", function () {
              var t = a(this);
              setTimeout(function () {
                ((!n.thumbClickable || n.core.lgBusy) && n.core.doCss()) ||
                  ((n.core.index = t.index()),
                  n.core.slide(n.core.index, !1, !0, !1));
              }, 50);
            }),
            n.core.$el.on("onBeforeSlide.lg.tm", function () {
              n.animateThumb(n.core.index);
            }),
            a(window).on(
              "resize.lg.thumb orientationchange.lg.thumb",
              function () {
                setTimeout(function () {
                  n.animateThumb(n.core.index),
                    (n.thumbOuterWidth = n.$thumbOuter.width());
                }, 200);
              }
            );
        }),
        (t.prototype.setTranslate = function (t) {
          this.core.$outer
            .find(".lg-thumb")
            .css({ transform: "translate3d(-" + t + "px, 0px, 0px)" });
        }),
        (t.prototype.animateThumb = function (t) {
          var e,
            i = this.core.$outer.find(".lg-thumb");
          if (this.core.s.animateThumb) {
            switch (this.core.s.currentPagerPosition) {
              case "left":
                e = 0;
                break;
              case "middle":
                e = this.thumbOuterWidth / 2 - this.core.s.thumbWidth / 2;
                break;
              case "right":
                e = this.thumbOuterWidth - this.core.s.thumbWidth;
            }
            (this.left =
              (this.core.s.thumbWidth + this.core.s.thumbMargin) * t - 1 - e),
              this.left > this.thumbTotalWidth - this.thumbOuterWidth &&
                (this.left = this.thumbTotalWidth - this.thumbOuterWidth),
              this.left < 0 && (this.left = 0),
              this.core.lGalleryOn
                ? (i.hasClass("on") ||
                    this.core.$outer
                      .find(".lg-thumb")
                      .css("transition-duration", this.core.s.speed + "ms"),
                  this.core.doCss() ||
                    i.animate({ left: -this.left + "px" }, this.core.s.speed))
                : this.core.doCss() || i.css("left", -this.left + "px"),
              this.setTranslate(this.left);
          }
        }),
        (t.prototype.enableThumbDrag = function () {
          var e = this,
            i = 0,
            s = 0,
            n = !1,
            o = !1,
            r = 0;
          e.$thumbOuter.addClass("lg-grab"),
            e.core.$outer
              .find(".lg-thumb")
              .on("mousedown.lg.thumb", function (t) {
                e.thumbTotalWidth > e.thumbOuterWidth &&
                  (t.preventDefault(),
                  (i = t.pageX),
                  (n = !0),
                  (e.core.$outer.scrollLeft += 1),
                  --e.core.$outer.scrollLeft,
                  (e.thumbClickable = !1),
                  e.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing"));
              }),
            a(window).on("mousemove.lg.thumb", function (t) {
              n &&
                ((r = e.left),
                (o = !0),
                (s = t.pageX),
                e.$thumbOuter.addClass("lg-dragging"),
                (r =
                  (r -= s - i) > e.thumbTotalWidth - e.thumbOuterWidth
                    ? e.thumbTotalWidth - e.thumbOuterWidth
                    : r) < 0 && (r = 0),
                e.setTranslate(r));
            }),
            a(window).on("mouseup.lg.thumb", function () {
              o
                ? ((o = !1),
                  e.$thumbOuter.removeClass("lg-dragging"),
                  (e.left = r),
                  Math.abs(s - i) < e.core.s.swipeThreshold &&
                    (e.thumbClickable = !0))
                : (e.thumbClickable = !0),
                n &&
                  ((n = !1),
                  e.$thumbOuter.removeClass("lg-grabbing").addClass("lg-grab"));
            });
        }),
        (t.prototype.enableThumbSwipe = function () {
          var e = this,
            i = 0,
            s = 0,
            n = !1,
            o = 0;
          e.core.$outer.find(".lg-thumb").on("touchstart.lg", function (t) {
            e.thumbTotalWidth > e.thumbOuterWidth &&
              (t.preventDefault(),
              (i = t.originalEvent.targetTouches[0].pageX),
              (e.thumbClickable = !1));
          }),
            e.core.$outer.find(".lg-thumb").on("touchmove.lg", function (t) {
              e.thumbTotalWidth > e.thumbOuterWidth &&
                (t.preventDefault(),
                (s = t.originalEvent.targetTouches[0].pageX),
                (n = !0),
                e.$thumbOuter.addClass("lg-dragging"),
                (o = e.left),
                (o =
                  (o -= s - i) > e.thumbTotalWidth - e.thumbOuterWidth
                    ? e.thumbTotalWidth - e.thumbOuterWidth
                    : o) < 0 && (o = 0),
                e.setTranslate(o));
            }),
            e.core.$outer.find(".lg-thumb").on("touchend.lg", function () {
              e.thumbTotalWidth > e.thumbOuterWidth && n
                ? ((n = !1),
                  e.$thumbOuter.removeClass("lg-dragging"),
                  Math.abs(s - i) < e.core.s.swipeThreshold &&
                    (e.thumbClickable = !0),
                  (e.left = o))
                : (e.thumbClickable = !0);
            });
        }),
        (t.prototype.toogle = function () {
          var t = this;
          t.core.s.toogleThumb &&
            (t.core.$outer.addClass("lg-can-toggle"),
            t.$thumbOuter.append(
              '<span class="lg-toogle-thumb lg-icon"></span>'
            ),
            t.core.$outer.find(".lg-toogle-thumb").on("click.lg", function () {
              t.core.$outer.toggleClass("lg-thumb-open");
            }));
        }),
        (t.prototype.thumbkeyPress = function () {
          var e = this;
          a(window).on("keydown.lg.thumb", function (t) {
            38 === t.keyCode
              ? (t.preventDefault(), e.core.$outer.addClass("lg-thumb-open"))
              : 40 === t.keyCode &&
                (t.preventDefault(),
                e.core.$outer.removeClass("lg-thumb-open"));
          });
        }),
        (t.prototype.destroy = function () {
          this.core.s.thumbnail &&
            1 < this.core.$items.length &&
            (a(window).off(
              "resize.lg.thumb orientationchange.lg.thumb keydown.lg.thumb"
            ),
            this.$thumbOuter.remove(),
            this.core.$outer.removeClass("lg-has-thumb"));
        }),
        (a.fn.lightGallery.modules.Thumbnail = t);
    })();
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(["jquery"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("jquery")))
      : e(t.jQuery);
  })(this, function (l) {
    !(function () {
      "use strict";
      function t(t) {
        return (
          (this.core = l(t).data("lightGallery")),
          (this.$el = l(t)),
          (this.core.s = l.extend({}, e, this.core.s)),
          (this.videoLoaded = !1),
          this.init(),
          this
        );
      }
      var e = {
        videoMaxWidth: "855px",
        autoplayFirstVideo: !0,
        youtubePlayerParams: !1,
        vimeoPlayerParams: !1,
        dailymotionPlayerParams: !1,
        vkPlayerParams: !1,
        videojs: !1,
        videojsOptions: {},
      };
      (t.prototype.init = function () {
        var s = this;
        s.core.$el.on(
          "hasVideo.lg.tm",
          function (t, e, i, s) {
            var n = this;
            if (
              (n.core.$slide
                .eq(e)
                .find(".lg-video")
                .append(n.loadVideo(i, "lg-object", !0, e, s)),
              s)
            )
              if (n.core.s.videojs)
                try {
                  videojs(
                    n.core.$slide.eq(e).find(".lg-html5").get(0),
                    n.core.s.videojsOptions,
                    function () {
                      !n.videoLoaded &&
                        n.core.s.autoplayFirstVideo &&
                        this.play();
                    }
                  );
                } catch (t) {
                  console.error("Make sure you have included videojs");
                }
              else
                !n.videoLoaded &&
                  n.core.s.autoplayFirstVideo &&
                  n.core.$slide.eq(e).find(".lg-html5").get(0).play();
          }.bind(this)
        ),
          s.core.$el.on(
            "onAferAppendSlide.lg.tm",
            function (t, e) {
              (e = this.core.$slide.eq(e).find(".lg-video-cont")).hasClass(
                "lg-has-iframe"
              ) ||
                (e.css("max-width", this.core.s.videoMaxWidth),
                (this.videoLoaded = !0));
            }.bind(this)
          ),
          s.core.doCss() &&
          1 < s.core.$items.length &&
          (s.core.s.enableSwipe || s.core.s.enableDrag)
            ? s.core.$el.on("onSlideClick.lg.tm", function () {
                var t = s.core.$slide.eq(s.core.index);
                s.loadVideoOnclick(t);
              })
            : s.core.$slide.on("click.lg", function () {
                s.loadVideoOnclick(l(this));
              }),
          s.core.$el.on(
            "onBeforeSlide.lg.tm",
            function (t, e, i) {
              var s = this,
                n = (a = s.core.$slide.eq(e)).find(".lg-youtube").get(0),
                o = a.find(".lg-vimeo").get(0),
                r = a.find(".lg-dailymotion").get(0),
                e = a.find(".lg-vk").get(0),
                a = a.find(".lg-html5").get(0);
              if (n)
                n.contentWindow.postMessage(
                  '{"event":"command","func":"pauseVideo","args":""}',
                  "*"
                );
              else if (o)
                try {
                  $f(o).api("pause");
                } catch (t) {
                  console.error("Make sure you have included froogaloop2 js");
                }
              else if (r) r.contentWindow.postMessage("pause", "*");
              else if (a)
                if (s.core.s.videojs)
                  try {
                    videojs(a).pause();
                  } catch (t) {
                    console.error("Make sure you have included videojs");
                  }
                else a.pause();
              e &&
                l(e).attr(
                  "src",
                  l(e).attr("src").replace("&autoplay", "&noplay")
                ),
                (e = s.core.s.dynamic
                  ? s.core.s.dynamicEl[i].src
                  : s.core.$items.eq(i).attr("href") ||
                    s.core.$items.eq(i).attr("data-src")),
                ((i = s.core.isVideo(e, i) || {}).youtube ||
                  i.vimeo ||
                  i.dailymotion ||
                  i.vk) &&
                  s.core.$outer.addClass("lg-hide-download");
            }.bind(this)
          ),
          s.core.$el.on("onAfterSlide.lg.tm", function (t, e) {
            s.core.$slide.eq(e).removeClass("lg-video-playing");
          }),
          s.core.s.autoplayFirstVideo &&
            s.core.$el.on("onAferAppendSlide.lg.tm", function (t, e) {
              var i;
              s.core.lGalleryOn ||
                ((i = s.core.$slide.eq(e)),
                setTimeout(function () {
                  s.loadVideoOnclick(i);
                }, 100));
            });
      }),
        (t.prototype.loadVideo = function (t, e, i, s, n) {
          var o = "",
            r = 1,
            a = "",
            s = this.core.isVideo(t, s) || {};
          return (
            i &&
              (r = !this.videoLoaded && this.core.s.autoplayFirstVideo ? 1 : 0),
            s.youtube
              ? ((a = "?wmode=opaque&autoplay=" + r + "&enablejsapi=1"),
                this.core.s.youtubePlayerParams &&
                  (a = a + "&" + l.param(this.core.s.youtubePlayerParams)),
                (o =
                  '<iframe class="lg-video-object lg-youtube ' +
                  e +
                  '" width="560" height="315" src="//www.youtube.com/embed/' +
                  s.youtube[1] +
                  a +
                  '" frameborder="0" allowfullscreen></iframe>'))
              : s.vimeo
              ? ((a = "?autoplay=" + r + "&api=1"),
                this.core.s.vimeoPlayerParams &&
                  (a = a + "&" + l.param(this.core.s.vimeoPlayerParams)),
                (o =
                  '<iframe class="lg-video-object lg-vimeo ' +
                  e +
                  '" width="560" height="315"  src="//player.vimeo.com/video/' +
                  s.vimeo[1] +
                  a +
                  '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'))
              : s.dailymotion
              ? ((a = "?wmode=opaque&autoplay=" + r + "&api=postMessage"),
                this.core.s.dailymotionPlayerParams &&
                  (a = a + "&" + l.param(this.core.s.dailymotionPlayerParams)),
                (o =
                  '<iframe class="lg-video-object lg-dailymotion ' +
                  e +
                  '" width="560" height="315" src="//www.dailymotion.com/embed/video/' +
                  s.dailymotion[1] +
                  a +
                  '" frameborder="0" allowfullscreen></iframe>'))
              : s.html5
              ? (o = n =
                  "." === (i = n.substring(0, 1)) || "#" === i
                    ? l(n).html()
                    : n)
              : s.vk &&
                ((a = "&autoplay=" + r),
                this.core.s.vkPlayerParams &&
                  (a = a + "&" + l.param(this.core.s.vkPlayerParams)),
                (o =
                  '<iframe class="lg-video-object lg-vk ' +
                  e +
                  '" width="560" height="315" src="//vk.com/video_ext.php?' +
                  s.vk[1] +
                  a +
                  '" frameborder="0" allowfullscreen></iframe>')),
            o
          );
        }),
        (t.prototype.loadVideoOnclick = function (i) {
          var s = this;
          if (
            i.find(".lg-object").hasClass("lg-has-poster") &&
            i.find(".lg-object").is(":visible")
          )
            if (i.hasClass("lg-has-video")) {
              var t = i.find(".lg-youtube").get(0),
                e = i.find(".lg-vimeo").get(0),
                n = i.find(".lg-dailymotion").get(0),
                o = i.find(".lg-html5").get(0);
              if (t)
                t.contentWindow.postMessage(
                  '{"event":"command","func":"playVideo","args":""}',
                  "*"
                );
              else if (e)
                try {
                  $f(e).api("play");
                } catch (i) {
                  console.error("Make sure you have included froogaloop2 js");
                }
              else if (n) n.contentWindow.postMessage("play", "*");
              else if (o)
                if (s.core.s.videojs)
                  try {
                    videojs(o).play();
                  } catch (i) {
                    console.error("Make sure you have included videojs");
                  }
                else o.play();
              i.addClass("lg-video-playing");
            } else {
              i.addClass("lg-video-playing lg-has-video");
              var r,
                n = function (t, e) {
                  if (
                    (i
                      .find(".lg-video")
                      .append(s.loadVideo(t, "", !1, s.core.index, e)),
                    e)
                  )
                    if (s.core.s.videojs)
                      try {
                        videojs(
                          s.core.$slide
                            .eq(s.core.index)
                            .find(".lg-html5")
                            .get(0),
                          s.core.s.videojsOptions,
                          function () {
                            this.play();
                          }
                        );
                      } catch (t) {
                        console.error("Make sure you have included videojs");
                      }
                    else
                      s.core.$slide
                        .eq(s.core.index)
                        .find(".lg-html5")
                        .get(0)
                        .play();
                },
                o = s.core.s.dynamic
                  ? ((r = s.core.s.dynamicEl[s.core.index].src),
                    s.core.s.dynamicEl[s.core.index].html)
                  : ((r =
                      s.core.$items.eq(s.core.index).attr("href") ||
                      s.core.$items.eq(s.core.index).attr("data-src")),
                    s.core.$items.eq(s.core.index).attr("data-html"));
              n(r, o);
              o = i.find(".lg-object");
              i.find(".lg-video").append(o),
                i.find(".lg-video-object").hasClass("lg-html5") ||
                  (i.removeClass("lg-complete"),
                  i
                    .find(".lg-video-object")
                    .on("load.lg error.lg", function () {
                      i.addClass("lg-complete");
                    }));
            }
        }),
        (t.prototype.destroy = function () {
          this.videoLoaded = !1;
        }),
        (l.fn.lightGallery.modules.video = t);
    })();
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (u) {
    !(function () {
      "use strict";
      function t(t) {
        return (
          (this.core = u(t).data("lightGallery")),
          (this.core.s = u.extend({}, s, this.core.s)),
          this.core.s.zoom &&
            this.core.doCss() &&
            (this.init(),
            (this.zoomabletimeout = !1),
            (this.pageX = u(window).width() / 2),
            (this.pageY = u(window).height() / 2 + u(window).scrollTop())),
          this
        );
      }
      var e,
        i,
        s = {
          scale: 1,
          zoom: !0,
          actualSize: !0,
          enableZoomAfter: 300,
          useLeftForZoom:
            ((e = !1),
            (i = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)),
            (e = !!(i && parseInt(i[2], 10) < 54) || e)),
        };
      (t.prototype.init = function () {
        var o = this,
          t =
            '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';
        o.core.s.actualSize &&
          (t += '<span id="lg-actual-size" class="lg-icon"></span>'),
          o.core.s.useLeftForZoom
            ? o.core.$outer.addClass("lg-use-left-for-zoom")
            : o.core.$outer.addClass("lg-use-transition-for-zoom"),
          this.core.$outer.find(".lg-toolbar").append(t),
          o.core.$el.on("onSlideItemLoad.lg.tm.zoom", function (t, e, i) {
            var s = o.core.s.enableZoomAfter + i;
            u("body").hasClass("lg-from-hash") && i
              ? (s = 0)
              : u("body").removeClass("lg-from-hash"),
              (o.zoomabletimeout = setTimeout(function () {
                o.core.$slide.eq(e).addClass("lg-zoomable");
              }, s + 30));
          });
        function e(t) {
          var e = o.core.$outer.find(".lg-current .lg-image"),
            i = (u(window).width() - e.prop("offsetWidth")) / 2,
            s =
              (u(window).height() - e.prop("offsetHeight")) / 2 +
              u(window).scrollTop(),
            i = (t - 1) * (o.pageX - i),
            s = (t - 1) * (o.pageY - s);
          e
            .css("transform", "scale3d(" + t + ", " + t + ", 1)")
            .attr("data-scale", t),
            (o.core.s.useLeftForZoom
              ? e.parent().css({ left: -i + "px", top: -s + "px" })
              : e
                  .parent()
                  .css(
                    "transform",
                    "translate3d(-" + i + "px, -" + s + "px, 0)"
                  )
            )
              .attr("data-x", i)
              .attr("data-y", s);
        }
        function r() {
          1 < a ? o.core.$outer.addClass("lg-zoomed") : o.resetZoom(),
            e((a = a < 1 ? 1 : a));
        }
        function s(t, e, i, s) {
          var n = e.prop("offsetWidth"),
            e = o.core.s.dynamic
              ? o.core.s.dynamicEl[i].width || e[0].naturalWidth || n
              : o.core.$items.eq(i).attr("data-width") ||
                e[0].naturalWidth ||
                n;
          o.core.$outer.hasClass("lg-zoomed")
            ? (a = 1)
            : n < e && (a = e / n || 2),
            s
              ? ((o.pageX = u(window).width() / 2),
                (o.pageY = u(window).height() / 2 + u(window).scrollTop()))
              : ((o.pageX = t.pageX || t.originalEvent.targetTouches[0].pageX),
                (o.pageY = t.pageY || t.originalEvent.targetTouches[0].pageY)),
            r(),
            setTimeout(function () {
              o.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
            }, 10);
        }
        var a = 1,
          n = !1;
        o.core.$el.on("onAferAppendSlide.lg.tm.zoom", function (t, e) {
          var i = o.core.$slide.eq(e).find(".lg-image");
          i.on("dblclick", function (t) {
            s(t, i, e);
          }),
            i.on("touchstart", function (t) {
              n
                ? (clearTimeout(n), (n = null), s(t, i, e))
                : (n = setTimeout(function () {
                    n = null;
                  }, 300)),
                t.preventDefault();
            });
        }),
          u(window).on(
            "resize.lg.zoom scroll.lg.zoom orientationchange.lg.zoom",
            function () {
              (o.pageX = u(window).width() / 2),
                (o.pageY = u(window).height() / 2 + u(window).scrollTop()),
                e(a);
            }
          ),
          u("#lg-zoom-out").on("click.lg", function () {
            o.core.$outer.find(".lg-current .lg-image").length &&
              ((a -= o.core.s.scale), r());
          }),
          u("#lg-zoom-in").on("click.lg", function () {
            o.core.$outer.find(".lg-current .lg-image").length &&
              ((a += o.core.s.scale), r());
          }),
          u("#lg-actual-size").on("click.lg", function (t) {
            s(
              t,
              o.core.$slide.eq(o.core.index).find(".lg-image"),
              o.core.index,
              !0
            );
          }),
          o.core.$el.on("onBeforeSlide.lg.tm", function () {
            (a = 1), o.resetZoom();
          }),
          o.zoomDrag(),
          o.zoomSwipe();
      }),
        (t.prototype.resetZoom = function () {
          this.core.$outer.removeClass("lg-zoomed"),
            this.core.$slide
              .find(".lg-img-wrap")
              .removeAttr("style data-x data-y"),
            this.core.$slide.find(".lg-image").removeAttr("style data-scale"),
            (this.pageX = u(window).width() / 2),
            (this.pageY = u(window).height() / 2 + u(window).scrollTop());
        }),
        (t.prototype.zoomSwipe = function () {
          var s = this,
            n = {},
            o = {},
            r = !1,
            a = !1,
            l = !1;
          s.core.$slide.on("touchstart.lg", function (t) {
            var e;
            s.core.$outer.hasClass("lg-zoomed") &&
              ((e = s.core.$slide.eq(s.core.index).find(".lg-object")),
              (l =
                e.prop("offsetHeight") * e.attr("data-scale") >
                s.core.$outer.find(".lg").height()),
              ((a =
                e.prop("offsetWidth") * e.attr("data-scale") >
                s.core.$outer.find(".lg").width()) ||
                l) &&
                (t.preventDefault(),
                (n = {
                  x: t.originalEvent.targetTouches[0].pageX,
                  y: t.originalEvent.targetTouches[0].pageY,
                })));
          }),
            s.core.$slide.on("touchmove.lg", function (t) {
              var e, i;
              s.core.$outer.hasClass("lg-zoomed") &&
                ((i = s.core.$slide.eq(s.core.index).find(".lg-img-wrap")),
                t.preventDefault(),
                (r = !0),
                (o = {
                  x: t.originalEvent.targetTouches[0].pageX,
                  y: t.originalEvent.targetTouches[0].pageY,
                }),
                s.core.$outer.addClass("lg-zoom-dragging"),
                (e = l
                  ? -Math.abs(i.attr("data-y")) + (o.y - n.y)
                  : -Math.abs(i.attr("data-y"))),
                (t = a
                  ? -Math.abs(i.attr("data-x")) + (o.x - n.x)
                  : -Math.abs(i.attr("data-x"))),
                (15 < Math.abs(o.x - n.x) || 15 < Math.abs(o.y - n.y)) &&
                  (s.core.s.useLeftForZoom
                    ? i.css({ left: t + "px", top: e + "px" })
                    : i.css(
                        "transform",
                        "translate3d(" + t + "px, " + e + "px, 0)"
                      )));
            }),
            s.core.$slide.on("touchend.lg", function () {
              s.core.$outer.hasClass("lg-zoomed") &&
                r &&
                ((r = !1),
                s.core.$outer.removeClass("lg-zoom-dragging"),
                s.touchendZoom(n, o, a, l));
            });
        }),
        (t.prototype.zoomDrag = function () {
          var s = this,
            n = {},
            o = {},
            r = !1,
            a = !1,
            l = !1,
            c = !1;
          s.core.$slide.on("mousedown.lg.zoom", function (t) {
            var e = s.core.$slide.eq(s.core.index).find(".lg-object");
            (c =
              e.prop("offsetHeight") * e.attr("data-scale") >
              s.core.$outer.find(".lg").height()),
              (l =
                e.prop("offsetWidth") * e.attr("data-scale") >
                s.core.$outer.find(".lg").width()),
              s.core.$outer.hasClass("lg-zoomed") &&
                u(t.target).hasClass("lg-object") &&
                (l || c) &&
                (t.preventDefault(),
                (n = { x: t.pageX, y: t.pageY }),
                (r = !0),
                (s.core.$outer.scrollLeft += 1),
                --s.core.$outer.scrollLeft,
                s.core.$outer.removeClass("lg-grab").addClass("lg-grabbing"));
          }),
            u(window).on("mousemove.lg.zoom", function (t) {
              var e, i;
              r &&
                ((i = s.core.$slide.eq(s.core.index).find(".lg-img-wrap")),
                (a = !0),
                (o = { x: t.pageX, y: t.pageY }),
                s.core.$outer.addClass("lg-zoom-dragging"),
                (e = c
                  ? -Math.abs(i.attr("data-y")) + (o.y - n.y)
                  : -Math.abs(i.attr("data-y"))),
                (t = l
                  ? -Math.abs(i.attr("data-x")) + (o.x - n.x)
                  : -Math.abs(i.attr("data-x"))),
                s.core.s.useLeftForZoom
                  ? i.css({ left: t + "px", top: e + "px" })
                  : i.css(
                      "transform",
                      "translate3d(" + t + "px, " + e + "px, 0)"
                    ));
            }),
            u(window).on("mouseup.lg.zoom", function (t) {
              r &&
                ((r = !1),
                s.core.$outer.removeClass("lg-zoom-dragging"),
                !a ||
                  (n.x === o.x && n.y === o.y) ||
                  ((o = { x: t.pageX, y: t.pageY }),
                  s.touchendZoom(n, o, l, c)),
                (a = !1)),
                s.core.$outer.removeClass("lg-grabbing").addClass("lg-grab");
            });
        }),
        (t.prototype.touchendZoom = function (t, e, i, s) {
          var n = this,
            o = n.core.$slide.eq(n.core.index).find(".lg-img-wrap"),
            r = n.core.$slide.eq(n.core.index).find(".lg-object"),
            a = -Math.abs(o.attr("data-x")) + (e.x - t.x),
            l = -Math.abs(o.attr("data-y")) + (e.y - t.y),
            c =
              (n.core.$outer.find(".lg").height() - r.prop("offsetHeight")) / 2,
            u = Math.abs(
              r.prop("offsetHeight") * Math.abs(r.attr("data-scale")) -
                n.core.$outer.find(".lg").height() +
                c
            ),
            h = (n.core.$outer.find(".lg").width() - r.prop("offsetWidth")) / 2,
            r = Math.abs(
              r.prop("offsetWidth") * Math.abs(r.attr("data-scale")) -
                n.core.$outer.find(".lg").width() +
                h
            );
          (15 < Math.abs(e.x - t.x) || 15 < Math.abs(e.y - t.y)) &&
            (s && (l <= -u ? (l = -u) : -c <= l && (l = -c)),
            i && (a <= -r ? (a = -r) : -h <= a && (a = -h)),
            s
              ? o.attr("data-y", Math.abs(l))
              : (l = -Math.abs(o.attr("data-y"))),
            i
              ? o.attr("data-x", Math.abs(a))
              : (a = -Math.abs(o.attr("data-x"))),
            n.core.s.useLeftForZoom
              ? o.css({ left: a + "px", top: l + "px" })
              : o.css("transform", "translate3d(" + a + "px, " + l + "px, 0)"));
        }),
        (t.prototype.destroy = function () {
          var t = this;
          t.core.$el.off(".lg.zoom"),
            u(window).off(".lg.zoom"),
            t.core.$slide.off(".lg.zoom"),
            t.core.$el.off(".lg.tm.zoom"),
            t.resetZoom(),
            clearTimeout(t.zoomabletimeout),
            (t.zoomabletimeout = !1);
        }),
        (u.fn.lightGallery.modules.zoom = t);
    })();
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (i) {
    !(function () {
      "use strict";
      function t(t) {
        return (
          (this.core = i(t).data("lightGallery")),
          (this.core.s = i.extend({}, e, this.core.s)),
          this.core.s.hash &&
            ((this.oldHash = window.location.hash), this.init()),
          this
        );
      }
      var e = { hash: !0 };
      (t.prototype.init = function () {
        var e,
          s = this;
        s.core.$el.on("onAfterSlide.lg.tm", function (t, e, i) {
          history.replaceState
            ? history.replaceState(
                null,
                null,
                window.location.pathname +
                  window.location.search +
                  "#lg=" +
                  s.core.s.galleryId +
                  "&slide=" +
                  i
              )
            : (window.location.hash =
                "lg=" + s.core.s.galleryId + "&slide=" + i);
        }),
          i(window).on("hashchange.lg.hash", function () {
            e = window.location.hash;
            var t = parseInt(e.split("&slide=")[1], 10);
            -1 < e.indexOf("lg=" + s.core.s.galleryId)
              ? s.core.slide(t, !1, !1)
              : s.core.lGalleryOn && s.core.destroy();
          });
      }),
        (t.prototype.destroy = function () {
          this.core.s.hash &&
            (this.oldHash &&
            this.oldHash.indexOf("lg=" + this.core.s.galleryId) < 0
              ? history.replaceState
                ? history.replaceState(null, null, this.oldHash)
                : (window.location.hash = this.oldHash)
              : history.replaceState
              ? history.replaceState(
                  null,
                  document.title,
                  window.location.pathname + window.location.search
                )
              : (window.location.hash = ""),
            this.core.$el.off(".lg.hash"));
        }),
        (i.fn.lightGallery.modules.hash = t);
    })();
  }),
  (function (t) {
    "function" == typeof define && define.amd
      ? define(["jquery"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("jquery")))
      : t(jQuery);
  })(function (n) {
    !(function () {
      "use strict";
      function t(t) {
        return (
          (this.core = n(t).data("lightGallery")),
          (this.core.s = n.extend({}, e, this.core.s)),
          this.core.s.share && this.init(),
          this
        );
      }
      var e = {
        share: !0,
        facebook: !0,
        facebookDropdownText: "Facebook",
        twitter: !0,
        twitterDropdownText: "Twitter",
        googlePlus: !0,
        googlePlusDropdownText: "GooglePlus",
        pinterest: !0,
        pinterestDropdownText: "Pinterest",
      };
      (t.prototype.init = function () {
        var s = this,
          t =
            '<span id="lg-share" class="lg-icon"><ul class="lg-dropdown" style="position: absolute;">';
        (t += s.core.s.facebook
          ? '<li><a id="lg-share-facebook" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
            this.core.s.facebookDropdownText +
            "</span></a></li>"
          : ""),
          (t += s.core.s.twitter
            ? '<li><a id="lg-share-twitter" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.twitterDropdownText +
              "</span></a></li>"
            : ""),
          (t += s.core.s.googlePlus
            ? '<li><a id="lg-share-googleplus" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.googlePlusDropdownText +
              "</span></a></li>"
            : ""),
          (t += s.core.s.pinterest
            ? '<li><a id="lg-share-pinterest" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' +
              this.core.s.pinterestDropdownText +
              "</span></a></li>"
            : ""),
          (t += "</ul></span>"),
          this.core.$outer.find(".lg-toolbar").append(t),
          this.core.$outer
            .find(".lg")
            .append('<div id="lg-dropdown-overlay"></div>'),
          n("#lg-share").on("click.lg", function () {
            s.core.$outer.toggleClass("lg-dropdown-active");
          }),
          n("#lg-dropdown-overlay").on("click.lg", function () {
            s.core.$outer.removeClass("lg-dropdown-active");
          }),
          s.core.$el.on("onAfterSlide.lg.tm", function (t, e, i) {
            setTimeout(function () {
              n("#lg-share-facebook").attr(
                "href",
                "https://www.facebook.com/sharer/sharer.php?u=" +
                  encodeURIComponent(
                    s.getSahreProps(i, "facebookShareUrl") ||
                      window.location.href
                  )
              ),
                n("#lg-share-twitter").attr(
                  "href",
                  "https://twitter.com/intent/tweet?text=" +
                    s.getSahreProps(i, "tweetText") +
                    "&url=" +
                    encodeURIComponent(
                      s.getSahreProps(i, "twitterShareUrl") ||
                        window.location.href
                    )
                ),
                n("#lg-share-googleplus").attr(
                  "href",
                  "https://plus.google.com/share?url=" +
                    encodeURIComponent(
                      s.getSahreProps(i, "googleplusShareUrl") ||
                        window.location.href
                    )
                ),
                n("#lg-share-pinterest").attr(
                  "href",
                  "http://www.pinterest.com/pin/create/button/?url=" +
                    encodeURIComponent(
                      s.getSahreProps(i, "pinterestShareUrl") ||
                        window.location.href
                    ) +
                    "&media=" +
                    encodeURIComponent(s.getSahreProps(i, "src")) +
                    "&description=" +
                    s.getSahreProps(i, "pinterestText")
                );
            }, 100);
          });
      }),
        (t.prototype.getSahreProps = function (t, e) {
          var i;
          return this.core.s.dynamic
            ? this.core.s.dynamicEl[t][e]
            : ((i = this.core.$items.eq(t).attr("href")),
              (t = this.core.$items.eq(t).data(e)),
              ("src" === e && i) || t);
        }),
        (t.prototype.destroy = function () {}),
        (n.fn.lightGallery.modules.share = t);
    })();
  }),
  (function (l, i, s, a) {
    function c(t, e) {
      (this.settings = null),
        (this.options = l.extend({}, c.Defaults, e)),
        (this.$element = l(t)),
        (this._handlers = {}),
        (this._plugins = {}),
        (this._supress = {}),
        (this._current = null),
        (this._speed = null),
        (this._coordinates = []),
        (this._breakpoint = null),
        (this._width = null),
        (this._items = []),
        (this._clones = []),
        (this._mergers = []),
        (this._widths = []),
        (this._invalidated = {}),
        (this._pipe = []),
        (this._drag = {
          time: null,
          target: null,
          pointer: null,
          stage: { start: null, current: null },
          direction: null,
        }),
        (this._states = {
          current: {},
          tags: {
            initializing: ["busy"],
            animating: ["busy"],
            dragging: ["interacting"],
          },
        }),
        l.each(
          ["onResize", "onThrottledResize"],
          l.proxy(function (t, e) {
            this._handlers[e] = l.proxy(this[e], this);
          }, this)
        ),
        l.each(
          c.Plugins,
          l.proxy(function (t, e) {
            this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this);
          }, this)
        ),
        l.each(
          c.Workers,
          l.proxy(function (t, e) {
            this._pipe.push({ filter: e.filter, run: l.proxy(e.run, this) });
          }, this)
        ),
        this.setup(),
        this.initialize();
    }
    (c.Defaults = {
      items: 3,
      loop: !1,
      center: !1,
      rewind: !1,
      checkVisibility: !0,
      mouseDrag: !0,
      touchDrag: !0,
      pullDrag: !0,
      freeDrag: !1,
      margin: 0,
      stagePadding: 0,
      merge: !1,
      mergeFit: !0,
      autoWidth: !1,
      startPosition: 0,
      rtl: !1,
      smartSpeed: 250,
      fluidSpeed: !1,
      dragEndSpeed: !1,
      responsive: {},
      responsiveRefreshRate: 200,
      responsiveBaseElement: i,
      fallbackEasing: "swing",
      slideTransition: "",
      info: !1,
      nestedItemSelector: !1,
      itemElement: "div",
      stageElement: "div",
      refreshClass: "owl-refresh",
      loadedClass: "owl-loaded",
      loadingClass: "owl-loading",
      rtlClass: "owl-rtl",
      responsiveClass: "owl-responsive",
      dragClass: "owl-drag",
      itemClass: "owl-item",
      stageClass: "owl-stage",
      stageOuterClass: "owl-stage-outer",
      grabClass: "owl-grab",
    }),
      (c.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
      (c.Type = { Event: "event", State: "state" }),
      (c.Plugins = {}),
      (c.Workers = [
        {
          filter: ["width", "settings"],
          run: function () {
            this._width = this.$element.width();
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            t.current =
              this._items && this._items[this.relative(this._current)];
          },
        },
        {
          filter: ["items", "settings"],
          run: function () {
            this.$stage.children(".cloned").remove();
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            var e = this.settings.margin || "",
              i = !this.settings.autoWidth,
              s = this.settings.rtl,
              e = {
                width: "auto",
                "margin-left": s ? e : "",
                "margin-right": s ? "" : e,
              };
            i || this.$stage.children().css(e), (t.css = e);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            var e =
                (this.width() / this.settings.items).toFixed(3) -
                this.settings.margin,
              i = null,
              s = this._items.length,
              n = !this.settings.autoWidth,
              o = [];
            for (t.items = { merge: !1, width: e }; s--; )
              (i = this._mergers[s]),
                (i =
                  (this.settings.mergeFit &&
                    Math.min(i, this.settings.items)) ||
                  i),
                (t.items.merge = 1 < i || t.items.merge),
                (o[s] = n ? e * i : this._items[s].width());
            this._widths = o;
          },
        },
        {
          filter: ["items", "settings"],
          run: function () {
            var t = [],
              e = this._items,
              i = this.settings,
              s = Math.max(2 * i.items, 4),
              n = 2 * Math.ceil(e.length / 2),
              o = i.loop && e.length ? (i.rewind ? s : Math.max(s, n)) : 0,
              r = "",
              a = "";
            for (o /= 2; 0 < o; )
              t.push(this.normalize(t.length / 2, !0)),
                (r += e[t[t.length - 1]][0].outerHTML),
                t.push(this.normalize(e.length - 1 - (t.length - 1) / 2, !0)),
                (a = e[t[t.length - 1]][0].outerHTML + a),
                --o;
            (this._clones = t),
              l(r).addClass("cloned").appendTo(this.$stage),
              l(a).addClass("cloned").prependTo(this.$stage);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function () {
            for (
              var t,
                e,
                i = this.settings.rtl ? 1 : -1,
                s = this._clones.length + this._items.length,
                n = -1,
                o = [];
              ++n < s;

            )
              (t = o[n - 1] || 0),
                (e = this._widths[this.relative(n)] + this.settings.margin),
                o.push(t + e * i);
            this._coordinates = o;
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function () {
            var t = this.settings.stagePadding,
              e = this._coordinates,
              t = {
                width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
                "padding-left": t || "",
                "padding-right": t || "",
              };
            this.$stage.css(t);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            var e = this._coordinates.length,
              i = !this.settings.autoWidth,
              s = this.$stage.children();
            if (i && t.items.merge)
              for (; e--; )
                (t.css.width = this._widths[this.relative(e)]),
                  s.eq(e).css(t.css);
            else i && ((t.css.width = t.items.width), s.css(t.css));
          },
        },
        {
          filter: ["items"],
          run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style");
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            (t.current = t.current
              ? this.$stage.children().index(t.current)
              : 0),
              (t.current = Math.max(
                this.minimum(),
                Math.min(this.maximum(), t.current)
              )),
              this.reset(t.current);
          },
        },
        {
          filter: ["position"],
          run: function () {
            this.animate(this.coordinates(this._current));
          },
        },
        {
          filter: ["width", "position", "items", "settings"],
          run: function () {
            for (
              var t,
                e,
                i = this.settings.rtl ? 1 : -1,
                s = 2 * this.settings.stagePadding,
                n = this.coordinates(this.current()) + s,
                o = n + this.width() * i,
                r = [],
                a = 0,
                l = this._coordinates.length;
              a < l;
              a++
            )
              (t = this._coordinates[a - 1] || 0),
                (e = Math.abs(this._coordinates[a]) + s * i),
                ((this.op(t, "<=", n) && this.op(t, ">", o)) ||
                  (this.op(e, "<", n) && this.op(e, ">", o))) &&
                  r.push(a);
            this.$stage.children(".active").removeClass("active"),
              this.$stage
                .children(":eq(" + r.join("), :eq(") + ")")
                .addClass("active"),
              this.$stage.children(".center").removeClass("center"),
              this.settings.center &&
                this.$stage.children().eq(this.current()).addClass("center");
          },
        },
      ]),
      (c.prototype.initializeStage = function () {
        (this.$stage = this.$element.find("." + this.settings.stageClass)),
          this.$stage.length ||
            (this.$element.addClass(this.options.loadingClass),
            (this.$stage = l("<" + this.settings.stageElement + ">", {
              class: this.settings.stageClass,
            }).wrap(l("<div/>", { class: this.settings.stageOuterClass }))),
            this.$element.append(this.$stage.parent()));
      }),
      (c.prototype.initializeItems = function () {
        var t = this.$element.find(".owl-item");
        if (t.length)
          return (
            (this._items = t.get().map(function (t) {
              return l(t);
            })),
            (this._mergers = this._items.map(function () {
              return 1;
            })),
            void this.refresh()
          );
        this.replace(this.$element.children().not(this.$stage.parent())),
          this.isVisible() ? this.refresh() : this.invalidate("width"),
          this.$element
            .removeClass(this.options.loadingClass)
            .addClass(this.options.loadedClass);
      }),
      (c.prototype.initialize = function () {
        var t, e;
        this.enter("initializing"),
          this.trigger("initialize"),
          this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
          this.settings.autoWidth &&
            !this.is("pre-loading") &&
            ((t = this.$element.find("img")),
            (e = this.settings.nestedItemSelector
              ? "." + this.settings.nestedItemSelector
              : a),
            (e = this.$element.children(e).width()),
            t.length && e <= 0 && this.preloadAutoWidthImages(t)),
          this.initializeStage(),
          this.initializeItems(),
          this.registerEventHandlers(),
          this.leave("initializing"),
          this.trigger("initialized");
      }),
      (c.prototype.isVisible = function () {
        return !this.settings.checkVisibility || this.$element.is(":visible");
      }),
      (c.prototype.setup = function () {
        var e = this.viewport(),
          t = this.options.responsive,
          i = -1,
          s = null;
        t
          ? (l.each(t, function (t) {
              t <= e && i < t && (i = Number(t));
            }),
            "function" ==
              typeof (s = l.extend({}, this.options, t[i])).stagePadding &&
              (s.stagePadding = s.stagePadding()),
            delete s.responsive,
            s.responsiveClass &&
              this.$element.attr(
                "class",
                this.$element
                  .attr("class")
                  .replace(
                    new RegExp(
                      "(" + this.options.responsiveClass + "-)\\S+\\s",
                      "g"
                    ),
                    "$1" + i
                  )
              ))
          : (s = l.extend({}, this.options)),
          this.trigger("change", { property: { name: "settings", value: s } }),
          (this._breakpoint = i),
          (this.settings = s),
          this.invalidate("settings"),
          this.trigger("changed", {
            property: { name: "settings", value: this.settings },
          });
      }),
      (c.prototype.optionsLogic = function () {
        this.settings.autoWidth &&
          ((this.settings.stagePadding = !1), (this.settings.merge = !1));
      }),
      (c.prototype.prepare = function (t) {
        var e = this.trigger("prepare", { content: t });
        return (
          e.data ||
            (e.data = l("<" + this.settings.itemElement + "/>")
              .addClass(this.options.itemClass)
              .append(t)),
          this.trigger("prepared", { content: e.data }),
          e.data
        );
      }),
      (c.prototype.update = function () {
        for (
          var t = 0,
            e = this._pipe.length,
            i = l.proxy(function (t) {
              return this[t];
            }, this._invalidated),
            s = {};
          t < e;

        )
          (this._invalidated.all ||
            0 < l.grep(this._pipe[t].filter, i).length) &&
            this._pipe[t].run(s),
            t++;
        (this._invalidated = {}), this.is("valid") || this.enter("valid");
      }),
      (c.prototype.width = function (t) {
        switch ((t = t || c.Width.Default)) {
          case c.Width.Inner:
          case c.Width.Outer:
            return this._width;
          default:
            return (
              this._width -
              2 * this.settings.stagePadding +
              this.settings.margin
            );
        }
      }),
      (c.prototype.refresh = function () {
        this.enter("refreshing"),
          this.trigger("refresh"),
          this.setup(),
          this.optionsLogic(),
          this.$element.addClass(this.options.refreshClass),
          this.update(),
          this.$element.removeClass(this.options.refreshClass),
          this.leave("refreshing"),
          this.trigger("refreshed");
      }),
      (c.prototype.onThrottledResize = function () {
        i.clearTimeout(this.resizeTimer),
          (this.resizeTimer = i.setTimeout(
            this._handlers.onResize,
            this.settings.responsiveRefreshRate
          ));
      }),
      (c.prototype.onResize = function () {
        return (
          !!this._items.length &&
          this._width !== this.$element.width() &&
          !!this.isVisible() &&
          (this.enter("resizing"),
          this.trigger("resize").isDefaultPrevented()
            ? (this.leave("resizing"), !1)
            : (this.invalidate("width"),
              this.refresh(),
              this.leave("resizing"),
              void this.trigger("resized")))
        );
      }),
      (c.prototype.registerEventHandlers = function () {
        l.support.transition &&
          this.$stage.on(
            l.support.transition.end + ".owl.core",
            l.proxy(this.onTransitionEnd, this)
          ),
          !1 !== this.settings.responsive &&
            this.on(i, "resize", this._handlers.onThrottledResize),
          this.settings.mouseDrag &&
            (this.$element.addClass(this.options.dragClass),
            this.$stage.on(
              "mousedown.owl.core",
              l.proxy(this.onDragStart, this)
            ),
            this.$stage.on(
              "dragstart.owl.core selectstart.owl.core",
              function () {
                return !1;
              }
            )),
          this.settings.touchDrag &&
            (this.$stage.on(
              "touchstart.owl.core",
              l.proxy(this.onDragStart, this)
            ),
            this.$stage.on(
              "touchcancel.owl.core",
              l.proxy(this.onDragEnd, this)
            ));
      }),
      (c.prototype.onDragStart = function (t) {
        var e = null;
        3 !== t.which &&
          ((e = l.support.transform
            ? {
                x: (e = this.$stage
                  .css("transform")
                  .replace(/.*\(|\)| /g, "")
                  .split(","))[16 === e.length ? 12 : 4],
                y: e[16 === e.length ? 13 : 5],
              }
            : ((e = this.$stage.position()),
              {
                x: this.settings.rtl
                  ? e.left +
                    this.$stage.width() -
                    this.width() +
                    this.settings.margin
                  : e.left,
                y: e.top,
              })),
          this.is("animating") &&
            (l.support.transform ? this.animate(e.x) : this.$stage.stop(),
            this.invalidate("position")),
          this.$element.toggleClass(
            this.options.grabClass,
            "mousedown" === t.type
          ),
          this.speed(0),
          (this._drag.time = new Date().getTime()),
          (this._drag.target = l(t.target)),
          (this._drag.stage.start = e),
          (this._drag.stage.current = e),
          (this._drag.pointer = this.pointer(t)),
          l(s).on(
            "mouseup.owl.core touchend.owl.core",
            l.proxy(this.onDragEnd, this)
          ),
          l(s).one(
            "mousemove.owl.core touchmove.owl.core",
            l.proxy(function (t) {
              var e = this.difference(this._drag.pointer, this.pointer(t));
              l(s).on(
                "mousemove.owl.core touchmove.owl.core",
                l.proxy(this.onDragMove, this)
              ),
                (Math.abs(e.x) < Math.abs(e.y) && this.is("valid")) ||
                  (t.preventDefault(),
                  this.enter("dragging"),
                  this.trigger("drag"));
            }, this)
          ));
      }),
      (c.prototype.onDragMove = function (t) {
        var e,
          i = null,
          s = null,
          n = this.difference(this._drag.pointer, this.pointer(t)),
          o = this.difference(this._drag.stage.start, n);
        this.is("dragging") &&
          (t.preventDefault(),
          this.settings.loop
            ? ((i = this.coordinates(this.minimum())),
              (s = this.coordinates(this.maximum() + 1) - i),
              (o.x = ((((o.x - i) % s) + s) % s) + i))
            : ((i = this.settings.rtl
                ? this.coordinates(this.maximum())
                : this.coordinates(this.minimum())),
              (s = this.settings.rtl
                ? this.coordinates(this.minimum())
                : this.coordinates(this.maximum())),
              (e = this.settings.pullDrag ? (-1 * n.x) / 5 : 0),
              (o.x = Math.max(Math.min(o.x, i + e), s + e))),
          (this._drag.stage.current = o),
          this.animate(o.x));
      }),
      (c.prototype.onDragEnd = function (t) {
        var e = this.difference(this._drag.pointer, this.pointer(t)),
          i = this._drag.stage.current,
          t = (0 < e.x) ^ this.settings.rtl ? "left" : "right";
        l(s).off(".owl.core"),
          this.$element.removeClass(this.options.grabClass),
          ((0 !== e.x && this.is("dragging")) || !this.is("valid")) &&
            (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
            this.current(
              this.closest(i.x, 0 !== e.x ? t : this._drag.direction)
            ),
            this.invalidate("position"),
            this.update(),
            (this._drag.direction = t),
            (3 < Math.abs(e.x) ||
              300 < new Date().getTime() - this._drag.time) &&
              this._drag.target.one("click.owl.core", function () {
                return !1;
              })),
          this.is("dragging") &&
            (this.leave("dragging"), this.trigger("dragged"));
      }),
      (c.prototype.closest = function (i, s) {
        var n = -1,
          o = this.width(),
          r = this.coordinates();
        return (
          this.settings.freeDrag ||
            l.each(
              r,
              l.proxy(function (t, e) {
                return (
                  "left" === s && e - 30 < i && i < e + 30
                    ? (n = t)
                    : "right" === s && e - o - 30 < i && i < e - o + 30
                    ? (n = t + 1)
                    : this.op(i, "<", e) &&
                      this.op(i, ">", r[t + 1] !== a ? r[t + 1] : e - o) &&
                      (n = "left" === s ? t + 1 : t),
                  -1 === n
                );
              }, this)
            ),
          this.settings.loop ||
            (this.op(i, ">", r[this.minimum()])
              ? (n = i = this.minimum())
              : this.op(i, "<", r[this.maximum()]) && (n = i = this.maximum())),
          n
        );
      }),
      (c.prototype.animate = function (t) {
        var e = 0 < this.speed();
        this.is("animating") && this.onTransitionEnd(),
          e && (this.enter("animating"), this.trigger("translate")),
          l.support.transform3d && l.support.transition
            ? this.$stage.css({
                transform: "translate3d(" + t + "px,0px,0px)",
                transition:
                  this.speed() / 1e3 +
                  "s" +
                  (this.settings.slideTransition
                    ? " " + this.settings.slideTransition
                    : ""),
              })
            : e
            ? this.$stage.animate(
                { left: t + "px" },
                this.speed(),
                this.settings.fallbackEasing,
                l.proxy(this.onTransitionEnd, this)
              )
            : this.$stage.css({ left: t + "px" });
      }),
      (c.prototype.is = function (t) {
        return this._states.current[t] && 0 < this._states.current[t];
      }),
      (c.prototype.current = function (t) {
        return t === a
          ? this._current
          : 0 === this._items.length
          ? a
          : ((t = this.normalize(t)),
            this._current !== t &&
              ((e = this.trigger("change", {
                property: { name: "position", value: t },
              })).data !== a && (t = this.normalize(e.data)),
              (this._current = t),
              this.invalidate("position"),
              this.trigger("changed", {
                property: { name: "position", value: this._current },
              })),
            this._current);
        var e;
      }),
      (c.prototype.invalidate = function (t) {
        return (
          "string" === l.type(t) &&
            ((this._invalidated[t] = !0),
            this.is("valid") && this.leave("valid")),
          l.map(this._invalidated, function (t, e) {
            return e;
          })
        );
      }),
      (c.prototype.reset = function (t) {
        (t = this.normalize(t)) !== a &&
          ((this._speed = 0),
          (this._current = t),
          this.suppress(["translate", "translated"]),
          this.animate(this.coordinates(t)),
          this.release(["translate", "translated"]));
      }),
      (c.prototype.normalize = function (t, e) {
        var i = this._items.length,
          e = e ? 0 : this._clones.length;
        return (
          !this.isNumeric(t) || i < 1
            ? (t = a)
            : (t < 0 || i + e <= t) &&
              (t = ((((t - e / 2) % i) + i) % i) + e / 2),
          t
        );
      }),
      (c.prototype.relative = function (t) {
        return (t -= this._clones.length / 2), this.normalize(t, !0);
      }),
      (c.prototype.maximum = function (t) {
        var e,
          i,
          s,
          n = this.settings,
          o = this._coordinates.length;
        if (n.loop) o = this._clones.length / 2 + this._items.length - 1;
        else if (n.autoWidth || n.merge) {
          if ((e = this._items.length))
            for (
              i = this._items[--e].width(), s = this.$element.width();
              e-- &&
              !((i += this._items[e].width() + this.settings.margin) > s);

            );
          o = e + 1;
        } else
          o = n.center ? this._items.length - 1 : this._items.length - n.items;
        return t && (o -= this._clones.length / 2), Math.max(o, 0);
      }),
      (c.prototype.minimum = function (t) {
        return t ? 0 : this._clones.length / 2;
      }),
      (c.prototype.items = function (t) {
        return t === a
          ? this._items.slice()
          : ((t = this.normalize(t, !0)), this._items[t]);
      }),
      (c.prototype.mergers = function (t) {
        return t === a
          ? this._mergers.slice()
          : ((t = this.normalize(t, !0)), this._mergers[t]);
      }),
      (c.prototype.clones = function (i) {
        function s(t) {
          return t % 2 == 0 ? n + t / 2 : e - (t + 1) / 2;
        }
        var e = this._clones.length / 2,
          n = e + this._items.length;
        return i === a
          ? l.map(this._clones, function (t, e) {
              return s(e);
            })
          : l.map(this._clones, function (t, e) {
              return t === i ? s(e) : null;
            });
      }),
      (c.prototype.speed = function (t) {
        return t !== a && (this._speed = t), this._speed;
      }),
      (c.prototype.coordinates = function (t) {
        var e,
          i = 1,
          s = t - 1;
        return t === a
          ? l.map(
              this._coordinates,
              l.proxy(function (t, e) {
                return this.coordinates(e);
              }, this)
            )
          : (this.settings.center
              ? (this.settings.rtl && ((i = -1), (s = t + 1)),
                (e = this._coordinates[t]),
                (e +=
                  ((this.width() - e + (this._coordinates[s] || 0)) / 2) * i))
              : (e = this._coordinates[s] || 0),
            Math.ceil(e));
      }),
      (c.prototype.duration = function (t, e, i) {
        return 0 === i
          ? 0
          : Math.min(Math.max(Math.abs(e - t), 1), 6) *
              Math.abs(i || this.settings.smartSpeed);
      }),
      (c.prototype.to = function (t, e) {
        var i,
          s = this.current(),
          n = t - this.relative(s),
          o = (0 < n) - (n < 0),
          r = this._items.length,
          a = this.minimum(),
          l = this.maximum();
        this.settings.loop
          ? (!this.settings.rewind && Math.abs(n) > r / 2 && (n += -1 * o * r),
            (i = (((((t = s + n) - a) % r) + r) % r) + a) !== t &&
              i - n <= l &&
              0 < i - n &&
              this.reset((s = (t = i) - n)))
          : (t = this.settings.rewind
              ? ((t % (l += 1)) + l) % l
              : Math.max(a, Math.min(l, t))),
          this.speed(this.duration(s, t, e)),
          this.current(t),
          this.isVisible() && this.update();
      }),
      (c.prototype.next = function (t) {
        (t = t || !1), this.to(this.relative(this.current()) + 1, t);
      }),
      (c.prototype.prev = function (t) {
        (t = t || !1), this.to(this.relative(this.current()) - 1, t);
      }),
      (c.prototype.onTransitionEnd = function (t) {
        if (
          t !== a &&
          (t.stopPropagation(),
          (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))
        )
          return !1;
        this.leave("animating"), this.trigger("translated");
      }),
      (c.prototype.viewport = function () {
        var t;
        return (
          this.options.responsiveBaseElement !== i
            ? (t = l(this.options.responsiveBaseElement).width())
            : i.innerWidth
            ? (t = i.innerWidth)
            : s.documentElement && s.documentElement.clientWidth
            ? (t = s.documentElement.clientWidth)
            : console.warn("Can not detect viewport width."),
          t
        );
      }),
      (c.prototype.replace = function (t) {
        this.$stage.empty(),
          (this._items = []),
          (t = t && (t instanceof jQuery ? t : l(t))),
          (t = this.settings.nestedItemSelector
            ? t.find("." + this.settings.nestedItemSelector)
            : t)
            .filter(function () {
              return 1 === this.nodeType;
            })
            .each(
              l.proxy(function (t, e) {
                (e = this.prepare(e)),
                  this.$stage.append(e),
                  this._items.push(e),
                  this._mergers.push(
                    +e
                      .find("[data-merge]")
                      .addBack("[data-merge]")
                      .attr("data-merge") || 1
                  );
              }, this)
            ),
          this.reset(
            this.isNumeric(this.settings.startPosition)
              ? this.settings.startPosition
              : 0
          ),
          this.invalidate("items");
      }),
      (c.prototype.add = function (t, e) {
        var i = this.relative(this._current);
        (e = e === a ? this._items.length : this.normalize(e, !0)),
          (t = t instanceof jQuery ? t : l(t)),
          this.trigger("add", { content: t, position: e }),
          (t = this.prepare(t)),
          0 === this._items.length || e === this._items.length
            ? (0 === this._items.length && this.$stage.append(t),
              0 !== this._items.length && this._items[e - 1].after(t),
              this._items.push(t),
              this._mergers.push(
                +t
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
              ))
            : (this._items[e].before(t),
              this._items.splice(e, 0, t),
              this._mergers.splice(
                e,
                0,
                +t
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
              )),
          this._items[i] && this.reset(this._items[i].index()),
          this.invalidate("items"),
          this.trigger("added", { content: t, position: e });
      }),
      (c.prototype.remove = function (t) {
        (t = this.normalize(t, !0)) !== a &&
          (this.trigger("remove", { content: this._items[t], position: t }),
          this._items[t].remove(),
          this._items.splice(t, 1),
          this._mergers.splice(t, 1),
          this.invalidate("items"),
          this.trigger("removed", { content: null, position: t }));
      }),
      (c.prototype.preloadAutoWidthImages = function (t) {
        t.each(
          l.proxy(function (t, e) {
            this.enter("pre-loading"),
              (e = l(e)),
              l(new Image())
                .one(
                  "load",
                  l.proxy(function (t) {
                    e.attr("src", t.target.src),
                      e.css("opacity", 1),
                      this.leave("pre-loading"),
                      this.is("pre-loading") ||
                        this.is("initializing") ||
                        this.refresh();
                  }, this)
                )
                .attr(
                  "src",
                  e.attr("src") ||
                    e.attr("data-src") ||
                    e.attr("data-src-retina")
                );
          }, this)
        );
      }),
      (c.prototype.destroy = function () {
        for (var t in (this.$element.off(".owl.core"),
        this.$stage.off(".owl.core"),
        l(s).off(".owl.core"),
        !1 !== this.settings.responsive &&
          (i.clearTimeout(this.resizeTimer),
          this.off(i, "resize", this._handlers.onThrottledResize)),
        this._plugins))
          this._plugins[t].destroy();
        this.$stage.children(".cloned").remove(),
          this.$stage.unwrap(),
          this.$stage.children().contents().unwrap(),
          this.$stage.children().unwrap(),
          this.$stage.remove(),
          this.$element
            .removeClass(this.options.refreshClass)
            .removeClass(this.options.loadingClass)
            .removeClass(this.options.loadedClass)
            .removeClass(this.options.rtlClass)
            .removeClass(this.options.dragClass)
            .removeClass(this.options.grabClass)
            .attr(
              "class",
              this.$element
                .attr("class")
                .replace(
                  new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                  ""
                )
            )
            .removeData("owl.carousel");
      }),
      (c.prototype.op = function (t, e, i) {
        var s = this.settings.rtl;
        switch (e) {
          case "<":
            return s ? i < t : t < i;
          case ">":
            return s ? t < i : i < t;
          case ">=":
            return s ? t <= i : i <= t;
          case "<=":
            return s ? i <= t : t <= i;
        }
      }),
      (c.prototype.on = function (t, e, i, s) {
        t.addEventListener
          ? t.addEventListener(e, i, s)
          : t.attachEvent && t.attachEvent("on" + e, i);
      }),
      (c.prototype.off = function (t, e, i, s) {
        t.removeEventListener
          ? t.removeEventListener(e, i, s)
          : t.detachEvent && t.detachEvent("on" + e, i);
      }),
      (c.prototype.trigger = function (t, e, i, s, n) {
        var o = { item: { count: this._items.length, index: this.current() } },
          r = l.camelCase(
            l
              .grep(["on", t, i], function (t) {
                return t;
              })
              .join("-")
              .toLowerCase()
          ),
          a = l.Event(
            [t, "owl", i || "carousel"].join(".").toLowerCase(),
            l.extend({ relatedTarget: this }, o, e)
          );
        return (
          this._supress[t] ||
            (l.each(this._plugins, function (t, e) {
              e.onTrigger && e.onTrigger(a);
            }),
            this.register({ type: c.Type.Event, name: t }),
            this.$element.trigger(a),
            this.settings &&
              "function" == typeof this.settings[r] &&
              this.settings[r].call(this, a)),
          a
        );
      }),
      (c.prototype.enter = function (t) {
        l.each(
          [t].concat(this._states.tags[t] || []),
          l.proxy(function (t, e) {
            this._states.current[e] === a && (this._states.current[e] = 0),
              this._states.current[e]++;
          }, this)
        );
      }),
      (c.prototype.leave = function (t) {
        l.each(
          [t].concat(this._states.tags[t] || []),
          l.proxy(function (t, e) {
            this._states.current[e]--;
          }, this)
        );
      }),
      (c.prototype.register = function (i) {
        var e;
        i.type === c.Type.Event
          ? (l.event.special[i.name] || (l.event.special[i.name] = {}),
            l.event.special[i.name].owl ||
              ((e = l.event.special[i.name]._default),
              (l.event.special[i.name]._default = function (t) {
                return !e ||
                  !e.apply ||
                  (t.namespace && -1 !== t.namespace.indexOf("owl"))
                  ? t.namespace && -1 < t.namespace.indexOf("owl")
                  : e.apply(this, arguments);
              }),
              (l.event.special[i.name].owl = !0)))
          : i.type === c.Type.State &&
            (this._states.tags[i.name]
              ? (this._states.tags[i.name] = this._states.tags[i.name].concat(
                  i.tags
                ))
              : (this._states.tags[i.name] = i.tags),
            (this._states.tags[i.name] = l.grep(
              this._states.tags[i.name],
              l.proxy(function (t, e) {
                return l.inArray(t, this._states.tags[i.name]) === e;
              }, this)
            )));
      }),
      (c.prototype.suppress = function (t) {
        l.each(
          t,
          l.proxy(function (t, e) {
            this._supress[e] = !0;
          }, this)
        );
      }),
      (c.prototype.release = function (t) {
        l.each(
          t,
          l.proxy(function (t, e) {
            delete this._supress[e];
          }, this)
        );
      }),
      (c.prototype.pointer = function (t) {
        var e = { x: null, y: null };
        return (
          (t =
            (t = t.originalEvent || t || i.event).touches && t.touches.length
              ? t.touches[0]
              : t.changedTouches && t.changedTouches.length
              ? t.changedTouches[0]
              : t).pageX
            ? ((e.x = t.pageX), (e.y = t.pageY))
            : ((e.x = t.clientX), (e.y = t.clientY)),
          e
        );
      }),
      (c.prototype.isNumeric = function (t) {
        return !isNaN(parseFloat(t));
      }),
      (c.prototype.difference = function (t, e) {
        return { x: t.x - e.x, y: t.y - e.y };
      }),
      (l.fn.owlCarousel = function (e) {
        var s = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
          var t = l(this),
            i = t.data("owl.carousel");
          i ||
            ((i = new c(this, "object" == typeof e && e)),
            t.data("owl.carousel", i),
            l.each(
              [
                "next",
                "prev",
                "to",
                "destroy",
                "refresh",
                "replace",
                "add",
                "remove",
              ],
              function (t, e) {
                i.register({ type: c.Type.Event, name: e }),
                  i.$element.on(
                    e + ".owl.carousel.core",
                    l.proxy(function (t) {
                      t.namespace &&
                        t.relatedTarget !== this &&
                        (this.suppress([e]),
                        i[e].apply(this, [].slice.call(arguments, 1)),
                        this.release([e]));
                    }, i)
                  );
              }
            )),
            "string" == typeof e && "_" !== e.charAt(0) && i[e].apply(i, s);
        });
      }),
      (l.fn.owlCarousel.Constructor = c);
  })(window.Zepto || window.jQuery, window, document),
  (function (e, i) {
    var s = function (t) {
      (this._core = t),
        (this._interval = null),
        (this._visible = null),
        (this._handlers = {
          "initialized.owl.carousel": e.proxy(function (t) {
            t.namespace && this._core.settings.autoRefresh && this.watch();
          }, this),
        }),
        (this._core.options = e.extend({}, s.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (s.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
      (s.prototype.watch = function () {
        this._interval ||
          ((this._visible = this._core.isVisible()),
          (this._interval = i.setInterval(
            e.proxy(this.refresh, this),
            this._core.settings.autoRefreshInterval
          )));
      }),
      (s.prototype.refresh = function () {
        this._core.isVisible() !== this._visible &&
          ((this._visible = !this._visible),
          this._core.$element.toggleClass("owl-hidden", !this._visible),
          this._visible &&
            this._core.invalidate("width") &&
            this._core.refresh());
      }),
      (s.prototype.destroy = function () {
        var t, e;
        for (t in (i.clearInterval(this._interval), this._handlers))
          this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (e.fn.owlCarousel.Constructor.Plugins.AutoRefresh = s);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, n) {
    var e = function (t) {
      (this._core = t),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel resized.owl.carousel":
            a.proxy(function (t) {
              if (
                t.namespace &&
                this._core.settings &&
                this._core.settings.lazyLoad &&
                ((t.property && "position" == t.property.name) ||
                  "initialized" == t.type)
              ) {
                var e = this._core.settings,
                  i = (e.center && Math.ceil(e.items / 2)) || e.items,
                  s = (e.center && -1 * i) || 0,
                  n =
                    (t.property && void 0 !== t.property.value
                      ? t.property.value
                      : this._core.current()) + s,
                  o = this._core.clones().length,
                  r = a.proxy(function (t, e) {
                    this.load(e);
                  }, this);
                for (
                  0 < e.lazyLoadEager &&
                  ((i += e.lazyLoadEager),
                  e.loop && ((n -= e.lazyLoadEager), i++));
                  s++ < i;

                )
                  this.load(o / 2 + this._core.relative(n)),
                    o && a.each(this._core.clones(this._core.relative(n)), r),
                    n++;
              }
            }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
      (e.prototype.load = function (t) {
        var e = this._core.$stage.children().eq(t),
          t = e && e.find(".owl-lazy");
        !t ||
          -1 < a.inArray(e.get(0), this._loaded) ||
          (t.each(
            a.proxy(function (t, e) {
              var i = a(e),
                s =
                  (1 < n.devicePixelRatio && i.attr("data-src-retina")) ||
                  i.attr("data-src") ||
                  i.attr("data-srcset");
              this._core.trigger("load", { element: i, url: s }, "lazy"),
                i.is("img")
                  ? i
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          i.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: i, url: s },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", s)
                  : i.is("source")
                  ? i
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          this._core.trigger(
                            "loaded",
                            { element: i, url: s },
                            "lazy"
                          );
                        }, this)
                      )
                      .attr("srcset", s)
                  : (((e = new Image()).onload = a.proxy(function () {
                      i.css({
                        "background-image": 'url("' + s + '")',
                        opacity: "1",
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: i, url: s },
                          "lazy"
                        );
                    }, this)),
                    (e.src = s));
            }, this)
          ),
          this._loaded.push(e.get(0)));
      }),
      (e.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Lazy = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (n, i) {
    var s = function (t) {
      (this._core = t),
        (this._previousHeight = null),
        (this._handlers = {
          "initialized.owl.carousel refreshed.owl.carousel": n.proxy(function (
            t
          ) {
            t.namespace && this._core.settings.autoHeight && this.update();
          },
          this),
          "changed.owl.carousel": n.proxy(function (t) {
            t.namespace &&
              this._core.settings.autoHeight &&
              "position" === t.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": n.proxy(function (t) {
            t.namespace &&
              this._core.settings.autoHeight &&
              t.element.closest("." + this._core.settings.itemClass).index() ===
                this._core.current() &&
              this.update();
          }, this),
        }),
        (this._core.options = n.extend({}, s.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        (this._intervalId = null);
      var e = this;
      n(i).on("load", function () {
        e._core.settings.autoHeight && e.update();
      }),
        n(i).resize(function () {
          e._core.settings.autoHeight &&
            (null != e._intervalId && clearTimeout(e._intervalId),
            (e._intervalId = setTimeout(function () {
              e.update();
            }, 250)));
        });
    };
    (s.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (s.prototype.update = function () {
        var t = this._core._current,
          e = t + this._core.settings.items,
          i = this._core.settings.lazyLoad,
          t = this._core.$stage.children().toArray().slice(t, e),
          s = [],
          e = 0;
        n.each(t, function (t, e) {
          s.push(n(e).height());
        }),
          (e = Math.max.apply(null, s)) <= 1 &&
            i &&
            this._previousHeight &&
            (e = this._previousHeight),
          (this._previousHeight = e),
          this._core.$stage
            .parent()
            .height(e)
            .addClass(this._core.settings.autoHeightClass);
      }),
      (s.prototype.destroy = function () {
        var t, e;
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (n.fn.owlCarousel.Constructor.Plugins.AutoHeight = s);
  })(window.Zepto || window.jQuery, window, document),
  (function (u, e) {
    var i = function (t) {
      (this._core = t),
        (this._videos = {}),
        (this._playing = null),
        (this._handlers = {
          "initialized.owl.carousel": u.proxy(function (t) {
            t.namespace &&
              this._core.register({
                type: "state",
                name: "playing",
                tags: ["interacting"],
              });
          }, this),
          "resize.owl.carousel": u.proxy(function (t) {
            t.namespace &&
              this._core.settings.video &&
              this.isInFullScreen() &&
              t.preventDefault();
          }, this),
          "refreshed.owl.carousel": u.proxy(function (t) {
            t.namespace &&
              this._core.is("resizing") &&
              this._core.$stage.find(".cloned .owl-video-frame").remove();
          }, this),
          "changed.owl.carousel": u.proxy(function (t) {
            t.namespace &&
              "position" === t.property.name &&
              this._playing &&
              this.stop();
          }, this),
          "prepared.owl.carousel": u.proxy(function (t) {
            var e;
            !t.namespace ||
              ((e = u(t.content).find(".owl-video")).length &&
                (e.css("display", "none"), this.fetch(e, u(t.content))));
          }, this),
        }),
        (this._core.options = u.extend({}, i.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          u.proxy(function (t) {
            this.play(t);
          }, this)
        );
    };
    (i.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (i.prototype.fetch = function (t, e) {
        var i = t.attr("data-vimeo-id")
            ? "vimeo"
            : t.attr("data-vzaar-id")
            ? "vzaar"
            : "youtube",
          s =
            t.attr("data-vimeo-id") ||
            t.attr("data-youtube-id") ||
            t.attr("data-vzaar-id"),
          n = t.attr("data-width") || this._core.settings.videoWidth,
          o = t.attr("data-height") || this._core.settings.videoHeight,
          r = t.attr("href");
        if (!r) throw new Error("Missing video URL.");
        if (
          -1 <
          (s = r.match(
            /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          ))[3].indexOf("youtu")
        )
          i = "youtube";
        else if (-1 < s[3].indexOf("vimeo")) i = "vimeo";
        else {
          if (!(-1 < s[3].indexOf("vzaar")))
            throw new Error("Video URL not supported.");
          i = "vzaar";
        }
        (s = s[6]),
          (this._videos[r] = { type: i, id: s, width: n, height: o }),
          e.attr("data-video", r),
          this.thumbnail(t, this._videos[r]);
      }),
      (i.prototype.thumbnail = function (e, t) {
        function i(t) {
          (s = c.lazyLoad
            ? u("<div/>", { class: "owl-video-tn " + l, srcType: t })
            : u("<div/>", {
                class: "owl-video-tn",
                style: "opacity:1;background-image:url(" + t + ")",
              })),
            e.after(s),
            e.after('<div class="owl-video-play-icon"></div>');
        }
        var s,
          n,
          o =
            t.width && t.height
              ? "width:" + t.width + "px;height:" + t.height + "px;"
              : "",
          r = e.find("img"),
          a = "src",
          l = "",
          c = this._core.settings;
        if (
          (e.wrap(u("<div/>", { class: "owl-video-wrapper", style: o })),
          this._core.settings.lazyLoad && ((a = "data-src"), (l = "owl-lazy")),
          r.length)
        )
          return i(r.attr(a)), r.remove(), !1;
        "youtube" === t.type
          ? ((n = "//img.youtube.com/vi/" + t.id + "/hqdefault.jpg"), i(n))
          : "vimeo" === t.type
          ? u.ajax({
              type: "GET",
              url: "//vimeo.com/api/v2/video/" + t.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (t) {
                (n = t[0].thumbnail_large), i(n);
              },
            })
          : "vzaar" === t.type &&
            u.ajax({
              type: "GET",
              url: "//vzaar.com/api/videos/" + t.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (t) {
                (n = t.framegrab_url), i(n);
              },
            });
      }),
      (i.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null),
          this._core.leave("playing"),
          this._core.trigger("stopped", null, "video");
      }),
      (i.prototype.play = function (t) {
        var e = u(t.target).closest("." + this._core.settings.itemClass),
          i = this._videos[e.attr("data-video")],
          s = i.width || "100%",
          n = i.height || this._core.$stage.height();
        this._playing ||
          (this._core.enter("playing"),
          this._core.trigger("play", null, "video"),
          (e = this._core.items(this._core.relative(e.index()))),
          this._core.reset(e.index()),
          (t = u(
            '<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'
          )).attr("height", n),
          t.attr("width", s),
          "youtube" === i.type
            ? t.attr(
                "src",
                "//www.youtube.com/embed/" +
                  i.id +
                  "?autoplay=1&rel=0&v=" +
                  i.id
              )
            : "vimeo" === i.type
            ? t.attr("src", "//player.vimeo.com/video/" + i.id + "?autoplay=1")
            : "vzaar" === i.type &&
              t.attr(
                "src",
                "//view.vzaar.com/" + i.id + "/player?autoplay=true"
              ),
          u(t)
            .wrap('<div class="owl-video-frame" />')
            .insertAfter(e.find(".owl-video")),
          (this._playing = e.addClass("owl-video-playing")));
      }),
      (i.prototype.isInFullScreen = function () {
        var t =
          e.fullscreenElement ||
          e.mozFullScreenElement ||
          e.webkitFullscreenElement;
        return t && u(t).parent().hasClass("owl-video-frame");
      }),
      (i.prototype.destroy = function () {
        var t, e;
        for (t in (this._core.$element.off("click.owl.video"), this._handlers))
          this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (u.fn.owlCarousel.Constructor.Plugins.Video = i);
  })(window.Zepto || window.jQuery, (window, document)),
  (function (r) {
    var e = function (t) {
      (this.core = t),
        (this.core.options = r.extend({}, e.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = void 0),
        (this.next = void 0),
        (this.handlers = {
          "change.owl.carousel": r.proxy(function (t) {
            t.namespace &&
              "position" == t.property.name &&
              ((this.previous = this.core.current()),
              (this.next = t.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
            r.proxy(function (t) {
              t.namespace && (this.swapping = "translated" == t.type);
            }, this),
          "translate.owl.carousel": r.proxy(function (t) {
            t.namespace &&
              this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (e.Defaults = { animateOut: !1, animateIn: !1 }),
      (e.prototype.swap = function () {
        var t, e, i, s, n, o;
        1 === this.core.settings.items &&
          r.support.animation &&
          r.support.transition &&
          (this.core.speed(0),
          (e = r.proxy(this.clear, this)),
          (i = this.core.$stage.children().eq(this.previous)),
          (s = this.core.$stage.children().eq(this.next)),
          (n = this.core.settings.animateIn),
          (o = this.core.settings.animateOut),
          this.core.current() !== this.previous &&
            (o &&
              ((t =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              i
                .one(r.support.animation.end, e)
                .css({ left: t + "px" })
                .addClass("animated owl-animated-out")
                .addClass(o)),
            n &&
              s
                .one(r.support.animation.end, e)
                .addClass("animated owl-animated-in")
                .addClass(n)));
      }),
      (e.prototype.clear = function (t) {
        r(t.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.onTransitionEnd();
      }),
      (e.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (r.fn.owlCarousel.Constructor.Plugins.Animate = e);
  })(window.Zepto || window.jQuery, (window, document)),
  (function (s, n, e) {
    var i = function (t) {
      (this._core = t),
        (this._call = null),
        (this._time = 0),
        (this._timeout = 0),
        (this._paused = !0),
        (this._handlers = {
          "changed.owl.carousel": s.proxy(function (t) {
            t.namespace && "settings" === t.property.name
              ? this._core.settings.autoplay
                ? this.play()
                : this.stop()
              : t.namespace &&
                "position" === t.property.name &&
                this._paused &&
                (this._time = 0);
          }, this),
          "initialized.owl.carousel": s.proxy(function (t) {
            t.namespace && this._core.settings.autoplay && this.play();
          }, this),
          "play.owl.autoplay": s.proxy(function (t, e, i) {
            t.namespace && this.play(e, i);
          }, this),
          "stop.owl.autoplay": s.proxy(function (t) {
            t.namespace && this.stop();
          }, this),
          "mouseover.owl.autoplay": s.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "mouseleave.owl.autoplay": s.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.play();
          }, this),
          "touchstart.owl.core": s.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "touchend.owl.core": s.proxy(function () {
            this._core.settings.autoplayHoverPause && this.play();
          }, this),
        }),
        this._core.$element.on(this._handlers),
        (this._core.options = s.extend({}, i.Defaults, this._core.options));
    };
    (i.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1,
    }),
      (i.prototype._next = function (t) {
        (this._call = n.setTimeout(
          s.proxy(this._next, this, t),
          this._timeout * (Math.round(this.read() / this._timeout) + 1) -
            this.read()
        )),
          this._core.is("interacting") ||
            e.hidden ||
            this._core.next(t || this._core.settings.autoplaySpeed);
      }),
      (i.prototype.read = function () {
        return new Date().getTime() - this._time;
      }),
      (i.prototype.play = function (t, e) {
        var i;
        this._core.is("rotating") || this._core.enter("rotating"),
          (t = t || this._core.settings.autoplayTimeout),
          (i = Math.min(this._time % (this._timeout || t), t)),
          this._paused
            ? ((this._time = this.read()), (this._paused = !1))
            : n.clearTimeout(this._call),
          (this._time += (this.read() % t) - i),
          (this._timeout = t),
          (this._call = n.setTimeout(s.proxy(this._next, this, e), t - i));
      }),
      (i.prototype.stop = function () {
        this._core.is("rotating") &&
          ((this._time = 0),
          (this._paused = !0),
          n.clearTimeout(this._call),
          this._core.leave("rotating"));
      }),
      (i.prototype.pause = function () {
        this._core.is("rotating") &&
          !this._paused &&
          ((this._time = this.read()),
          (this._paused = !0),
          n.clearTimeout(this._call));
      }),
      (i.prototype.destroy = function () {
        var t, e;
        for (t in (this.stop(), this._handlers))
          this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (s.fn.owlCarousel.Constructor.Plugins.autoplay = i);
  })(window.Zepto || window.jQuery, window, document),
  (function (n) {
    "use strict";
    var e = function (t) {
      (this._core = t),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to,
        }),
        (this._handlers = {
          "prepared.owl.carousel": n.proxy(function (t) {
            t.namespace &&
              this._core.settings.dotsData &&
              this._templates.push(
                '<div class="' +
                  this._core.settings.dotClass +
                  '">' +
                  n(t.content)
                    .find("[data-dot]")
                    .addBack("[data-dot]")
                    .attr("data-dot") +
                  "</div>"
              );
          }, this),
          "added.owl.carousel": n.proxy(function (t) {
            t.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(t.position, 0, this._templates.pop());
          }, this),
          "remove.owl.carousel": n.proxy(function (t) {
            t.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(t.position, 1);
          }, this),
          "changed.owl.carousel": n.proxy(function (t) {
            t.namespace && "position" == t.property.name && this.draw();
          }, this),
          "initialized.owl.carousel": n.proxy(function (t) {
            t.namespace &&
              !this._initialized &&
              (this._core.trigger("initialize", null, "navigation"),
              this.initialize(),
              this.update(),
              this.draw(),
              (this._initialized = !0),
              this._core.trigger("initialized", null, "navigation"));
          }, this),
          "refreshed.owl.carousel": n.proxy(function (t) {
            t.namespace &&
              this._initialized &&
              (this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation"));
          }, this),
        }),
        (this._core.options = n.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (e.Defaults = {
      nav: !1,
      navText: [
        '<span aria-label="Previous">&#x2039;</span>',
        '<span aria-label="Next">&#x203a;</span>',
      ],
      navSpeed: !1,
      navElement: 'button type="button" role="presentation"',
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotsData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
    }),
      (e.prototype.initialize = function () {
        var t,
          i = this._core.settings;
        for (t in ((this._controls.$relative = (
          i.navContainer
            ? n(i.navContainer)
            : n("<div>").addClass(i.navContainerClass).appendTo(this.$element)
        ).addClass("disabled")),
        (this._controls.$previous = n("<" + i.navElement + ">")
          .addClass(i.navClass[0])
          .html(i.navText[0])
          .prependTo(this._controls.$relative)
          .on(
            "click",
            n.proxy(function (t) {
              this.prev(i.navSpeed);
            }, this)
          )),
        (this._controls.$next = n("<" + i.navElement + ">")
          .addClass(i.navClass[1])
          .html(i.navText[1])
          .appendTo(this._controls.$relative)
          .on(
            "click",
            n.proxy(function (t) {
              this.next(i.navSpeed);
            }, this)
          )),
        i.dotsData ||
          (this._templates = [
            n('<button role="button">')
              .addClass(i.dotClass)
              .append(n("<span>"))
              .prop("outerHTML"),
          ]),
        (this._controls.$absolute = (
          i.dotsContainer
            ? n(i.dotsContainer)
            : n("<div>").addClass(i.dotsClass).appendTo(this.$element)
        ).addClass("disabled")),
        this._controls.$absolute.on(
          "click",
          "button",
          n.proxy(function (t) {
            var e = (
              n(t.target).parent().is(this._controls.$absolute)
                ? n(t.target)
                : n(t.target).parent()
            ).index();
            t.preventDefault(), this.to(e, i.dotsSpeed);
          }, this)
        ),
        this._overrides))
          this._core[t] = n.proxy(this[t], this);
      }),
      (e.prototype.destroy = function () {
        var t,
          e,
          i,
          s,
          n = this._core.settings;
        for (t in this._handlers) this.$element.off(t, this._handlers[t]);
        for (e in this._controls)
          "$relative" === e && n.navContainer
            ? this._controls[e].html("")
            : this._controls[e].remove();
        for (s in this.overides) this._core[s] = this._overrides[s];
        for (i in Object.getOwnPropertyNames(this))
          "function" != typeof this[i] && (this[i] = null);
      }),
      (e.prototype.update = function () {
        var t,
          e,
          i = this._core.clones().length / 2,
          s = i + this._core.items().length,
          n = this._core.maximum(!0),
          o = this._core.settings,
          r = o.center || o.autoWidth || o.dotsData ? 1 : o.dotsEach || o.items;
        if (
          ("page" !== o.slideBy && (o.slideBy = Math.min(o.slideBy, o.items)),
          o.dots || "page" == o.slideBy)
        )
          for (this._pages = [], t = i, e = 0; t < s; t++) {
            if (r <= e || 0 === e) {
              if (
                (this._pages.push({
                  start: Math.min(n, t - i),
                  end: t - i + r - 1,
                }),
                Math.min(n, t - i) === n)
              )
                break;
              (e = 0), 0;
            }
            e += this._core.mergers(this._core.relative(t));
          }
      }),
      (e.prototype.draw = function () {
        var t = this._core.settings,
          e = this._core.items().length <= t.items,
          i = this._core.relative(this._core.current()),
          s = t.loop || t.rewind;
        this._controls.$relative.toggleClass("disabled", !t.nav || e),
          t.nav &&
            (this._controls.$previous.toggleClass(
              "disabled",
              !s && i <= this._core.minimum(!0)
            ),
            this._controls.$next.toggleClass(
              "disabled",
              !s && i >= this._core.maximum(!0)
            )),
          this._controls.$absolute.toggleClass("disabled", !t.dots || e),
          t.dots &&
            ((e =
              this._pages.length - this._controls.$absolute.children().length),
            t.dotsData && 0 != e
              ? this._controls.$absolute.html(this._templates.join(""))
              : 0 < e
              ? this._controls.$absolute.append(
                  new Array(1 + e).join(this._templates[0])
                )
              : e < 0 && this._controls.$absolute.children().slice(e).remove(),
            this._controls.$absolute.find(".active").removeClass("active"),
            this._controls.$absolute
              .children()
              .eq(n.inArray(this.current(), this._pages))
              .addClass("active"));
      }),
      (e.prototype.onTrigger = function (t) {
        var e = this._core.settings;
        t.page = {
          index: n.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            e &&
            (e.center || e.autoWidth || e.dotsData ? 1 : e.dotsEach || e.items),
        };
      }),
      (e.prototype.current = function () {
        var i = this._core.relative(this._core.current());
        return n
          .grep(
            this._pages,
            n.proxy(function (t, e) {
              return t.start <= i && t.end >= i;
            }, this)
          )
          .pop();
      }),
      (e.prototype.getPosition = function (t) {
        var e,
          i,
          s = this._core.settings;
        return (
          "page" == s.slideBy
            ? ((e = n.inArray(this.current(), this._pages)),
              (i = this._pages.length),
              t ? ++e : --e,
              (e = this._pages[((e % i) + i) % i].start))
            : ((e = this._core.relative(this._core.current())),
              (i = this._core.items().length),
              t ? (e += s.slideBy) : (e -= s.slideBy)),
          e
        );
      }),
      (e.prototype.next = function (t) {
        n.proxy(this._overrides.to, this._core)(this.getPosition(!0), t);
      }),
      (e.prototype.prev = function (t) {
        n.proxy(this._overrides.to, this._core)(this.getPosition(!1), t);
      }),
      (e.prototype.to = function (t, e, i) {
        !i && this._pages.length
          ? ((i = this._pages.length),
            n.proxy(this._overrides.to, this._core)(
              this._pages[((t % i) + i) % i].start,
              e
            ))
          : n.proxy(this._overrides.to, this._core)(t, e);
      }),
      (n.fn.owlCarousel.Constructor.Plugins.Navigation = e);
  })(window.Zepto || window.jQuery, (window, document)),
  (function (s, n) {
    "use strict";
    var e = function (t) {
      (this._core = t),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": s.proxy(function (t) {
            t.namespace &&
              "URLHash" === this._core.settings.startPosition &&
              s(n).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": s.proxy(function (t) {
            var e;
            !t.namespace ||
              ((e = s(t.content)
                .find("[data-hash]")
                .addBack("[data-hash]")
                .attr("data-hash")) &&
                (this._hashes[e] = t.content));
          }, this),
          "changed.owl.carousel": s.proxy(function (t) {
            var i;
            t.namespace &&
              "position" === t.property.name &&
              ((i = this._core.items(
                this._core.relative(this._core.current())
              )),
              (t = s
                .map(this._hashes, function (t, e) {
                  return t === i ? e : null;
                })
                .join()) &&
                n.location.hash.slice(1) !== t &&
                (n.location.hash = t));
          }, this),
        }),
        (this._core.options = s.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        s(n).on(
          "hashchange.owl.navigation",
          s.proxy(function (t) {
            var e = n.location.hash.substring(1),
              i = this._core.$stage.children(),
              e = this._hashes[e] && i.index(this._hashes[e]);
            void 0 !== e &&
              e !== this._core.current() &&
              this._core.to(this._core.relative(e), !1, !0);
          }, this)
        );
    };
    (e.Defaults = { URLhashListener: !1 }),
      (e.prototype.destroy = function () {
        var t, e;
        for (t in (s(n).off("hashchange.owl.navigation"), this._handlers))
          this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (s.fn.owlCarousel.Constructor.Plugins.Hash = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (n, o) {
    function e(t, i) {
      var s = !1,
        e = t.charAt(0).toUpperCase() + t.slice(1);
      return (
        n.each((t + " " + a.join(e + " ") + e).split(" "), function (t, e) {
          if (r[e] !== o) return (s = !i || e), !1;
        }),
        s
      );
    }
    function t(t) {
      return e(t, !0);
    }
    var r = n("<support>").get(0).style,
      a = "Webkit Moz O ms".split(" "),
      i = {
        transition: {
          end: {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend",
          },
        },
        animation: {
          end: {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            animation: "animationend",
          },
        },
      },
      s = function () {
        return !!e("transform");
      },
      l = function () {
        return !!e("perspective");
      },
      c = function () {
        return !!e("animation");
      };
    !(function () {
      return !!e("transition");
    })() ||
      ((n.support.transition = new String(t("transition"))),
      (n.support.transition.end = i.transition.end[n.support.transition])),
      c() &&
        ((n.support.animation = new String(t("animation"))),
        (n.support.animation.end = i.animation.end[n.support.animation])),
      s() &&
        ((n.support.transform = new String(t("transform"))),
        (n.support.transform3d = l()));
  })(window.Zepto || window.jQuery, (window, void document)),
  (function (t) {
    var e,
      n,
      i,
      s = navigator.userAgent;
    function o() {
      for (
        var t = document.querySelectorAll("picture > img, img[srcset][sizes]"),
          e = 0;
        e < t.length;
        e++
      )
        !(function (t) {
          var e,
            i,
            s = t.parentNode;
          "PICTURE" === s.nodeName.toUpperCase()
            ? ((e = n.cloneNode()),
              s.insertBefore(e, s.firstElementChild),
              setTimeout(function () {
                s.removeChild(e);
              }))
            : (!t._pfLastSize || t.offsetWidth > t._pfLastSize) &&
              ((t._pfLastSize = t.offsetWidth),
              (i = t.sizes),
              (t.sizes += ",100vw"),
              setTimeout(function () {
                t.sizes = i;
              }));
        })(t[e]);
    }
    function r() {
      clearTimeout(e), (e = setTimeout(o, 99));
    }
    function a() {
      r(), i && i.addListener && i.addListener(r);
    }
    t.HTMLPictureElement &&
      /ecko/.test(s) &&
      s.match(/rv\:(\d+)/) &&
      RegExp.$1 < 45 &&
      addEventListener(
        "resize",
        ((n = document.createElement("source")),
        (i = t.matchMedia && matchMedia("(orientation: landscape)")),
        (n.srcset =
          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),
        /^[c|i]|d$/.test(document.readyState || "")
          ? a()
          : document.addEventListener("DOMContentLoaded", a),
        r)
      );
  })(window),
  (function (t, o, c) {
    "use strict";
    function m(t) {
      return " " === t || "\t" === t || "\n" === t || "\f" === t || "\r" === t;
    }
    function w(t, e) {
      return t.res - e.res;
    }
    function x(t, e) {
      var i, s, n;
      if (t && e)
        for (n = I.parseSet(e), t = I.makeUrl(t), i = 0; i < n.length; i++)
          if (t === I.makeUrl(n[i].url)) {
            s = n[i];
            break;
          }
      return s;
    }
    function e(e, u) {
      function t(t) {
        var t = t.exec(e.substring(a));
        return t ? ((t = t[0]), (a += t.length), t) : void 0;
      }
      function i() {
        for (var t, e, i, s, n, o, r, a = !1, l = {}, c = 0; c < d.length; c++)
          (s = (r = d[c])[r.length - 1]),
            (n = r.substring(0, r.length - 1)),
            (o = parseInt(n, 10)),
            (r = parseFloat(n)),
            rt.test(n) && "w" === s
              ? ((t || e) && (a = !0), 0 === o ? (a = !0) : (t = o))
              : at.test(n) && "x" === s
              ? ((t || e || i) && (a = !0), r < 0 ? (a = !0) : (e = r))
              : rt.test(n) && "h" === s
              ? ((i || e) && (a = !0), 0 === o ? (a = !0) : (i = o))
              : (a = !0);
        a ||
          ((l.url = h),
          t && (l.w = t),
          e && (l.d = e),
          i && (l.h = i),
          i || e || t || (l.d = 1),
          1 === l.d && (u.has1x = !0),
          (l.set = u),
          p.push(l));
      }
      for (var h, d, s, n, o, r = e.length, a = 0, p = []; ; ) {
        if ((t(st), r <= a)) return p;
        (h = t(nt)),
          (d = []),
          "," === h.slice(-1)
            ? ((h = h.replace(ot, "")), i())
            : (function () {
                for (t(it), s = "", n = "in descriptor"; ; ) {
                  if (((o = e.charAt(a)), "in descriptor" === n))
                    if (m(o))
                      s && (d.push(s), (s = ""), (n = "after descriptor"));
                    else {
                      if ("," === o) return (a += 1), s && d.push(s), i();
                      if ("(" === o) (s += o), (n = "in parens");
                      else {
                        if ("" === o) return s && d.push(s), i();
                        s += o;
                      }
                    }
                  else if ("in parens" === n)
                    if (")" === o) (s += o), (n = "in descriptor");
                    else {
                      if ("" === o) return d.push(s), i();
                      s += o;
                    }
                  else if ("after descriptor" === n && !m(o)) {
                    if ("" === o) return i();
                    (n = "in descriptor"), --a;
                  }
                  a += 1;
                }
              })();
      }
    }
    function i(t) {
      for (
        var e,
          i,
          s,
          n =
            /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,
          o = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i,
          r = (function (t) {
            function e() {
              n && (o.push(n), (n = ""));
            }
            function i() {
              o[0] && (r.push(o), (o = []));
            }
            for (var s, n = "", o = [], r = [], a = 0, l = 0, c = !1; ; ) {
              if ("" === (s = t.charAt(l))) return e(), i(), r;
              if (c)
                "*" !== s || "/" !== t[l + 1]
                  ? (l += 1)
                  : ((c = !1), (l += 2), e());
              else {
                if (m(s)) {
                  if ((t.charAt(l - 1) && m(t.charAt(l - 1))) || !n) {
                    l += 1;
                    continue;
                  }
                  if (0 === a) {
                    e(), (l += 1);
                    continue;
                  }
                  s = " ";
                } else if ("(" === s) a += 1;
                else if (")" === s) --a;
                else {
                  if ("," === s) {
                    e(), i(), (l += 1);
                    continue;
                  }
                  if ("/" === s && "*" === t.charAt(l + 1)) {
                    (c = !0), (l += 2);
                    continue;
                  }
                }
                (n += s), (l += 1);
              }
            }
          })(t),
          a = r.length,
          l = 0;
        l < a;
        l++
      )
        if (
          ((i = (e = r[l])[e.length - 1]),
          (s = i),
          (n.test(s) && 0 <= parseFloat(s)) ||
            o.test(s) ||
            "0" === s ||
            "-0" === s ||
            "+0" === s)
        ) {
          if (((i = i), e.pop(), 0 === e.length)) return i;
          if (((e = e.join(" ")), I.matchesMedia(e))) return i;
        }
      return "100vw";
    }
    o.createElement("picture");
    function s() {}
    function n(t, e, i, s) {
      t.addEventListener
        ? t.addEventListener(e, i, s || !1)
        : t.attachEvent && t.attachEvent("on" + e, i);
    }
    function $(t, e) {
      return (
        t.w
          ? ((t.cWidth = I.calcListLength(e || "100vw")),
            (t.res = t.w / t.cWidth))
          : (t.res = t.d),
        t
      );
    }
    var r,
      u,
      a,
      l,
      h,
      d,
      p,
      g,
      f,
      y,
      v,
      b,
      _,
      T,
      S,
      C,
      k,
      A,
      E,
      M,
      I = {},
      P = !1,
      O = o.createElement("img"),
      z = O.getAttribute,
      j = O.setAttribute,
      L = O.removeAttribute,
      D = o.documentElement,
      F = {},
      q = { algorithm: "" },
      N = "data-pfsrc",
      H = N + "set",
      W = navigator.userAgent,
      R =
        /rident/.test(W) ||
        (/ecko/.test(W) && W.match(/rv\:(\d+)/) && 35 < RegExp.$1),
      B = "currentSrc",
      V = /\s+\+?\d+(e\d+)?w/,
      Y = /(\([^)]+\))?\s*(.+)/,
      U = t.picturefillCFG,
      Q = "font-size:100%!important;",
      G = !0,
      X = {},
      Z = {},
      K = t.devicePixelRatio,
      J = { px: 1, in: 96 },
      tt = o.createElement("a"),
      et = !1,
      it = /^[ \t\n\r\u000c]+/,
      st = /^[, \t\n\r\u000c]+/,
      nt = /^[^ \t\n\r\u000c]+/,
      ot = /[,]+$/,
      rt = /^\d+$/,
      at = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,
      W = function (e) {
        var i = {};
        return function (t) {
          return t in i || (i[t] = e(t)), i[t];
        };
      },
      lt =
        ((l = /^([\d\.]+)(em|vw|px)$/),
        (h = W(function (t) {
          return (
            "return " +
            (function () {
              for (var t = arguments, e = 0, i = t[0]; ++e in t; )
                i = i.replace(t[e], t[++e]);
              return i;
            })(
              (t || "").toLowerCase(),
              /\band\b/g,
              "&&",
              /,/g,
              "||",
              /min-([a-z-\s]+):/g,
              "e.$1>=",
              /max-([a-z-\s]+):/g,
              "e.$1<=",
              /calc([^)]+)/g,
              "($1)",
              /(\d+[\.]*[\d]*)([a-z]+)/g,
              "($1 * e.$2)",
              /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,
              ""
            ) +
            ";"
          );
        })),
        function (t, e) {
          var i;
          if (!(t in X))
            if (((X[t] = !1), e && (i = t.match(l)))) X[t] = i[1] * J[i[2]];
            else
              try {
                X[t] = new Function("e", h(t))(J);
              } catch (t) {}
          return X[t];
        }),
      ct = function (t) {
        if (P) {
          var e,
            i,
            s,
            n = t || {};
          if (
            (n.elements &&
              1 === n.elements.nodeType &&
              ("IMG" === n.elements.nodeName.toUpperCase()
                ? (n.elements = [n.elements])
                : ((n.context = n.elements), (n.elements = null))),
            (s = (e =
              n.elements ||
              I.qsa(
                n.context || o,
                n.reevaluate || n.reselect ? I.sel : I.selShort
              )).length))
          ) {
            for (I.setupRun(n), et = !0, i = 0; i < s; i++) I.fillImg(e[i], n);
            I.teardownRun(n);
          }
        }
      };
    function ut() {
      2 === C.width && (I.supSizes = !0),
        (u = I.supSrcset && !I.supSizes),
        (P = !0),
        setTimeout(ct);
    }
    t.console && console.warn,
      B in O || (B = "src"),
      (F["image/jpeg"] = !0),
      (F["image/gif"] = !0),
      (F["image/png"] = !0),
      (F["image/svg+xml"] = o.implementation.hasFeature(
        "http://www.w3.org/TR/SVG11/feature#Image",
        "1.1"
      )),
      (I.ns = ("pf" + new Date().getTime()).substr(0, 9)),
      (I.supSrcset = "srcset" in O),
      (I.supSizes = "sizes" in O),
      (I.supPicture = !!t.HTMLPictureElement),
      I.supSrcset &&
        I.supPicture &&
        !I.supSizes &&
        ((k = o.createElement("img")),
        (O.srcset = "data:,a"),
        (k.src = "data:,a"),
        (I.supSrcset = O.complete === k.complete),
        (I.supPicture = I.supSrcset && I.supPicture)),
      I.supSrcset && !I.supSizes
        ? ((k =
            "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),
          ((C = o.createElement("img")).onload = ut),
          (C.onerror = ut),
          C.setAttribute("sizes", "9px"),
          (C.srcset =
            k +
            " 1w,data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw== 9w"),
          (C.src = k))
        : (P = !0),
      (I.selShort = "picture>img,img[srcset]"),
      (I.sel = I.selShort),
      (I.cfg = q),
      (I.DPR = K || 1),
      (I.u = J),
      (I.types = F),
      (I.setSize = s),
      (I.makeUrl = W(function (t) {
        return (tt.href = t), tt.href;
      })),
      (I.qsa = function (t, e) {
        return "querySelector" in t ? t.querySelectorAll(e) : [];
      }),
      (I.matchesMedia = function () {
        return (
          t.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches
            ? (I.matchesMedia = function (t) {
                return !t || matchMedia(t).matches;
              })
            : (I.matchesMedia = I.mMQ),
          I.matchesMedia.apply(this, arguments)
        );
      }),
      (I.mMQ = function (t) {
        return !t || lt(t);
      }),
      (I.calcLength = function (t) {
        t = lt(t, !0) || !1;
        return (t = t < 0 ? !1 : t);
      }),
      (I.supportsType = function (t) {
        return !t || F[t];
      }),
      (I.parseSize = W(function (t) {
        t = (t || "").match(Y);
        return { media: t && t[1], length: t && t[2] };
      })),
      (I.parseSet = function (t) {
        return t.cands || (t.cands = e(t.srcset, t)), t.cands;
      }),
      (I.getEmValue = function () {
        var t, e, i, s;
        return (
          !r &&
            (t = o.body) &&
            ((e = o.createElement("div")),
            (i = D.style.cssText),
            (s = t.style.cssText),
            (e.style.cssText =
              "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)"),
            (D.style.cssText = Q),
            (t.style.cssText = Q),
            t.appendChild(e),
            (r = e.offsetWidth),
            t.removeChild(e),
            (r = parseFloat(r, 10)),
            (D.style.cssText = i),
            (t.style.cssText = s)),
          r || 16
        );
      }),
      (I.calcListLength = function (t) {
        var e;
        return (
          (t in Z && !q.uT) ||
            ((e = I.calcLength(i(t))), (Z[t] = e || J.width)),
          Z[t]
        );
      }),
      (I.setRes = function (t) {
        if (t)
          for (var e, i = 0, s = (e = I.parseSet(t)).length; i < s; i++)
            $(e[i], t.sizes);
        return e;
      }),
      (I.setRes.res = $),
      (I.applySetCandidate = function (t, e) {
        if (t.length) {
          var i,
            s,
            n,
            o,
            r,
            a,
            l = e[I.ns],
            c = I.DPR,
            u = l.curSrc || e[B],
            h =
              l.curCan ||
              ((v = e),
              (b = u),
              (h = t[0].set),
              (h = x(
                b,
                (h = !h && b ? (h = v[I.ns].sets) && h[h.length - 1] : h)
              )) &&
                ((b = I.makeUrl(b)),
                (v[I.ns].curSrc = b),
                (v[I.ns].curCan = h).res || $(h, h.set.sizes)),
              h);
          if (
            (h &&
              h.set === t[0].set &&
              ((a = R && !e.complete && h.res - 0.1 > c) ||
                ((h.cached = !0), h.res >= c && (r = h))),
            !r)
          )
            for (t.sort(w), r = t[(o = t.length) - 1], s = 0; s < o; s++)
              if ((i = t[s]).res >= c) {
                r =
                  t[(n = s - 1)] &&
                  (a || u !== I.makeUrl(i.url)) &&
                  ((d = t[n].res),
                  (p = i.res),
                  (m = c),
                  (g = t[n].cached),
                  (y = f = void 0),
                  (d =
                    "saveData" === q.algorithm
                      ? 2.7 < d
                        ? m + 1
                        : ((y = (p - m) * (f = Math.pow(d - 0.6, 1.5))),
                          g && (y += 0.1 * f),
                          d + y)
                      : 1 < m
                      ? Math.sqrt(d * p)
                      : d),
                  m < d)
                    ? t[n]
                    : i;
                break;
              }
          r &&
            ((h = I.makeUrl(r.url)),
            (l.curSrc = h),
            (l.curCan = r),
            h !== u && I.setSrc(e, r),
            I.setSize(e));
        }
        var d, p, m, g, f, y, v, b;
      }),
      (I.setSrc = function (t, e) {
        (t.src = e.url),
          "image/svg+xml" === e.set.type &&
            ((e = t.style.width),
            (t.style.width = t.offsetWidth + 1 + "px"),
            t.offsetWidth + 1 && (t.style.width = e));
      }),
      (I.getSet = function (t) {
        for (var e, i, s = !1, n = t[I.ns].sets, o = 0; o < n.length && !s; o++)
          if (
            (e = n[o]).srcset &&
            I.matchesMedia(e.media) &&
            (i = I.supportsType(e.type))
          ) {
            s = e = "pending" === i ? i : e;
            break;
          }
        return s;
      }),
      (I.parseSets = function (t, e, i) {
        var s,
          n,
          o,
          r,
          a = e && "PICTURE" === e.nodeName.toUpperCase(),
          l = t[I.ns];
        (l.src !== c && !i.src) ||
          ((l.src = z.call(t, "src")),
          l.src ? j.call(t, N, l.src) : L.call(t, N)),
          (l.srcset !== c && !i.srcset && I.supSrcset && !t.srcset) ||
            ((s = z.call(t, "srcset")), (l.srcset = s), (r = !0)),
          (l.sets = []),
          a &&
            ((l.pic = !0),
            (function (t, e) {
              for (
                var i,
                  s,
                  n = t.getElementsByTagName("source"),
                  o = 0,
                  r = n.length;
                o < r;
                o++
              )
                ((i = n[o])[I.ns] = !0),
                  (s = i.getAttribute("srcset")) &&
                    e.push({
                      srcset: s,
                      media: i.getAttribute("media"),
                      type: i.getAttribute("type"),
                      sizes: i.getAttribute("sizes"),
                    });
            })(e, l.sets)),
          l.srcset
            ? ((n = { srcset: l.srcset, sizes: z.call(t, "sizes") }),
              l.sets.push(n),
              (o = (u || l.src) && V.test(l.srcset || "")) ||
                !l.src ||
                x(l.src, n) ||
                n.has1x ||
                ((n.srcset += ", " + l.src),
                n.cands.push({ url: l.src, d: 1, set: n })))
            : l.src && l.sets.push({ srcset: l.src, sizes: null }),
          (l.curCan = null),
          (l.curSrc = c),
          (l.supported = !(a || (n && !I.supSrcset) || (o && !I.supSizes))),
          r &&
            I.supSrcset &&
            !l.supported &&
            (s ? (j.call(t, H, s), (t.srcset = "")) : L.call(t, H)),
          l.supported &&
            !l.srcset &&
            ((!l.src && t.src) || t.src !== I.makeUrl(l.src)) &&
            (null === l.src ? t.removeAttribute("src") : (t.src = l.src)),
          (l.parsed = !0);
      }),
      (I.fillImg = function (t, e) {
        var i,
          s = e.reselect || e.reevaluate;
        t[I.ns] || (t[I.ns] = {}),
          (i = t[I.ns]),
          (!s && i.evaled === a) ||
            ((i.parsed && !e.reevaluate) || I.parseSets(t, t.parentNode, e),
            i.supported
              ? (i.evaled = a)
              : ((e = t),
                (i = I.getSet(e)),
                (t = !1),
                "pending" !== i &&
                  ((t = a),
                  i && ((i = I.setRes(i)), I.applySetCandidate(i, e))),
                (e[I.ns].evaled = t)));
      }),
      (I.setupRun = function () {
        (et && !G && K === t.devicePixelRatio) ||
          ((G = !1),
          (K = t.devicePixelRatio),
          (X = {}),
          (Z = {}),
          (I.DPR = K || 1),
          (J.width = Math.max(t.innerWidth || 0, D.clientWidth)),
          (J.height = Math.max(t.innerHeight || 0, D.clientHeight)),
          (J.vw = J.width / 100),
          (J.vh = J.height / 100),
          (a = [J.height, J.width, K].join("-")),
          (J.em = I.getEmValue()),
          (J.rem = J.em));
      }),
      I.supPicture
        ? ((ct = s), (I.fillImg = s))
        : ((b = t.attachEvent ? /d$|^c/ : /d$|^c|^i/),
          (_ = function () {
            var t = o.readyState || "";
            (T = setTimeout(_, "loading" === t ? 200 : 999)),
              o.body && (I.fillImgs(), (d = d || b.test(t)) && clearTimeout(T));
          }),
          (T = setTimeout(_, o.body ? 9 : 99)),
          (S = D.clientHeight),
          n(
            t,
            "resize",
            ((p = function () {
              (G =
                Math.max(t.innerWidth || 0, D.clientWidth) !== J.width ||
                D.clientHeight !== S),
                (S = D.clientHeight),
                G && I.fillImgs();
            }),
            (g = 99),
            (v = function () {
              var t = new Date() - y;
              t < g ? (f = setTimeout(v, g - t)) : ((f = null), p());
            }),
            function () {
              (y = new Date()), (f = f || setTimeout(v, g));
            })
          ),
          n(o, "readystatechange", _)),
      (I.picturefill = ct),
      (I.fillImgs = ct),
      (I.teardownRun = s),
      (ct._ = I),
      (t.picturefillCFG = {
        pf: I,
        push: function (t) {
          var e = t.shift();
          "function" == typeof I[e]
            ? I[e].apply(I, t)
            : ((q[e] = t[0]), et && I.fillImgs({ reselect: !0 }));
        },
      });
    for (; U && U.length; ) t.picturefillCFG.push(U.shift());
    (t.picturefill = ct),
      "object" == typeof module && "object" == typeof module.exports
        ? (module.exports = ct)
        : "function" == typeof define &&
          define.amd &&
          define("picturefill", function () {
            return ct;
          }),
      I.supPicture ||
        (F["image/webp"] =
          ((A = "image/webp"),
          (E =
            "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="),
          ((M = new t.Image()).onerror = function () {
            (F[A] = !1), ct();
          }),
          (M.onload = function () {
            (F[A] = 1 === M.width), ct();
          }),
          (M.src = E),
          "pending"));
  })(window, document),
  "object" == typeof navigator &&
    (function (t, e) {
      "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = e())
        : "function" == typeof define && define.amd
        ? define("Plyr", e)
        : ((t =
            "undefined" != typeof globalThis ? globalThis : t || self).Plyr =
            e());
    })(this, function () {
      "use strict";
      function o(t, e, i) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: i,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = i),
          t
        );
      }
      function t(t, e) {
        for (var i = 0; i < e.length; i++) {
          var s = e[i];
          (s.enumerable = s.enumerable || !1),
            (s.configurable = !0),
            "value" in s && (s.writable = !0),
            Object.defineProperty(t, s.key, s);
        }
      }
      function e(e, t) {
        var i,
          s = Object.keys(e);
        return (
          Object.getOwnPropertySymbols &&
            ((i = Object.getOwnPropertySymbols(e)),
            t &&
              (i = i.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
            s.push.apply(s, i)),
          s
        );
      }
      function n(s) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? e(Object(n), !0).forEach(function (t) {
                var e, i;
                (e = s),
                  (t = n[(i = t)]),
                  i in e
                    ? Object.defineProperty(e, i, {
                        value: t,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[i] = t);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(n))
            : e(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  s,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return s;
      }
      var r = { addCSS: !0, thumbWidth: 15, watch: !0 };
      function i(t) {
        return null != t ? t.constructor : null;
      }
      function s(t, e) {
        return !!(t && e && t instanceof e);
      }
      function a(t) {
        return i(t) === String;
      }
      function l(t) {
        return Array.isArray(t);
      }
      function c(t) {
        return s(t, NodeList);
      }
      function u(t) {
        return s(t, Event);
      }
      var h = a,
        d = l,
        p = c,
        m = function (t) {
          return s(t, Element);
        },
        g = function (t) {
          return (
            null == t ||
            ((a(t) || l(t) || c(t)) && !t.length) ||
            (i(t) === Object && !Object.keys(t).length)
          );
        };
      var f,
        y,
        v =
          ((y = [
            {
              key: "init",
              value: function () {
                b.enabled &&
                  (this.config.addCSS &&
                    ((this.element.style.userSelect = "none"),
                    (this.element.style.webKitUserSelect = "none"),
                    (this.element.style.touchAction = "manipulation")),
                  this.listeners(!0),
                  (this.element.rangeTouch = this));
              },
            },
            {
              key: "destroy",
              value: function () {
                b.enabled &&
                  (this.config.addCSS &&
                    ((this.element.style.userSelect = ""),
                    (this.element.style.webKitUserSelect = ""),
                    (this.element.style.touchAction = "")),
                  this.listeners(!1),
                  (this.element.rangeTouch = null));
              },
            },
            {
              key: "listeners",
              value: function (t) {
                var e = this,
                  i = t ? "addEventListener" : "removeEventListener";
                ["touchstart", "touchmove", "touchend"].forEach(function (t) {
                  e.element[i](
                    t,
                    function (t) {
                      return e.set(t);
                    },
                    !1
                  );
                });
              },
            },
            {
              key: "get",
              value: function (t) {
                if (!b.enabled || !u(t)) return null;
                var e = t.target,
                  i = t.changedTouches[0],
                  s = parseFloat(e.getAttribute("min")) || 0,
                  n = parseFloat(e.getAttribute("max")) || 100,
                  o = parseFloat(e.getAttribute("step")) || 1,
                  t = e.getBoundingClientRect(),
                  e = ((100 / t.width) * (this.config.thumbWidth / 2)) / 100;
                return (
                  (t = (100 / t.width) * (i.clientX - t.left)) < 0
                    ? (t = 0)
                    : 100 < t && (t = 100),
                  t < 50
                    ? (t -= (100 - 2 * t) * e)
                    : 50 < t && (t += 2 * (t - 50) * e),
                  s +
                    (function (t, e) {
                      if (e < 1) {
                        i = (i = ""
                          .concat(e)
                          .match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/))
                          ? Math.max(
                              0,
                              (i[1] ? i[1].length : 0) - (i[2] ? +i[2] : 0)
                            )
                          : 0;
                        return parseFloat(t.toFixed(i));
                      }
                      var i;
                      return Math.round(t / e) * e;
                    })((t / 100) * (n - s), o)
                );
              },
            },
            {
              key: "set",
              value: function (t) {
                var e;
                b.enabled &&
                  u(t) &&
                  !t.target.disabled &&
                  (t.preventDefault(),
                  (t.target.value = this.get(t)),
                  (e = t.target),
                  (t = "touchend" === t.type ? "change" : "input"),
                  e &&
                    t &&
                    ((t = new Event(t, { bubbles: !0 })), e.dispatchEvent(t)));
              },
            },
          ]),
          (Kt = [
            {
              key: "setup",
              value: function (i) {
                var e =
                    1 < arguments.length && void 0 !== arguments[1]
                      ? arguments[1]
                      : {},
                  t = null;
                if (
                  (g(i) || h(i)
                    ? (t = Array.from(
                        document.querySelectorAll(
                          h(i) ? i : 'input[type="range"]'
                        )
                      ))
                    : m(i)
                    ? (t = [i])
                    : p(i)
                    ? (t = Array.from(i))
                    : d(i) && (t = i.filter(m)),
                  g(t))
                )
                  return null;
                var s = n({}, r, {}, e);
                return (
                  h(i) &&
                    s.watch &&
                    new MutationObserver(function (t) {
                      Array.from(t).forEach(function (t) {
                        Array.from(t.addedNodes).forEach(function (t) {
                          var e;
                          m(t) &&
                            function () {
                              return Array.from(
                                document.querySelectorAll(e)
                              ).includes(this);
                            }.call(t, (e = i)) &&
                            new b(t, s);
                        });
                      });
                    }).observe(document.body, { childList: !0, subtree: !0 }),
                  t.map(function (t) {
                    return new b(t, e);
                  })
                );
              },
            },
            {
              key: "enabled",
              get: function () {
                return "ontouchstart" in document.documentElement;
              },
            },
          ]),
          t((f = b).prototype, y),
          t(f, Kt),
          b);
      function b(t, e) {
        (function (t) {
          if (!(t instanceof b))
            throw new TypeError("Cannot call a class as a function");
        })(this),
          m(t)
            ? (this.element = t)
            : h(t) && (this.element = document.querySelector(t)),
          m(this.element) &&
            g(this.element.rangeTouch) &&
            ((this.config = n({}, r, {}, e)), this.init());
      }
      const w = (t) => (null != t ? t.constructor : null),
        x = (t, e) => Boolean(t && e && t instanceof e),
        $ = (t) => null == t,
        _ = (t) => w(t) === Object,
        T = (t) => w(t) === String,
        S = (t) => w(t) === Function,
        C = (t) => Array.isArray(t),
        k = (t) => x(t, NodeList),
        A = (t) =>
          $(t) ||
          ((T(t) || C(t) || k(t)) && !t.length) ||
          (_(t) && !Object.keys(t).length);
      var E = $,
        M = _,
        I = (t) => w(t) === Number && !Number.isNaN(t),
        P = T,
        O = (t) => w(t) === Boolean,
        z = S,
        j = C,
        L = k,
        D = (t) =>
          null !== t &&
          "object" == typeof t &&
          1 === t.nodeType &&
          "object" == typeof t.style &&
          "object" == typeof t.ownerDocument,
        F = (t) => x(t, Event),
        q = (t) => x(t, KeyboardEvent),
        N = (t) => x(t, TextTrack) || (!$(t) && T(t.kind)),
        H = (t) => {
          if (x(t, window.URL)) return !0;
          if (!T(t)) return !1;
          let e = t;
          (t.startsWith("http://") && t.startsWith("https://")) ||
            (e = `http://${t}`);
          try {
            return !A(new URL(e).hostname);
          } catch (t) {
            return !1;
          }
        },
        W = A;
      const R = (() => {
        const e = document.createElement("span"),
          t = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend",
          },
          i = Object.keys(t).find((t) => void 0 !== e.style[t]);
        return !!P(i) && t[i];
      })();
      function B(t, e) {
        setTimeout(() => {
          try {
            (t.hidden = !0), t.offsetHeight, (t.hidden = !1);
          } catch (t) {}
        }, e);
      }
      const V = {
        isIE: Boolean(window.document.documentMode),
        isEdge: window.navigator.userAgent.includes("Edge"),
        isWebkit:
          "WebkitAppearance" in document.documentElement.style &&
          !/Edge/.test(navigator.userAgent),
        isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
        isIos:
          ("MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints) ||
          /(iPad|iPhone|iPod)/gi.test(navigator.platform),
      };
      function Y(t, e) {
        return e.split(".").reduce((t, e) => t && t[e], t);
      }
      function U(e = {}, ...t) {
        if (!t.length) return e;
        const i = t.shift();
        return M(i)
          ? (Object.keys(i).forEach((t) => {
              M(i[t])
                ? (Object.keys(e).includes(t) || Object.assign(e, { [t]: {} }),
                  U(e[t], i[t]))
                : Object.assign(e, { [t]: i[t] });
            }),
            U(e, ...t))
          : e;
      }
      function Q(t, o) {
        t = t.length ? t : [t];
        Array.from(t)
          .reverse()
          .forEach((t, e) => {
            const i = 0 < e ? o.cloneNode(!0) : o,
              s = t.parentNode,
              n = t.nextSibling;
            i.appendChild(t), n ? s.insertBefore(i, n) : s.appendChild(i);
          });
      }
      function G(i, t) {
        D(i) &&
          !W(t) &&
          Object.entries(t)
            .filter(([, t]) => !E(t))
            .forEach(([t, e]) => i.setAttribute(t, e));
      }
      function X(t, e, i) {
        const s = document.createElement(t);
        return M(e) && G(s, e), P(i) && (s.innerText = i), s;
      }
      function Z(t, e, i, s) {
        D(e) && e.appendChild(X(t, i, s));
      }
      function K(t) {
        L(t) || j(t)
          ? Array.from(t).forEach(K)
          : D(t) && D(t.parentNode) && t.parentNode.removeChild(t);
      }
      function J(e) {
        if (D(e)) {
          let { length: t } = e.childNodes;
          for (; 0 < t; ) e.removeChild(e.lastChild), --t;
        }
      }
      function tt(t, e) {
        return D(e) && D(e.parentNode) && D(t)
          ? (e.parentNode.replaceChild(t, e), t)
          : null;
      }
      function et(t, e) {
        if (!P(t) || W(t)) return {};
        const r = {},
          a = U({}, e);
        return (
          t.split(",").forEach((t) => {
            const e = t.trim(),
              i = e.replace(".", ""),
              s = e.replace(/[[\]]/g, "").split("="),
              [n] = s,
              o = 1 < s.length ? s[1].replace(/["']/g, "") : "";
            switch (e.charAt(0)) {
              case ".":
                P(a.class) ? (r.class = `${a.class} ${i}`) : (r.class = i);
                break;
              case "#":
                r.id = e.replace("#", "");
                break;
              case "[":
                r[n] = o;
            }
          }),
          U(a, r)
        );
      }
      function it(e, i) {
        if (D(e)) {
          let t = i;
          O(t) || (t = !e.hidden), (e.hidden = t);
        }
      }
      function st(e, i, s) {
        if (L(e)) return Array.from(e).map((t) => st(t, i, s));
        if (D(e)) {
          let t = void 0 !== s ? (s ? "add" : "remove") : "toggle";
          return e.classList[t](i), e.classList.contains(i);
        }
        return !1;
      }
      function nt(t, e) {
        return D(t) && t.classList.contains(e);
      }
      function ot(t, e) {
        const { prototype: i } = Element;
        return (
          i.matches ||
          i.webkitMatchesSelector ||
          i.mozMatchesSelector ||
          i.msMatchesSelector ||
          function () {
            return Array.from(document.querySelectorAll(e)).includes(this);
          }
        ).call(t, e);
      }
      function rt(t) {
        return this.elements.container.querySelectorAll(t);
      }
      function at(t) {
        return this.elements.container.querySelector(t);
      }
      function lt(t = null, e = !1) {
        D(t) &&
          (t.focus({ preventScroll: !0 }),
          e && st(t, this.config.classNames.tabFocus));
      }
      const ct = {
          "audio/ogg": "vorbis",
          "audio/wav": "1",
          "video/webm": "vp8, vorbis",
          "video/mp4": "avc1.42E01E, mp4a.40.2",
          "video/ogg": "theora",
        },
        ut = {
          audio: "canPlayType" in document.createElement("audio"),
          video: "canPlayType" in document.createElement("video"),
          check(t, e, i) {
            (i = V.isIPhone && i && ut.playsinline),
              (e = ut[t] || "html5" !== e);
            return {
              api: e,
              ui: e && ut.rangeInput && ("video" !== t || !V.isIPhone || i),
            };
          },
          pip: !(
            V.isIPhone ||
            (!z(X("video").webkitSetPresentationMode) &&
              (!document.pictureInPictureEnabled ||
                X("video").disablePictureInPicture))
          ),
          airplay: z(window.WebKitPlaybackTargetAvailabilityEvent),
          playsinline: "playsInline" in document.createElement("video"),
          mime(t) {
            if (W(t)) return !1;
            var [e] = t.split("/");
            let i = t;
            if (!this.isHTML5 || e !== this.type) return !1;
            Object.keys(ct).includes(i) && (i += `; codecs="${ct[t]}"`);
            try {
              return Boolean(i && this.media.canPlayType(i).replace(/no/, ""));
            } catch (t) {
              return !1;
            }
          },
          textTracks: "textTracks" in document.createElement("video"),
          rangeInput: (() => {
            const t = document.createElement("input");
            return (t.type = "range") === t.type;
          })(),
          touch: "ontouchstart" in document.documentElement,
          transitions: !1 !== R,
          reducedMotion:
            "matchMedia" in window &&
            window.matchMedia("(prefers-reduced-motion)").matches,
        },
        ht = (() => {
          let t = !1;
          try {
            var e = Object.defineProperty({}, "passive", {
              get: () => ((t = !0), null),
            });
            window.addEventListener("test", null, e),
              window.removeEventListener("test", null, e);
          } catch (t) {}
          return t;
        })();
      function dt(i, t, s, n = !1, o = !0, r = !1) {
        if (i && "addEventListener" in i && !W(t) && z(s)) {
          const a = t.split(" ");
          let e = r;
          ht && (e = { passive: o, capture: r }),
            a.forEach((t) => {
              this &&
                this.eventListeners &&
                n &&
                this.eventListeners.push({
                  element: i,
                  type: t,
                  callback: s,
                  options: e,
                }),
                i[n ? "addEventListener" : "removeEventListener"](t, s, e);
            });
        }
      }
      function pt(t, e = "", i, s = !0, n = !1) {
        dt.call(this, t, e, i, !0, s, n);
      }
      function mt(t, e = "", i, s = !0, n = !1) {
        dt.call(this, t, e, i, !1, s, n);
      }
      function gt(e, i = "", s, n = !0, o = !1) {
        const r = (...t) => {
          mt(e, i, r, n, o), s.apply(this, t);
        };
        dt.call(this, e, i, r, !0, n, o);
      }
      function ft(t, e = "", i = !1, s = {}) {
        D(t) &&
          !W(e) &&
          ((s = new CustomEvent(e, {
            bubbles: i,
            detail: { ...s, plyr: this },
          })),
          t.dispatchEvent(s));
      }
      function yt(t) {
        var e;
        (e = t), x(e, Promise) && S(e.then) && t.then(null, () => {});
      }
      function vt(i) {
        return j(i) ? i.filter((t, e) => i.indexOf(t) === e) : i;
      }
      function bt(t, i) {
        return j(t) && t.length
          ? t.reduce((t, e) => (Math.abs(e - i) < Math.abs(t - i) ? e : t))
          : null;
      }
      function wt(t) {
        return !(!window || !window.CSS) && window.CSS.supports(t);
      }
      const xt = [
        [1, 1],
        [4, 3],
        [3, 4],
        [5, 4],
        [4, 5],
        [3, 2],
        [2, 3],
        [16, 10],
        [10, 16],
        [16, 9],
        [9, 16],
        [21, 9],
        [9, 21],
        [32, 9],
        [9, 32],
      ].reduce((t, [e, i]) => ({ ...t, [e / i]: [e, i] }), {});
      function $t(t) {
        return (
          (j(t) || (P(t) && t.includes(":"))) &&
          (j(t) ? t : t.split(":")).map(Number).every(I)
        );
      }
      function _t(t) {
        if (!j(t) || !t.every(I)) return null;
        const [e, i] = t,
          s = (t, e) => (0 === e ? t : s(e, t % e)),
          n = s(e, i);
        return [e / n, i / n];
      }
      function Tt(t) {
        const e = (t) => ($t(t) ? t.split(":").map(Number) : null);
        let i = e(t);
        if (
          (null === i && (i = e(this.config.ratio)),
          null === i &&
            !W(this.embed) &&
            j(this.embed.ratio) &&
            ({ ratio: i } = this.embed),
          null === i && this.isHTML5)
        ) {
          const { videoWidth: t, videoHeight: e } = this.media;
          i = [t, e];
        }
        return _t(i);
      }
      function St(t) {
        if (!this.isVideo) return {};
        const { wrapper: e } = this.elements,
          i = Tt.call(this, t);
        if (!j(i)) return {};
        var [s, n] = _t(i),
          t = (100 / s) * n;
        if (
          (wt(`aspect-ratio: ${s}/${n}`)
            ? (e.style.aspectRatio = `${s}/${n}`)
            : (e.style.paddingBottom = `${t}%`),
          this.isVimeo && !this.config.vimeo.premium && this.supported.ui)
        ) {
          const o =
              (100 / this.media.offsetWidth) *
              parseInt(window.getComputedStyle(this.media).paddingBottom, 10),
            i = (o - t) / (o / 50);
          this.fullscreen.active
            ? (e.style.paddingBottom = null)
            : (this.media.style.transform = `translateY(-${i}%)`);
        } else this.isHTML5 && e.classList.add(this.config.classNames.videoFixedRatio);
        return { padding: t, ratio: i };
      }
      function Ct(t, e, i = 0.05) {
        var s = t / e,
          n = bt(Object.keys(xt), s);
        return Math.abs(n - s) <= i ? xt[n] : [t, e];
      }
      const kt = {
        getSources() {
          return this.isHTML5
            ? Array.from(this.media.querySelectorAll("source")).filter((t) => {
                t = t.getAttribute("type");
                return !!W(t) || ut.mime.call(this, t);
              })
            : [];
        },
        getQualityOptions() {
          return this.config.quality.forced
            ? this.config.quality.options
            : kt.getSources
                .call(this)
                .map((t) => Number(t.getAttribute("size")))
                .filter(Boolean);
        },
        setup() {
          if (this.isHTML5) {
            const a = this;
            (a.options.speed = a.config.speed.options),
              W(this.config.ratio) || St.call(a),
              Object.defineProperty(a.media, "quality", {
                get() {
                  const t = kt.getSources
                    .call(a)
                    .find((t) => t.getAttribute("src") === a.source);
                  return t && Number(t.getAttribute("size"));
                },
                set(e) {
                  if (a.quality !== e) {
                    if (a.config.quality.forced && z(a.config.quality.onChange))
                      a.config.quality.onChange(e);
                    else {
                      const t = kt.getSources
                        .call(a)
                        .find((t) => Number(t.getAttribute("size")) === e);
                      if (!t) return;
                      const {
                        currentTime: i,
                        paused: s,
                        preload: n,
                        readyState: o,
                        playbackRate: r,
                      } = a.media;
                      (a.media.src = t.getAttribute("src")),
                        ("none" === n && !o) ||
                          (a.once("loadedmetadata", () => {
                            (a.speed = r),
                              (a.currentTime = i),
                              s || yt(a.play());
                          }),
                          a.media.load());
                    }
                    ft.call(a, a.media, "qualitychange", !1, { quality: e });
                  }
                },
              });
          }
        },
        cancelRequests() {
          this.isHTML5 &&
            (K(kt.getSources.call(this)),
            this.media.setAttribute("src", this.config.blankVideo),
            this.media.load(),
            this.debug.log("Cancelled network requests"));
        },
      };
      function At(t, ...i) {
        return W(t)
          ? t
          : t.toString().replace(/{(\d+)}/g, (t, e) => i[e].toString());
      }
      const Et = (t = "", e = "", i = "") =>
          t.replace(
            new RegExp(
              e.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"),
              "g"
            ),
            i.toString()
          ),
        Mt = (t = "") =>
          t
            .toString()
            .replace(
              /\w\S*/g,
              (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
            );
      function It(t) {
        const e = document.createElement("div");
        return e.appendChild(t), e.innerHTML;
      }
      const Pt = {
          pip: "PIP",
          airplay: "AirPlay",
          html5: "HTML5",
          vimeo: "Vimeo",
          youtube: "YouTube",
        },
        Ot = {
          get(t = "", e = {}) {
            if (W(t) || W(e)) return "";
            let i = Y(e.i18n, t);
            if (W(i)) return Object.keys(Pt).includes(t) ? Pt[t] : "";
            e = { "{seektime}": e.seekTime, "{title}": e.title };
            return (
              Object.entries(e).forEach(([t, e]) => {
                i = Et(i, t, e);
              }),
              i
            );
          },
        };
      class zt {
        constructor(t) {
          o(this, "get", (t) => {
            if (!zt.supported || !this.enabled) return null;
            var e = window.localStorage.getItem(this.key);
            if (W(e)) return null;
            e = JSON.parse(e);
            return P(t) && t.length ? e[t] : e;
          }),
            o(this, "set", (e) => {
              if (zt.supported && this.enabled && M(e)) {
                let t = this.get();
                W(t) && (t = {}),
                  U(t, e),
                  window.localStorage.setItem(this.key, JSON.stringify(t));
              }
            }),
            (this.enabled = t.config.storage.enabled),
            (this.key = t.config.storage.key);
        }
        static get supported() {
          try {
            if (!("localStorage" in window)) return !1;
            var t = "___test";
            return (
              window.localStorage.setItem(t, t),
              window.localStorage.removeItem(t),
              !0
            );
          } catch (t) {
            return !1;
          }
        }
      }
      function jt(t, s = "text") {
        return new Promise((e, i) => {
          try {
            const i = new XMLHttpRequest();
            if (!("withCredentials" in i)) return;
            i.addEventListener("load", () => {
              if ("text" === s)
                try {
                  e(JSON.parse(i.responseText));
                } catch (t) {
                  e(i.responseText);
                }
              else e(i.response);
            }),
              i.addEventListener("error", () => {
                throw new Error(i.status);
              }),
              i.open("GET", t, !0),
              (i.responseType = s),
              i.send();
          } catch (t) {
            i(t);
          }
        });
      }
      function Lt(t, e) {
        if (P(t)) {
          const i = P(e);
          const s = () => null !== document.getElementById(e),
            n = (t, e) => {
              (t.innerHTML = e),
                (i && s()) ||
                  document.body.insertAdjacentElement("afterbegin", t);
            };
          if (!i || !s()) {
            const s = zt.supported,
              o = document.createElement("div");
            if (
              (o.setAttribute("hidden", ""), i && o.setAttribute("id", e), s)
            ) {
              const t = window.localStorage.getItem(`cache-${e}`);
              if (null !== t) {
                const e = JSON.parse(t);
                n(o, e.content);
              }
            }
            jt(t)
              .then((t) => {
                W(t) ||
                  (s &&
                    window.localStorage.setItem(
                      `cache-${e}`,
                      JSON.stringify({ content: t })
                    ),
                  n(o, t));
              })
              .catch(() => {});
          }
        }
      }
      const Dt = (t) => Math.trunc((t / 60 / 60) % 60, 10);
      function Ft(t = 0, e = !1, i = !1) {
        if (!I(t)) return Ft(void 0, e, i);
        var s = (t) => `0${t}`.slice(-2);
        let n = Dt(t);
        var o = Math.trunc((t / 60) % 60, 10),
          r = Math.trunc(t % 60, 10);
        return (
          (n = e || 0 < n ? `${n}:` : ""),
          `${i && 0 < t ? "-" : ""}${n}${s(o)}:${s(r)}`
        );
      }
      const qt = {
        getIconUrl() {
          var t =
            new URL(this.config.iconUrl, window.location).host !==
              window.location.host ||
            (V.isIE && !window.svg4everybody);
          return { url: this.config.iconUrl, cors: t };
        },
        findElements() {
          try {
            return (
              (this.elements.controls = at.call(
                this,
                this.config.selectors.controls.wrapper
              )),
              (this.elements.buttons = {
                play: rt.call(this, this.config.selectors.buttons.play),
                pause: at.call(this, this.config.selectors.buttons.pause),
                restart: at.call(this, this.config.selectors.buttons.restart),
                rewind: at.call(this, this.config.selectors.buttons.rewind),
                fastForward: at.call(
                  this,
                  this.config.selectors.buttons.fastForward
                ),
                mute: at.call(this, this.config.selectors.buttons.mute),
                pip: at.call(this, this.config.selectors.buttons.pip),
                airplay: at.call(this, this.config.selectors.buttons.airplay),
                settings: at.call(this, this.config.selectors.buttons.settings),
                captions: at.call(this, this.config.selectors.buttons.captions),
                fullscreen: at.call(
                  this,
                  this.config.selectors.buttons.fullscreen
                ),
              }),
              (this.elements.progress = at.call(
                this,
                this.config.selectors.progress
              )),
              (this.elements.inputs = {
                seek: at.call(this, this.config.selectors.inputs.seek),
                volume: at.call(this, this.config.selectors.inputs.volume),
              }),
              (this.elements.display = {
                buffer: at.call(this, this.config.selectors.display.buffer),
                currentTime: at.call(
                  this,
                  this.config.selectors.display.currentTime
                ),
                duration: at.call(this, this.config.selectors.display.duration),
              }),
              D(this.elements.progress) &&
                (this.elements.display.seekTooltip =
                  this.elements.progress.querySelector(
                    `.${this.config.classNames.tooltip}`
                  )),
              !0
            );
          } catch (t) {
            return (
              this.debug.warn(
                "It looks like there is a problem with your custom controls HTML",
                t
              ),
              this.toggleNativeControls(!0),
              !1
            );
          }
        },
        createIcon(t, e) {
          const i = "http://www.w3.org/2000/svg",
            s = qt.getIconUrl.call(this),
            n = `${s.cors ? "" : s.url}#${this.config.iconPrefix}`,
            o = document.createElementNS(i, "svg");
          G(o, U(e, { "aria-hidden": "true", focusable: "false" }));
          const r = document.createElementNS(i, "use"),
            a = `${n}-${t}`;
          return (
            "href" in r &&
              r.setAttributeNS("http://www.w3.org/1999/xlink", "href", a),
            r.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a),
            o.appendChild(r),
            o
          );
        },
        createLabel(t, e = {}) {
          t = Ot.get(t, this.config);
          return X(
            "span",
            {
              ...e,
              class: [e.class, this.config.classNames.hidden]
                .filter(Boolean)
                .join(" "),
            },
            t
          );
        },
        createBadge(t) {
          if (W(t)) return null;
          const e = X("span", { class: this.config.classNames.menu.value });
          return (
            e.appendChild(
              X("span", { class: this.config.classNames.menu.badge }, t)
            ),
            e
          );
        },
        createButton(t, e) {
          const i = U({}, e);
          let s = (function (t = "") {
            let e = t.toString();
            return (
              (e = (function (t = "") {
                (t = t.toString()), (t = Et(t, "-", " "));
                return (t = Et(t, "_", " ")), (t = Mt(t)), Et(t, " ", "");
              })(e)),
              e.charAt(0).toLowerCase() + e.slice(1)
            );
          })(t);
          const n = {
            element: "button",
            toggle: !1,
            label: null,
            icon: null,
            labelPressed: null,
            iconPressed: null,
          };
          switch (
            (["element", "icon", "label"].forEach((t) => {
              Object.keys(i).includes(t) && ((n[t] = i[t]), delete i[t]);
            }),
            "button" !== n.element ||
              Object.keys(i).includes("type") ||
              (i.type = "button"),
            Object.keys(i).includes("class")
              ? i.class
                  .split(" ")
                  .some((t) => t === this.config.classNames.control) ||
                U(i, { class: `${i.class} ${this.config.classNames.control}` })
              : (i.class = this.config.classNames.control),
            t)
          ) {
            case "play":
              (n.toggle = !0),
                (n.label = "play"),
                (n.labelPressed = "pause"),
                (n.icon = "play"),
                (n.iconPressed = "pause");
              break;
            case "mute":
              (n.toggle = !0),
                (n.label = "mute"),
                (n.labelPressed = "unmute"),
                (n.icon = "volume"),
                (n.iconPressed = "muted");
              break;
            case "captions":
              (n.toggle = !0),
                (n.label = "enableCaptions"),
                (n.labelPressed = "disableCaptions"),
                (n.icon = "captions-off"),
                (n.iconPressed = "captions-on");
              break;
            case "fullscreen":
              (n.toggle = !0),
                (n.label = "enterFullscreen"),
                (n.labelPressed = "exitFullscreen"),
                (n.icon = "enter-fullscreen"),
                (n.iconPressed = "exit-fullscreen");
              break;
            case "play-large":
              (i.class += ` ${this.config.classNames.control}--overlaid`),
                (s = "play"),
                (n.label = "play"),
                (n.icon = "play");
              break;
            default:
              W(n.label) && (n.label = s), W(n.icon) && (n.icon = t);
          }
          const o = X(n.element);
          return (
            n.toggle
              ? (o.appendChild(
                  qt.createIcon.call(this, n.iconPressed, {
                    class: "icon--pressed",
                  })
                ),
                o.appendChild(
                  qt.createIcon.call(this, n.icon, {
                    class: "icon--not-pressed",
                  })
                ),
                o.appendChild(
                  qt.createLabel.call(this, n.labelPressed, {
                    class: "label--pressed",
                  })
                ),
                o.appendChild(
                  qt.createLabel.call(this, n.label, {
                    class: "label--not-pressed",
                  })
                ))
              : (o.appendChild(qt.createIcon.call(this, n.icon)),
                o.appendChild(qt.createLabel.call(this, n.label))),
            U(i, et(this.config.selectors.buttons[s], i)),
            G(o, i),
            "play" === s
              ? (j(this.elements.buttons[s]) || (this.elements.buttons[s] = []),
                this.elements.buttons[s].push(o))
              : (this.elements.buttons[s] = o),
            o
          );
        },
        createRange(t, e) {
          e = X(
            "input",
            U(
              et(this.config.selectors.inputs[t]),
              {
                type: "range",
                min: 0,
                max: 100,
                step: 0.01,
                value: 0,
                autocomplete: "off",
                role: "slider",
                "aria-label": Ot.get(t, this.config),
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-valuenow": 0,
              },
              e
            )
          );
          return (
            (this.elements.inputs[t] = e),
            qt.updateRangeFill.call(this, e),
            v.setup(e),
            e
          );
        },
        createProgress(t, e) {
          const i = X(
            "progress",
            U(
              et(this.config.selectors.display[t]),
              {
                min: 0,
                max: 100,
                value: 0,
                role: "progressbar",
                "aria-hidden": !0,
              },
              e
            )
          );
          if ("volume" !== t) {
            i.appendChild(X("span", null, "0"));
            const e = { played: "played", buffer: "buffered" }[t],
              s = e ? Ot.get(e, this.config) : "";
            i.innerText = `% ${s.toLowerCase()}`;
          }
          return (this.elements.display[t] = i), i;
        },
        createTime(t, e) {
          (e = et(this.config.selectors.display[t], e)),
            (e = X(
              "div",
              U(e, {
                class: `${e.class || ""} ${
                  this.config.classNames.display.time
                } `.trim(),
                "aria-label": Ot.get(t, this.config),
              }),
              "00:00"
            ));
          return (this.elements.display[t] = e);
        },
        bindMenuItemShortcuts(s, t) {
          pt.call(
            this,
            s,
            "keydown keyup",
            (e) => {
              if (
                [32, 38, 39, 40].includes(e.which) &&
                (e.preventDefault(), e.stopPropagation(), "keydown" !== e.type)
              ) {
                var i = ot(s, '[role="menuitemradio"]');
                if (!i && [32, 39].includes(e.which))
                  qt.showMenuPanel.call(this, t, !0);
                else {
                  let t;
                  32 !== e.which &&
                    (40 === e.which || (i && 39 === e.which)
                      ? ((t = s.nextElementSibling),
                        D(t) || (t = s.parentNode.firstElementChild))
                      : ((t = s.previousElementSibling),
                        D(t) || (t = s.parentNode.lastElementChild)),
                    lt.call(this, t, !0));
                }
              }
            },
            !1
          ),
            pt.call(this, s, "keyup", (t) => {
              13 === t.which && qt.focusFirstMenuItem.call(this, null, !0);
            });
        },
        createMenuItem({
          value: e,
          list: t,
          type: i,
          title: s,
          badge: n = null,
          checked: o = !1,
        }) {
          const r = et(this.config.selectors.inputs[i]),
            a = X(
              "button",
              U(r, {
                type: "button",
                role: "menuitemradio",
                class: `${this.config.classNames.control} ${
                  r.class || ""
                }`.trim(),
                "aria-checked": o,
                value: e,
              })
            ),
            l = X("span");
          (l.innerHTML = s),
            D(n) && l.appendChild(n),
            a.appendChild(l),
            Object.defineProperty(a, "checked", {
              enumerable: !0,
              get: () => "true" === a.getAttribute("aria-checked"),
              set(t) {
                t &&
                  Array.from(a.parentNode.children)
                    .filter((t) => ot(t, '[role="menuitemradio"]'))
                    .forEach((t) => t.setAttribute("aria-checked", "false")),
                  a.setAttribute("aria-checked", t ? "true" : "false");
              },
            }),
            this.listeners.bind(
              a,
              "click keyup",
              (t) => {
                if (!q(t) || 32 === t.which) {
                  switch (
                    (t.preventDefault(),
                    t.stopPropagation(),
                    (a.checked = !0),
                    i)
                  ) {
                    case "language":
                      this.currentTrack = Number(e);
                      break;
                    case "quality":
                      this.quality = e;
                      break;
                    case "speed":
                      this.speed = parseFloat(e);
                  }
                  qt.showMenuPanel.call(this, "home", q(t));
                }
              },
              i,
              !1
            ),
            qt.bindMenuItemShortcuts.call(this, a, i),
            t.appendChild(a);
        },
        formatTime(t = 0, e = !1) {
          return I(t) ? Ft(t, 0 < Dt(this.duration), e) : t;
        },
        updateTimeDisplay(t = null, e = 0, i = !1) {
          D(t) && I(e) && (t.innerText = qt.formatTime(e, i));
        },
        updateVolume() {
          this.supported.ui &&
            (D(this.elements.inputs.volume) &&
              qt.setRange.call(
                this,
                this.elements.inputs.volume,
                this.muted ? 0 : this.volume
              ),
            D(this.elements.buttons.mute) &&
              (this.elements.buttons.mute.pressed =
                this.muted || 0 === this.volume));
        },
        setRange(t, e = 0) {
          D(t) && ((t.value = e), qt.updateRangeFill.call(this, t));
        },
        updateProgress(t) {
          if (this.supported.ui && F(t)) {
            var e,
              i,
              s,
              n = (t, e) => {
                const i = I(e) ? e : 0,
                  s = D(t) ? t : this.elements.display.buffer;
                if (D(s)) {
                  s.value = i;
                  const t = s.getElementsByTagName("span")[0];
                  D(t) && (t.childNodes[0].nodeValue = i);
                }
              };
            if (t)
              switch (t.type) {
                case "timeupdate":
                case "seeking":
                case "seeked":
                  (i = this.currentTime),
                    (s = this.duration),
                    (e =
                      0 === i || 0 === s || Number.isNaN(i) || Number.isNaN(s)
                        ? 0
                        : ((i / s) * 100).toFixed(2)),
                    "timeupdate" === t.type &&
                      qt.setRange.call(this, this.elements.inputs.seek, e);
                  break;
                case "playing":
                case "progress":
                  n(this.elements.display.buffer, 100 * this.buffered);
              }
          }
        },
        updateRangeFill(t) {
          const e = F(t) ? t.target : t;
          if (D(e) && "range" === e.getAttribute("type")) {
            if (ot(e, this.config.selectors.inputs.seek)) {
              e.setAttribute("aria-valuenow", this.currentTime);
              const t = qt.formatTime(this.currentTime),
                i = qt.formatTime(this.duration),
                s = Ot.get("seekLabel", this.config);
              e.setAttribute(
                "aria-valuetext",
                s.replace("{currentTime}", t).replace("{duration}", i)
              );
            } else if (ot(e, this.config.selectors.inputs.volume)) {
              const t = 100 * e.value;
              e.setAttribute("aria-valuenow", t),
                e.setAttribute("aria-valuetext", `${t.toFixed(1)}%`);
            } else e.setAttribute("aria-valuenow", e.value);
            V.isWebkit &&
              e.style.setProperty("--value", (e.value / e.max) * 100 + "%");
          }
        },
        updateSeekTooltip(e) {
          if (
            this.config.tooltips.seek &&
            D(this.elements.inputs.seek) &&
            D(this.elements.display.seekTooltip) &&
            0 !== this.duration
          ) {
            const s = `${this.config.classNames.tooltip}--visible`,
              n = (t) => st(this.elements.display.seekTooltip, s, t);
            if (this.touch) n(!1);
            else {
              let t = 0;
              var i = this.elements.progress.getBoundingClientRect();
              if (F(e)) t = (100 / i.width) * (e.pageX - i.left);
              else {
                if (!nt(this.elements.display.seekTooltip, s)) return;
                t = parseFloat(
                  this.elements.display.seekTooltip.style.left,
                  10
                );
              }
              t < 0 ? (t = 0) : 100 < t && (t = 100),
                qt.updateTimeDisplay.call(
                  this,
                  this.elements.display.seekTooltip,
                  (this.duration / 100) * t
                ),
                (this.elements.display.seekTooltip.style.left = `${t}%`),
                F(e) &&
                  ["mouseenter", "mouseleave"].includes(e.type) &&
                  n("mouseenter" === e.type);
            }
          }
        },
        timeUpdate(t) {
          var e = !D(this.elements.display.duration) && this.config.invertTime;
          qt.updateTimeDisplay.call(
            this,
            this.elements.display.currentTime,
            e ? this.duration - this.currentTime : this.currentTime,
            e
          ),
            (t && "timeupdate" === t.type && this.media.seeking) ||
              qt.updateProgress.call(this, t);
        },
        durationUpdate() {
          if (
            this.supported.ui &&
            (this.config.invertTime || !this.currentTime)
          ) {
            if (this.duration >= 2 ** 32)
              return (
                it(this.elements.display.currentTime, !0),
                void it(this.elements.progress, !0)
              );
            D(this.elements.inputs.seek) &&
              this.elements.inputs.seek.setAttribute(
                "aria-valuemax",
                this.duration
              );
            var t = D(this.elements.display.duration);
            !t &&
              this.config.displayDuration &&
              this.paused &&
              qt.updateTimeDisplay.call(
                this,
                this.elements.display.currentTime,
                this.duration
              ),
              t &&
                qt.updateTimeDisplay.call(
                  this,
                  this.elements.display.duration,
                  this.duration
                ),
              qt.updateSeekTooltip.call(this);
          }
        },
        toggleMenuButton(t, e) {
          it(this.elements.settings.buttons[t], !e);
        },
        updateSetting(t, e, i) {
          const s = this.elements.settings.panels[t];
          let n = null,
            o = e;
          if ("captions" === t) n = this.currentTrack;
          else {
            if (
              ((n = W(i) ? this[t] : i),
              W(n) && (n = this.config[t].default),
              !W(this.options[t]) && !this.options[t].includes(n))
            )
              return void this.debug.warn(
                `Unsupported value of '${n}' for ${t}`
              );
            if (!this.config[t].options.includes(n))
              return void this.debug.warn(`Disabled value of '${n}' for ${t}`);
          }
          if ((D(o) || (o = s && s.querySelector('[role="menu"]')), D(o))) {
            this.elements.settings.buttons[t].querySelector(
              `.${this.config.classNames.menu.value}`
            ).innerHTML = qt.getLabel.call(this, t, n);
            const r = o && o.querySelector(`[value="${n}"]`);
            D(r) && (r.checked = !0);
          }
        },
        getLabel(t, e) {
          switch (t) {
            case "speed":
              return 1 === e ? Ot.get("normal", this.config) : `${e}&times;`;
            case "quality":
              if (I(e)) {
                const t = Ot.get(`qualityLabel.${e}`, this.config);
                return t.length ? t : `${e}p`;
              }
              return Mt(e);
            case "captions":
              return Wt.getLabel.call(this);
            default:
              return null;
          }
        },
        setQualityMenu(t) {
          if (D(this.elements.settings.panels.quality)) {
            const e = "quality",
              i =
                this.elements.settings.panels.quality.querySelector(
                  '[role="menu"]'
                );
            j(t) &&
              (this.options.quality = vt(t).filter((t) =>
                this.config.quality.options.includes(t)
              ));
            t = !W(this.options.quality) && 1 < this.options.quality.length;
            if (
              (qt.toggleMenuButton.call(this, e, t),
              J(i),
              qt.checkMenu.call(this),
              t)
            ) {
              const s = (t) => {
                t = Ot.get(`qualityBadge.${t}`, this.config);
                return t.length ? qt.createBadge.call(this, t) : null;
              };
              this.options.quality
                .sort((t, e) => {
                  const i = this.config.quality.options;
                  return i.indexOf(t) > i.indexOf(e) ? 1 : -1;
                })
                .forEach((t) => {
                  qt.createMenuItem.call(this, {
                    value: t,
                    list: i,
                    type: e,
                    title: qt.getLabel.call(this, "quality", t),
                    badge: s(t),
                  });
                }),
                qt.updateSetting.call(this, e, i);
            }
          }
        },
        setCaptionsMenu() {
          if (D(this.elements.settings.panels.captions)) {
            const t = "captions",
              i =
                this.elements.settings.panels.captions.querySelector(
                  '[role="menu"]'
                ),
              e = Wt.getTracks.call(this),
              s = Boolean(e.length);
            if (
              (qt.toggleMenuButton.call(this, t, s),
              J(i),
              qt.checkMenu.call(this),
              s)
            ) {
              const n = e.map((t, e) => ({
                value: e,
                checked: this.captions.toggled && this.currentTrack === e,
                title: Wt.getLabel.call(this, t),
                badge:
                  t.language &&
                  qt.createBadge.call(this, t.language.toUpperCase()),
                list: i,
                type: "language",
              }));
              n.unshift({
                value: -1,
                checked: !this.captions.toggled,
                title: Ot.get("disabled", this.config),
                list: i,
                type: "language",
              }),
                n.forEach(qt.createMenuItem.bind(this)),
                qt.updateSetting.call(this, t, i);
            }
          }
        },
        setSpeedMenu() {
          if (D(this.elements.settings.panels.speed)) {
            const e = "speed",
              i =
                this.elements.settings.panels.speed.querySelector(
                  '[role="menu"]'
                );
            this.options.speed = this.options.speed.filter(
              (t) => t >= this.minimumSpeed && t <= this.maximumSpeed
            );
            var t = !W(this.options.speed) && 1 < this.options.speed.length;
            qt.toggleMenuButton.call(this, e, t),
              J(i),
              qt.checkMenu.call(this),
              t &&
                (this.options.speed.forEach((t) => {
                  qt.createMenuItem.call(this, {
                    value: t,
                    list: i,
                    type: e,
                    title: qt.getLabel.call(this, "speed", t),
                  });
                }),
                qt.updateSetting.call(this, e, i));
          }
        },
        checkMenu() {
          var { buttons: t } = this.elements.settings,
            t = !W(t) && Object.values(t).some((t) => !t.hidden);
          it(this.elements.settings.menu, !t);
        },
        focusFirstMenuItem(e, i = !1) {
          if (!this.elements.settings.popup.hidden) {
            let t = e;
            D(t) ||
              (t = Object.values(this.elements.settings.panels).find(
                (t) => !t.hidden
              ));
            e = t.querySelector('[role^="menuitem"]');
            lt.call(this, e, i);
          }
        },
        toggleMenu(e) {
          const { popup: i } = this.elements.settings,
            s = this.elements.buttons.settings;
          if (D(i) && D(s)) {
            const { hidden: n } = i;
            let t = n;
            if (O(e)) t = e;
            else if (q(e) && 27 === e.which) t = !1;
            else if (F(e)) {
              const n = z(e.composedPath) ? e.composedPath()[0] : e.target,
                o = i.contains(n);
              if (o || (!o && e.target !== s && t)) return;
            }
            s.setAttribute("aria-expanded", t),
              it(i, !t),
              st(this.elements.container, this.config.classNames.menu.open, t),
              t && q(e)
                ? qt.focusFirstMenuItem.call(this, null, !0)
                : t || n || lt.call(this, s, q(e));
          }
        },
        getMenuSize(t) {
          const e = t.cloneNode(!0);
          (e.style.position = "absolute"),
            (e.style.opacity = 0),
            e.removeAttribute("hidden"),
            t.parentNode.appendChild(e);
          var i = e.scrollWidth,
            t = e.scrollHeight;
          return K(e), { width: i, height: t };
        },
        showMenuPanel(t = "", e = !1) {
          t = this.elements.container.querySelector(
            `#plyr-settings-${this.id}-${t}`
          );
          if (D(t)) {
            const i = t.parentNode,
              s = Array.from(i.children).find((t) => !t.hidden);
            if (ut.transitions && !ut.reducedMotion) {
              (i.style.width = `${s.scrollWidth}px`),
                (i.style.height = `${s.scrollHeight}px`);
              const n = qt.getMenuSize.call(this, t),
                e = (t) => {
                  t.target === i &&
                    ["width", "height"].includes(t.propertyName) &&
                    ((i.style.width = ""),
                    (i.style.height = ""),
                    mt.call(this, i, R, e));
                };
              pt.call(this, i, R, e),
                (i.style.width = `${n.width}px`),
                (i.style.height = `${n.height}px`);
            }
            it(s, !0), it(t, !1), qt.focusFirstMenuItem.call(this, t, e);
          }
        },
        setDownloadUrl() {
          const t = this.elements.buttons.download;
          D(t) && t.setAttribute("href", this.download);
        },
        create(a) {
          const {
            bindMenuItemShortcuts: l,
            createButton: i,
            createProgress: t,
            createRange: s,
            createTime: c,
            setQualityMenu: e,
            setSpeedMenu: n,
            showMenuPanel: u,
          } = qt;
          (this.elements.controls = null),
            j(this.config.controls) &&
              this.config.controls.includes("play-large") &&
              this.elements.container.appendChild(i.call(this, "play-large"));
          const o = X("div", et(this.config.selectors.controls.wrapper));
          this.elements.controls = o;
          const h = { class: "plyr__controls__item" };
          return (
            vt(j(this.config.controls) ? this.config.controls : []).forEach(
              (e) => {
                if (
                  ("restart" === e && o.appendChild(i.call(this, "restart", h)),
                  "rewind" === e && o.appendChild(i.call(this, "rewind", h)),
                  "play" === e && o.appendChild(i.call(this, "play", h)),
                  "fast-forward" === e &&
                    o.appendChild(i.call(this, "fast-forward", h)),
                  "progress" === e)
                ) {
                  const l = X("div", {
                      class: `${h.class} plyr__progress__container`,
                    }),
                    i = X("div", et(this.config.selectors.progress));
                  if (
                    (i.appendChild(
                      s.call(this, "seek", { id: `plyr-seek-${a.id}` })
                    ),
                    i.appendChild(t.call(this, "buffer")),
                    this.config.tooltips.seek)
                  ) {
                    const a = X(
                      "span",
                      { class: this.config.classNames.tooltip },
                      "00:00"
                    );
                    i.appendChild(a), (this.elements.display.seekTooltip = a);
                  }
                  (this.elements.progress = i),
                    l.appendChild(this.elements.progress),
                    o.appendChild(l);
                }
                if (
                  ("current-time" === e &&
                    o.appendChild(c.call(this, "currentTime", h)),
                  "duration" === e &&
                    o.appendChild(c.call(this, "duration", h)),
                  "mute" === e || "volume" === e)
                ) {
                  let { volume: t } = this.elements;
                  if (
                    ((D(t) && o.contains(t)) ||
                      ((t = X(
                        "div",
                        U({}, h, { class: `${h.class} plyr__volume`.trim() })
                      )),
                      (this.elements.volume = t),
                      o.appendChild(t)),
                    "mute" === e && t.appendChild(i.call(this, "mute")),
                    "volume" === e && !V.isIos)
                  ) {
                    const i = { max: 1, step: 0.05, value: this.config.volume };
                    t.appendChild(
                      s.call(
                        this,
                        "volume",
                        U(i, { id: `plyr-volume-${a.id}` })
                      )
                    );
                  }
                }
                if (
                  ("captions" === e &&
                    o.appendChild(i.call(this, "captions", h)),
                  "settings" === e && !W(this.config.settings))
                ) {
                  const t = X(
                    "div",
                    U({}, h, {
                      class: `${h.class} plyr__menu`.trim(),
                      hidden: "",
                    })
                  );
                  t.appendChild(
                    i.call(this, "settings", {
                      "aria-haspopup": !0,
                      "aria-controls": `plyr-settings-${a.id}`,
                      "aria-expanded": !1,
                    })
                  );
                  const s = X("div", {
                      class: "plyr__menu__container",
                      id: `plyr-settings-${a.id}`,
                      hidden: "",
                    }),
                    c = X("div"),
                    e = X("div", { id: `plyr-settings-${a.id}-home` }),
                    r = X("div", { role: "menu" });
                  e.appendChild(r),
                    c.appendChild(e),
                    (this.elements.settings.panels.home = e),
                    this.config.settings.forEach((t) => {
                      const e = X(
                        "button",
                        U(et(this.config.selectors.buttons.settings), {
                          type: "button",
                          class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`,
                          role: "menuitem",
                          "aria-haspopup": !0,
                          hidden: "",
                        })
                      );
                      l.call(this, e, t),
                        pt.call(this, e, "click", () => {
                          u.call(this, t, !1);
                        });
                      const i = X("span", null, Ot.get(t, this.config)),
                        s = X("span", {
                          class: this.config.classNames.menu.value,
                        });
                      (s.innerHTML = a[t]),
                        i.appendChild(s),
                        e.appendChild(i),
                        r.appendChild(e);
                      const n = X("div", {
                          id: `plyr-settings-${a.id}-${t}`,
                          hidden: "",
                        }),
                        o = X("button", {
                          type: "button",
                          class: `${this.config.classNames.control} ${this.config.classNames.control}--back`,
                        });
                      o.appendChild(
                        X("span", { "aria-hidden": !0 }, Ot.get(t, this.config))
                      ),
                        o.appendChild(
                          X(
                            "span",
                            { class: this.config.classNames.hidden },
                            Ot.get("menuBack", this.config)
                          )
                        ),
                        pt.call(
                          this,
                          n,
                          "keydown",
                          (t) => {
                            37 === t.which &&
                              (t.preventDefault(),
                              t.stopPropagation(),
                              u.call(this, "home", !0));
                          },
                          !1
                        ),
                        pt.call(this, o, "click", () => {
                          u.call(this, "home", !1);
                        }),
                        n.appendChild(o),
                        n.appendChild(X("div", { role: "menu" })),
                        c.appendChild(n),
                        (this.elements.settings.buttons[t] = e),
                        (this.elements.settings.panels[t] = n);
                    }),
                    s.appendChild(c),
                    t.appendChild(s),
                    o.appendChild(t),
                    (this.elements.settings.popup = s),
                    (this.elements.settings.menu = t);
                }
                if (
                  ("pip" === e &&
                    ut.pip &&
                    o.appendChild(i.call(this, "pip", h)),
                  "airplay" === e &&
                    ut.airplay &&
                    o.appendChild(i.call(this, "airplay", h)),
                  "download" === e)
                ) {
                  const a = U({}, h, {
                    element: "a",
                    href: this.download,
                    target: "_blank",
                  });
                  this.isHTML5 && (a.download = "");
                  const { download: l } = this.config.urls;
                  !H(l) &&
                    this.isEmbed &&
                    U(a, {
                      icon: `logo-${this.provider}`,
                      label: this.provider,
                    }),
                    o.appendChild(i.call(this, "download", a));
                }
                "fullscreen" === e &&
                  o.appendChild(i.call(this, "fullscreen", h));
              }
            ),
            this.isHTML5 && e.call(this, kt.getQualityOptions.call(this)),
            n.call(this),
            o
          );
        },
        inject() {
          if (this.config.loadSprite) {
            const e = qt.getIconUrl.call(this);
            e.cors && Lt(e.url, "sprite-plyr");
          }
          this.id = Math.floor(1e4 * Math.random());
          let e = null;
          this.elements.controls = null;
          const t = {
            id: this.id,
            seektime: this.config.seekTime,
            title: this.config.title,
          };
          let i = !0;
          z(this.config.controls) &&
            (this.config.controls = this.config.controls.call(this, t)),
            this.config.controls || (this.config.controls = []),
            D(this.config.controls) || P(this.config.controls)
              ? (e = this.config.controls)
              : ((e = qt.create.call(this, {
                  id: this.id,
                  seektime: this.config.seekTime,
                  speed: this.speed,
                  quality: this.quality,
                  captions: Wt.getLabel.call(this),
                })),
                (i = !1));
          let s;
          if (
            (i &&
              P(this.config.controls) &&
              (e = (() => {
                let i = e;
                return (
                  Object.entries(t).forEach(([t, e]) => {
                    i = Et(i, `{${t}}`, e);
                  }),
                  i
                );
              })()),
            P(this.config.selectors.controls.container) &&
              (s = document.querySelector(
                this.config.selectors.controls.container
              )),
            D(s) || (s = this.elements.container),
            s[D(e) ? "insertAdjacentElement" : "insertAdjacentHTML"](
              "afterbegin",
              e
            ),
            D(this.elements.controls) || qt.findElements.call(this),
            !W(this.elements.buttons))
          ) {
            const e = (e) => {
              const i = this.config.classNames.controlPressed;
              Object.defineProperty(e, "pressed", {
                enumerable: !0,
                get: () => nt(e, i),
                set(t = !1) {
                  st(e, i, t);
                },
              });
            };
            Object.values(this.elements.buttons)
              .filter(Boolean)
              .forEach((t) => {
                j(t) || L(t) ? Array.from(t).filter(Boolean).forEach(e) : e(t);
              });
          }
          if ((V.isEdge && B(s), this.config.tooltips.controls)) {
            const { classNames: e, selectors: t } = this.config,
              i = `${t.controls.wrapper} ${t.labels} .${e.hidden}`,
              s = rt.call(this, i);
            Array.from(s).forEach((t) => {
              st(t, this.config.classNames.hidden, !1),
                st(t, this.config.classNames.tooltip, !0);
            });
          }
        },
      };
      function Nt(t, e = !0) {
        let i = t;
        if (e) {
          const t = document.createElement("a");
          (t.href = i), (i = t.href);
        }
        try {
          return new URL(i);
        } catch (t) {
          return null;
        }
      }
      function Ht(t) {
        const i = new URLSearchParams();
        return (
          M(t) &&
            Object.entries(t).forEach(([t, e]) => {
              i.set(t, e);
            }),
          i
        );
      }
      const Wt = {
          setup() {
            if (this.supported.ui)
              if (
                !this.isVideo ||
                this.isYouTube ||
                (this.isHTML5 && !ut.textTracks)
              )
                j(this.config.controls) &&
                  this.config.controls.includes("settings") &&
                  this.config.settings.includes("captions") &&
                  qt.setCaptionsMenu.call(this);
              else {
                var i;
                if (
                  (D(this.elements.captions) ||
                    ((this.elements.captions = X(
                      "div",
                      et(this.config.selectors.captions)
                    )),
                    (i = this.elements.captions),
                    (s = this.elements.wrapper),
                    D(i) &&
                      D(s) &&
                      s.parentNode.insertBefore(i, s.nextSibling)),
                  V.isIE && window.URL)
                ) {
                  const i = this.media.querySelectorAll("track");
                  Array.from(i).forEach((e) => {
                    var t = e.getAttribute("src"),
                      i = Nt(t);
                    null !== i &&
                      i.hostname !== window.location.href.hostname &&
                      ["http:", "https:"].includes(i.protocol) &&
                      jt(t, "blob")
                        .then((t) => {
                          e.setAttribute("src", window.URL.createObjectURL(t));
                        })
                        .catch(() => {
                          K(e);
                        });
                  });
                }
                var s = vt(
                  (
                    navigator.languages || [
                      navigator.language || navigator.userLanguage || "en",
                    ]
                  ).map((t) => t.split("-")[0])
                );
                let t = (
                  this.storage.get("language") ||
                  this.config.captions.language ||
                  "auto"
                ).toLowerCase();
                "auto" === t && ([t] = s);
                let e = this.storage.get("captions");
                if (
                  (O(e) || ({ active: e } = this.config.captions),
                  Object.assign(this.captions, {
                    toggled: !1,
                    active: e,
                    language: t,
                    languages: s,
                  }),
                  this.isHTML5)
                ) {
                  const i = this.config.captions.update
                    ? "addtrack removetrack"
                    : "removetrack";
                  pt.call(this, this.media.textTracks, i, Wt.update.bind(this));
                }
                setTimeout(Wt.update.bind(this), 0);
              }
          },
          update() {
            const t = Wt.getTracks.call(this, !0),
              {
                active: e,
                language: i,
                meta: s,
                currentTrackNode: n,
              } = this.captions,
              o = Boolean(t.find((t) => t.language === i));
            this.isHTML5 &&
              this.isVideo &&
              t
                .filter((t) => !s.get(t))
                .forEach((t) => {
                  this.debug.log("Track added", t),
                    s.set(t, { default: "showing" === t.mode }),
                    "showing" === t.mode && (t.mode = "hidden"),
                    pt.call(this, t, "cuechange", () =>
                      Wt.updateCues.call(this)
                    );
                }),
              ((o && this.language !== i) || !t.includes(n)) &&
                (Wt.setLanguage.call(this, i), Wt.toggle.call(this, e && o)),
              st(
                this.elements.container,
                this.config.classNames.captions.enabled,
                !W(t)
              ),
              j(this.config.controls) &&
                this.config.controls.includes("settings") &&
                this.config.settings.includes("captions") &&
                qt.setCaptionsMenu.call(this);
          },
          toggle(t, e = !0) {
            if (this.supported.ui) {
              const { toggled: i } = this.captions,
                s = this.config.classNames.captions.active,
                n = E(t) ? !i : t;
              if (n !== i) {
                if (
                  (e ||
                    ((this.captions.active = n),
                    this.storage.set({ captions: n })),
                  !this.language && n && !e)
                ) {
                  const t = Wt.getTracks.call(this),
                    e = Wt.findTrack.call(
                      this,
                      [this.captions.language, ...this.captions.languages],
                      !0
                    );
                  return (
                    (this.captions.language = e.language),
                    void Wt.set.call(this, t.indexOf(e))
                  );
                }
                this.elements.buttons.captions &&
                  (this.elements.buttons.captions.pressed = n),
                  st(this.elements.container, s, n),
                  (this.captions.toggled = n),
                  qt.updateSetting.call(this, "captions"),
                  ft.call(
                    this,
                    this.media,
                    n ? "captionsenabled" : "captionsdisabled"
                  );
              }
              setTimeout(() => {
                n &&
                  this.captions.toggled &&
                  (this.captions.currentTrackNode.mode = "hidden");
              });
            }
          },
          set(t, e = !0) {
            var i,
              s = Wt.getTracks.call(this);
            -1 !== t
              ? I(t)
                ? t in s
                  ? (this.captions.currentTrack !== t &&
                      (({ language: s } =
                        (i = s[(this.captions.currentTrack = t)]) || {}),
                      (this.captions.currentTrackNode = i),
                      qt.updateSetting.call(this, "captions"),
                      e ||
                        ((this.captions.language = s),
                        this.storage.set({ language: s })),
                      this.isVimeo && this.embed.enableTextTrack(s),
                      ft.call(this, this.media, "languagechange")),
                    Wt.toggle.call(this, !0, e),
                    this.isHTML5 && this.isVideo && Wt.updateCues.call(this))
                  : this.debug.warn("Track not found", t)
                : this.debug.warn("Invalid caption argument", t)
              : Wt.toggle.call(this, !1, e);
          },
          setLanguage(t, e = !0) {
            if (P(t)) {
              var i = t.toLowerCase();
              this.captions.language = i;
              const s = Wt.getTracks.call(this),
                n = Wt.findTrack.call(this, [i]);
              Wt.set.call(this, s.indexOf(n), e);
            } else this.debug.warn("Invalid language argument", t);
          },
          getTracks(e = !1) {
            return Array.from((this.media || {}).textTracks || [])
              .filter((t) => !this.isHTML5 || e || this.captions.meta.has(t))
              .filter((t) => ["captions", "subtitles"].includes(t.kind));
          },
          findTrack(t, e = !1) {
            const i = Wt.getTracks.call(this),
              s = (t) => Number((this.captions.meta.get(t) || {}).default),
              n = Array.from(i).sort((t, e) => s(e) - s(t));
            let o;
            return (
              t.every((e) => ((o = n.find((t) => t.language === e)), !o)),
              o || (e ? n[0] : void 0)
            );
          },
          getCurrentTrack() {
            return Wt.getTracks.call(this)[this.currentTrack];
          },
          getLabel(t) {
            let e = t;
            return (
              !N(e) &&
                ut.textTracks &&
                this.captions.toggled &&
                (e = Wt.getCurrentTrack.call(this)),
              N(e)
                ? W(e.label)
                  ? W(e.language)
                    ? Ot.get("enabled", this.config)
                    : t.language.toUpperCase()
                  : e.label
                : Ot.get("disabled", this.config)
            );
          },
          updateCues(e) {
            if (this.supported.ui)
              if (D(this.elements.captions))
                if (E(e) || Array.isArray(e)) {
                  let t = e;
                  if (!t) {
                    const e = Wt.getCurrentTrack.call(this);
                    t = Array.from((e || {}).activeCues || [])
                      .map((t) => t.getCueAsHTML())
                      .map(It);
                  }
                  var i = t.map((t) => t.trim()).join("\n");
                  if (i !== this.elements.captions.innerHTML) {
                    J(this.elements.captions);
                    const e = X("span", et(this.config.selectors.caption));
                    (e.innerHTML = i),
                      this.elements.captions.appendChild(e),
                      ft.call(this, this.media, "cuechange");
                  }
                } else this.debug.warn("updateCues: Invalid input", e);
              else this.debug.warn("No captions element to render to");
          },
        },
        Rt = {
          enabled: !0,
          title: "",
          debug: !1,
          autoplay: !1,
          autopause: !0,
          playsinline: !0,
          seekTime: 10,
          volume: 1,
          muted: !1,
          duration: null,
          displayDuration: !0,
          invertTime: !0,
          toggleInvert: !0,
          ratio: null,
          clickToPlay: !0,
          hideControls: !0,
          resetOnEnd: !1,
          disableContextMenu: !0,
          loadSprite: !0,
          iconPrefix: "plyr",
          iconUrl: "https://cdn.plyr.io/3.6.8/plyr.svg",
          blankVideo: "https://cdn.plyr.io/static/blank.mp4",
          quality: {
            default: 576,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
            forced: !1,
            onChange: null,
          },
          loop: { active: !1 },
          speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4],
          },
          keyboard: { focused: !0, global: !1 },
          tooltips: { controls: !1, seek: !0 },
          captions: { active: !1, language: "auto", update: !1 },
          fullscreen: { enabled: !0, fallback: !0, iosNative: !1 },
          storage: { enabled: !0, key: "plyr" },
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ],
          settings: ["captions", "quality", "speed"],
          i18n: {
            restart: "Restart",
            rewind: "Rewind {seektime}s",
            play: "Play",
            pause: "Pause",
            fastForward: "Forward {seektime}s",
            seek: "Seek",
            seekLabel: "{currentTime} of {duration}",
            played: "Played",
            buffered: "Buffered",
            currentTime: "Current time",
            duration: "Duration",
            volume: "Volume",
            mute: "Mute",
            unmute: "Unmute",
            enableCaptions: "Enable captions",
            disableCaptions: "Disable captions",
            download: "Download",
            enterFullscreen: "Enter fullscreen",
            exitFullscreen: "Exit fullscreen",
            frameTitle: "Player for {title}",
            captions: "Captions",
            settings: "Settings",
            pip: "PIP",
            menuBack: "Go back to previous menu",
            speed: "Speed",
            normal: "Normal",
            quality: "Quality",
            loop: "Loop",
            start: "Start",
            end: "End",
            all: "All",
            reset: "Reset",
            disabled: "Disabled",
            enabled: "Enabled",
            advertisement: "Ad",
            qualityBadge: {
              2160: "4K",
              1440: "HD",
              1080: "HD",
              720: "HD",
              576: "SD",
              480: "SD",
            },
          },
          urls: {
            download: null,
            vimeo: {
              sdk: "https://player.vimeo.com/api/player.js",
              iframe: "https://player.vimeo.com/video/{0}?{1}",
              api: "https://vimeo.com/api/oembed.json?url={0}",
            },
            youtube: {
              sdk: "https://www.youtube.com/iframe_api",
              api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}",
            },
            googleIMA: {
              sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js",
            },
          },
          listeners: {
            seek: null,
            play: null,
            pause: null,
            restart: null,
            rewind: null,
            fastForward: null,
            mute: null,
            volume: null,
            captions: null,
            download: null,
            fullscreen: null,
            pip: null,
            airplay: null,
            speed: null,
            quality: null,
            loop: null,
            language: null,
          },
          events: [
            "ended",
            "progress",
            "stalled",
            "playing",
            "waiting",
            "canplay",
            "canplaythrough",
            "loadstart",
            "loadeddata",
            "loadedmetadata",
            "timeupdate",
            "volumechange",
            "play",
            "pause",
            "error",
            "seeking",
            "seeked",
            "emptied",
            "ratechange",
            "cuechange",
            "download",
            "enterfullscreen",
            "exitfullscreen",
            "captionsenabled",
            "captionsdisabled",
            "languagechange",
            "controlshidden",
            "controlsshown",
            "ready",
            "statechange",
            "qualitychange",
            "adsloaded",
            "adscontentpause",
            "adscontentresume",
            "adstarted",
            "adsmidpoint",
            "adscomplete",
            "adsallcomplete",
            "adsimpression",
            "adsclick",
          ],
          selectors: {
            editable: "input, textarea, select, [contenteditable]",
            container: ".plyr",
            controls: { container: null, wrapper: ".plyr__controls" },
            labels: "[data-plyr]",
            buttons: {
              play: '[data-plyr="play"]',
              pause: '[data-plyr="pause"]',
              restart: '[data-plyr="restart"]',
              rewind: '[data-plyr="rewind"]',
              fastForward: '[data-plyr="fast-forward"]',
              mute: '[data-plyr="mute"]',
              captions: '[data-plyr="captions"]',
              download: '[data-plyr="download"]',
              fullscreen: '[data-plyr="fullscreen"]',
              pip: '[data-plyr="pip"]',
              airplay: '[data-plyr="airplay"]',
              settings: '[data-plyr="settings"]',
              loop: '[data-plyr="loop"]',
            },
            inputs: {
              seek: '[data-plyr="seek"]',
              volume: '[data-plyr="volume"]',
              speed: '[data-plyr="speed"]',
              language: '[data-plyr="language"]',
              quality: '[data-plyr="quality"]',
            },
            display: {
              currentTime: ".plyr__time--current",
              duration: ".plyr__time--duration",
              buffer: ".plyr__progress__buffer",
              loop: ".plyr__progress__loop",
              volume: ".plyr__volume--display",
            },
            progress: ".plyr__progress",
            captions: ".plyr__captions",
            caption: ".plyr__caption",
          },
          classNames: {
            type: "plyr--{0}",
            provider: "plyr--{0}",
            video: "plyr__video-wrapper",
            embed: "plyr__video-embed",
            videoFixedRatio: "plyr__video-wrapper--fixed-ratio",
            embedContainer: "plyr__video-embed__container",
            poster: "plyr__poster",
            posterEnabled: "plyr__poster-enabled",
            ads: "plyr__ads",
            control: "plyr__control",
            controlPressed: "plyr__control--pressed",
            playing: "plyr--playing",
            paused: "plyr--paused",
            stopped: "plyr--stopped",
            loading: "plyr--loading",
            hover: "plyr--hover",
            tooltip: "plyr__tooltip",
            cues: "plyr__cues",
            hidden: "plyr__sr-only",
            hideControls: "plyr--hide-controls",
            isIos: "plyr--is-ios",
            isTouch: "plyr--is-touch",
            uiSupported: "plyr--full-ui",
            noTransition: "plyr--no-transition",
            display: { time: "plyr__time" },
            menu: {
              value: "plyr__menu__value",
              badge: "plyr__badge",
              open: "plyr--menu-open",
            },
            captions: {
              enabled: "plyr--captions-enabled",
              active: "plyr--captions-active",
            },
            fullscreen: {
              enabled: "plyr--fullscreen-enabled",
              fallback: "plyr--fullscreen-fallback",
            },
            pip: {
              supported: "plyr--pip-supported",
              active: "plyr--pip-active",
            },
            airplay: {
              supported: "plyr--airplay-supported",
              active: "plyr--airplay-active",
            },
            tabFocus: "plyr__tab-focus",
            previewThumbnails: {
              thumbContainer: "plyr__preview-thumb",
              thumbContainerShown: "plyr__preview-thumb--is-shown",
              imageContainer: "plyr__preview-thumb__image-container",
              timeContainer: "plyr__preview-thumb__time-container",
              scrubbingContainer: "plyr__preview-scrubbing",
              scrubbingContainerShown: "plyr__preview-scrubbing--is-shown",
            },
          },
          attributes: {
            embed: { provider: "data-plyr-provider", id: "data-plyr-embed-id" },
          },
          ads: { enabled: !1, publisherId: "", tagUrl: "" },
          previewThumbnails: { enabled: !1, src: "" },
          vimeo: {
            byline: !1,
            portrait: !1,
            title: !1,
            speed: !0,
            transparent: !1,
            customControls: !0,
            referrerPolicy: null,
            premium: !1,
          },
          youtube: {
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            customControls: !0,
            noCookie: !1,
          },
        },
        Bt = "picture-in-picture",
        Vt = { html5: "html5", youtube: "youtube", vimeo: "vimeo" },
        Yt = () => {};
      class Ut {
        constructor(t = !1) {
          (this.enabled = window.console && t),
            this.enabled && this.log("Debugging enabled");
        }
        get log() {
          return this.enabled
            ? Function.prototype.bind.call(console.log, console)
            : Yt;
        }
        get warn() {
          return this.enabled
            ? Function.prototype.bind.call(console.warn, console)
            : Yt;
        }
        get error() {
          return this.enabled
            ? Function.prototype.bind.call(console.error, console)
            : Yt;
        }
      }
      class Qt {
        constructor(t) {
          o(this, "onChange", () => {
            if (this.enabled) {
              const e = this.player.elements.buttons.fullscreen;
              D(e) && (e.pressed = this.active);
              var t =
                this.target === this.player.media
                  ? this.target
                  : this.player.elements.container;
              ft.call(
                this.player,
                t,
                this.active ? "enterfullscreen" : "exitfullscreen",
                !0
              );
            }
          }),
            o(this, "toggleFallback", (e = !1) => {
              if (
                (e
                  ? (this.scrollPosition = {
                      x: window.scrollX || 0,
                      y: window.scrollY || 0,
                    })
                  : window.scrollTo(
                      this.scrollPosition.x,
                      this.scrollPosition.y
                    ),
                (document.body.style.overflow = e ? "hidden" : ""),
                st(
                  this.target,
                  this.player.config.classNames.fullscreen.fallback,
                  e
                ),
                V.isIos)
              ) {
                let t = document.head.querySelector('meta[name="viewport"]');
                const s = "viewport-fit=cover";
                t ||
                  ((t = document.createElement("meta")),
                  t.setAttribute("name", "viewport"));
                var i = P(t.content) && t.content.includes(s);
                e
                  ? ((this.cleanupViewport = !i), i || (t.content += `,${s}`))
                  : this.cleanupViewport &&
                    (t.content = t.content
                      .split(",")
                      .filter((t) => t.trim() !== s)
                      .join(","));
              }
              this.onChange();
            }),
            o(this, "trapFocus", (t) => {
              if (
                !V.isIos &&
                this.active &&
                "Tab" === t.key &&
                9 === t.keyCode
              ) {
                const e = document.activeElement,
                  i = rt.call(
                    this.player,
                    "a[href], button:not(:disabled), input:not(:disabled), [tabindex]"
                  ),
                  [s] = i,
                  n = i[i.length - 1];
                e !== n || t.shiftKey
                  ? e === s && t.shiftKey && (n.focus(), t.preventDefault())
                  : (s.focus(), t.preventDefault());
              }
            }),
            o(this, "update", () => {
              var t;
              this.enabled
                ? ((t = this.forceFallback
                    ? "Fallback (forced)"
                    : Qt.native
                    ? "Native"
                    : "Fallback"),
                  this.player.debug.log(`${t} fullscreen enabled`))
                : this.player.debug.log(
                    "Fullscreen not supported and fallback disabled"
                  ),
                st(
                  this.player.elements.container,
                  this.player.config.classNames.fullscreen.enabled,
                  this.enabled
                );
            }),
            o(this, "enter", () => {
              this.enabled &&
                (V.isIos && this.player.config.fullscreen.iosNative
                  ? this.player.isVimeo
                    ? this.player.embed.requestFullscreen()
                    : this.target.webkitEnterFullscreen()
                  : !Qt.native || this.forceFallback
                  ? this.toggleFallback(!0)
                  : this.prefix
                  ? W(this.prefix) ||
                    this.target[`${this.prefix}Request${this.property}`]()
                  : this.target.requestFullscreen({ navigationUI: "hide" }));
            }),
            o(this, "exit", () => {
              var t;
              this.enabled &&
                (V.isIos && this.player.config.fullscreen.iosNative
                  ? (this.target.webkitExitFullscreen(), yt(this.player.play()))
                  : !Qt.native || this.forceFallback
                  ? this.toggleFallback(!1)
                  : this.prefix
                  ? W(this.prefix) ||
                    ((t = "moz" === this.prefix ? "Cancel" : "Exit"),
                    document[`${this.prefix}${t}${this.property}`]())
                  : (document.cancelFullScreen || document.exitFullscreen).call(
                      document
                    ));
            }),
            o(this, "toggle", () => {
              this.active ? this.exit() : this.enter();
            }),
            (this.player = t),
            (this.prefix = Qt.prefix),
            (this.property = Qt.property),
            (this.scrollPosition = { x: 0, y: 0 }),
            (this.forceFallback = "force" === t.config.fullscreen.fallback),
            (this.player.elements.fullscreen =
              t.config.fullscreen.container &&
              (function (t, e) {
                const { prototype: i } = Element;
                return (
                  i.closest ||
                  function () {
                    let t = this;
                    do {
                      if (ot.matches(t, e)) return t;
                    } while (
                      ((t = t.parentElement || t.parentNode),
                      null !== t && 1 === t.nodeType)
                    );
                    return null;
                  }
                ).call(t, e);
              })(
                this.player.elements.container,
                t.config.fullscreen.container
              )),
            pt.call(
              this.player,
              document,
              "ms" === this.prefix
                ? "MSFullscreenChange"
                : `${this.prefix}fullscreenchange`,
              () => {
                this.onChange();
              }
            ),
            pt.call(
              this.player,
              this.player.elements.container,
              "dblclick",
              (t) => {
                (D(this.player.elements.controls) &&
                  this.player.elements.controls.contains(t.target)) ||
                  this.player.listeners.proxy(t, this.toggle, "fullscreen");
              }
            ),
            pt.call(this, this.player.elements.container, "keydown", (t) =>
              this.trapFocus(t)
            ),
            this.update();
        }
        static get native() {
          return !!(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
          );
        }
        get usingNative() {
          return Qt.native && !this.forceFallback;
        }
        static get prefix() {
          if (z(document.exitFullscreen)) return "";
          let e = "";
          return (
            ["webkit", "moz", "ms"].some(
              (t) =>
                !(
                  (!z(document[`${t}ExitFullscreen`]) &&
                    !z(document[`${t}CancelFullScreen`])) ||
                  ((e = t), 0)
                )
            ),
            e
          );
        }
        static get property() {
          return "moz" === this.prefix ? "FullScreen" : "Fullscreen";
        }
        get enabled() {
          return (
            (Qt.native || this.player.config.fullscreen.fallback) &&
            this.player.config.fullscreen.enabled &&
            this.player.supported.ui &&
            this.player.isVideo
          );
        }
        get active() {
          if (!this.enabled) return !1;
          if (!Qt.native || this.forceFallback)
            return nt(
              this.target,
              this.player.config.classNames.fullscreen.fallback
            );
          var t = this.prefix
            ? document[`${this.prefix}${this.property}Element`]
            : document.fullscreenElement;
          return t && t.shadowRoot
            ? t === this.target.getRootNode().host
            : t === this.target;
        }
        get target() {
          return V.isIos && this.player.config.fullscreen.iosNative
            ? this.player.media
            : this.player.elements.fullscreen || this.player.elements.container;
        }
      }
      function Gt(n, o = 1) {
        return new Promise((t, e) => {
          const i = new Image(),
            s = () => {
              delete i.onload,
                delete i.onerror,
                (i.naturalWidth >= o ? t : e)(i);
            };
          Object.assign(i, { onload: s, onerror: s, src: n });
        });
      }
      const Xt = {
        addStyleHook() {
          st(
            this.elements.container,
            this.config.selectors.container.replace(".", ""),
            !0
          ),
            st(
              this.elements.container,
              this.config.classNames.uiSupported,
              this.supported.ui
            );
        },
        toggleNativeControls(t = !1) {
          t && this.isHTML5
            ? this.media.setAttribute("controls", "")
            : this.media.removeAttribute("controls");
        },
        build() {
          if ((this.listeners.media(), !this.supported.ui))
            return (
              this.debug.warn(
                `Basic support only for ${this.provider} ${this.type}`
              ),
              void Xt.toggleNativeControls.call(this, !0)
            );
          D(this.elements.controls) ||
            (qt.inject.call(this), this.listeners.controls()),
            Xt.toggleNativeControls.call(this),
            this.isHTML5 && Wt.setup.call(this),
            (this.volume = null),
            (this.muted = null),
            (this.loop = null),
            (this.quality = null),
            (this.speed = null),
            qt.updateVolume.call(this),
            qt.timeUpdate.call(this),
            Xt.checkPlaying.call(this),
            st(
              this.elements.container,
              this.config.classNames.pip.supported,
              ut.pip && this.isHTML5 && this.isVideo
            ),
            st(
              this.elements.container,
              this.config.classNames.airplay.supported,
              ut.airplay && this.isHTML5
            ),
            st(this.elements.container, this.config.classNames.isIos, V.isIos),
            st(
              this.elements.container,
              this.config.classNames.isTouch,
              this.touch
            ),
            (this.ready = !0),
            setTimeout(() => {
              ft.call(this, this.media, "ready");
            }, 0),
            Xt.setTitle.call(this),
            this.poster &&
              Xt.setPoster.call(this, this.poster, !1).catch(() => {}),
            this.config.duration && qt.durationUpdate.call(this);
        },
        setTitle() {
          let e = Ot.get("play", this.config);
          if (
            (P(this.config.title) &&
              !W(this.config.title) &&
              (e += `, ${this.config.title}`),
            Array.from(this.elements.buttons.play || []).forEach((t) => {
              t.setAttribute("aria-label", e);
            }),
            this.isEmbed)
          ) {
            const e = at.call(this, "iframe");
            if (D(e)) {
              const t = W(this.config.title) ? "video" : this.config.title,
                i = Ot.get("frameTitle", this.config);
              e.setAttribute("title", i.replace("{title}", t));
            }
          }
        },
        togglePoster(t) {
          st(this.elements.container, this.config.classNames.posterEnabled, t);
        },
        setPoster(e, t = !0) {
          return t && this.poster
            ? Promise.reject(new Error("Poster already set"))
            : (this.media.setAttribute("data-poster", e),
              this.elements.poster.removeAttribute("hidden"),
              function () {
                return new Promise((t) =>
                  this.ready
                    ? setTimeout(t, 0)
                    : pt.call(this, this.elements.container, "ready", t)
                ).then(() => {});
              }
                .call(this)
                .then(() => Gt(e))
                .catch((t) => {
                  throw (
                    (e === this.poster && Xt.togglePoster.call(this, !1), t)
                  );
                })
                .then(() => {
                  if (e !== this.poster)
                    throw new Error(
                      "setPoster cancelled by later call to setPoster"
                    );
                })
                .then(
                  () => (
                    Object.assign(this.elements.poster.style, {
                      backgroundImage: `url('${e}')`,
                      backgroundSize: "",
                    }),
                    Xt.togglePoster.call(this, !0),
                    e
                  )
                ));
        },
        checkPlaying(t) {
          st(
            this.elements.container,
            this.config.classNames.playing,
            this.playing
          ),
            st(
              this.elements.container,
              this.config.classNames.paused,
              this.paused
            ),
            st(
              this.elements.container,
              this.config.classNames.stopped,
              this.stopped
            ),
            Array.from(this.elements.buttons.play || []).forEach((t) => {
              Object.assign(t, { pressed: this.playing }),
                t.setAttribute(
                  "aria-label",
                  Ot.get(this.playing ? "pause" : "play", this.config)
                );
            }),
            (F(t) && "timeupdate" === t.type) || Xt.toggleControls.call(this);
        },
        checkLoading(t) {
          (this.loading = ["stalled", "waiting"].includes(t.type)),
            clearTimeout(this.timers.loading),
            (this.timers.loading = setTimeout(
              () => {
                st(
                  this.elements.container,
                  this.config.classNames.loading,
                  this.loading
                ),
                  Xt.toggleControls.call(this);
              },
              this.loading ? 250 : 0
            ));
        },
        toggleControls(t) {
          var e,
            { controls: i } = this.elements;
          i &&
            this.config.hideControls &&
            ((e = this.touch && this.lastSeekTime + 2e3 > Date.now()),
            this.toggleControls(
              Boolean(
                t || this.loading || this.paused || i.pressed || i.hover || e
              )
            ));
        },
        migrateStyles() {
          Object.values({ ...this.media.style })
            .filter((t) => !W(t) && P(t) && t.startsWith("--plyr"))
            .forEach((t) => {
              this.elements.container.style.setProperty(
                t,
                this.media.style.getPropertyValue(t)
              ),
                this.media.style.removeProperty(t);
            }),
            W(this.media.style) && this.media.removeAttribute("style");
        },
      };
      class Zt {
        constructor(t) {
          o(this, "firstTouch", () => {
            const { player: t } = this,
              { elements: e } = t;
            (t.touch = !0), st(e.container, t.config.classNames.isTouch, !0);
          }),
            o(this, "setTabFocus", (t) => {
              const { player: e } = this,
                { elements: i } = e;
              var s;
              clearTimeout(this.focusTimer),
                ("keydown" === t.type && 9 !== t.which) ||
                  ("keydown" === t.type && (this.lastKeyDown = t.timeStamp),
                  (s = t.timeStamp - this.lastKeyDown <= 20),
                  ("focus" === t.type && !s) ||
                    ((s = e.config.classNames.tabFocus),
                    st(rt.call(e, `.${s}`), s, !1),
                    "focusout" !== t.type &&
                      (this.focusTimer = setTimeout(() => {
                        var t = document.activeElement;
                        i.container.contains(t) &&
                          st(
                            document.activeElement,
                            e.config.classNames.tabFocus,
                            !0
                          );
                      }, 10))));
            }),
            o(this, "global", (t = !0) => {
              var { player: e } = this;
              e.config.keyboard.global &&
                dt.call(e, window, "keydown keyup", this.handleKey, t, !1),
                dt.call(e, document.body, "click", this.toggleMenu, t),
                gt.call(e, document.body, "touchstart", this.firstTouch),
                dt.call(
                  e,
                  document.body,
                  "keydown focus blur focusout",
                  this.setTabFocus,
                  t,
                  !1,
                  !0
                );
            }),
            o(this, "container", () => {
              const { player: a } = this,
                { config: t, elements: l, timers: s } = a;
              !t.keyboard.global &&
                t.keyboard.focused &&
                pt.call(a, l.container, "keydown keyup", this.handleKey, !1),
                pt.call(
                  a,
                  l.container,
                  "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen",
                  (t) => {
                    const { controls: e } = l;
                    e &&
                      "enterfullscreen" === t.type &&
                      ((e.pressed = !1), (e.hover = !1));
                    let i = 0;
                    ["touchstart", "touchmove", "mousemove"].includes(t.type) &&
                      (Xt.toggleControls.call(a, !0),
                      (i = a.touch ? 3e3 : 2e3)),
                      clearTimeout(s.controls),
                      (s.controls = setTimeout(
                        () => Xt.toggleControls.call(a, !1),
                        i
                      ));
                  }
                );
              const i = () => {
                  if (a.isVimeo && !a.config.vimeo.premium) {
                    const i = l.wrapper,
                      { active: s } = a.fullscreen,
                      [n, o] = Tt.call(a),
                      r = wt(`aspect-ratio: ${n} / ${o}`);
                    var t, e;
                    s
                      ? (([e, t] = [
                          Math.max(
                            document.documentElement.clientWidth || 0,
                            window.innerWidth || 0
                          ),
                          Math.max(
                            document.documentElement.clientHeight || 0,
                            window.innerHeight || 0
                          ),
                        ]),
                        (e = n / o < e / t),
                        r
                          ? ((i.style.width = e ? "auto" : "100%"),
                            (i.style.height = e ? "100%" : "auto"))
                          : ((i.style.maxWidth = e ? (t / o) * n + "px" : null),
                            (i.style.margin = e ? "0 auto" : null)))
                      : r
                      ? ((i.style.width = null), (i.style.height = null))
                      : ((i.style.maxWidth = null), (i.style.margin = null));
                  }
                },
                n = () => {
                  clearTimeout(s.resized), (s.resized = setTimeout(i, 50));
                };
              pt.call(a, l.container, "enterfullscreen exitfullscreen", (t) => {
                var { target: e } = a.fullscreen;
                e === l.container &&
                  ((!a.isEmbed && W(a.config.ratio)) ||
                    (i(),
                    ("enterfullscreen" === t.type ? pt : mt).call(
                      a,
                      window,
                      "resize",
                      n
                    )));
              });
            }),
            o(this, "media", () => {
              const { player: i } = this,
                { elements: s } = i;
              if (
                (pt.call(i, i.media, "timeupdate seeking seeked", (t) =>
                  qt.timeUpdate.call(i, t)
                ),
                pt.call(
                  i,
                  i.media,
                  "durationchange loadeddata loadedmetadata",
                  (t) => qt.durationUpdate.call(i, t)
                ),
                pt.call(i, i.media, "ended", () => {
                  i.isHTML5 &&
                    i.isVideo &&
                    i.config.resetOnEnd &&
                    (i.restart(), i.pause());
                }),
                pt.call(i, i.media, "progress playing seeking seeked", (t) =>
                  qt.updateProgress.call(i, t)
                ),
                pt.call(i, i.media, "volumechange", (t) =>
                  qt.updateVolume.call(i, t)
                ),
                pt.call(
                  i,
                  i.media,
                  "playing play pause ended emptied timeupdate",
                  (t) => Xt.checkPlaying.call(i, t)
                ),
                pt.call(i, i.media, "waiting canplay seeked playing", (t) =>
                  Xt.checkLoading.call(i, t)
                ),
                i.supported.ui && i.config.clickToPlay && !i.isAudio)
              ) {
                const e = at.call(i, `.${i.config.classNames.video}`);
                if (!D(e)) return;
                pt.call(i, s.container, "click", (t) => {
                  ([s.container, e].includes(t.target) ||
                    e.contains(t.target)) &&
                    ((i.touch && i.config.hideControls) ||
                      (i.ended
                        ? (this.proxy(t, i.restart, "restart"),
                          this.proxy(
                            t,
                            () => {
                              yt(i.play());
                            },
                            "play"
                          ))
                        : this.proxy(
                            t,
                            () => {
                              yt(i.togglePlay());
                            },
                            "play"
                          )));
                });
              }
              i.supported.ui &&
                i.config.disableContextMenu &&
                pt.call(
                  i,
                  s.wrapper,
                  "contextmenu",
                  (t) => {
                    t.preventDefault();
                  },
                  !1
                ),
                pt.call(i, i.media, "volumechange", () => {
                  i.storage.set({ volume: i.volume, muted: i.muted });
                }),
                pt.call(i, i.media, "ratechange", () => {
                  qt.updateSetting.call(i, "speed"),
                    i.storage.set({ speed: i.speed });
                }),
                pt.call(i, i.media, "qualitychange", (t) => {
                  qt.updateSetting.call(i, "quality", null, t.detail.quality);
                }),
                pt.call(i, i.media, "ready qualitychange", () => {
                  qt.setDownloadUrl.call(i);
                });
              const e = i.config.events.concat(["keyup", "keydown"]).join(" ");
              pt.call(i, i.media, e, (t) => {
                let { detail: e = {} } = t;
                "error" === t.type && (e = i.media.error),
                  ft.call(i, s.container, t.type, !0, e);
              });
            }),
            o(this, "proxy", (t, e, i) => {
              const { player: s } = this,
                n = s.config.listeners[i];
              let o = !0;
              z(n) && (o = n.call(s, t)), !1 !== o && z(e) && e.call(s, t);
            }),
            o(this, "bind", (t, e, i, s, n = !0) => {
              var { player: o } = this,
                r = o.config.listeners[s],
                r = z(r);
              pt.call(o, t, e, (t) => this.proxy(t, i, s), n && !r);
            }),
            o(this, "controls", () => {
              const { player: r } = this,
                { elements: s } = r,
                e = V.isIE ? "change" : "input";
              if (
                (s.buttons.play &&
                  Array.from(s.buttons.play).forEach((t) => {
                    this.bind(
                      t,
                      "click",
                      () => {
                        yt(r.togglePlay());
                      },
                      "play"
                    );
                  }),
                this.bind(s.buttons.restart, "click", r.restart, "restart"),
                this.bind(
                  s.buttons.rewind,
                  "click",
                  () => {
                    (r.lastSeekTime = Date.now()), r.rewind();
                  },
                  "rewind"
                ),
                this.bind(
                  s.buttons.fastForward,
                  "click",
                  () => {
                    (r.lastSeekTime = Date.now()), r.forward();
                  },
                  "fastForward"
                ),
                this.bind(
                  s.buttons.mute,
                  "click",
                  () => {
                    r.muted = !r.muted;
                  },
                  "mute"
                ),
                this.bind(s.buttons.captions, "click", () =>
                  r.toggleCaptions()
                ),
                this.bind(
                  s.buttons.download,
                  "click",
                  () => {
                    ft.call(r, r.media, "download");
                  },
                  "download"
                ),
                this.bind(
                  s.buttons.fullscreen,
                  "click",
                  () => {
                    r.fullscreen.toggle();
                  },
                  "fullscreen"
                ),
                this.bind(
                  s.buttons.pip,
                  "click",
                  () => {
                    r.pip = "toggle";
                  },
                  "pip"
                ),
                this.bind(s.buttons.airplay, "click", r.airplay, "airplay"),
                this.bind(
                  s.buttons.settings,
                  "click",
                  (t) => {
                    t.stopPropagation(),
                      t.preventDefault(),
                      qt.toggleMenu.call(r, t);
                  },
                  null,
                  !1
                ),
                this.bind(
                  s.buttons.settings,
                  "keyup",
                  (t) => {
                    var e = t.which;
                    [13, 32].includes(e) &&
                      (13 !== e
                        ? (t.preventDefault(),
                          t.stopPropagation(),
                          qt.toggleMenu.call(r, t))
                        : qt.focusFirstMenuItem.call(r, null, !0));
                  },
                  null,
                  !1
                ),
                this.bind(s.settings.menu, "keydown", (t) => {
                  27 === t.which && qt.toggleMenu.call(r, t);
                }),
                this.bind(s.inputs.seek, "mousedown mousemove", (t) => {
                  var e = s.progress.getBoundingClientRect(),
                    e = (100 / e.width) * (t.pageX - e.left);
                  t.currentTarget.setAttribute("seek-value", e);
                }),
                this.bind(
                  s.inputs.seek,
                  "mousedown mouseup keydown keyup touchstart touchend",
                  (t) => {
                    const e = t.currentTarget,
                      i = t.keyCode || t.which,
                      s = "play-on-seeked";
                    var n;
                    (q(t) && 39 !== i && 37 !== i) ||
                      ((r.lastSeekTime = Date.now()),
                      (n = e.hasAttribute(s)),
                      (t = ["mouseup", "touchend", "keyup"].includes(t.type)),
                      n && t
                        ? (e.removeAttribute(s), yt(r.play()))
                        : !t &&
                          r.playing &&
                          (e.setAttribute(s, ""), r.pause()));
                  }
                ),
                V.isIos)
              ) {
                const s = rt.call(r, 'input[type="range"]');
                Array.from(s).forEach((t) =>
                  this.bind(t, e, (t) => B(t.target))
                );
              }
              this.bind(
                s.inputs.seek,
                e,
                (t) => {
                  const e = t.currentTarget;
                  let i = e.getAttribute("seek-value");
                  W(i) && (i = e.value),
                    e.removeAttribute("seek-value"),
                    (r.currentTime = (i / e.max) * r.duration);
                },
                "seek"
              ),
                this.bind(s.progress, "mouseenter mouseleave mousemove", (t) =>
                  qt.updateSeekTooltip.call(r, t)
                ),
                this.bind(s.progress, "mousemove touchmove", (t) => {
                  const { previewThumbnails: e } = r;
                  e && e.loaded && e.startMove(t);
                }),
                this.bind(s.progress, "mouseleave touchend click", () => {
                  const { previewThumbnails: t } = r;
                  t && t.loaded && t.endMove(!1, !0);
                }),
                this.bind(s.progress, "mousedown touchstart", (t) => {
                  const { previewThumbnails: e } = r;
                  e && e.loaded && e.startScrubbing(t);
                }),
                this.bind(s.progress, "mouseup touchend", (t) => {
                  const { previewThumbnails: e } = r;
                  e && e.loaded && e.endScrubbing(t);
                }),
                V.isWebkit &&
                  Array.from(rt.call(r, 'input[type="range"]')).forEach((t) => {
                    this.bind(t, "input", (t) =>
                      qt.updateRangeFill.call(r, t.target)
                    );
                  }),
                r.config.toggleInvert &&
                  !D(s.display.duration) &&
                  this.bind(s.display.currentTime, "click", () => {
                    0 !== r.currentTime &&
                      ((r.config.invertTime = !r.config.invertTime),
                      qt.timeUpdate.call(r));
                  }),
                this.bind(
                  s.inputs.volume,
                  e,
                  (t) => {
                    r.volume = t.target.value;
                  },
                  "volume"
                ),
                this.bind(s.controls, "mouseenter mouseleave", (t) => {
                  s.controls.hover = !r.touch && "mouseenter" === t.type;
                }),
                s.fullscreen &&
                  Array.from(s.fullscreen.children)
                    .filter((t) => !t.contains(s.container))
                    .forEach((t) => {
                      this.bind(t, "mouseenter mouseleave", (t) => {
                        s.controls.hover = !r.touch && "mouseenter" === t.type;
                      });
                    }),
                this.bind(
                  s.controls,
                  "mousedown mouseup touchstart touchend touchcancel",
                  (t) => {
                    s.controls.pressed = ["mousedown", "touchstart"].includes(
                      t.type
                    );
                  }
                ),
                this.bind(s.controls, "focusin", () => {
                  const { config: t, timers: e } = r;
                  st(s.controls, t.classNames.noTransition, !0),
                    Xt.toggleControls.call(r, !0),
                    setTimeout(() => {
                      st(s.controls, t.classNames.noTransition, !1);
                    }, 0);
                  var i = this.touch ? 3e3 : 4e3;
                  clearTimeout(e.controls),
                    (e.controls = setTimeout(
                      () => Xt.toggleControls.call(r, !1),
                      i
                    ));
                }),
                this.bind(
                  s.inputs.volume,
                  "wheel",
                  (t) => {
                    const e = t.webkitDirectionInvertedFromDevice,
                      [i, s] = [t.deltaX, -t.deltaY].map((t) => (e ? -t : t)),
                      n = Math.sign(Math.abs(i) > Math.abs(s) ? i : s);
                    r.increaseVolume(n / 50);
                    var { volume: o } = r.media;
                    ((1 === n && o < 1) || (-1 === n && 0 < o)) &&
                      t.preventDefault();
                  },
                  "volume",
                  !1
                );
            }),
            (this.player = t),
            (this.lastKey = null),
            (this.focusTimer = null),
            (this.lastKeyDown = null),
            (this.handleKey = this.handleKey.bind(this)),
            (this.toggleMenu = this.toggleMenu.bind(this)),
            (this.setTabFocus = this.setTabFocus.bind(this)),
            (this.firstTouch = this.firstTouch.bind(this));
        }
        handleKey(t) {
          const { player: e } = this,
            { elements: i } = e,
            s = t.keyCode || t.which,
            n = "keydown" === t.type,
            o = n && s === this.lastKey;
          if (!(t.altKey || t.ctrlKey || t.metaKey || t.shiftKey) && I(s))
            if (n) {
              const n = document.activeElement;
              if (D(n)) {
                const { editable: s } = e.config.selectors,
                  { seek: o } = i.inputs;
                if (n !== o && ot(n, s)) return;
                if (32 === t.which && ot(n, 'button, [role^="menuitem"]'))
                  return;
              }
              switch (
                ([
                  32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 56, 57, 67,
                  70, 73, 75, 76, 77, 79,
                ].includes(s) && (t.preventDefault(), t.stopPropagation()),
                s)
              ) {
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                  o || (e.currentTime = (e.duration / 10) * (s - 48));
                  break;
                case 32:
                case 75:
                  o || yt(e.togglePlay());
                  break;
                case 38:
                  e.increaseVolume(0.1);
                  break;
                case 40:
                  e.decreaseVolume(0.1);
                  break;
                case 77:
                  o || (e.muted = !e.muted);
                  break;
                case 39:
                  e.forward();
                  break;
                case 37:
                  e.rewind();
                  break;
                case 70:
                  e.fullscreen.toggle();
                  break;
                case 67:
                  o || e.toggleCaptions();
                  break;
                case 76:
                  e.loop = !e.loop;
              }
              27 === s &&
                !e.fullscreen.usingNative &&
                e.fullscreen.active &&
                e.fullscreen.toggle(),
                (this.lastKey = s);
            } else this.lastKey = null;
        }
        toggleMenu(t) {
          qt.toggleMenu.call(this.player, t);
        }
      }
      var Kt,
        Jt =
          (0,
          (function () {
            var p = function () {},
              r = {},
              l = {},
              c = {};
            function a(t, e) {
              if (t) {
                var i = c[t];
                if (((l[t] = e), i))
                  for (; i.length; ) i[0](t, e), i.splice(0, 1);
              }
            }
            function u(t, e) {
              t.call && (t = { success: t }),
                e.length ? (t.error || p)(e) : (t.success || p)(t);
            }
            function h(t, s, e) {
              for (
                var n = (t = t.push ? t : [t]).length,
                  i = n,
                  o = [],
                  r = function (t, e, i) {
                    if (("e" == e && o.push(t), "b" == e)) {
                      if (!i) return;
                      o.push(t);
                    }
                    --n || s(o);
                  },
                  a = 0;
                a < i;
                a++
              )
                !(function i(s, n, o, r) {
                  var a,
                    l,
                    t = document,
                    e = o.async,
                    c = (o.numRetries || 0) + 1,
                    u = o.before || p,
                    h = s.replace(/[\?|#].*$/, ""),
                    d = s.replace(/^(css|img)!/, "");
                  (r = r || 0),
                    /(^css!|\.css$)/.test(h)
                      ? (((l = t.createElement("link")).rel = "stylesheet"),
                        (l.href = d),
                        (a = "hideFocus" in l) &&
                          l.relList &&
                          ((a = 0), (l.rel = "preload"), (l.as = "style")))
                      : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(h)
                      ? ((l = t.createElement("img")).src = d)
                      : (((l = t.createElement("script")).src = s),
                        (l.async = void 0 === e || e)),
                    (l.onload =
                      l.onerror =
                      l.onbeforeload =
                        function (t) {
                          var e = t.type[0];
                          if (a)
                            try {
                              l.sheet.cssText.length || (e = "e");
                            } catch (t) {
                              18 != t.code && (e = "e");
                            }
                          if ("e" == e) {
                            if ((r += 1) < c) return i(s, n, o, r);
                          } else if ("preload" == l.rel && "style" == l.as)
                            return (l.rel = "stylesheet");
                          n(s, e, t.defaultPrevented);
                        }),
                    !1 !== u(s, l) && t.head.appendChild(l);
                })(t[a], r, e);
            }
            function i(t, e, i) {
              var s, n;
              if ((e && e.trim && (s = e), (n = (s ? i : e) || {}), s)) {
                if (s in r) throw "LoadJS";
                r[s] = !0;
              }
              function o(e, i) {
                h(
                  t,
                  function (t) {
                    u(n, t), e && u({ success: e, error: i }, t), a(s, t);
                  },
                  n
                );
              }
              if (n.returnPromise) return new Promise(o);
              o();
            }
            return (
              (i.ready = function (t, e) {
                return (
                  (function (t, i) {
                    t = t.push ? t : [t];
                    for (
                      var e,
                        s,
                        n = [],
                        o = t.length,
                        r = o,
                        a = function (t, e) {
                          e.length && n.push(t), --r || i(n);
                        };
                      o--;

                    )
                      (e = t[o]),
                        (s = l[e]) ? a(e, s) : (c[e] = c[e] || []).push(a);
                  })(t, function (t) {
                    u(e, t);
                  }),
                  i
                );
              }),
              (i.done = function (t) {
                a(t, []);
              }),
              (i.reset = function () {
                (r = {}), (l = {}), (c = {});
              }),
              (i.isDefined = function (t) {
                return t in r;
              }),
              i
            );
          })());
      function te(i) {
        return new Promise((t, e) => {
          Jt(i, { success: t, error: e });
        });
      }
      function ee(t) {
        t && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
          this.media.paused === t &&
            ((this.media.paused = !t),
            ft.call(this, this.media, t ? "play" : "pause"));
      }
      const ie = {
        setup() {
          const e = this;
          st(e.elements.wrapper, e.config.classNames.embed, !0),
            (e.options.speed = e.config.speed.options),
            St.call(e),
            M(window.Vimeo)
              ? ie.ready.call(e)
              : te(e.config.urls.vimeo.sdk)
                  .then(() => {
                    ie.ready.call(e);
                  })
                  .catch((t) => {
                    e.debug.warn("Vimeo SDK (player.js) failed to load", t);
                  });
        },
        ready() {
          const r = this,
            t = r.config.vimeo,
            { premium: e, referrerPolicy: i, ...s } = t;
          e && Object.assign(s, { controls: !1, sidedock: !1 });
          var n = Ht({
            loop: r.config.loop.active,
            autoplay: r.autoplay,
            muted: r.muted,
            gesture: "media",
            playsinline: !this.config.fullscreen.iosNative,
            ...s,
          });
          let o = r.media.getAttribute("src");
          W(o) && (o = r.media.getAttribute(r.config.attributes.embed.id));
          var a,
            a = W((a = o))
              ? null
              : !I(Number(a)) && a.match(/^.*(vimeo.com\/|video\/)(\d+).*/)
              ? RegExp.$2
              : a;
          const l = X("iframe"),
            c = At(r.config.urls.vimeo.iframe, a, n);
          if (
            (l.setAttribute("src", c),
            l.setAttribute("allowfullscreen", ""),
            l.setAttribute(
              "allow",
              [
                "autoplay",
                "fullscreen",
                "picture-in-picture",
                "encrypted-media",
                "accelerometer",
                "gyroscope",
              ].join("; ")
            ),
            W(i) || l.setAttribute("referrerPolicy", i),
            e || !t.customControls)
          )
            l.setAttribute("data-poster", r.poster), (r.media = tt(l, r.media));
          else {
            const t = X("div", {
              class: r.config.classNames.embedContainer,
              "data-poster": r.poster,
            });
            t.appendChild(l), (r.media = tt(t, r.media));
          }
          t.customControls ||
            jt(At(r.config.urls.vimeo.api, c)).then((t) => {
              !W(t) &&
                t.thumbnail_url &&
                Xt.setPoster.call(r, t.thumbnail_url).catch(() => {});
            }),
            (r.embed = new window.Vimeo.Player(l, {
              autopause: r.config.autopause,
              muted: r.muted,
            })),
            (r.media.paused = !0),
            (r.media.currentTime = 0),
            r.supported.ui && r.embed.disableTextTrack(),
            (r.media.play = () => (ee.call(r, !0), r.embed.play())),
            (r.media.pause = () => (ee.call(r, !1), r.embed.pause())),
            (r.media.stop = () => {
              r.pause(), (r.currentTime = 0);
            });
          let { currentTime: u } = r.media;
          Object.defineProperty(r.media, "currentTime", {
            get: () => u,
            set(t) {
              const { embed: e, media: i, paused: s, volume: n } = r,
                o = s && !e.hasPlayed;
              (i.seeking = !0),
                ft.call(r, i, "seeking"),
                Promise.resolve(o && e.setVolume(0))
                  .then(() => e.setCurrentTime(t))
                  .then(() => o && e.pause())
                  .then(() => o && e.setVolume(n))
                  .catch(() => {});
            },
          });
          let h = r.config.speed.selected;
          Object.defineProperty(r.media, "playbackRate", {
            get: () => h,
            set(t) {
              r.embed
                .setPlaybackRate(t)
                .then(() => {
                  (h = t), ft.call(r, r.media, "ratechange");
                })
                .catch(() => {
                  r.options.speed = [1];
                });
            },
          });
          let { volume: d } = r.config;
          Object.defineProperty(r.media, "volume", {
            get: () => d,
            set(t) {
              r.embed.setVolume(t).then(() => {
                (d = t), ft.call(r, r.media, "volumechange");
              });
            },
          });
          let { muted: p } = r.config;
          Object.defineProperty(r.media, "muted", {
            get: () => p,
            set(t) {
              const e = !!O(t) && t;
              r.embed.setVolume(e ? 0 : r.config.volume).then(() => {
                (p = e), ft.call(r, r.media, "volumechange");
              });
            },
          });
          let m,
            { loop: g } = r.config;
          Object.defineProperty(r.media, "loop", {
            get: () => g,
            set(t) {
              const e = O(t) ? t : r.config.loop.active;
              r.embed.setLoop(e).then(() => {
                g = e;
              });
            },
          }),
            r.embed
              .getVideoUrl()
              .then((t) => {
                (m = t), qt.setDownloadUrl.call(r);
              })
              .catch((t) => {
                this.debug.warn(t);
              }),
            Object.defineProperty(r.media, "currentSrc", { get: () => m }),
            Object.defineProperty(r.media, "ended", {
              get: () => r.currentTime === r.duration,
            }),
            Promise.all([
              r.embed.getVideoWidth(),
              r.embed.getVideoHeight(),
            ]).then((t) => {
              var [e, t] = t;
              (r.embed.ratio = Ct(e, t)), St.call(this);
            }),
            r.embed.setAutopause(r.config.autopause).then((t) => {
              r.config.autopause = t;
            }),
            r.embed.getVideoTitle().then((t) => {
              (r.config.title = t), Xt.setTitle.call(this);
            }),
            r.embed.getCurrentTime().then((t) => {
              (u = t), ft.call(r, r.media, "timeupdate");
            }),
            r.embed.getDuration().then((t) => {
              (r.media.duration = t), ft.call(r, r.media, "durationchange");
            }),
            r.embed.getTextTracks().then((t) => {
              (r.media.textTracks = t), Wt.setup.call(r);
            }),
            r.embed.on("cuechange", ({ cues: t = [] }) => {
              t = t.map((t) =>
                (function (t) {
                  const e = document.createDocumentFragment(),
                    i = document.createElement("div");
                  return (
                    e.appendChild(i), (i.innerHTML = t), e.firstChild.innerText
                  );
                })(t.text)
              );
              Wt.updateCues.call(r, t);
            }),
            r.embed.on("loaded", () => {
              r.embed.getPaused().then((t) => {
                ee.call(r, !t), t || ft.call(r, r.media, "playing");
              }),
                D(r.embed.element) &&
                  r.supported.ui &&
                  r.embed.element.setAttribute("tabindex", -1);
            }),
            r.embed.on("bufferstart", () => {
              ft.call(r, r.media, "waiting");
            }),
            r.embed.on("bufferend", () => {
              ft.call(r, r.media, "playing");
            }),
            r.embed.on("play", () => {
              ee.call(r, !0), ft.call(r, r.media, "playing");
            }),
            r.embed.on("pause", () => {
              ee.call(r, !1);
            }),
            r.embed.on("timeupdate", (t) => {
              (r.media.seeking = !1),
                (u = t.seconds),
                ft.call(r, r.media, "timeupdate");
            }),
            r.embed.on("progress", (t) => {
              (r.media.buffered = t.percent),
                ft.call(r, r.media, "progress"),
                1 === parseInt(t.percent, 10) &&
                  ft.call(r, r.media, "canplaythrough"),
                r.embed.getDuration().then((t) => {
                  t !== r.media.duration &&
                    ((r.media.duration = t),
                    ft.call(r, r.media, "durationchange"));
                });
            }),
            r.embed.on("seeked", () => {
              (r.media.seeking = !1), ft.call(r, r.media, "seeked");
            }),
            r.embed.on("ended", () => {
              (r.media.paused = !0), ft.call(r, r.media, "ended");
            }),
            r.embed.on("error", (t) => {
              (r.media.error = t), ft.call(r, r.media, "error");
            }),
            t.customControls && setTimeout(() => Xt.build.call(r), 0);
        },
      };
      function se(t) {
        t && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
          this.media.paused === t &&
            ((this.media.paused = !t),
            ft.call(this, this.media, t ? "play" : "pause"));
      }
      const ne = {
          setup() {
            if (
              (st(this.elements.wrapper, this.config.classNames.embed, !0),
              M(window.YT) && z(window.YT.Player))
            )
              ne.ready.call(this);
            else {
              const t = window.onYouTubeIframeAPIReady;
              (window.onYouTubeIframeAPIReady = () => {
                z(t) && t(), ne.ready.call(this);
              }),
                te(this.config.urls.youtube.sdk).catch((t) => {
                  this.debug.warn("YouTube API failed to load", t);
                });
            }
          },
          getTitle(t) {
            jt(At(this.config.urls.youtube.api, t))
              .then((t) => {
                var e, i;
                M(t) &&
                  (({ title: e, height: i, width: t } = t),
                  (this.config.title = e),
                  Xt.setTitle.call(this),
                  (this.embed.ratio = Ct(t, i))),
                  St.call(this);
              })
              .catch(() => {
                St.call(this);
              });
          },
          ready() {
            const o = this,
              r = o.config.youtube,
              t = o.media && o.media.getAttribute("id");
            if (W(t) || !t.startsWith("youtube-")) {
              let t = o.media.getAttribute("src");
              W(t) &&
                (t = o.media.getAttribute(this.config.attributes.embed.id));
              const a = W((e = t))
                ? null
                : e.match(
                    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
                  )
                ? RegExp.$2
                : e;
              var e = X("div", {
                id: `${o.provider}-${Math.floor(1e4 * Math.random())}`,
                "data-poster": r.customControls ? o.poster : void 0,
              });
              if (((o.media = tt(e, o.media)), r.customControls)) {
                const r = (t) => `https://i.ytimg.com/vi/${a}/${t}default.jpg`;
                Gt(r("maxres"), 121)
                  .catch(() => Gt(r("sd"), 121))
                  .catch(() => Gt(r("hq")))
                  .then((t) => Xt.setPoster.call(o, t.src))
                  .then((t) => {
                    t.includes("maxres") ||
                      (o.elements.poster.style.backgroundSize = "cover");
                  })
                  .catch(() => {});
              }
              o.embed = new window.YT.Player(o.media, {
                videoId: a,
                host: r.noCookie
                  ? "https://www.youtube-nocookie.com"
                  : "http:" === window.location.protocol
                  ? "http://www.youtube.com"
                  : void 0,
                playerVars: U(
                  {},
                  {
                    autoplay: o.config.autoplay ? 1 : 0,
                    hl: o.config.hl,
                    controls: o.supported.ui && r.customControls ? 0 : 1,
                    disablekb: 1,
                    playsinline: o.config.fullscreen.iosNative ? 0 : 1,
                    cc_load_policy: o.captions.active ? 1 : 0,
                    cc_lang_pref: o.config.captions.language,
                    widget_referrer: window ? window.location.href : null,
                  },
                  r
                ),
                events: {
                  onError(t) {
                    var e;
                    o.media.error ||
                      ((t =
                        {
                          2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
                          5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
                          100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
                          101: "The owner of the requested video does not allow it to be played in embedded players.",
                          150: "The owner of the requested video does not allow it to be played in embedded players.",
                        }[(e = t.data)] || "An unknown error occured"),
                      (o.media.error = { code: e, message: t }),
                      ft.call(o, o.media, "error"));
                  },
                  onPlaybackRateChange(t) {
                    const e = t.target;
                    (o.media.playbackRate = e.getPlaybackRate()),
                      ft.call(o, o.media, "ratechange");
                  },
                  onReady(t) {
                    if (!z(o.media.play)) {
                      const s = t.target;
                      ne.getTitle.call(o, a),
                        (o.media.play = () => {
                          se.call(o, !0), s.playVideo();
                        }),
                        (o.media.pause = () => {
                          se.call(o, !1), s.pauseVideo();
                        }),
                        (o.media.stop = () => {
                          s.stopVideo();
                        }),
                        (o.media.duration = s.getDuration()),
                        (o.media.paused = !0),
                        (o.media.currentTime = 0),
                        Object.defineProperty(o.media, "currentTime", {
                          get: () => Number(s.getCurrentTime()),
                          set(t) {
                            o.paused && !o.embed.hasPlayed && o.embed.mute(),
                              (o.media.seeking = !0),
                              ft.call(o, o.media, "seeking"),
                              s.seekTo(t);
                          },
                        }),
                        Object.defineProperty(o.media, "playbackRate", {
                          get: () => s.getPlaybackRate(),
                          set(t) {
                            s.setPlaybackRate(t);
                          },
                        });
                      let { volume: e } = o.config;
                      Object.defineProperty(o.media, "volume", {
                        get: () => e,
                        set(t) {
                          (e = t),
                            s.setVolume(100 * e),
                            ft.call(o, o.media, "volumechange");
                        },
                      });
                      let { muted: i } = o.config;
                      Object.defineProperty(o.media, "muted", {
                        get: () => i,
                        set(t) {
                          t = O(t) ? t : i;
                          (i = t),
                            s[t ? "mute" : "unMute"](),
                            s.setVolume(100 * e),
                            ft.call(o, o.media, "volumechange");
                        },
                      }),
                        Object.defineProperty(o.media, "currentSrc", {
                          get: () => s.getVideoUrl(),
                        }),
                        Object.defineProperty(o.media, "ended", {
                          get: () => o.currentTime === o.duration,
                        });
                      const n = s.getAvailablePlaybackRates();
                      (o.options.speed = n.filter((t) =>
                        o.config.speed.options.includes(t)
                      )),
                        o.supported.ui &&
                          r.customControls &&
                          o.media.setAttribute("tabindex", -1),
                        ft.call(o, o.media, "timeupdate"),
                        ft.call(o, o.media, "durationchange"),
                        clearInterval(o.timers.buffering),
                        (o.timers.buffering = setInterval(() => {
                          (o.media.buffered = s.getVideoLoadedFraction()),
                            (null === o.media.lastBuffered ||
                              o.media.lastBuffered < o.media.buffered) &&
                              ft.call(o, o.media, "progress"),
                            (o.media.lastBuffered = o.media.buffered),
                            1 === o.media.buffered &&
                              (clearInterval(o.timers.buffering),
                              ft.call(o, o.media, "canplaythrough"));
                        }, 200)),
                        r.customControls &&
                          setTimeout(() => Xt.build.call(o), 50);
                    }
                  },
                  onStateChange(t) {
                    const e = t.target;
                    switch (
                      (clearInterval(o.timers.playing),
                      o.media.seeking &&
                        [1, 2].includes(t.data) &&
                        ((o.media.seeking = !1), ft.call(o, o.media, "seeked")),
                      t.data)
                    ) {
                      case -1:
                        ft.call(o, o.media, "timeupdate"),
                          (o.media.buffered = e.getVideoLoadedFraction()),
                          ft.call(o, o.media, "progress");
                        break;
                      case 0:
                        se.call(o, !1),
                          o.media.loop
                            ? (e.stopVideo(), e.playVideo())
                            : ft.call(o, o.media, "ended");
                        break;
                      case 1:
                        r.customControls &&
                        !o.config.autoplay &&
                        o.media.paused &&
                        !o.embed.hasPlayed
                          ? o.media.pause()
                          : (se.call(o, !0),
                            ft.call(o, o.media, "playing"),
                            (o.timers.playing = setInterval(() => {
                              ft.call(o, o.media, "timeupdate");
                            }, 50)),
                            o.media.duration !== e.getDuration() &&
                              ((o.media.duration = e.getDuration()),
                              ft.call(o, o.media, "durationchange")));
                        break;
                      case 2:
                        o.muted || o.embed.unMute(), se.call(o, !1);
                        break;
                      case 3:
                        ft.call(o, o.media, "waiting");
                    }
                    ft.call(o, o.elements.container, "statechange", !1, {
                      code: t.data,
                    });
                  },
                },
              });
            }
          },
        },
        oe = {
          setup() {
            this.media
              ? (st(
                  this.elements.container,
                  this.config.classNames.type.replace("{0}", this.type),
                  !0
                ),
                st(
                  this.elements.container,
                  this.config.classNames.provider.replace("{0}", this.provider),
                  !0
                ),
                this.isEmbed &&
                  st(
                    this.elements.container,
                    this.config.classNames.type.replace("{0}", "video"),
                    !0
                  ),
                this.isVideo &&
                  ((this.elements.wrapper = X("div", {
                    class: this.config.classNames.video,
                  })),
                  Q(this.media, this.elements.wrapper),
                  (this.elements.poster = X("div", {
                    class: this.config.classNames.poster,
                  })),
                  this.elements.wrapper.appendChild(this.elements.poster)),
                this.isHTML5
                  ? kt.setup.call(this)
                  : this.isYouTube
                  ? ne.setup.call(this)
                  : this.isVimeo && ie.setup.call(this))
              : this.debug.warn("No media element found!");
          },
        };
      class re {
        constructor(t) {
          o(this, "load", () => {
            this.enabled &&
              (M(window.google) && M(window.google.ima)
                ? this.ready()
                : te(this.player.config.urls.googleIMA.sdk)
                    .then(() => {
                      this.ready();
                    })
                    .catch(() => {
                      this.trigger(
                        "error",
                        new Error("Google IMA SDK failed to load")
                      );
                    }));
          }),
            o(this, "ready", () => {
              this.enabled ||
                (this.manager && this.manager.destroy(),
                this.elements.displayContainer &&
                  this.elements.displayContainer.destroy(),
                this.elements.container.remove()),
                this.startSafetyTimer(12e3, "ready()"),
                this.managerPromise.then(() => {
                  this.clearSafetyTimer("onAdsManagerLoaded()");
                }),
                this.listeners(),
                this.setupIMA();
            }),
            o(this, "setupIMA", () => {
              (this.elements.container = X("div", {
                class: this.player.config.classNames.ads,
              })),
                this.player.elements.container.appendChild(
                  this.elements.container
                ),
                google.ima.settings.setVpaidMode(
                  google.ima.ImaSdkSettings.VpaidMode.ENABLED
                ),
                google.ima.settings.setLocale(this.player.config.ads.language),
                google.ima.settings.setDisableCustomPlaybackForIOS10Plus(
                  this.player.config.playsinline
                ),
                (this.elements.displayContainer =
                  new google.ima.AdDisplayContainer(
                    this.elements.container,
                    this.player.media
                  )),
                (this.loader = new google.ima.AdsLoader(
                  this.elements.displayContainer
                )),
                this.loader.addEventListener(
                  google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                  (t) => this.onAdsManagerLoaded(t),
                  !1
                ),
                this.loader.addEventListener(
                  google.ima.AdErrorEvent.Type.AD_ERROR,
                  (t) => this.onAdError(t),
                  !1
                ),
                this.requestAds();
            }),
            o(this, "requestAds", () => {
              var { container: t } = this.player.elements;
              try {
                const e = new google.ima.AdsRequest();
                (e.adTagUrl = this.tagUrl),
                  (e.linearAdSlotWidth = t.offsetWidth),
                  (e.linearAdSlotHeight = t.offsetHeight),
                  (e.nonLinearAdSlotWidth = t.offsetWidth),
                  (e.nonLinearAdSlotHeight = t.offsetHeight),
                  (e.forceNonLinearFullSlot = !1),
                  e.setAdWillPlayMuted(!this.player.muted),
                  this.loader.requestAds(e);
              } catch (t) {
                this.onAdError(t);
              }
            }),
            o(this, "pollCountdown", (t = !1) =>
              t
                ? void (this.countdownTimer = setInterval(() => {
                    var t = Ft(Math.max(this.manager.getRemainingTime(), 0)),
                      t = `${Ot.get(
                        "advertisement",
                        this.player.config
                      )} - ${t}`;
                    this.elements.container.setAttribute("data-badge-text", t);
                  }, 100))
                : (clearInterval(this.countdownTimer),
                  void this.elements.container.removeAttribute(
                    "data-badge-text"
                  ))
            ),
            o(this, "onAdsManagerLoaded", (t) => {
              if (this.enabled) {
                const e = new google.ima.AdsRenderingSettings();
                (e.restoreCustomPlaybackStateOnAdBreakComplete = !0),
                  (e.enablePreloading = !0),
                  (this.manager = t.getAdsManager(this.player, e)),
                  (this.cuePoints = this.manager.getCuePoints()),
                  this.manager.addEventListener(
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    (t) => this.onAdError(t)
                  ),
                  Object.keys(google.ima.AdEvent.Type).forEach((t) => {
                    this.manager.addEventListener(
                      google.ima.AdEvent.Type[t],
                      (t) => this.onAdEvent(t)
                    );
                  }),
                  this.trigger("loaded");
              }
            }),
            o(this, "addCuePoints", () => {
              W(this.cuePoints) ||
                this.cuePoints.forEach((t) => {
                  if (0 !== t && -1 !== t && t < this.player.duration) {
                    const e = this.player.elements.progress;
                    if (D(e)) {
                      const i = (100 / this.player.duration) * t,
                        s = X("span", {
                          class: this.player.config.classNames.cues,
                        });
                      (s.style.left = `${i.toString()}%`), e.appendChild(s);
                    }
                  }
                });
            }),
            o(this, "onAdEvent", (t) => {
              const { container: e } = this.player.elements,
                i = t.getAd(),
                s = t.getAdData();
              switch (
                ((n = t.type),
                ft.call(
                  this.player,
                  this.player.media,
                  `ads${n.replace(/_/g, "").toLowerCase()}`
                ),
                t.type)
              ) {
                case google.ima.AdEvent.Type.LOADED:
                  this.trigger("loaded"),
                    this.pollCountdown(!0),
                    i.isLinear() ||
                      ((i.width = e.offsetWidth), (i.height = e.offsetHeight));
                  break;
                case google.ima.AdEvent.Type.STARTED:
                  this.manager.setVolume(this.player.volume);
                  break;
                case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                  this.player.ended
                    ? this.loadAds()
                    : this.loader.contentComplete();
                  break;
                case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                  this.pauseContent();
                  break;
                case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                  this.pollCountdown(), this.resumeContent();
                  break;
                case google.ima.AdEvent.Type.LOG:
                  s.adError &&
                    this.player.debug.warn(
                      `Non-fatal ad error: ${s.adError.getMessage()}`
                    );
              }
              var n;
            }),
            o(this, "onAdError", (t) => {
              this.cancel(), this.player.debug.warn("Ads error", t);
            }),
            o(this, "listeners", () => {
              const { container: t } = this.player.elements;
              let s;
              this.player.on("canplay", () => {
                this.addCuePoints();
              }),
                this.player.on("ended", () => {
                  this.loader.contentComplete();
                }),
                this.player.on("timeupdate", () => {
                  s = this.player.currentTime;
                }),
                this.player.on("seeked", () => {
                  const i = this.player.currentTime;
                  W(this.cuePoints) ||
                    this.cuePoints.forEach((t, e) => {
                      s < t &&
                        t < i &&
                        (this.manager.discardAdBreak(),
                        this.cuePoints.splice(e, 1));
                    });
                }),
                window.addEventListener("resize", () => {
                  this.manager &&
                    this.manager.resize(
                      t.offsetWidth,
                      t.offsetHeight,
                      google.ima.ViewMode.NORMAL
                    );
                });
            }),
            o(this, "play", () => {
              const { container: t } = this.player.elements;
              this.managerPromise || this.resumeContent(),
                this.managerPromise
                  .then(() => {
                    this.manager.setVolume(this.player.volume),
                      this.elements.displayContainer.initialize();
                    try {
                      this.initialized ||
                        (this.manager.init(
                          t.offsetWidth,
                          t.offsetHeight,
                          google.ima.ViewMode.NORMAL
                        ),
                        this.manager.start()),
                        (this.initialized = !0);
                    } catch (t) {
                      this.onAdError(t);
                    }
                  })
                  .catch(() => {});
            }),
            o(this, "resumeContent", () => {
              (this.elements.container.style.zIndex = ""),
                (this.playing = !1),
                yt(this.player.media.play());
            }),
            o(this, "pauseContent", () => {
              (this.elements.container.style.zIndex = 3),
                (this.playing = !0),
                this.player.media.pause();
            }),
            o(this, "cancel", () => {
              this.initialized && this.resumeContent(),
                this.trigger("error"),
                this.loadAds();
            }),
            o(this, "loadAds", () => {
              this.managerPromise
                .then(() => {
                  this.manager && this.manager.destroy(),
                    (this.managerPromise = new Promise((t) => {
                      this.on("loaded", t), this.player.debug.log(this.manager);
                    })),
                    (this.initialized = !1),
                    this.requestAds();
                })
                .catch(() => {});
            }),
            o(this, "trigger", (t, ...e) => {
              const i = this.events[t];
              j(i) &&
                i.forEach((t) => {
                  z(t) && t.apply(this, e);
                });
            }),
            o(
              this,
              "on",
              (t, e) => (
                j(this.events[t]) || (this.events[t] = []),
                this.events[t].push(e),
                this
              )
            ),
            o(this, "startSafetyTimer", (t, e) => {
              this.player.debug.log(`Safety timer invoked from: ${e}`),
                (this.safetyTimer = setTimeout(() => {
                  this.cancel(), this.clearSafetyTimer("startSafetyTimer()");
                }, t));
            }),
            o(this, "clearSafetyTimer", (t) => {
              E(this.safetyTimer) ||
                (this.player.debug.log(`Safety timer cleared from: ${t}`),
                clearTimeout(this.safetyTimer),
                (this.safetyTimer = null));
            }),
            (this.player = t),
            (this.config = t.config.ads),
            (this.playing = !1),
            (this.initialized = !1),
            (this.elements = { container: null, displayContainer: null }),
            (this.manager = null),
            (this.loader = null),
            (this.cuePoints = null),
            (this.events = {}),
            (this.safetyTimer = null),
            (this.countdownTimer = null),
            (this.managerPromise = new Promise((t, e) => {
              this.on("loaded", t), this.on("error", e);
            })),
            this.load();
        }
        get enabled() {
          var { config: t } = this;
          return (
            this.player.isHTML5 &&
            this.player.isVideo &&
            t.enabled &&
            (!W(t.publisherId) || H(t.tagUrl))
          );
        }
        get tagUrl() {
          var { config: t } = this;
          return H(t.tagUrl)
            ? t.tagUrl
            : `https://go.aniview.com/api/adserver6/vast/?${Ht({
                AV_PUBLISHERID: "58c25bb0073ef448b1087ad6",
                AV_CHANNELID: "5a0458dc28a06145e4519d21",
                AV_URL: window.location.hostname,
                cb: Date.now(),
                AV_WIDTH: 640,
                AV_HEIGHT: 480,
                AV_CDIM2: t.publisherId,
              })}`;
        }
      }
      const ae = (t, e) => {
        const i = {};
        return (
          t > e.width / e.height
            ? ((i.width = e.width), (i.height = (1 / t) * e.width))
            : ((i.height = e.height), (i.width = t * e.height)),
          i
        );
      };
      class le {
        constructor(t) {
          o(this, "load", () => {
            this.player.elements.display.seekTooltip &&
              (this.player.elements.display.seekTooltip.hidden = this.enabled),
              this.enabled &&
                this.getThumbnails().then(() => {
                  this.enabled &&
                    (this.render(),
                    this.determineContainerAutoSizing(),
                    (this.loaded = !0));
                });
          }),
            o(
              this,
              "getThumbnails",
              () =>
                new Promise((t) => {
                  const { src: e } = this.player.config.previewThumbnails;
                  if (W(e))
                    throw new Error(
                      "Missing previewThumbnails.src config attribute"
                    );
                  const i = () => {
                    this.thumbnails.sort((t, e) => t.height - e.height),
                      this.player.debug.log(
                        "Preview thumbnails",
                        this.thumbnails
                      ),
                      t();
                  };
                  if (z(e))
                    e((t) => {
                      (this.thumbnails = t), i();
                    });
                  else {
                    const t = (P(e) ? [e] : e).map((t) => this.getThumbnail(t));
                    Promise.all(t).then(i);
                  }
                })
            ),
            o(
              this,
              "getThumbnail",
              (n) =>
                new Promise((s) => {
                  jt(n).then((t) => {
                    const e = {
                      frames: ((t) => {
                        const e = [];
                        return (
                          t.split(/\r\n\r\n|\n\n|\r\r/).forEach((t) => {
                            const i = {};
                            t.split(/\r\n|\n|\r/).forEach((t) => {
                              if (I(i.startTime)) {
                                if (!W(t.trim()) && W(i.text)) {
                                  const e = t.trim().split("#xywh=");
                                  ([i.text] = e),
                                    e[1] &&
                                      ([i.x, i.y, i.w, i.h] = e[1].split(","));
                                }
                              } else {
                                t = t.match(
                                  /([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/
                                );
                                t &&
                                  ((i.startTime =
                                    60 * Number(t[1] || 0) * 60 +
                                    60 * Number(t[2]) +
                                    Number(t[3]) +
                                    Number(`0.${t[4]}`)),
                                  (i.endTime =
                                    60 * Number(t[6] || 0) * 60 +
                                    60 * Number(t[7]) +
                                    Number(t[8]) +
                                    Number(`0.${t[9]}`)));
                              }
                            }),
                              i.text && e.push(i);
                          }),
                          e
                        );
                      })(t),
                      height: null,
                      urlPrefix: "",
                    };
                    e.frames[0].text.startsWith("/") ||
                      e.frames[0].text.startsWith("http://") ||
                      e.frames[0].text.startsWith("https://") ||
                      (e.urlPrefix = n.substring(0, n.lastIndexOf("/") + 1));
                    const i = new Image();
                    (i.onload = () => {
                      (e.height = i.naturalHeight),
                        (e.width = i.naturalWidth),
                        this.thumbnails.push(e),
                        s();
                    }),
                      (i.src = e.urlPrefix + e.frames[0].text);
                  });
                })
            ),
            o(this, "startMove", (t) => {
              var e;
              this.loaded &&
                F(t) &&
                ["touchmove", "mousemove"].includes(t.type) &&
                this.player.media.duration &&
                ("touchmove" === t.type
                  ? (this.seekTime =
                      this.player.media.duration *
                      (this.player.elements.inputs.seek.value / 100))
                  : ((e =
                      (100 /
                        (e =
                          this.player.elements.progress.getBoundingClientRect())
                          .width) *
                      (t.pageX - e.left)),
                    (this.seekTime = this.player.media.duration * (e / 100)),
                    this.seekTime < 0 && (this.seekTime = 0),
                    this.seekTime > this.player.media.duration - 1 &&
                      (this.seekTime = this.player.media.duration - 1),
                    (this.mousePosX = t.pageX),
                    (this.elements.thumb.time.innerText = Ft(this.seekTime))),
                this.showImageAtCurrentTime());
            }),
            o(this, "endMove", () => {
              this.toggleThumbContainer(!1, !0);
            }),
            o(this, "startScrubbing", (t) => {
              (!E(t.button) && !1 !== t.button && 0 !== t.button) ||
                ((this.mouseDown = !0),
                this.player.media.duration &&
                  (this.toggleScrubbingContainer(!0),
                  this.toggleThumbContainer(!1, !0),
                  this.showImageAtCurrentTime()));
            }),
            o(this, "endScrubbing", () => {
              (this.mouseDown = !1),
                Math.ceil(this.lastTime) ===
                Math.ceil(this.player.media.currentTime)
                  ? this.toggleScrubbingContainer(!1)
                  : gt.call(
                      this.player,
                      this.player.media,
                      "timeupdate",
                      () => {
                        this.mouseDown || this.toggleScrubbingContainer(!1);
                      }
                    );
            }),
            o(this, "listeners", () => {
              this.player.on("play", () => {
                this.toggleThumbContainer(!1, !0);
              }),
                this.player.on("seeked", () => {
                  this.toggleThumbContainer(!1);
                }),
                this.player.on("timeupdate", () => {
                  this.lastTime = this.player.media.currentTime;
                });
            }),
            o(this, "render", () => {
              (this.elements.thumb.container = X("div", {
                class:
                  this.player.config.classNames.previewThumbnails
                    .thumbContainer,
              })),
                (this.elements.thumb.imageContainer = X("div", {
                  class:
                    this.player.config.classNames.previewThumbnails
                      .imageContainer,
                })),
                this.elements.thumb.container.appendChild(
                  this.elements.thumb.imageContainer
                );
              const t = X("div", {
                class:
                  this.player.config.classNames.previewThumbnails.timeContainer,
              });
              (this.elements.thumb.time = X("span", {}, "00:00")),
                t.appendChild(this.elements.thumb.time),
                this.elements.thumb.container.appendChild(t),
                D(this.player.elements.progress) &&
                  this.player.elements.progress.appendChild(
                    this.elements.thumb.container
                  ),
                (this.elements.scrubbing.container = X("div", {
                  class:
                    this.player.config.classNames.previewThumbnails
                      .scrubbingContainer,
                })),
                this.player.elements.wrapper.appendChild(
                  this.elements.scrubbing.container
                );
            }),
            o(this, "destroy", () => {
              this.elements.thumb.container &&
                this.elements.thumb.container.remove(),
                this.elements.scrubbing.container &&
                  this.elements.scrubbing.container.remove();
            }),
            o(this, "showImageAtCurrentTime", () => {
              this.mouseDown
                ? this.setScrubbingContainerSize()
                : this.setThumbContainerSizeAndPos();
              const i = this.thumbnails[0].frames.findIndex(
                  (t) =>
                    this.seekTime >= t.startTime && this.seekTime <= t.endTime
                ),
                t = 0 <= i;
              let s = 0;
              this.mouseDown || this.toggleThumbContainer(t),
                t &&
                  (this.thumbnails.forEach((t, e) => {
                    this.loadedImages.includes(t.frames[i].text) && (s = e);
                  }),
                  i !== this.showingThumb &&
                    ((this.showingThumb = i), this.loadImage(s)));
            }),
            o(this, "loadImage", (t = 0) => {
              const e = this.showingThumb,
                i = this.thumbnails[t],
                { urlPrefix: s } = i,
                n = i.frames[e],
                o = i.frames[e].text,
                r = s + o;
              if (
                this.currentImageElement &&
                this.currentImageElement.dataset.filename === o
              )
                this.showImage(this.currentImageElement, n, t, e, o, !1),
                  (this.currentImageElement.dataset.index = e),
                  this.removeOldImages(this.currentImageElement);
              else {
                this.loadingImage &&
                  this.usingSprites &&
                  (this.loadingImage.onload = null);
                const i = new Image();
                (i.src = r),
                  (i.dataset.index = e),
                  (i.dataset.filename = o),
                  (this.showingThumbFilename = o),
                  this.player.debug.log(`Loading image: ${r}`),
                  (i.onload = () => this.showImage(i, n, t, e, o, !0)),
                  (this.loadingImage = i),
                  this.removeOldImages(i);
              }
            }),
            o(this, "showImage", (t, e, i, s, n, o = !0) => {
              this.player.debug.log(
                `Showing thumb: ${n}. num: ${s}. qual: ${i}. newimg: ${o}`
              ),
                this.setImageSizeAndOffset(t, e),
                o &&
                  (this.currentImageContainer.appendChild(t),
                  (this.currentImageElement = t),
                  this.loadedImages.includes(n) || this.loadedImages.push(n)),
                this.preloadNearby(s, !0)
                  .then(this.preloadNearby(s, !1))
                  .then(this.getHigherQuality(i, t, e, n));
            }),
            o(this, "removeOldImages", (i) => {
              Array.from(this.currentImageContainer.children).forEach((t) => {
                if ("img" === t.tagName.toLowerCase()) {
                  var e = this.usingSprites ? 500 : 1e3;
                  if (
                    t.dataset.index !== i.dataset.index &&
                    !t.dataset.deleting
                  ) {
                    t.dataset.deleting = !0;
                    const { currentImageContainer: i } = this;
                    setTimeout(() => {
                      i.removeChild(t),
                        this.player.debug.log(
                          `Removing thumb: ${t.dataset.filename}`
                        );
                    }, e);
                  }
                }
              });
            }),
            o(
              this,
              "preloadNearby",
              (e, i = !0) =>
                new Promise((o) => {
                  setTimeout(() => {
                    const n = this.thumbnails[0].frames[e].text;
                    if (this.showingThumbFilename === n) {
                      let t;
                      t = i
                        ? this.thumbnails[0].frames.slice(e)
                        : this.thumbnails[0].frames.slice(0, e).reverse();
                      let s = !1;
                      t.forEach((t) => {
                        const e = t.text;
                        if (e !== n && !this.loadedImages.includes(e)) {
                          (s = !0),
                            this.player.debug.log(
                              `Preloading thumb filename: ${e}`
                            );
                          const { urlPrefix: t } = this.thumbnails[0],
                            n = t + e,
                            i = new Image();
                          (i.src = n),
                            (i.onload = () => {
                              this.player.debug.log(
                                `Preloaded thumb filename: ${e}`
                              ),
                                this.loadedImages.includes(e) ||
                                  this.loadedImages.push(e),
                                o();
                            });
                        }
                      }),
                        s || o();
                    }
                  }, 300);
                })
            ),
            o(this, "getHigherQuality", (e, i, s, n) => {
              if (e < this.thumbnails.length - 1) {
                let t = i.naturalHeight;
                this.usingSprites && (t = s.h),
                  t < this.thumbContainerHeight &&
                    setTimeout(() => {
                      this.showingThumbFilename === n &&
                        (this.player.debug.log(
                          `Showing higher quality thumb for: ${n}`
                        ),
                        this.loadImage(e + 1));
                    }, 300);
              }
            }),
            o(this, "toggleThumbContainer", (t = !1, e = !1) => {
              var i =
                this.player.config.classNames.previewThumbnails
                  .thumbContainerShown;
              this.elements.thumb.container.classList.toggle(i, t),
                !t &&
                  e &&
                  ((this.showingThumb = null),
                  (this.showingThumbFilename = null));
            }),
            o(this, "toggleScrubbingContainer", (t = !1) => {
              var e =
                this.player.config.classNames.previewThumbnails
                  .scrubbingContainerShown;
              this.elements.scrubbing.container.classList.toggle(e, t),
                t ||
                  ((this.showingThumb = null),
                  (this.showingThumbFilename = null));
            }),
            o(this, "determineContainerAutoSizing", () => {
              (20 < this.elements.thumb.imageContainer.clientHeight ||
                20 < this.elements.thumb.imageContainer.clientWidth) &&
                (this.sizeSpecifiedInCSS = !0);
            }),
            o(this, "setThumbContainerSizeAndPos", () => {
              var t, e;
              this.sizeSpecifiedInCSS
                ? 20 < this.elements.thumb.imageContainer.clientHeight &&
                  this.elements.thumb.imageContainer.clientWidth < 20
                  ? ((t = Math.floor(
                      this.elements.thumb.imageContainer.clientHeight *
                        this.thumbAspectRatio
                    )),
                    (this.elements.thumb.imageContainer.style.width = `${t}px`))
                  : this.elements.thumb.imageContainer.clientHeight < 20 &&
                    20 < this.elements.thumb.imageContainer.clientWidth &&
                    ((e = Math.floor(
                      this.elements.thumb.imageContainer.clientWidth /
                        this.thumbAspectRatio
                    )),
                    (this.elements.thumb.imageContainer.style.height = `${e}px`))
                : ((e = Math.floor(
                    this.thumbContainerHeight * this.thumbAspectRatio
                  )),
                  (this.elements.thumb.imageContainer.style.height = `${this.thumbContainerHeight}px`),
                  (this.elements.thumb.imageContainer.style.width = `${e}px`)),
                this.setThumbContainerPos();
            }),
            o(this, "setThumbContainerPos", () => {
              const t = this.player.elements.progress.getBoundingClientRect(),
                e = this.player.elements.container.getBoundingClientRect(),
                { container: i } = this.elements.thumb,
                s = e.left - t.left + 10,
                n = e.right - t.left - i.clientWidth - 10;
              let o = this.mousePosX - t.left - i.clientWidth / 2;
              o < s && (o = s), o > n && (o = n), (i.style.left = `${o}px`);
            }),
            o(this, "setScrubbingContainerSize", () => {
              var { width: t, height: e } = ae(this.thumbAspectRatio, {
                width: this.player.media.clientWidth,
                height: this.player.media.clientHeight,
              });
              (this.elements.scrubbing.container.style.width = `${t}px`),
                (this.elements.scrubbing.container.style.height = `${e}px`);
            }),
            o(this, "setImageSizeAndOffset", (t, e) => {
              var i;
              this.usingSprites &&
                ((i = this.thumbContainerHeight / e.h),
                (t.style.height = t.naturalHeight * i + "px"),
                (t.style.width = t.naturalWidth * i + "px"),
                (t.style.left = `-${e.x * i}px`),
                (t.style.top = `-${e.y * i}px`));
            }),
            (this.player = t),
            (this.thumbnails = []),
            (this.loaded = !1),
            (this.lastMouseMoveTime = Date.now()),
            (this.mouseDown = !1),
            (this.loadedImages = []),
            (this.elements = { thumb: {}, scrubbing: {} }),
            this.load();
        }
        get enabled() {
          return (
            this.player.isHTML5 &&
            this.player.isVideo &&
            this.player.config.previewThumbnails.enabled
          );
        }
        get currentImageContainer() {
          return this.mouseDown
            ? this.elements.scrubbing.container
            : this.elements.thumb.imageContainer;
        }
        get usingSprites() {
          return Object.keys(this.thumbnails[0].frames[0]).includes("w");
        }
        get thumbAspectRatio() {
          return this.usingSprites
            ? this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h
            : this.thumbnails[0].width / this.thumbnails[0].height;
        }
        get thumbContainerHeight() {
          if (this.mouseDown) {
            var { height: t } = ae(this.thumbAspectRatio, {
              width: this.player.media.clientWidth,
              height: this.player.media.clientHeight,
            });
            return t;
          }
          return this.sizeSpecifiedInCSS
            ? this.elements.thumb.imageContainer.clientHeight
            : Math.floor(
                this.player.media.clientWidth / this.thumbAspectRatio / 4
              );
        }
        get currentImageElement() {
          return this.mouseDown
            ? this.currentScrubbingImageElement
            : this.currentThumbnailImageElement;
        }
        set currentImageElement(t) {
          this.mouseDown
            ? (this.currentScrubbingImageElement = t)
            : (this.currentThumbnailImageElement = t);
        }
      }
      const ce = {
        insertElements(e, t) {
          P(t)
            ? Z(e, this.media, { src: t })
            : j(t) &&
              t.forEach((t) => {
                Z(e, this.media, t);
              });
        },
        change(o) {
          Y(o, "sources.length")
            ? (kt.cancelRequests.call(this),
              this.destroy.call(
                this,
                () => {
                  (this.options.quality = []),
                    K(this.media),
                    (this.media = null),
                    D(this.elements.container) &&
                      this.elements.container.removeAttribute("class");
                  var { sources: t, type: e } = o,
                    [{ provider: i = Vt.html5, src: s }] = t,
                    n = "html5" === i ? e : "div",
                    s = "html5" === i ? {} : { src: s };
                  Object.assign(this, {
                    provider: i,
                    type: e,
                    supported: ut.check(e, i, this.config.playsinline),
                    media: X(n, s),
                  }),
                    this.elements.container.appendChild(this.media),
                    O(o.autoplay) && (this.config.autoplay = o.autoplay),
                    this.isHTML5 &&
                      (this.config.crossorigin &&
                        this.media.setAttribute("crossorigin", ""),
                      this.config.autoplay &&
                        this.media.setAttribute("autoplay", ""),
                      W(o.poster) || (this.poster = o.poster),
                      this.config.loop.active &&
                        this.media.setAttribute("loop", ""),
                      this.config.muted && this.media.setAttribute("muted", ""),
                      this.config.playsinline &&
                        this.media.setAttribute("playsinline", "")),
                    Xt.addStyleHook.call(this),
                    this.isHTML5 && ce.insertElements.call(this, "source", t),
                    (this.config.title = o.title),
                    oe.setup.call(this),
                    this.isHTML5 &&
                      Object.keys(o).includes("tracks") &&
                      ce.insertElements.call(this, "track", o.tracks),
                    (this.isHTML5 || (this.isEmbed && !this.supported.ui)) &&
                      Xt.build.call(this),
                    this.isHTML5 && this.media.load(),
                    W(o.previewThumbnails) ||
                      (Object.assign(
                        this.config.previewThumbnails,
                        o.previewThumbnails
                      ),
                      this.previewThumbnails &&
                        this.previewThumbnails.loaded &&
                        (this.previewThumbnails.destroy(),
                        (this.previewThumbnails = null)),
                      this.config.previewThumbnails.enabled &&
                        (this.previewThumbnails = new le(this))),
                    this.fullscreen.update();
                },
                !0
              ))
            : this.debug.warn("Invalid source format");
        },
      };
      class ue {
        constructor(t, e) {
          if (
            (o(this, "play", () =>
              z(this.media.play)
                ? (this.ads &&
                    this.ads.enabled &&
                    this.ads.managerPromise
                      .then(() => this.ads.play())
                      .catch(() => yt(this.media.play())),
                  this.media.play())
                : null
            ),
            o(this, "pause", () =>
              this.playing && z(this.media.pause) ? this.media.pause() : null
            ),
            o(this, "togglePlay", (t) =>
              (O(t) ? t : !this.playing) ? this.play() : this.pause()
            ),
            o(this, "stop", () => {
              this.isHTML5
                ? (this.pause(), this.restart())
                : z(this.media.stop) && this.media.stop();
            }),
            o(this, "restart", () => {
              this.currentTime = 0;
            }),
            o(this, "rewind", (t) => {
              this.currentTime -= I(t) ? t : this.config.seekTime;
            }),
            o(this, "forward", (t) => {
              this.currentTime += I(t) ? t : this.config.seekTime;
            }),
            o(this, "increaseVolume", (t) => {
              var e = this.media.muted ? 0 : this.volume;
              this.volume = e + (I(t) ? t : 0);
            }),
            o(this, "decreaseVolume", (t) => {
              this.increaseVolume(-t);
            }),
            o(this, "airplay", () => {
              ut.airplay && this.media.webkitShowPlaybackTargetPicker();
            }),
            o(this, "toggleControls", (t) => {
              if (!this.supported.ui || this.isAudio) return !1;
              var e = nt(
                  this.elements.container,
                  this.config.classNames.hideControls
                ),
                t = st(
                  this.elements.container,
                  this.config.classNames.hideControls,
                  void 0 === t ? void 0 : !t
                );
              if (
                (t &&
                  j(this.config.controls) &&
                  this.config.controls.includes("settings") &&
                  !W(this.config.settings) &&
                  qt.toggleMenu.call(this, !1),
                t !== e)
              ) {
                const i = t ? "controlshidden" : "controlsshown";
                ft.call(this, this.media, i);
              }
              return !t;
            }),
            o(this, "on", (t, e) => {
              pt.call(this, this.elements.container, t, e);
            }),
            o(this, "once", (t, e) => {
              gt.call(this, this.elements.container, t, e);
            }),
            o(this, "off", (t, e) => {
              mt(this.elements.container, t, e);
            }),
            o(this, "destroy", (t, e = !1) => {
              var i;
              this.ready &&
                ((i = () => {
                  (document.body.style.overflow = ""),
                    (this.embed = null),
                    e
                      ? (Object.keys(this.elements).length &&
                          (K(this.elements.buttons.play),
                          K(this.elements.captions),
                          K(this.elements.controls),
                          K(this.elements.wrapper),
                          (this.elements.buttons.play = null),
                          (this.elements.captions = null),
                          (this.elements.controls = null),
                          (this.elements.wrapper = null)),
                        z(t) && t())
                      : (function () {
                          this &&
                            this.eventListeners &&
                            (this.eventListeners.forEach((t) => {
                              const {
                                element: e,
                                type: i,
                                callback: s,
                                options: n,
                              } = t;
                              e.removeEventListener(i, s, n);
                            }),
                            (this.eventListeners = []));
                        }.call(this),
                        kt.cancelRequests.call(this),
                        tt(this.elements.original, this.elements.container),
                        ft.call(this, this.elements.original, "destroyed", !0),
                        z(t) && t.call(this.elements.original),
                        (this.ready = !1),
                        setTimeout(() => {
                          (this.elements = null), (this.media = null);
                        }, 200));
                }),
                this.stop(),
                clearTimeout(this.timers.loading),
                clearTimeout(this.timers.controls),
                clearTimeout(this.timers.resized),
                this.isHTML5
                  ? (Xt.toggleNativeControls.call(this, !0), i())
                  : this.isYouTube
                  ? (clearInterval(this.timers.buffering),
                    clearInterval(this.timers.playing),
                    null !== this.embed &&
                      z(this.embed.destroy) &&
                      this.embed.destroy(),
                    i())
                  : this.isVimeo &&
                    (null !== this.embed && this.embed.unload().then(i),
                    setTimeout(i, 200)));
            }),
            o(this, "supports", (t) => ut.mime.call(this, t)),
            (this.timers = {}),
            (this.ready = !1),
            (this.loading = !1),
            (this.failed = !1),
            (this.touch = ut.touch),
            (this.media = t),
            P(this.media) &&
              (this.media = document.querySelectorAll(this.media)),
            ((window.jQuery && this.media instanceof jQuery) ||
              L(this.media) ||
              j(this.media)) &&
              (this.media = this.media[0]),
            (this.config = U(
              {},
              Rt,
              ue.defaults,
              e || {},
              (() => {
                try {
                  return JSON.parse(
                    this.media.getAttribute("data-plyr-config")
                  );
                } catch (t) {
                  return {};
                }
              })()
            )),
            (this.elements = {
              container: null,
              fullscreen: null,
              captions: null,
              buttons: {},
              display: {},
              progress: {},
              inputs: {},
              settings: { popup: null, menu: null, panels: {}, buttons: {} },
            }),
            (this.captions = {
              active: null,
              currentTrack: -1,
              meta: new WeakMap(),
            }),
            (this.fullscreen = { active: !1 }),
            (this.options = { speed: [], quality: [] }),
            (this.debug = new Ut(this.config.debug)),
            this.debug.log("Config", this.config),
            this.debug.log("Support", ut),
            !E(this.media) && D(this.media))
          )
            if (this.media.plyr) this.debug.warn("Target already setup");
            else if (this.config.enabled)
              if (ut.check().api) {
                const n = this.media.cloneNode(!0);
                (n.autoplay = !1), (this.elements.original = n);
                var i,
                  s = this.media.tagName.toLowerCase();
                let t = null,
                  e = null;
                switch (s) {
                  case "div":
                    if (((t = this.media.querySelector("iframe")), D(t))) {
                      if (
                        ((e = Nt(t.getAttribute("src"))),
                        (this.provider =
                          ((i = e.toString()),
                          /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
                            i
                          )
                            ? Vt.youtube
                            : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(
                                i
                              )
                            ? Vt.vimeo
                            : null)),
                        (this.elements.container = this.media),
                        (this.media = t),
                        (this.elements.container.className = ""),
                        e.search.length)
                      ) {
                        const o = ["1", "true"];
                        o.includes(e.searchParams.get("autoplay")) &&
                          (this.config.autoplay = !0),
                          o.includes(e.searchParams.get("loop")) &&
                            (this.config.loop.active = !0),
                          this.isYouTube
                            ? ((this.config.playsinline = o.includes(
                                e.searchParams.get("playsinline")
                              )),
                              (this.config.youtube.hl =
                                e.searchParams.get("hl")))
                            : (this.config.playsinline = !0);
                      }
                    } else
                      (this.provider = this.media.getAttribute(
                        this.config.attributes.embed.provider
                      )),
                        this.media.removeAttribute(
                          this.config.attributes.embed.provider
                        );
                    if (
                      W(this.provider) ||
                      !Object.values(Vt).includes(this.provider)
                    )
                      return void this.debug.error(
                        "Setup failed: Invalid provider"
                      );
                    this.type = "video";
                    break;
                  case "video":
                  case "audio":
                    (this.type = s),
                      (this.provider = Vt.html5),
                      this.media.hasAttribute("crossorigin") &&
                        (this.config.crossorigin = !0),
                      this.media.hasAttribute("autoplay") &&
                        (this.config.autoplay = !0),
                      (this.media.hasAttribute("playsinline") ||
                        this.media.hasAttribute("webkit-playsinline")) &&
                        (this.config.playsinline = !0),
                      this.media.hasAttribute("muted") &&
                        (this.config.muted = !0),
                      this.media.hasAttribute("loop") &&
                        (this.config.loop.active = !0);
                    break;
                  default:
                    return void this.debug.error(
                      "Setup failed: unsupported type"
                    );
                }
                (this.supported = ut.check(
                  this.type,
                  this.provider,
                  this.config.playsinline
                )),
                  this.supported.api
                    ? ((this.eventListeners = []),
                      (this.listeners = new Zt(this)),
                      (this.storage = new zt(this)),
                      (this.media.plyr = this),
                      D(this.elements.container) ||
                        ((this.elements.container = X("div", { tabindex: 0 })),
                        Q(this.media, this.elements.container)),
                      Xt.migrateStyles.call(this),
                      Xt.addStyleHook.call(this),
                      oe.setup.call(this),
                      this.config.debug &&
                        pt.call(
                          this,
                          this.elements.container,
                          this.config.events.join(" "),
                          (t) => {
                            this.debug.log(`event: ${t.type}`);
                          }
                        ),
                      (this.fullscreen = new Qt(this)),
                      (this.isHTML5 || (this.isEmbed && !this.supported.ui)) &&
                        Xt.build.call(this),
                      this.listeners.container(),
                      this.listeners.global(),
                      this.config.ads.enabled && (this.ads = new re(this)),
                      this.isHTML5 &&
                        this.config.autoplay &&
                        this.once("canplay", () => yt(this.play())),
                      (this.lastSeekTime = 0),
                      this.config.previewThumbnails.enabled &&
                        (this.previewThumbnails = new le(this)))
                    : this.debug.error("Setup failed: no support");
              } else this.debug.error("Setup failed: no support");
            else this.debug.error("Setup failed: disabled by config");
          else this.debug.error("Setup failed: no suitable element passed");
        }
        get isHTML5() {
          return this.provider === Vt.html5;
        }
        get isEmbed() {
          return this.isYouTube || this.isVimeo;
        }
        get isYouTube() {
          return this.provider === Vt.youtube;
        }
        get isVimeo() {
          return this.provider === Vt.vimeo;
        }
        get isVideo() {
          return "video" === this.type;
        }
        get isAudio() {
          return "audio" === this.type;
        }
        get playing() {
          return Boolean(this.ready && !this.paused && !this.ended);
        }
        get paused() {
          return Boolean(this.media.paused);
        }
        get stopped() {
          return Boolean(this.paused && 0 === this.currentTime);
        }
        get ended() {
          return Boolean(this.media.ended);
        }
        set currentTime(t) {
          var e;
          this.duration &&
            ((e = I(t) && 0 < t),
            (this.media.currentTime = e ? Math.min(t, this.duration) : 0),
            this.debug.log(`Seeking to ${this.currentTime} seconds`));
        }
        get currentTime() {
          return Number(this.media.currentTime);
        }
        get buffered() {
          const { buffered: t } = this.media;
          return I(t)
            ? t
            : t && t.length && 0 < this.duration
            ? t.end(0) / this.duration
            : 0;
        }
        get seeking() {
          return Boolean(this.media.seeking);
        }
        get duration() {
          var t = parseFloat(this.config.duration),
            e = (this.media || {}).duration,
            e = I(e) && e !== 1 / 0 ? e : 0;
          return t || e;
        }
        set volume(t) {
          let e = t;
          P(e) && (e = Number(e)),
            I(e) || (e = this.storage.get("volume")),
            I(e) || ({ volume: e } = this.config),
            1 < e && (e = 1),
            e < 0 && (e = 0),
            (this.config.volume = e),
            (this.media.volume = e),
            !W(t) && this.muted && 0 < e && (this.muted = !1);
        }
        get volume() {
          return Number(this.media.volume);
        }
        set muted(t) {
          let e = t;
          O(e) || (e = this.storage.get("muted")),
            O(e) || (e = this.config.muted),
            (this.config.muted = e),
            (this.media.muted = e);
        }
        get muted() {
          return Boolean(this.media.muted);
        }
        get hasAudio() {
          return (
            !this.isHTML5 ||
            !!this.isAudio ||
            Boolean(this.media.mozHasAudio) ||
            Boolean(this.media.webkitAudioDecodedByteCount) ||
            Boolean(this.media.audioTracks && this.media.audioTracks.length)
          );
        }
        set speed(t) {
          let e = null;
          I(t) && (e = t),
            I(e) || (e = this.storage.get("speed")),
            I(e) || (e = this.config.speed.selected);
          var { minimumSpeed: i, maximumSpeed: s } = this;
          (e =
            (([t = 0, i = 0, s = 255] = [e, i, s]),
            Math.min(Math.max(t, i), s))),
            (this.config.speed.selected = e),
            setTimeout(() => {
              this.media.playbackRate = e;
            }, 0);
        }
        get speed() {
          return Number(this.media.playbackRate);
        }
        get minimumSpeed() {
          return this.isYouTube
            ? Math.min(...this.options.speed)
            : this.isVimeo
            ? 0.5
            : 0.0625;
        }
        get maximumSpeed() {
          return this.isYouTube
            ? Math.max(...this.options.speed)
            : this.isVimeo
            ? 2
            : 16;
        }
        set quality(i) {
          const s = this.config.quality,
            n = this.options.quality;
          if (n.length) {
            let t = [
                !W(i) && Number(i),
                this.storage.get("quality"),
                s.selected,
                s.default,
              ].find(I),
              e = !0;
            if (!n.includes(t)) {
              const i = bt(n, t);
              this.debug.warn(
                `Unsupported quality option: ${t}, using ${i} instead`
              ),
                (t = i),
                (e = !1);
            }
            (s.selected = t),
              (this.media.quality = t),
              e && this.storage.set({ quality: t });
          }
        }
        get quality() {
          return this.media.quality;
        }
        set loop(t) {
          t = O(t) ? t : this.config.loop.active;
          (this.config.loop.active = t), (this.media.loop = t);
        }
        get loop() {
          return Boolean(this.media.loop);
        }
        set source(t) {
          ce.change.call(this, t);
        }
        get source() {
          return this.media.currentSrc;
        }
        get download() {
          var { download: t } = this.config.urls;
          return H(t) ? t : this.source;
        }
        set download(t) {
          H(t) &&
            ((this.config.urls.download = t), qt.setDownloadUrl.call(this));
        }
        set poster(t) {
          this.isVideo
            ? Xt.setPoster.call(this, t, !1).catch(() => {})
            : this.debug.warn("Poster can only be set for video");
        }
        get poster() {
          return this.isVideo
            ? this.media.getAttribute("poster") ||
                this.media.getAttribute("data-poster")
            : null;
        }
        get ratio() {
          if (!this.isVideo) return null;
          const t = _t(Tt.call(this));
          return j(t) ? t.join(":") : t;
        }
        set ratio(t) {
          this.isVideo
            ? P(t) && $t(t)
              ? ((this.config.ratio = _t(t)), St.call(this))
              : this.debug.error(`Invalid aspect ratio specified (${t})`)
            : this.debug.warn("Aspect ratio can only be set for video");
        }
        set autoplay(t) {
          t = O(t) ? t : this.config.autoplay;
          this.config.autoplay = t;
        }
        get autoplay() {
          return Boolean(this.config.autoplay);
        }
        toggleCaptions(t) {
          Wt.toggle.call(this, t, !1);
        }
        set currentTrack(t) {
          Wt.set.call(this, t, !1);
        }
        get currentTrack() {
          var { toggled: t, currentTrack: e } = this.captions;
          return t ? e : -1;
        }
        set language(t) {
          Wt.setLanguage.call(this, t, !1);
        }
        get language() {
          return (Wt.getCurrentTrack.call(this) || {}).language;
        }
        set pip(t) {
          ut.pip &&
            ((t = O(t) ? t : !this.pip),
            z(this.media.webkitSetPresentationMode) &&
              this.media.webkitSetPresentationMode(t ? Bt : "inline"),
            z(this.media.requestPictureInPicture) &&
              (!this.pip && t
                ? this.media.requestPictureInPicture()
                : this.pip && !t && document.exitPictureInPicture()));
        }
        get pip() {
          return ut.pip
            ? W(this.media.webkitPresentationMode)
              ? this.media === document.pictureInPictureElement
              : this.media.webkitPresentationMode === Bt
            : null;
        }
        static supported(t, e, i) {
          return ut.check(t, e, i);
        }
        static loadSprite(t, e) {
          return Lt(t, e);
        }
        static setup(t, e = {}) {
          let i = null;
          return (
            P(t)
              ? (i = Array.from(document.querySelectorAll(t)))
              : L(t)
              ? (i = Array.from(t))
              : j(t) && (i = t.filter(D)),
            W(i) ? null : i.map((t) => new ue(t, e))
          );
        }
      }
      return (ue.defaults = ((Kt = Rt), JSON.parse(JSON.stringify(Kt)))), ue;
    });
var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function (l) {
    var c = /\blang(?:uage)?-([\w-]+)\b/i,
      e = 0,
      t = {},
      M = {
        manual: l.Prism && l.Prism.manual,
        disableWorkerMessageHandler:
          l.Prism && l.Prism.disableWorkerMessageHandler,
        util: {
          encode: function t(e) {
            return e instanceof I
              ? new I(e.type, t(e.content), e.alias)
              : Array.isArray(e)
              ? e.map(t)
              : e
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/\u00a0/g, " ");
          },
          type: function (t) {
            return Object.prototype.toString.call(t).slice(8, -1);
          },
          objId: function (t) {
            return (
              t.__id || Object.defineProperty(t, "__id", { value: ++e }), t.__id
            );
          },
          clone: function i(t, s) {
            var n, e;
            switch (((s = s || {}), M.util.type(t))) {
              case "Object":
                if (((e = M.util.objId(t)), s[e])) return s[e];
                for (var o in ((n = {}), (s[e] = n), t))
                  t.hasOwnProperty(o) && (n[o] = i(t[o], s));
                return n;
              case "Array":
                return (
                  (e = M.util.objId(t)),
                  s[e] ||
                    ((n = []),
                    (s[e] = n),
                    t.forEach(function (t, e) {
                      n[e] = i(t, s);
                    }),
                    n)
                );
              default:
                return t;
            }
          },
          getLanguage: function (t) {
            for (; t && !c.test(t.className); ) t = t.parentElement;
            return t
              ? (t.className.match(c) || [, "none"])[1].toLowerCase()
              : "none";
          },
          currentScript: function () {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error();
            } catch (t) {
              var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(t.stack) ||
                [])[1];
              if (e) {
                var i,
                  s = document.getElementsByTagName("script");
                for (i in s) if (s[i].src == e) return s[i];
              }
              return null;
            }
          },
          isActive: function (t, e, i) {
            for (var s = "no-" + e; t; ) {
              var n = t.classList;
              if (n.contains(e)) return !0;
              if (n.contains(s)) return !1;
              t = t.parentElement;
            }
            return !!i;
          },
        },
        languages: {
          plain: t,
          plaintext: t,
          text: t,
          txt: t,
          extend: function (t, e) {
            var i,
              s = M.util.clone(M.languages[t]);
            for (i in e) s[i] = e[i];
            return s;
          },
          insertBefore: function (i, t, e, s) {
            var n,
              o = (s = s || M.languages)[i],
              r = {};
            for (n in o)
              if (o.hasOwnProperty(n)) {
                if (n == t)
                  for (var a in e) e.hasOwnProperty(a) && (r[a] = e[a]);
                e.hasOwnProperty(n) || (r[n] = o[n]);
              }
            var l = s[i];
            return (
              (s[i] = r),
              M.languages.DFS(M.languages, function (t, e) {
                e === l && t != i && (this[t] = r);
              }),
              r
            );
          },
          DFS: function t(e, i, s, n) {
            n = n || {};
            var o,
              r,
              a,
              l = M.util.objId;
            for (o in e)
              e.hasOwnProperty(o) &&
                (i.call(e, o, e[o], s || o),
                (r = e[o]),
                "Object" !== (a = M.util.type(r)) || n[l(r)]
                  ? "Array" !== a || n[l(r)] || ((n[l(r)] = !0), t(r, i, o, n))
                  : ((n[l(r)] = !0), t(r, i, null, n)));
          },
        },
        plugins: {},
        highlightAll: function (t, e) {
          M.highlightAllUnder(document, t, e);
        },
        highlightAllUnder: function (t, e, i) {
          var s = {
            callback: i,
            container: t,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          M.hooks.run("before-highlightall", s),
            (s.elements = Array.prototype.slice.apply(
              s.container.querySelectorAll(s.selector)
            )),
            M.hooks.run("before-all-elements-highlight", s);
          for (var n, o = 0; (n = s.elements[o++]); )
            M.highlightElement(n, !0 === e, s.callback);
        },
        highlightElement: function (t, e, i) {
          var s = M.util.getLanguage(t),
            n = M.languages[s];
          t.className =
            t.className.replace(c, "").replace(/\s+/g, " ") + " language-" + s;
          var o = t.parentElement;
          o &&
            "pre" === o.nodeName.toLowerCase() &&
            (o.className =
              o.className.replace(c, "").replace(/\s+/g, " ") +
              " language-" +
              s);
          var r = { element: t, language: s, grammar: n, code: t.textContent };
          function a(t) {
            (r.highlightedCode = t),
              M.hooks.run("before-insert", r),
              (r.element.innerHTML = r.highlightedCode),
              M.hooks.run("after-highlight", r),
              M.hooks.run("complete", r),
              i && i.call(r.element);
          }
          if (
            (M.hooks.run("before-sanity-check", r),
            (o = r.element.parentElement) &&
              "pre" === o.nodeName.toLowerCase() &&
              !o.hasAttribute("tabindex") &&
              o.setAttribute("tabindex", "0"),
            !r.code)
          )
            return M.hooks.run("complete", r), void (i && i.call(r.element));
          M.hooks.run("before-highlight", r),
            r.grammar
              ? e && l.Worker
                ? (((e = new Worker(M.filename)).onmessage = function (t) {
                    a(t.data);
                  }),
                  e.postMessage(
                    JSON.stringify({
                      language: r.language,
                      code: r.code,
                      immediateClose: !0,
                    })
                  ))
                : a(M.highlight(r.code, r.grammar, r.language))
              : a(M.util.encode(r.code));
        },
        highlight: function (t, e, i) {
          i = { code: t, grammar: e, language: i };
          return (
            M.hooks.run("before-tokenize", i),
            (i.tokens = M.tokenize(i.code, i.grammar)),
            M.hooks.run("after-tokenize", i),
            I.stringify(M.util.encode(i.tokens), i.language)
          );
        },
        tokenize: function (t, e) {
          var i = e.rest;
          if (i) {
            for (var s in i) e[s] = i[s];
            delete e.rest;
          }
          var n = new o();
          return (
            O(n, n.head, t),
            (function t(e, i, s, n, o, r) {
              for (var a in s)
                if (s.hasOwnProperty(a) && s[a])
                  for (
                    var l = s[a], l = Array.isArray(l) ? l : [l], c = 0;
                    c < l.length;
                    ++c
                  ) {
                    if (r && r.cause == a + "," + c) return;
                    var u,
                      h = l[c],
                      d = h.inside,
                      p = !!h.lookbehind,
                      m = !!h.greedy,
                      g = h.alias;
                    m &&
                      !h.pattern.global &&
                      ((u = h.pattern.toString().match(/[imsuy]*$/)[0]),
                      (h.pattern = RegExp(h.pattern.source, u + "g")));
                    for (
                      var f = h.pattern || h, y = n.next, v = o;
                      y !== i.tail && !(r && v >= r.reach);
                      v += y.value.length, y = y.next
                    ) {
                      var b = y.value;
                      if (i.length > e.length) return;
                      if (!(b instanceof I)) {
                        var w,
                          x = 1;
                        if (m) {
                          if (!(w = P(f, v, e, p))) break;
                          var $ = w.index,
                            _ = w.index + w[0].length,
                            T = v;
                          for (T += y.value.length; T <= $; )
                            T += (y = y.next).value.length;
                          if (((v = T -= y.value.length), y.value instanceof I))
                            continue;
                          for (
                            var S = y;
                            S !== i.tail &&
                            (T < _ || "string" == typeof S.value);
                            S = S.next
                          )
                            x++, (T += S.value.length);
                          x--, (b = e.slice(v, T)), (w.index -= v);
                        } else if (!(w = P(f, 0, b, p))) continue;
                        var $ = w.index,
                          C = w[0],
                          k = b.slice(0, $),
                          A = b.slice($ + C.length),
                          E = v + b.length;
                        r && E > r.reach && (r.reach = E);
                        b = y.prev;
                        k && ((b = O(i, b, k)), (v += k.length)),
                          (function (t, e, i) {
                            for (
                              var s = e.next, n = 0;
                              n < i && s !== t.tail;
                              n++
                            )
                              s = s.next;
                            ((e.next = s).prev = e), (t.length -= n);
                          })(i, b, x);
                        y = O(i, b, new I(a, d ? M.tokenize(C, d) : C, g, C));
                        A && O(i, y, A),
                          1 < x &&
                            (t(
                              e,
                              i,
                              s,
                              y.prev,
                              v,
                              (E = { cause: a + "," + c, reach: E })
                            ),
                            r && E.reach > r.reach && (r.reach = E.reach));
                      }
                    }
                  }
            })(t, n, e, n.head, 0),
            (function (t) {
              for (var e = [], i = t.head.next; i !== t.tail; )
                e.push(i.value), (i = i.next);
              return e;
            })(n)
          );
        },
        hooks: {
          all: {},
          add: function (t, e) {
            var i = M.hooks.all;
            (i[t] = i[t] || []), i[t].push(e);
          },
          run: function (t, e) {
            var i = M.hooks.all[t];
            if (i && i.length) for (var s, n = 0; (s = i[n++]); ) s(e);
          },
        },
        Token: I,
      };
    function I(t, e, i, s) {
      (this.type = t),
        (this.content = e),
        (this.alias = i),
        (this.length = 0 | (s || "").length);
    }
    function P(t, e, i, s) {
      t.lastIndex = e;
      i = t.exec(i);
      return (
        i &&
          s &&
          i[1] &&
          ((s = i[1].length), (i.index += s), (i[0] = i[0].slice(s))),
        i
      );
    }
    function o() {
      var t = { value: null, prev: null, next: null },
        e = { value: null, prev: t, next: null };
      (t.next = e), (this.head = t), (this.tail = e), (this.length = 0);
    }
    function O(t, e, i) {
      var s = e.next,
        i = { value: i, prev: e, next: s };
      return (e.next = i), (s.prev = i), t.length++, i;
    }
    if (
      ((l.Prism = M),
      (I.stringify = function e(t, i) {
        if ("string" == typeof t) return t;
        if (Array.isArray(t)) {
          var s = "";
          return (
            t.forEach(function (t) {
              s += e(t, i);
            }),
            s
          );
        }
        var n = {
            type: t.type,
            content: e(t.content, i),
            tag: "span",
            classes: ["token", t.type],
            attributes: {},
            language: i,
          },
          t = t.alias;
        t &&
          (Array.isArray(t)
            ? Array.prototype.push.apply(n.classes, t)
            : n.classes.push(t)),
          M.hooks.run("wrap", n);
        var o,
          r = "";
        for (o in n.attributes)
          r +=
            " " +
            o +
            '="' +
            (n.attributes[o] || "").replace(/"/g, "&quot;") +
            '"';
        return (
          "<" +
          n.tag +
          ' class="' +
          n.classes.join(" ") +
          '"' +
          r +
          ">" +
          n.content +
          "</" +
          n.tag +
          ">"
        );
      }),
      !l.document)
    )
      return (
        l.addEventListener &&
          (M.disableWorkerMessageHandler ||
            l.addEventListener(
              "message",
              function (t) {
                var e = JSON.parse(t.data),
                  i = e.language,
                  t = e.code,
                  e = e.immediateClose;
                l.postMessage(M.highlight(t, M.languages[i], i)),
                  e && l.close();
              },
              !1
            )),
        M
      );
    var i = M.util.currentScript();
    function s() {
      M.manual || M.highlightAll();
    }
    return (
      i &&
        ((M.filename = i.src),
        i.hasAttribute("data-manual") && (M.manual = !0)),
      M.manual ||
        ("loading" === (t = document.readyState) ||
        ("interactive" === t && i && i.defer)
          ? document.addEventListener("DOMContentLoaded", s)
          : window.requestAnimationFrame
          ? window.requestAnimationFrame(s)
          : window.setTimeout(s, 16)),
      M
    );
  })(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism),
  (Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: {
      pattern:
        /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: !0,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: !0,
          greedy: !0,
          inside: null,
        },
        string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
        punctuation: /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/,
        name: /[^\s<>'"]+/,
      },
    },
    cdata: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    tag: {
      pattern:
        /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
          },
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: { namespace: /^[^\s>\/:]+:/ },
        },
      },
    },
    entity: [
      { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
      /&#x?[\da-f]{1,8};/i,
    ],
  }),
  (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
    Prism.languages.markup.entity),
  (Prism.languages.markup.doctype.inside["internal-subset"].inside =
    Prism.languages.markup),
  Prism.hooks.add("wrap", function (t) {
    "entity" === t.type &&
      (t.attributes.title = t.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (t, e) {
      var i = {};
      (i["language-" + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e],
      }),
        (i.cdata = /^<!\[CDATA\[|\]\]>$/i);
      i = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: i },
      };
      i["language-" + e] = { pattern: /[\s\S]+/, inside: Prism.languages[e] };
      e = {};
      (e[t] = {
        pattern: RegExp(
          "(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(
            /__/g,
            function () {
              return t;
            }
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: i,
      }),
        Prism.languages.insertBefore("markup", "cdata", e);
    },
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
    value: function (t, e) {
      Prism.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          "(^|[\"'\\s])(?:" +
            t +
            ")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))",
          "i"
        ),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [e, "language-" + e],
                inside: Prism.languages[e],
              },
              punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
            },
          },
        },
      });
    },
  }),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.ssml = Prism.languages.xml),
  (Prism.languages.atom = Prism.languages.xml),
  (Prism.languages.rss = Prism.languages.xml),
  (function (t) {
    var e =
      /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    (t.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
        inside: {
          rule: /^@[\w-]+/,
          "selector-function-argument": {
            pattern:
              /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: !0,
            alias: "selector",
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0,
          },
        },
      },
      url: {
        pattern: RegExp(
          "\\burl\\((?:" + e.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)",
          "i"
        ),
        greedy: !0,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: { pattern: RegExp("^" + e.source + "$"), alias: "url" },
        },
      },
      selector: {
        pattern: RegExp(
          "(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" +
            e.source +
            ")*(?=\\s*\\{)"
        ),
        lookbehind: !0,
      },
      string: { pattern: e, greedy: !0 },
      property: {
        pattern:
          /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: !0,
      },
      important: /!important\b/i,
      function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
      punctuation: /[(){};:,]/,
    }),
      (t.languages.css.atrule.inside.rest = t.languages.css);
    t = t.languages.markup;
    t && (t.tag.addInlined("style", "css"), t.tag.addAttribute("style", "css"));
  })(Prism),
  (Prism.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0,
        greedy: !0,
      },
      { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0,
    },
    "class-name": {
      pattern:
        /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ },
    },
    keyword:
      /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/,
  }),
  (Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [
      Prism.languages.clike["class-name"],
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:prototype|constructor))/,
        lookbehind: !0,
      },
    ],
    keyword: [
      { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
      {
        pattern:
          /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0,
      },
    ],
    function:
      /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number:
      /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    operator:
      /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
  })),
  (Prism.languages.javascript["class-name"][0].pattern =
    /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern:
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: Prism.languages.regex,
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/,
      },
    },
    "function-variable": {
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function",
    },
    parameter: [
      {
        pattern:
          /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore("javascript", "string", {
    hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
    "template-string": {
      pattern:
        /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": { pattern: /^`|`$/, alias: "string" },
        interpolation: {
          pattern:
            /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation",
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  }),
  Prism.languages.markup &&
    (Prism.languages.markup.tag.addInlined("script", "javascript"),
    Prism.languages.markup.tag.addAttribute(
      "on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)",
      "javascript"
    )),
  (Prism.languages.js = Prism.languages.javascript),
  (function (p) {
    function m(t, e) {
      return "___" + t.toUpperCase() + e + "___";
    }
    Object.defineProperties((p.languages["markup-templating"] = {}), {
      buildPlaceholders: {
        value: function (s, n, t, o) {
          var r;
          s.language === n &&
            ((r = s.tokenStack = []),
            (s.code = s.code.replace(t, function (t) {
              if ("function" == typeof o && !o(t)) return t;
              for (var e, i = r.length; -1 !== s.code.indexOf((e = m(n, i))); )
                ++i;
              return (r[i] = t), e;
            })),
            (s.grammar = p.languages.markup));
        },
      },
      tokenizePlaceholders: {
        value: function (c, u) {
          var h, d;
          c.language === u &&
            c.tokenStack &&
            ((c.grammar = p.languages[u]),
            (h = 0),
            (d = Object.keys(c.tokenStack)),
            (function t(e) {
              for (var i = 0; i < e.length && !(h >= d.length); i++) {
                var s,
                  n,
                  o,
                  r,
                  a,
                  l = e[i];
                "string" == typeof l ||
                (l.content && "string" == typeof l.content)
                  ? ((n = d[h]),
                    (o = c.tokenStack[n]),
                    (s = "string" == typeof l ? l : l.content),
                    (a = m(u, n)),
                    -1 < (r = s.indexOf(a)) &&
                      (++h,
                      (n = s.substring(0, r)),
                      (o = new p.Token(
                        u,
                        p.tokenize(o, c.grammar),
                        "language-" + u,
                        o
                      )),
                      (r = s.substring(r + a.length)),
                      (a = []),
                      n && a.push.apply(a, t([n])),
                      a.push(o),
                      r && a.push.apply(a, t([r])),
                      "string" == typeof l
                        ? e.splice.apply(e, [i, 1].concat(a))
                        : (l.content = a)))
                  : l.content && t(l.content);
              }
              return e;
            })(c.tokens));
        },
      },
    });
  })(Prism),
  (function (e) {
    var t = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
      i = [
        { pattern: /\b(?:false|true)\b/i, alias: "boolean" },
        {
          pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
          greedy: !0,
          lookbehind: !0,
        },
        /\b(?:null)\b/i,
        /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/,
      ],
      s =
        /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
      n =
        /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
      o = /[{}\[\](),:;]/;
    e.languages.php = {
      delimiter: { pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i, alias: "important" },
      comment: t,
      variable: /\$+(?:\w+\b|(?=\{))/i,
      package: {
        pattern:
          /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
      },
      "class-name-definition": {
        pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
        lookbehind: !0,
        alias: "class-name",
      },
      "function-definition": {
        pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
        lookbehind: !0,
        alias: "function",
      },
      keyword: [
        {
          pattern:
            /(\(\s*)\b(?:bool|boolean|int|integer|float|string|object|array)\b(?=\s*\))/i,
          alias: "type-casting",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern:
            /([(,?]\s*)\b(?:bool|int|float|string|object|array(?!\s*\()|mixed|self|static|callable|iterable|(?:null|false)(?=\s*\|))\b(?=\s*\$)/i,
          alias: "type-hint",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern: /([(,?]\s*[\w|]\|\s*)(?:null|false)\b(?=\s*\$)/i,
          alias: "type-hint",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern:
            /(\)\s*:\s*(?:\?\s*)?)\b(?:bool|int|float|string|object|void|array(?!\s*\()|mixed|self|static|callable|iterable|(?:null|false)(?=\s*\|))\b/i,
          alias: "return-type",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern: /(\)\s*:\s*(?:\?\s*)?[\w|]\|\s*)(?:null|false)\b/i,
          alias: "return-type",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern:
            /\b(?:bool|int|float|string|object|void|array(?!\s*\()|mixed|iterable|(?:null|false)(?=\s*\|))\b/i,
          alias: "type-declaration",
          greedy: !0,
        },
        {
          pattern: /(\|\s*)(?:null|false)\b/i,
          alias: "type-declaration",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern: /\b(?:parent|self|static)(?=\s*::)/i,
          alias: "static-context",
          greedy: !0,
        },
        { pattern: /(\byield\s+)from\b/i, lookbehind: !0 },
        /\bclass\b/i,
        {
          pattern:
            /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|match|new|or|parent|print|private|protected|public|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
          lookbehind: !0,
        },
      ],
      "argument-name": {
        pattern: /([(,]\s+)\b[a-z_]\w*(?=\s*:(?!:))/i,
        lookbehind: !0,
      },
      "class-name": [
        {
          pattern:
            /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
          greedy: !0,
          lookbehind: !0,
        },
        { pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i, greedy: !0, lookbehind: !0 },
        { pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i, greedy: !0 },
        {
          pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
          alias: "class-name-fully-qualified",
          greedy: !0,
          lookbehind: !0,
          inside: { punctuation: /\\/ },
        },
        {
          pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
          alias: "class-name-fully-qualified",
          greedy: !0,
          inside: { punctuation: /\\/ },
        },
        {
          pattern:
            /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
          alias: "class-name-fully-qualified",
          greedy: !0,
          lookbehind: !0,
          inside: { punctuation: /\\/ },
        },
        {
          pattern: /\b[a-z_]\w*(?=\s*\$)/i,
          alias: "type-declaration",
          greedy: !0,
        },
        {
          pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
          alias: ["class-name-fully-qualified", "type-declaration"],
          greedy: !0,
          inside: { punctuation: /\\/ },
        },
        {
          pattern: /\b[a-z_]\w*(?=\s*::)/i,
          alias: "static-context",
          greedy: !0,
        },
        {
          pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
          alias: ["class-name-fully-qualified", "static-context"],
          greedy: !0,
          inside: { punctuation: /\\/ },
        },
        {
          pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
          alias: "type-hint",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
          alias: ["class-name-fully-qualified", "type-hint"],
          greedy: !0,
          lookbehind: !0,
          inside: { punctuation: /\\/ },
        },
        {
          pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
          alias: "return-type",
          greedy: !0,
          lookbehind: !0,
        },
        {
          pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
          alias: ["class-name-fully-qualified", "return-type"],
          greedy: !0,
          lookbehind: !0,
          inside: { punctuation: /\\/ },
        },
      ],
      constant: i,
      function: {
        pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
      },
      property: { pattern: /(->\s*)\w+/, lookbehind: !0 },
      number: s,
      operator: n,
      punctuation: o,
    };
    var r = {
        pattern:
          /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
        lookbehind: !0,
        inside: e.languages.php,
      },
      r = [
        {
          pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
          alias: "nowdoc-string",
          greedy: !0,
          inside: {
            delimiter: {
              pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
              alias: "symbol",
              inside: { punctuation: /^<<<'?|[';]$/ },
            },
          },
        },
        {
          pattern:
            /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
          alias: "heredoc-string",
          greedy: !0,
          inside: {
            delimiter: {
              pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
              alias: "symbol",
              inside: { punctuation: /^<<<"?|[";]$/ },
            },
            interpolation: r,
          },
        },
        {
          pattern: /`(?:\\[\s\S]|[^\\`])*`/,
          alias: "backtick-quoted-string",
          greedy: !0,
        },
        {
          pattern: /'(?:\\[\s\S]|[^\\'])*'/,
          alias: "single-quoted-string",
          greedy: !0,
        },
        {
          pattern: /"(?:\\[\s\S]|[^\\"])*"/,
          alias: "double-quoted-string",
          greedy: !0,
          inside: { interpolation: r },
        },
      ];
    e.languages.insertBefore("php", "variable", {
      string: r,
      attribute: {
        pattern:
          /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
        greedy: !0,
        inside: {
          "attribute-content": {
            pattern: /^(#\[)[\s\S]+(?=\]$)/,
            lookbehind: !0,
            inside: {
              comment: t,
              string: r,
              "attribute-class-name": [
                {
                  pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                  alias: "class-name",
                  greedy: !0,
                  lookbehind: !0,
                },
                {
                  pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                  alias: ["class-name", "class-name-fully-qualified"],
                  greedy: !0,
                  lookbehind: !0,
                  inside: { punctuation: /\\/ },
                },
              ],
              constant: i,
              number: s,
              operator: n,
              punctuation: o,
            },
          },
          delimiter: { pattern: /^#\[|\]$/, alias: "punctuation" },
        },
      },
    }),
      e.hooks.add("before-tokenize", function (t) {
        /<\?/.test(t.code) &&
          e.languages["markup-templating"].buildPlaceholders(
            t,
            "php",
            /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/gi
          );
      }),
      e.hooks.add("after-tokenize", function (t) {
        e.languages["markup-templating"].tokenizePlaceholders(t, "php");
      });
  })(Prism),
  (function (t) {
    (t.languages.sass = t.languages.extend("css", {
      comment: {
        pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t].+)*/m,
        lookbehind: !0,
        greedy: !0,
      },
    })),
      t.languages.insertBefore("sass", "atrule", {
        "atrule-line": {
          pattern: /^(?:[ \t]*)[@+=].+/m,
          greedy: !0,
          inside: { atrule: /(?:@[\w-]+|[+=])/m },
        },
      }),
      delete t.languages.sass.atrule;
    var e = /\$[-\w]+|#\{\$[-\w]+\}/,
      i = [
        /[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/,
        { pattern: /(\s)-(?=\s)/, lookbehind: !0 },
      ];
    t.languages.insertBefore("sass", "property", {
      "variable-line": {
        pattern: /^[ \t]*\$.+/m,
        greedy: !0,
        inside: { punctuation: /:/, variable: e, operator: i },
      },
      "property-line": {
        pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s].*)/m,
        greedy: !0,
        inside: {
          property: [
            /[^:\s]+(?=\s*:)/,
            { pattern: /(:)[^:\s]+/, lookbehind: !0 },
          ],
          punctuation: /:/,
          variable: e,
          operator: i,
          important: t.languages.sass.important,
        },
      },
    }),
      delete t.languages.sass.property,
      delete t.languages.sass.important,
      t.languages.insertBefore("sass", "punctuation", {
        selector: {
          pattern:
            /^([ \t]*)\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*)*/m,
          lookbehind: !0,
          greedy: !0,
        },
      });
  })(Prism),
  (Prism.languages.scss = Prism.languages.extend("css", {
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
      lookbehind: !0,
    },
    atrule: {
      pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
      inside: { rule: /@[\w-]+/ },
    },
    url: /(?:[-a-z]+-)?url(?=\()/i,
    selector: {
      pattern:
        /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/m,
      inside: {
        parent: { pattern: /&/, alias: "important" },
        placeholder: /%[-\w]+/,
        variable: /\$[-\w]+|#\{\$[-\w]+\}/,
      },
    },
    property: {
      pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
      inside: { variable: /\$[-\w]+|#\{\$[-\w]+\}/ },
    },
  })),
  Prism.languages.insertBefore("scss", "atrule", {
    keyword: [
      /@(?:if|else(?: if)?|forward|for|each|while|import|use|extend|debug|warn|mixin|include|function|return|content)\b/i,
      { pattern: /( )(?:from|through)(?= )/, lookbehind: !0 },
    ],
  }),
  Prism.languages.insertBefore("scss", "important", {
    variable: /\$[-\w]+|#\{\$[-\w]+\}/,
  }),
  Prism.languages.insertBefore("scss", "function", {
    "module-modifier": {
      pattern: /\b(?:as|with|show|hide)\b/i,
      alias: "keyword",
    },
    placeholder: { pattern: /%[-\w]+/, alias: "selector" },
    statement: { pattern: /\B!(?:default|optional)\b/i, alias: "keyword" },
    boolean: /\b(?:true|false)\b/,
    null: { pattern: /\bnull\b/, alias: "keyword" },
    operator: {
      pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
      lookbehind: !0,
    },
  }),
  (Prism.languages.scss.atrule.inside.rest = Prism.languages.scss),
  (function (t) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = t())
      : "function" == typeof define && define.amd
      ? define([], t)
      : (("undefined" != typeof window
          ? window
          : "undefined" != typeof global
          ? global
          : "undefined" != typeof self
          ? self
          : this
        ).ProgressBar = t());
  })(function () {
    return (function s(n, o, r) {
      function a(i, t) {
        if (!o[i]) {
          if (!n[i]) {
            var e = "function" == typeof require && require;
            if (!t && e) return e(i, !0);
            if (l) return l(i, !0);
            e = new Error("Cannot find module '" + i + "'");
            throw ((e.code = "MODULE_NOT_FOUND"), e);
          }
          e = o[i] = { exports: {} };
          n[i][0].call(
            e.exports,
            function (t) {
              var e = n[i][1][t];
              return a(e || t);
            },
            e,
            e.exports,
            s,
            n,
            o,
            r
          );
        }
        return o[i].exports;
      }
      for (
        var l = "function" == typeof require && require, t = 0;
        t < r.length;
        t++
      )
        a(r[t]);
      return a;
    })(
      {
        1: [
          function (t, T, S) {
            !function () {
              var c,
                r,
                a,
                o,
                l,
                u,
                s,
                h,
                e,
                d,
                p,
                v = this || Function("return this")(),
                m = (function () {
                  "use strict";
                  function n() {}
                  function o(t, e) {
                    for (var i in t) Object.hasOwnProperty.call(t, i) && e(i);
                  }
                  function r(e, i) {
                    return (
                      o(i, function (t) {
                        e[t] = i[t];
                      }),
                      e
                    );
                  }
                  function a(e, i) {
                    o(i, function (t) {
                      void 0 === e[t] && (e[t] = i[t]);
                    });
                  }
                  function h(t, e, i, s, n, o, r) {
                    var a,
                      l,
                      c = t < o ? 0 : (t - o) / n;
                    for (a in e)
                      e.hasOwnProperty(a) &&
                        ((l = r[a]),
                        (l = "function" == typeof l ? l : p[l]),
                        (e[a] = u(i[a], s[a], l, c)));
                    return e;
                  }
                  function u(t, e, i, s) {
                    return t + (e - t) * i(s);
                  }
                  function d(e, i) {
                    var s = t.prototype.filter,
                      n = e._filterArgs;
                    o(s, function (t) {
                      void 0 !== s[t][i] && s[t][i].apply(e, n);
                    });
                  }
                  function l(t, e, i, s, n, o, r, a, l, c, u) {
                    (f = e + i + s),
                      (m = Math.min(u || y(), f)),
                      (g = f <= m),
                      (f = s - (f - m)),
                      t.isPlaying() &&
                        (g
                          ? (l(r, t._attachment, f), t.stop(!0))
                          : ((t._scheduleId = c(t._timeoutHandler, 1e3 / 60)),
                            d(t, "beforeTween"),
                            m < e + i
                              ? h(1, n, o, r, 1, 1, a)
                              : h(m, n, o, r, s, e + i, a),
                            d(t, "afterTween"),
                            l(n, t._attachment, f)));
                  }
                  function c(t, e) {
                    var i = {},
                      s = typeof e;
                    return (
                      o(
                        t,
                        "string" == s || "function" == s
                          ? function (t) {
                              i[t] = e;
                            }
                          : function (t) {
                              i[t] || (i[t] = e[t] || "linear");
                            }
                      ),
                      i
                    );
                  }
                  function t(t, e) {
                    (this._currentState = t || {}),
                      (this._configured = !1),
                      (this._scheduleFunction = i),
                      void 0 !== e && this.setConfig(e);
                  }
                  var p,
                    m,
                    g,
                    f,
                    e =
                      Date.now ||
                      function () {
                        return +new Date();
                      },
                    y =
                      "undefined" != typeof SHIFTY_DEBUG_NOW
                        ? SHIFTY_DEBUG_NOW
                        : e,
                    i =
                      ("undefined" != typeof window &&
                        (window.requestAnimationFrame ||
                          window.webkitRequestAnimationFrame ||
                          window.oRequestAnimationFrame ||
                          window.msRequestAnimationFrame ||
                          (window.mozCancelRequestAnimationFrame &&
                            window.mozRequestAnimationFrame))) ||
                      setTimeout;
                  return (
                    (t.prototype.tween = function (t) {
                      return this._isTweening
                        ? this
                        : ((void 0 === t && this._configured) ||
                            this.setConfig(t),
                          (this._timestamp = y()),
                          this._start(this.get(), this._attachment),
                          this.resume());
                    }),
                    (t.prototype.setConfig = function (t) {
                      (t = t || {}),
                        (this._configured = !0),
                        (this._attachment = t.attachment),
                        (this._pausedAtTime = null),
                        (this._scheduleId = null),
                        (this._delay = t.delay || 0),
                        (this._start = t.start || n),
                        (this._step = t.step || n),
                        (this._finish = t.finish || n),
                        (this._duration = t.duration || 500),
                        (this._currentState = r({}, t.from) || this.get()),
                        (this._originalState = this.get()),
                        (this._targetState = r({}, t.to) || this.get());
                      var e = this;
                      this._timeoutHandler = function () {
                        l(
                          e,
                          e._timestamp,
                          e._delay,
                          e._duration,
                          e._currentState,
                          e._originalState,
                          e._targetState,
                          e._easing,
                          e._step,
                          e._scheduleFunction
                        );
                      };
                      var i = this._currentState,
                        s = this._targetState;
                      return (
                        a(s, i),
                        (this._easing = c(i, t.easing || "linear")),
                        (this._filterArgs = [
                          i,
                          this._originalState,
                          s,
                          this._easing,
                        ]),
                        d(this, "tweenCreated"),
                        this
                      );
                    }),
                    (t.prototype.get = function () {
                      return r({}, this._currentState);
                    }),
                    (t.prototype.set = function (t) {
                      this._currentState = t;
                    }),
                    (t.prototype.pause = function () {
                      return (
                        (this._pausedAtTime = y()), (this._isPaused = !0), this
                      );
                    }),
                    (t.prototype.resume = function () {
                      return (
                        this._isPaused &&
                          (this._timestamp += y() - this._pausedAtTime),
                        (this._isPaused = !1),
                        (this._isTweening = !0),
                        this._timeoutHandler(),
                        this
                      );
                    }),
                    (t.prototype.seek = function (t) {
                      t = Math.max(t, 0);
                      var e = y();
                      return (
                        this._timestamp + t === 0 ||
                          ((this._timestamp = e - t),
                          this.isPlaying() ||
                            ((this._isTweening = !0),
                            (this._isPaused = !1),
                            l(
                              this,
                              this._timestamp,
                              this._delay,
                              this._duration,
                              this._currentState,
                              this._originalState,
                              this._targetState,
                              this._easing,
                              this._step,
                              this._scheduleFunction,
                              e
                            ),
                            this.pause())),
                        this
                      );
                    }),
                    (t.prototype.stop = function (t) {
                      return (
                        (this._isTweening = !1),
                        (this._isPaused = !1),
                        (this._timeoutHandler = n),
                        (
                          v.cancelAnimationFrame ||
                          v.webkitCancelAnimationFrame ||
                          v.oCancelAnimationFrame ||
                          v.msCancelAnimationFrame ||
                          v.mozCancelRequestAnimationFrame ||
                          v.clearTimeout
                        )(this._scheduleId),
                        t &&
                          (d(this, "beforeTween"),
                          h(
                            1,
                            this._currentState,
                            this._originalState,
                            this._targetState,
                            1,
                            0,
                            this._easing
                          ),
                          d(this, "afterTween"),
                          d(this, "afterTweenEnd"),
                          this._finish.call(
                            this,
                            this._currentState,
                            this._attachment
                          )),
                        this
                      );
                    }),
                    (t.prototype.isPlaying = function () {
                      return this._isTweening && !this._isPaused;
                    }),
                    (t.prototype.setScheduleFunction = function (t) {
                      this._scheduleFunction = t;
                    }),
                    (t.prototype.dispose = function () {
                      for (var t in this)
                        this.hasOwnProperty(t) && delete this[t];
                    }),
                    (t.prototype.filter = {}),
                    (p = t.prototype.formula =
                      {
                        linear: function (t) {
                          return t;
                        },
                      }),
                    r(t, {
                      now: y,
                      each: o,
                      tweenProps: h,
                      tweenProp: u,
                      applyFilter: d,
                      shallowCopy: r,
                      defaults: a,
                      composeEasingObject: c,
                    }),
                    "function" == typeof SHIFTY_DEBUG_NOW &&
                      (v.timeoutHandler = l),
                    "object" == typeof S
                      ? (T.exports = t)
                      : void 0 === v.Tweenable && (v.Tweenable = t),
                    t
                  );
                })();
              function n(i) {
                c.each(i, function (t) {
                  var e = i[t];
                  "string" == typeof e && e.match(s) && (i[t] = f(s, e, g));
                });
              }
              function g(t) {
                3 === (t = (t = t).replace(/#/, "")).length &&
                  (t = (t = t.split(""))[0] + t[0] + t[1] + t[1] + t[2] + t[2]),
                  (e[0] = i(t.substr(0, 2))),
                  (e[1] = i(t.substr(2, 2))),
                  (e[2] = i(t.substr(4, 2))),
                  (t = e);
                return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")";
              }
              function i(t) {
                return parseInt(t, 16);
              }
              function f(t, e, i) {
                var s = e.match(t),
                  n = e.replace(t, h);
                if (s)
                  for (var o, r = s.length, a = 0; a < r; a++)
                    (o = s.shift()), (n = n.replace(h, i(o)));
                return n;
              }
              function y(t) {
                for (
                  var e = t.match(o), i = e.length, s = t.match(u)[0], n = 0;
                  n < i;
                  n++
                )
                  s += parseInt(e[n], 10) + ",";
                return s.slice(0, -1) + ")";
              }
              function b(n) {
                var o = {};
                return (
                  c.each(n, function (t) {
                    var e,
                      i,
                      s = n[t];
                    "string" == typeof s &&
                      ((e = $(s)),
                      (o[t] = {
                        formatString:
                          ((s = (i = s).match(a))
                            ? (1 !== s.length && !i[0].match(r)) ||
                              s.unshift("")
                            : (s = ["", ""]),
                          s.join(h)),
                        chunkNames: (function (t, e) {
                          for (var i = [], s = t.length, n = 0; n < s; n++)
                            i.push("_" + e + "_" + n);
                          return i;
                        })(e, t),
                      }));
                  }),
                  o
                );
              }
              function w(n, o) {
                c.each(o, function (t) {
                  for (var e = $(n[t]), i = e.length, s = 0; s < i; s++)
                    n[o[t].chunkNames[s]] = +e[s];
                  delete n[t];
                });
              }
              function x(s, n) {
                c.each(n, function (t) {
                  s[t];
                  var e = (function (t, e) {
                      d.length = 0;
                      for (var i = e.length, s = 0; s < i; s++) d.push(t[e[s]]);
                      return d;
                    })(
                      (function (t, e) {
                        for (var i, s = {}, n = e.length, o = 0; o < n; o++)
                          (i = e[o]), (s[i] = t[i]), delete t[i];
                        return s;
                      })(s, n[t].chunkNames),
                      n[t].chunkNames
                    ),
                    i = (function (t, e) {
                      for (var i = t, s = e.length, n = 0; n < s; n++)
                        i = i.replace(h, +e[n].toFixed(4));
                      return i;
                    })(n[t].formatString, e);
                  s[t] = f(l, i, y);
                });
              }
              function $(t) {
                return t.match(o);
              }
              function _(t, e, i, s, n, o) {
                function l(t) {
                  return ((u * t + h) * t + d) * t;
                }
                function c(t) {
                  return 0 <= t ? t : 0 - t;
                }
                var r,
                  u = 0,
                  h = 0,
                  d = 0,
                  a = 0,
                  p = 0,
                  m = 0,
                  u = 1 - (d = 3 * e) - (h = 3 * (s - e) - d),
                  a = 1 - (m = 3 * i) - (p = 3 * (n - i) - m);
                return (
                  (r = (function (t, e) {
                    var i, s, n, o, r, a;
                    for (n = t, a = 0; a < 8; a++) {
                      if (c((o = l(n) - t)) < e) return n;
                      if (
                        c(
                          (r = (function (t) {
                            return (3 * u * t + 2 * h) * t + d;
                          })(n))
                        ) < 1e-6
                      )
                        break;
                      n -= o / r;
                    }
                    if (((s = 1), (i = 0) > (n = t))) return i;
                    if (s < n) return s;
                    for (; i < s; ) {
                      if (c((o = l(n)) - t) < e) return n;
                      o < t ? (i = n) : (s = n), (n = 0.5 * (s - i) + i);
                    }
                    return n;
                  })(t, (r = 1 / (200 * o)))),
                  ((a * r + p) * r + m) * r
                );
              }
              m.shallowCopy(m.prototype.formula, {
                easeInQuad: function (t) {
                  return Math.pow(t, 2);
                },
                easeOutQuad: function (t) {
                  return -(Math.pow(t - 1, 2) - 1);
                },
                easeInOutQuad: function (t) {
                  return (t /= 0.5) < 1
                    ? 0.5 * Math.pow(t, 2)
                    : -0.5 * ((t -= 2) * t - 2);
                },
                easeInCubic: function (t) {
                  return Math.pow(t, 3);
                },
                easeOutCubic: function (t) {
                  return Math.pow(t - 1, 3) + 1;
                },
                easeInOutCubic: function (t) {
                  return (t /= 0.5) < 1
                    ? 0.5 * Math.pow(t, 3)
                    : 0.5 * (Math.pow(t - 2, 3) + 2);
                },
                easeInQuart: function (t) {
                  return Math.pow(t, 4);
                },
                easeOutQuart: function (t) {
                  return -(Math.pow(t - 1, 4) - 1);
                },
                easeInOutQuart: function (t) {
                  return (t /= 0.5) < 1
                    ? 0.5 * Math.pow(t, 4)
                    : -0.5 * ((t -= 2) * Math.pow(t, 3) - 2);
                },
                easeInQuint: function (t) {
                  return Math.pow(t, 5);
                },
                easeOutQuint: function (t) {
                  return Math.pow(t - 1, 5) + 1;
                },
                easeInOutQuint: function (t) {
                  return (t /= 0.5) < 1
                    ? 0.5 * Math.pow(t, 5)
                    : 0.5 * (Math.pow(t - 2, 5) + 2);
                },
                easeInSine: function (t) {
                  return 1 - Math.cos(t * (Math.PI / 2));
                },
                easeOutSine: function (t) {
                  return Math.sin(t * (Math.PI / 2));
                },
                easeInOutSine: function (t) {
                  return -0.5 * (Math.cos(Math.PI * t) - 1);
                },
                easeInExpo: function (t) {
                  return 0 === t ? 0 : Math.pow(2, 10 * (t - 1));
                },
                easeOutExpo: function (t) {
                  return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
                },
                easeInOutExpo: function (t) {
                  return 0 === t
                    ? 0
                    : 1 === t
                    ? 1
                    : (t /= 0.5) < 1
                    ? 0.5 * Math.pow(2, 10 * (t - 1))
                    : 0.5 * (2 - Math.pow(2, -10 * --t));
                },
                easeInCirc: function (t) {
                  return -(Math.sqrt(1 - t * t) - 1);
                },
                easeOutCirc: function (t) {
                  return Math.sqrt(1 - Math.pow(t - 1, 2));
                },
                easeInOutCirc: function (t) {
                  return (t /= 0.5) < 1
                    ? -0.5 * (Math.sqrt(1 - t * t) - 1)
                    : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
                },
                easeOutBounce: function (t) {
                  return t < 1 / 2.75
                    ? 7.5625 * t * t
                    : t < 2 / 2.75
                    ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
                    : t < 2.5 / 2.75
                    ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
                    : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
                },
                easeInBack: function (t) {
                  return t * t * (2.70158 * t - 1.70158);
                },
                easeOutBack: function (t) {
                  return --t * t * (2.70158 * t + 1.70158) + 1;
                },
                easeInOutBack: function (t) {
                  var e = 1.70158;
                  return (t /= 0.5) < 1
                    ? t * t * ((1 + (e *= 1.525)) * t - e) * 0.5
                    : 0.5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2);
                },
                elastic: function (t) {
                  return (
                    -1 *
                      Math.pow(4, -8 * t) *
                      Math.sin(((6 * t - 1) * (2 * Math.PI)) / 2) +
                    1
                  );
                },
                swingFromTo: function (t) {
                  var e = 1.70158;
                  return (t /= 0.5) < 1
                    ? t * t * ((1 + (e *= 1.525)) * t - e) * 0.5
                    : 0.5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2);
                },
                swingFrom: function (t) {
                  return t * t * (2.70158 * t - 1.70158);
                },
                swingTo: function (t) {
                  return --t * t * (2.70158 * t + 1.70158) + 1;
                },
                bounce: function (t) {
                  return t < 1 / 2.75
                    ? 7.5625 * t * t
                    : t < 2 / 2.75
                    ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
                    : t < 2.5 / 2.75
                    ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
                    : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
                },
                bouncePast: function (t) {
                  return t < 1 / 2.75
                    ? 7.5625 * t * t
                    : t < 2 / 2.75
                    ? 2 - (7.5625 * (t -= 1.5 / 2.75) * t + 0.75)
                    : t < 2.5 / 2.75
                    ? 2 - (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375)
                    : 2 - (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
                },
                easeFromTo: function (t) {
                  return (t /= 0.5) < 1
                    ? 0.5 * Math.pow(t, 4)
                    : -0.5 * ((t -= 2) * Math.pow(t, 3) - 2);
                },
                easeFrom: function (t) {
                  return Math.pow(t, 4);
                },
                easeTo: function (t) {
                  return Math.pow(t, 0.25);
                },
              }),
                (m.setBezierFunction = function (t, e, i, s, n) {
                  var o,
                    r,
                    a,
                    l,
                    c =
                      ((o = e),
                      (r = i),
                      (a = s),
                      (l = n),
                      function (t) {
                        return _(t, o, r, a, l, 1);
                      });
                  return (
                    (c.displayName = t),
                    (c.x1 = e),
                    (c.y1 = i),
                    (c.x2 = s),
                    (c.y2 = n),
                    (m.prototype.formula[t] = c)
                  );
                }),
                (m.unsetBezierFunction = function (t) {
                  delete m.prototype.formula[t];
                }),
                ((p = new m())._filterArgs = []),
                (m.interpolate = function (t, e, i, s, n) {
                  var o = m.shallowCopy({}, t),
                    r = n || 0,
                    n = m.composeEasingObject(t, s || "linear");
                  p.set({});
                  s = p._filterArgs;
                  (s.length = 0),
                    (s[0] = o),
                    (s[1] = t),
                    (s[2] = e),
                    (s[3] = n),
                    m.applyFilter(p, "tweenCreated"),
                    m.applyFilter(p, "beforeTween");
                  n = m.tweenProps(i, o, t, e, 1, r, n);
                  return m.applyFilter(p, "afterTween"), n;
                }),
                (c = m),
                (r = /(\d|\-|\.)/),
                (a = /([^\-0-9\.]+)/g),
                (o = /[0-9.\-]+/g),
                (l = new RegExp(
                  "rgb\\(" +
                    o.source +
                    /,\s*/.source +
                    o.source +
                    /,\s*/.source +
                    o.source +
                    "\\)",
                  "g"
                )),
                (u = /^.*\(/),
                (s = /#([0-9]|[a-f]){3,6}/gi),
                (h = "VAL"),
                (e = []),
                (d = []),
                (c.prototype.filter.token = {
                  tweenCreated: function (t, e, i, s) {
                    n(t), n(e), n(i), (this._tokenData = b(t));
                  },
                  beforeTween: function (t, e, i, s) {
                    var a, l;
                    (a = s),
                      (l = this._tokenData),
                      c.each(l, function (t) {
                        var e = l[t].chunkNames,
                          i = e.length,
                          s = a[t];
                        if ("string" == typeof s)
                          for (
                            var n = s.split(" "), o = n[n.length - 1], r = 0;
                            r < i;
                            r++
                          )
                            a[e[r]] = n[r] || o;
                        else for (r = 0; r < i; r++) a[e[r]] = s;
                        delete a[t];
                      }),
                      w(t, this._tokenData),
                      w(e, this._tokenData),
                      w(i, this._tokenData);
                  },
                  afterTween: function (t, e, i, s) {
                    var r, a;
                    x(t, this._tokenData),
                      x(e, this._tokenData),
                      x(i, this._tokenData),
                      (r = s),
                      (a = this._tokenData),
                      c.each(a, function (t) {
                        var e = a[t].chunkNames,
                          i = e.length,
                          s = r[e[0]];
                        if ("string" == typeof s) {
                          for (var n = "", o = 0; o < i; o++)
                            (n += " " + r[e[o]]), delete r[e[o]];
                          r[t] = n.substr(1);
                        } else r[t] = s;
                      });
                  },
                });
            }.call(null);
          },
          {},
        ],
        2: [
          function (t, e, i) {
            var s = t("./shape"),
              n = t("./utils"),
              t = function (t, e) {
                (this._pathTemplate =
                  "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}"),
                  (this.containerAspectRatio = 1),
                  s.apply(this, arguments);
              };
            (((t.prototype = new s()).constructor = t).prototype._pathString =
              function (t) {
                var e = t.strokeWidth,
                  e =
                    50 -
                    (e =
                      t.trailWidth && t.trailWidth > t.strokeWidth
                        ? t.trailWidth
                        : e) /
                      2;
                return n.render(this._pathTemplate, {
                  radius: e,
                  "2radius": 2 * e,
                });
              }),
              (t.prototype._trailString = function (t) {
                return this._pathString(t);
              }),
              (e.exports = t);
          },
          { "./shape": 7, "./utils": 8 },
        ],
        3: [
          function (t, e, i) {
            var s = t("./shape"),
              n = t("./utils"),
              t = function (t, e) {
                (this._pathTemplate = "M 0,{center} L 100,{center}"),
                  s.apply(this, arguments);
              };
            (((t.prototype = new s()).constructor =
              t).prototype._initializeSvg = function (t, e) {
              t.setAttribute("viewBox", "0 0 100 " + e.strokeWidth),
                t.setAttribute("preserveAspectRatio", "none");
            }),
              (t.prototype._pathString = function (t) {
                return n.render(this._pathTemplate, {
                  center: t.strokeWidth / 2,
                });
              }),
              (t.prototype._trailString = function (t) {
                return this._pathString(t);
              }),
              (e.exports = t);
          },
          { "./shape": 7, "./utils": 8 },
        ],
        4: [
          function (t, e, i) {
            e.exports = {
              Line: t("./line"),
              Circle: t("./circle"),
              SemiCircle: t("./semicircle"),
              Path: t("./path"),
              Shape: t("./shape"),
              utils: t("./utils"),
            };
          },
          {
            "./circle": 2,
            "./line": 3,
            "./path": 5,
            "./semicircle": 6,
            "./shape": 7,
            "./utils": 8,
          },
        ],
        5: [
          function (t, e, i) {
            var a = t("shifty"),
              l = t("./utils"),
              s = {
                easeIn: "easeInCubic",
                easeOut: "easeOutCubic",
                easeInOut: "easeInOutCubic",
              },
              t = function t(e, i) {
                if (!(this instanceof t))
                  throw new Error("Constructor was called without new keyword");
                (i = l.extend(
                  {
                    duration: 800,
                    easing: "linear",
                    from: {},
                    to: {},
                    step: function () {},
                  },
                  i
                )),
                  (e = l.isString(e) ? document.querySelector(e) : e),
                  (this.path = e),
                  (this._opts = i),
                  (this._tweenable = null);
                i = this.path.getTotalLength();
                (this.path.style.strokeDasharray = i + " " + i), this.set(0);
              };
            (t.prototype.value = function () {
              var t = this._getComputedDashOffset(),
                e = this.path.getTotalLength();
              return parseFloat((1 - t / e).toFixed(6), 10);
            }),
              (t.prototype.set = function (t) {
                this.stop(),
                  (this.path.style.strokeDashoffset =
                    this._progressToOffset(t));
                var e,
                  i = this._opts.step;
                l.isFunction(i) &&
                  ((e = this._easing(this._opts.easing)),
                  i(
                    this._calculateTo(t, e),
                    this._opts.shape || this,
                    this._opts.attachment
                  ));
              }),
              (t.prototype.stop = function () {
                this._stopTween(),
                  (this.path.style.strokeDashoffset =
                    this._getComputedDashOffset());
              }),
              (t.prototype.animate = function (t, i, e) {
                (i = i || {}), l.isFunction(i) && ((e = i), (i = {}));
                var s = l.extend({}, i),
                  n = l.extend({}, this._opts);
                i = l.extend(n, i);
                var o = this._easing(i.easing),
                  n = this._resolveFromAndTo(t, o, s);
                this.stop(), this.path.getBoundingClientRect();
                var s = this._getComputedDashOffset(),
                  t = this._progressToOffset(t),
                  r = this;
                (this._tweenable = new a()),
                  this._tweenable.tween({
                    from: l.extend({ offset: s }, n.from),
                    to: l.extend({ offset: t }, n.to),
                    duration: i.duration,
                    easing: o,
                    step: function (t) {
                      r.path.style.strokeDashoffset = t.offset;
                      var e = i.shape || r;
                      i.step(t, e, i.attachment);
                    },
                    finish: function (t) {
                      l.isFunction(e) && e();
                    },
                  });
              }),
              (t.prototype._getComputedDashOffset = function () {
                var t = window.getComputedStyle(this.path, null);
                return parseFloat(t.getPropertyValue("stroke-dashoffset"), 10);
              }),
              (t.prototype._progressToOffset = function (t) {
                var e = this.path.getTotalLength();
                return e - t * e;
              }),
              (t.prototype._resolveFromAndTo = function (t, e, i) {
                return i.from && i.to
                  ? { from: i.from, to: i.to }
                  : {
                      from: this._calculateFrom(e),
                      to: this._calculateTo(t, e),
                    };
              }),
              (t.prototype._calculateFrom = function (t) {
                return a.interpolate(
                  this._opts.from,
                  this._opts.to,
                  this.value(),
                  t
                );
              }),
              (t.prototype._calculateTo = function (t, e) {
                return a.interpolate(this._opts.from, this._opts.to, t, e);
              }),
              (t.prototype._stopTween = function () {
                null !== this._tweenable &&
                  (this._tweenable.stop(), (this._tweenable = null));
              }),
              (t.prototype._easing = function (t) {
                return s.hasOwnProperty(t) ? s[t] : t;
              }),
              (e.exports = t);
          },
          { "./utils": 8, shifty: 1 },
        ],
        6: [
          function (t, e, i) {
            var s = t("./shape"),
              n = t("./circle"),
              o = t("./utils"),
              t = function (t, e) {
                (this._pathTemplate =
                  "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0"),
                  (this.containerAspectRatio = 2),
                  s.apply(this, arguments);
              };
            (((t.prototype = new s()).constructor =
              t).prototype._initializeSvg = function (t, e) {
              t.setAttribute("viewBox", "0 0 100 50");
            }),
              (t.prototype._initializeTextContainer = function (t, e, i) {
                t.text.style &&
                  ((i.style.top = "auto"),
                  (i.style.bottom = "0"),
                  t.text.alignToBottom
                    ? o.setStyle(i, "transform", "translate(-50%, 0)")
                    : o.setStyle(i, "transform", "translate(-50%, 50%)"));
              }),
              (t.prototype._pathString = n.prototype._pathString),
              (t.prototype._trailString = n.prototype._trailString),
              (e.exports = t);
          },
          { "./circle": 2, "./shape": 7, "./utils": 8 },
        ],
        7: [
          function (t, e, i) {
            var o = t("./path"),
              r = t("./utils"),
              s = "Object is destroyed",
              t = function t(e, i) {
                if (!(this instanceof t))
                  throw new Error("Constructor was called without new keyword");
                if (0 !== arguments.length) {
                  (this._opts = r.extend(
                    {
                      color: "#555",
                      strokeWidth: 1,
                      trailColor: null,
                      trailWidth: null,
                      fill: null,
                      text: {
                        style: {
                          color: null,
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          padding: 0,
                          margin: 0,
                          transform: {
                            prefix: !0,
                            value: "translate(-50%, -50%)",
                          },
                        },
                        autoStyleContainer: !0,
                        alignToBottom: !0,
                        value: null,
                        className: "progressbar-text",
                      },
                      svgStyle: { display: "block", width: "100%" },
                      warnings: !1,
                    },
                    i,
                    !0
                  )),
                    r.isObject(i) &&
                      void 0 !== i.svgStyle &&
                      (this._opts.svgStyle = i.svgStyle),
                    r.isObject(i) &&
                      r.isObject(i.text) &&
                      void 0 !== i.text.style &&
                      (this._opts.text.style = i.text.style);
                  var s = this._createSvgView(this._opts),
                    n = r.isString(e) ? document.querySelector(e) : e;
                  if (!n) throw new Error("Container does not exist: " + e);
                  (this._container = n),
                    this._container.appendChild(s.svg),
                    this._opts.warnings &&
                      this._warnContainerAspectRatio(this._container),
                    this._opts.svgStyle &&
                      r.setStyles(s.svg, this._opts.svgStyle),
                    (this.svg = s.svg),
                    (this.path = s.path),
                    (this.trail = s.trail),
                    (this.text = null);
                  n = r.extend({ attachment: void 0, shape: this }, this._opts);
                  (this._progressPath = new o(s.path, n)),
                    r.isObject(this._opts.text) &&
                      null !== this._opts.text.value &&
                      this.setText(this._opts.text.value);
                }
              };
            (t.prototype.animate = function (t, e, i) {
              if (null === this._progressPath) throw new Error(s);
              this._progressPath.animate(t, e, i);
            }),
              (t.prototype.stop = function () {
                if (null === this._progressPath) throw new Error(s);
                void 0 !== this._progressPath && this._progressPath.stop();
              }),
              (t.prototype.destroy = function () {
                if (null === this._progressPath) throw new Error(s);
                this.stop(),
                  this.svg.parentNode.removeChild(this.svg),
                  (this.svg = null),
                  (this.path = null),
                  (this.trail = null),
                  (this._progressPath = null) !== this.text &&
                    (this.text.parentNode.removeChild(this.text),
                    (this.text = null));
              }),
              (t.prototype.set = function (t) {
                if (null === this._progressPath) throw new Error(s);
                this._progressPath.set(t);
              }),
              (t.prototype.value = function () {
                if (null === this._progressPath) throw new Error(s);
                return void 0 === this._progressPath
                  ? 0
                  : this._progressPath.value();
              }),
              (t.prototype.setText = function (t) {
                if (null === this._progressPath) throw new Error(s);
                null === this.text &&
                  ((this.text = this._createTextContainer(
                    this._opts,
                    this._container
                  )),
                  this._container.appendChild(this.text)),
                  r.isObject(t)
                    ? (r.removeChildren(this.text), this.text.appendChild(t))
                    : (this.text.innerHTML = t);
              }),
              (t.prototype._createSvgView = function (t) {
                var e = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "svg"
                );
                this._initializeSvg(e, t);
                var i = null;
                (t.trailColor || t.trailWidth) &&
                  ((i = this._createTrail(t)), e.appendChild(i));
                t = this._createPath(t);
                return e.appendChild(t), { svg: e, path: t, trail: i };
              }),
              (t.prototype._initializeSvg = function (t, e) {
                t.setAttribute("viewBox", "0 0 100 100");
              }),
              (t.prototype._createPath = function (t) {
                var e = this._pathString(t);
                return this._createPathElement(e, t);
              }),
              (t.prototype._createTrail = function (t) {
                var e = this._trailString(t),
                  t = r.extend({}, t);
                return (
                  t.trailColor || (t.trailColor = "#eee"),
                  t.trailWidth || (t.trailWidth = t.strokeWidth),
                  (t.color = t.trailColor),
                  (t.strokeWidth = t.trailWidth),
                  (t.fill = null),
                  this._createPathElement(e, t)
                );
              }),
              (t.prototype._createPathElement = function (t, e) {
                var i = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path"
                );
                return (
                  i.setAttribute("d", t),
                  i.setAttribute("stroke", e.color),
                  i.setAttribute("stroke-width", e.strokeWidth),
                  e.fill
                    ? i.setAttribute("fill", e.fill)
                    : i.setAttribute("fill-opacity", "0"),
                  i
                );
              }),
              (t.prototype._createTextContainer = function (t, e) {
                var i = document.createElement("div");
                i.className = t.text.className;
                var s = t.text.style;
                return (
                  s &&
                    (t.text.autoStyleContainer &&
                      (e.style.position = "relative"),
                    r.setStyles(i, s),
                    s.color || (i.style.color = t.color)),
                  this._initializeTextContainer(t, e, i),
                  i
                );
              }),
              (t.prototype._initializeTextContainer = function (t, e, i) {}),
              (t.prototype._pathString = function (t) {
                throw new Error("Override this function for each progress bar");
              }),
              (t.prototype._trailString = function (t) {
                throw new Error("Override this function for each progress bar");
              }),
              (t.prototype._warnContainerAspectRatio = function (t) {
                var e, i, s;
                this.containerAspectRatio &&
                  ((e = window.getComputedStyle(t, null)),
                  (i = parseFloat(e.getPropertyValue("width"), 10)),
                  (s = parseFloat(e.getPropertyValue("height"), 10)),
                  r.floatEquals(this.containerAspectRatio, i / s) ||
                    (console.warn(
                      "Incorrect aspect ratio of container",
                      "#" + t.id,
                      "detected:",
                      e.getPropertyValue("width") + "(width)",
                      "/",
                      e.getPropertyValue("height") + "(height)",
                      "=",
                      i / s
                    ),
                    console.warn(
                      "Aspect ratio of should be",
                      this.containerAspectRatio
                    )));
              }),
              (e.exports = t);
          },
          { "./path": 5, "./utils": 8 },
        ],
        8: [
          function (t, e, i) {
            function s(t, e, i) {
              for (var s = t.style, n = 0; n < r.length; ++n)
                s[r[n] + o(e)] = i;
              s[e] = i;
            }
            function o(t) {
              return t.charAt(0).toUpperCase() + t.slice(1);
            }
            function a(t) {
              return (
                "[object Array]" !== Object.prototype.toString.call(t) &&
                "object" == typeof t &&
                !!t
              );
            }
            function n(t, e) {
              for (var i in t) t.hasOwnProperty(i) && e(t[i], i);
            }
            var r = "Webkit Moz O ms".split(" ");
            e.exports = {
              extend: function t(e, i, s) {
                for (var n in ((e = e || {}), (s = s || !1), (i = i || {}))) {
                  var o, r;
                  i.hasOwnProperty(n) &&
                    ((o = e[n]),
                    (r = i[n]),
                    s && a(o) && a(r) ? (e[n] = t(o, r, s)) : (e[n] = r));
                }
                return e;
              },
              render: function (t, e) {
                var i,
                  s,
                  n,
                  o = t;
                for (i in e)
                  e.hasOwnProperty(i) &&
                    ((s = e[i]),
                    (n = new RegExp("\\{" + i + "\\}", "g")),
                    (o = o.replace(n, s)));
                return o;
              },
              setStyle: s,
              setStyles: function (i, t) {
                n(t, function (t, e) {
                  null != t &&
                    (a(t) && !0 === t.prefix
                      ? s(i, e, t.value)
                      : (i.style[e] = t));
                });
              },
              capitalize: o,
              isString: function (t) {
                return "string" == typeof t || t instanceof String;
              },
              isFunction: function (t) {
                return "function" == typeof t;
              },
              isObject: a,
              forEachObject: n,
              floatEquals: function (t, e) {
                return Math.abs(t - e) < 0.001;
              },
              removeChildren: function (t) {
                for (; t.firstChild; ) t.removeChild(t.firstChild);
              },
            };
          },
          {},
        ],
      },
      {},
      [4]
    )(4);
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define([], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.Rellax = e());
  })("undefined" != typeof window ? window : global, function () {
    var h = function (t, e) {
      var _ = Object.create(h.prototype),
        o = 0,
        T = 0,
        r = 0,
        S = 0,
        C = [],
        k = !0,
        i =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          function (t) {
            return setTimeout(t, 1e3 / 60);
          },
        s = null,
        n = !1;
      try {
        var a = Object.defineProperty({}, "passive", {
          get: function () {
            n = !0;
          },
        });
        window.addEventListener("testPassive", null, a),
          window.removeEventListener("testPassive", null, a);
      } catch (t) {}
      var l =
          window.cancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          clearTimeout,
        c =
          window.transformProp ||
          (function () {
            var t = document.createElement("div");
            if (null === t.style.transform) {
              var e,
                i = ["Webkit", "Moz", "ms"];
              for (e in i)
                if (void 0 !== t.style[i[e] + "Transform"])
                  return i[e] + "Transform";
            }
            return "transform";
          })();
      if (
        ((_.options = {
          speed: -2,
          verticalSpeed: null,
          horizontalSpeed: null,
          breakpoints: [576, 768, 1201],
          center: !1,
          wrapper: null,
          relativeToWrapper: !1,
          round: !0,
          vertical: !0,
          horizontal: !1,
          verticalScrollAxis: "y",
          horizontalScrollAxis: "x",
          callback: function () {},
        }),
        e &&
          Object.keys(e).forEach(function (t) {
            _.options[t] = e[t];
          }),
        e &&
          e.breakpoints &&
          (function () {
            if (
              3 === _.options.breakpoints.length &&
              Array.isArray(_.options.breakpoints)
            ) {
              var e,
                i = !0,
                s = !0;
              if (
                (_.options.breakpoints.forEach(function (t) {
                  "number" != typeof t && (s = !1),
                    null !== e && t < e && (i = !1),
                    (e = t);
                }),
                i && s)
              )
                return;
            }
            (_.options.breakpoints = [576, 768, 1201]),
              console.warn(
                "Rellax: You must pass an array of 3 numbers in ascending order to the breakpoints option. Defaults reverted"
              );
          })(),
        0 <
          (a =
            "string" == typeof (t = t || ".rellax")
              ? document.querySelectorAll(t)
              : [t]).length)
      ) {
        if (((_.elems = a), _.options.wrapper && !_.options.wrapper.nodeType)) {
          if (!(a = document.querySelector(_.options.wrapper)))
            return void console.warn(
              "Rellax: The wrapper you're trying to use doesn't exist."
            );
          _.options.wrapper = a;
        }
        var A,
          E = function () {
            for (var t = 0; t < C.length; t++)
              _.elems[t].style.cssText = C[t].style;
            for (
              C = [],
                T = window.innerHeight,
                S = window.innerWidth,
                t = _.options.breakpoints,
                A =
                  S < t[0]
                    ? "xs"
                    : S >= t[0] && S < t[1]
                    ? "sm"
                    : S >= t[1] && S < t[2]
                    ? "md"
                    : "lg",
                M(),
                t = 0;
              t < _.elems.length;
              t++
            ) {
              var e = void 0,
                i = _.elems[t],
                s = i.getAttribute("data-rellax-percentage"),
                n = i.getAttribute("data-rellax-speed"),
                o = i.getAttribute("data-rellax-xs-speed"),
                r = i.getAttribute("data-rellax-mobile-speed"),
                a = i.getAttribute("data-rellax-tablet-speed"),
                l = i.getAttribute("data-rellax-desktop-speed"),
                c = i.getAttribute("data-rellax-vertical-speed"),
                u = i.getAttribute("data-rellax-horizontal-speed"),
                h = i.getAttribute("data-rellax-vertical-scroll-axis"),
                d = i.getAttribute("data-rellax-horizontal-scroll-axis"),
                p = i.getAttribute("data-rellax-zindex") || 0,
                m = i.getAttribute("data-rellax-min"),
                g = i.getAttribute("data-rellax-max"),
                f = i.getAttribute("data-rellax-min-x"),
                y = i.getAttribute("data-rellax-max-x"),
                v = i.getAttribute("data-rellax-min-y"),
                b = i.getAttribute("data-rellax-max-y"),
                w = !0;
              o || r || a || l
                ? (e = { xs: o, sm: r, md: a, lg: l })
                : (w = !1),
                (o = _.options.wrapper
                  ? _.options.wrapper.scrollTop
                  : window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop),
                _.options.relativeToWrapper &&
                  (o =
                    (window.pageYOffset ||
                      document.documentElement.scrollTop ||
                      document.body.scrollTop) - _.options.wrapper.offsetTop);
              var x = _.options.vertical && (s || _.options.center) ? o : 0,
                $ =
                  _.options.horizontal && (s || _.options.center)
                    ? _.options.wrapper
                      ? _.options.wrapper.scrollLeft
                      : window.pageXOffset ||
                        document.documentElement.scrollLeft ||
                        document.body.scrollLeft
                    : 0,
                o = x + i.getBoundingClientRect().top,
                r = i.clientHeight || i.offsetHeight || i.scrollHeight,
                a = $ + i.getBoundingClientRect().left,
                l = i.clientWidth || i.offsetWidth || i.scrollWidth,
                x = s || (x - o + T) / (r + T),
                s = s || ($ - a + S) / (l + S);
              _.options.center && (x = s = 0.5),
                (e = w && null !== e[A] ? Number(e[A]) : n || _.options.speed),
                (c = c || _.options.verticalSpeed),
                (u = u || _.options.horizontalSpeed),
                (h = h || _.options.verticalScrollAxis),
                (d = d || _.options.horizontalScrollAxis),
                (n = I(s, x, e, c, u)),
                (i = i.style.cssText),
                (w = ""),
                (s = /transform\s*:/i.exec(i)) &&
                  (w = (s = (w = i.slice(s.index)).indexOf(";"))
                    ? " " + w.slice(11, s).replace(/\s/g, "")
                    : " " + w.slice(11).replace(/\s/g, "")),
                C.push({
                  baseX: n.x,
                  baseY: n.y,
                  top: o,
                  left: a,
                  height: r,
                  width: l,
                  speed: e,
                  verticalSpeed: c,
                  horizontalSpeed: u,
                  verticalScrollAxis: h,
                  horizontalScrollAxis: d,
                  style: i,
                  transform: w,
                  zindex: p,
                  min: m,
                  max: g,
                  minX: f,
                  maxX: y,
                  minY: v,
                  maxY: b,
                });
            }
            O(), k && (window.addEventListener("resize", E), (k = !1), P());
          },
          M = function () {
            var t = o,
              e = r;
            return (
              (o = _.options.wrapper
                ? _.options.wrapper.scrollTop
                : (
                    document.documentElement ||
                    document.body.parentNode ||
                    document.body
                  ).scrollTop || window.pageYOffset),
              (r = _.options.wrapper
                ? _.options.wrapper.scrollLeft
                : (
                    document.documentElement ||
                    document.body.parentNode ||
                    document.body
                  ).scrollLeft || window.pageXOffset),
              !!(
                (t !=
                  (o = _.options.relativeToWrapper
                    ? ((
                        document.documentElement ||
                        document.body.parentNode ||
                        document.body
                      ).scrollTop || window.pageYOffset) -
                      _.options.wrapper.offsetTop
                    : o) &&
                  _.options.vertical) ||
                (e != r && _.options.horizontal)
              )
            );
          },
          I = function (t, e, i, s, n) {
            var o = {};
            return (
              (t = 100 * (n || i) * (1 - t)),
              (e = 100 * (s || i) * (1 - e)),
              (o.x = _.options.round
                ? Math.round(t)
                : Math.round(100 * t) / 100),
              (o.y = _.options.round
                ? Math.round(e)
                : Math.round(100 * e) / 100),
              o
            );
          },
          u = function () {
            window.removeEventListener("resize", u),
              window.removeEventListener("orientationchange", u),
              (_.options.wrapper || window).removeEventListener("scroll", u),
              (_.options.wrapper || document).removeEventListener(
                "touchmove",
                u
              ),
              (s = i(P));
          },
          P = function () {
            M() && !1 === k
              ? (O(), (s = i(P)))
              : ((s = null),
                window.addEventListener("resize", u),
                window.addEventListener("orientationchange", u),
                (_.options.wrapper || window).addEventListener(
                  "scroll",
                  u,
                  !!n && { passive: !0 }
                ),
                (_.options.wrapper || document).addEventListener(
                  "touchmove",
                  u,
                  !!n && { passive: !0 }
                ));
          },
          O = function () {
            for (var t = 0; t < _.elems.length; t++) {
              var e = C[t].verticalScrollAxis.toLowerCase(),
                i = C[t].horizontalScrollAxis.toLowerCase(),
                s = -1 != e.indexOf("x") ? o : 0,
                e = -1 != e.indexOf("y") ? o : 0,
                n = -1 != i.indexOf("x") ? r : 0,
                i = -1 != i.indexOf("y") ? r : 0;
              (i =
                (s = I(
                  (s + n - C[t].left + S) / (C[t].width + S),
                  (e + i - C[t].top + T) / (C[t].height + T),
                  C[t].speed,
                  C[t].verticalSpeed,
                  C[t].horizontalSpeed
                )).y - C[t].baseY),
                (e = s.x - C[t].baseX),
                null !== C[t].min &&
                  (_.options.vertical &&
                    !_.options.horizontal &&
                    (i = i <= C[t].min ? C[t].min : i),
                  _.options.horizontal &&
                    !_.options.vertical &&
                    (e = e <= C[t].min ? C[t].min : e)),
                null != C[t].minY && (i = i <= C[t].minY ? C[t].minY : i),
                null != C[t].minX && (e = e <= C[t].minX ? C[t].minX : e),
                null !== C[t].max &&
                  (_.options.vertical &&
                    !_.options.horizontal &&
                    (i = i >= C[t].max ? C[t].max : i),
                  _.options.horizontal &&
                    !_.options.vertical &&
                    (e = e >= C[t].max ? C[t].max : e)),
                null != C[t].maxY && (i = i >= C[t].maxY ? C[t].maxY : i),
                null != C[t].maxX && (e = e >= C[t].maxX ? C[t].maxX : e),
                (_.elems[t].style[c] =
                  "translate3d(" +
                  (_.options.horizontal ? e : "0") +
                  "px," +
                  (_.options.vertical ? i : "0") +
                  "px," +
                  C[t].zindex +
                  "px) " +
                  C[t].transform);
            }
            _.options.callback(s);
          };
        return (
          (_.destroy = function () {
            for (var t = 0; t < _.elems.length; t++)
              _.elems[t].style.cssText = C[t].style;
            k || (window.removeEventListener("resize", E), (k = !0)),
              l(s),
              (s = null);
          }),
          E(),
          (_.refresh = E),
          _
        );
      }
      console.warn("Rellax: The elements you're trying to select don't exist.");
    };
    return h;
  });
var $jscomp = $jscomp || {};
($jscomp.scope = {}),
  ($jscomp.arrayIteratorImpl = function (t) {
    var e = 0;
    return function () {
      return e < t.length ? { done: !1, value: t[e++] } : { done: !0 };
    };
  }),
  ($jscomp.arrayIterator = function (t) {
    return { next: $jscomp.arrayIteratorImpl(t) };
  }),
  ($jscomp.ASSUME_ES5 = !1),
  ($jscomp.ASSUME_NO_NATIVE_MAP = !1),
  ($jscomp.ASSUME_NO_NATIVE_SET = !1),
  ($jscomp.SIMPLE_FROUND_POLYFILL = !1),
  ($jscomp.ISOLATE_POLYFILLS = !1),
  ($jscomp.defineProperty =
    $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
      ? Object.defineProperty
      : function (t, e, i) {
          return (
            t == Array.prototype || t == Object.prototype || (t[e] = i.value), t
          );
        }),
  ($jscomp.getGlobal = function (t) {
    t = [
      "object" == typeof globalThis && globalThis,
      t,
      "object" == typeof window && window,
      "object" == typeof self && self,
      "object" == typeof global && global,
    ];
    for (var e = 0; e < t.length; ++e) {
      var i = t[e];
      if (i && i.Math == Math) return i;
    }
    throw Error("Cannot find global object");
  }),
  ($jscomp.global = $jscomp.getGlobal(this)),
  ($jscomp.IS_SYMBOL_NATIVE =
    "function" == typeof Symbol && "symbol" == typeof Symbol("x")),
  ($jscomp.TRUST_ES6_POLYFILLS =
    !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE),
  ($jscomp.polyfills = {}),
  ($jscomp.propertyToPolyfillSymbol = {}),
  ($jscomp.POLYFILL_PREFIX = "$jscp$");
var $jscomp$lookupPolyfilledValue = function (t, e) {
  var i = $jscomp.propertyToPolyfillSymbol[e];
  return null != i && void 0 !== (i = t[i]) ? i : t[e];
};
($jscomp.polyfill = function (t, e, i, s) {
  e &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(t, e, i, s)
      : $jscomp.polyfillUnisolated(t, e, i, s));
}),
  ($jscomp.polyfillUnisolated = function (t, e, i, s) {
    for (i = $jscomp.global, t = t.split("."), s = 0; s < t.length - 1; s++) {
      var n = t[s];
      n in i || (i[n] = {}), (i = i[n]);
    }
    (e = e((s = i[(t = t[t.length - 1])]))) != s &&
      null != e &&
      $jscomp.defineProperty(i, t, {
        configurable: !0,
        writable: !0,
        value: e,
      });
  }),
  ($jscomp.polyfillIsolated = function (t, e, i, s) {
    var n = t.split(".");
    (t = 1 === n.length),
      (s = n[0]),
      (s = !t && s in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global);
    for (var o = 0; o < n.length - 1; o++) {
      var r = n[o];
      r in s || (s[r] = {}), (s = s[r]);
    }
    (n = n[n.length - 1]),
      null !=
        (e = e((i = $jscomp.IS_SYMBOL_NATIVE && "es6" === i ? s[n] : null))) &&
        (t
          ? $jscomp.defineProperty($jscomp.polyfills, n, {
              configurable: !0,
              writable: !0,
              value: e,
            })
          : e !== i &&
            (($jscomp.propertyToPolyfillSymbol[n] = $jscomp.IS_SYMBOL_NATIVE
              ? $jscomp.global.Symbol(n)
              : $jscomp.POLYFILL_PREFIX + n),
            (n = $jscomp.propertyToPolyfillSymbol[n]),
            $jscomp.defineProperty(s, n, {
              configurable: !0,
              writable: !0,
              value: e,
            })));
  }),
  ($jscomp.initSymbol = function () {}),
  $jscomp.polyfill(
    "Symbol",
    function (t) {
      if (t) return t;
      function e(t, e) {
        (this.$jscomp$symbol$id_ = t),
          $jscomp.defineProperty(this, "description", {
            configurable: !0,
            writable: !0,
            value: e,
          });
      }
      e.prototype.toString = function () {
        return this.$jscomp$symbol$id_;
      };
      var i = 0,
        s = function (t) {
          if (this instanceof s)
            throw new TypeError("Symbol is not a constructor");
          return new e("jscomp_symbol_" + (t || "") + "_" + i++, t);
        };
      return s;
    },
    "es6",
    "es3"
  ),
  ($jscomp.initSymbolIterator = function () {}),
  $jscomp.polyfill(
    "Symbol.iterator",
    function (t) {
      if (t) return t;
      t = Symbol("Symbol.iterator");
      for (
        var e =
            "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
              " "
            ),
          i = 0;
        i < e.length;
        i++
      ) {
        var s = $jscomp.global[e[i]];
        "function" == typeof s &&
          "function" != typeof s.prototype[t] &&
          $jscomp.defineProperty(s.prototype, t, {
            configurable: !0,
            writable: !0,
            value: function () {
              return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
            },
          });
      }
      return t;
    },
    "es6",
    "es3"
  ),
  ($jscomp.initSymbolAsyncIterator = function () {}),
  ($jscomp.iteratorPrototype = function (t) {
    return (
      ((t = { next: t })[Symbol.iterator] = function () {
        return this;
      }),
      t
    );
  }),
  ($jscomp.iteratorFromArray = function (e, i) {
    e instanceof String && (e += "");
    var s = 0,
      n = {
        next: function () {
          if (s < e.length) {
            var t = s++;
            return { value: i(t, e[t]), done: !1 };
          }
          return (
            (n.next = function () {
              return { done: !0, value: void 0 };
            }),
            n.next()
          );
        },
      };
    return (
      (n[Symbol.iterator] = function () {
        return n;
      }),
      n
    );
  }),
  $jscomp.polyfill(
    "Array.prototype.keys",
    function (t) {
      return (
        t ||
        function () {
          return $jscomp.iteratorFromArray(this, function (t) {
            return t;
          });
        }
      );
    },
    "es6",
    "es3"
  );
var scrollCue = (function () {
  var o,
    n,
    r,
    a = {},
    s = 0,
    l = !0,
    c = !0,
    u = !1,
    e = !1,
    i = {
      duration: 600,
      interval: -0.7,
      percentage: 0.75,
      enable: !0,
      docSlider: !1,
      pageChangeReset: !1,
    },
    a = {
      setEvents: function (t) {
        function e() {
          l &&
            (requestAnimationFrame(function () {
              (l = !0), c && (a.setQuery(), a.runQuery());
            }),
            (l = !1));
        }
        if (
          (c && !t && window.addEventListener("load", a.runQuery),
          window.addEventListener("scroll", e),
          u)
        ) {
          t = docSlider.getElements().pages;
          for (var i = 0; i < t.length; i++)
            t[i].addEventListener("scroll", function (t) {
              return (
                docSlider.getCurrentIndex() + "" ===
                  (t = t.target.getAttribute("data-ds-index")) &&
                void (docSlider._getWheelEnable() && e())
              );
            });
        }
        window.addEventListener("resize", function () {
          0 < s && clearTimeout(s),
            (s = setTimeout(function () {
              c && (a.searchElements(), a.setQuery(), a.runQuery());
            }, 200));
        });
      },
      setOptions: function (e, i) {
        var s = {};
        if (void 0 !== e)
          return (
            Object.keys(e).forEach(function (t) {
              "[object Object]" === Object.prototype.toString.call(e[t])
                ? (s[t] = a.setOptions(e[t], i[t]))
                : ((s[t] = e[t]),
                  void 0 !== i && void 0 !== i[t] && (s[t] = i[t]));
            }),
            s
          );
      },
      searchElements: function () {
        o = [];
        for (
          var t = document.querySelectorAll("[data-cues]:not([data-disabled])"),
            e = 0;
          e < t.length;
          e++
        ) {
          for (var i = t[e], s = 0; s < i.children.length; s++) {
            var n = i.children[s];
            a.setAttrPtoC(n, "data-cue", i, "data-cues", ""),
              a.setAttrPtoC(n, "data-duration", i, "data-duration", !1),
              a.setAttrPtoC(n, "data-interval", i, "data-interval", !1),
              a.setAttrPtoC(n, "data-sort", i, "data-sort", !1),
              a.setAttrPtoC(n, "data-addClass", i, "data-addClass", !1),
              a.setAttrPtoC(n, "data-group", i, "data-group", !1),
              a.setAttrPtoC(n, "data-delay", i, "data-delay", !1);
          }
          i.setAttribute("data-disabled", "true");
        }
        for (
          t = document.querySelectorAll('[data-cue]:not([data-show="true"])'),
            e = 0;
          e < t.length;
          e++
        )
          (i = t[e]),
            o.push({
              elm: i,
              cue: a.getAttr(i, "data-cue", "fadeIn"),
              duration: Number(a.getAttr(i, "data-duration", r.duration)),
              interval: Number(a.getAttr(i, "data-interval", r.interval)),
              order: a.getOrderNumber(i),
              sort: a.getAttr(i, "data-sort", null),
              addClass: a.getAttr(i, "data-addClass", null),
              group: a.getAttr(i, "data-group", null),
              delay: Number(a.getAttr(i, "data-delay", 0)),
            });
        if (u)
          for (t = docSlider.getElements().pages.length, e = 0; e < t; e++)
            for (
              i = document.querySelectorAll(
                '[data-ds-index="' + e + '"] [data-cue]:not([data-scpage])'
              ),
                s = 0;
              s < i.length;
              s++
            )
              i[s].setAttribute("data-scpage", e);
      },
      sortElements: function () {
        for (
          var t = arguments[0],
            o = [].slice.call(arguments).slice(1),
            e = { $jscomp$loop$prop$i$4: 0 };
          e.$jscomp$loop$prop$i$4 < o.length;
          (e = { $jscomp$loop$prop$i$4: e.$jscomp$loop$prop$i$4 })
            .$jscomp$loop$prop$i$4++
        )
          t.sort(
            (function (n) {
              return function (t, e) {
                var i =
                    void 0 === o[n.$jscomp$loop$prop$i$4][1] ||
                    o[n.$jscomp$loop$prop$i$4][1],
                  s = o[n.$jscomp$loop$prop$i$4][0];
                return t[s] > e[s]
                  ? i
                    ? 1
                    : -1
                  : t[s] < e[s]
                  ? i
                    ? -1
                    : 1
                  : 0;
              };
            })(e)
          );
      },
      randElements: function (t) {
        for (var e = t.length - 1; 0 < e; e--) {
          var i = Math.floor(Math.random() * (e + 1)),
            s = t[e];
          (t[e] = t[i]), (t[i] = s);
        }
        return t;
      },
      setDurationValue: function (t, e, i) {
        return void 0 === e
          ? t
          : ((e = e.duration),
            (t = -1 === (i + "").indexOf(".") ? t + e + i : t + e + e * i) < 0
              ? 0
              : t);
      },
      getOrderNumber: function (t) {
        return t.hasAttribute("data-order")
          ? 0 <= (t = Number(t.getAttribute("data-order")))
            ? t
            : Math.pow(2, 53) - 1 + t
          : Math.pow(2, 52) - 1;
      },
      setAttrPtoC: function (t, e, i, s, n) {
        i.hasAttribute(s)
          ? t.hasAttribute(e) || t.setAttribute(e, i.getAttribute(s))
          : !1 !== n && t.setAttribute(e, n);
      },
      getAttr: function (t, e, i) {
        return t.hasAttribute(e) ? t.getAttribute(e) : i;
      },
      getOffsetTop: function (t) {
        return (
          t.getBoundingClientRect().top +
          (window.pageYOffset || document.documentElement.scrollTop)
        );
      },
      setClassNames: function (t, e) {
        if (e) {
          e = e.split(" ");
          for (var i = 0; i < e.length; i++) t.classList.add(e[i]);
        }
      },
      setQuery: function () {
        n = {};
        for (var t = 0; t < o.length; t++) {
          var e = o[t],
            i = e.group || "$" + a.getOffsetTop(e.elm);
          if (!e.elm.hasAttribute("data-show")) {
            if (u) {
              var s = e.elm.getAttribute("data-scpage");
              if (s !== docSlider.getCurrentIndex() + "" && null !== s)
                continue;
            }
            void 0 === n[i] && (n[i] = []), n[i].push(e);
          }
        }
      },
      runQuery: function () {
        for (
          var t = Object.keys(n), e = {}, i = 0;
          i < t.length;
          e = {
            $jscomp$loop$prop$elms$6: e.$jscomp$loop$prop$elms$6,
            $jscomp$loop$prop$interval$7: e.$jscomp$loop$prop$interval$7,
          },
            i++
        )
          if (
            ((e.$jscomp$loop$prop$elms$6 = n[t[i]]),
            a.isElementIn(e.$jscomp$loop$prop$elms$6[0].elm))
          ) {
            "reverse" === e.$jscomp$loop$prop$elms$6[0].sort
              ? e.$jscomp$loop$prop$elms$6.reverse()
              : "random" === e.$jscomp$loop$prop$elms$6[0].sort &&
                a.randElements(e.$jscomp$loop$prop$elms$6),
              a.sortElements(e.$jscomp$loop$prop$elms$6, ["order"]);
            for (
              var s = (e.$jscomp$loop$prop$interval$7 = 0);
              s < e.$jscomp$loop$prop$elms$6.length;
              s++
            )
              !(function (e) {
                return function (t) {
                  e.$jscomp$loop$prop$elms$6[t].elm.setAttribute(
                    "data-show",
                    "true"
                  ),
                    a.setClassNames(
                      e.$jscomp$loop$prop$elms$6[t].elm,
                      e.$jscomp$loop$prop$elms$6[t].addClass
                    ),
                    (e.$jscomp$loop$prop$interval$7 = a.setDurationValue(
                      e.$jscomp$loop$prop$interval$7,
                      e.$jscomp$loop$prop$elms$6[t - 1],
                      e.$jscomp$loop$prop$elms$6[t].interval
                    )),
                    (e.$jscomp$loop$prop$elms$6[t].elm.style.animationName =
                      e.$jscomp$loop$prop$elms$6[t].cue),
                    (e.$jscomp$loop$prop$elms$6[t].elm.style.animationDuration =
                      e.$jscomp$loop$prop$elms$6[t].duration + "ms"),
                    (e.$jscomp$loop$prop$elms$6[
                      t
                    ].elm.style.animationTimingFunction = "ease"),
                    (e.$jscomp$loop$prop$elms$6[t].elm.style.animationDelay =
                      e.$jscomp$loop$prop$interval$7 +
                      e.$jscomp$loop$prop$elms$6[t].delay +
                      "ms"),
                    (e.$jscomp$loop$prop$elms$6[
                      t
                    ].elm.style.animationDirection = "normal"),
                    (e.$jscomp$loop$prop$elms$6[t].elm.style.animationFillMode =
                      "both");
                };
              })(e)(s);
            delete n[t[i]];
          }
      },
      isElementIn: function (t) {
        var e = t.hasAttribute("data-scpage")
          ? a.isScrollEndWithDocSlider
          : a.isScrollEnd;
        return (
          window.pageYOffset >
            a.getOffsetTop(t) - window.innerHeight * r.percentage || e()
        );
      },
      isScrollEnd: function () {
        var t = window.document.documentElement;
        return (
          (window.document.body.scrollTop || t.scrollTop) >=
          t.scrollHeight - t.clientHeight
        );
      },
      isScrollEndWithDocSlider: function () {
        var t = docSlider.getCurrentPage();
        return t.scrollTop >= t.scrollHeight - t.clientHeight;
      },
    };
  return {
    init: function (t) {
      (r = a.setOptions(i, t)),
        (c = r.enable),
        (u = r.docSlider),
        (e = r.pageChangeReset),
        u || (a.setEvents(), a.searchElements(), a.setQuery());
    },
    update: function () {
      c && (a.searchElements(), a.setQuery(), a.runQuery());
    },
    enable: function (t) {
      (c = void 0 === t ? !c : t), scrollCue.update();
    },
    _hasDocSlider: function () {
      return u;
    },
    _hasPageChangeReset: function () {
      return e;
    },
    _initWithDocSlider: function (t) {
      a.setEvents(t), a.searchElements(), a.setQuery();
    },
    _updateWithDocSlider: function () {
      c && (a.setQuery(), a.runQuery());
    },
    _searchElements: function () {
      a.searchElements();
    },
  };
})();
!(function (t) {
  "function" == typeof define && define.amd
    ? define(["jquery"], t)
    : "undefined" != typeof exports
    ? (module.exports = t(require("jquery")))
    : t(jQuery);
})(function ($) {
  var ShowMoreItems = window.ShowMoreItems || {},
    ShowMoreItems = function (t, e) {
      $(t).addClass("showMoreItemsList");
      var i = {
          nowNum: 1,
          startNum: 1,
          afterNum: 1,
          original: !1,
          moreText: "Show more",
          noMoreText: "No more",
          backMoreText: "Reset",
          responsive: "",
          after: function () {},
        },
        s = $(t).data("showMoreItems") || {};
      (this.defaults = $.extend({}, i, e, s)),
        (this.options = $.extend({}, i, e, s)),
        this.registerBreakpoints(t),
        this.init(t);
    };
  (ShowMoreItems.prototype.init = function (t) {
    return (this.sum = $(t).children().length), this.runData(t, this), !1;
  }),
    (ShowMoreItems.prototype.runData = function (i, s) {
      var n = this;
      (n.goOut = !1),
        $(i).children().hide(),
        $(i).next(".button-box").remove(),
        (n.nowNum = s.options.nowNum - 1),
        (n.goNum = n.nowNum + s.options.startNum),
        n.sum <= s.options.startNum && ((n.goNum = n.sum), (n.goOut = !0));
      for (var t = n.nowNum; t < n.goNum; t++)
        $(i).children().eq(t).show(), (n.nowNum += 1);
      n.goOut ||
        $(i).after(
          '<div class="button-box text-center mt-10"><button class="btn rounded-pill btn-soft-ash addListData">' +
            s.options.moreText +
            "</button></div>"
        ),
        $(i)
          .next()
          .on("click", ".addListData", function (t) {
            (n.goNum = n.nowNum + s.options.afterNum),
              n.sum <= n.goNum && ((n.goNum = n.sum), (n.goOut = !0));
            for (var e = n.nowNum; e < n.goNum; e++)
              $(i).children().eq(e).show(), (n.nowNum += 1);
            n.goOut && s.options.original
              ? $(this).text(s.options.backMoreText).addClass("original")
              : n.goOut &&
                $(this).text(s.options.noMoreText).addClass("d-none"),
              s.options.after();
          }),
        $(i)
          .next()
          .on("click", ".original", function (t) {
            return $(this).removeClass("original"), n.reflesh($(this)), !1;
          });
    }),
    (ShowMoreItems.prototype.reflesh = function (t) {
      (thisE = t.parent().prev()),
        t.remove(),
        this.registerBreakpoints(t),
        this.init(thisE);
    }),
    (ShowMoreItems.prototype.registerBreakpoints = function (t) {
      var i = this;
      i.options.responsive &&
        ((ResponsiveArr = i.options.responsive),
        (ResponsiveArr = ResponsiveArr.sort(function (t, e) {
          return t.breakpoint > e.breakpoint ? -1 : 1;
        })),
        (i.options.responsive = ResponsiveArr),
        (i.Oindex = -1),
        (i.Owidth = $(window).width()),
        $.each(i.options.responsive, function (t, e) {
          $(window).width() <= e.breakpoint &&
            ((i.Oindex = t),
            (e = e.settings),
            (i.options = $.extend({}, i.options, e)));
        }),
        $(window).resize(function () {
          return (
            (run = !1),
            $(window).width() < i.Owidth &&
              ((i.Owidth = $(window).width()),
              $.each(i.options.responsive, function (t, e) {
                if (i.Owidth <= e.breakpoint && i.Oindex < t)
                  return (
                    (i.Oindex = t),
                    (e = e.settings),
                    (i.options = $.extend({}, i.options, i.defaults)),
                    (i.options = $.extend({}, i.options, e)),
                    (run = !0),
                    i.Oindex
                  );
              })),
            $(window).width() > i.Owidth &&
              ((i.Owidth = $(window).width()),
              $.each(ResponsiveArr, function (t, e) {
                if (i.Owidth > e.breakpoint && i.Oindex > t - 1)
                  return (
                    (i.Oindex = t - 1),
                    (run =
                      (-1 != i.Oindex
                        ? ((e = ResponsiveArr[t - 1].settings),
                          (i.options = $.extend({}, i.options, i.defaults)),
                          (i.options = $.extend({}, i.options, e)))
                        : (i.options = $.extend({}, i.options, i.defaults)),
                      !0)),
                    i.Oindex
                  );
              })),
            1 == run && i.runData(t, i),
            !1
          );
        }));
    }),
    ($.fn.showMoreItems = function () {
      for (
        var t,
          e = arguments[0],
          i = Array.prototype.slice.call(arguments, 1),
          s = this.length,
          n = 0;
        n < s;
        n++
      )
        if (
          ("object" == typeof e || void 0 === e
            ? (this[n].showMoreItems = new ShowMoreItems(this[n], e))
            : (t = this[n].showMoreItems[e].apply(this[n].showMoreItems, i)),
          void 0 !== t)
        )
          return t;
      return this;
    }),
    $(function () {
      var settings;
      $('[data-showMoreItems="true"]').length &&
        ((selecter = $('[data-showMoreItems="true"]')),
        "true" == selecter.attr("data-showMoreItems") &&
          ((settings = {
            nowNum: 1,
            getView: 0,
            startNum: 1,
            afterNum: 1,
            original: !1,
            moreText: "Show more",
            noMoreText: "No more",
            backMoreText: "Reset",
            responsive: "",
            after: function () {},
          }),
          selecter.attr("data-nowNum") &&
            (settings.nowNum = parseInt(selecter.attr("data-nowNum"))),
          selecter.attr("data-startNum") &&
            (settings.startNum = parseInt(selecter.attr("data-startNum"))),
          selecter.attr("data-afterNum") &&
            (settings.afterNum = parseInt(selecter.attr("data-afterNum"))),
          selecter.attr("data-original") &&
            (settings.original = Boolean(selecter.attr("data-original"))),
          selecter.attr("data-moreText") &&
            (settings.moreText = selecter.attr("data-moreText")),
          selecter.attr("data-noMoreText") &&
            (settings.noMoreText = selecter.attr("data-noMoreText")),
          selecter.attr("data-backMoreText") &&
            (settings.backMoreText = selecter.attr("data-backMoreText")),
          selecter.attr("data-responsive") &&
            (settings.responsive = eval(selecter.attr("data-responsive")))),
        $('[data-showMoreItems="true"]').showMoreItems(settings));
    });
}),
  (function (a, c) {
    var e,
      n,
      u = "createElement",
      v = "getElementsByTagName",
      b = "length",
      w = "style",
      l = "title",
      g = "undefined",
      x = "setAttribute",
      $ = "getAttribute",
      _ = null,
      f = "__svgInject",
      T = "--inject-",
      y = new RegExp(T + "\\d+", "g"),
      S = "LOAD_FAIL",
      i = "SVG_NOT_SUPPORTED",
      C = "SVG_INVALID",
      h = ["src", "alt", "onload", "onerror"],
      k = c[u]("a"),
      A = typeof SVGRect != g,
      d = { useCache: !0, copyAttributes: !0, makeIdsUnique: !0 },
      E = {
        clipPath: ["clip-path"],
        "color-profile": _,
        cursor: _,
        filter: _,
        linearGradient: ["fill", "stroke"],
        marker: ["marker", "marker-end", "marker-mid", "marker-start"],
        mask: _,
        pattern: ["fill", "stroke"],
        radialGradient: ["fill", "stroke"],
      },
      o = 1,
      p = 2,
      M = 1;
    function I(t) {
      return (e = e || new XMLSerializer()).serializeToString(t);
    }
    function P(t, e) {
      var i,
        s,
        n,
        o = T + M++,
        r = /url\("?#([a-zA-Z][\w:.-]*)"?\)/g,
        a = t.querySelectorAll("[id]"),
        l = e ? [] : _,
        c = {},
        u = [],
        h = !1;
      if (a[b]) {
        for (y = 0; y < a[b]; y++) (s = a[y].localName) in E && (c[s] = 1);
        for (s in c)
          (E[s] || [s]).forEach(function (t) {
            u.indexOf(t) < 0 && u.push(t);
          });
        u[b] && u.push(w);
        for (var d, p, m, g = t[v]("*"), f = t, y = -1; f != _; ) {
          if (f.localName == w)
            (m =
              (p = f.textContent) &&
              p.replace(r, function (t, e) {
                return l && (l[e] = 1), "url(#" + e + o + ")";
              })) !== p && (f.textContent = m);
          else if (f.hasAttributes()) {
            for (n = 0; n < u[b]; n++)
              (d = u[n]),
                (m =
                  (p = f[$](d)) &&
                  p.replace(r, function (t, e) {
                    return l && (l[e] = 1), "url(#" + e + o + ")";
                  })) !== p && f[x](d, m);
            ["xlink:href", "href"].forEach(function (t) {
              var e = f[$](t);
              /^\s*#/.test(e) &&
                ((e = e.trim()), f[x](t, e + o), l && (l[e.substring(1)] = 1));
            });
          }
          f = g[++y];
        }
        for (y = 0; y < a[b]; y++)
          (i = a[y]), (l && !l[i.id]) || ((i.id += o), (h = !0));
      }
      return h;
    }
    function O(t, e, i, s) {
      var n;
      e
        ? (e[x]("data-inject-url", i),
          (n = t.parentNode) &&
            (s.copyAttributes &&
              (function (t, e) {
                for (var i, s = t.attributes, n = 0; n < s[b]; n++) {
                  var o,
                    r,
                    a = (r = s[n]).name;
                  -1 == h.indexOf(a) &&
                    ((i = r.value),
                    a == l
                      ? ((r = e.firstElementChild) &&
                        r.localName.toLowerCase() == l
                          ? (o = r)
                          : ((o = c[u + "NS"]("http://www.w3.org/2000/svg", l)),
                            e.insertBefore(o, r)),
                        (o.textContent = i))
                      : e[x](a, i));
                }
              })(t, e),
            (e = ((i = s.beforeInject) && i(t, e)) || e),
            n.replaceChild(e, t),
            (t[f] = o),
            L(t),
            (n = s.afterInject) && n(t, e)))
        : D(t, s);
    }
    function z() {
      for (var t = {}, e = arguments, i = 0; i < e[b]; i++) {
        var s,
          n = e[i];
        for (s in n) n.hasOwnProperty(s) && (t[s] = n[s]);
      }
      return t;
    }
    function j(t, e) {
      if (e) {
        try {
          (i = t),
            (s = (n = n || new DOMParser()).parseFromString(i, "text/xml"));
        } catch (t) {
          return _;
        }
        return s[v]("parsererror")[b] ? _ : s.documentElement;
      }
      var i,
        s = c.createElement("div");
      return (s.innerHTML = t), s.firstElementChild;
    }
    function L(t) {
      t.removeAttribute("onload");
    }
    function s(t) {
      console.error("SVGInject: " + t);
    }
    function r(t, e, i) {
      (t[f] = p), i.onFail ? i.onFail(t, e) : s(e);
    }
    function D(t, e) {
      L(t), r(t, C, e);
    }
    function F(t, e) {
      L(t), r(t, i, e);
    }
    function q(t, e) {
      r(t, S, e);
    }
    function N(t) {
      (t.onload = _), (t.onerror = _);
    }
    function H() {
      s("no img element");
    }
    var t = (function t(e, i) {
      var s,
        n,
        o = z(d, i),
        m = {};
      function r(r, a) {
        a = z(o, a);
        function t(e) {
          function t() {
            var t = a.onAllFinish;
            t && t(), e && e();
          }
          if (r && typeof r[b] != g) {
            var i = 0,
              s = r[b];
            if (0 == s) t();
            else {
              function n() {
                ++i == s && t();
              }
              for (var o = 0; o < s; o++) l(r[o], a, n);
            }
          } else l(r, a, t);
        }
        return typeof Promise == g ? t() : new Promise(t);
      }
      function l(o, r, t) {
        if (o) {
          var e = o[f];
          if (e) Array.isArray(e) ? e.push(t) : t();
          else {
            if ((N(o), !A)) return F(o, r), t(), 0;
            (e = r.beforeLoad), (e = (e && e(o)) || o[$]("src"));
            if (!e) return "" === e && q(o, r), t(), 0;
            var i = [];
            o[f] = i;
            function a() {
              t(),
                i.forEach(function (t) {
                  t();
                });
            }
            function l(e) {
              u &&
                (m[c].forEach(function (t) {
                  t(e);
                }),
                (m[c] = e));
            }
            var c = ((k.href = e), k.href),
              u = r.useCache,
              h = r.makeIdsUnique;
            if (u) {
              e = function (t) {
                var e, i, s, n;
                t === S
                  ? q(o, r)
                  : t === C
                  ? D(o, r)
                  : ((i = t[0]),
                    (s = t[1]),
                    (n = t[2]),
                    h &&
                      (i === _
                        ? ((i = P((e = j(s, !1)), !1)),
                          (t[0] = i),
                          (t[2] = i && I(e)))
                        : i && (s = n.replace(y, T + M++))),
                    (e = e || j(s, !1)),
                    O(o, e, c, r)),
                  a();
              };
              if (typeof (s = m[c]) != g)
                return s.isCallbackQueue ? s.push(e) : e(s), 0;
              ((s = []).isCallbackQueue = !0), (m[c] = s);
            }
            (n = function (t, e) {
              var i,
                s,
                n = t instanceof Document ? t.documentElement : j(e, !0),
                t = r.afterLoad;
              !t ||
                ((s = t(n, e) || n) &&
                  ((e = (i = "string" == typeof s) ? s : I(n)),
                  (n = i ? j(s, !0) : s))),
                n instanceof SVGElement
                  ? ((i = _),
                    h && (i = P(n, !1)),
                    u && ((s = i && I(n)), l([i, e, s])),
                    O(o, n, c, r))
                  : (D(o, r), l(C)),
                a();
            }),
              (d = function () {
                q(o, r), l(S), a();
              }),
              (s = c) &&
                (((p = new XMLHttpRequest()).onreadystatechange = function () {
                  var t;
                  4 == p.readyState &&
                    (200 == (t = p.status)
                      ? n(p.responseXML, p.responseText.trim())
                      : (400 <= t || 0 == t) && d());
                }),
                p.open("GET", s, !0),
                p.send());
          }
        } else H();
        var s, n, d, p;
      }
      return (
        A &&
          ((s = 'img[onload^="' + e + '("]{visibility:hidden;}'),
          (n = c[v]("head")[0]) &&
            (((i = c[u](w)).type = "text/css"),
            i.appendChild(c.createTextNode(s)),
            n.appendChild(i))),
        (r.setOptions = function (t) {
          o = z(o, t);
        }),
        (r.create = t),
        (r.err = function (t, e) {
          t
            ? t[f] != p &&
              (N(t), A ? (L(t), q(t, o)) : F(t, o), e && (L(t), (t.src = e)))
            : H();
        }),
        (a[e] = r)
      );
    })("SVGInject");
    "object" == typeof module &&
      "object" == typeof module.exports &&
      (module.exports = t);
  })(window, document);
var Typer = function (t) {
  var e = (this.element = t).dataset.delim || ",",
    i = t.dataset.words || "override these,sample typing";
  (this.words = i.split(e).filter((t) => t)),
    (this.delayVariance = parseInt(t.dataset.delayVariance) || 0),
    (this.delay = parseInt(t.dataset.delay) || 200),
    (this.loop = t.dataset.loop || "true"),
    "false" === this.loop && (this.loop = 1),
    (this.deleteDelay = t.dataset.deletedelay || t.dataset.deleteDelay || 800),
    (this.progress = { word: 0, char: 0, building: !0, looped: 0 }),
    (this.typing = !0);
  t = t.dataset.colors || "black";
  (this.colors = t.split(",")),
    (this.element.style.color = this.colors[0]),
    (this.colorIndex = 0),
    this.doTyping();
};
(Typer.prototype.start = function () {
  this.typing || ((this.typing = !0), this.doTyping());
}),
  (Typer.prototype.stop = function () {
    this.typing = !1;
  }),
  (Typer.prototype.doTyping = function () {
    var t,
      e = this.element,
      i = this.progress,
      s = i.word,
      n = i.char,
      o = [...this.words[s]].slice(0, n).join(""),
      n = (2 * Math.random() - 1) * this.delayVariance + this.delay;
    this.cursor &&
      ((this.cursor.element.style.opacity = "1"),
      (this.cursor.on = !0),
      clearInterval(this.cursor.interval),
      (this.cursor.interval = setInterval(
        () => this.cursor.updateBlinkState(),
        400
      ))),
      (e.innerHTML = o),
      i.building
        ? (t = i.char === this.words[s].length)
          ? (i.building = !1)
          : (i.char += 1)
        : 0 === i.char
        ? ((i.building = !0),
          (i.word = (i.word + 1) % this.words.length),
          (this.colorIndex = (this.colorIndex + 1) % this.colors.length),
          (this.element.style.color = this.colors[this.colorIndex]))
        : --i.char,
      i.word === this.words.length - 1 && (i.looped += 1),
      !i.building && this.loop <= i.looped && (this.typing = !1),
      setTimeout(
        () => {
          this.typing && this.doTyping();
        },
        t ? this.deleteDelay : n
      );
  });
var Cursor = function (t) {
  (this.element = t),
    (this.cursorDisplay =
      t.dataset.cursordisplay || t.dataset.cursorDisplay || "|"),
    (t.innerHTML = this.cursorDisplay),
    (this.on = !0),
    (t.style.transition = "all 0.1s"),
    (this.interval = setInterval(() => this.updateBlinkState(), 400));
};
function TyperSetup() {
  var t,
    e,
    i,
    s,
    n = {};
  for (t of document.getElementsByClassName("typer")) n[t.id] = new Typer(t);
  for (e of document.getElementsByClassName("typer-stop")) {
    let t = n[e.dataset.owner];
    e.onclick = () => t.stop();
  }
  for (i of document.getElementsByClassName("typer-start")) {
    let t = n[i.dataset.owner];
    i.onclick = () => t.start();
  }
  for (s of document.getElementsByClassName("cursor")) {
    let t = new Cursor(s);
    t.owner = n[s.dataset.owner];
  }
}
(Cursor.prototype.updateBlinkState = function () {
  this.on
    ? ((this.element.style.opacity = "0"), (this.on = !1))
    : ((this.element.style.opacity = "1"), (this.on = !0));
}),
  TyperSetup();
