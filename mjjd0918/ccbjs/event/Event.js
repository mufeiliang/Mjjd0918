
 (function(){
     ccb.Event=Class(
     {
         //  事件类型
         STATIC:{
             KEY_DOWN:"keydown",
             KEY_UP:"keyup",
             KEY_PRESS:"keypress",
             MOUSE_DOWN:"mousedown",
             MOUSE_UP:"mouseup",
             MOUSE_MOVE:"mousemove",
             Enter_Frame:"enterFrame"
         },
         type:"",
         bubbles:null,
    // 	调用事件的目标
         target:null,
    // 	删除事件
         removed:null,
         initialize:function(eventType,bubbles){
             this.type=eventType||"";
             this.bubbles=bubbles||false;
             this.removed=false;
         },
         remove:function(){
             this.removed=true;
         }

     })
 })();