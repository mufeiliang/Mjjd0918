/**
 * Created by lan on 2014/7/10.
 */
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