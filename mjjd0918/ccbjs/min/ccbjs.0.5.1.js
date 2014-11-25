/*! ccbjs - v0.5.1 - 2014-09-14
* undefined
* Copyright (c) 2014 ; Licensed  */
this.ccb=this.ccb||{};

(function(){
    ccb.version = "0.1.1";
    ccb.global = window;
    ccb.useMouseMove = false;

//  选择器
    ccb.$ = function(selector)
    {
        return selector.charAt(0)=='#'?document.getElementById(selector.substr(1)):document.getElementsByTagName(selector);
    };

// 创建元素
    ccb.$new = function(name)
    {
        return document.createElement(name);
    };
    ccb.canvas =document.createElement("canvas");
//  画布
    ccb.ctx = ccb.canvas.getContext("2d");
    /**
     * 弧度转角度
     * @param angle 弧度
     * @returns {Number}
     */
    ccb.radianToDegree = function(angle)
    {
        return angle * (180.0 / Math.PI);
    };

    /**
     * 角度转弧度
     * @param angle 角度
     * @returns {Number}
     */
    ccb.degreeToRadian = function(angle)
    {
        return Math.PI * angle / 180.0;
    };
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 80);
            };
    })();

    /**
     * 屏幕自适应参数
     * @type {{Ratio: string, Fill: string, Custom: string}}
     */
    ccb.screenAdjust={
        Ratio:"Ratio",
        Fill:"Fill",
        Custom:"Custom"
    };
    /**
     * 获取屏大小
     */
    ccb.getScreenSize=function(){
        var screenW=window.document.documentElement.clientWidth;
        var screenH=window.document.documentElement.clientHeight;
        return {width:screenW,height:screenH};
    };
    /**
     * 添加事件 resize
     */
    window.addEventListener("resize",function(){
        if(ccb.stage && ccb.stage._isAutoAdjustToBrowser ){
            ccb.stage.adjustToBrowser(ccb.stage._AdjustType);
        }
    });
    Function.prototype.bind=function(bind)
    {
        var self=this;
        return function()
        {
            var args=Array.prototype.slice.call(arguments);
            return self.apply(bind||null,args);
        };
    };
    /**
     * 面积检测
     * @param	p1 范围点
     * @param	p2 范围点
     * @param	p3 范围点
     * @return
     */
    ccb.hitTrianglePoint=function(p1,p2,p3)
    {
        if ((p2.x-p1.x)*(p2.y+p1.y)+(p3.x-p2.x)*(p3.y+p2.y)+(p1.x-p3.x)*(p1.y+p3.y)<0)
        {
            return 1;
        }
        else
        {
            return 0;
        };
    };


    /**
     * 顶点碰撞检测
     * @param p1 范围点
     * @param p2 范围点
     * @param p3 范围点
     * @param p4 碰撞点
     * @returns {boolean}
     */
    ccb.hitPoint=function(p1,p2,p3,p4)
    {

        var a = ccb.hitTrianglePoint(p1,p2,p3),
             b = ccb.hitTrianglePoint(p4,p2,p3),
             c = ccb.hitTrianglePoint(p1,p2,p4),
             d = ccb.hitTrianglePoint(p1,p4,p3);

        if ((b==a)&&(c==a)&&(d==a))
        {
            return true;
        }
        else
        {
            return false;

        };
    }

//  检查是否点在显示对象的矩形内
    ccb.isHitObj=function(point,obj){
//  	把矩形分割为两个三角形
        var a={x:obj.x-obj.width/2,y:obj.y-obj.height/2},
            b={x:obj.x+obj.width/2,y:obj.y-obj.height/2},
            c={x:obj.x+obj.width/2,y:obj.y+obj.height/2},
            d={x:obj.x-obj.width/2,y:obj.y+obj.height/2};
        return (ccb.hitPoint(a,b,c,point)||ccb.hitPoint(a,c,d,point));
    }
    //   获取标签元素的偏移

    ccb.getElementOffset = function(elem)
    {
        var left = elem.offsetLeft, top = elem.offsetTop;
        while((elem = elem.offsetParent) && elem != document.body && elem != document)
        {
            left += elem.offsetLeft;
            top += elem.offsetTop;
        }
        return {left:left, top:top};
    };

})();
(function(globalNamespace){
//    "use strict";

    /**
     *
     * @param method
     * @param name
     * @private
     */
    function applyMethodName(method, name)
    {
        method.toString = function () { return name; };
    }

    /**
     *
     * @param NewClass
     * @param name
     * @private
     */
    function applyConstructorName(NewClass, name)
    {
        NewClass.toString = function () { return name; };
    }

    /**
     *
     * @param NewClass
     * @param name
     * @private
     */
    function applyClassNameToPrototype(NewClass, name)
    {
        NewClass.prototype.toString = function () { return name; };
    }


    var Class = function (classPath, classDefinition, local)
    {
        var SuperClass, implementations, className, Initialize, ClassConstructor;

        if (arguments.length < 2)
        {
            classDefinition = classPath;
            classPath = "";
        }

        SuperClass = classDefinition['Extends'] || null;
        delete classDefinition['Extends'];

        implementations = classDefinition['Implements'] || null;
        delete classDefinition['Implements'];

        Initialize = classDefinition['initialize'] || null;
        delete classDefinition['initialize'];

        if (!Initialize)
        {
            if (SuperClass)
            {
                Initialize = function () { SuperClass.apply(this, arguments); };
            }
            else
            {
                Initialize = function () {};
            }
        }

        className = classPath.substr(classPath.lastIndexOf('.') + 1);
        ClassConstructor = new Function('initialize', 'return function ' + className + '() { initialize.apply(this, arguments); }')(Initialize);
        applyConstructorName(ClassConstructor, classPath);

        Class['inherit'](ClassConstructor, SuperClass);

        Class['implement'](ClassConstructor, implementations);

        applyClassNameToPrototype(ClassConstructor, classPath);

        Class['extend'](ClassConstructor, classDefinition, true);

        if(!local)
        {
            Class['namespace'](classPath, ClassConstructor);
        }

        return ClassConstructor;
    };

    /**
     *
     * @param target
     * @param extension
     * @param shouldOverride
     * @private
     */
    Class['augment'] = function (target, extension, shouldOverride)
    {
        var propertyName, property, targetHasProperty,
            propertyWouldNotBeOverriden, extensionIsPlainObject, className;

        for (propertyName in extension)
        {
            if (extension.hasOwnProperty(propertyName))
            {
                targetHasProperty = target.hasOwnProperty(propertyName);
                if (shouldOverride || !targetHasProperty)
                {
                    property = target[propertyName] = extension[propertyName];
                    if (typeof property === 'function')
                    {
                        extensionIsPlainObject = (extension.toString === Object.prototype.toString);
                        className = extensionIsPlainObject ? target.constructor : extension.constructor;
                        applyMethodName(property, className + "::" + propertyName);
                    }
                }
            }
        }
    };

    /**
     *
     * @param TargetClass
     * @param extension
     * @param shouldOverride
     * @private
     */
    Class['extend'] = function (TargetClass, extension, shouldOverride)
    {
        if (extension['STATIC'])
        {
            if(TargetClass.Super)
            {
                // add static properties of the super class to the class namespace
                Class['augment'](TargetClass, TargetClass.Super['_STATIC_'], true);
            }
            // add static properties and methods to the class namespace
            Class['augment'](TargetClass, extension['STATIC'], true);
            // save the static definitions into special var on the class namespace
            TargetClass['_STATIC_'] = extension['STATIC'];
            delete extension['STATIC'];
        }
        // add properties and methods to the class prototype
        Class['augment'](TargetClass.prototype, extension, shouldOverride);
    };

    /**
     *
     * @param SubClass
     * @param SuperClass
     * @private
     */
    Class['inherit'] = function (SubClass, SuperClass)
    {
        if (SuperClass)
        {
            var SuperClassProxy = function () {};
            SuperClassProxy.prototype = SuperClass.prototype;

            SubClass.prototype = new SuperClassProxy();
            SubClass.prototype.constructor = SubClass;
            SubClass.Super = SuperClass;

            Class['extend'](SubClass, SuperClass, false);
        }
    };

    /**
     *
     * @param TargetClass
     * @param implementations
     * @private
     */
    Class['implement'] = function (TargetClass, implementations)
    {
        if (implementations)
        {
            var index;
            if (typeof implementations === 'function')
            {
                implementations = [implementations];
            }
            for (index = 0; index < implementations.length; index += 1)
            {
                Class['augment'](TargetClass.prototype, implementations[index].prototype, false);
            }
        }
    };

    /**
     *
     * @param namespacePath
     * @param exposedObject
     * @private
     */
    Class['namespace'] = function (namespacePath, exposedObject)
    {
        if(typeof globalNamespace['define'] === "undefined")
        {
            var classPathArray, className, currentNamespace, currentPathItem, index;
            classPathArray = namespacePath.split('.');
            className = classPathArray[classPathArray.length - 1];
            currentNamespace = globalNamespace;
            for(index = 0; index < classPathArray.length - 1; index += 1)
            {
                currentPathItem = classPathArray[index];
                if(typeof currentNamespace[currentPathItem] === "undefined")
                {
                    currentNamespace[currentPathItem] = {};
                }
                currentNamespace = currentNamespace[currentPathItem];
            }
            currentNamespace[className] = exposedObject;
        }
    };

    //if (typeof define !== "undefined")
    //{
    //    define('Class', [], function () { return Class; });
    //}
    // expose on global namespace like window (browser) or exports (node)
    //else if (globalNamespace)
    //{
        /** @expose */
        globalNamespace['Class'] = Class;
    //}

})(window);

 (function(){
     ccb.Event=Class(
     {
         //  事件类型
         STATIC:{
             KEY_DOWN:"keydown",
             KEY_UP:"keyup",
             KEY_PRESS:"keypress",
             MOUSE_DOWN:"mousedown",
             MOUSE_UP:"mouseup",
             MOUSE_MOVE:"mousemove",
             Enter_Frame:"enterFrame"
         },
         type:"",
         bubbles:null,
    // 	调用事件的目标
         target:null,
    // 	删除事件
         removed:null,
         initialize:function(eventType,bubbles){
             this.type=eventType||"";
             this.bubbles=bubbles||false;
             this.removed=false;
         },
         remove:function(){
             this.removed=true;
         }

     })
 })();

