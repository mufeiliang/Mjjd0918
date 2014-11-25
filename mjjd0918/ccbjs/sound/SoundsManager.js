//声音组
//同一个path的声音可以放到一个组来管理，缓冲
(function() {
    ccb.SoundGroup = Class({
        src:"",
        group:null,
        maxbuffer:100,
        initialize:function(src){
            this.group=[];
            this.src=src;
        },
        //添加一个声音buffer
        add:function(src){
            if(this.group.length>this.maxbuffer)return;
            var item=new ccb.Sound(src);
            this.group.push(item);
            return item;
        },
//	返回声音的实例的位置、
        match:function(item){
            return this.group.indexOf(item);
        },
//	删除声音
        remove:function(item){
            var index=this.match(item);
            if(index>-1){
                this.group[index].dispose&&this.group[index].dispose();
                return this.group.splice(index,1);
            }
        },
//	删除所有声音item
        removeAll:function(){
            for (var i=0;i<this.group.length;i++) {
                this.group[i].dispose&&this.group[i].dispose()
            }
            this.group=[];
        },
//	播放声音，并且返回一个声音实例，作为控制
        play:function(loop,delay){
            for (var i=0;i<this.group.length;i++) {
                if(!this.group[i].isPlaying){
                    this.group[i].play(loop,delay);
                    return  this.group[i];
                }
            }
            if(i==0 || i==this.group.length){
                var item=this.add(this.src);
                item.play(loop,delay);
                return  item;
            }
        },
        //停止该组所有声音
        stop:function() {
            for (var i = 0; i < this.group.length; i++) {
                if (this.group[i].isPlaying) {
                    this.group[i].stop();
                }
            }
        },
//	暂停该组所有声音
        pause:function(){
            for (var i=0;i<this.group.length;i++) {
                if(this.group[i].isPlaying){
                    this.group[i].pause();
                }
            }
        },
        //	该组所有声音静音
        mute:function(){
            for (var i=0;i<this.group.length;i++) {
                if(this.group[i].isPlaying){
                    this.group[i].mute();
                }
            }
        },
        //	该组所有声音取消静音
        unMute:function(){
            for (var i=0;i<this.group.length;i++) {
                if(this.group[i].isPlaying){
                    this.group[i].unMute();
                }
            }
        },
//	返回音量
        getVolume:function(){
                return this.group[0].volume;
        },
//	设置音量
        setVolume:function(value){
            for (var i=0;i<this.group.length;i++) {
                 this.group[i].volume=value;
            }
        },
//	、、释放声音资源
        dispose:function(){
            this.src=null;
            for (var i=0;i<this.group.length;i++) {
                this.group[i].dispose && this.group[i].dispose();
            }
            this.group=null;
        }
    });

    ccb.SoundsManager = Class({
        soundsGroups:null,
        initialize:function(){
            this.soundsGroups={};
        },
//	添加声音，并且生成声音组
        add:function(id,item){
            //path
            if( typeof item =="string"){
                item=new ccb.SoundGroup(item);
            }else if(typeof item !="object"){
                return ;
            }
            if(!this.soundsGroups[id]){
                this.soundsGroups[id]=item;
            }
        },
        //删除特定组的声音
        remove:function(id){
            var item=this.group(id);
            this.soundsGroups[id]=null;
            return item;
        },
        //返回特定组的声音
        group:function(id){
            return this.soundsGroups[id];
        },
//	播放所有声音
        play:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].play();
            }
        },
//	停止所有声音？
        stop:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].stop();
            }
        },
//	暂停所有声音
        pause:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].pause();
            }
        },
//	静音
        mute:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].mute();
            }
        },
//	取消静音
        unMute:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].unMute();
            }
        },
//	释放资源
        dispose:function(){
            for (var name in this.soundsGroups) {
                this.soundsGroups[name].dispose();
            }
            this.soundsGroups=null;
        }

    })

})();




