"use strict";

!function (a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery);
}(function (a) {
  "use strict";

  var b = {},
      c = Math.max,
      d = Math.min;
  b.c = {}, b.c.d = a(document), b.c.t = function (a) {
    return a.originalEvent.touches.length - 1;
  }, b.o = function () {
    var c = this;
    this.o = null, this.$ = null, this.i = null, this.g = null, this.v = null, this.cv = null, this.x = 0, this.y = 0, this.w = 0, this.h = 0, this.$c = null, this.c = null, this.t = 0, this.isInit = !1, this.fgColor = null, this.pColor = null, this.dH = null, this.cH = null, this.eH = null, this.rH = null, this.scale = 1, this.relative = !1, this.relativeWidth = !1, this.relativeHeight = !1, this.$div = null, this.run = function () {
      var b = function b(a, _b) {
        var d;

        for (d in _b) {
          c.o[d] = _b[d];
        }

        c._carve().init(), c._configure()._draw();
      };

      if (!this.$.data("kontroled")) {
        if (this.$.data("kontroled", !0), this.extend(), this.o = a.extend({
          min: void 0 !== this.$.data("min") ? this.$.data("min") : 0,
          max: void 0 !== this.$.data("max") ? this.$.data("max") : 100,
          stopper: !0,
          readOnly: this.$.data("readonly") || "readonly" === this.$.attr("readonly"),
          cursor: !0 === this.$.data("cursor") && 30 || this.$.data("cursor") || 0,
          thickness: this.$.data("thickness") && Math.max(Math.min(this.$.data("thickness"), 1), .01) || .35,
          lineCap: this.$.data("linecap") || "butt",
          width: this.$.data("width") || 200,
          height: this.$.data("height") || 200,
          displayInput: null == this.$.data("displayinput") || this.$.data("displayinput"),
          displayPrevious: this.$.data("displayprevious"),
          fgColor: this.$.data("fgcolor") || "#87CEEB",
          inputColor: this.$.data("inputcolor"),
          font: this.$.data("font") || "Arial",
          fontWeight: this.$.data("font-weight") || "bold",
          inline: !1,
          step: this.$.data("step") || 1,
          rotation: this.$.data("rotation"),
          draw: null,
          change: null,
          cancel: null,
          release: null,
          format: function format(a) {
            return a;
          },
          parse: function parse(a) {
            return parseFloat(a);
          }
        }, this.o), this.o.flip = "anticlockwise" === this.o.rotation || "acw" === this.o.rotation, this.o.inputColor || (this.o.inputColor = this.o.fgColor), this.$.is("fieldset") ? (this.v = {}, this.i = this.$.find("input"), this.i.each(function (b) {
          var d = a(this);
          c.i[b] = d, c.v[b] = c.o.parse(d.val()), d.bind("change blur", function () {
            var a = {};
            a[b] = d.val(), c.val(c._validate(a));
          });
        }), this.$.find("legend").remove()) : (this.i = this.$, this.v = this.o.parse(this.$.val()), "" === this.v && (this.v = this.o.min), this.$.bind("change blur", function () {
          c.val(c._validate(c.o.parse(c.$.val())));
        })), !this.o.displayInput && this.$.hide(), this.$c = a(document.createElement("canvas")).attr({
          width: this.o.width,
          height: this.o.height
        }), this.$div = a('<div style="' + (this.o.inline ? "display:inline;" : "") + "width:" + this.o.width + "px;height:" + this.o.height + 'px;"></div>'), this.$.wrap(this.$div).before(this.$c), this.$div = this.$.parent(), "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(this.$c[0]), this.c = this.$c[0].getContext ? this.$c[0].getContext("2d") : null, !this.c) throw {
          name: "CanvasNotSupportedException",
          message: "Canvas not supported. Please use excanvas on IE8.0.",
          toString: function toString() {
            return this.name + ": " + this.message;
          }
        };
        return this.scale = (window.devicePixelRatio || 1) / (this.c.webkitBackingStorePixelRatio || this.c.mozBackingStorePixelRatio || this.c.msBackingStorePixelRatio || this.c.oBackingStorePixelRatio || this.c.backingStorePixelRatio || 1), this.relativeWidth = this.o.width % 1 != 0 && this.o.width.indexOf("%"), this.relativeHeight = this.o.height % 1 != 0 && this.o.height.indexOf("%"), this.relative = this.relativeWidth || this.relativeHeight, this._carve(), this.v instanceof Object ? (this.cv = {}, this.copy(this.v, this.cv)) : this.cv = this.v, this.$.bind("configure", b).parent().bind("configure", b), this._listen()._configure()._xy().init(), this.isInit = !0, this.$.val(this.o.format(this.v)), this._draw(), this;
      }
    }, this._carve = function () {
      if (this.relative) {
        var a = this.relativeWidth ? this.$div.parent().width() * parseInt(this.o.width) / 100 : this.$div.parent().width(),
            b = this.relativeHeight ? this.$div.parent().height() * parseInt(this.o.height) / 100 : this.$div.parent().height();
        this.w = this.h = Math.min(a, b);
      } else this.w = this.o.width, this.h = this.o.height;

      return this.$div.css({
        width: this.w + "px",
        height: this.h + "px"
      }), this.$c.attr({
        width: this.w,
        height: this.h
      }), 1 !== this.scale && (this.$c[0].width = this.$c[0].width * this.scale, this.$c[0].height = this.$c[0].height * this.scale, this.$c.width(this.w), this.$c.height(this.h)), this;
    }, this._draw = function () {
      var a = !0;
      c.g = c.c, c.clear(), c.dH && (a = c.dH()), !1 !== a && c.draw();
    }, this._touch = function (a) {
      var d = function d(a) {
        var b = c.xy2val(a.originalEvent.touches[c.t].pageX, a.originalEvent.touches[c.t].pageY);
        b != c.cv && (c.cH && !1 === c.cH(b) || (c.change(c._validate(b)), c._draw()));
      };

      return this.t = b.c.t(a), d(a), b.c.d.bind("touchmove.k", d).bind("touchend.k", function () {
        b.c.d.unbind("touchmove.k touchend.k"), c.val(c.cv);
      }), this;
    }, this._mouse = function (a) {
      var d = function d(a) {
        var b = c.xy2val(a.pageX, a.pageY);
        b != c.cv && (c.cH && !1 === c.cH(b) || (c.change(c._validate(b)), c._draw()));
      };

      return d(a), b.c.d.bind("mousemove.k", d).bind("keyup.k", function (a) {
        if (27 === a.keyCode) {
          if (b.c.d.unbind("mouseup.k mousemove.k keyup.k"), c.eH && !1 === c.eH()) return;
          c.cancel();
        }
      }).bind("mouseup.k", function (a) {
        b.c.d.unbind("mousemove.k mouseup.k keyup.k"), c.val(c.cv);
      }), this;
    }, this._xy = function () {
      var a = this.$c.offset();
      return this.x = a.left, this.y = a.top, this;
    }, this._listen = function () {
      return this.o.readOnly ? this.$.attr("readonly", "readonly") : (this.$c.bind("mousedown", function (a) {
        a.preventDefault(), c._xy()._mouse(a);
      }).bind("touchstart", function (a) {
        a.preventDefault(), c._xy()._touch(a);
      }), this.listen()), this.relative && a(window).resize(function () {
        c._carve().init(), c._draw();
      }), this;
    }, this._configure = function () {
      return this.o.draw && (this.dH = this.o.draw), this.o.change && (this.cH = this.o.change), this.o.cancel && (this.eH = this.o.cancel), this.o.release && (this.rH = this.o.release), this.o.displayPrevious ? (this.pColor = this.h2rgba(this.o.fgColor, "0.4"), this.fgColor = this.h2rgba(this.o.fgColor, "0.6")) : this.fgColor = this.o.fgColor, this;
    }, this._clear = function () {
      this.$c[0].width = this.$c[0].width;
    }, this._validate = function (a) {
      var b = ~~((a < 0 ? -.5 : .5) + a / this.o.step) * this.o.step;
      return Math.round(100 * b) / 100;
    }, this.listen = function () {}, this.extend = function () {}, this.init = function () {}, this.change = function (a) {}, this.val = function (a) {}, this.xy2val = function (a, b) {}, this.draw = function () {}, this.clear = function () {
      this._clear();
    }, this.h2rgba = function (a, b) {
      var c;
      return a = a.substring(1, 7), c = [parseInt(a.substring(0, 2), 16), parseInt(a.substring(2, 4), 16), parseInt(a.substring(4, 6), 16)], "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + b + ")";
    }, this.copy = function (a, b) {
      for (var c in a) {
        b[c] = a[c];
      }
    };
  }, b.Dial = function () {
    b.o.call(this), this.startAngle = null, this.xy = null, this.radius = null, this.lineWidth = null, this.cursorExt = null, this.w2 = null, this.PI2 = 2 * Math.PI, this.extend = function () {
      this.o = a.extend({
        bgColor: this.$.data("bgcolor") || "#EEEEEE",
        angleOffset: this.$.data("angleoffset") || 0,
        angleArc: this.$.data("anglearc") || 360,
        inline: !0
      }, this.o);
    }, this.val = function (a, b) {
      if (null == a) return this.v;
      a = this.o.parse(a), !1 !== b && a != this.v && this.rH && !1 === this.rH(a) || (this.cv = this.o.stopper ? c(d(a, this.o.max), this.o.min) : a, this.v = this.cv, this.$.val(this.o.format(this.v)), this._draw());
    }, this.xy2val = function (a, b) {
      var e, f;
      return e = Math.atan2(a - (this.x + this.w2), -(b - this.y - this.w2)) - this.angleOffset, this.o.flip && (e = this.angleArc - e - this.PI2), this.angleArc != this.PI2 && e < 0 && e > -.5 ? e = 0 : e < 0 && (e += this.PI2), f = e * (this.o.max - this.o.min) / this.angleArc + this.o.min, this.o.stopper && (f = c(d(f, this.o.max), this.o.min)), f;
    }, this.listen = function () {
      var b,
          e,
          f,
          g,
          h = this,
          i = function i(a) {
        a.preventDefault();
        var f = a.originalEvent,
            g = f.detail || f.wheelDeltaX,
            i = f.detail || f.wheelDeltaY,
            j = h._validate(h.o.parse(h.$.val())) + (g > 0 || i > 0 ? h.o.step : g < 0 || i < 0 ? -h.o.step : 0);
        j = c(d(j, h.o.max), h.o.min), h.val(j, !1), h.rH && (clearTimeout(b), b = setTimeout(function () {
          h.rH(j), b = null;
        }, 100), e || (e = setTimeout(function () {
          b && h.rH(j), e = null;
        }, 200)));
      },
          j = 1,
          k = {
        37: -h.o.step,
        38: h.o.step,
        39: h.o.step,
        40: -h.o.step
      };

      this.$.bind("keydown", function (b) {
        var e = b.keyCode;

        if (e >= 96 && e <= 105 && (e = b.keyCode = e - 48), f = parseInt(String.fromCharCode(e)), isNaN(f) && (13 !== e && 8 !== e && 9 !== e && 189 !== e && (190 !== e || h.$.val().match(/\./)) && b.preventDefault(), a.inArray(e, [37, 38, 39, 40]) > -1)) {
          b.preventDefault();
          var i = h.o.parse(h.$.val()) + k[e] * j;
          h.o.stopper && (i = c(d(i, h.o.max), h.o.min)), h.change(h._validate(i)), h._draw(), g = window.setTimeout(function () {
            j *= 2;
          }, 30);
        }
      }).bind("keyup", function (a) {
        isNaN(f) ? g && (window.clearTimeout(g), g = null, j = 1, h.val(h.$.val())) : h.$.val() > h.o.max && h.$.val(h.o.max) || h.$.val() < h.o.min && h.$.val(h.o.min);
      }), this.$c.bind("mousewheel DOMMouseScroll", i), this.$.bind("mousewheel DOMMouseScroll", i);
    }, this.init = function () {
      (this.v < this.o.min || this.v > this.o.max) && (this.v = this.o.min), this.$.val(this.v), this.w2 = this.w / 2, this.cursorExt = this.o.cursor / 100, this.xy = this.w2 * this.scale, this.lineWidth = this.xy * this.o.thickness, this.lineCap = this.o.lineCap, this.radius = this.xy - this.lineWidth / 2, this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset), this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc), this.angleOffset = this.o.angleOffset * Math.PI / 180, this.angleArc = this.o.angleArc * Math.PI / 180, this.startAngle = 1.5 * Math.PI + this.angleOffset, this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
      var a = c(String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;
      this.o.displayInput && this.i.css({
        width: (this.w / 2 + 4 >> 0) + "px",
        height: (this.w / 3 >> 0) + "px",
        position: "absolute",
        "vertical-align": "middle",
        "margin-top": (this.w / 3 >> 0) + "px",
        "margin-left": "-" + (3 * this.w / 4 + 2 >> 0) + "px",
        border: 0,
        background: "none",
        font: this.o.fontWeight + " " + (this.w / a >> 0) + "px " + this.o.font,
        "text-align": "center",
        color: this.o.inputColor || this.o.fgColor,
        padding: "0px",
        "-webkit-appearance": "none"
      }) || this.i.css({
        width: "0px",
        visibility: "hidden"
      });
    }, this.change = function (a) {
      this.cv = a, this.$.val(this.o.format(a));
    }, this.angle = function (a) {
      return (a - this.o.min) * this.angleArc / (this.o.max - this.o.min);
    }, this.arc = function (a) {
      var b, c;
      return a = this.angle(a), this.o.flip ? (b = this.endAngle + 1e-5, c = b - a - 1e-5) : (b = this.startAngle - 1e-5, c = b + a + 1e-5), this.o.cursor && (b = c - this.cursorExt) && (c += this.cursorExt), {
        s: b,
        e: c,
        d: this.o.flip && !this.o.cursor
      };
    }, this.draw = function () {
      var a,
          b = this.g,
          c = this.arc(this.cv),
          d = 1;
      b.lineWidth = this.lineWidth, b.lineCap = this.lineCap, "none" !== this.o.bgColor && (b.beginPath(), b.strokeStyle = this.o.bgColor, b.arc(this.xy, this.xy, this.radius, this.endAngle - 1e-5, this.startAngle + 1e-5, !0), b.stroke()), this.o.displayPrevious && (a = this.arc(this.v), b.beginPath(), b.strokeStyle = this.pColor, b.arc(this.xy, this.xy, this.radius, a.s, a.e, a.d), b.stroke(), d = this.cv == this.v), b.beginPath(), b.strokeStyle = d ? this.o.fgColor : this.fgColor, b.arc(this.xy, this.xy, this.radius, c.s, c.e, c.d), b.stroke();
    }, this.cancel = function () {
      this.val(this.v);
    };
  }, a.fn.dial = a.fn.knob = function (c) {
    return this.each(function () {
      var d = new b.Dial();
      d.o = c, d.$ = a(this), d.run();
    }).parent();
  };
});