(function(){
    ccb.EventDispatcher=Class(
        {
            //	事件列表,每种事件类型对这一个数组
            // 结构如下：
            //this.eventList={"keydown":[listener1,listener2,listener3,...],
//						"keyup":[listener1,listener2,listener3,...]}
            eventList:null,
            initialize:function(){
                this.eventList={};
            },
    //添加一个某个类型的时间监听器
    addEventListener:function(eventType,listener,bubbles){
        ///eventList.eventType
//		判断eventList中是否存在 eventType这一类型对应的数组，如果过不存在则进行初始化
        if(this.eventList==null)this.eventList={};
        var  list=this.eventList[eventType];
        if(!list){
            list=this.eventList[eventType]=[];
        }
        else{
            //存在 eventType这一类型对应的数组，则先检查是否已经存在相同的监听器，存在则退出函数，不重复添加
            var index=list.indexOf(listener)
            if(index>-1)return;
        }
        //添加监听器到 对应的数组列表
        list.push(listener);
    },
    removeEventListener :function(eventType,listener){
        //		判断eventList中是否存在 eventType这一类型对应的数组，如果过不存在则进行初始化
        if(!this.eventList)return;
        var  list=this.eventList[eventType];
//		如果不存在对应的事件类型的数组，那么删除就没有意义，直接退出函数
        if(!list)return;
//		删除操作
        for (var i=0;i<list.length;i++) {
            if(list[i]===listener){
                list.splice(i,1);
                return;
            }
        }
    },

    dispatchEvent:function(eventObj,target){
        ///this.dispatchEvent("keydown",a)
        //新手可以跳过下边一段注释
        //在有一定的理解之后，可以考虑扩充 dispatchEvent，变为一个自定义事件并且接受自定义传输参数
        //   dispatchEvent(eventObj,target,param)  eventObj.param=param

        if (typeof eventObj == "string")
        {
            /// 		把this.eventList赋值给局部变量listeners
            var listeners = this.eventList;
//          listeners不存在或者 对应的数组类型不存在则退出函数
            if (!listeners || !listeners[eventObj]) { return false; }
//          建立一个新事件
            eventObj = new ccb.Event(eventObj,false);
        }
        eventObj.target = target||this;
//               事件调度执行
        this._dispatchEvent(eventObj);
    },

    _dispatchEvent:function(eventObj){
        var len, listeners = this.eventList;
        if (eventObj && listeners)
        {
            var list = listeners[eventObj.type];
            //不存在相应的监听则返回
            if (!list||!(len=list.length)) { return; }

            eventObj.removed = false;
//                  新开辟一个空间存储原来的元素，避免在事件调度过程中item的添加或删除
            list = list.slice();
            for (var i=0; i<len ; i++)
            {
                var o = list[i];
//                      如果是一个监听的对象，检查是否存在handleEvent函数，否则直接进行调用
                if (o.handleEvent) { o.handleEvent(eventObj); }
                else { o(eventObj); }

                if (eventObj.removed)
                {
                    this.removeEventListener(eventObj.type, o);
                    eventObj.removed = false;
                }
            }
        }

    }

        }
    )
})();


//j键盘事件

(function(){
    ccb.KeyBoardEvent=Class({
        Extends:ccb.Event,
        initialize:function(eventType,bubbles){
            this.type=eventType||"";
            this.bubbles=bubbles||false;
            this.removed=false;
        },
// 	时间戳
        timeStamp:(new Date()).getTime()
    })
})();


    ccb.KEY={
        'MOUSE1': -1,
        'MOUSE2': -3,
        'MWHEEL_UP': -4,
        'MWHEEL_DOWN': -5,
        'BACKSPACE': 8,
        'TAB': 9,
        'ENTER': 13,
        'PAUSE': 19,
        'CAPS': 20,
        'ESC': 27,
        'SPACE': 32,
        'PAGE_UP': 33,
        'PAGE_DOWN': 34,
        'END': 35,
        'HOME': 36,
        'LEFT_ARROW': 37,
        'UP_ARROW': 38,
        'RIGHT_ARROW': 39,
        'DOWN_ARROW': 40,
        'INSERT': 45,
        'DELETE': 46,
        '_0': 48,
        '_1': 49,
        '_2': 50,
        '_3': 51,
        '_4': 52,
        '_5': 53,
        '_6': 54,
        '_7': 55,
        '_8': 56,
        '_9': 57,
        'A': 65,
        'B': 66,
        'C': 67,
        'D': 68,
        'E': 69,
        'F': 70,
        'G': 71,
        'H': 72,
        'I': 73,
        'J': 74,
        'K': 75,
        'L': 76,
        'M': 77,
        'N': 78,
        'O': 79,
        'P': 80,
        'Q': 81,
        'R': 82,
        'S': 83,
        'T': 84,
        'U': 85,
        'V': 86,
        'W': 87,
        'X': 88,
        'Y': 89,
        'Z': 90,
        'NUMPAD_0': 96,
        'NUMPAD_1': 97,
        'NUMPAD_2': 98,
        'NUMPAD_3': 99,
        'NUMPAD_4': 100,
        'NUMPAD_5': 101,
        'NUMPAD_6': 102,
        'NUMPAD_7': 103,
        'NUMPAD_8': 104,
        'NUMPAD_9': 105,
        'MULTIPLY': 106,
        'ADD': 107,
        'SUBSTRACT': 109,
        'DECIMAL': 110,
        'DIVIDE': 111,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123,
        'SHIFT': 16,
        'CTRL': 17,
        'ALT': 18,
        'PLUS': 187,
        'COMMA': 188,
        'MINUS': 189,
        'PERIOD': 190
    };



//鼠标事件

 (function(){
     ccb.MouseEvent=Class({
         Extends:ccb.Event,
         stageX:0,
        stageY:0,
         initialize:function(eventType,bubbles,mouseX,mouseY){
             this.type=eventType||"";
             this.bubbles=bubbles||false;
             this.removed=false;
             this.stageX=mouseX;
             this.stageY=mouseY;
         }
     })
 })();
