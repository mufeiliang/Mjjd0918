/**
 * Created by lan on 2014/7/2.
 */


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

