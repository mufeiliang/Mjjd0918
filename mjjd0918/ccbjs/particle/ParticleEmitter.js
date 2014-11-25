/**
 * Created by lan on 2014/7/10.
 */
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