(function(){
    ccb.Blend=Class({
        STATIC:{
            DEFAULT:"source-over",
            S_OVER:"source-over",
            S_ATOP:"source-atop",
            LIGHTER:"lighter",
            S_IN: "source-in",
            S_OUT:"source-out",
            D_OVER:"destination-over",
            D_ATOP:"destination-atop",
            D_IN: "destination-in",
            D_OUT:"destination-out"
        }
    })
})();
(function(){
    ccb.Stage=Class(
        {
            Extends:ccb.EventDispatcher,
            STATIC:{
                //
                stageWidth:480,
                stageHeight:960,
                mouseX:0,
                mouseY:0,
                scalX:1,
                scalY:1,

                canvas:null,
                ctx:null,
                backGround:"#000"
            },
            displayList:null,
            bufferList:null,
            _initData:function(){
                this.displayList=[];
            },
            initialize:function(canvasid,w,h){
                //格式化数据类型
                this._initData();
               ccb.Stage.stageWidth=this.stageWidth=w;
                ccb.Stage.stageHeight= this.stageHeight=h;

                ccb.Stage.canvas=document.getElementById(canvasid);
                //舞台尺寸
                this.size(w,h);
                this.zoom(1.3,1.3);
                ccb.Stage.ctx=ccb.Stage.canvas.getContext("2d");
                ccb.Stage.ctx.fillStyle= ccb.Stage.backGround;
                ccb['onFrame']=this.onDrawFrame.bind(this);
                ccb['onMouseEventHandle']=this.onMouseEventHandle.bind(this);
                ccb['onKeyBoardEventHandle']=this.onKeyBoardEventHandle.bind(this);

                //鼠标事件
                ccb.Stage.canvas.addEventListener("mousedown", ccb['onMouseEventHandle'], false);
                ccb.Stage.canvas.addEventListener("mouseup", ccb['onMouseEventHandle'], false);
                ccb.Stage.canvas.addEventListener("mousemove", ccb['onMouseEventHandle'], false);

                ccb.Stage.canvas.addEventListener("touchstart",  ccb['onMouseEventHandle'], false);
                ccb.Stage.canvas.addEventListener("touchend",  ccb['onMouseEventHandle'], false);
                ccb.Stage.canvas.addEventListener("touchmove",  ccb['onMouseEventHandle'], false);

                this.onDrawFrame();
            },
            //使用键盘事件
            useKeyBordEvent:function(value){
                if(value){
                    document.addEventListener("keydown", ccb['onKeyBoardEventHandle'], false);
                    document.addEventListener("keyup",  ccb['onKeyBoardEventHandle'], false);
                }else{
                    document.removeEventListener("keydown", ccb['onKeyBoardEventHandle'], false);
                    document.removeEventListener("keyup",  ccb['onKeyBoardEventHandle'], false);
                }
            },
            addChild: function (child) {
                var index=this.displayList.indexOf(child);
                if(index>-1){
                    this.displayList.splice(index,1);
                    this.displayList.push(child);
                }
                else{
                    child.parent=this;
                    this.displayList.push(child);
                }
            },
            removeChild:function(child){
                var  index=this.displayList.indexOf(child);
                if(index>-1){
                    this.displayList.splice(index,1);
                    return true;
                }
                return false;
            } ,
            size:function(w,h){
//                设置尺寸
                ccb.Stage.canvas.width=w;
                ccb.Stage.canvas.height=h;
            },
            zoom:function(scaleX,scaleY){
                ccb.Stage.scaleX=scaleX;
                ccb.Stage.scaleY=scaleY;
                ccb.Stage.canvas.style.width=this.stageWidth*scaleX+"px";
                ccb.Stage.canvas.style.height=this.stageHeight*scaleY+"px";
            },
            /**
             * 设置游戏场景自适应
             * @param AdjustType 自适应类型
             *  ccb.screenAdjust={
                 *       Ratio:"Ratio",
                 *       Fill:"Fill",
                 *       Custom:"Custom"
                 *   };
             */
            adjustToBrowser:function(AdjustType){
                var gW=this.stageWidth,
                    gH=this.stageHeight
                sW=ccb.getScreenSize().width,
                    sH=ccb.getScreenSize().height,
                    gameRatio=gW/gH,
                    screenRatio=sW/sH,
                    scaleX=1,scaleY=1;

                if(this._AdjustType!=AdjustType){
                    this._AdjustType=AdjustType
                }
                switch(AdjustType){
                    case ccb.screenAdjust.Ratio:
                        if(screenRatio<gameRatio){
                            //高度比较大
                            scaleX=scaleY=sW/gW;
                        }
                        else{//宽度大
                            scaleX=scaleY=sH/gH;
                        }
                        break;
                    case ccb.screenAdjust.Fill:
                        scaleX=sW/gW;
                        scaleY=sH/gH;
                        break;
                    case ccb.screenAdjust.Custom:
                        if(this.CustomAutoAdjustToBrowser){
                            var s={ Width:ccb.getScreenSize().width,
                                    Height:ccb.getScreenSize().height},
                                o={	Width:ccb.stage.stageWidth,
                                    Height:ccb.stage.stageHeight};
                            ccb.stage.CustomAutoAdjustToBrowser.apply(ccb.stage,[{Screen:s,Original:o}]);
                        }
                        break;
                    default:
                        if(screenRatio<gameRatio){
                            scaleX=scaleY=sW/gW;
                        }else{
                            scaleX=scaleY=sH/gH;
                        }
                }
                if(AdjustType!=ccb.screenAdjust.Custom){
                    this.zoom(scaleX,scaleY);
                }
            },

            /**
             * 设置用户自定义适应屏幕方案
             */
            CustomAutoAdjustToBrowser:null,
            setCustomAdjust:function(fun){
                if(fun){
                    this._isCustomAdjust=true;
                    this.CustomAutoAdjustToBrowser=fun;
                }
            },
            /**
             * 跟随窗大小改变口开关
             */
            _isAutoAdjustToBrowser:true,
            setAutoAdjustToBrowser:function(value){
                this._isAutoAdjustToBrowser=value;
            },
            //	游戏引擎并没有获取系统底层的硬件I/O设备的API，
//所以在document的基础上原生的I/O事件，进行封装，得到游戏引擎的的鼠标事件，键盘事件等
// 键盘事件
          onKeyBoardEventHandle:function(e){
            //		取消事件的默认动作

            e.preventDefault();
              var type;
            switch (e.type)
            {
                case "keydown":
                    type = ccb.Event.KEY_DOWN;
                    break;
                case "keyup":
                    type =ccb.Event.KEY_UP;
                    break;
                case "keypress":
                    type = ccb.Event.KEY_PRESS;
                    break;
            }
            //var kevent = new KeyboardEvent(type, false);
            this.dispatchEvent(e, this);
        },
//处理鼠标事件
       onMouseEventHandle:function(e){
//		取消事件的默认动作
            e.preventDefault();
            var type = null;
            var hitObj = null;
            switch (e.type)
            {
                case "mousedown":
                case "touchstart":
                    type = ccb.Event.MOUSE_DOWN;
                    break;
                case "mouseup":
                case "touchend":
                    type = ccb.Event.MOUSE_UP;
                    break;
                case "mousemove":
                case "touchmove":
                    type = ccb.Event.MOUSE_MOVE;
                    break;
            }
// 舞台位置
            var stagePos = ccb.getElementOffset(ccb.Stage.canvas);

            if (e.type=="touchstart"|| e.type=="touchmove"|| e.type=="touchend")
            {
                //多触点监测
                if(e.type!="touchend")
                {//第一个点
                    this.tx = e["touches"][0].pageX;
                    this.ty = e["touches"][0].pageY;
                }
            }else
            {
                this.tx = e.pageX;
                this.ty = e.pageY;
            }
//如果舞台有放缩，则要在对xy同样进行放缩
//如(this.tx - pos.left)/scaleX
            ccb.Stage.mouseX = (this.tx - stagePos.left)/ccb.Stage.scaleX;
           ccb.Stage.mouseY = (this.ty - stagePos.top)/ccb.Stage.scaleY;

//新建鼠标事件
            var mevent = new ccb.MouseEvent(type, false,  ccb.Stage.mouseX,  ccb.Stage.mouseY);

// 从显示列表中,应该倒过来遍历，因为显示列表后加入的显示元素的靠近顶层，它的事件也自然越先执行，“ 自顶向下”原则
            for(var i=this.displayList.length-1;i>=0;i--)
            {
                var sp = this.displayList[i];
//子对象点击事件
                if(sp.childen){
                    for(var n=sp.childen.length-1;n>=0;n--)
                    {
                        if (!sp.childen[n].mouseEnabled ) continue;

                        var isHit =ccb.isHitObj({x: ccb.Stage.mouseX-sp.x,y:  ccb.Stage.mouseY-sp.y},sp.childen[n]);
                        if (isHit)
                        {
                            sp.childen[n].dispatchEvent(mevent);
                            break;
                        }
                    }
                }


                //是否开启鼠标事件
                if (!sp.mouseEnabled ) continue;
//		是否点击到了物体
                var isHit =ccb.isHitObj({x: ccb.Stage.mouseX,y:  ccb.Stage.mouseY},sp);
                if (isHit)
                {
                    sp.dispatchEvent(mevent);
                    break;
                }
            }
            //stage 同样可以存在点击事件
            this.dispatchEvent(mevent, sp);

            e.stopPropagation();
            e.preventDefault();
        },
            onDrawFrame:function(){
                ccb.Stage.ctx.fillRect(0,0,ccb.Stage.stageWidth,ccb.Stage.stageHeight);
                this.dispatchEvent(ccb.Event.Enter_Frame);
                    for(var i=0;i<this.displayList.length;i++){
                        this.displayList[i].pain&&this.displayList[i].pain();
                    }
                window.requestAnimFrame( ccb['onFrame']);
            }

        }
    )
})();


