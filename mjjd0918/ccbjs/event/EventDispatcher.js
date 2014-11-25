
(function(){
    ccb.EventDispatcher=Class(
        {
            //	事件列表,每种事件类型对这一个数组
            // 结构如下：
            //this.eventList={"keydown":[listener1,listener2,listener3,...],
//						"keyup":[listener1,listener2,listener3,...]}
            eventList:null,
            initialize:function(){
                this.eventList={};
            },
    //添加一个某个类型的时间监听器
    addEventListener:function(eventType,listener,bubbles){
        ///eventList.eventType
//		判断eventList中是否存在 eventType这一类型对应的数组，如果过不存在则进行初始化
        if(this.eventList==null)this.eventList={};
        var  list=this.eventList[eventType];
        if(!list){
            list=this.eventList[eventType]=[];
        }
        else{
            //存在 eventType这一类型对应的数组，则先检查是否已经存在相同的监听器，存在则退出函数，不重复添加
            var index=list.indexOf(listener)
            if(index>-1)return;
        }
        //添加监听器到 对应的数组列表
        list.push(listener);
    },
    removeEventListener :function(eventType,listener){
        //		判断eventList中是否存在 eventType这一类型对应的数组，如果过不存在则进行初始化
        if(!this.eventList)return;
        var  list=this.eventList[eventType];
//		如果不存在对应的事件类型的数组，那么删除就没有意义，直接退出函数
        if(!list)return;
//		删除操作
        for (var i=0;i<list.length;i++) {
            if(list[i]===listener){
                list.splice(i,1);
                return;
            }
        }
    },

    dispatchEvent:function(eventObj,target){
        ///this.dispatchEvent("keydown",a)
        //新手可以跳过下边一段注释
        //在有一定的理解之后，可以考虑扩充 dispatchEvent，变为一个自定义事件并且接受自定义传输参数
        //   dispatchEvent(eventObj,target,param)  eventObj.param=param

        if (typeof eventObj == "string")
        {
            /// 		把this.eventList赋值给局部变量listeners
            var listeners = this.eventList;
//          listeners不存在或者 对应的数组类型不存在则退出函数
            if (!listeners || !listeners[eventObj]) { return false; }
//          建立一个新事件
            eventObj = new ccb.Event(eventObj,false);
        }
        eventObj.target = target||this;
//               事件调度执行
        this._dispatchEvent(eventObj);
    },

    _dispatchEvent:function(eventObj){
        var len, listeners = this.eventList;
        if (eventObj && listeners)
        {
            var list = listeners[eventObj.type];
            //不存在相应的监听则返回
            if (!list||!(len=list.length)) { return; }

            eventObj.removed = false;
//                  新开辟一个空间存储原来的元素，避免在事件调度过程中item的添加或删除
            list = list.slice();
            for (var i=0; i<len ; i++)
            {
                var o = list[i];
//                      如果是一个监听的对象，检查是否存在handleEvent函数，否则直接进行调用
                if (o.handleEvent) { o.handleEvent(eventObj); }
                else { o(eventObj); }

                if (eventObj.removed)
                {
                    this.removeEventListener(eventObj.type, o);
                    eventObj.removed = false;
                }
            }
        }

    }

        }
    )
})();
