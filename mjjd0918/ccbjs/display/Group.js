/**
 * Created by ccbear on 2014/9/3.
 */



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