(function(){
    ccb.DisplayObject=Class(
        {
            Extends:ccb.EventDispatcher,
            x:0,
            y:0,
            width:0,
            height:0,
            alpha:1,
            rotation:0,
            scaleX:1,
            scaleY:1,
            skewX:0,
            skewY:0,
            name:"",
            _visible:true,
            _userDate:null,
            //中心偏移
            pivotX:0,
            pivotY:0,
            _center:false,
            setCenter:function(value){
              this._center=value;
            },
            getCenter:function(){
                return this._center;
            },
            setPivotX:function(value){
               this.pivotY= value;
            },
            setPivotY:function(value){
                this.pivotY= value;
            },
            getPivotX:function(){
                return this.pivotY;
            },
            getPivotY:function(){
                return this.pivotY;
            },
            getUserData:function(){
               return this._userDate;
            },
            setUserData:function(value){
                this._userDate=value;
            },
            getVisible:function(){
                return this._visible;
            },
            setVisible:function(value){
                this._visible=value;
            },
            getMouseEnabled : function() {  return this.m_mouseEnabled;},
            setMouseEnabled : function(value){ this.m_mouseEnabled = value; }

        }
    )
})();
(function(){
    ccb.Sprite=Class({
        Extends:ccb.DisplayObject,
        STATIC:{

        },
        parent:null,
        texture:null,
        nameId:0,
        //帧偏移
        offsetX:0,
        offsetY:0,
        frameWidth:0,
        frameHeight:0,
        //最大的帧大小
        mFrameWidth:0,
        mFrameHeight:0,
       //裁剪
        cropX:0,
        cropY:0,

        //当前帧序号
        curFrame:0,
        // 动画帧长度
        framesCount:1,
        frameFPS:10,
        animationTime:0,
        blend:"source-over",
        animationData:null,
        //子元素
        childen:null,

        isPlay:false,
        //记录播放动画的时间
        frameTime:0,
        animationFPS:10,
    //	是否循环播放
        loop:false,
     //启用鼠标事件
        mouseEnabled:false,
    //用户数据
        _userData:null,
    //帧脚本
        _scriptList:null,
        initialize:function( texture,animationData){
            this._init(texture,animationData)
        },
        _init:function(texture,animationData){
            this.texture=texture;
            this.animationData=animationData;
            this.frameWidth=this.width=texture.width;
            this.frameHeight=this.height=texture.height;
            this.blend="source-over";
            this.setCenter(true);
            if(!this._center){
                this.pivotX=-this.mFrameWidth/2
                this.pivotY=-this.mFrameHeight/2;
            }
            this.childen=[];
        },
        setTileName:function(name){
            this.nameId=this.getNameId(name);
//            this.isPlay=true;
            this.updateFrameData(0);
        },
        getTilName:function(){
            return this.animationData[this.nameId].name;
        },
        getNameId:function(name){
            for (var i=0;i<this.animationData.length;i++) {
                if(this.animationData[i].name==name){
                    return i;
                }
            }
            return 0;
        },

        play:function(){
            this.isPlay=true;
        },
        stop:function(){
            this.isPlay=false;
        },
        gotoAndPlay:function(frameIndex){
            if(frameIndex<1||frameIndex>this.framesCount){
                frameIndex=1;
            }
            this.curFrame=frameIndex-2;
            this.play();
        },
        gotoAndStop:function(frameIndex){
            if(frameIndex<1||frameIndex>this.framesCount){
                frameIndex=1;
            }
            this.curFrame=frameIndex-1;
            this.updateFrameData(this.curFrame);
            this.stop();
        },
        //规定脚本的回调函数格式
        // {frame:key,fun:function,Param:Array([Param1,Param2,Param3,..]),target:obj}
        //
        addFrameScript:function(frameScript){
            this._scriptList.push(frameScript);
        },
        removeFrameScript:function(frameScript){
            var index=this._scriptList.indexOf(frameScript);
            this._scriptList.splice(index,1);
        },
            //  删除所有帧脚本
        removeAllFrameScript:function(){
            for(var i = 0; i < this._scriptList.length; i++)
            {
                this._scriptList[i] = null;
            }
            this._scriptList = [];
        },
        addChild:function(child){
            if(child instanceof ccb.DisplayObject){
                child.parent =this;
                this.childen.push(child);
            }
        },
        removeChild:function(child){
            var index=this.childen.indexOf(child);
            this.childen.splice(index,1);
        },
        removeAllChilden:function(){
            for(var i=0;i<this.childen.length;i++){
                this.childen[i].dispose&&this.childen[i].dispose();
                this.childen[i]=null;
            }
        },
        updateData:function(){
            //判断精灵是否可见，不可见则不刷新数据，减少cpu的开销
            if(!this._visible)return;
             if(this.animationData){
                 if(this.isPlay){
                     //			   	获取当前系统时间
                     var curtick=Date.now();
                     if( (curtick-this.animationTime)*this.frameFPS>1000)
                     {
                         //              更新数据
//					数据更新的时候把当前的 时间点赋值给 frametime
                         this.animationTime=curtick;
    //                  记录精灵动画当前播放帧序列+1
                         this.curFrame++;
                     }
                     else{return;}
                     //          判断是否超出帧序列
                     if(this.curFrame>=this.framesCount){
                         //			如果当前帧动画选择的是  循环播放则curFrame=0;否则在最后一帧动画后停止
                         if(this.loop){
                             this.curFrame=0;
                         }
                         else{
                             this.curFrame=this.framesCount-1;
                             this.stop();
                         }
                     }
                     //          更新当前帧的数据
                     this.updateFrameData(this.curFrame);
                 }

             }else{
                 this.mFrameWidth= this.frameWidth;
                 this.mFrameHeight=this.frameHeight;
                 this.width= this.frameWidth*this.scaleX;
                 this.height=this.frameHeight*this.scaleY;
            }

    },
        updateFrameData:function(curFrame){
            //	 	当前帧的裁剪开始位置
            this.cropX=this.animationData[this.nameId].frameList[curFrame].x;
            this.cropY=this.animationData[this.nameId].frameList[curFrame].y;
            //      当前帧的大小
            this.frameWidth=this.animationData[this.nameId].frameList[curFrame].width;
            this.frameHeight=this.animationData[this.nameId].frameList[curFrame].height;
            //		帧偏移
            this.offsetX=this.animationData[this.nameId].frameList[curFrame].frameX;
            this.offsetY=this.animationData[this.nameId].frameList[curFrame].frameY;

            //      最大帧的大小
            this.mFrameWidth=this.animationData[this.nameId].frameList[curFrame].frameWidth;
            this.mFrameHeight=this.animationData[this.nameId].frameList[curFrame].frameHeight;

            this.width= this.frameWidth*this.scaleX;
            this.height=this.frameHeight*this.scaleY;

            this.framesCount=this.animationData[this.nameId].frameList.length;
        },
        pain:function(){
            if(!this._visible)return;
//            渲染模式
            this.updateData();
            ccb.Stage.ctx.save();
            ccb.Stage.ctx.globalCompositeOperation=this.blend;
//透明度
            ccb.Stage.ctx.globalAlpha=this.alpha>0?this.alpha:0;
//            不涉及旋转倾斜的时候
//            if(this.rotation%360==0 && this.skewX==0 && this.skewY==0){
//                ccb.Stage.ctx.drawImage(this.texture,this.cropX,this.cropY,
//                                                this.frameWidth,this.frameHeight,
//                                                this.x-this.offsetX- this.width/2,this.y-this.offsetY- this.height/2,
//                                                this.width,this.height);
//                ccb.Stage.ctx.globalCompositeOperation=ccb.Blend.DEFAULT;
//                ccb.Stage.ctx.globalAlpha=1;
//            }else{
//                ccb.Stage.ctx.save();
                ccb.Stage.ctx.translate(this.x,this.y);
                ccb.Stage.ctx.scale(this.scaleX,this.scaleY);
//                ccb.Stage.ctx.transform(1,this.skewX,this.skewY,1,this.x,this.y);
                //转换为弧度
                ccb.Stage.ctx.rotate(this.rotation*Math.PI/180);
//              绘制图像
                ccb.Stage.ctx.drawImage(this.texture,this.cropX,this.cropY,
                                        this.frameWidth,this.frameHeight,
                                        (-this.mFrameWidth/2-this.offsetX-this.pivotX),(-this.mFrameHeight/2-this.offsetY-this.pivotY),
                                        this.frameWidth,this.frameHeight);
                //子对象
                for(var i=0;i<this.childen.length;i++){
                    this.childen[i].pain();
                }
                ccb.Stage.ctx.restore();
//            }
        },
        clone:function(){
            var s=new ccb.Sprite(this.texture,this.animationData);
             s.setTileName(this.getTilName());
            return  s;
        },
        dispose:function(){
            this.removeAllChilden();
            this.parent=null;
            this.texture=null;
            this._visible=true;
            this.isPlay=false;
            this.loop=false;
            this.mouseEnabled=false;
            this._userData=null;
            this._scriptList=null;
        }
    })
})();
(function(){
    ccb.Group=Class({
        Extends:ccb.DisplayObject,
        parent:null,
        blend:"source-over",
        //子元素
        childen:null,
        //启用鼠标事件
        mouseEnabled:false,
        //用户数据
        _userData:null,
        //帧脚本

        initialize:function(){
            this.blend="source-over";
            this.childen=[];
        },
        addChild:function(child){
            if(child instanceof ccb.DisplayObject){
                child.parent=this;
                this.childen.push(child);
            }
        },
        removeChild:function(child){
            var index=this.childen.indexOf(child);
            if(index>-1){
                this.childen.splice(index,1);
                return true;
            }
            return false;
        },
        removeAllChilden:function(){
            for(var i=0;i<this.childen.length;i++){
                this.childen[i].dispose&&this.childen[i].dispose();
                this.childen[i]=null;
            }
        },
        pain:function(){
            if(!this._visible)return;
//            渲染模式
            ccb.Stage.ctx.save();
            ccb.Stage.ctx.globalCompositeOperation=this.blend;
//透明度
            ccb.Stage.ctx.globalAlpha=this.alpha>0?this.alpha:0;
            ccb.Stage.ctx.translate(this.x,this.y);
            ccb.Stage.ctx.scale(this.scaleX,this.scaleY);
//                ccb.Stage.ctx.transform(1,this.skewX,this.skewY,1,this.x,this.y);
            //转换为弧度
            ccb.Stage.ctx.rotate(this.rotation*Math.PI/180);
//              绘制图像
            for(var i=0;i<this.childen.length;i++){
                this.childen[i].pain();
            }
            ccb.Stage.ctx.restore();

        },
        moveToStage:function(child){
            if(this.removeChild(child)){
                child.x=this.x+child.x;
                child.y=this.y+child.y;
                child.rotation=this.rotation+child.rotation;
                child.scaleX=this.scaleX*child.scaleX;
                child.scaleY=this.scaleY*child.scaleY;
                ccb.stage.addChild(child);
            }
        },
        dispose:function(){
            this.removeAllChilden();
            this._visible=true;
            this._userData=null;
        }
    })
})();
(function(){
    ccb.TextFile=Class({
        Extends:ccb.DisplayObject,
        parent:null,
        blend:"source-over",
        //启用鼠标事件
        mouseEnabled:false,
        //用户数据
        _userData:null,
        string:"",
        font:"",
        _font:"",
        fontSize:"12px",
        fontFamily:"arial",
        color:"#000",
        blod:"",
         initialize:function( string,color,style){
            this.init(string,color,style);
        },
        init:function(string,color,style){
            this.string=string;
            this.color=color;
            this.blend="source-over";
            this.font=style||"";
        },
        updateData:function(){
            if(this.font== ""){
                this._font= this.blod+" "+this.fontSize+" "+this.fontFamily;
            }
            else{
                this._font=this.font;
            }

        },
        pain:function(){
            if(!this._visible)return;
//            渲染模式
            this.updateData();
            ccb.Stage.ctx.save();
            ccb.Stage.ctx.globalCompositeOperation=this.blend;
//透明度
            ccb.Stage.ctx.globalAlpha=this.alpha>0?this.alpha:0;

            ccb.Stage.ctx.translate(this.x,this.y);
            ccb.Stage.ctx.scale(this.scaleX,this.scaleY);

            ccb.Stage.ctx.font =this._font;
            //设置字体填充颜色
            ccb.Stage.ctx.fillStyle =this.color;
            //转换为弧度
            ccb.Stage.ctx.rotate(this.rotation*Math.PI/180);

            ccb.Stage.ctx.fillText(this.string,0,0);
            ccb.Stage.ctx.restore();
        },
        clone:function(){
            var s=new ccb.Sprite(this.texture,this.animationData);
            s.setTileName(this.getTilName());
            return  s;
        },
        dispose:function(){
            this.parent=null;
            this._visible=false;
            this.mouseEnabled=false;
            this._userData=null;
        }
    })
})();
(function(){
    ccb.Frame=Class({
        /**
         * 帧名称
         */
        name:"" ,

        /**
         * 帧X坐标
         */
        x: 0 ,

        /**
         * 帧Y坐标
         */
        y :0 ,

        /**
         * 帧宽度
         */
        width:0 ,

        /**
         * 帧高度
         */
        height :0 ,

        /**
         * 帧X偏移坐标
         */
        frameX : 0 ,

        /**
         * 帧Y偏移坐标
         */
        frameY : 0 ,

        /**
         * 帧最大宽度
         */
        frameWidth : 0 ,

        /**
         * 帧最大高度
         */
        frameHeight: 0
    })
})();

    //动画信息
