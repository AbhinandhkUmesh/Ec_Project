/*


   Magic Zoom Plus v5.3.7 for MagicToolbox.com
   Copyright 2022 Magic Toolbox
   Buy a license: https://www.magictoolbox.com/magiczoomplus/
   License agreement: https://www.magictoolbox.com/license/


*/

window.MagicZoom = (function () {
    var B, q;
    B = q = (function () {
        var W = {
            version: "v3.3.6",
            UUID: 0,
            storage: {},
            $uuid: function (aa) {
                return (aa.$J_UUID || (aa.$J_UUID = ++Q.UUID))
            },
            getStorage: function (aa) {
                return (Q.storage[aa] || (Q.storage[aa] = {}))
            },
            $F: function () {},
            $false: function () {
                return false
            },
            $true: function () {
                return true
            },
            stylesId: "mjs-" + Math.floor(Math.random() * new Date().getTime()),
            defined: function (aa) {
                return (aa != null)
            },
            ifndef: function (ab, aa) {
                return (ab != null) ? ab : aa
            },
            exists: function (aa) {
                return !!(aa)
            },
            jTypeOf: function (ac) {
                var aa = 9007199254740991;
 
                function ab(ad) {
                    return typeof ad === "number" && ad > -1 && ad % 1 === 0 && ad <= aa
                }
                if (!Q.defined(ac)) {
                    return false
                }
                if (ac.$J_TYPE) {
                    return ac.$J_TYPE
                }
                if (!!ac.nodeType) {
                    if (ac.nodeType === 1) {
                        return "element"
                    }
                    if (ac.nodeType === 3) {
                        return "textnode"
                    }
                }
                if (ac === window) {
                    return "window"
                }
                if (ac === document) {
                    return "document"
                }
                if (ac instanceof window.Function) {
                    return "function"
                }
                if (ac instanceof window.String) {
                    return "string"
                }
                if (ac instanceof window.Array) {
                    return "array"
                }
                if (ac instanceof window.Date) {
                    return "date"
                }
                if (ac instanceof window.RegExp) {
                    return "regexp"
                }
                if (ab(ac.length) && ac.item) {
                    return "collection"
                }
                if (ab(ac.length) && ac.callee) {
                    return "arguments"
                }
                if ((ac instanceof window.Object || ac instanceof window.Function) && ac.constructor === Q.Class) {
                    return "class"
                }
                if (Q.browser.trident) {
                    if (Q.defined(ac.cancelBubble)) {
                        return "event"
                    }
                } else {
                    if (ac === window.event || ac.constructor === window.Event || ac.constructor === window.MouseEvent || ac.constructor === window.UIEvent || ac.constructor === window.KeyboardEvent || ac.constructor === window.KeyEvent) {
                        return "event"
                    }
                }
                return typeof (ac)
            },
            extend: function (af, ae) {
                if (!(af instanceof window.Array)) {
                    af = [af]
                }
                if (!ae) {
                    return af[0]
                }
                for (var ad = 0, ab = af.length; ad < ab; ad++) {
                    if (!Q.defined(af)) {
                        continue
                    }
                    for (var ac in ae) {
                        if (!Object.prototype.hasOwnProperty.call(ae, ac)) {
                            continue
                        }
                        try {
                            af[ad][ac] = ae[ac]
                        } catch (aa) {}
                    }
                }
                return af[0]
            },
            implement: function (ae, ad) {
                if (!(ae instanceof window.Array)) {
                    ae = [ae]
                }
                for (var ac = 0, aa = ae.length; ac < aa; ac++) {
                    if (!Q.defined(ae[ac])) {
                        continue
                    }
                    if (!ae[ac].prototype) {
                        continue
                    }
                    for (var ab in (ad || {})) {
                        if (!ae[ac].prototype[ab]) {
                            ae[ac].prototype[ab] = ad[ab]
                        }
                    }
                }
                return ae[0]
            },
            nativize: function (ac, ab) {
                if (!Q.defined(ac)) {
                    return ac
                }
                for (var aa in (ab || {})) {
                    if (!ac[aa]) {
                        ac[aa] = ab[aa]
                    }
                }
                return ac
            },
            $try: function () {
                for (var ab = 0, aa = arguments.length; ab < aa; ab++) {
                    try {
                        return arguments[ab]()
                    } catch (ac) {}
                }
                return null
            },
            $A: function (ac) {
                if (!Q.defined(ac)) {
                    return Q.$([])
                }
                if (ac.toArray) {
                    return Q.$(ac.toArray())
                }
                if (ac.item) {
                    var ab = ac.length || 0,
                        aa = new Array(ab);
                    while (ab--) {
                        aa[ab] = ac[ab]
                    }
                    return Q.$(aa)
                }
                return Q.$(Array.prototype.slice.call(ac))
            },
            now: function () {
                return new Date().getTime()
            },
            detach: function (ae) {
                var ac;
                switch (Q.jTypeOf(ae)) {
                case "object":
                    ac = {};
                    for (var ad in ae) {
                        ac[ad] = Q.detach(ae[ad])
                    }
                    break;
                case "array":
                    ac = [];
                    for (var ab = 0, aa = ae.length; ab < aa; ab++) {
                        ac[ab] = Q.detach(ae[ab])
                    }
                    break;
                default:
                    return ae
                }
                return Q.$(ac)
            },
            $: function (ac) {
                var aa = true;
                if (!Q.defined(ac)) {
                    return null
                }
                if (ac.$J_EXT) {
                    return ac
                }
                switch (Q.jTypeOf(ac)) {
                case "array":
                    ac = Q.nativize(ac, Q.extend(Q.Array, {
                        $J_EXT: Q.$F
                    }));
                    ac.jEach = ac.forEach;
                    ac.contains = Q.Array.contains;
                    return ac;
                    break;
                case "string":
                    var ab = document.getElementById(ac);
                    if (Q.defined(ab)) {
                        return Q.$(ab)
                    }
                    return null;
                    break;
                case "window":
                case "document":
                    Q.$uuid(ac);
                    ac = Q.extend(ac, Q.Doc);
                    break;
                case "element":
                    Q.$uuid(ac);
                    ac = Q.extend(ac, Q.Element);
                    break;
                case "event":
                    ac = Q.extend(ac, Q.Event);
                    break;
                case "textnode":
                case "function":
                case "date":
                default:
                    aa = false;
                    break
                }
                if (aa) {
                    return Q.extend(ac, {
                        $J_EXT: Q.$F
                    })
                } else {
                    return ac
                }
            },
            $new: function (aa, ac, ab) {
                return Q.$(Q.doc.createElement(aa)).setProps(ac || {}).jSetCss(ab || {})
            },
            addCSS: function (ad, ae, ab) {
                var aa, ag, ac, ai = [],
                    ah = -1;
                ab || (ab = Q.stylesId);
                aa = Q.$(ab) || Q.$new("style", {
                    id: ab,
                    type: "text/css"
                }).jAppendTo((document.head || document.body), "top");
                ag = aa.sheet || aa.styleSheet;
                if (Q.jTypeOf(ae) !== "string") {
                    for (var ac in ae) {
                        ai.push(ac + ":" + ae[ac])
                    }
                    ae = ai.join(";")
                }
                if (ag.insertRule) {
                    ah = ag.insertRule(ad + " {" + ae + "}", ag.cssRules.length)
                } else {
                    try {
                        ah = ag.addRule(ad, ae, ag.rules.length)
                    } catch (af) {}
                }
                return ah
            },
            removeCSS: function (ad, aa) {
                var ac, ab;
                ac = Q.$(ad);
                if (Q.jTypeOf(ac) !== "element") {
                    return
                }
                ab = ac.sheet || ac.styleSheet;
                if (ab.deleteRule) {
                    ab.deleteRule(aa)
                } else {
                    if (ab.removeRule) {
                        ab.removeRule(aa)
                    }
                }
            },
            generateUUID: function () {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (ac) {
                    var ab = Math.random() * 16 | 0,
                        aa = ac === "x" ? ab : (ab & 3 | 8);
                    return aa.toString(16)
                }).toUpperCase()
            },
            getAbsoluteURL: (function () {
                var aa;
                return function (ab) {
                    if (!aa) {
                        aa = document.createElement("a")
                    }
                    aa.setAttribute("href", ab);
                    return ("!!" + aa.href).replace("!!", "")
                }
            })(),
            getHashCode: function (ac) {
                var ad = 0,
                    aa = ac.length;
                for (var ab = 0; ab < aa; ++ab) {
                    ad = 31 * ad + ac.charCodeAt(ab);
                    ad %= 4294967296
                }
                return ad
            }
        };
        var Q = W;
        var R = W.$;
        if (!window.magicJS) {
            window.magicJS = W;
            window.$mjs = W.$
        }
        Q.Array = {
            $J_TYPE: "array",
            indexOf: function (ad, ae) {
                var aa = this.length;
                for (var ab = this.length, ac = (ae < 0) ? Math.max(0, ab + ae) : ae || 0; ac < ab; ac++) {
                    if (this[ac] === ad) {
                        return ac
                    }
                }
                return -1
            },
            contains: function (aa, ab) {
                return this.indexOf(aa, ab) != -1
            },
            forEach: function (aa, ad) {
                for (var ac = 0, ab = this.length; ac < ab; ac++) {
                    if (ac in this) {
                        aa.call(ad, this[ac], ac, this)
                    }
                }
            },
            filter: function (aa, af) {
                var ae = [];
                for (var ad = 0, ab = this.length; ad < ab; ad++) {
                    if (ad in this) {
                        var ac = this[ad];
                        if (aa.call(af, this[ad], ad, this)) {
                            ae.push(ac)
                        }
                    }
                }
                return ae
            },
            map: function (aa, ae) {
                var ad = [];
                for (var ac = 0, ab = this.length; ac < ab; ac++) {
                    if (ac in this) {
                        ad[ac] = aa.call(ae, this[ac], ac, this)
                    }
                }
                return ad
            }
        };
        Q.implement(String, {
            $J_TYPE: "string",
            jTrim: function () {
                return this.replace(/^\s+|\s+$/g, "")
            },
            eq: function (aa, ab) {
                return (ab || false) ? (this.toString() === aa.toString()) : (this.toLowerCase().toString() === aa.toLowerCase().toString())
            },
            jCamelize: function () {
                return this.replace(/-\D/g, function (aa) {
                    return aa.charAt(1).toUpperCase()
                })
            },
            dashize: function () {
                return this.replace(/[A-Z]/g, function (aa) {
                    return ("-" + aa.charAt(0).toLowerCase())
                })
            },
            jToInt: function (aa) {
                return parseInt(this, aa || 10)
            },
            toFloat: function () {
                return parseFloat(this)
            },
            jToBool: function () {
                return !this.replace(/true/i, "").jTrim()
            },
            has: function (ab, aa) {
                aa = aa || "";
                return (aa + this + aa).indexOf(aa + ab + aa) > -1
            }
        });
        W.implement(Function, {
            $J_TYPE: "function",
            jBind: function () {
                var ab = Q.$A(arguments),
                    aa = this,
                    ac = ab.shift();
                return function () {
                    return aa.apply(ac || null, ab.concat(Q.$A(arguments)))
                }
            },
            jBindAsEvent: function () {
                var ab = Q.$A(arguments),
                    aa = this,
                    ac = ab.shift();
                return function (ad) {
                    return aa.apply(ac || null, Q.$([ad || (Q.browser.ieMode ? window.event : null)]).concat(ab))
                }
            },
            jDelay: function () {
                var ab = Q.$A(arguments),
                    aa = this,
                    ac = ab.shift();
                return window.setTimeout(function () {
                    return aa.apply(aa, ab)
                }, ac || 0)
            },
            jDefer: function () {
                var ab = Q.$A(arguments),
                    aa = this;
                return function () {
                    return aa.jDelay.apply(aa, ab)
                }
            },
            interval: function () {
                var ab = Q.$A(arguments),
                    aa = this,
                    ac = ab.shift();
                return window.setInterval(function () {
                    return aa.apply(aa, ab)
                }, ac || 0)
            }
        });
        var X = {};
        var P = navigator.userAgent.toLowerCase();
        var O = P.match(/(webkit|gecko|trident|presto)\/(\d+\.?\d*)/i);
        var T = P.match(/(edge|opr)\/(\d+\.?\d*)/i) || P.match(/(crios|chrome|safari|firefox|opera|opr)\/(\d+\.?\d*)/i);
        var V = P.match(/version\/(\d+\.?\d*)/i);
        var K = document.documentElement.style;
 
        function L(ab) {
            var aa = ab.charAt(0).toUpperCase() + ab.slice(1);
            return ab in K || ("Webkit" + aa) in K || ("Moz" + aa) in K || ("ms" + aa) in K || ("O" + aa) in K
        }
        Q.browser = {
            features: {
                xpath: !!(document.evaluate),
                air: !!(window.runtime),
                query: !!(document.querySelector),
                fullScreen: !!(document.fullscreenEnabled || document.msFullscreenEnabled || document.exitFullscreen || document.cancelFullScreen || document.webkitexitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.oCancelFullScreen || document.msCancelFullScreen),
                xhr2: !!(window.ProgressEvent) && !!(window.FormData) && (window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest),
                transition: L("transition"),
                transform: L("transform"),
                perspective: L("perspective"),
                animation: L("animation"),
                requestAnimationFrame: false,
                multibackground: false,
                cssFilters: false,
                canvas: false,
                svg: (function () {
                    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")
                }())
            },
            touchScreen: (function () {
                return "ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
            }()),
            mobile: !!P.match(/(android|bb\d+|meego).+|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/),
            engine: (O && O[1]) ? O[1].toLowerCase() : (window.opera) ? "presto" : !!(window.ActiveXObject) ? "trident" : (document.getBoxObjectFor !== undefined || window.mozInnerScreenY !== null) ? "gecko" : (window.WebKitPoint !== null || !navigator.taintEnabled) ? "webkit" : "unknown",
            version: (O && O[2]) ? parseFloat(O[2]) : 0,
            uaName: (T && T[1]) ? T[1].toLowerCase() : "",
            uaVersion: (T && T[2]) ? parseFloat(T[2]) : 0,
            cssPrefix: "",
            cssDomPrefix: "",
            domPrefix: "",
            ieMode: 0,
            platform: P.match(/ip(?:ad|od|hone)/) ? "ios" : (P.match(/(?:webos|android)/) || navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase(),
            backCompat: document.compatMode && document.compatMode.toLowerCase() === "backcompat",
            scrollbarsWidth: 0,
            getDoc: function () {
                return (document.compatMode && document.compatMode.toLowerCase() === "backcompat") ? document.body : document.documentElement
            },
            requestAnimationFrame: window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || undefined,
            cancelAnimationFrame: window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || undefined,
            ready: false,
            onready: function () {
                if (Q.browser.ready) {
                    return
                }
                var ad;
                var ac;
                Q.browser.ready = true;
                Q.body = Q.$(document.body);
                Q.win = Q.$(window);
                try {
                    var ab = Q.$new("div").jSetCss({
                        width: 100,
                        height: 100,
                        overflow: "scroll",
                        position: "absolute",
                        top: -9999
                    }).jAppendTo(document.body);
                    Q.browser.scrollbarsWidth = ab.offsetWidth - ab.clientWidth;
                    ab.jRemove()
                } catch (aa) {}
                try {
                    ad = Q.$new("div");
                    ac = ad.style;
                    ac.cssText = "background:url(https://),url(https://),red url(https://)";
                    Q.browser.features.multibackground = (/(url\s*\(.*?){3}/).test(ac.background);
                    ac = null;
                    ad = null
                } catch (aa) {}
                if (!Q.browser.cssTransformProp) {
                    Q.browser.cssTransformProp = Q.normalizeCSS("transform").dashize()
                }
                try {
                    ad = Q.$new("div");
                    ad.style.cssText = Q.normalizeCSS("filter").dashize() + ":blur(2px);";
                    Q.browser.features.cssFilters = !!ad.style.length && (!Q.browser.ieMode || Q.browser.ieMode > 9);
                    ad = null
                } catch (aa) {}
                if (!Q.browser.features.cssFilters) {
                    Q.$(document.documentElement).jAddClass("no-cssfilters-magic")
                }
                try {
                    Q.browser.features.canvas = (function () {
                        var ae = Q.$new("canvas");
                        return !!(ae.getContext && ae.getContext("2d"))
                    }())
                } catch (aa) {}
                if (window.TransitionEvent === undefined && window.WebKitTransitionEvent !== undefined) {
                    X.transitionend = "webkitTransitionEnd"
                }
                Q.Doc.jCallEvent.call(Q.$(document), "domready")
            }
        };
        (function () {
            var ab = [],
                ae, ad, af;
 
            function aa() {
                return !!(arguments.callee.caller)
            }
            switch (Q.browser.engine) {
            case "trident":
                if (!Q.browser.version) {
                    Q.browser.version = !!(window.XMLHttpRequest) ? 3 : 2
                }
                break;
            case "gecko":
                Q.browser.version = (T && T[2]) ? parseFloat(T[2]) : 0;
                break
            }
            Q.browser[Q.browser.engine] = true;
            if (T && T[1] === "crios") {
                Q.browser.uaName = "chrome"
            }
            if (!!window.chrome) {
                Q.browser.chrome = true
            }
            if (T && T[1] === "opr") {
                Q.browser.uaName = "opera";
                Q.browser.opera = true
            }
            if (Q.browser.uaName === "safari" && (V && V[1])) {
                Q.browser.uaVersion = parseFloat(V[1])
            }
            if (Q.browser.platform === "android" && Q.browser.webkit && (V && V[1])) {
                Q.browser.androidBrowser = true
            }
            ae = ({
                gecko: ["-moz-", "Moz", "moz"],
                webkit: ["-webkit-", "Webkit", "webkit"],
                trident: ["-ms-", "ms", "ms"],
                presto: ["-o-", "O", "o"]
            })[Q.browser.engine] || ["", "", ""];
            Q.browser.cssPrefix = ae[0];
            Q.browser.cssDomPrefix = ae[1];
            Q.browser.domPrefix = ae[2];
            Q.browser.ieMode = !Q.browser.trident ? undefined : (document.documentMode) ? document.documentMode : (function () {
                var ag = 0;
                if (Q.browser.backCompat) {
                    return 5
                }
                switch (Q.browser.version) {
                case 2:
                    ag = 6;
                    break;
                case 3:
                    ag = 7;
                    break
                }
                return ag
            }());
            if (!Q.browser.mobile && Q.browser.platform === "mac" && Q.browser.touchScreen) {
                Q.browser.mobile = true;
                Q.browser.platform = "ios"
            }
            ab.push(Q.browser.platform + "-magic");
            if (Q.browser.mobile) {
                ab.push("mobile-magic")
            }
            if (Q.browser.androidBrowser) {
                ab.push("android-browser-magic")
            }
            if (Q.browser.ieMode) {
                Q.browser.uaName = "ie";
                Q.browser.uaVersion = Q.browser.ieMode;
                ab.push("ie" + Q.browser.ieMode + "-magic");
                for (ad = 11; ad > Q.browser.ieMode; ad--) {
                    ab.push("lt-ie" + ad + "-magic")
                }
            }
            if (Q.browser.webkit && Q.browser.version < 536) {
                Q.browser.features.fullScreen = false
            }
            if (Q.browser.requestAnimationFrame) {
                Q.browser.requestAnimationFrame.call(window, function () {
                    Q.browser.features.requestAnimationFrame = true
                })
            }
            if (Q.browser.features.svg) {
                ab.push("svg-magic")
            } else {
                ab.push("no-svg-magic")
            }
            af = (document.documentElement.className || "").match(/\S+/g) || [];
            document.documentElement.className = Q.$(af).concat(ab).join(" ");
            try {
                document.documentElement.setAttribute("data-magic-ua", Q.browser.uaName);
                document.documentElement.setAttribute("data-magic-ua-ver", Q.browser.uaVersion);
                document.documentElement.setAttribute("data-magic-engine", Q.browser.engine);
                document.documentElement.setAttribute("data-magic-engine-ver", Q.browser.version)
            } catch (ac) {}
            if (Q.browser.ieMode && Q.browser.ieMode < 9) {
                document.createElement("figure");
                document.createElement("figcaption")
            }
            if (!window.navigator.pointerEnabled) {
                Q.$(["Down", "Up", "Move", "Over", "Out"]).jEach(function (ag) {
                    X["pointer" + ag.toLowerCase()] = window.navigator.msPointerEnabled ? "MSPointer" + ag : -1
                })
            }
        }());
        (function () {
            Q.browser.fullScreen = {
                capable: Q.browser.features.fullScreen,
                enabled: function () {
                    return !!(document.fullscreenElement || document[Q.browser.domPrefix + "FullscreenElement"] || document.fullScreen || document.webkitIsFullScreen || document[Q.browser.domPrefix + "FullScreen"])
                },
                request: function (aa, ab) {
                    if (!ab) {
                        ab = {}
                    }
                    if (this.capable) {
                        Q.$(document).jAddEvent(this.changeEventName, this.onchange = function (ac) {
                            if (this.enabled()) {
                                if (ab.onEnter) {
                                    ab.onEnter()
                                }
                            } else {
                                Q.$(document).jRemoveEvent(this.changeEventName, this.onchange);
                                if (ab.onExit) {
                                    ab.onExit()
                                }
                            }
                        }.jBindAsEvent(this));
                        Q.$(document).jAddEvent(this.errorEventName, this.onerror = function (ac) {
                            if (ab.fallback) {
                                ab.fallback()
                            }
                            Q.$(document).jRemoveEvent(this.errorEventName, this.onerror)
                        }.jBindAsEvent(this));
                        (aa.requestFullscreen || aa[Q.browser.domPrefix + "RequestFullscreen"] || aa[Q.browser.domPrefix + "RequestFullScreen"] || function () {}).call(aa)
                    } else {
                        if (ab.fallback) {
                            ab.fallback()
                        }
                    }
                },
                cancel: (document.exitFullscreen || document.cancelFullScreen || document[Q.browser.domPrefix + "ExitFullscreen"] || document[Q.browser.domPrefix + "CancelFullScreen"] || function () {}).jBind(document),
                changeEventName: document.msExitFullscreen ? "MSFullscreenChange" : (document.exitFullscreen ? "" : Q.browser.domPrefix) + "fullscreenchange",
                errorEventName: document.msExitFullscreen ? "MSFullscreenError" : (document.exitFullscreen ? "" : Q.browser.domPrefix) + "fullscreenerror",
                prefix: Q.browser.domPrefix,
                activeElement: null
            }
        }());
        var Z = /\S+/g,
            N = /^(border(Top|Bottom|Left|Right)Width)|((padding|margin)(Top|Bottom|Left|Right))$/,
            S = {
                "float": ("undefined" === typeof (K.styleFloat)) ? "cssFloat" : "styleFloat"
            },
            U = {
                fontWeight: true,
                lineHeight: true,
                opacity: true,
                zIndex: true,
                zoom: true
            },
            M = (window.getComputedStyle) ? function (ac, aa) {
                var ab = window.getComputedStyle(ac, null);
                return ab ? ab.getPropertyValue(aa) || ab[aa] : null
            } : function (ad, ab) {
                var ac = ad.currentStyle,
                    aa = null;
                aa = ac ? ac[ab] : null;
                if (null == aa && ad.style && ad.style[ab]) {
                    aa = ad.style[ab]
                }
                return aa
            };
 
        function Y(ac) {
            var aa, ab;
            ab = (Q.browser.webkit && "filter" == ac) ? false : (ac in K);
            if (!ab) {
                aa = Q.browser.cssDomPrefix + ac.charAt(0).toUpperCase() + ac.slice(1);
                if (aa in K) {
                    return aa
                }
            }
            return ac
        }
        Q.normalizeCSS = Y;
        Q.Element = {
            jHasClass: function (aa) {
                return !(aa || "").has(" ") && (this.className || "").has(aa, " ")
            },
            jAddClass: function (ae) {
                var ab = (this.className || "").match(Z) || [],
                    ad = (ae || "").match(Z) || [],
                    aa = ad.length,
                    ac = 0;
                for (; ac < aa; ac++) {
                    if (!Q.$(ab).contains(ad[ac])) {
                        ab.push(ad[ac])
                    }
                }
                this.className = ab.join(" ");
                return this
            },
            jRemoveClass: function (af) {
                var ab = (this.className || "").match(Z) || [],
                    ae = (af || "").match(Z) || [],
                    aa = ae.length,
                    ad = 0,
                    ac;
                for (; ad < aa; ad++) {
                    if ((ac = Q.$(ab).indexOf(ae[ad])) > -1) {
                        ab.splice(ac, 1)
                    }
                }
                this.className = af ? ab.join(" ") : "";
                return this
            },
            jToggleClass: function (aa) {
                return this.jHasClass(aa) ? this.jRemoveClass(aa) : this.jAddClass(aa)
            },
            jGetCss: function (ab) {
                var ac = ab.jCamelize(),
                    aa = null;
                ab = S[ac] || (S[ac] = Y(ac));
                aa = M(this, ab);
                if ("auto" === aa) {
                    aa = null
                }
                if (null !== aa) {
                    if ("opacity" == ab) {
                        return Q.defined(aa) ? parseFloat(aa) : 1
                    }
                    if (N.test(ab)) {
                        aa = parseInt(aa, 10) ? aa : "0px"
                    }
                }
                return aa
            },
            jSetCssProp: function (ab, aa) {
                var ad = ab.jCamelize();
                try {
                    if ("opacity" == ab) {
                        this.jSetOpacity(aa);
                        return this
                    }
                    ab = S[ad] || (S[ad] = Y(ad));
                    this.style[ab] = aa + (("number" == Q.jTypeOf(aa) && !U[ad]) ? "px" : "")
                } catch (ac) {}
                return this
            },
            jSetCss: function (ab) {
                for (var aa in ab) {
                    this.jSetCssProp(aa, ab[aa])
                }
                return this
            },
            jGetStyles: function () {
                var aa = {};
                Q.$A(arguments).jEach(function (ab) {
                    aa[ab] = this.jGetCss(ab)
                }, this);
                return aa
            },
            jSetOpacity: function (ac, aa) {
                var ab;
                aa = aa || false;
                this.style.opacity = ac;
                ac = parseInt(parseFloat(ac) * 100);
                if (aa) {
                    if (0 === ac) {
                        if ("hidden" != this.style.visibility) {
                            this.style.visibility = "hidden"
                        }
                    } else {
                        if ("visible" != this.style.visibility) {
                            this.style.visibility = "visible"
                        }
                    }
                }
                if (Q.browser.ieMode && Q.browser.ieMode < 9) {
                    if (!isNaN(ac)) {
                        if (!~this.style.filter.indexOf("Alpha")) {
                            this.style.filter += " progid:DXImageTransform.Microsoft.Alpha(Opacity=" + ac + ")"
                        } else {
                            this.style.filter = this.style.filter.replace(/Opacity=\d*/i, "Opacity=" + ac)
                        }
                    } else {
                        this.style.filter = this.style.filter.replace(/progid:DXImageTransform.Microsoft.Alpha\(Opacity=\d*\)/i, "").jTrim();
                        if ("" === this.style.filter) {
                            this.style.removeAttribute("filter")
                        }
                    }
                }
                return this
            },
            setProps: function (aa) {
                for (var ab in aa) {
                    if ("class" === ab) {
                        this.jAddClass("" + aa[ab])
                    } else {
                        this.setAttribute(ab, "" + aa[ab])
                    }
                }
                return this
            },
            jGetTransitionDuration: function () {
                var ab = 0,
                    aa = 0;
                ab = this.jGetCss("transition-duration");
                aa = this.jGetCss("transition-delay");
                ab = ab.indexOf("ms") > -1 ? parseFloat(ab) : ab.indexOf("s") > -1 ? parseFloat(ab) * 1000 : 0;
                aa = aa.indexOf("ms") > -1 ? parseFloat(aa) : aa.indexOf("s") > -1 ? parseFloat(aa) * 1000 : 0;
                return ab + aa
            },
            hide: function () {
                return this.jSetCss({
                    display: "none",
                    visibility: "hidden"
                })
            },
            show: function () {
                return this.jSetCss({
                    display: "",
                    visibility: "visible"
                })
            },
            jGetSize: function () {
                return {
                    width: this.offsetWidth,
                    height: this.offsetHeight
                }
            },
            getInnerSize: function (ab) {
                var aa = this.jGetSize();
                aa.width -= (parseFloat(this.jGetCss("border-left-width") || 0) + parseFloat(this.jGetCss("border-right-width") || 0));
                aa.height -= (parseFloat(this.jGetCss("border-top-width") || 0) + parseFloat(this.jGetCss("border-bottom-width") || 0));
                if (!ab) {
                    aa.width -= (parseFloat(this.jGetCss("padding-left") || 0) + parseFloat(this.jGetCss("padding-right") || 0));
                    aa.height -= (parseFloat(this.jGetCss("padding-top") || 0) + parseFloat(this.jGetCss("padding-bottom") || 0))
                }
                return aa
            },
            jGetScroll: function () {
                return {
                    top: this.scrollTop,
                    left: this.scrollLeft
                }
            },
            jGetFullScroll: function () {
                var aa = this,
                    ab = {
                        top: 0,
                        left: 0
                    };
                do {
                    ab.left += aa.scrollLeft || 0;
                    ab.top += aa.scrollTop || 0;
                    aa = aa.parentNode
                } while (aa);
                return ab
            },
            jGetPosition: function () {
                var ae = this,
                    ab = 0,
                    ad = 0;
                if (Q.defined(document.documentElement.getBoundingClientRect)) {
                    var aa = this.getBoundingClientRect(),
                        ac = Q.$(document).jGetScroll(),
                        af = Q.browser.getDoc();
                    return {
                        top: aa.top + ac.y - af.clientTop,
                        left: aa.left + ac.x - af.clientLeft
                    }
                }
                do {
                    ab += ae.offsetLeft || 0;
                    ad += ae.offsetTop || 0;
                    ae = ae.offsetParent
                } while (ae && !(/^(?:body|html)$/i).test(ae.tagName));
                return {
                    top: ad,
                    left: ab
                }
            },
            jGetOffset: function () {
                var aa = this;
                var ac = 0;
                var ab = 0;
                do {
                    ac += aa.offsetLeft || 0;
                    ab += aa.offsetTop || 0;
                    aa = aa.offsetParent
                } while (aa && !(/^(?:body|html)$/i).test(aa.tagName));
                return {
                    top: ab,
                    left: ac
                }
            },
            jGetRect: function () {
                var ab = this.jGetPosition();
                var aa = this.jGetSize();
                return {
                    top: ab.top,
                    bottom: ab.top + aa.height,
                    left: ab.left,
                    right: ab.left + aa.width
                }
            },
            changeContent: function (ab) {
                try {
                    this.innerHTML = ab
                } catch (aa) {
                    this.innerText = ab
                }
                return this
            },
            jRemove: function () {
                return (this.parentNode) ? this.parentNode.removeChild(this) : this
            },
            kill: function () {
                Q.$A(this.childNodes).jEach(function (aa) {
                    if (3 == aa.nodeType || 8 == aa.nodeType) {
                        return
                    }
                    Q.$(aa).kill()
                });
                this.jRemove();
                this.jClearEvents();
                if (this.$J_UUID) {
                    Q.storage[this.$J_UUID] = null;
                    delete Q.storage[this.$J_UUID]
                }
                return null
            },
            append: function (ac, ab) {
                ab = ab || "bottom";
                var aa = this.firstChild;
                ("top" == ab && aa) ? this.insertBefore(ac, aa): this.appendChild(ac);
                return this
            },
            jAppendTo: function (ac, ab) {
                var aa = Q.$(ac).append(this, ab);
                return this
            },
            enclose: function (aa) {
                this.append(aa.parentNode.replaceChild(this, aa));
                return this
            },
            hasChild: function (aa) {
                if ("element" !== Q.jTypeOf("string" == Q.jTypeOf(aa) ? aa = document.getElementById(aa) : aa)) {
                    return false
                }
                return (this == aa) ? false : (this.contains && !(Q.browser.webkit419)) ? (this.contains(aa)) : (this.compareDocumentPosition) ? !!(this.compareDocumentPosition(aa) & 16) : Q.$A(this.byTag(aa.tagName)).contains(aa)
            }
        };
        Q.Element.jGetStyle = Q.Element.jGetCss;
        Q.Element.jSetStyle = Q.Element.jSetCss;
        if (!window.Element) {
            window.Element = Q.$F;
            if (Q.browser.engine.webkit) {
                window.document.createElement("iframe")
            }
            window.Element.prototype = (Q.browser.engine.webkit) ? window["[[DOMElement.prototype]]"] : {}
        }
        Q.implement(window.Element, {
            $J_TYPE: "element"
        });
        Q.Doc = {
            jGetSize: function () {
                if (Q.browser.touchScreen || Q.browser.presto925 || Q.browser.webkit419) {
                    return {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
                return {
                    width: Q.browser.getDoc().clientWidth,
                    height: Q.browser.getDoc().clientHeight
                }
            },
            jGetScroll: function () {
                return {
                    x: window.pageXOffset || Q.browser.getDoc().scrollLeft,
                    y: window.pageYOffset || Q.browser.getDoc().scrollTop
                }
            },
            jGetFullSize: function () {
                var aa = this.jGetSize();
                return {
                    width: Math.max(Q.browser.getDoc().scrollWidth, aa.width),
                    height: Math.max(Q.browser.getDoc().scrollHeight, aa.height)
                }
            }
        };
        Q.extend(document, {
            $J_TYPE: "document"
        });
        Q.extend(window, {
            $J_TYPE: "window"
        });
        Q.extend([Q.Element, Q.Doc], {
            jFetch: function (ad, ab) {
                var aa = Q.getStorage(this.$J_UUID),
                    ac = aa[ad];
                if (undefined !== ab && undefined === ac) {
                    ac = aa[ad] = ab
                }
                return (Q.defined(ac) ? ac : null)
            },
            jStore: function (ac, ab) {
                var aa = Q.getStorage(this.$J_UUID);
                aa[ac] = ab;
                return this
            },
            jDel: function (ab) {
                var aa = Q.getStorage(this.$J_UUID);
                delete aa[ab];
                return this
            }
        });
        if (!(window.HTMLElement && window.HTMLElement.prototype && window.HTMLElement.prototype.getElementsByClassName)) {
            Q.extend([Q.Element, Q.Doc], {
                getElementsByClassName: function (aa) {
                    return Q.$A(this.getElementsByTagName("*")).filter(function (ac) {
                        try {
                            return (1 == ac.nodeType && ac.className.has(aa, " "))
                        } catch (ab) {}
                    })
                }
            })
        }
        Q.extend([Q.Element, Q.Doc], {
            byClass: function () {
                return this.getElementsByClassName(arguments[0])
            },
            byTag: function () {
                return this.getElementsByTagName(arguments[0])
            }
        });
        if (Q.browser.fullScreen.capable && !document.requestFullScreen) {
            Q.Element.requestFullScreen = function () {
                Q.browser.fullScreen.request(this)
            }
        }
        Q.Event = {
            $J_TYPE: "event",
            isQueueStopped: Q.$false,
            stop: function () {
                return this.stopDistribution().stopDefaults()
            },
            stopDistribution: function () {
                if (this.stopPropagation) {
                    this.stopPropagation()
                } else {
                    this.cancelBubble = true
                }
                return this
            },
            stopDefaults: function () {
                if (this.preventDefault) {
                    this.preventDefault()
                } else {
                    this.returnValue = false
                }
                return this
            },
            stopQueue: function () {
                this.isQueueStopped = Q.$true;
                return this
            },
            getClientXY: function () {
                var aa = (/touch/i).test(this.type) ? this.changedTouches[0] : this;
                return !Q.defined(aa) ? {
                    x: 0,
                    y: 0
                } : {
                    x: aa.clientX,
                    y: aa.clientY
                }
            },
            jGetPageXY: function () {
                var aa = (/touch/i).test(this.type) ? this.changedTouches[0] : this;
                return !Q.defined(aa) ? {
                    x: 0,
                    y: 0
                } : {
                    x: aa.pageX || aa.clientX + Q.browser.getDoc().scrollLeft,
                    y: aa.pageY || aa.clientY + Q.browser.getDoc().scrollTop
                }
            },
            getTarget: function () {
                var aa = this.target || this.srcElement;
                while (aa && aa.nodeType === 3) {
                    aa = aa.parentNode
                }
                return aa
            },
            getRelated: function () {
                var ab = null;
                switch (this.type) {
                case "mouseover":
                case "pointerover":
                case "MSPointerOver":
                    ab = this.relatedTarget || this.fromElement;
                    break;
                case "mouseout":
                case "pointerout":
                case "MSPointerOut":
                    ab = this.relatedTarget || this.toElement;
                    break;
                default:
                    return ab
                }
                try {
                    while (ab && ab.nodeType === 3) {
                        ab = ab.parentNode
                    }
                } catch (aa) {
                    ab = null
                }
                return ab
            },
            getButton: function () {
                if (!this.which && this.button !== undefined) {
                    return (this.button & 1 ? 1 : (this.button & 2 ? 3 : (this.button & 4 ? 2 : 0)))
                }
                return this.which
            },
            isTouchEvent: function () {
                return (this.pointerType && (this.pointerType === "touch" || this.pointerType === this.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(this.type)
            },
            isPrimaryTouch: function () {
                if (this.pointerType) {
                    return (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) && this.isPrimary
                } else {
                    if (this instanceof window.TouchEvent) {
                        return this.changedTouches.length === 1 && (this.targetTouches.length ? this.targetTouches.length === 1 && this.targetTouches[0].identifier === this.changedTouches[0].identifier : true)
                    }
                }
                return false
            },
            getPrimaryTouch: function () {
                if (this.pointerType) {
                    return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this : null
                } else {
                    if (this instanceof window.TouchEvent) {
                        return this.changedTouches[0]
                    }
                }
                return null
            },
            getPrimaryTouchId: function () {
                if (this.pointerType) {
                    return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this.pointerId : null
                } else {
                    if (this instanceof window.TouchEvent) {
                        return this.changedTouches[0].identifier
                    }
                }
                return null
            }
        };
        Q.event_add = "addEventListener";
        Q.event_del = "removeEventListener";
        Q.event_prefix = "";
        if (!document.addEventListener) {
            Q.event_add = "attachEvent";
            Q.event_del = "detachEvent";
            Q.event_prefix = "on"
        }
        Q.Event.Custom = {
            type: "",
            x: null,
            y: null,
            timeStamp: null,
            button: null,
            target: null,
            relatedTarget: null,
            $J_TYPE: "event.custom",
            isQueueStopped: Q.$false,
            events: Q.$([]),
            pushToEvents: function (aa) {
                var ab = aa;
                this.events.push(ab)
            },
            stop: function () {
                return this.stopDistribution().stopDefaults()
            },
            stopDistribution: function () {
                this.events.jEach(function (ab) {
                    try {
                        ab.stopDistribution()
                    } catch (aa) {}
                });
                return this
            },
            stopDefaults: function () {
                this.events.jEach(function (ab) {
                    try {
                        ab.stopDefaults()
                    } catch (aa) {}
                });
                return this
            },
            stopQueue: function () {
                this.isQueueStopped = Q.$true;
                return this
            },
            getClientXY: function () {
                return {
                    x: this.clientX,
                    y: this.clientY
                }
            },
            jGetPageXY: function () {
                return {
                    x: this.x,
                    y: this.y
                }
            },
            getTarget: function () {
                return this.target
            },
            getRelated: function () {
                return this.relatedTarget
            },
            getButton: function () {
                return this.button
            },
            getOriginalTarget: function () {
                return this.events.length > 0 ? this.events[0].getTarget() : undefined
            },
            isTouchEvent: function () {
                return (this.pointerType && (this.pointerType === "touch" || this.pointerType === this.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(this.type)
            },
            isPrimaryTouch: function () {
                if (this.pointerType) {
                    return (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) && this.isPrimary
                } else {
                    if (this instanceof window.TouchEvent) {
                        return this.changedTouches.length === 1 && (this.targetTouches.length ? this.targetTouches[0].identifier === this.changedTouches[0].identifier : true)
                    }
                }
                return false
            },
            getPrimaryTouch: function () {
                if (this.pointerType) {
                    return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this : null
                } else {
                    if (this instanceof window.TouchEvent) {
                        return this.changedTouches[0]
                    }
                }
                return null
            },
            getPrimaryTouchId: function () {
                if (this.pointerType) {
                    return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this.pointerId : null
                } else {
                    if (this instanceof window.TouchEvent) {
                        return this.changedTouches[0].identifier
                    }
                }
                return null
            }
        };
        Q.extend([Q.Element, Q.Doc], {
            jAddEvent: function (ac, ae, af, ai) {
                var ah, aa, ad, ag, ab;
                if (Q.jTypeOf(ac) === "string") {
                    ab = ac.split(" ");
                    if (ab.length > 1) {
                        ac = ab
                    }
                }
                if (Q.jTypeOf(ac) === "array") {
                    Q.$(ac).jEach(this.jAddEvent.jBindAsEvent(this, ae, af, ai));
                    return this
                }
                ac = X[ac] || ac;
                if (!ac || !ae || Q.jTypeOf(ac) !== "string" || Q.jTypeOf(ae) !== "function") {
                    return this
                }
                if (ac === "domready" && Q.browser.ready) {
                    ae.call(this);
                    return this
                }
                af = parseInt(af || 50, 10);
                if (!ae.$J_EUID) {
                    ae.$J_EUID = Math.floor(Math.random() * Q.now())
                }
                ah = Q.Doc.jFetch.call(this, "EVENTS", {});
                aa = ah[ac];
                if (!aa) {
                    ah[ac] = aa = Q.$([]);
                    ad = this;
                    if (Q.Event.Custom[ac]) {
                        Q.Event.Custom[ac].handler.add.call(this, ai)
                    } else {
                        aa.handle = function (aj) {
                            aj = Q.extend(aj || window.e, {
                                $J_TYPE: "event"
                            });
                            Q.Doc.jCallEvent.call(ad, ac, Q.$(aj))
                        };
                        this[Q.event_add](Q.event_prefix + ac, aa.handle, false)
                    }
                }
                ag = {
                    type: ac,
                    fn: ae,
                    priority: af,
                    euid: ae.$J_EUID
                };
                aa.push(ag);
                aa.sort(function (ak, aj) {
                    return ak.priority - aj.priority
                });
                return this
            },
            jRemoveEvent: function (ag) {
                var ae = Q.Doc.jFetch.call(this, "EVENTS", {});
                var ac;
                var aa;
                var ab;
                var ah;
                var af;
                var ad;
                af = arguments.length > 1 ? arguments[1] : -100;
                if (Q.jTypeOf(ag) === "string") {
                    ad = ag.split(" ");
                    if (ad.length > 1) {
                        ag = ad
                    }
                }
                if (Q.jTypeOf(ag) === "array") {
                    Q.$(ag).jEach(this.jRemoveEvent.jBindAsEvent(this, af));
                    return this
                }
                ag = X[ag] || ag;
                if (!ag || Q.jTypeOf(ag) !== "string" || !ae || !ae[ag]) {
                    return this
                }
                ac = ae[ag] || [];
                for (ab = 0; ab < ac.length; ab++) {
                    aa = ac[ab];
                    if (af === -100 || !!af && af.$J_EUID === aa.euid) {
                        ah = ac.splice(ab--, 1)
                    }
                }
                if (ac.length === 0) {
                    if (Q.Event.Custom[ag]) {
                        Q.Event.Custom[ag].handler.jRemove.call(this)
                    } else {
                        this[Q.event_del](Q.event_prefix + ag, ac.handle, false)
                    }
                    delete ae[ag]
                }
                return this
            },
            jCallEvent: function (ad, af) {
                var ac = Q.Doc.jFetch.call(this, "EVENTS", {});
                var ab;
                var aa;
                ad = X[ad] || ad;
                if (!ad || Q.jTypeOf(ad) !== "string" || !ac || !ac[ad]) {
                    return this
                }
                try {
                    af = Q.extend(af || {}, {
                        type: ad
                    })
                } catch (ae) {}
                if (af.timeStamp === undefined) {
                    af.timeStamp = Q.now()
                }
                ab = ac[ad] || [];
                for (aa = 0; aa < ab.length && !(af.isQueueStopped && af.isQueueStopped()); aa++) {
                    ab[aa].fn.call(this, af)
                }
            },
            jRaiseEvent: function (ab, aa) {
                var ae = (ab !== "domready");
                var ad = this;
                var ac;
                ab = X[ab] || ab;
                if (!ae) {
                    Q.Doc.jCallEvent.call(this, ab);
                    return this
                }
                if (ad === document && document.createEvent && !ad.dispatchEvent) {
                    ad = document.documentElement
                }
                if (document.createEvent) {
                    ac = document.createEvent(ab);
                    ac.initEvent(aa, true, true)
                } else {
                    ac = document.createEventObject();
                    ac.eventType = ab
                }
                if (document.createEvent) {
                    ad.dispatchEvent(ac)
                } else {
                    ad.fireEvent("on" + aa, ac)
                }
                return ac
            },
            jClearEvents: function () {
                var ab = Q.Doc.jFetch.call(this, "EVENTS");
                if (!ab) {
                    return this
                }
                for (var aa in ab) {
                    Q.Doc.jRemoveEvent.call(this, aa)
                }
                Q.Doc.jDel.call(this, "EVENTS");
                return this
            }
        });
        (function (aa) {
            if (document.readyState === "complete") {
                return aa.browser.onready.jDelay(1)
            }
            if (aa.browser.webkit && aa.browser.version < 420) {
                (function () {
                    if (aa.$(["loaded", "complete"]).contains(document.readyState)) {
                        aa.browser.onready()
                    } else {
                        arguments.callee.jDelay(50)
                    }
                }())
            } else {
                if (aa.browser.trident && aa.browser.ieMode < 9 && window === top) {
                    (function () {
                        if (aa.$try(function () {
                                aa.browser.getDoc().doScroll("left");
                                return true
                            })) {
                            aa.browser.onready()
                        } else {
                            arguments.callee.jDelay(50)
                        }
                    }())
                } else {
                    aa.Doc.jAddEvent.call(aa.$(document), "DOMContentLoaded", aa.browser.onready);
                    aa.Doc.jAddEvent.call(aa.$(window), "load", aa.browser.onready)
                }
            }
        }(W));
        Q.Class = function () {
            var ae = null,
                ab = Q.$A(arguments);
            if ("class" == Q.jTypeOf(ab[0])) {
                ae = ab.shift()
            }
            var aa = function () {
                for (var ah in this) {
                    this[ah] = Q.detach(this[ah])
                }
                if (this.constructor.$parent) {
                    this.$parent = {};
                    var aj = this.constructor.$parent;
                    for (var ai in aj) {
                        var ag = aj[ai];
                        switch (Q.jTypeOf(ag)) {
                        case "function":
                            this.$parent[ai] = Q.Class.wrap(this, ag);
                            break;
                        case "object":
                            this.$parent[ai] = Q.detach(ag);
                            break;
                        case "array":
                            this.$parent[ai] = Q.detach(ag);
                            break
                        }
                    }
                }
                var af = (this.init) ? this.init.apply(this, arguments) : this;
                delete this.caller;
                return af
            };
            if (!aa.prototype.init) {
                aa.prototype.init = Q.$F
            }
            if (ae) {
                var ad = function () {};
                ad.prototype = ae.prototype;
                aa.prototype = new ad;
                aa.$parent = {};
                for (var ac in ae.prototype) {
                    aa.$parent[ac] = ae.prototype[ac]
                }
            } else {
                aa.$parent = null
            }
            aa.constructor = Q.Class;
            aa.prototype.constructor = aa;
            Q.extend(aa.prototype, ab[0]);
            Q.extend(aa, {
                $J_TYPE: "class"
            });
            return aa
        };
        W.Class.wrap = function (aa, ab) {
            return function () {
                var ad = this.caller;
                var ac = ab.apply(aa, arguments);
                return ac
            }
        };
        (function (ad) {
            var ac = ad.$;
            var aa = 5,
                ab = 300;
            ad.Event.Custom.btnclick = new ad.Class(ad.extend(ad.Event.Custom, {
                type: "btnclick",
                init: function (ag, af) {
                    var ae = af.jGetPageXY();
                    this.x = ae.x;
                    this.y = ae.y;
                    this.clientX = af.clientX;
                    this.clientY = af.clientY;
                    this.timeStamp = af.timeStamp;
                    this.button = af.getButton();
                    this.target = ag;
                    this.pushToEvents(af)
                }
            }));
            ad.Event.Custom.btnclick.handler = {
                options: {
                    threshold: ab,
                    button: 1
                },
                add: function (ae) {
                    this.jStore("event:btnclick:options", ad.extend(ad.detach(ad.Event.Custom.btnclick.handler.options), ae || {}));
                    this.jAddEvent("mousedown", ad.Event.Custom.btnclick.handler.handle, 1);
                    this.jAddEvent("mouseup", ad.Event.Custom.btnclick.handler.handle, 1);
                    this.jAddEvent("click", ad.Event.Custom.btnclick.handler.onclick, 1);
                    if (ad.browser.trident && ad.browser.ieMode < 9) {
                        this.jAddEvent("dblclick", ad.Event.Custom.btnclick.handler.handle, 1)
                    }
                },
                jRemove: function () {
                    this.jRemoveEvent("mousedown", ad.Event.Custom.btnclick.handler.handle);
                    this.jRemoveEvent("mouseup", ad.Event.Custom.btnclick.handler.handle);
                    this.jRemoveEvent("click", ad.Event.Custom.btnclick.handler.onclick);
                    if (ad.browser.trident && ad.browser.ieMode < 9) {
                        this.jRemoveEvent("dblclick", ad.Event.Custom.btnclick.handler.handle)
                    }
                },
                onclick: function (ae) {
                    ae.stopDefaults()
                },
                handle: function (ah) {
                    var ag, ae, af;
                    ae = this.jFetch("event:btnclick:options");
                    if (ah.type != "dblclick" && ah.getButton() != ae.button) {
                        return
                    }
                    if (this.jFetch("event:btnclick:ignore")) {
                        this.jDel("event:btnclick:ignore");
                        return
                    }
                    if ("mousedown" == ah.type) {
                        ag = new ad.Event.Custom.btnclick(this, ah);
                        this.jStore("event:btnclick:btnclickEvent", ag)
                    } else {
                        if ("mouseup" == ah.type) {
                            ag = this.jFetch("event:btnclick:btnclickEvent");
                            if (!ag) {
                                return
                            }
                            af = ah.jGetPageXY();
                            this.jDel("event:btnclick:btnclickEvent");
                            ag.pushToEvents(ah);
                            if (ah.timeStamp - ag.timeStamp <= ae.threshold && Math.sqrt(Math.pow(af.x - ag.x, 2) + Math.pow(af.y - ag.y, 2)) <= aa) {
                                this.jCallEvent("btnclick", ag)
                            }
                            document.jCallEvent("mouseup", ah)
                        } else {
                            if (ah.type == "dblclick") {
                                ag = new ad.Event.Custom.btnclick(this, ah);
                                this.jCallEvent("btnclick", ag)
                            }
                        }
                    }
                }
            }
        })(