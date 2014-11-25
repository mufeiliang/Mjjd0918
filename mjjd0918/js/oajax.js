/**
 * Created with JetBrains WebStorm.
 * User: sunaturer
 * Date: 13-12-26
 * Time: 上午9:57
 * To change this template use File | Settings | File Templates.
 */
var ajaxGET=function(url,fnTip,fnSucc,FnFaild){
    var oAjax=null;
    if(window.XMLHttpRequest){
        oAjax=new XMLHttpRequest();
    }else{
        oAjax=new ActiveXObject('Microsoft.XMLHTTP');
    }
    //url=url+'?'+new Date().getTime()+'&keyword='+document.getElementById('t1').value;
    oAjax.open('GET',url,true);
    oAjax.send('');
    if(fnTip)fnTip();
    oAjax.onreadystatechange=function(){
        if(oAjax.readyState==4){
            if(oAjax.status==200){
                if(fnSucc){fnSucc(oAjax.responseText)};
            }else{
                if(FnFaild)FnFaild();
            }
        }
    }
};

var ajaxPOST=function (url,send,fnTip,fnSucc,FnFaild){
    var oAjax=null;
    if(window.XMLHttpRequest){
        oAjax=new XMLHttpRequest();
    }else{
        oAjax=new ActiveXObject('Microsoft.XMLHTTP');
    }
    oAjax.open('POST',url,true);
    oAjax.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
    oAjax.send(send);
    if(fnTip)fnTip();
    oAjax.onreadystatechange=function(){
        if(oAjax.readyState==4){
            if(oAjax.status==200){
                if(fnSucc){fnSucc(oAjax.responseText)};
            }else{
                if(FnFaild)FnFaild();
            }
        }
    }
}

//获得coolie 的值



function cookie(name){

    var cookieArray=document.cookie.split("; "); //得到分割的cookie名值对

    var cookie=new Object();

    for (var i=0;i<cookieArray.length;i++){

        var arr=cookieArray[i].split("=");       //将名和值分开

        if(arr[0]==name)return unescape(arr[1]); //如果是指定的cookie，则返回它的值

    }

    return "";

}



function delCookie(name)//删除cookie

{

    document.cookie = name+"=;expires="+(new Date(0)).toGMTString();

}



function getCookie(objName){//获取指定名称的cookie的值

    var arrStr = document.cookie.split("; ");

    for(var i = 0;i < arrStr.length;i ++){

        var temp = arrStr[i].split("=");

        if(temp[0] == objName) return unescape(temp[1]);

    }
    return false;
}



function addCookie(objName,objValue,objHours){      //添加cookie

    var str = objName + "=" + escape(objValue);

    if(objHours > 0){                               //为时不设定过期时间，浏览器关闭时cookie自动消失

        var date = new Date();

        var ms = objHours*3600*1000;

        date.setTime(date.getTime() + ms);

        str += "; expires=" + date.toGMTString();

    }

    document.cookie = str;

}


function setCookie(name,value)//两个参数，一个是cookie的名子，一个是值

{

    var Days = 10; //此 cookie 将被保存 30 天

    var exp = new Date();    //new Date("December 31, 9998");

    exp.setTime(exp.getTime() + Days*24*60*60*1000);

    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();

}

function getCookie(name)//取cookies函数

{

    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));

    if(arr != null) return unescape(arr[2]); return null;



}

function delCookie(name)//删除cookie

{

    var exp = new Date();

    exp.setTime(exp.getTime() - 1);

    var cval=getCookie(name);

    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();

}