(function(){
    ccb.AnimationData=Class({
        /**
         * 动画片段名
         */
        name:"",
        /**
         * 帧片段
         */
        frameList:null,
        initialize:function(){
            this.frameList=[];
        }
    })
})();


(function() {
    ccb.AnimationXMLReader=Class({

    frameList:null,
    animationDataList:null,
    loadComplete :null,
    loadTarget:null,
    xmlHttp:null,
    initialize:function(){
        this.loadTarget=this;
        this.animationDataList=[];
        this.loadComplete=0;
     },
    createXMLHttpRequest:function(){
        if (window.ActiveXObject){
            //ie 	浏览器
           ccb["xmlHttp"] = new ActiveXObject("Microsoft.XMLHTTP");
        }else if (window.XMLHttpRequest){
            ccb["xmlHttp"] = new XMLHttpRequest("Msxml2.XMLHTTP.3.0");
        };
    },
    //处理响应
    handleStateChange:function(){
        if ( ccb["xmlHttp"].readyState == 4){
            if ( ccb["xmlHttp"].status == 200){
                this.loadTarget.readData();
            };
        };
    },
    //从URL获取xml文件
    getFromURL:function(URL){
        //创建请求
        this.createXMLHttpRequest();
        ccb["xmlHttp"].onreadystatechange = this.handleStateChange.bind(this);
        ccb["xmlHttp"].open("GET",URL,"true");
        ccb["xmlHttp"].send(null);
    },
    //读取XML文件
    addEventListener:function(fun)
    {
        this.loadComplete = fun;
    },
//      删除侦听器
    removeEventListener:function(event)
    {
        switch(event)
        {
            case EVENT_COMPLETE:
                this.loadComplete = null;
                break;
        };
    },
//    解析数据
    readData:function(){
        var results =  ccb["xmlHttp"].responseXML;
        var textureAtlas = results.getElementsByTagName("SubTexture");
        var name="",subTexture;
        this.animationDataList=[];
        var frameList=[];

        for (var i = 0; i< textureAtlas.length; i++){
            subTexture =  textureAtlas[i];
            textureName=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
            if(name!=textureName)
            {
                name=textureName;

                var animationData=new ccb.AnimationData();
                animationData.name=name;
                animationData.frameList=[]  ;
                frameList= animationData.frameList;
                this.animationDataList.push(animationData);
            };

            var cacheframeWidth,cacheframeHeight;

            var frame =new ccb.Frame();
            frame.name=subTexture.getAttribute("name");

            var value;
            frame.x=parseInt(subTexture.getAttribute("x"))||0;

            frame.y=parseInt(subTexture.getAttribute("y")) ||0;

            value=parseInt(subTexture.getAttribute("width"));
            frame.width=value||32;
            cacheframeWidth=frame.width;

            value=parseInt(subTexture.getAttribute("height"));
            frame.height=value||32;
            cacheframeHeight=frame.height;

            frame.frameX=parseInt(subTexture.getAttribute("frameX"))||0;

            frame.frameY=parseInt(subTexture.getAttribute("frameY"))||0;

            value=parseInt(subTexture.getAttribute("frameWidth"));
            frame.frameWidth=value|| cacheframeWidth;

            value=parseInt(subTexture.getAttribute("frameHeight"));
            frame.frameHeight=value|| cacheframeHeight;

            frameList.push(frame);
        }

        if(this.loadComplete!=null){
            this.loadComplete(this);
        };
    }
        })
})();





