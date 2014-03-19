/*
 * sideMenu.js sideMenu.js will assist with sideMenu created. It will support 3 display versions (push, overlay, reveal)
 * Owner: JeongHyun Yoon (jeonghyun.yoon@sk.com)
 * License: SK planet wholly owned
 */

(function ( window, undefined ) {
    /**
     * create SideMenu object
     *
     * @name skp.uiCore.SideMenu
     * @class
     * @example
     * new SideMenu(sideMenuElement, {position: "left", display: "overlay"})
     */
    var SideMenu = function(sideMenuElement, mainPageElement, customOptions){
        var that = this;
        that.options = {
            // sideMenu가 open 상태인지 알려주는 boolean값
            isOpened: false,
            // 실제 sideMenuElement를 저장하는 변수
            sideMenu: null,
            // 실제 mainPageElement를 저장하는 변수
            mainPage: null,
            // mainPage의 backgroundColor를 저장하는 변수
            mainPageBackgroundColor: null,
            // gradient를 적용할 div를 저장
            mainCover: null,
            // sideMenu가 나타나는 경우 animation 속도를 설정하는 변수
            duration: "500ms",
            // sideMenu가 나타나는 경우 사용될 hash 값
            hash: "sideMenuOpen",
            // animation 동작 여부
            animation: true,
            // sideMenu의 위치 설정
            position: "left",
            // animation timing function 적용
            easing: "linear",
            // sideMenu display animation (overlay, reveal, push)
            display: "push",
            // sideMenu가 close되면서 display none으로 설정하는 timer를 저장
            sideMenuDisplayTimer: null,
            // perspective 적용 가능 단말인지 검사
            supportPerspective: false,
            // callback
            onBeforeSideMenuInit: null,
            onBeforeSideMenuOpen: null,
            onBeforeSideMenuClose: null,
            hasTouch : (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
            START_EV: null,
            MOVE_EV: null,
            END_EV: null,
            touchStartX: null,
            touchStartY: null,
            threshold: 10,
            swipeMethod: null,
            touchStartHandlerForRemove: null,
            touchMoveHandlerForRemove: null,
            touchEndHandlerForRemove: null
        };
        // 사용자 입력 options값 설정
        if(customOptions !== undefined){
            that._extend(that.options, customOptions);
        }
        that._init(sideMenuElement, mainPageElement);
    };

    SideMenu.prototype = {
        /**
        * initialization sideMenu object
        * @param {Object} sideMenuElement pass the DOM element for using sideMenu
        */
        _init: function(sideMenuElement, mainPageElement){
            var that = this;

            that.options.START_EV = that.options.hasTouch ? "touchstart" : "mousedown";
            that.options.MOVE_EV =  that.options.hasTouch ? "touchmove" : "mousemove";
            that.options.END_EV =  that.options.hasTouch ? "touchend" : "mouseup";

            // animation 값이 false인 경우 duration값을 0으로 설정하여 animation 효과 없이 수행
            if(!that.options.animation){
                that.options.duration = "0ms";
            }
            // position값이 left또는 right가 아닌경우 left로 자동 설정 ( 잘못된 값이 입력된 경우를 대비한 방어 코드 )
            if(that.options.position !== "left" && that.options.position !== "right"){
                that.options.position = "left";
            }
            that.options.supportPerspective = that._checkSupportPerspective();

            // sideMenu open 상태에서 refresh를 시도하는 경우 기존에 존재하는 sideMenu hash제거
            that._removeSideMenuHash();
            // mainPage를 설정
            that._setMainPage(mainPageElement);

            // sideMenu를 설정
            that._setSideMenu(sideMenuElement);

            that._setMainCover();
            // hashchange event handler 설정
            that._addEvent(window, "hashchange", function(){
                that._hashchangeHandler();
            });
            that._addEvent(that.options.mainPage, that.options.START_EV, that.options.touchStartHandlerForRemove = function(e){
                that._touchStartHandler(e);
            });

            that._addEvent(that.options.mainPage, that.options.END_EV, that.options.touchEndHandlerForRemove = function(e){
                that._touchEndHandler(e);
            });
            // trigger initComplete event
            that._createCustomEvent("initComplete");
        },
        // window.location.hash 설정
        /**
         * @description toggle module for sideMenu toggle
         */
        toggle: function(){
            var that = this;
            if(that.options.isOpened){
                // 이미 sideMenu가 열려 있다면 window.history.back()을 이용해 뒤로가기
                // hash값이 변경되었으므로 위에서 설정한 hashchangeHandler 코드가 수행됨
                window.history.back();
                // trigger closeComplete event
                that._createCustomEvent("closeComplete");
            }else{
                $('#rightMenu').hide();
                that.options.sideMenu.style.cssText += "transition-duration: 0ms; -webkit-transition-duration: 0ms; top: " + window.scrollY + "px;";
                that.options.mainCover.style.cssText += "transition-duration: 0ms; -webkit-transition-duration: 0ms; top: " + window.scrollY + "px;";
                // sideMenu가 닫혀있는 상태라면 hash값을 추가
                // hash값이 변경되었으므로 위에서 설정한 hashchangeHandler 코드가 수행됨
                setTimeout(function(){
                    that.options.sideMenu.style.cssText += " transition-duration: "+ that.options.duration +"; -webkit-transition-duration: "+ that.options.duration +";";
                    window.location.hash += "#" + that.options.hash;
                }, 0);

                // trigger closeComplete event
                that._createCustomEvent("openComplete");
            }
        },
        /**
         * @description open module for sideMenu open
         */
        open: function(){
            var that = this;
            if (that.options.onBeforeSideMenuOpen){
                that.options.onBeforeSideMenuOpen.call(that);
            }
            // open 함수는 sideMenu가 닫혀 있는 상태에서만 수행
            if(!that.options.isOpened){
                $('#rightMenu').hide();
                // document.readyState가 complete상태가 아니라면 loading 또는 interactive 상태
                // loading과 interactive상태에서 hash값을 붙이게 되면 backbutton 입력에 대한 history관리를 할 수가 없음
                that.options.sideMenu.style.cssText += "transition-duration: 0ms; -webkit-transition-duration: 0ms; top: " + window.scrollY + "px;";
                that.options.mainCover.style.cssText += "transition-duration: 0ms; -webkit-transition-duration: 0ms; top: " + window.scrollY + "px;";
                if(document.readyState === "complete"){
                    setTimeout(function(){
                        that.options.sideMenu.style.cssText += " transition-duration: "+ that.options.duration +"; -webkit-transition-duration: "+ that.options.duration +";";
                        window.location.hash += "#" + that.options.hash;
                    }, 0);
                }else{
                    // page loading과 동시에 sideMenu.open()을 이용해 sideMenu를 open하는 경우
                    // window.location.hash에 자동으로 sideMenu hash가 붙어 backbutton관리가 되지 않는 현상을 해결하기 위해
                    // setTimeout 0을 통해 프로그램이 window.location.hash값을 인식할 수 있도록 적용
                        window.location.hash += "#" + that.options.hash;
                }
                // trigger closeComplete event
                that._createCustomEvent("openComplete");
            }
        },
        /**
         * @description close module for sideMenu close
         */
        close: function(){
            if (this.options.onBeforeSideMenuClose){
                this.options.onBeforeSideMenuClose.call(this);
            }

            // close함수는 sideMenu 가 열려있는 상태에서만 수행
            if(this.options.isOpened){
                window.history.back();
                // trigger closeComplete event
                this._createCustomEvent("closeComplete");
            }
        },
        _touchStartHandler: function(e){
            var that = this,
            touch = that.options.START_EV ==="touchstart" ? e.changedTouches[0] : e;
            that.options.touchStartX = touch.clientX;
            that.options.touchStartY = touch.clientY;

            that._addEvent(document, that.options.MOVE_EV, that.options.touchMoveHandlerForRemove = function(e){
                that._touchMoveHandler(e);
            });
        },
        _touchMoveHandler: function(e){
            var that = this,
                touch = that.options.MOVE_EV ==="touchmove" ? e.changedTouches[0] : e;
                touchMoveX = touch.clientX,
                touchMoveY = touch.clientY,
                sideMenuWidth = that.options.sideMenu.offsetWidth;
//            e.preventDefault();
//            that.options.swipeMethod = "swipeLeftOpen";
            if(!that.options.isOpened){
                if(Math.abs(touchMoveX - that.options.touchStartX) > Math.abs(touchMoveY - that.options.touchStartY)){
                    if(touchMoveX > that.options.touchStartX + that.options.threshold){
                        e.preventDefault();
                        that.options.swipeMethod = "swipeLeftOpen";
                    }
                }
            }else{
                e.preventDefault();
            }
        },
        _touchEndHandler: function(e){
            var that = this;
            if(that.options.swipeMethod === "swipeLeftOpen"){
                setTimeout(function(){
                    that.open();
                }, 0);
            }
            that.options.swipeMethod = null;
            that._removeEvent(document, that.options.MOVE_EV, that.options.touchMoveHandlerForRemove);
        },
        _checkSupportPerspective: function(){
            return "WebkitPerspective" in document.body.style ||
                    "MozPerspective" in document.body.style ||
                    "OPerspective" in document.body.style ||
                    "perspective" in document.body.style;
        },
        _checkHash: function(){
            var splitHashText = window.location.hash.split("#"),
                splitHashTextLength = splitHashText.length,
                modifiedHash = "",
                i = 0;
            for(; i < splitHashTextLength; i++){
                if(splitHashText[i] !== this.options.hash){
                    modifiedHash += splitHashText[i];
                }
            }
            return modifiedHash;
        },
        /**
         * @description resetting mainPage, if occur jqm page change, refresh module detect new active page
         */
        refresh: function(mainPageElement){
            this._setMainPage(mainPageElement);
        },
        /**
         * @description create custom event, notify end of sideMenu open or close
         */
        _createCustomEvent: function(eventName){
            var customEvent = document.createEvent("Event"),
                that = this;
            // init Event (eventName, bubbles, cancelable)
            customEvent.initEvent(eventName, false, false);
            if(eventName === "openComplete" || eventName === "closeComplete"){
                setTimeout(function(){
                    that.options.sideMenu.dispatchEvent(customEvent);
                }, parseInt(this.options.duration, 10));

            }else {
                that.options.sideMenu.dispatchEvent(customEvent);
            }
        },
        /**
         * @description detect mainPage and set mainPage's attributes
         */
        _setMainPage: function(mainPageElement){
            this.options.mainPage = mainPageElement;
            // mainPage의 css 속성을 설정
            this.options.mainPage.style.cssText = "transition-duration: " + this.options.duration + "; -webkit-transition-duration: " + this.options.duration + "; transform: translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg); -webkit-transform: translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg); transform-origin: 0% 0%; -webkit-transform-origin: 0% 0%;";
        },
        /**
         * @description set sideMenu attribute
         */
        _setSideMenu: function(sideMenuElement){
            var that = this,
                sideMenuWidth = 0,
                mainPageWidth = 0,
                sideMenu = null;
            // onBeforeSideMenuInit callback 수행
            if(that.options.onBeforeSideMenuInit){
                that.options.onBeforeSideMenuInit.call(that);
            }
            // sideMenu의 css속성을 설정
            that.options.sideMenu = sideMenuElement;
            sideMenu = that.options.sideMenu;
            sideMenu.style.cssText = "position: absolute; top: 0px;";
            sideMenuWidth = sideMenu.offsetWidth;
            mainPageWidth = that.options.mainPage.offsetWidth;
            if(that.options.display === "push"){
                // position에 따라 sideMenu element배치
                // sideMenu의 top값을 설정하기 전과 설정 한 후의 mainPage의 width가 달라짐
                if(that.options.position === "left"){
                    sideMenu.style.cssText += "transform: translate3d(-100%, 0, 0); -webkit-transform: translate3d(-100%, 0, 0);";
                }else{
                    sideMenu.style.cssText += "transform: translate3d("+ mainPageWidth +"px, 0, 0); -webkit-transform: translate3d("+ mainPageWidth +"px, 0, 0)";
                }
            }else if(that.options.display === "reveal"){
                sideMenu.style.zIndex = "-1";
                if(that.options.position === "left"){
                    sideMenu.style.transform = "translate3d(0px, 0, 0)";
                    sideMenu.style.webkitTransform = "translate3d(0px, 0, 0)";
                }else{
                    sideMenu.style.transform = "translate3d("+ (mainPageWidth - sideMenuWidth) +"px, 0, 0)";
                    sideMenu.style.webkitTransform = "translate3d("+ (mainPageWidth - sideMenuWidth) +"px, 0, 0)";
                }
            }else if(that.options.display === "overlay"){
                sideMenu.style.zIndex = "999999";
                if(that.options.position === "left"){
                    sideMenu.style.transform = "translate3d(-100%, 0, 0)";
                    sideMenu.style.webkitTransform = "translate3d(-100%, 0, 0)";
                }else{
                    sideMenu.style.transform = "translate3d("+ mainPageWidth +"px, 0, 0)";
                    sideMenu.style.webkitTransform = "translate3d("+ mainPageWidth +"px, 0, 0)";
                }
            }else if(that.options.display === "3d"){
                sideMenu.parentNode.style.cssText += "-webkit-perspective: 800px; -webkit-perspective-origin: 50% 0%";
                if(that.options.position === "left"){
                    sideMenu.style.cssText += "transform: translate3d(-100%, 0px, 0px); -webkit-transform: translate3d(-100%, 0px, 0px);";
                }else{
                    sideMenu.style.cssText += "transform: translate3d("+ (mainPageWidth-sideMenuWidth) +"px, 0px, 0px); -webkit-transform: translate3d("+ (mainPageWidth-sideMenuWidth) +"px, 0px, 0px);";
                }
            }
            // duration을 다른 css속성과 동시에 설정해 주면, 다른 css속성이 적용되면서 animation이 발생하기 때문에 setTimeout 0을 이용해 다른 css속성이 먼저 적용되도록 설정
            setTimeout(function(){
                sideMenu.style.cssText += "visibility: hidden; transition-duration: " + that.options.duration + "; -webkit-transition-duration: " + that.options.duration + ";";
            }, 0);
        },
        _setMainCover: function(){
            var that = this;

            that.options.mainCover = document.createElement("div");
            if(that.options.position === "left"){
                that.options.mainCover.style.cssText = "position: absolute; width: 100%; left: 241px; height: "+ (document.documentElement.offsetHeight) +"px; top: 0px; z-index: -1000; visibility: hidden; background: -webkit-linear-gradient(" + that.options.position + ", rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);";
            } else {
                that.options.mainCover.style.cssText = "position: absolute; width: 40%; left: 0px; height: "+ (document.documentElement.offsetHeight + 300) +"px; top: 0px; z-index: -1000; visibility: hidden; background: -webkit-linear-gradient(" + that.options.position + ", rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);";
            }
            document.body.appendChild(that.options.mainCover);

            that.options.mainCover.addEventListener(that.options.START_EV, function(e){
                e.preventDefault();
                setTimeout(function(){
                    window.history.back();
                }, 0);
            }, false);
        },
        /**
         * @description hashchangeHandler will be run, if occur hash change event
         */
        _hashchangeHandler: function(){
            var that = this,
                mainPage = that.options.mainPage,
                sideMenu = that.options.sideMenu,
                sideMenuWidth = 0,
                mainPageWidth = 0,
                displayOption = that.options.display;
            // 서로 다른 두개의 sideMenu가 존재하는 경우 현재 sideMenu의 hash값과 비교하여 열고 닫을 수 있도록 설정
            // window.location.hash에 sideMenuOpen이 없다면 // 즉 sideMenu를 open하려는 경우
            if(!!~window.location.hash.indexOf(that.options.hash)){

                // sideMenu를 close하는 도중 다시 open할 경우
                // close 동작 시 setTimeout으로 display : none 설정이 적용되었기 때문에,
                // clearTimeout을 해주지 않으면 open된 상태에서 sidemenu가 사라지는 현상 발생
                if(that.options.sideMenuDisplayTimer !== null){
                    clearTimeout(that.options.sideMenuDisplayTimer);
                }
                // sideMenu.style.visibility = "visible";
                sideMenu.style.cssText += "visibility: visible;";
                sideMenuWidth = sideMenu.offsetWidth;
                mainPageWidth = mainPage.offsetWidth;
                if(displayOption === "push"){
                    if(that.options.position === "left"){
                        sideMenu.style.transform = "translate3d(0, 0, 0)";
                        sideMenu.style.webkitTransform = "translate3d(0, 0, 0)";
                        mainPage.style.transform = "translate3d(" + sideMenuWidth + "px, 0, 0)";
                        mainPage.style.webkitTransform = "translate3d(" + sideMenuWidth + "px, 0, 0)";
                    }else{
                        sideMenu.style.transform = "translate3d(" + (mainPageWidth - sideMenuWidth) + "px, 0, 0)";
                        sideMenu.style.webkitTransform = "translate3d(" + (mainPageWidth - sideMenuWidth) + "px, 0, 0)";
                        mainPage.style.transform = "translate3d(-" + sideMenuWidth + "px, 0, 0)";
                        mainPage.style.webkitTransform = "translate3d(-" + sideMenuWidth + "px, 0, 0)";
                    }
                }else if(displayOption === "reveal"){
                    if(that.options.position === "left"){
                        mainPage.style.transform = "translate3d(" + sideMenuWidth + "px, 0, 0)";
                        mainPage.style.webkitTransform = "translate3d(" + sideMenuWidth + "px, 0, 0)";
                    }else{
                        mainPage.style.transform = "translate3d(-" + sideMenuWidth + "px, 0, 0)";
                        mainPage.style.webkitTransform = "translate3d(-" + sideMenuWidth + "px, 0, 0)";
                    }
                }else if(displayOption === "overlay"){
                    if(that.options.position === "left"){
                        sideMenu.style.transform = "translate3d(0, 0, 0)";
                        sideMenu.style.webkitTransform = "translate3d(0, 0, 0)";
                    }else{
                        sideMenu.style.transform = "translate3d(" + (mainPageWidth - sideMenuWidth) + "px, 0, 0)";
                        sideMenu.style.webkitTransform = "translate3d(" + (mainPageWidth - sideMenuWidth) + "px, 0, 0)";
                    }
                }else if(displayOption === "3d"){
                    if(that.options.supportPerspective){
                        if(that.options.position === "left"){
                            sideMenu.style.cssText += "transform: translate3d(0px, 0px, 0px); -webkit-transform: translate3d(0px, 0px, 0px);";
                            mainPage.style.cssText += "transform: translate3d(" + sideMenuWidth + "px, 0px, 0px); rotate3d(0, 1, 0, 30deg); -webkit-transform: translate3d(" + sideMenuWidth + "px, 0px, 0px) rotate3d(0, 1, 0, 30deg);";
                            that.options.mainCover.style.cssText += "visibility: visible; z-index:1000;";
                        }else{
                            sideMenu.style.cssText += "transform: translate3d(" + (mainPageWidth - sideMenuWidth) + "px, 0px, 0px); -webkit-transform: translate3d(" + (mainPageWidth - sideMenuWidth) + "px, 0px, 0px);";
                            mainPage.style.cssText += "transform: translate3d(" + (0 - sideMenuWidth) + "px, 0px, 0px); rotate3d(0, 1, 0, 30deg); -webkit-transform: translate3d(" + (0 - sideMenuWidth) + "px, 0px, 0px) rotate3d(0, 1, 0, 30deg);";
                            that.options.mainCover.style.cssText += "visibility: visible; z-index:1000;";
                        }
                    }
                }
                that.options.isOpened = true;
            // window.location.hash에 sideMenuOpen이 있다면 // 즉 sideMenu를 close하려는 경우
            // 또는 jqm page의 경우 페이지 이동의 경우
            // sideMenu open을 제외한 hash change가 발생하는 경우
            }else{
                if(that.options.isOpened){
                    if(displayOption === "push"){
                        // position에 따라 sidemenu translate3d속성 설정
                        if(that.options.position === "left"){
                            sideMenu.style.transform = "translate3d(-100%, 0, 0)";
                            sideMenu.style.webkitTransform = "translate3d(-100%, 0, 0)";
                        }else{
                            sideMenu.style.transform = "translate3d("+ mainPage.offsetWidth +"px, 0, 0)";
                            sideMenu.style.webkitTransform = "translate3d("+ mainPage.offsetWidth +"px, 0, 0)";
                        }
                        mainPage.style.transform = "translate3d(0%, 0, 0)";
                        mainPage.style.webkitTransform = "translate3d(0%, 0, 0)";
                    }else if(displayOption === "reveal"){
                        // position에 따라 sidemenu translate3d속성 설정
                        if(that.options.position === "left"){
                            sideMenu.style.transform = "translate3d(0px, 0, 0)";
                            sideMenu.style.webkitTransform = "translate3d(0px, 0, 0)";
                        }else{
                            sideMenu.style.transform = "translate3d("+ (mainPage.offsetWidth - sideMenu.offsetWidth) +"px, 0, 0)";
                            sideMenu.style.webkitTransform = "translate3d("+ (mainPage.offsetWidth - sideMenu.offsetWidth) +"px, 0, 0)";
                        }
                        mainPage.style.transform = "translate3d(0px, 0, 0)";
                        mainPage.style.webkitTransform = "translate3d(0px, 0, 0)";
                    }else if(displayOption === "overlay"){
                        if(that.options.position === "left"){
                            sideMenu.style.transform = "translate3d(-100%, 0, 0)";
                            sideMenu.style.webkitTransform = "translate3d(-100%, 0, 0)";
                        }else{
                            sideMenu.style.transform = "translate3d("+ mainPage.offsetWidth +"px, 0, 0)";
                            sideMenu.style.webkitTransform = "translate3d("+ mainPage.offsetWidth +"px, 0, 0)";
                        }
                    }else if(displayOption === "3d"){
                        if(that.options.position === "left"){
                            sideMenu.style.cssText += "transform: translate3d(-100%, 0, 0); -webkit-transform: translate3d(-100%, 0, 0)";
                        }else{
                            sideMenu.style.cssText += "transform: translate3d("+ mainPage.offsetWidth +"px, 0, 0); -webkit-transform: translate3d("+ mainPage.offsetWidth +"px, 0, 0)";
                        }
                        that.options.mainCover.style.cssText += "visibility: hidden; z-index: -1000;";
                        mainPage.style.cssText += "transform: translate3d(0, 0, 0); -webkit-transform: translate3d(0, 0, 0)";
                    }
                    that.options.sideMenuDisplayTimer = setTimeout(function(){
                        that.options.sideMenu.style.cssText += "visibility: hidden;";
                        that.options.sideMenuDisplayTimer = null;
                    }, parseInt(that.options.duration, 10));
                    that.options.isOpened = false;
                }
            }
        },
        // 만약 사용자가 sideMenu를 Open한 상태에서 refresh를 진행한 경우를 대비한 방어코드
        // sideMenu를 Open하면 hash값이 #sideMenuOpen으로 변경됨,
        // 이 상태에서 refresh를 하면 hash값이 남아있는 상태로 MainPage로 돌아감
        // 이 경우 남아있는 hash를 초기화 주어야 정상동작하므로 SideMenu init함수가 수행 되었을 때 hash가 있는지 없는지 파악하여 hash값을 지움
        /**
         * @description remove sideMenu hash if sideMenu hash is present in window.location.hash
         */
        _removeSideMenuHash: function(){
            // window.location.hash에 options.hash값이 포함되어 있으면 refresh 또는 첫 시작 시 해당 hash값 제거
            if(!!~window.location.hash.indexOf(this.options.hash)){
                window.history.back();
            }
        },
        /**
         * @description add eventListener
         * @param {Object, String, Object} element, type, callback
         */
        _addEvent: function(element, type, callback){
            if(!!element.attachEvent){
                element.attachEvent("on" + type, callback);
            }else{
                element.addEventListener(type, callback, false);
            }
        },
        /**
         * @description remove eventListener
         * @param {Object, String, Object} element, type, callback
         */
        _removeEvent: function(element, type, callback){
            if(!!element.detachEvent){
                element.detachEvent("on" + type, callback);
            }else{
                element.removeEventListener(type, callback, false);
            }
        },
        /**
         * @description extend two Object , return destination
         * @param {Object, Object} destination, source
         */
        _extend: function(destination, source){
            for ( var property in source ){
                destination[property] = source[property];
            }
            return destination;
        }
    };

    if (typeof skp !== "undefined" && typeof skp.uiCore !== "undefined") {
        skp.uiCore.SideMenu = SideMenu;
    } else {
        window.SideMenu = SideMenu;
    }
})(window);
