/**
 * Created by lan on 2014/7/1.
 */


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