(function(){
    

///////////////////
//  Animation
///////////////////
ccb.Animation = Class({
    ID : 0,
    _duration : 0.00001,
    _delay : 0,
    _timeSclale : 1,
    _active : null,
    _reversed : false, // 反转
    _startTime : 0, //开始播放时间
    immediateRender : false,
    _paused : false, //暂停
    vars : null, //变量参数
    repeat : 1, // <=-1 无限循环
    isStart : false,
    target : null,
    totalTime : 0,
    isComplete : false,
    _onAnimateStartFired : false,
    _onAnimateStart : null,
    _onAnimateUpdate : null,
    _onAnimateEnd : null,
    callback:null,
    initialize : function() {
        this.callback={};
    },
    getPaused : function() {
        return this._paused;
    },
    setPaused : function(value) {
        this._paused = value;
        return this;
    },
    setDelay : function(value) {
        this.delay = value;
        return this;
    },
    setRepeat : function(value) {
        this.repeat = value;
        return this;
    },
    bind : function(target) {
        this.target = target;
        return this;
    },
    run : function(dt) {

    },
    onStart : function(fun) {
        this.callback["onAnimateStart"] = fun;
        return this;
    },
    onUpdate : function(fun) {
        this.callback["onAnimateUpdate"] = fun;
        return this;
    },
    onEnd : function(fun) {
        this.callback["onAnimateEnd"] = fun;
         return this;
    },
    dispose : function() {
        this._onAnimateStart = null;
        this._onAnimateUpdate = null;
        this._onAnimateEnd = null;
        this.isStart = false;
        this.isComplete = true;
    }
});
//////////

////////
/// Tween
//////////
ccb.Tween = Class({
        Extends : ccb.Animation,
//        _duration : 0.00001,
//        _delay : 0,
//        _timeSclale : 1,
//        _active : null,
//        _reversed : false, // 反转
//        _yoyo : false, //正常-》反转播放
//        immediateRender : false,
        starStatus : null,
        endStatus : null,
//	curStatus : null,
        ease : null,
        _initData : function() {
            this.callback={};
            this.callback["onAnimateStart"]=function(){};
            this.callback["onAnimateUpdate"]=function(){};
            this.callback["onAnimateEnd"]=function(){};

            this._duration = 0.00001;
            this._delay = 0;
            this.totalTime = 0;
            this.starStatus = {};
            this.endStatus = {};
        },
        initialize : function(target, duration, vars) {
            this._initData();
            this.ID =  ccb.RunActionClass.ActionCount + 1;
            this.repeat = vars.repeat || 1;
            if (target != null) {
                this.target = target;
            } else {
                throw "Cannot tween a null target.";
            }
            if (vars != null) {
                this.vars = vars;
            } else {
                throw "Cannot tween a vars.";
            }
            this._duration = duration || 1;
            this._timeSclale = vars.tiemScale || 1;
            this.ease = vars.ease ||
                function(t, b, c, d) {
                    return c * t / d + b;
                };
            this.setStartStaus();
            this.setEndStaus();
            return this;
        },
        setStartStaus : function() {
            var status = {};
            if (this.vars.from == null) {
                for (var p in this.vars.to) {
                    if (this.target["get"+p]!=null) {
                        status[p] = this.target["get"+p]();
                    } else if(this.target[p]!=null) {
                        status[p] = this.target[p];
                    }
                }
            } else {

                for (var p in this.vars.from) {
                    status[p] = this.vars.from[p];
                }
                for (var p in this.vars.to) {
                    if(typeof status[p]=="undefined"){
                        if (this.target["get"+p]!=null) {
                            status[p] = this.target["get"+p]();
                        } else if(this.target[p]!=null) {
                            status[p] = this.target[p];
                        }
                    }
                }
            }
            this.startStatus = status;
        },
        setEndStaus : function() {
            var status = {};
            for (var p in this.vars.to) {
                status[p]=this.vars.to[p];
            }
            for (var p in this.startStatus) {
                if(typeof status[p]== 'undefined'){
                    status[p]=this.startStatus[p];
                }
            }
            this.endStatus = status;
        },
        getStartStaus : function() {
            return this.starStatus;
        },
        getEndStaus : function() {
            return this.endStatus;
        },
        run : function(dt) {
            if(!this.isStart)return;
            //      	动作开始
            if (!this._onAnimateStartFired) {
               this._onAnimateStart&&this._onAnimateStart.call(this);

                this._onAnimateStartFired = true;
            }
            //      		动作中
            if (this.totalTime <= this._duration) {

                if (this.repeat > 0 || this.repeat < 0) {
                    this._onAnimateUpdate&&this._onAnimateUpdate.call(this);
                } else if (this.repeat == 0) {
                    this._onAnimateEnd&& this._onAnimateEnd.call(this);
                }
            } else {
                if (this.repeat > 0) {
                    //重置
                    this.totalTime = 0;
                    this.repeat--;
                }
                //      动作结束
                if (this.repeat == 0) {
                   this._onAnimateEnd&&this._onAnimateEnd.call(this);
                    //停止
                    this.isStart = false;
                    this.isComplete = true;
                }
            }
            this.totalTime += dt;

        },
        _onAnimateStart : function() {
            for (var p in this.startStatus) {
                if (this.target["set"+p]!= null) {
                    this.target["set"+p](this.startStatus[p]);
                } else if(this.target[p]!= null) {
                    this.target[p] = this.startStatus[p];
                }
            }
            this.callback["onAnimateStart"]&&this.callback["onAnimateStart"].call(this.target);
        },
        _onAnimateUpdate : function() {
            for (var p in this.endStatus) {
                tem = this.ease(this.totalTime, this.startStatus[p], this.endStatus[p] - this.startStatus[p], this._duration);
                if (this.target["set"+p]!= null) {
                    this.target["set"+p](tem);
                } else if(this.target[p]!= null){
                    this.target[p] = tem;
                }
            }
            this.callback["onAnimateUpdate"]&&this.callback["onAnimateUpdate"].call(this.target);
        },
        _onAnimateEnd : function() {
            for (var p in this.endStatus) {
                if (this.target["set"+p]!= null) {
                    this.target["set"+p](this.endStatus[p]);
                } else if(this.target[p]!= null){
                    this.target[p] = this.endStatus[p];
                }
            }
            this.callback["onAnimateEnd"]&&this.callback["onAnimateEnd"].call(this.target);
        }
        ////////////////
    }
);
/////////how to use vars ?//////
//vars={
//	delay:0
//repeat:1
//ease:function(){}
//	to:{
//		GPUX:20,
//		X:20,
//		Rotation:360
//	}
//from:{
//		GPUX:20,
//		X:20,
//		Rotation:360
//	}
//tiemScale:1
//}
//////////////
ccb.Tween.To = function(target, duration, vars) {
    var tween = new ccb.Tween(target, duration, vars);

    return tween;
};

///////////////////
//  Action
///////////////////
ccb.Action = Class({
        Extends : ccb.Animation,
        _initData : function() {
            this._duration = 0.00001;
            this.totalTime = 0;
            this.isStart = false;
            this.isComplete = false;
            this._onAnimateStartFired = false;
            this.callback={};
            this.vars = null;
            this._onAnimateStart = null;
            this._onAnimateUpdate = null;
            this._onAnimateEnd = null;
        },
        initialize : function(duration, fun, vars, repeat) {
            this._initData()
            this.ID =  ccb.RunActionClass.ActionCount + 1;
            this._duration = duration;
            this._onAnimateUpdate = fun;
            this.vars = vars || null;
            this.repeat = repeat || 1;
            return this;
        },
        run : function(dt) {
            if (this.vars) {
                //				if(this._onAnimateStartFired){
                //					this.vars.pop();
                //				}
                //				this.vars.push(dt);
            } else {
                this.vars = [dt];
            }

            //      	动作开始
            if (!this._onAnimateStartFired) {
                this.callback["onAnimateStart"]&& this.callback["onAnimateStart"]();
                this._onAnimateStartFired = true;
            }
            //      		动作中
            if (this.totalTime < this._duration) {

                if (this.repeat > 0 || this.repeat < 0) {
                    this.callback["onAnimateUpdate"]&& this.callback["onAnimateUpdate"].apply(this.target, this.vars);
                    } else if (this.repeat == 0) {
                    if (this._onAnimateEnd) {
                        this._onAnimateEnd.apply(this.target, this.vars);
                    }
                }
            } else {
                if (this.repeat > 0) {
                    //重置
                    this.totalTime = 0;
                    this.repeat--;
                }
                //      动作结束
                if (this.repeat == 0) {
                    this.callback["onAnimateEnd"]&& this.callback["onAnimateEnd"].apply(this.target, this.vars);
                    //停止
                    this.isStart = false;
                    this.isComplete = true;
                }
            }
            this.totalTime += dt;
        }
        ///////
    }
);
ccb.Action.CallFunCreate = function(fun, vars) {
    return  new ccb.Action(0.0001, null, vars,0).onEnd(fun);
};
ccb.Action.DelayCreate = function(delay) {
    return new ccb.Action(delay, null, null, 1);
};
 ccb.Action.Create = function(time, fun, vars, repeat) {
    var action = new ccb.Action(time, fun, vars, repeat);
    return action;
};

ccb.Action.CreateTween = function(target, duration, vars) {
    var tween = new ccb.Tween(target, duration, vars),
        Delay = new ccb.Action(duration, null, null, 1);
         tween.callback=Delay.callback;
        ccb.RunAction.Create(null, [tween]);
    return Delay;
};

ccb.Action.CreateKeyFrameAnimation = function(target,frames) {
    var Q=[],duration,time;
    for(var i=0;i<frames.length-1;i++) {
        time=frames[i+1].time-frames[i].time;
        var f=frames[i].frame,t=frames[i+1].frame;
        Q.push(	new ccb.Tween(target, time, {from:f,to:t}))
    }
    duration=frames[frames.length-1].time;
    ccb.RunAction.Create(null,Q);
    return  new ccb.Action(duration, null, null, 1);
};

///////////////
///RunActionClass
//////////////
ccb.RunActionClass = Class({
    //添加事件支持
    Extends:ccb.EventDispatcher,
    STATIC : {
        ActionCount : 0
    },
    ActionsLists : null,
    target : null,
    isRunAC : false,
    stopAction : false,
    curFrame : 0,
    totalFrames : 0,
    dt : 0,
    _lastTime : 0,
    _indelay : false,
    _listener : null,
    _initData : function() {
        this.curFrame = 0;
        this.totalFrames = 0;
        this.isRunAC = false;
        this.ActionsLists = [];
        this._listener = {};
    },
    initialize : function() {
        this._initData();
        this._listener["onFrameUpdate"] = this._onFrameUpdate.bind(this);
        ccb.RunActionClass.ActionCount = 0;
    },

    dispose : function() {
        ccb.stage.removeEventListener(ccb.Event.Enter_Frame, this._listener["onFrameUpdate"]);
        this.isRunAC = false;
        this._onFrameUpdate=null;
        this.ActionsLists = [];
    },
    RunAC : function() {
        ccb.stage.removeEventListener(ccb.Event.Enter_Frame, this._listener["onFrameUpdate"]);
        ccb.stage.addEventListener(ccb.Event.Enter_Frame, this._listener["onFrameUpdate"]);
        this.isRunAC = true;
        this._lastTime = Date.now();
    },
    addAction : function(action) {
        ccb.RunActionClass.ActionCount++;
        action.ID =  ccb.RunActionClass.ActionCount;
        this.ActionsLists.push(action);
    },
    removeAction : function(action) {
        var index = this.ActionsLists.indexOf(action);
        if (index > -1) {
            this.ActionsLists.splice(index, 1);
        }
    },
    getActionId : function(action) {
        var id = null;
        for (var i = 0; i < this.ActionsLists.length; i++) {
            if (this.ActionsLists[i] === action) {
                id = this.ActionsLists[i].ID;
                break;
            }
        }
        return id;
    },
    getActionById : function(id) {
        var action = null;
        for (var i = 0; i < this.ActionsLists.length; i++) {
            if (this.ActionsLists[i].ID === id) {
                action = this.ActionsLists[i];
                break;
            }
        }
        return action;
    },
    _onFrameUpdate : function() {

        if (!this.isRunAC ) {
            return;
        }
        var curTime = Date.now();
        this.dt = (curTime - this._lastTime) / 1000;
        this._lastTime = curTime;

        for (var n = 0; n < this.ActionsLists.length; n++) {
            if (this.ActionsLists[n].length > 0) {
                var ac = this.ActionsLists[n][0];
                if (ac.isStart) {
                    ac.run(this.dt);
                } else {
                    this.ActionsLists[n].splice(0, 1);
                    if (this.ActionsLists[n][0])
                        this.ActionsLists[n][0].isStart = true;
                }
            } else {
                this.removeAction(this.ActionsLists[n]);
            }
        }
    },
    Create : function(target, actionlist) {
        if (actionlist.length > 0) {
            for (var i = 0; i < actionlist.length; i++) {
                if (!actionlist[i].target) {
                    actionlist[i].target = target;
                }
            }
            actionlist[0].isStart = true;
            this.addAction(actionlist);
        }

    }
});

 //管理运行动作
ccb.RunAction = new ccb.RunActionClass();


ccb.Ease = {
//	Result:{
//		Linear:
//	},
    Linear: function(t,b,c,d){
        var cur=t/d;
//  	if(!EaseType.Result.Linear[cur]){
//  		EaseType.Result.Linear[cur]
//  	}
        return c*t/d + b;
    },
    Quad: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t,b,c,d){
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t,b,c,d){
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t,b,c,d){
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t,b,c,d){
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t,b,c,d){
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else{ var s = p/(2*Math.PI) * Math.asin (c/a);}
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else{ var s = p/(2*Math.PI) * Math.asin (c/a);}
            return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
        },
        easeInOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else{ var s = p/(2*Math.PI) * Math.asin (c/a);}
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        }
    },
    Back: {
        easeIn: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t,b,c,d){
            return c - ccb.Ease.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t,b,c,d){
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOut: function(t,b,c,d){
            if (t < d/2) return ccb.Ease.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
            else return ccb.Ease.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    }
}
})();
(function(){
    ccb.Particle=Class({
        //		 粒子纹理资源
        source:null,
        //       初始粒子缩放倍数
        scaleX:1,
        scaleY:1,
        //       初始粒子旋转角度
        rotation:0,
        //       初始粒子的运动速度
        speed:0,
        //      初始透明度
        alpha:1,
        //      下边部分是对应的增量
        addScaleX:-0.1,
        addScaleY: -.05,
        addAlpha: -.01,
        addA:0,
        //判断粒子是否发射的标志，  粒子资源需要循环使用！
        isStart:false,
        visible:false,
        x:0,
        y:0,
        initialize:function(soure){
            //传入精灵对象，这里相当于一个皮肤外壳
            //粒子的核心控制变换运动类是  Particle  应用相关的数据变换在pain里
            this.source=soure;
            this.source._visible=false;
            //更新数据
            ccb.stage.addEventListener(ccb.Event.Enter_Frame,this.pain.bind(this));

        },
        launch:function(){
               this.scaleX=1;
                this.scaleY=1;
                this.rotation=0;
                this.speed=0;
                this.alpha=1;
                this.isStart=true;
                this.visible=true;
                this.source._visible=true;
        },
        //清理粒子
        clear:function(){
            this.visible=false;
            this.isStart=false;
            this.source._visible=false;
        },
        pain:function(){
            if(!this.isStart)return;
            //			Particle记录着相关的粒子变换的数据和规则 在这里实例化粒子后，
//就相当于一个数据处理中心，在数据处理后，再对图片纹理source属性进行相应的赋值。

//数据处理

            this.scaleX+=this.addScaleX;
            this.scaleY+=this.addScaleY;
            this.alpha+=this.addAlpha;
            this.rotation+=this.angle;
//对纹理资源相应属性进行赋值
            this.source.scaleX=this.scaleX;
            this.source.scaleY=this.scaleY;
            this.source.alpha= this.alpha;

            this.source.x+= Math.cos(this.rotation) * this.speed;
            this.source.y+= Math.sin(this.rotation) * this.speed;
 //          这里因为粒子已经存在列表了，所以addchild的作用是把显示对象置顶，想起参看sprite的addchild方法
            ccb.stage.addChild(this.source);
            if (this.scaleX<=0|| this.scaleY<=0||this.alpha<= 0)
            {
                 this.clear();
            }
        },
        dispose:function(){
            this.isStart=false;
            this.visible=false;
            ccb.stage.removeChild(this.source);
            this.source=null;
        }

    })
})();
(function(){
    ccb.ParticleStyle=Class({
        /**
         * 是否播放动画
         */
        loop:false,

        /**
         * 设置动画片段名称
         */
        tileName:null,

        /**
         * 跳转到第几帧
         */
        gotoFrame:0,

        /*
         *粒子X随机范围
         */
        scopeX:2,

        /**
         * 粒子Y随机范围
         */
        scopeY:2,

        /**
         * 粒子的X轴比例
         */
        scaleX:1,

        /**
         * 粒子的Y轴比例
         */
        scaleY:1.3,

        /**
         * 粒子X比例缩放值
         */
        addScaleX:-.06,

        /**
         * 粒子Y比例缩放值
         */
        addScaleY:-.08,

        /**
         * 粒子透明度
         */
        a:1,

        /**
         * 粒子红色通道值
         */
        r:.5,

        /**
         * 粒子绿色通道值
         */
        g:.8,

        /**
         * 粒子蓝色通道值
         */
        b: 1,

        /**
         * 粒子角度递增值
         */
        angle:0,

        /**
         * 粒子初始化角度
         */
        rotation:Math.PI/180*-90.0,

        /**
         * 粒子随机角度
         */
        rotationRandom:0,

        /**
         * 粒子运动速度
         */
        speed:5,

        /**
         * 粒子初始化透明度
         */
        alpha:1,
         /**
         * 粒子透明度递增
         */
        addAlpha:-0.08,
        /**
         * 粒子递增红色通道值
         */
        addR :.3,

        /**
         * 粒子递增绿色通道值
         */
        addG : .02,

        /**
         * 粒子递增蓝色通道值
         */
        addB :-.003,

        /**
         * 粒子递增透明度
         */
        addA :-.08

    })
})();



