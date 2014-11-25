/**
 * Created by ccbear on 2014/8/31.
 */


var  WelcomScene=Class({
    STATIC:{
        Create:function(){
            return new WelcomScene();;
        }
    },
    QGC : null, //回收quad
    $ : null,
    gameTextur : null,
    UIScene : null,
    PropsPage : null,
    WelcomPage : null,
    /**
     * 初始化
     */
    _initData : function() {
        this.QGC = [];
        this.$ = {};
        //使用Tween;
        ccb.RunAction.RunAC();
        ccb["fallHeight"]=0;
        ccb["cash"]=0;
        ccb["addData"]=false;
        var str=window.location.href;
        var index=str.lastIndexOf("id/");
        ccb["gameId"]=str.substr(index+3,10);
        myGame.Main.curGameScene=this;
        this.$["showTel"]=false;
    },
    initialize:function(){
        this._initData();
        this.start();
    },
    start:function(){
        setCookie("imgid","1");

        ccb["showId"]="img"+getCookie("imgid")+".jpg";

        this.initBG();

        this.initGame();

        this.initUI();

        this.enterScene();

    },
    initBG:function(){
        var bg=new ccb.Group();
        bg.x=ccb.stage.stageWidth/2;
        var bg0=new ccb.Sprite( myGame.Main.Res['img'][1]);
        bg0.x=0;
        bg0.y=0;
        bg.addChild(bg0);

        var bg1=new ccb.Sprite( myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
        bg1.x=0;
        bg1.y=bg0.height-180;
        bg1.setTileName("bgRepeat");
        bg1.scaleX=640/bg1.width;
        bg1.scaleY=960/bg1.height;
        bg.addChild(bg1);
        bg.y=bg0.height/2-1;
        ccb.stage.addChild(bg);
        this.$["bg"]=bg;
        this.$["bgSetY"]=bg0.height/2-1;
    },
    initUI:function(){
        var t=new ccb.Sprite( myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
        t.x=ccb.stage.stageWidth/2;
        t.y = -160;
        t.setTileName("title");
        ccb.stage.addChild(t);
        this.$["title"]=t;

        var btn= t.clone();
        btn.x=ccb.stage.stageWidth/2;
        btn.y= ccb.stage.stageHeight+40;
        btn.setTileName("btnStart");
        btn.mouseEnabled=true;
        btn.addEventListener(ccb.Event.MOUSE_DOWN,this.gameStart.bind(this));
        ccb.stage.addChild(btn);
        this.$["btnStart"]=btn;

        var btn1= t.clone();
        btn1.x=160;
        btn1.y= ccb.stage.stageHeight-100;
        btn1.setTileName("btnGameRules");
        btn1.mouseEnabled=true;
        btn1.addEventListener(ccb.Event.MOUSE_DOWN,this.onBtnGameRulesClick.bind(this));
        btn1.setVisible(false);
        ccb.stage.addChild(btn1);
        this.$["btnGameRules"]=btn1;

        var btn2= t.clone();
        btn2.x=ccb.stage.stageWidth-160;
        btn2.y= ccb.stage.stageHeight-100;
        btn2.setTileName("btnMyCash");
        btn2.mouseEnabled=true;
        btn2.addEventListener(ccb.Event.MOUSE_DOWN,this.onBtnMyCashClick.bind(this));
        btn2.setVisible(false);
        ccb.stage.addChild(btn2);
        this.$["btnMyCash"]=btn2;

        var d= t.clone();
        d.x=ccb.stage.stageWidth/2+54;
        d.y = 98;
        d.setTileName("yun");
        d.alpha=0.1;
        d.setVisible(false);
        ccb.stage.addChild(d);
        this.$["yun"]=d;

    },
    initGame:function(){
        var r_x=226;
        var xuanya=new ccb.Group();
        xuanya.x=ccb.stage.stageWidth/2;
        xuanya.y=ccb.stage.stageHeight/2+400;
        this.$["xuanya"]=xuanya;
//        山崖？
        var Lya=new ccb.Sprite( myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
        Lya.x= -r_x;
        Lya.y=0;
        Lya.scaleX=-1;
        Lya.setTileName("ya");

        xuanya.addChild(Lya);
        this.$["Lya"]=Lya;
        var tree=Lya.clone();
        tree.x= -r_x-50;
        tree.y=-145;
        tree.setTileName("tree");
        xuanya.addChild(tree);

        var Rya=Lya.clone();
        Rya.x=r_x;
        Rya.y=0;
        xuanya.addChild(Rya);
        this.$["Rya"]=Rya;
//重复部分
        this.$["LRepeat"]=[];
        this.$["RRepeat"]=[];
        for(var i=0;i<3;i++){
            var ya= Lya.clone(),
                ya1=Lya.clone();
            ya.setTileName("yaRepear");
            ya.x= -(r_x+49);
            ya.scaleX=-1;
            ya.y=ya.height*i+(Lya.height+ya.height)/2-1;

            ya1.setTileName("yaRepear");
            ya1.x= r_x+49;
            ya1.y=ya1.height*i+(Lya.height+ya.height)/2-1;

            xuanya.addChild(ya);
            xuanya.addChild(ya1);
            this.$["LRepeat"].push(ya);
            this.$["RRepeat"].push(ya1);
        }
//桥
        var qiao=Lya.clone();
        qiao.x=0;
        qiao.y=-28;
        qiao.setTileName("qiao");
        xuanya.addChild(qiao);
        this.$["qiao"]=qiao;

        ccb.stage.addChild(xuanya);
//人
        var man=new ccb.Sprite( myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
        man.x=40;
        man.y=-100;
        man.setTileName("man");
        man.setVisible(false);
        this.$["man"]=man;
        xuanya.addChild(man);
//        ccb.stage.addChild(man);
        //张飞
        var zhangfei=new Hero( myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
        zhangfei.x=30;
        zhangfei.y=-48;
        zhangfei.rotation=30;
        zhangfei.setTileName("zhangfei");
//        zhangfei.addEventListener(ccb.Event.MOUSE_DOWN,this.gethero.bind(this));
        xuanya.addChild(zhangfei);
        this.$["zhangfei"]=zhangfei;

        this.$["body"]=[];
        for(var i=0;i<3;i++){
            var body=new ccb.Sprite( myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
            body.setTileName("alpha");
            body.setUserData(i)
            body.addEventListener(ccb.Event.MOUSE_DOWN,this.gethero.bind(this));
            zhangfei.addChild(body);
            this.$["body"].push(body);
        }
        this.$["body"][0].x=-20;
        this.$["body"][0].y=5;
        this.$["body"][0].scaleX=1.5;
        this.$["body"][0].scaleY=1.5;
        this.$["body"][1].x=-60;
        this.$["body"][1].y=-10;
        this.$["body"][1].scaleX=.8;
        this.$["body"][2].x=20;
        this.$["body"][2].y=10;
        this.$["body"][2].scaleX=.7;


        var rg=new ccb.Group();
        this.$["rg"]=rg;
       ccb.stage.addChild(rg);

    },

    enterScene:function(){
        var curScene=myGame.Main.curGameScene;
        var increateY=350,jump=true;
        var Q=[
          ccb.Action.DelayCreate(1),
          ccb.Action.CallFunCreate(function(){
              ccb.Action.CreateTween(this.$["bg"],2,{to:{y:this.$["bg"].y-increateY/5}} );
              ccb.Action.CreateTween(this.$["xuanya"],2,{to:{y:this.$["xuanya"].y-increateY}} );
          }),
            ccb.Action.DelayCreate(2),
            ccb.Tween.To(this.$["title"],1.2,{delay:1,to:{y:ccb.stage.stageHeight/2-100},ease:ccb.Ease.Bounce.easeOut})
                    .onUpdate(function(){
                    if((this.y>=200)&&jump){
                            jump=false;
                            var q=[ccb.Tween.To(curScene.$["zhangfei"],.4,{delay:1,to:{y:680},ease:ccb.Ease.Quad.easeIn})
                                .onEnd(function(){
                                    this.setVisible(true);
                                    curScene.$["yun"].setVisible(true);
                                    ccb.Action.CreateTween(curScene.$["btnStart"],.4,{to:{y:ccb.stage.stageHeight/2+180}})
                                        .onEnd(function(){
                                            curScene.$["btnGameRules"].setVisible(true);
                                            curScene.$["btnMyCash"].setVisible(true);
                                        });
                                    ccb.Action.CreateTween(curScene.$["yun"],.4,{to:{alpha:1}} );

                                })]
                        ccb.RunAction.Create(curScene,q);

                    }
                    })
      ];
        ccb.RunAction.Create(curScene,Q);
    },
    gameStart:function(){
        ccb["fallHeight"]=0;
        var self=this;
        this.$["title"].setVisible(false);
        this.$["btnGameRules"].setVisible(false);
        this.$["btnMyCash"].setVisible(false);
        this.$["btnMyCash"].mouseEnabled=(false);
        this.$["btnGameRules"].mouseEnabled=(false);
        this.$["yun"].setVisible(true);
        this.$["man"].setVisible(true);
        this.$["man"].gotoAndStop(2);

        ccb.Action.CreateTween(this.$["btnStart"],.2,{to:{y:1000}} );
        this.$["bg"].y=this.$["bgSetY"]-50;

        this.$["xuanya"].y=ccb.stage.stageHeight/2-100;
        this.$["xuanya"].moveToStage(this.$["zhangfei"]);

        this.$["zhangfei"].setVisible(true);
        this.$["zhangfei"].rotation=0;
        this.$["zhangfei"].y=320;
        this.$["zhangfei"].x=ccb.stage.stageWidth/2-10;
        this.$["zhangfei"].actionCatch();

        ccb.Action.CreateTween(this.$["man"],.2,{from:{alpha:.1,x:120,y:-70},to:{alpha:1}}).onEnd(function(){
            ccb.Action.CreateTween(self.$["man"],.6,{to:{x:40,y:-100}}).onEnd(function() {
                self.$["man"].gotoAndStop(1);
                self.$["zhangfei"].x = ccb.stage.stageWidth / 2 - 10;
                self.$["zhangfei"].y = 280;
                for(var i=0;i<3;i++){
                    self.$["body"][i].mouseEnabled=true;
                }
            })
        })


    },
    gethero:function(e){
        var temp=300,n= e.target.getUserData();
        switch (n){
            case 1:temp=GetRandom(1000,1999);
                break;
            case 2:temp=GetRandom(2000,2999);
                break;
            default :temp=GetRandom(600,999);
        }
        ccb["fallHeight"]=temp;
        ccb["fallTime"]=1.5*(n+1);
        this.$["dropType"]=0;
        if(n==3){
            ccb["fallTime"]=0.3;
            this.$["dropType"]=1;
        }

        this.$["zhangfei"].x=0;
        this.$["zhangfei"].y=20;

        this.$["rg"].y=260;
        this.$["rg"].x=ccb.stage.stageWidth/2-10;
        this.$["rg"].rotation=0;

        ccb.stage.removeChild( this.$["zhangfei"]);
        this.$["rg"].addChild( this.$["zhangfei"]);
        this.$["yun"].setVisible(false);

        for(var i=0;i<3;i++){
            this.$["body"][i].mouseEnabled=true;
        }
        this.drop();
    },
    drop:function(){
        for(var i=0;i<3;i++){
            this.$["body"][i].mouseEnabled=false;
        }

        var curScene=myGame.Main.curGameScene;
        var Q=[
            ccb.Tween.To(curScene.$["rg"],1.4,{to:{rotation:-1470},ease:ccb.Ease.Quad.easeIn}).onEnd(function(){
                curScene.$["rg"].moveToStage(curScene.$["zhangfei"]);
                 curScene.fly.call(curScene);
               })
        ];
        ccb.RunAction.Create(curScene,Q);
    },
    fly:function(){
        var curScene=myGame.Main.curGameScene;
        ccb["scoll"]=this.onframe.bind(this);

        var point={x:50,y:360};

        var curSence=this;
        if(this.$["dropType"]==0){
            ccb.stage.addEventListener(ccb.Event.Enter_Frame, ccb["scoll"]);
            var num=GetRandom(0,100);
            if(num>49){
                this.$["zhangfei"].setRightCire(false);
                point.x=50;
            }else{
                this.$["zhangfei"].setRightCire(true);
                point.x=590;
            }
            this.$["zhangfei"].actionFall();
            point.y=360+GetRandom(0,100);
        }else{
            point.y=30;
            point.x=-2* point.x;
            var num=GetRandom(0,100);
            if(num>49){
                this.$["zhangfei"].setRightCire(false);
                point.x=-150;
            }else{
                this.$["zhangfei"].setRightCire(true);
                point.x=790;
            }
            ccb["fallHeight"]=0;
        }

        ccb.Action.CreateTween(this.$["zhangfei"],ccb["fallTime"],{to:{x:point.x,y:point.y},ease:ccb.Ease.Quad.easeIn} )
            .onEnd(function(){
                switch (GetRandom(0,2)){
                    case 0: curSence.$["zhangfei"].actionHit();
                        break;
                    case 1: curSence.$["zhangfei"].actionHold();
                        break;
                    case 2: curSence.$["zhangfei"].actionPrick();
                        break;
                }

                ccb.stage.removeEventListener(ccb.Event.Enter_Frame,ccb["scoll"]);
                setTimeout(function(){
                    curSence.onShowResult();
                },1000)
        });

    },
    onframe:function(){
        var speed=20;
        var top=-this.$["LRepeat"][0].y-this.$["LRepeat"][0].height/2;
        this.$["xuanya"].y-=speed;
        if(this.$["xuanya"].y<top){
            if(this.$["xuanya"].y<=top-988){
                this.$["xuanya"].y+=988;
            }
        }
        if(this.$["bg"].y>-600){
            this.$["bg"].y-=speed/3;
        }
    },
    scoll:function(){
        var increateY=-this.$["Lxuanya"][0].y-this.$["Lxuanya"][0].height/2;
        var tween=ccb.Tween.To(this.$["xuanya"],1,{from:{y:increateY},to:{y:increateY-988}})
            .onEnd(
                this.scoll.bind(this)
            )
        ccb.RunAction.Create(this,[tween]);
    },
    reStart:function(){

        ccb.stage.removeChild(this.$["CashPage"]);
        ccb.stage.removeChild(this.$["Result"]);
        this.gameStart()
    },
    //on  even

    onShowResult:function(){
        ccb["addData"]=true;

        var curScene=myGame.Main.curGameScene;
        curScene.$["showTel"]=true;

        var img=null;
        if(ccb["fallHeight"]<600){
            img=myGame.Main.Res['img'][4];
            ccb["cash"]=0;
        }else if(ccb["fallHeight"]<1000){
            img=myGame.Main.Res['img'][4];
            ccb["cash"]=50;
        }else if(ccb["fallHeight"]<2000){
            img=myGame.Main.Res['img'][5];
            ccb["cash"]=100;

        }else if(ccb["fallHeight"]<3000){
            img=myGame.Main.Res['img'][6];
            ccb["cash"]=200;
        }
        document.getElementById("money").value=ccb["cash"];

        var Result=new ccb.Sprite(img);
        Result.x=ccb.stage.stageWidth/2;
        Result.y=ccb.stage.stageHeight/2;
        Result.scaleY=ccb.stage.stageHeight/Result.height;
        this.$["Result"]=Result;

        var btn=new ccb.Sprite(myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
        btn.setTileName("pk");
        btn.x=100;
        btn.y=140;

        btn.mouseEnabled=true;
        btn.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            ccb.stage.removeChild(Result);
            ccb.stage.removeChild(curScene.$["CashPage"]);
            curScene.onShare();
            document.getElementById("showbox").style.display="none";

        });
        Result.addChild(btn);




        var btn2=btn.clone();
        btn2.setTileName("try");
        btn2.x=-100;
        btn2.y=140;
        btn2.mouseEnabled=true;
        btn2.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            ccb.stage.removeChild(Result);
            ccb.stage.removeChild(curScene.$["CashPage"]);
            curScene.reStart.call(curScene);
            document.getElementById("showbox").style.display="none";
        });
        Result.addChild(btn2);

        var star=btn.clone();
        star.setTileName("star");
        star.x=220;
        star.y=-430;
        Result.addChild(star);

        var xzf=btn.clone();
        xzf.setTileName("xzf");
        xzf.x=-245;
        xzf.y=325;
        Result.addChild(xzf);

        if( ccb["cash"]==0){
            var marck=btn.clone();
            marck.setTileName("mark");
            marck.x=-15;
            marck.y=-100;
            Result.addChild(marck);
        }

        var btn3=btn.clone();
        btn3.setTileName("note");
        btn3.x=-5;
        btn3.y=235;
        Result.addChild(btn3);


        var btnUse=btn.clone();
        btnUse.setTileName("btnUseFor");
        btnUse.x=-190;
        btnUse.y=380;
        btnUse.mouseEnabled=true;
        btnUse.addEventListener(ccb.Event.MOUSE_DOWN,this.onUseFor.bind(this));
        Result.addChild(btnUse);

        var btnCash=btn.clone();
        btnCash.setTileName("btnMyCash2");
        btnCash.x=190;
        btnCash.y=380;
        btnCash.mouseEnabled=true;
        btnCash.addEventListener(ccb.Event.MOUSE_DOWN,this.onBtnMyCashClick.bind(this));
        Result.addChild(btnCash);


//"#c91105"
        var text=new ccb.TextFile(ccb["fallHeight"]+" 米","#c91105","bolder 50px arial");
        text.x=-50;
        text.y =-140;
        Result.addChild(text);

        ccb.stage.addChild(Result);
        document.getElementById("showbox").style.display="block";
        document.title="我在猛降价到游戏中，猛降了"+ccb["fallHeight"]+" 米，快来挑战我吧！";
    },
    onShare:function(){
        var curScene=myGame.Main.curGameScene;
        document.getElementById("showbox").style.display="none";
        var Share=new ccb.Sprite(myGame.Main.Res['img'][3]);
        Share.setCenter(false);
        Share.x=ccb.stage.stageWidth/2;
        Share.y=ccb.stage.stageHeight/2;
        Share.scaleY=ccb.stage.stageHeight/Share.height;
        Share.mouseEnabled=true;
        Share.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            var target=e.target;
            ccb.stage.removeChild(target);
            curScene.reStart.call(curScene);
        });

        var text=new ccb.TextFile(ccb["fallHeight"]+"米，","#000","bolder 20px arial");
        text.x=20;
        text.y =-138;
        Share.addChild(text);
        ccb.stage.addChild(Share);

        shareWX();
    },
    onShowCash:function(){
        ccb["addData"]=false;
        document.getElementById("showbox").style.display="block";
        var curScene=myGame.Main.curGameScene;
        var Cash=new ccb.Sprite(myGame.Main.Res['img'][7]);
        Cash.setCenter(false);
        Cash.x=ccb.stage.stageWidth/2;
        Cash.y=ccb.stage.stageHeight/2;
        Cash.scaleY=ccb.stage.stageHeight/Cash.height;
        Cash.mouseEnabled=true;
        Cash.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            var target=e.target;
            ccb.stage.removeChild(target);
            document.getElementById("showbox").style.display=curScene.$["showTel"]?"block":"none";
        });

        var btn=new ccb.Sprite(myGame.Main.Res['img'][0],myGame.Main.Res['xml'][0].animationDataList);
        btn.setTileName("pk");
        btn.x=130;
        btn.y=380;

        btn.mouseEnabled=true;
        btn.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            ccb.stage.removeChild(curScene.$["CashPage"]);
            ccb.stage.removeChild(curScene.$["Result"]);
            curScene.onShare();
            curScene.$["showTel"]=false;
            document.getElementById("showbox").style.display="none";
            WeiXinShareBtn();
        });
        Cash.addChild(btn);

        var btn2=btn.clone();
        btn2.setTileName("try");
        btn2.x=-150;
        btn2.y=380;
        btn2.mouseEnabled=true;
        btn2.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            document.getElementById("showbox").style.display="none";
            ccb.stage.removeChild(curScene.$["CashPage"]);
            ccb.stage.removeChild(curScene.$["Result"]);
            curScene.$["showTel"]=false;
            curScene.reStart.call(curScene);

        });
        Cash.addChild(btn2);
        ccb.stage.addChild(Cash);
        this.$["CashPage"]=Cash;
    },
    onUseFor:function(){
        var curScene=myGame.Main.curGameScene;
        document.getElementById("showbox").style.display="none";
        curScene.showImgById(ccb["showId"]);
    },
    onBtnMyCashClick:function(e){
        document.getElementById("showbox").style.display="none";
        this.onShowCash();
    },
    onBtnGameRulesClick:function(){
        var curScene=myGame.Main.curGameScene;
        document.getElementById("showbox").style.display="none";
        var rules=new ccb.Sprite(myGame.Main.Res['img'][2]);
        rules.setCenter(false);
        rules.x=ccb.stage.stageWidth/2;
        rules.y=ccb.stage.stageHeight/2;
        rules.scaleY=ccb.stage.stageHeight/rules.height;
        rules.mouseEnabled=true;
        rules.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            var target=e.target;
            ccb.stage.removeChild(target);
            document.getElementById("showbox").style.display=curScene.$["showTel"]?"block":"none";
        })
        ccb.stage.addChild(rules);
    },
    showImgById:function(id){
        var index=-1;
            for(var i=0;i<myGame.Main.Res['imgURL'].length;i++){
                 if(myGame.Main.Res['imgURL'][i].lastIndexOf(id)>-1){
                    index=i;
                     break;
                 }
            }
        var  imgSrc=myGame.Main.Res['img'][i];

        var curScene=myGame.Main.curGameScene;
        document.getElementById("showbox").style.display="none";
        var Description=new ccb.Sprite(imgSrc);
        Description.setCenter(false);
        Description.x=ccb.stage.stageWidth/2;
        Description.y=ccb.stage.stageHeight/2;
        Description.scaleY=ccb.stage.stageHeight/Description.height;
        Description.mouseEnabled=true;
        Description.addEventListener(ccb.Event.MOUSE_DOWN,function(e){
            var target=e.target;
            ccb.stage.removeChild(target);
            document.getElementById("showbox").style.display=curScene.$["showTel"]?"block":"none";
        })
        ccb.stage.addChild(Description);

    },
    dispose:function(){

    }
})


var shareWX=function(){

}

function WeiXinShareBtn() {

}
var GameShowCash=function(){
    myGame.Main.curGameScene.onShowCash();
}
var GetRandom= function (begin,end) {
    return begin+Math.round(Math.random()*(end-begin));
}