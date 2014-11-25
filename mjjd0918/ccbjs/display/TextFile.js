/**
 * Created by ccbear on 2014/9/12.
 */

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