(function(){
    ccb.Style_HY=Class({
        /**
         * 是否播放动画
         */
        loop:false,

        /**
         * 设置动画片段名称
         */
        tileName:null,

        /**
         * 跳转到第几帧
         */
        gotoFrame:0,

        /*
         *粒子X随机范围
         */
        scopeX:0,

        /**
         * 粒子Y随机范围
         */
        scopeY:0,

        /**
         * 粒子的X轴比例
         */
        scaleX:1,

        /**
         * 粒子的Y轴比例
         */
        scaleY:1,

        /**
         * 粒子X比例缩放值
         */
        addScaleX:-.005,

        /**
         * 粒子Y比例缩放值
         */
        addScaleY:-.01,

        /**
         * 粒子透明度
         */
        a:1,

        /**
         * 粒子红色通道值
         */
        r:.5,

        /**
         * 粒子绿色通道值
         */
        g:.8,

        /**
         * 粒子蓝色通道值
         */
        b: 1,

        /**
         * 粒子角度递增值
         */
        angle:0,

        /**
         * 粒子初始化角度
         */
        rotation:Math.PI/180*90.0,

        /**
         * 粒子随机角度
         */
        rotationRandom:0,

        /**
         * 粒子运动速度
         */
        speed:0,

        /**
         * 粒子递增红色通道值
         */
        addR :.3,

        /**
         * 粒子递增绿色通道值
         */
        addG : .02,

        /**
         * 粒子递增蓝色通道值
         */
        addB :-.003,

        /**
         * 粒子递增透明度
         */
        addA :-0.02

    })
})();
(function(){
    ccb.ParticleEmitter=Class({
        //添加事件支持
        Extends:ccb.EventDispatcher,
        // 		是否发射粒子
        isPlay:false,
        //      粒子列表
        list:null,
        // 		粒子的混合样式。事实上，一个粒子发射器可以同时使用多种粒子混合样式，这里只用了一种。
        style:null,
        //      粒子发射的起始坐标
        x:0,
        y:0,
        //      粒子发射频率，某些特定情况需要修改，一般采用默认值就行
        fps:0,
       lastTime:60,

        initialize:function(texture,count){
            this.list=[];
            this.style=new ccb.ParticleStyle();
            //          可以直接传入 精灵数组
            if(texture instanceof Array){
                for(var n=0;n<texture.length;n++){
                    var p=new ccb.Particle(texture[n]);
                    ccb.stage.addChild(texture[n]);
                    ccb.stage.addChild(p);
                    this.list.push(p);
                }
            }else{
                //          	创建相关粒子
                for(var i=0;i<count;i++){
                    var sp=new ccb.Sprite( texture);
                    sp.blend=ccb.Blend.LIGHTER;
                    var p=new ccb.Particle(sp);
                    p.isStart=false;
                    //把精灵添加到舞台（要显示）
                    ccb.stage.addChild(sp);
                      this.list.push(p);
                }
            }
            ccb.stage.addEventListener(ccb.Event.Enter_Frame,this.pain.bind(this));
            this.isPlay=true;
        },
        pain:function(){
            if(this.fps){
                var curtick=Date.now();
                if( (curtick-this.lastTime)*this.fps>1000)
                {
                    this.lastTime=curtick;
                    this.sendParticle(this.x,this.y,this.style);
                }
            }else{
                this.sendParticle(this.x,this.y,this.style);
            }

        },
        sendParticle:function(x,y,particleStyle)
        {
            if(this.isPlay&&this.list)
                for (var i = 0; i <this.list.length; i++)
                {
                    //如果粒子未启动
                    if (this.list[i].isStart==false)
                    {
                        //填充粒子属性
                        var p = this.list[i];
                        p.launch();
                        p.source.loop=(particleStyle.loop);
                        (particleStyle.loop)?p.source.play():p.source.stop();

                        if(particleStyle.gotoFrame!=0)
                            p.source.gotoAndStop(particleStyle.gotoFrame);

                        if(particleStyle.tileName!=null)
                            p.source.setTileName(particleStyle.tileName);
                            p.addA = particleStyle.addA;
                            p.angle = particleStyle.angle;
                            p.alpha = particleStyle.alpha;
                            p.addAlpha = particleStyle.addAlpha;
                            p.addScaleX= particleStyle.addScaleX;
                            p.addScaleY= particleStyle.addScaleY;
                            p.speed = particleStyle.speed;
                            p.scaleX=particleStyle.scaleX;
                            p.scaleY=particleStyle.scaleY;

//                             p.source.rotation=particleStyle.rotation;
                            p.source.alpha=particleStyle.alpha;
                            p.source.scaleX=particleStyle.scaleX;
                            p.source.scaleY=particleStyle.scaleY;
                            p.source.x=x+ Math.random()* particleStyle.scopeX - particleStyle.scopeX / 2;
                            p.source.y=y+ Math.random()* particleStyle.scopeY - particleStyle.scopeY / 2;
                            p.rotation = particleStyle.rotation + Math.random() * particleStyle.rotationRandom;
//                         p.source._visible=true;
//                        p.source.setR(particleStyle.r);
//                        p.source.setG(particleStyle.g);
//                        p.source.setB(particleStyle.b);
//                        p.source.setA(particleStyle.a);

//                        p.addR = particleStyle.addR;
//                        p.addG = particleStyle.addG;
//                        p.addB = particleStyle.addB;


//                        p.scaleX+= particleStyle.addScaleX;
//                        p.scaleY+= particleStyle.addScaleY;


//                        p.pain();
                        break;
                    }
                }
        },
        dispose:function(){
            this.isPlay=false;
            ccb.stage.removeEventListener(ccb.Event.Enter_Frame,this.pain.bind(this));
            for(var i=0;i<this.list.length;i++){
                this.list[i].dispose();
            }
            this.list=null;
            this.style=null;
        }
    })
})();

