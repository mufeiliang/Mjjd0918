/**
 * Created by lan on 2014/7/3.
 */

(function(){
    ccb.Item=Class({
        key:null,
        value:null,
        initialize:function(key,value){
            this.key=key;
            this.value=value;
        },
        equal:function(value){
             return this.value===value;
         },
       toString:function(){
        return ""+this.value;
        }
    })
})()
(function(){z
    ccb.ItemList=Class({
        keys:null,
        _list:null,
        length:0,
        initialize:function(){
            this.keys=[];
            this._list={};
            this.length=0;
        },
        add:function(key,item){
          this._list[key]= new  ccb.Item(key,item);
            this.length++;
        },
        remove:function(item){
            for(var i=0;i<this._list.length;i++){
                if(this._list.length[i].item===item){
                    this._list.length.splice(i,1) ;
                    this.length--;
                    break;
                }
            }
        },
        removeByKey:function(key){
            for(var i=0;i<this._list.length;i++){
                if(this._list.length[i].key===key){
                    this._list.length.splice(i,1) ;
                    break;
                }
            }
        }
    })
})();

