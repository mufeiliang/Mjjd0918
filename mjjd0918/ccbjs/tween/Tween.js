/**
 * Created by ccbear on 2014/8/31.
 *
/**?*/
(function(){
    

///////////////////
//  Animation
///////////////////
ccb.Animation = Class({
    ID : 0,
    _duration : 0.00001,
    _delay : 0,
    _timeSclale : 1,
    _active : null,
    _reversed : false, // 反转
    _startTime : 0, //开始播放时间
    immediateRender : false,
    _paused : false, //暂停
    vars : null, //变量参数
    repeat : 1, // <=-1 无限循环
    isStart : false,
    target : null,
    totalTime : 0,
    isComplete : false,
    _onAnimateStartFired : false,
    _onAnimateStart : null,
    _onAnimateUpdate : null,
    _onAnimateEnd : null,
    callback:null,
    initialize : function() {
        this.callback={};
    },
    getPaused : function() {
        return this._paused;
    },
    setPaused : function(value) {
        this._paused = value;
        return this;
    },
    setDelay : function(value) {
        this.delay = value;
        return this;
    },
    setRepeat : function(value) {
        this.repeat = value;
        return this;
    },
    bind : function(target) {
        this.target = target;
        return this;
    },
    run : function(dt) {

    },
    onStart : function(fun) {
        this.callback["onAnimateStart"] = fun;
        return this;
    },
    onUpdate : function(fun) {
        this.callback["onAnimateUpdate"] = fun;
        return this;
    },
    onEnd : function(fun) {
        this.callback["onAnimateEnd"] = fun;
         return this;
    },
    dispose : function() {
        this._onAnimateStart = null;
        this._onAnimateUpdate = null;
        this._onAnimateEnd = null;
        this.isStart = false;
        this.isComplete = true;
    }
});
//////////

////////
/// Tween
//////////
ccb.Tween = Class({
        Extends : ccb.Animation,
//        _duration : 0.00001,
//        _delay : 0,
//        _timeSclale : 1,
//        _active : null,
//        _reversed : false, // 反转
//        _yoyo : false, //正常-》反转播放
//        immediateRender : false,
        starStatus : null,
        endStatus : null,
//	curStatus : null,
        ease : null,
        _initData : function() {
            this.callback={};
            this.callback["onAnimateStart"]=function(){};
            this.callback["onAnimateUpdate"]=function(){};
            this.callback["onAnimateEnd"]=function(){};

            this._duration = 0.00001;
            this._delay = 0;
            this.totalTime = 0;
            this.starStatus = {};
            this.endStatus = {};
        },
        initialize : function(target, duration, vars) {
            this._initData();
            this.ID =  ccb.RunActionClass.ActionCount + 1;
            this.repeat = vars.repeat || 1;
            if (target != null) {
                this.target = target;
            } else {
                throw "Cannot tween a null target.";
            }
            if (vars != null) {
                this.vars = vars;
            } else {
                throw "Cannot tween a vars.";
            }
            this._duration = duration || 1;
            this._timeSclale = vars.tiemScale || 1;
            this.ease = vars.ease ||
                function(t, b, c, d) {
                    return c * t / d + b;
                };
            this.setStartStaus();
            this.setEndStaus();
            return this;
        },
        setStartStaus : function() {
            var status = {};
            if (this.vars.from == null) {
                for (var p in this.vars.to) {
                    if (this.target["get"+p]!=null) {
                        status[p] = this.target["get"+p]();
                    } else if(this.target[p]!=null) {
                        status[p] = this.target[p];
                    }
                }
            } else {

                for (var p in this.vars.from) {
                    status[p] = this.vars.from[p];
                }
                for (var p in this.vars.to) {
                    if(typeof status[p]=="undefined"){
                        if (this.target["get"+p]!=null) {
                            status[p] = this.target["get"+p]();
                        } else if(this.target[p]!=null) {
                            status[p] = this.target[p];
                        }
                    }
                }
            }
            this.startStatus = status;
        },
        setEndStaus : function() {
            var status = {};
            for (var p in this.vars.to) {
                status[p]=this.vars.to[p];
            }
            for (var p in this.startStatus) {
                if(typeof status[p]== 'undefined'){
                    status[p]=this.startStatus[p];
                }
            }
            this.endStatus = status;
        },
        getStartStaus : function() {
            return this.starStatus;
        },
        getEndStaus : function() {
            return this.endStatus;
        },
        run : function(dt) {
            if(!this.isStart)return;
            //      	动作开始
            if (!this._onAnimateStartFired) {
               this._onAnimateStart&&this._onAnimateStart.call(this);

                this._onAnimateStartFired = true;
            }
            //      		动作中
            if (this.totalTime <= this._duration) {

                if (this.repeat > 0 || this.repeat < 0) {
                    this._onAnimateUpdate&&this._onAnimateUpdate.call(this);
                } else if (this.repeat == 0) {
                    this._onAnimateEnd&& this._onAnimateEnd.call(this);
                }
            } else {
                if (this.repeat > 0) {
                    //重置
                    this.totalTime = 0;
                    this.repeat--;
                }
                //      动作结束
                if (this.repeat == 0) {
                   this._onAnimateEnd&&this._onAnimateEnd.call(this);
                    //停止
                    this.isStart = false;
                    this.isComplete = true;
                }
            }
            this.totalTime += dt;

        },
        _onAnimateStart : function() {
            for (var p in this.startStatus) {
                if (this.target["set"+p]!= null) {
                    this.target["set"+p](this.startStatus[p]);
                } else if(this.target[p]!= null) {
                    this.target[p] = this.startStatus[p];
                }
            }
            this.callback["onAnimateStart"]&&this.callback["onAnimateStart"].call(this.target);
        },
        _onAnimateUpdate : function() {
            for (var p in this.endStatus) {
                tem = this.ease(this.totalTime, this.startStatus[p], this.endStatus[p] - this.startStatus[p], this._duration);
                if (this.target["set"+p]!= null) {
                    this.target["set"+p](tem);
                } else if(this.target[p]!= null){
                    this.target[p] = tem;
                }
            }
            this.callback["onAnimateUpdate"]&&this.callback["onAnimateUpdate"].call(this.target);
        },
        _onAnimateEnd : function() {
            for (var p in this.endStatus) {
                if (this.target["set"+p]!= null) {
                    this.target["set"+p](this.endStatus[p]);
                } else if(this.target[p]!= null){
                    this.target[p] = this.endStatus[p];
                }
            }
            this.callback["onAnimateEnd"]&&this.callback["onAnimateEnd"].call(this.target);
        }
        ////////////////
    }
);
/////////how to use vars ?//////
//vars={
//	delay:0
//repeat:1
//ease:function(){}
//	to:{
//		GPUX:20,
//		X:20,
//		Rotation:360
//	}
//from:{
//		GPUX:20,
//		X:20,
//		Rotation:360
//	}
//tiemScale:1
//}
//////////////
ccb.Tween.To = function(target, duration, vars) {
    var tween = new ccb.Tween(target, duration, vars);

    return tween;
};

///////////////////
//  Action
///////////////////
ccb.Action = Class({
        Extends : ccb.Animation,
        _initData : function() {
            this._duration = 0.00001;
            this.totalTime = 0;
            this.isStart = false;
            this.isComplete = false;
            this._onAnimateStartFired = false;
            this.callback={};
            this.vars = null;
            this._onAnimateStart = null;
            this._onAnimateUpdate = null;
            this._onAnimateEnd = null;
        },
        initialize : function(duration, fun, vars, repeat) {
            this._initData()
            this.ID =  ccb.RunActionClass.ActionCount + 1;
            this._duration = duration;
            this._onAnimateUpdate = fun;
            this.vars = vars || null;
            this.repeat = repeat || 1;
            return this;
        },
        run : function(dt) {
            if (this.vars) {
                //				if(this._onAnimateStartFired){
                //					this.vars.pop();
                //				}
                //				this.vars.push(dt);
            } else {
                this.vars = [dt];
            }

            //      	动作开始
            if (!this._onAnimateStartFired) {
                this.callback["onAnimateStart"]&& this.callback["onAnimateStart"]();
                this._onAnimateStartFired = true;
            }
            //      		动作中
            if (this.totalTime < this._duration) {

                if (this.repeat > 0 || this.repeat < 0) {
                    this.callback["onAnimateUpdate"]&& this.callback["onAnimateUpdate"].apply(this.target, this.vars);
                    } else if (this.repeat == 0) {
                    if (this._onAnimateEnd) {
                        this._onAnimateEnd.apply(this.target, this.vars);
                    }
                }
            } else {
                if (this.repeat > 0) {
                    //重置
                    this.totalTime = 0;
                    this.repeat--;
                }
                //      动作结束
                if (this.repeat == 0) {
                    this.callback["onAnimateEnd"]&& this.callback["onAnimateEnd"].apply(this.target, this.vars);
                    //停止
                    this.isStart = false;
                    this.isComplete = true;
                }
            }
            this.totalTime += dt;
        }
        ///////
    }
);
ccb.Action.CallFunCreate = function(fun, vars) {
    return  new ccb.Action(0.0001, null, vars,0).onEnd(fun);
};
ccb.Action.DelayCreate = function(delay) {
    return new ccb.Action(delay, null, null, 1);
};
 ccb.Action.Create = function(time, fun, vars, repeat) {
    var action = new ccb.Action(time, fun, vars, repeat);
    return action;
};

ccb.Action.CreateTween = function(target, duration, vars) {
    var tween = new ccb.Tween(target, duration, vars),
        Delay = new ccb.Action(duration, null, null, 1);
         tween.callback=Delay.callback;
        ccb.RunAction.Create(null, [tween]);
    return Delay;
};

ccb.Action.CreateKeyFrameAnimation = function(target,frames) {
    var Q=[],duration,time;
    for(var i=0;i<frames.length-1;i++) {
        time=frames[i+1].time-frames[i].time;
        var f=frames[i].frame,t=frames[i+1].frame;
        Q.push(	new ccb.Tween(target, time, {from:f,to:t}))
    }
    duration=frames[frames.length-1].time;
    ccb.RunAction.Create(null,Q);
    return  new ccb.Action(duration, null, null, 1);
};

///////////////
///RunActionClass
//////////////
ccb.RunActionClass = Class({
    //添加事件支持
    Extends:ccb.EventDispatcher,
    STATIC : {
        ActionCount : 0
    },
    ActionsLists : null,
    target : null,
    isRunAC : false,
    stopAction : false,
    curFrame : 0,
    totalFrames : 0,
    dt : 0,
    _lastTime : 0,
    _indelay : false,
    _listener : null,
    _initData : function() {
        this.curFrame = 0;
        this.totalFrames = 0;
        this.isRunAC = false;
        this.ActionsLists = [];
        this._listener = {};
    },
    initialize : function() {
        this._initData();
        this._listener["onFrameUpdate"] = this._onFrameUpdate.bind(this);
        ccb.RunActionClass.ActionCount = 0;
    },

    dispose : function() {
        ccb.stage.removeEventListener(ccb.Event.Enter_Frame, this._listener["onFrameUpdate"]);
        this.isRunAC = false;
        this._onFrameUpdate=null;
        this.ActionsLists = [];
    },
    RunAC : function() {
        ccb.stage.removeEventListener(ccb.Event.Enter_Frame, this._listener["onFrameUpdate"]);
        ccb.stage.addEventListener(ccb.Event.Enter_Frame, this._listener["onFrameUpdate"]);
        this.isRunAC = true;
        this._lastTime = Date.now();
    },
    addAction : function(action) {
        ccb.RunActionClass.ActionCount++;
        action.ID =  ccb.RunActionClass.ActionCount;
        this.ActionsLists.push(action);
    },
    removeAction : function(action) {
        var index = this.ActionsLists.indexOf(action);
        if (index > -1) {
            this.ActionsLists.splice(index, 1);
        }
    },
    getActionId : function(action) {
        var id = null;
        for (var i = 0; i < this.ActionsLists.length; i++) {
            if (this.ActionsLists[i] === action) {
                id = this.ActionsLists[i].ID;
                break;
            }
        }
        return id;
    },
    getActionById : function(id) {
        var action = null;
        for (var i = 0; i < this.ActionsLists.length; i++) {
            if (this.ActionsLists[i].ID === id) {
                action = this.ActionsLists[i];
                break;
            }
        }
        return action;
    },
    _onFrameUpdate : function() {

        if (!this.isRunAC ) {
            return;
        }
        var curTime = Date.now();
        this.dt = (curTime - this._lastTime) / 1000;
        this._lastTime = curTime;

        for (var n = 0; n < this.ActionsLists.length; n++) {
            if (this.ActionsLists[n].length > 0) {
                var ac = this.ActionsLists[n][0];
                if (ac.isStart) {
                    ac.run(this.dt);
                } else {
                    this.ActionsLists[n].splice(0, 1);
                    if (this.ActionsLists[n][0])
                        this.ActionsLists[n][0].isStart = true;
                }
            } else {
                this.removeAction(this.ActionsLists[n]);
            }
        }
    },
    Create : function(target, actionlist) {
        if (actionlist.length > 0) {
            for (var i = 0; i < actionlist.length; i++) {
                if (!actionlist[i].target) {
                    actionlist[i].target = target;
                }
            }
            actionlist[0].isStart = true;
            this.addAction(actionlist);
        }

    }
});

 //管理运行动作
ccb.RunAction = new ccb.RunActionClass();


ccb.Ease = {
//	Result:{
//		Linear:
//	},
    Linear: function(t,b,c,d){
        var cur=t/d;
//  	if(!EaseType.Result.Linear[cur]){
//  		EaseType.Result.Linear[cur]
//  	}
        return c*t/d + b;
    },
    Quad: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t,b,c,d){
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t,b,c,d){
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t,b,c,d){
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t,b,c,d){
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t,b,c,d){
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else{ var s = p/(2*Math.PI) * Math.asin (c/a);}
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else{ var s = p/(2*Math.PI) * Math.asin (c/a);}
            return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
        },
        easeInOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else{ var s = p/(2*Math.PI) * Math.asin (c/a);}
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        }
    },
    Back: {
        easeIn: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t,b,c,d){
            return c - ccb.Ease.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t,b,c,d){
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOut: function(t,b,c,d){
            if (t < d/2) return ccb.Ease.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
            else return ccb.Ease.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    }
}
})();