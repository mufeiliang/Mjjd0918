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




