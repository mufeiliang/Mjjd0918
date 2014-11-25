
(function() {
    ccb.Sound = Class({
//音量
     _volume:1,
//	是否在播放
    isPlaying:false,
//	是否暂停
    isPause:false,
//  声音播放的位置
    location:0,
    //回调处理函数对象集
    callback:null,
//	声音源，也就是audio标签
    source:null,
//	自动播放，在加载完毕声音数据后，是否自动播放
    autoPlay:false,
//	播放的循环次数，-1为无限循环播放
    loop:1,
    //  加载完成，可以进行播放
    canPlay:false,
//	初始化
    initialize:function(src,autoPlay){
        this.callback={};
        this.autoPlay=autoPlay||false;
        //播放结束的处理函数
        this.callback["onEndedHandler"]=this._onEndedHandler.bind(this);
        //播放的处理函数，事件发生在声音播放的开头
        this.callback["onPlayingHandler"]=this._onPlayingHandler.bind(this);
        // 加载声音
        return this.load(src,this.autoPlay);
    },
    load:function(src,autoPlay){
//		新建声音Audio
        var sound=new Audio();
        // 由于使用到回调函数，this在作用域指向的对象可能发生改变，这里使用self来保存当前类
        var self=this;
        //		当前声音文件的数据加载完毕
        sound.addEventListener("loadedmetadata",
                function(){
                    self.canPlay=true;
    //							自动播放
                    if(self.autoPlay){
                        self.play();
                    }
                    if(self.callback["onplay"])
                        self.callback["onplay"].call(self);
                }
            );
        //添加播放事件，事件发生在声音播放的开头
        sound.addEventListener('playing', this.callback["onPlayingHandler"]);
        //声音播放结束事件
        sound.addEventListener('ended', this.callback["onEndedHandler"]);
//      声音加载出错事件
        sound.addEventListener('error', this.callback["onErrorHandler"]);
        //声音文件路径
        sound.src=src;
//      加载声音，如果声音没有加载到本地，则进行网络加载，若是存在本地，则加载到设备（注意这里加载到设备是异步的）
        sound.load();
        //循环，
        sound.loop=true;
        sound.autoplay=this.autoPlay
//      sound存为类的声音源变量source
        this.source=sound;
        return this;
    },
    play:function(loop,Delay){
//		播放循环的次数和播放的延迟时间
        this.loop=loop||1;
        this.Delay=Delay||0;
        var self=this;
        setTimeout(function(){
            self.source.play();
        },self.Delay*1000);
//		播放中
        this.isPlaying=true;
//		播放声音回调事件
        if(this.callback["onplay"]){
            this.callback["onplay"].call(this);
        }
    },
    stop:function(){
//		停止声音，这里的声音标签不存在stop的API。
//		但是，我们可以通过暂停并且，吧播放时间设置为声音开始0的时候作为stop;
        this.source.pause();
//		设置播放的位置
        this.source.currentTime=0;
        this.location=0;
        this.isPlaying=false;
//		停止声音回调函数
        if(this.callback["onstop"]){
            this.callback["onstop"].call(this);
        }
    },
    _onPlayingHandler:function(){
        //利用该事件的在每次播放的开头调用（）的属性，来实现循环次数
//		计算循环次数
        if(this.loop==-1){
            return;
        }
        else if(this.loop==0){
//			停止
            this.stop();
        }
        this.loop--;
    },
    _onEndedHandler:function(){
        //结束播放
    },
    pause:function(){
        //暂停播放
        this.source.pause();
        this.location=this.source.currentTime;
        this.isPlaying=false;
        if(this.callback["onpause"]){
            this.callback["onpause"].call(this);
        }
    },
    getVolume:function(){
//		获取音量的大小
        return this.source.volume;
    },
    setVolume:function(value){
//		设置音量的大小
        this.source.volume=value;
        this.onvolumechange();
    },
    onvolumechange:function(){
//		添加音量改变时间
        if(this.callback["onvolumeChange"]){
            this.callback["onvolumeChange"].call(this);
        }
    },
    mute:function(){
//		、、静音
        this.source.mute()
        if(this.callback["onmute"]){
            this.callback["onmute"].call(this);
        }
    },
    unMute:function(){
//		取消静音
        this.source.unMute();
        if(this.callback["onunMute"]){
            this.callback["onunMute"].call(this);
        }
    },
    addEventListener:function(evenName,fun){
//		添加事件监听
        this.callback[evenName]=fun;
    },
    clone:function(){
        //克隆一个声音对象
        var item=new Sound(this.sound.src);
        return item;
    },
    dispose:function(){
//		、、销毁声音
        this.isPlaying=false;
        this.isPause=false;
        this.location=0;
        this.callback=null;
        this.source=null;
        this.autoPlay=false;
        this.loop=0;
        this.canPlay=false;
    }

    })
})();

