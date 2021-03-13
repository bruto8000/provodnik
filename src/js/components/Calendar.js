! function (e) {
    "function" == typeof define && define.amd ? define(e) : e()
}(function () {
    "use strict";
    var e, t;
    e = void 0, t = function () {
        var e, t, n = (function (e) {
                ! function (e) {
                    function t(e) {
                        "@babel/helpers - typeof";
                        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                            t = function e(t) {
                                return typeof t
                            }
                        } else {
                            t = function e(t) {
                                return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                            }
                        }
                        return t(e)
                    }

                    function n(e, t) {
                        if (!(e instanceof t)) {
                            throw new TypeError("Cannot call a class as a function")
                        }
                    }

                    function a(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            a.enumerable = a.enumerable || false;
                            a.configurable = true;
                            if ("value" in a) a.writable = true;
                            Object.defineProperty(e, a.key, a)
                        }
                    }

                    function i(e, t, n) {
                        if (t) a(e.prototype, t);
                        if (n) a(e, n);
                        return e
                    }

                    function r(e, t, n) {
                        if (t in e) {
                            Object.defineProperty(e, t, {
                                value: n,
                                enumerable: true,
                                configurable: true,
                                writable: true
                            })
                        } else {
                            e[t] = n
                        }
                        return e
                    }
                    if (Object.defineProperty(e, "__esModule", {
                            value: true
                        }), e["default"] = void 0, typeof NodeList !== "undefined" && !NodeList.prototype.forEach) {
                        NodeList.prototype.forEach = function (e, t) {
                            t = t || window;
                            for (var n = 0; n < this.length; n++) {
                                e.call(t, this[n], n, this)
                            }
                        }
                    }
                    if (typeof Element !== "undefined" && !Element.prototype.matches) {
                        var s = Element.prototype;
                        Element.prototype.matches = s.msMatchesSelector || s.webkitMatchesSelector
                    }
                    if (typeof Element !== "undefined" && !Element.prototype.closest) {
                        Element.prototype.closest = function (e) {
                            var t = this;
                            if (!document.documentElement.contains(t)) return null;
                            do {
                                if (t.matches(e)) return t;
                                t = t.parentElement || t.parentNode
                            } while (t !== null && t.nodeType == 1);
                            return null
                        }
                    }
                    var o = function () {
                        function D(e) {
                            var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                            n(this, D);
                            r(this, "element", void 0);
                            r(this, "options", void 0);
                            r(this, "_dataSource", void 0);
                            r(this, "_mouseDown", void 0);
                            r(this, "_rangeStart", void 0);
                            r(this, "_rangeEnd", void 0);
                            r(this, "_responsiveInterval", void 0);
                            r(this, "_nbCols", void 0);
                            r(this, "clickDay", void 0);
                            r(this, "dayContextMenu", void 0);
                            r(this, "mouseOnDay", void 0);
                            r(this, "mouseOutDay", void 0);
                            r(this, "renderEnd", void 0);
                            r(this, "selectRange", void 0);
                            r(this, "yearChanged", void 0);
                            if (e instanceof HTMLElement) {
                                this.element = e
                            } else if (typeof e === "string") {
                                this.element = document.querySelector(e)
                            } else {
                                throw new Error("The element parameter should be a DOM node or a selector")
                            }
                            this.element.classList.add("calendar");
                            this._initializeEvents(t);
                            this._initializeOptions(t);
                            this.setYear(this.options.startYear)
                        }
                        i(D, [{
                            key: "_initializeOptions",
                            value: function e(t) {
                                if (t == null) {
                                    t = {}
                                }

                                this.options = {
                                    startYear: !isNaN(parseInt(t.startYear)) ? parseInt(t.startYear) : (new Date).getFullYear(),
                                    minDate: t.minDate instanceof Date ? t.minDate : null,
                                    maxDate: t.maxDate instanceof Date ? t.maxDate : null,
                                    language: t.language != null && D.locales[t.language] != null ? t.language : "en",
                                    allowOverlap: t.allowOverlap != null ? t.allowOverlap : true,
                                    displayWeekNumber: t.displayWeekNumber != null ? t.displayWeekNumber : false,
                                    displayDisabledDataSource: t.displayDisabledDataSource != null ? t.displayDisabledDataSource : false,
                                    displayHeader: t.displayHeader != null ? t.displayHeader : true,
                                    alwaysHalfDay: t.alwaysHalfDay != null ? t.alwaysHalfDay : false,
                                    enableRangeSelection: t.enableRangeSelection != null ? t.enableRangeSelection : false,
                                    disabledDays: t.disabledDays instanceof Array ? t.disabledDays : [],
                                    disabledWeekDays: t.disabledWeekDays instanceof Array ? t.disabledWeekDays : [],
                                    hiddenWeekDays: t.hiddenWeekDays instanceof Array ? t.hiddenWeekDays : [],
                                    roundRangeLimits: t.roundRangeLimits != null ? t.roundRangeLimits : false,
                                    dataSource: t.dataSource instanceof Array || typeof t.dataSource === "function" ? t.dataSource : [],
                                    style: t.style == "background" || t.style == "border" || t.style == "custom" ? t.style : "border",
                                    enableContextMenu: t.enableContextMenu != null ? t.enableContextMenu : false,
                                    contextMenuItems: t.contextMenuItems instanceof Array ? t.contextMenuItems : [],
                                    customDayRenderer: typeof t.customDayRenderer === "function" ? t.customDayRenderer : null,
                                    customDataSourceRenderer: typeof t.customDataSourceRenderer === "function" ? t.customDataSourceRenderer : null,
                                    weekStart: !isNaN(parseInt(t.weekStart)) ? parseInt(t.weekStart) : null,
                                    loadingTemplate: typeof t.loadingTemplate === "string" || t.loadingTemplate instanceof HTMLElement ? t.loadingTemplate : null
                                };

                                if (this.options.dataSource instanceof Array) {
                                    this._dataSource = this.options.dataSource;
                                    this._initializeDatasourceColors()
                                }
                            }
                        }, {
                            key: "_initializeEvents",
                            value: function e(t) {
                                if (t == null) {
                                    t = []
                                }
                                if (t.yearChanged) {
                                    this.element.addEventListener("yearChanged", t.yearChanged)
                                }
                                if (t.renderEnd) {
                                    this.element.addEventListener("renderEnd", t.renderEnd)
                                }
                                if (t.clickDay) {
                                    this.element.addEventListener("clickDay", t.clickDay)
                                }
                                if (t.dayContextMenu) {
                                    this.element.addEventListener("dayContextMenu", t.dayContextMenu)
                                }
                                if (t.selectRange) {
                                    this.element.addEventListener("selectRange", t.selectRange)
                                }
                                if (t.mouseOnDay) {
                                    this.element.addEventListener("mouseOnDay", t.mouseOnDay)
                                }
                                if (t.mouseOutDay) {
                                    this.element.addEventListener("mouseOutDay", t.mouseOutDay)
                                }
                            }
                        }, {
                            key: "_fetchDataSource",
                            value: function e(t) {
                                if (typeof this.options.dataSource === "function") {
                                    var n = this.options.dataSource;
                                    if (n.length == 2) {
                                        n(this.options.startYear, t)
                                    } else {
                                        var a = n(this.options.startYear);
                                        if (a instanceof Array) {
                                            t(a)
                                        } else {
                                            a.then(t)
                                        }
                                    }
                                } else {
                                    t(this.options.dataSource)
                                }
                            }
                        }, {
                            key: "_initializeDatasourceColors",
                            value: function e() {
       ///COLOR ININ BRUTO                  
 console.log(this._dataSource)
       for (var t = 0; t < this._dataSource.length; t++) {
                                    if (this._dataSource[t].color == null) {
                                        console.log('NULL COLLOR')
                                        this._dataSource[t].color = D.colors[t % D.colors.length]
                                    }
                                }
                            }
                        }, {
                            key: "render",
                            value: function e() {
                                var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                                while (this.element.firstChild) {
                                    this.element.removeChild(this.element.firstChild)
                                }
                                if (this.options.displayHeader) {
                                    this._renderHeader()
                                }
                                if (t) {
                                    this._renderLoading()
                                } else {


                                    this._renderBody();

                                    this._renderBody();
                                    this._renderDataSource();
                                    this._applyEvents();
                                    var n = this.element.querySelector(".months-container");
                                    n.style.opacity = "0";
                                    n.style.display = "block";
                                    n.style.transition = "opacity 0.5s";
                                    setTimeout(function () {
                                        n.style.opacity = "1";
                                        setTimeout(function () {
                                            return n.style.transition = ""
                                        }, 500)
                                    }, 0);
                                    this._triggerEvent("renderEnd", {
                                        currentYear: this.options.startYear
                                    })
                                }
                            }
                        }, {
                            key: "_renderHeader",
                            value: function e() {
                                var t = document.createElement("div");
                                t.classList.add("calendar-header");
                                var n = document.createElement("table");
                                var a = document.createElement("th");
                                a.classList.add("prev");
                                if (this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 1, 11, 31)) {
                                    a.classList.add("disabled")
                                }
                                var i = document.createElement("span");
                                i.innerHTML = "&lsaquo;";
                                a.appendChild(i);
                                n.appendChild(a);
                                var r = document.createElement("th");
                                r.classList.add("year-title");
                                r.classList.add("year-neighbor2");
                                r.textContent = (this.options.startYear - 2).toString();
                                if (this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 2, 11, 31)) {
                                    r.classList.add("disabled")
                                }
                                n.appendChild(r);
                                var s = document.createElement("th");
                                s.classList.add("year-title");
                                s.classList.add("year-neighbor");
                                s.textContent = (this.options.startYear - 1).toString();
                                if (this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 1, 11, 31)) {
                                    s.classList.add("disabled")
                                }
                                n.appendChild(s);
                                var o = document.createElement("th");
                                o.classList.add("year-title");
                                o.textContent = this.options.startYear.toString();
                                n.appendChild(o);
                                var l = document.createElement("th");
                                l.classList.add("year-title");
                                l.classList.add("year-neighbor");
                                l.textContent = (this.options.startYear + 1).toString();
                                if (this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 1, 0, 1)) {
                                    l.classList.add("disabled")
                                }
                                n.appendChild(l);
                                var d = document.createElement("th");
                                d.classList.add("year-title");
                                d.classList.add("year-neighbor2");
                                d.textContent = (this.options.startYear + 2).toString();
                                if (this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 2, 0, 1)) {
                                    d.classList.add("disabled")
                                }
                                n.appendChild(d);
                                var c = document.createElement("th");
                                c.classList.add("next");
                                if (this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 1, 0, 1)) {
                                    c.classList.add("disabled")
                                }
                                var u = document.createElement("span");
                                u.innerHTML = "&rsaquo;";
                                c.appendChild(u);
                                n.appendChild(c);
                                t.appendChild(n);
                                this.element.appendChild(t)
                            }
                        }, {
                            key: "_renderBody",
                            value: function e() {

                                var t = document.createElement("div");
                                t.classList.add("months-container");
                                for (var n = 0; n < 12; n++) {

                                    var a = document.createElement("div");
                                    a.classList.add("month-container");
                                    a.dataset.monthId = n.toString();
                                    if (this._nbCols) {
                                        a.classList.add("month-".concat(this._nbCols))
                                    }
                                    var i = new Date(this.options.startYear, n, 1);
                                    var r = document.createElement("table");
                                    r.classList.add("month");
                                    var s = document.createElement("thead");
                                    var o = document.createElement("tr");
                                    var l = document.createElement("th");
                                    l.classList.add("month-title");
                                    l.setAttribute("colspan", this.options.displayWeekNumber ? "8" : "7");
                                    l.style.position = 'relative';
                                    l.style.cursor = 'pointer';
            //BRUTOR                        // l.textContent = D.locales[this.options.language].months[n];
                                    l.id = 'monthWrapper' + n;
                                    l.innerHTML = D.locales[this.options.language].months[n] + '<span class="monthSpan" id="monthSpan' +n+ '"></span>';
                                 
                             
                                    o.appendChild(l);
                                    s.appendChild(o);
                                    var d = document.createElement("tr");
                                    if (this.options.displayWeekNumber) {
                                        var c = document.createElement("th");
                                        c.classList.add("week-number");
                                        c.textContent = D.locales[this.options.language].weekShort;
                                        d.appendChild(c)
                                    }
                                    var u = this.options.weekStart ? this.options.weekStart : D.locales[this.options.language].weekStart;
                                    var h = u;
                                    do {
                                        var f = document.createElement("th");
                                        f.classList.add("day-header");
                                        f.textContent = D.locales[this.options.language].daysMin[h];
                                        if (this._isHidden(h)) {
                                            f.classList.add("hidden")
                                        }
                                        d.appendChild(f);
                                        h++;
                                        if (h >= 7) h = 0
                                    } while (h != u);
                                    s.appendChild(d);
                                    r.appendChild(s);
                                    var p = new Date(i.getTime());
                                    var m = new Date(this.options.startYear, n + 1, 0);
                                    while (p.getDay() != u) {
                                        p.setDate(p.getDate() - 1)
                                    }
                                    while (p <= m) {
                                        var y = document.createElement("tr");
                                        if (this.options.displayWeekNumber) {
                                            var c = document.createElement("td");
                                            var g = new Date(p.getTime());
                                            g.setDate(g.getDate() - u + 4);
                                            c.classList.add("week-number");
                                            c.textContent = this.getWeekNumber(g).toString();
                                            y.appendChild(c)
                                        }
                                        do {
                                            var v = document.createElement("td");
                                            v.classList.add("day");
                                            if (this._isHidden(p.getDay())) {
                                                v.classList.add("hidden")
                                            }
                                            if (p < i) {
                                                v.classList.add("old")
                                            } else if (p > m) {
                                                v.classList.add("new")
                                            } else {
                                                if (this._isDisabled(p)) {
                                                    v.classList.add("disabled")
                                                }
                                                var b = document.createElement("div");
                                                b.classList.add("day-content");
                                                b.textContent = p.getDate().toString();
                                                v.appendChild(b);
                                                if (this.options.customDayRenderer) {
                                                    this.options.customDayRenderer(b, p)
                                                }
                                            }
                                            y.appendChild(v);
                                            p.setDate(p.getDate() + 1)
                                        } while (p.getDay() != u);
                                        r.appendChild(y)
                                    }
                                    a.appendChild(r);
                                    t.appendChild(a)
                                }
                                this.element.appendChild(t)
                            }
                        }, {
                            key: "_renderLoading",
                            value: function e() {
                                // console.log("-renderloagin")
                                var t = document.createElement("div");
                                t.classList.add("calendar-loading-container");
                                t.style.minHeight = this._nbCols * 200 + "px";
                                var n = document.createElement("div");
                                n.classList.add("calendar-loading");
                                if (this.options.loadingTemplate) {
                                    // console.log("loading templaye")

                                    if (typeof this.options.loadingTemplate === "string") {

                                        n.innerHTML = this.options.loadingTemplate
                                    } else if (this.options.loadingTemplate instanceof HTMLElement) {
                                        n.appendChild(this.options.loadingTemplate)
                                    }
                                } else {
                                    var a = document.createElement("div");
                                    a.classList.add("calendar-spinner");
                                    for (var i = 1; i <= 3; i++) {
                                        var r = document.createElement("div");
                                        r.classList.add("bounce".concat(i));
                                        a.appendChild(r)
                                    }
                                    n.appendChild(a)
                                }
                                t.appendChild(n);
                                this.element.appendChild(t)
                            }
                        }, {
                            key: "_renderDataSource",
                            value: function e() {
                                var o = this;
                                if (this._dataSource != null && this._dataSource.length > 0) {
                                    this.element.querySelectorAll(".month-container").forEach(function (e) {
                                        var r = parseInt(e.dataset.monthId);
                                        e.style.marginTop="20px"
                                        var t = new Date(o.options.startYear, r, 1);
                                        var n = new Date(o.options.startYear, r + 1, 1);
                                        if ((o.options.minDate == null || n > o.options.minDate) && (o.options.maxDate == null || t <= o.options.maxDate)) {
                                            var s = [];
                                            for (var a = 0; a < o._dataSource.length; a++) {
                                                if (!(o._dataSource[a].startDate >= n) || o._dataSource[a].endDate < t) {
                                                    s.push(o._dataSource[a])
                                                }
                                            }
                                            if (s.length > 0) {
                                                e.querySelectorAll(".day-content").forEach(function (e) {
                                                    var t = new Date(o.options.startYear, r, parseInt(e.textContent));
                                                    var n = new Date(o.options.startYear, r, t.getDate() + 1);
                                                    var a = [];
                                                    if ((o.options.minDate == null || t >= o.options.minDate) && (o.options.maxDate == null || t <= o.options.maxDate)) {
                                                        for (var i = 0; i < s.length; i++) {
                                                            if (s[i].startDate < n && s[i].endDate >= t) {
                                                                a.push(s[i])
                                                            }
                                                        }
                                                        if (a.length > 0 && (o.options.displayDisabledDataSource || !o._isDisabled(t))) {
                                                            o._renderDataSourceDay(e, t, a)
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        }, {
                            key: "_renderDataSourceDay",
                            value: function e(t, n, a) {

    // console.log('WNIMANUUM')                             ;console.log(t, n, a)
    //a PROJECTS    === n - DateObject ==== t - HTMLELEMENTOFDAY
                                var i = t.parentElement;
                                switch (this.options.style) {
                                    case "border":
                                        var r = 0;
                                        if (a.length == 1) {
                                            r = 4
                                        } else if (a.length <= 3) {
                                            r = 2
                                        } else {
                                         r = 4
                                        }
                                        if (r > 0) {
                                            var s = "";
                                            var usedColors = [];
                                            for (let o = 0; o <a.length; o++) {
                                            if(usedColors.includes(a[o].color) || usedColors.length >=3){
                                                continue;
                                            }
                                            usedColors.push(a[o].color)
                               
                                             


                                            }

                                            for (let o = 0; o <usedColors.length; o++) {
                                                
                                                
                                                    if (s != "") {
                                                        s += ","
                                                    }
    
                                                    s += "inset 0 -".concat(3/usedColors.length +( o+1)*(1) , "px 0 0 ").concat(usedColors[o])
                                                }

                                        
                                            // console.log(...usedColors)
                                            // console.log(usedColors.length)
                                            i.style.boxShadow = s
                                        }
                                        break;
                                    case "background":
                                        i.style.backgroundColor = a[a.length - 1].color;
                                        var l = n.getTime();
                                        if (a[a.length - 1].startDate.getTime() == l) {
                                            // console.log('CASE 1')
                                            i.classList.add("day-start");
                                            if (a[a.length - 1].startHalfDay || this.options.alwaysHalfDay) {

                                        
                                                i.classList.add("day-half");
                                                var d = "transparent";


                                                let usedColors = [];
                                                for (let o = 0; o <a.length; o++) {
                                                    if(usedColors.includes(a[o].color) || usedColors.length >=2){
                                                        continue;
                                                    }
                                                    usedColors.push(a[o].color)
                                       
                                                     
        
        
                                                    }


                                            

                                    if(usedColors.length == 1){
                                        i.style.background = usedColors[0];
                                    }else{

                                        i.style.background = "linear-gradient(135deg, ".concat(usedColors[0], ", ").concat(usedColors[0], " 49%, ").concat(usedColors[1], " 51%, ").concat(usedColors[1], ")")
                                    }
                                            }
                                            //  else if (this.options.roundRangeLimits) {
                                            //     console.log('CASE 1-2')
                                            //     i.classList.add("round-left")
                                            // }
                                        } 
                                        // else if (a[a.length - 1].endDate.getTime() == l) {
                                        //     console.log('CASE 2')
                                        //     i.classList.add("day-end");
                                        //     if (a[a.length - 1].endHalfDay || this.options.alwaysHalfDay) {
                                        //         i.classList.add("day-half");
                                        //         var d = "transparent";
                                        //         for (var o = a.length - 2; o >= 0; o--) {
                                        //             if (a[o].endDate.getTime() != l || !a[o].endHalfDay && !this.options.alwaysHalfDay) {
                                        //                 d = a[o].color;
                                        //                 break
                                        //             }
                                        //         }
                                        //         i.style.background = "linear-gradient(135deg, ".concat(a[a.length - 1].color, ", ").concat(a[a.length - 1].color, " 49%, ").concat(d, " 51%, ").concat(d, ")")
                                        //     } else if (this.options.roundRangeLimits) {
                                        //         i.classList.add("round-right")
                                        //     }
                                        // }
                                        break;
                                    case "custom":
                                        if (this.options.customDataSourceRenderer) {
                                            this.options.customDataSourceRenderer.call(this, t, n, a)
                                        }
                                        break
                                }
                            }
                        }, {
                            key: "_applyEvents",
                            value: function e() {
                                var r = this;
                                if (this.options.displayHeader) {
                                    this.element.querySelectorAll(".year-neighbor, .year-neighbor2").forEach(function (e) {
                                        e.addEventListener("click", function (e) {
                                            if (!e.currentTarget.classList.contains("disabled")) {
                                                r.setYear(parseInt(e.currentTarget.textContent))
                                            }
                                        })
                                    });
                                    this.element.querySelector(".calendar-header .prev").addEventListener("click", function (e) {
                                        if (!e.currentTarget.classList.contains("disabled")) {
                                            var t = r.element.querySelector(".months-container");
                                            t.style.transition = "margin-left 0.1s";
                                            t.style.marginLeft = "100%";
                                            setTimeout(function () {
                                                t.style.visibility = "hidden";
                                                t.style.transition = "";
                                                t.style.marginLeft = "0";
                                                setTimeout(function () {
                                                    r.setYear(r.options.startYear - 1)
                                                }, 50)
                                            }, 100)
                                        }
                                    });
                                    this.element.querySelector(".calendar-header .next").addEventListener("click", function (e) {
                                        if (!e.currentTarget.classList.contains("disabled")) {
                                            var t = r.element.querySelector(".months-container");
                                            t.style.transition = "margin-left 0.1s";
                                            t.style.marginLeft = "-100%";
                                            setTimeout(function () {
                                                t.style.visibility = "hidden";
                                                t.style.transition = "";
                                                t.style.marginLeft = "0";
                                                setTimeout(function () {
                                                    r.setYear(r.options.startYear + 1)
                                                }, 50)
                                            }, 100)
                                        }
                                    })
                                }
                                var t = this.element.querySelectorAll(".day:not(.old):not(.new):not(.disabled)");
                                t.forEach(function (e) {
                                    e.addEventListener("click", function (e) {
                                        e.stopPropagation();
                                        var t = r._getDate(e.currentTarget);
                                        r._triggerEvent("clickDay", {
                                            element: e.currentTarget,
                                            date: t,
                                            events: r.getEvents(t)
                                        })
                                    });
                                    e.addEventListener("contextmenu", function (e) {
                                        if (r.options.enableContextMenu) {
                                            e.preventDefault();
                                            if (r.options.contextMenuItems.length > 0) {
                                                r._openContextMenu(e.currentTarget)
                                            }
                                        }
                                        var t = r._getDate(e.currentTarget);
                                        r._triggerEvent("dayContextMenu", {
                                            element: e.currentTarget,
                                            date: t,
                                            events: r.getEvents(t)
                                        })
                                    });
                                    if (r.options.enableRangeSelection) {
                                        e.addEventListener("mousedown", function (e) {
                                            if (e.which == 1) {
                                                var t = r._getDate(e.currentTarget);
                                                if (r.options.allowOverlap || r.isThereFreeSlot(t)) {
                                                    r._mouseDown = true;
                                                    r._rangeStart = r._rangeEnd = t;
                                                    r._refreshRange()
                                                }
                                            }
                                        });
                                        e.addEventListener("mouseenter", function (e) {
                                            if (r._mouseDown) {
                                                var t = r._getDate(e.currentTarget);
                                                if (!r.options.allowOverlap) {
                                                    var n = new Date(r._rangeStart.getTime());
                                                    if (n < t) {
                                                        var a = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
                                                        while (n < t) {
                                                            if (!r.isThereFreeSlot(a, false)) {
                                                                break
                                                            }
                                                            n.setDate(n.getDate() + 1);
                                                            a.setDate(a.getDate() + 1)
                                                        }
                                                    } else {
                                                        var a = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1);
                                                        while (n > t) {
                                                            if (!r.isThereFreeSlot(a, true)) {
                                                                break
                                                            }
                                                            n.setDate(n.getDate() - 1);
                                                            a.setDate(a.getDate() - 1)
                                                        }
                                                    }
                                                    t = n
                                                }
                                                var i = r._rangeEnd;
                                                r._rangeEnd = t;
                                                if (i.getTime() != r._rangeEnd.getTime()) {
                                                    r._refreshRange()
                                                }
                                            }
                                        })
                                    }
                                    e.addEventListener("mouseenter", function (e) {
                                        if (!r._mouseDown) {
                                            var t = r._getDate(e.currentTarget);
                                            r._triggerEvent("mouseOnDay", {
                                                element: e.currentTarget,
                                                date: t,
                                                events: r.getEvents(t)
                                            })
                                        }
                                    });
                                    e.addEventListener("mouseleave", function (e) {
                                        var t = r._getDate(e.currentTarget);
                                        r._triggerEvent("mouseOutDay", {
                                            element: e.currentTarget,
                                            date: t,
                                            events: r.getEvents(t)
                                        })
                                    })
                                });
                                if (this.options.enableRangeSelection) {
                                    window.addEventListener("mouseup", function (e) {
                                        if (r._mouseDown) {
                                            r._mouseDown = false;
                                            r._refreshRange();
                                            var t = r._rangeStart < r._rangeEnd ? r._rangeStart : r._rangeEnd;
                                            var n = r._rangeEnd > r._rangeStart ? r._rangeEnd : r._rangeStart;
                                            r._triggerEvent("selectRange", {
                                                startDate: t,
                                                endDate: n,
                                                events: r.getEventsOnRange(t, new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1))
                                            })
                                        }
                                    })
                                }
                                if (this._responsiveInterval) {
                                    clearInterval(this._responsiveInterval);
                                    this._responsiveInterval = null
                                }
                                this._responsiveInterval = setInterval(function () {
                                    if (r.element.querySelector(".month") == null) {
                                        return
                                    }
                                    var e = r.element.offsetWidth;
                                    var t = r.element.querySelector(".month").offsetWidth + 10;
                                    r._nbCols = null;
                                    if (t * 6 < e) {
                                        r._nbCols = 2
                                    } else if (t * 4 < e) {
                                        r._nbCols = 3
                                    } else if (t * 3 < e) {
                                        r._nbCols = 4
                                    } else if (t * 2 < e) {
                                        r._nbCols = 6
                                    } else {
                                        r._nbCols = 12
                                    }
                                    r.element.querySelectorAll(".month-container").forEach(function (t) {
                                        if (!t.classList.contains("month-".concat(r._nbCols))) {
                                            ["month-2", "month-3", "month-4", "month-6", "month-12"].forEach(function (e) {
                                                t.classList.remove(e)
                                            });
                                            t.classList.add("month-".concat(r._nbCols))
                                        }
                                    })
                                }, 300)
                            }
                        }, {
                            key: "_refreshRange",
                            value: function e() {
                                var n = this;
                                this.element.querySelectorAll("td.day.range").forEach(function (e) {
                                    return e.classList.remove("range")
                                });
                                this.element.querySelectorAll("td.day.range-start").forEach(function (e) {
                                    return e.classList.remove("range-start")
                                });
                                this.element.querySelectorAll("td.day.range-end").forEach(function (e) {
                                    return e.classList.remove("range-end")
                                });
                                if (this._mouseDown) {
                                    var a = this._rangeStart < this._rangeEnd ? this._rangeStart : this._rangeEnd;
                                    var i = this._rangeEnd > this._rangeStart ? this._rangeEnd : this._rangeStart;
                                    this.element.querySelectorAll(".month-container").forEach(function (e) {
                                        var t = parseInt(e.dataset.monthId);
                                        if (a.getMonth() <= t && i.getMonth() >= t) {
                                            e.querySelectorAll("td.day:not(.old):not(.new)").forEach(function (e) {
                                                var t = n._getDate(e);
                                                if (t >= a && t <= i) {
                                                    e.classList.add("range");
                                                    if (t.getTime() == a.getTime()) {
                                                        e.classList.add("range-start")
                                                    }
                                                    if (t.getTime() == i.getTime()) {
                                                        e.classList.add("range-end")
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        }, {
                            key: "_getElementPosition",
                            value: function e(t) {
                                var n = 0,
                                    a = 0;
                                do {
                                    n += t.offsetTop || 0;
                                    a += t.offsetLeft || 0;
                                    t = t.offsetParent
                                } while (t);
                                return {
                                    top: n,
                                    left: a
                                }
                            }
                        }, {
                            key: "_openContextMenu",
                            value: function e(t) {
                                var n = this;
                                var a = document.querySelector(".calendar-context-menu");
                                if (a !== null) {
                                    a.style.display = "none";
                                    while (a.firstChild) {
                                        a.removeChild(a.firstChild)
                                    }
                                } else {
                                    a = document.createElement("div");
                                    a.classList.add("calendar-context-menu");
                                    document.body.appendChild(a)
                                }
                                var i = this._getDate(t);
                                var r = this.getEvents(i);
                                for (var s = 0; s < r.length; s++) {
                                    var o = document.createElement("div");
                                    o.classList.add("item");
                                    o.style.paddingLeft = "4px";
                                    o.style.boxShadow = "inset 4px 0 0 0 ".concat(r[s].color);
                                    var l = document.createElement("div");
                                    l.classList.add("content");
                                    var d = document.createElement("span");
                                    d.classList.add("text");
                                    d.textContent = r[s].name;
                                    l.appendChild(d);
                                    var c = document.createElement("span");
                                    c.classList.add("arrow");
                                    c.innerHTML = "&rsaquo;";
                                    l.appendChild(c);
                                    o.appendChild(l);
                                    this._renderContextMenuItems(o, this.options.contextMenuItems, r[s]);
                                    a.appendChild(o)
                                }
                                if (a.children.length > 0) {
                                    var u = this._getElementPosition(t);
                                    a.style.left = u.left + 25 + "px";
                                    a.style.right = "";
                                    a.style.top = u.top + 25 + "px";
                                    a.style.display = "block";
                                    if (a.getBoundingClientRect().right > document.body.offsetWidth) {
                                        a.style.left = "";
                                        a.style.right = "0"
                                    }
                                    setTimeout(function () {
                                        return n._checkContextMenuItemsPosition()
                                    }, 0);
                                    var h = function e(t) {
                                        if (t.type !== "click" || !a.contains(t.target)) {
                                            a.style.display = "none";
                                            window.removeEventListener("click", e);
                                            window.removeEventListener("resize", e);
                                            window.removeEventListener("scroll", e)
                                        }
                                    };
                                    window.addEventListener("click", h);
                                    window.addEventListener("resize", h);
                                    window.addEventListener("scroll", h)
                                }
                            }
                        }, {
                            key: "_renderContextMenuItems",
                            value: function e(t, n, a) {
                                var i = document.createElement("div");
                                i.classList.add("submenu");
                                for (var r = 0; r < n.length; r++) {
                                    if (n[r].visible === false || typeof n[r].visible === "function" && !n[r].visible(a)) {
                                        continue
                                    }
                                    var s = document.createElement("div");
                                    s.classList.add("item");
                                    var o = document.createElement("div");
                                    o.classList.add("content");
                                    var l = document.createElement("span");
                                    l.classList.add("text");
                                    l.textContent = n[r].text;
                                    o.appendChild(l);
                                    if (n[r].click) {
                                        (function (e) {
                                            o.addEventListener("click", function () {
                                                document.querySelector(".calendar-context-menu").style.display = "none";
                                                n[e].click(a)
                                            })
                                        })(r)
                                    }
                                    s.appendChild(o);
                                    if (n[r].items && n[r].items.length > 0) {
                                        var d = document.createElement("span");
                                        d.classList.add("arrow");
                                        d.innerHTML = "&rsaquo;";
                                        o.appendChild(d);
                                        this._renderContextMenuItems(s, n[r].items, a)
                                    }
                                    i.appendChild(s)
                                }
                                if (i.children.length > 0) {
                                    t.appendChild(i)
                                }
                            }
                        }, {
                            key: "_checkContextMenuItemsPosition",
                            value: function e() {
                                var t = document.querySelectorAll(".calendar-context-menu .submenu");
                                t.forEach(function (e) {
                                    var t = e;
                                    t.style.display = "block";
                                    t.style.visibility = "hidden"
                                });
                                t.forEach(function (e) {
                                    var t = e;
                                    if (t.getBoundingClientRect().right > document.body.offsetWidth) {
                                        t.classList.add("open-left")
                                    } else {
                                        t.classList.remove("open-left")
                                    }
                                });
                                t.forEach(function (e) {
                                    var t = e;
                                    t.style.display = "";
                                    t.style.visibility = ""
                                })
                            }
                        }, {
                            key: "_getDate",
                            value: function e(t) {
                                var n = t.querySelector(".day-content").textContent;
                                var a = t.closest(".month-container").dataset.monthId;
                                var i = this.options.startYear;
                                return new Date(i, a, n)
                            }
                        }, {
                            key: "_triggerEvent",
                            value: function e(t, n) {
                                var a = null;
                                if (typeof Event === "function") {
                                    a = new Event(t)
                                } else {
                                    a = document.createEvent("Event");
                                    a.initEvent(t, false, false)
                                }
                                a.calendar = this;
                                for (var i in n) {
                                    a[i] = n[i]
                                }
                                this.element.dispatchEvent(a);
                                return a
                            }
                        }, {
                            key: "_isDisabled",
                            value: function e(t) {
                                if (this.options.minDate != null && t < this.options.minDate || this.options.maxDate != null && t > this.options.maxDate) {
                                    return true
                                }
                                if (this.options.disabledWeekDays.length > 0) {
                                    for (var n = 0; n < this.options.disabledWeekDays.length; n++) {
                                        if (t.getDay() == this.options.disabledWeekDays[n]) {
                                            return true
                                        }
                                    }
                                }
                                if (this.options.disabledDays.length > 0) {
                                    for (var n = 0; n < this.options.disabledDays.length; n++) {
                                        if (t.getTime() == this.options.disabledDays[n].getTime()) {
                                            return true
                                        }
                                    }
                                }
                                return false
                            }
                        }, {
                            key: "_isHidden",
                            value: function e(t) {
                                if (this.options.hiddenWeekDays.length > 0) {
                                    for (var n = 0; n < this.options.hiddenWeekDays.length; n++) {
                                        if (t == this.options.hiddenWeekDays[n]) {
                                            return true
                                        }
                                    }
                                }
                                return false
                            }
                        }, {
                            key: "getWeekNumber",
                            value: function e(t) {
                                var n = new Date(t.getTime());
                                n.setHours(0, 0, 0, 0);
                                n.setDate(n.getDate() + 3 - (n.getDay() + 6) % 7);
                                var a = new Date(n.getFullYear(), 0, 4);
                                return 1 + Math.round(((n.getTime() - a.getTime()) / 864e5 - 3 + (a.getDay() + 6) % 7) / 7)
                            }
                        }, {
                            key: "getEvents",
                            value: function e(t) {
                                return this.getEventsOnRange(t, new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1))
                            }
                        }, {
                            key: "getEventsOnRange",
                            value: function e(t, n) {
                                var a = [];
                                if (this._dataSource && t && n) {
                                    for (var i = 0; i < this._dataSource.length; i++) {
                                        if (this._dataSource[i].startDate < n && this._dataSource[i].endDate >= t) {
                                            a.push(this._dataSource[i])
                                        }
                                    }
                                }
                                return a
                            }
                        }, {
                            key: "isThereFreeSlot",
                            value: function e(t) {
                                var n = this;
                                var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                                var i = this.getEvents(t);
                                if (a === true) {
                                    return !i.some(function (e) {
                                        return !n.options.alwaysHalfDay && !e.endHalfDay || e.endDate > t
                                    })
                                } else if (a === false) {
                                    return !i.some(function (e) {
                                        return !n.options.alwaysHalfDay && !e.startHalfDay || e.startDate < t
                                    })
                                } else {
                                    return this.isThereFreeSlot(t, false) || this.isThereFreeSlot(t, true)
                                }
                            }
                        }, {
                            key: "getYear",
                            value: function e() {
                                return this.options.startYear
                            }
                        }, {
                            key: "setYear",
                            value: function e(t) {
                                var n = this;
                                var a = parseInt(t);
                                if (!isNaN(a)) {
                                    this.options.startYear = a;
                                    while (this.element.firstChild) {
                                        this.element.removeChild(this.element.firstChild)
                                    }
                                    if (this.options.displayHeader) {
                                        this._renderHeader()
                                    }
                                    var i = this._triggerEvent("yearChanged", {
                                        currentYear: this.options.startYear,
                                        preventRendering: false
                                    });
                                    if (typeof this.options.dataSource === "function") {
                                        this.render(true);
                                        this._fetchDataSource(function (e) {
                                            n._dataSource = e;
                                            n._initializeDatasourceColors();
                                            n.render(false)
                                        })
                                    } else {
                                        if (!i.preventRendering) {
                                            this.render()
                                        }
                                    }
                                }
                            }
                        }, {
                            key: "getMinDate",
                            value: function e() {
                                return this.options.minDate
                            }
                        }, {
                            key: "setMinDate",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                if (t instanceof Date || t === null) {
                                    this.options.minDate = t;
                                    if (!n) {
                                        this.render()
                                    }
                                }
                            }
                        }, {
                            key: "getMaxDate",
                            value: function e() {
                                return this.options.maxDate
                            }
                        }, {
                            key: "setMaxDate",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                if (t instanceof Date || t === null) {
                                    this.options.maxDate = t;
                                    if (!n) {
                                        this.render()
                                    }
                                }
                            }
                        }, {
                            key: "getStyle",
                            value: function e() {
                                return this.options.style
                            }
                        }, {
                            key: "setStyle",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.style = t == "background" || t == "border" || t == "custom" ? t : "border";
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getAllowOverlap",
                            value: function e() {
                                return this.options.allowOverlap
                            }
                        }, {
                            key: "setAllowOverlap",
                            value: function e(t) {
                                this.options.allowOverlap = t
                            }
                        }, {
                            key: "getDisplayWeekNumber",
                            value: function e() {
                                return this.options.displayWeekNumber
                            }
                        }, {
                            key: "setDisplayWeekNumber",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.displayWeekNumber = t;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getDisplayHeader",
                            value: function e() {
                                return this.options.displayHeader
                            }
                        }, {
                            key: "setDisplayHeader",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.displayHeader = t;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getDisplayDisabledDataSource",
                            value: function e() {
                                return this.options.displayDisabledDataSource
                            }
                        }, {
                            key: "setDisplayDisabledDataSource",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.displayDisabledDataSource = t;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getAlwaysHalfDay",
                            value: function e() {
                                return this.options.alwaysHalfDay
                            }
                        }, {
                            key: "setAlwaysHalfDay",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.alwaysHalfDay = t;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getEnableRangeSelection",
                            value: function e() {
                                return this.options.enableRangeSelection
                            }
                        }, {
                            key: "setEnableRangeSelection",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.enableRangeSelection = t;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getDisabledDays",
                            value: function e() {
                                return this.options.disabledDays
                            }
                        }, {
                            key: "setDisabledDays",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.disabledDays = t instanceof Array ? t : [];
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getDisabledWeekDays",
                            value: function e() {
                                return this.options.disabledWeekDays
                            }
                        }, {
                            key: "setDisabledWeekDays",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.disabledWeekDays = t instanceof Array ? t : [];
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getHiddenWeekDays",
                            value: function e() {
                                return this.options.hiddenWeekDays
                            }
                        }, {
                            key: "setHiddenWeekDays",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.hiddenWeekDays = t instanceof Array ? t : [];
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getRoundRangeLimits",
                            value: function e() {
                                return this.options.roundRangeLimits
                            }
                        }, {
                            key: "setRoundRangeLimits",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.roundRangeLimits = t;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getEnableContextMenu",
                            value: function e() {
                                return this.options.enableContextMenu
                            }
                        }, {
                            key: "setEnableContextMenu",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.enableContextMenu = t;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getContextMenuItems",
                            value: function e() {
                                return this.options.contextMenuItems
                            }
                        }, {
                            key: "setContextMenuItems",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.contextMenuItems = t instanceof Array ? t : [];
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getCustomDayRenderer",
                            value: function e() {
                                return this.options.customDayRenderer
                            }
                        }, {
                            key: "setCustomDayRenderer",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.customDayRenderer = typeof t === "function" ? t : null;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getCustomDataSourceRenderer",
                            value: function e() {
                                return this.options.customDataSourceRenderer
                            }
                        }, {
                            key: "setCustomDataSourceRenderer",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.customDataSourceRenderer = typeof t === "function" ? t : null;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getLanguage",
                            value: function e() {
                                return this.options.language
                            }
                        }, {
                            key: "setLanguage",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                if (t != null && D.locales[t] != null) {
                                    this.options.language = t;
                                    if (!n) {
                                        this.render()
                                    }
                                }
                            }
                        }, {
                            key: "getDataSource",
                            value: function e() {
                                return this.options.dataSource
                            }
                        }, {
                            key: "setDataSource",
                            value: function e(t) {
                                var n = this;
                                var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.dataSource = t instanceof Array || typeof t === "function" ? t : [];
                                if (typeof this.options.dataSource === "function") {
                                    this.render(true);
                                    this._fetchDataSource(function (e) {
                                        n._dataSource = e;
                                        n._initializeDatasourceColors();
                                        n.render(false)
                                    })
                                } else {
                                    this._dataSource = this.options.dataSource;
                                    this._initializeDatasourceColors();
                                    if (!a) {
                                        this.render()
                                    }
                                }
                            }
                        }, {
                            key: "getWeekStart",
                            value: function e() {
                                return this.options.weekStart ? this.options.weekStart : D.locales[this.options.language].weekStart
                            }
                        }, {
                            key: "setWeekStart",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this.options.weekStart = !isNaN(parseInt(t)) ? parseInt(t) : null;
                                if (!n) {
                                    this.render()
                                }
                            }
                        }, {
                            key: "getLoadingTemplate",
                            value: function e() {

                                return this.options.loadingTemplate
                            }
                        }, {
                            key: "setLoadingTemplate",
                            value: function e(t) {

                                this.options.loadingTemplate = typeof t === "string" || t instanceof HTMLElement ? t : null
                            }
                        }, {
                            key: "addEvent",
                            value: function e(t) {
                                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                                this._dataSource.push(t);
                                if (!n) {
                                    this.render()
                                }
                            }
                        }]);
                        return D
                    }();
                    if (r(e["default"] = o, "locales", {
                            en: {
                                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                                daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                weekShort: "W",
                                weekStart: 0
                            }
                        }), r(o, "colors", ["red", "green"]), (typeof window === "undefined" ? "undefined" : t(window)) === "object") {
                        window.Calendar = o;
                        document.addEventListener("DOMContentLoaded", function () {
                            document.querySelectorAll('[data-provide="calendar"]').forEach(function (e) {
                                return new o(e)
                            })
                        })
                    }
                }(e)
            }((e = {
                exports: {}
            }, e.exports)), e.exports),
            a = (t = n) && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
        ! function (e, t) {
            void 0 === t && (t = {});
            var n = t.insertAt;
            if (e && "undefined" != typeof document) {
                var a = document.head || document.getElementsByTagName("head")[0],
                    i = document.createElement("style");
                i.type = "text/css", "top" === n && a.firstChild ? a.insertBefore(i, a.firstChild) : a.appendChild(i), i.styleSheet ? i.styleSheet.cssText = e : i.appendChild(document.createTextNode(e))
            }
        }('/* =========================================================\n * JS year calendar v0.1.0\n * Repo: https://github.com/year-calendar/js-year-calendar\n * =========================================================\n * Created by Paul David-Sivelle\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n * ========================================================= */\n/* Main */\n.calendar {\n  padding: 4px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  direction: ltr;\n  overflow-x: hidden;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  /* Header */\n  /* Months */\n  /* Loading */\n}\n.calendar:after {\n  /* Apply the right height on the calendar div, even if the months elements are floating  */\n  clear: both;\n  content: "";\n  display: block;\n}\n.calendar .calendar-rtl {\n  direction: rtl;\n}\n.calendar .calendar-rtl .calendar-rtl table tr td span {\n  float: right;\n}\n.calendar table {\n  margin: auto;\n  border-spacing: 0;\n}\n.calendar table td,\n.calendar table th {\n  text-align: center;\n  width: 20px;\n  height: 20px;\n  border: none;\n  padding: 4px 5px;\n  font-size: 12px;\n}\n.calendar .calendar-header {\n  width: 100%;\n  margin-bottom: 20px;\n  border: 1px solid #ddd;\n}\n.calendar .calendar-header table {\n  width: 100%;\n}\n.calendar .calendar-header table th {\n  font-size: 22px;\n  padding: 5px 10px;\n  cursor: pointer;\n}\n.calendar .calendar-header table th:hover {\n  background: #eeeeee;\n}\n.calendar .calendar-header table th.disabled,\n.calendar .calendar-header table th.disabled:hover {\n  background: none;\n  cursor: default;\n  color: white;\n}\n.calendar .calendar-header table th.prev,\n.calendar .calendar-header table th.next {\n  width: 20px;\n}\n.calendar .calendar-header .year-title {\n  font-weight: bold;\n  text-align: center;\n  height: 20px;\n  width: auto;\n}\n.calendar .calendar-header .year-neighbor {\n  opacity: 0.4;\n}\n@media (max-width: 991px) {\n  .calendar .calendar-header .year-neighbor {\n    display: none;\n  }\n}\n.calendar .calendar-header .year-neighbor2 {\n  opacity: 0.2;\n}\n@media (max-width: 767px) {\n  .calendar .calendar-header .year-neighbor2 {\n    display: none;\n  }\n}\n.calendar .months-container {\n  width: 100%;\n  display: none;\n}\n.calendar .months-container .month-container {\n  float: left;\n  text-align: center;\n  height: 200px;\n  padding: 0;\n}\n.calendar .months-container .month-container.month-2 {\n  width: 16.66666667%;\n}\n.calendar .months-container .month-container.month-3 {\n  width: 25%;\n}\n.calendar .months-container .month-container.month-4 {\n  width: 33.33333333%;\n}\n.calendar .months-container .month-container.month-6 {\n  width: 50%;\n}\n.calendar .months-container .month-container.month-12 {\n  width: 100%;\n}\n.calendar table.month th.month-title {\n  font-size: 16px;\n  padding-bottom: 5px;\n}\n.calendar table.month th.day-header {\n  font-size: 14px;\n}\n.calendar table.month tr td,\n.calendar table.month tr th {\n  padding: 0;\n}\n.calendar table.month tr td.hidden,\n.calendar table.month tr th.hidden {\n  display: none;\n}\n.calendar table.month td.week-number {\n  cursor: default;\n  font-weight: bold;\n  border-right: 1px solid #eee;\n  padding: 5px;\n}\n.calendar table.month td.day.round-left {\n  -webkit-border-radius: 8px 0 0 8px;\n  -moz-border-radius: 8px 0 0 8px;\n  border-radius: 8px 0 0 8px;\n}\n.calendar table.month td.day.round-right {\n  webkit-border-radius: 0 8px 8px 0 ;\n  -moz-border-radius: 0 8px 8px 0;\n  border-radius: 0 8px 8px 0;\n}\n.calendar table.month td.day .day-content {\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  padding: 5px 6px;\n}\n.calendar table.month td.old,\n.calendar table.month td.new,\n.calendar table.month td.old:hover,\n.calendar table.month td.new:hover {\n  background: none;\n  cursor: default;\n}\n.calendar table.month td.disabled,\n.calendar table.month td.disabled:hover {\n  color: #dddddd;\n}\n.calendar table.month td.disabled .day-content:hover,\n.calendar table.month td.disabled:hover .day-content:hover {\n  background: none;\n  cursor: default;\n}\n.calendar table.month td.range .day-content {\n  background: rgba(0, 0, 0, 0.2);\n  -webkit-border-radius: 0;\n  -moz-border-radius: 0;\n  border-radius: 0;\n}\n.calendar table.month td.range.range-start .day-content {\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.calendar table.month td.range.range-end .day-content {\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n.calendar .calendar-loading-container {\n  position: relative;\n  text-align: center;\n  min-height: 200px;\n}\n.calendar .calendar-loading-container .calendar-loading {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n}\n.calendar .calendar-spinner {\n  margin: 20px auto;\n  width: 80px;\n  text-align: center;\n}\n.calendar .calendar-spinner > div {\n  width: 16px;\n  height: 16px;\n  margin: 5px;\n  background-color: #333;\n  border-radius: 100%;\n  display: inline-block;\n  -webkit-animation: sk-bouncedelay 1s infinite ease-in-out both;\n  animation: sk-bouncedelay 1s infinite ease-in-out both;\n}\n.calendar .calendar-spinner > div.bounce1 {\n  -webkit-animation-delay: -0.32s;\n  animation-delay: -0.32s;\n}\n.calendar .calendar-spinner > div.bounce2 {\n  -webkit-animation-delay: -0.16s;\n  animation-delay: -0.16s;\n}\n/* Context menu */\n.calendar-context-menu,\n.calendar-context-menu .submenu {\n  border: 1px solid #ddd;\n  background-color: white;\n  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);\n  -webkit-box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);\n  position: absolute;\n  display: none;\n}\n.calendar-context-menu .item {\n  position: relative;\n}\n.calendar-context-menu .item .content {\n  padding: 5px 10px;\n  cursor: pointer;\n  display: table;\n  width: 100%;\n  white-space: nowrap;\n}\n.calendar-context-menu .item .content:hover {\n  background: #eee;\n}\n.calendar-context-menu .item .content .text {\n  display: table-cell;\n}\n.calendar-context-menu .item .content .arrow {\n  display: table-cell;\n  padding-left: 10px;\n  text-align: right;\n}\n.calendar-context-menu .item .submenu {\n  top: -1px;\n  /* Compensate for the border */\n}\n.calendar-context-menu .item .submenu:not(.open-left) {\n  left: 100%;\n}\n.calendar-context-menu .item .submenu.open-left {\n  right: 100%;\n}\n.calendar-context-menu .item:hover > .submenu {\n  display: block;\n}\n.table-striped .calendar table.month tr td,\n.table-striped .calendar table.month tr th {\n  background-color: transparent;\n}\ntable.month td.day .day-content:hover {\n  background: rgba(0, 0, 0, 0.2);\n  cursor: pointer;\n}\n@-webkit-keyframes sk-bouncedelay {\n  0%,\n  80%,\n  100% {\n    -webkit-transform: scale(0);\n  }\n  40% {\n    -webkit-transform: scale(1);\n  }\n}\n@keyframes sk-bouncedelay {\n  0%,\n  80%,\n  100% {\n    -webkit-transform: scale(0);\n    transform: scale(0);\n  }\n  40% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n}\n');

        function i() {
            var e = this.$createElement;
            return (this._self._c || e)("div")
        }
        var r = function (e, t, n, a, i, r, s, o, l, d) {
                "boolean" != typeof s && (l = o, o = s, s = !1);
                var c, u = "function" == typeof n ? n.options : n;
                if (e && e.render && (u.render = e.render, u.staticRenderFns = e.staticRenderFns, u._compiled = !0, i && (u.functional = !0)), a && (u._scopeId = a), r ? (c = function (e) {
                        (e = e || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) || "undefined" == typeof __VUE_SSR_CONTEXT__ || (e = __VUE_SSR_CONTEXT__), t && t.call(this, l(e)), e && e._registeredComponents && e._registeredComponents.add(r)
                    }, u._ssrRegister = c) : t && (c = s ? function () {
                        t.call(this, d(this.$root.$options.shadowRoot))
                    } : function (e) {
                        t.call(this, o(e))
                    }), c)
                    if (u.functional) {
                        var h = u.render;
                        u.render = function (e, t) {
                            return c.call(t), h(e, t)
                        }
                    } else {
                        var f = u.beforeCreate;
                        u.beforeCreate = f ? [].concat(f, c) : [c]
                    } return n
            },
            s = {
                name: "Calendar",
                props: ["allowOverlap", "alwaysHalfDay", "contextMenuItems", "customDayRenderer", "customDataSourceRenderer", "dataSource", "disabledDays", "disabledWeekDays", "displayDisabledDataSource", "displayHeader", "displayWeekNumber", "enableContextMenu", "enableRangeSelection", "hiddenWeekDays", "language", "loadingTemplate", "maxDate", "minDate", "roundRangeLimits", "renderStyle", "weekStart", "year"],
                data: function () {
                    return {
                        shouldRender: false,
                        html: '<h1>SIK</h1>'
                    }
                },
                mounted: function () {
                    var t = this;
                    this.calendar = new a(this.$el, {
                        allowOverlap: this.allowOverlap,
                        alwaysHalfDay: this.alwaysHalfDay,
                        contextMenuItems: this.contextMenuItems,
                        customDayRenderer: this.customDayRenderer,
                        customDataSourceRenderer: this.customDataSourceRenderer,
                        dataSource: this.dataSource,
                        disabledDays: this.disabledDays,
                        disabledWeekDays: this.disabledWeekDays,
                        displayDisabledDataSource: this.displayDisabledDataSource,
                        displayHeader: this.displayHeader,
                        displayWeekNumber: this.displayWeekNumber,
                        enableContextMenu: this.enableContextMenu,
                        enableRangeSelection: this.enableRangeSelection,
                        hiddenWeekDays: this.hiddenWeekDays,
                        language: this.language,
                        loadingTemplate: this.loadingTemplate,
                        maxDate: this.maxDate,
                        minDate: this.minDate,
                        roundRangeLimits: this.roundRangeLimits,
                        style: this.renderStyle,
                        weekStart: this.weekStart,
                        startYear: this.year,
                        clickDay: function (e) {
                            return t.$emit("click-day", e)
                        },
                        dayContextMenu: function (e) {
                            return t.$emit("day-context-menu", e)
                        },
                        mouseOnDay: function (e) {
                            return t.$emit("mouse-on-day", e)
                        },
                        mouseOutDay: function (e) {
                            return t.$emit("mouse-out-day", e)
                        },
                        renderEnd: function (e) {
                            return t.$emit("render-end", e)
                        },
                        selectRange: function (e) {
                            return t.$emit("select-range", e)
                        },
                        yearChanged: function (e) {
                            return t.$emit("year-changed", e)
                        }
                    })
                },
                computed: {
                    allProps: function () {
                        return "\n                ".concat(this.allowOverlap, "\n                ").concat(this.alwaysHalfDay, "\n                ").concat(this.contextMenuItems, "\n                ").concat(this.customDayRenderer, "\n                ").concat(this.customDataSourceRenderer, "\n                ").concat(this.dataSource, "\n                ").concat(this.disabledDays, "\n                ").concat(this.disabledWeekDays, "\n                ").concat(this.displayDisabledDataSource, "\n                ").concat(this.displayHeader, "\n                ").concat(this.displayWeekNumber, "\n                ").concat(this.enableContextMenu, "\n                ").concat(this.enableRangeSelection, "\n                ").concat(this.hiddenWeekDays, "\n                ").concat(this.language, "\n                ").concat(this.loadingTemplate, "\n                ").concat(this.maxDate, "\n                ").concat(this.minDate, "\n                ").concat(this.roundRangeLimits, "\n                ").concat(this.renderStyle, "\n                ").concat(this.weekStart, "\n                ").concat(this.year, "\n            ")
                    }
                },
                watch: {
                    allowOverlap: function (e) {
                        this.calendar.setAllowOverlap(e)
                    },
                    alwaysHalfDay: function (e) {
                        this.calendar.setAlwaysHalfDay(e, !0), this.shouldRender = !0
                    },
                    contextMenuItems: function (e) {
                        this.calendar.setContextMenuItems(e, !0), this.shouldRender = !0
                    },
                    customDayRenderer: function (e) {
                        this.calendar.setCustomDayRenderer(e, !0), this.shouldRender = !0
                    },
                    customDataSourceRenderer: function (e) {
                        this.calendar.setCustomDataSourceRenderer(e, !0), this.shouldRender = !0
                    },
                    dataSource: function (e) {
                        this.calendar.setDataSource(e, !0), this.shouldRender = !0
                    },
                    disabledDays: function (e) {
                        this.calendar.setDisabledDays(e, !0), this.shouldRender = !0
                    },
                    disabledWeekDays: function (e) {
                        this.calendar.setDisabledWeekDays(e, !0), this.shouldRender = !0
                    },
                    displayDisabledDataSource: function (e) {
                        this.calendar.setDisplayDisabledDataSource(e, !0), this.shouldRender = !0
                    },
                    displayHeader: function (e) {
                        this.calendar.setDisplayHeader(e, !0), this.shouldRender = !0
                    },
                    displayWeekNumber: function (e) {
                        this.calendar.setDisplayWeekNumber(e, !0), this.shouldRender = !0
                    },
                    enableContextMenu: function (e) {
                        this.calendar.setEnableContextMenu(e, !0), this.shouldRender = !0
                    },
                    enableRangeSelection: function (e) {
                        this.calendar.setEnableRangeSelection(e, !0), this.shouldRender = !0
                    },
                    hiddenWeekDays: function (e) {
                        this.calendar.setHiddenWeekDays(e, !0), this.shouldRender = !0
                    },
                    language: function (e) {
                        this.calendar.setLanguage(e, !0), this.shouldRender = !0
                    },
                    loadingTemplate: function (e) {
                        this.calendar.setLoadingTemplate(e, !0)
                    },
                    maxDate: function (e) {
                        this.calendar.setMaxDate(e, !0), this.shouldRender = !0
                    },
                    minDate: function (e) {
                        this.calendar.setMinDate(e, !0), this.shouldRender = !0
                    },
                    roundRangeLimits: function (e) {
                        this.calendar.setRoundRangeLimits(e, !0), this.shouldRender = !0
                    },
                    renderStyle: function (e) {
                        this.calendar.setStyle(e, !0), this.shouldRender = !0
                    },
                    weekStart: function (e) {
                        this.calendar.setWeekStart(e, !0), this.shouldRender = !0
                    },
                    year: function (e) {
                        this.calendar.setYear(e)
                    },
                    allProps: function () {
                        this.shouldRender && (this.calendar.render(), this.shouldRender = !1)
                    }
                },
                locales: a.locales
            };
        i._withStripped = !0;
        return r({
            render: i,
            staticRenderFns: []
        }, void 0, s, void 0, !1, void 0, void 0, void 0)
    }, "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).Calendar = t()
});