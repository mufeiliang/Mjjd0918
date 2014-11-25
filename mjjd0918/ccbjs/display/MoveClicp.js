/**
 * Created by lan on 2014/7/2.
 */


(function(){
    ccb.MoveClicp=Class({
        Extends:ccb.DisplayObject,
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
        //帧裁剪偏移
        cropXOffset:0,
        cropYOffset:0,
        _col:0,
        _row:0,
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
        repeatTpye:"",
        initialize:function( texture,animationData){

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
//                 this.width= this.frameWidth*this.scaleX;
//                 this.height=this.frameHeight*this.scaleY;
            }

            //平铺模式
            switch (this.repeatTpye)
            {
                case "repeat": this._col=parseInt(this.width/this.frameWidth);  this._row=parseInt(this.height/this.frameHeight);break;
                case "repeat-x": this._col=parseInt(this.width/this.frameWidth); this._row=0;break;
                case "repeat-y": this._col=0;  this._row=parseInt(this.height/this.frameHeight);break;
                default :this._col=0;  this._row=0;break;
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

//            this.width= this.frameWidth*this.scaleX;
//            this.height=this.frameHeight*this.scaleY;

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

                ccb.Stage.ctx.translate(this.x,this.y);
                ccb.Stage.ctx.scale(this.scaleX,this.scaleY);
//                ccb.Stage.ctx.transform(1,this.skewX,this.skewY,1,this.x,this.y);
                //转换为弧度
                ccb.Stage.ctx.rotate(this.rotation*Math.PI/180);
//              绘制图像
//                ccb.Stage.ctx.drawImage(this.texture,this.cropX,this.cropY,
//                                        this.frameWidth,this.frameHeight,
//                                        (-this.mFrameWidth/2-this.offsetX-this.pivotX),(-this.mFrameHeight/2-this.offsetY-this.pivotY),
//                                        this.frameWidth,this.frameHeight);
//

                //设置画布旋转角度实际上是设置了图像的角度,参数是弧度,所以我们必须把角度转换为弧度
                //画布句柄设置好一切属性之后,开始绘制图像
                //中间量
                var temWidth=this.frameWidth;
                var temHeight=this.frameHeight;
                //平铺循环 r行 c列
                for(var r=0;r<(this._row+1);r++){
                    temWidth=this.frameWidth;
                    if((r==0))
                    {
                        temHeight=this.height < this.frameHeight ? this.height:(this.height-this._row*this.frameHeight);
                        if(this.repeatTpye!="repeat-y"&&this.repeatTpye!="repeat"){
                            temHeight=this.height < this.frameHeight ? this.height:this.frameHeight;
                        }
                    }
                    //this.height 与 this.frameheight 不为倍数时最后一行处理
                    if((r==this._row))
                    {
                        temHeight=this.height < this.frameHeight ? this.height:(this.height-this._row*this.frameHeight);
                        if(this.repeatTpye!="repeat-y"&&this.repeatTpye!="repeat"){
                            temHeight=this.height < this.frameHeight ? this.height:this.frameHeight;
                        }
                    }
                    for(var c=0;c<(this._col+1);c++){
                        //this.width 与 this.framewidth 不为倍数时最后一行处理
                        if((c==this._col)){
                            temWidth=this.width<this.frameWidth?this.width:(this.width-this._col*this.frameWidth);
                            if(this.repeatTpye!="repeat-x"&& this.repeatTpye!="repeat"){
                                temWidth=this.width < this.frameWidth ? this.width:this.frameWidth;
                            }
                        }
                        if((temWidth==0)||(temHeight==0))continue;
                        temWidth=this.cropX+this.cropXOffset%this.frameWidth;
                        temHeight=this.cropY+this.cropYOffset%this.frameHeight;

                        ccb.Stage.ctx.drawImage(this.texture,this.mcX,this.mcY,temWidth,temHeight,
                                (this.offset.x-this.width/2)+c*this.frameWidth ,(this.offset.y-this.height/2)+r*this.frameHeight,
                            temWidth,temHeight);

                        ccb.Stage.ctx.drawImage(this.texture,this.cropX+this.cropXOffset,this.cropY+this.cropYOffset,
                            temWidth,temHeight,
                            (-this.mFrameWidth/2-this.offsetX-this.pivotX)+temWidth,
                            (-this.mFrameHeight/2-this.offsetY-this.pivotY),
                            temWidth,temHeight);
                    }
                }

                //子对象
                for(var i=0;i<this.childen.length;i++){
                    this.childen[i].pain();
                }
                ccb.Stage.ctx.restore();
//            }
        },
        clone:function(){
            var s=new ccb.Sprite(this.texture,this.animationData);
            return  s;
        },
        dispose:function(){
            this.removeAllChilden();
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