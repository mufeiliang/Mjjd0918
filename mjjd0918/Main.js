/**
 * Created by lan on 2014/7/6.
 */

this.myGame=this.myGame|| {};
(function(){
    myGame.Main=Class({
        STATIC:{
            curGameScene:null,
            scene:null,
            Res:null,
            imgRes:null,
            assets:null
        },

        loaded:0,
        initialize:function(canvasid,width,height){
            myGame.Main.Res={};
//            myGame.Main.assets={};
            ccb.stage=new ccb.Stage(canvasid,width,height);
            //是否根据浏览器动态大小修改舞台尺寸
            ccb.stage.setAutoAdjustToBrowser(true);
            ccb.stage.adjustToBrowser(ccb.screenAdjust.Fill);
            var  loading=new ccb.TextFile("loading...","#c91105","bolder 40px arial");
            loading.x=120;
            loading.y =450;
            ccb.stage.addChild(loading);
            ccb["loadText"]=loading;
            myGame.Main.Res['imgURL']=[
                "img/game.png",
                "img/bg.jpg",
                "img/rules.jpg",
                "img/share.jpg",
                "img/result1.jpg",
                "img/result2.jpg",
                "img/result3.jpg",
                "img/cash.jpg"
            ];
            for(var i=1;i<16;i++){
                myGame.Main.Res['imgURL'].push("img/ad/img"+i+".jpg")
            }

            myGame.Main.Res['xmlURL']=[
                "img/game.xml"
            ];
            myGame.Main.Res['img']=[];
            myGame.Main.Res['xml']=[];
            this.loadImg();
        },
        loadImg:function(){
            for (var i=0;i< myGame.Main.Res['imgURL'].length;i++) {
                var img=new Image();
                img.src= myGame.Main.Res['imgURL'][i];
                myGame.Main.Res["img"][i]=img;
                img.onload=(function(){
                    this.loaded++;
                    ccb["loadText"].string="loading..."+Math.round(this.loaded*100/ myGame.Main.Res['imgURL'].length)+"%";
                    if(this.loaded== myGame.Main.Res['imgURL'].length){
                        //资源价值完毕
                        this.loaded=0;
                        this.loadXMlRes();
                    }
                }).bind(this)
            }
        },
        loadXMlRes:function(){
            var  init=this.init;
            var load=new ccb.AnimationXMLReader();
            this.callback=function(e)
            {
                //加载完毕放入列表
                myGame.Main.Res['xml'].push(load);
                this.loaded++;
                if(this.loaded< myGame.Main.Res['xmlURL'].length)
                {
                    this.loadXMlRes();
                }
                if(this.loaded== myGame.Main.Res['xmlURL'].length)
                {
//	        	开始游戏循环
                    init();
                }
            }
            load.addEventListener(this.callback.bind(this));
            load.getFromURL( myGame.Main.Res['xmlURL'][this.loaded]);
        },
        init:function(){
            ccb.goToNewScene(WelcomScene);
            document.getElementById("submit").addEventListener("mousedown",SubTel);
        }
    });
    ccb.goToNewScene=function(newScene,oldScene){
        oldScene=myGame.Main.curGameScene||oldScene;
        if(oldScene){
            oldScene.dispose();
            oldScene=null;
        }
//                  自定义的场景创建函数，如果场景涉及到重置，不要忘记重置对应场景的全局的变量
        newScene.Create();
    }

})()

var SubTel=function(){
    var tel=document.getElementById("Tel");
    if(checkForm()){
        var text;
        GameShowCash();
        var curScene=myGame.Main.curGameScene,
        Cash=curScene.$["CashPage"];
        var phone=document.getElementById("Tel").value.trim();
            setCookie("myCash",ccb["cash"]);
          var url;
        if(ccb["addData"]){
            url="http://www.games.com/test.php?tel="+phone+"&je="+ccb["cash"]+"&id="+ccb["gameId"]+"&in=1";
        }else{
            url="http://www.games.com/test.php?tel="+phone+"&in=0";
        }
        ccb["addData"]=false;
            ajaxGET(url, function(){
                var top=235/2;
                text=new ccb.TextFile("获取数据中！","#c91105","bolder 30px arial");
                text.x=-160;
                text.y =80;
                Cash.addChild(text);
            },function(data){
                    var arr=JSON.parse(data);

                    if(!arr||arr.length==0 || arr.isNll){
                        text.string="您还没有赢取奖券哦！";
                    }else{
                        Cash.removeChild(text);
                        for (var i=0;i<arr.length;i++){
                            var top=235/(arr.length*2);
                            text=new ccb.TextFile(arr[i].je+" 元","#c91105","bolder 32px arial");
                            text.x=-240;
                            text.y =top-35+i*50;
                            Cash.addChild(text);

                            text=new ccb.TextFile("券号："+arr[i].qh,"#c91105","bolder 32px arial");
                            text.x=-240+120;
                            text.y =top-35+i*50;
                            Cash.addChild(text);
                        }
                    }
            },function(){
                    text.string="网络错误，请检查网络。";
            });

        document.getElementById("showbox").style.display="none";
    }
};

function checkForm(){
    if(!document.getElementById || !document.createTextNode) return false;
    var tel=document.getElementById("Tel");
    var str=tel.value;
    var regPartton=/1[3-8]+\d{9}/;
    if(!str || str==null){
        alert("手机号码不能为空！");
        tel.focus();
        return false;
    }else if(!regPartton.test(str)){
        alert("手机号码格式不正确！");
        tel.focus();
        return false;
    }else{
        return true;
    }
}