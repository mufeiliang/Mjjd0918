/**
 * Created by lan on 2014/7/2.
 */

(function(){
    ccb.DisplayObject=Class(
        {
            Extends:ccb.EventDispatcher,
            x:0,
            y:0,
            width:0,
            height:0,
            alpha:1,
            rotation:0,
            scaleX:1,
            scaleY:1,
            skewX:0,
            skewY:0,
            name:"",
            _visible:true,
            _userDate:null,
            //中心偏移
            pivotX:0,
            pivotY:0,
            _center:false,
            setCenter:function(value){
              this._center=value;
            },
            getCenter:function(){
                return this._center;
            },
            setPivotX:function(value){
               this.pivotY= value;
            },
            setPivotY:function(value){
                this.pivotY= value;
            },
            getPivotX:function(){
                return this.pivotY;
            },
            getPivotY:function(){
                return this.pivotY;
            },
            getUserData:function(){
               return this._userDate;
            },
            setUserData:function(value){
                this._userDate=value;
            },
            getVisible:function(){
                return this._visible;
            },
            setVisible:function(value){
                this._visible=value;
            },
            getMouseEnabled : function() {  return this.m_mouseEnabled;},
            setMouseEnabled : function(value){ this.m_mouseEnabled = value; }

        }
    )
})();