/**
 * Created by dell on 2015/11/1.
 */
var Login = {};
Login.sid = null;
Login.scode = null;


Login.getSID = function () {
    Login.sid = null;
    var arr = document.cookie.match(new RegExp("(^| )" + "sid" + "=([^;]*)(;|$)"));
    if (arr != null) {
        Login.sid = arr[2];
    }
    if (Login.sid) {      // ��cookie��ȡ����sid,�ٴӴ���Ĳ�����ȡ
        return Login.sid;
    }
    // �Ӵ����url��ȡsid,��ʱ�����Ƕ���������
    var r = window.location.search.substr(1);
    //console.log('r = ', r, 'r.? = ', r.indexOf("="));
    if (r.indexOf("=") != -1) {
        var sid = r.split("=")[1];
        //console.log('--------------r = ', r, 'r.indexof(/)', r.indexOf("/"));
        if (r != null) {
            if (r.indexOf('/') != -1) {
                Login.sid = sid.split("/")[0];
            } else {
                Login.sid = sid;
            }
            //console.log('--------------sid = ', Login.sid);
        }
    }
    return Login.sid;
};

Login.getSCODE = function () {
    Login.scode = null;

    //return Login.scode;
    var arr = document.cookie.match(new RegExp("(^| )" + "scode" + "=([^;]*)(;|$)"));
    if (arr != null) {
        Login.scode = arr[2];
    }

    //Login.scode = "144587178063542ghrqxnaugmu39egerm6d7dz8hcp2g0"; //this.randomChar(32);

    return Login.scode;
};

Login.getUserInfo = function (callback) {
    var sid = Login.getSID();
    var scode = Login.getSCODE();

    var xhr = cc.loader.getXMLHttpRequest();
    //Login.scode ='1447658151174ivo0p3ttovvohll3d566t0fuqg53tor6';
    //Login.sid = 'hd4uqemu0q7uriu52nauqmpb51';
    var url = "http://game.3721w.com/api/user?" + "sid=" + Login.sid + "&scode=" + Login.scode;
    console.log("Status: Send Get Request to ", url);
    xhr.open("GET", url, true);
    //console.log('---------------------------getuserinfo ------------');
    xhr.onreadystatechange = function () {
        //console.log('---------readystate = ', xhr.readyState);
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status <= 207) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                //console.log("Status: Got GET response! " + httpStatus);
                //callback(true, xhr);
                callback(true, {sid: sid, scode: scode});
            } else {
                callback(false, xhr);
            }
        }
    };
    xhr.send();
};

Login.randomChar = function (length) {
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var timestamp = new Date().getTime();
    for (var i = 0; i < length; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}

Login.delCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Login.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
}

Login.getCookie = function (name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return arr[2];
    }
    return null;
}