(function() {
    ccb.Sound = Class({
//音量
     _volume:1,
//	是否在播放
    isPlaying:false,
//	是否暂停
    isPause:false,
//  声音播放的位置
    location:0,
    //回调处理函数对象集
    callback:null,
//	声音源，也就是audio标签
    source:null,
//	自动播放，在加载完毕声音数据后，是否自动播放
    autoPlay:false,
//	播放的循环次数，-1为无限循环播放
    loop:1,
    //  加载完成，可以进行播放
    canPlay:false,
//	初始化
    initialize:function(src,autoPlay){
        this.callback={};
        this.autoPlay=autoPlay||false;
        //播放结束的处理函数
        this.callback["onEndedHandler"]=this._onEndedHandler.bind(this);
        //播放的处理函数，事件发生在声音播放的开头
        this.callback["onPlayingHandler"]=this._onPlayingHandler.bind(this);
        // 加载声音
        return this.load(src,this.autoPlay);
    },
    load:function(src,autoPlay){
//		新建声音Audio
        var sound=new Audio();
        // 由于使用到回调函数，this在作用域指向的对象可能发生改变，这里使用self来保存当前类
        var self=this;
        //		当前声音文件的数据加载完毕
        sound.addEventListener("loadedmetadata",
                function(){
                    self.canPlay=true;
    //							自动播放
                    if(self.autoPlay){
                        self.play();
                    }
                    if(self.callback["onplay"])
                        self.callback["onplay"].call(self);
                }
            );
        //添加播放事件，事件发生在声音播放的开头
        sound.addEventListener('playing', this.callback["onPlayingHandler"]);
        //声音播放结束事件
        sound.addEventListener('ended', this.callback["onEndedHandler"]);
//      声音加载出错事件
        sound.addEventListener('error', this.callback["onErrorHandler"]);
        //声音文件路径
        sound.src=src;
//      加载声音，如果声音没有加载到本地，则进行网络加载，若是存在本地，则加载到设备（注意这里加载到设备是异步的）
        sound.load();
        //循环，
        sound.loop=true;
        sound.autoplay=this.autoPlay
//      sound存为类的声音源变量source
        this.source=sound;
        return this;
    },
    play:function(loop,Delay){
//		播放循环的次数和播放的延迟时间
        this.loop=loop||1;
        this.Delay=Delay||0;
        var self=this;
        setTimeout(function(){
            self.source.play();
        },self.Delay*1000);
//		播放中
        this.isPlaying=true;
//		播放声音回调事件
        if(this.callback["onplay"]){
            this.callback["onplay"].call(this);
        }
    },
    stop:function(){
//		停止声音，这里的声音标签不存在stop的API。
//		但是，我们可以通过暂停并且，吧播放时间设置为声音开始0的时候作为stop;
        this.source.pause();
//		设置播放的位置
        this.source.currentTime=0;
        this.location=0;
        this.isPlaying=false;
//		停止声音回调函数
        if(this.callback["onstop"]){
            this.callback["onstop"].call(this);
        }
    },
    _onPlayingHandler:function(){
        //利用该事件的在每次播放的开头调用（）的属性，来实现循环次数
//		计算循环次数
        if(this.loop==-1){
            return;
        }
        else if(this.loop==0){
//			停止
            this.stop();
        }
        this.loop--;
    },
    _onEndedHandler:function(){
        //结束播放
    },
    pause:function(){
        //暂停播放
        this.source.pause();
        this.location=this.source.currentTime;
        this.isPlaying=false;
        if(this.callback["onpause"]){
            this.callback["onpause"].call(this);
        }
    },
    getVolume:function(){
//		获取音量的大小
        return this.source.volume;
    },
    setVolume:function(value){
//		设置音量的大小
        this.source.volume=value;
        this.onvolumechange();
    },
    onvolumechange:function(){
//		添加音量改变时间
        if(this.callback["onvolumeChange"]){
            this.callback["onvolumeChange"].call(this);
        }
    },
    mute:function(){
//		、、静音
        this.source.mute()
        if(this.callback["onmute"]){
            this.callback["onmute"].call(this);
        }
    },
    unMute:function(){
//		取消静音
        this.source.unMute();
        if(this.callback["onunMute"]){
            this.callback["onunMute"].call(this);
        }
    },
    addEventListener:function(evenName,fun){
//		添加事件监听
        this.callback[evenName]=fun;
    },
    clone:function(){
        //克隆一个声音对象
        var item=new Sound(this.sound.src);
        return item;
    },
    dispose:function(){
//		、、销毁声音
        this.isPlaying=false;
        this.isPause=false;
        this.location=0;
        this.callback=null;
        this.source=null;
        this.autoPlay=false;
        this.loop=0;
        this.canPlay=false;
    }

    })
})();


//声音组
//同一个path的声音可以放到一个组来管理，缓冲
(function() {
    ccb.SoundGroup = Class({
        src:"",
        group:null,
        maxbuffer:100,
        initialize:function(src){
            this.group=[];
            this.src=src;
        },
        //添加一个声音buffer
        add:function(src){
            if(this.group.length>this.maxbuffer)return;
            var item=new ccb.Sound(src);
            this.group.push(item);
            return item;
        },
//	返回声音的实例的位置、
        match:function(item){
            return this.group.indexOf(item);
        },
//	删除声音
        remove:function(item){
            var index=this.match(item);
            if(index>-1){
                this.group[index].dispose&&this.group[index].dispose();
                return this.group.splice(index,1);
            }
        },
//	删除所有声音item
        removeAll:function(){
            for (var i=0;i<this.group.length;i++) {
                this.group[i].dispose&&this.group[i].dispose()
            }
            this.group=[];
        },
//	播放声音，并且返回一个声音实例，作为控制
        play:function(loop,delay){
            for (var i=0;i<this.group.length;i++) {
                if(!this.group[i].isPlaying){
                    this.group[i].play(loop,delay);
                    return  this.group[i];
                }
            }
            if(i==0 || i==this.group.length){
                var item=this.add(this.src);
                item.play(loop,delay);
                return  item;
            }
        },
        //停止该组所有声音
        stop:function() {
            for (var i = 0; i < this.group.length; i++) {
                if (this.group[i].isPlaying) {
                    this.group[i].stop();
                }
            }
        },
//	暂停该组所有声音
        pause:function(){
            for (var i=0;i<this.group.length;i++) {
                if(this.group[i].isPlaying){
                    this.group[i].pause();
                }
            }
        },
        //	该组所有声音静音
        mute:function(){
            for (var i=0;i<this.group.length;i++) {
                if(this.group[i].isPlaying){
                    this.group[i].mute();
                }
            }
        },
        //	该组所有声音取消静音
        unMute:function(){
            for (var i=0;i<this.group.length;i++) {
                if(this.group[i].isPlaying){
                    this.group[i].unMute();
                }
            }
        },
//	返回音量
        getVolume:function(){
                return this.group[0].volume;
        },
//	设置音量
        setVolume:function(value){
            for (var i=0;i<this.group.length;i++) {
                 this.group[i].volume=value;
            }
        },
//	、、释放声音资源
        dispose:function(){
            this.src=null;
            for (var i=0;i<this.group.length;i++) {
                this.group[i].dispose && this.group[i].dispose();
            }
            this.group=null;
        }
    });

    ccb.SoundsManager = Class({
        soundsGroups:null,
        initialize:function(){
            this.soundsGroups={};
        },
//	添加声音，并且生成声音组
        add:function(id,item){
            //path
            if( typeof item =="string"){
                item=new ccb.SoundGroup(item);
            }else if(typeof item !="object"){
                return ;
            }
            if(!this.soundsGroups[id]){
                this.soundsGroups[id]=item;
            }
        },
        //删除特定组的声音
        remove:function(id){
            var item=this.group(id);
            this.soundsGroups[id]=null;
            return item;
        },
        //返回特定组的声音
        group:function(id){
            return this.soundsGroups[id];
        },
//	播放所有声音
        play:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].play();
            }
        },
//	停止所有声音？
        stop:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].stop();
            }
        },
//	暂停所有声音
        pause:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].pause();
            }
        },
//	静音
        mute:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].mute();
            }
        },
//	取消静音
        unMute:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].unMute();
            }
        },
//	释放资源
        dispose:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].dispose();
            }
            this.soundsGroups=null;
        }

    })

})();




