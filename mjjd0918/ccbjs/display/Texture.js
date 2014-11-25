/**
 * Created by lan on 2014/7/3.
 */

( function(){
    ccb.Texture=Class({
        name:null,
        width:0,
        height:0,
        img:null,
        _xmlconfig:null,
        initialize:function(img,xml){
            this.width=img.width;
            this.height=img.height;
            this.img=img;
            this._xmlconfig=xml;
        }
    })
})();

( function(){
    ccb.TextureCache=Class({
        cacheList:null,
        initialize:function(){

        },
        getTextureById:function(id){

        },
        addChild:function(texture,id){

        },
        removeChild:function(texture){

        },
        removeChildByID:function(id){

        }

    })
})();