//鼠标事件

 (function(){
     ccb.MouseEvent=Class({
         Extends:ccb.Event,
         stageX:0,
        stageY:0,
         initialize:function(eventType,bubbles,mouseX,mouseY){
             this.type=eventType||"";
             this.bubbles=bubbles||false;
             this.removed=false;
             this.stageX=mouseX;
             this.stageY=mouseY;
         }
     })
 })();