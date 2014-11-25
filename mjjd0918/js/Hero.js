/**
 * Created by ccbear on 2014/9/8.
 */

var Hero=Class({
    Extends:ccb.Sprite,
    _isRight:true,
//    skin:null,
    initialize:function(textrue,data){
        Hero.Super.prototype._init.call(this,textrue,data);
//    this=sprite;
    },
    setRightCire:function(value){
        this._isRight=value;
    },
    actionCatch:function(){
        this.gotoAndStop(1);
        this.scaleX= 1;
    },
    actionFall:function(){
        this.gotoAndStop(2);
        this.scaleX= this._isRight?1:-1;
    },
    actionPrick:function(){
        this.gotoAndStop(3);
        this.scaleX= this._isRight?1:-1;

    },
    actionHit:function(){
        this.gotoAndStop(4);
        this.scaleX= this._isRight?-1:1;
    },
    actionHold:function(){
        this.gotoAndStop(5);
        this.scaleX= this._isRight?-1:1;

    }

});
