window.YQY = {};
window.YQY.apiHost = 'http://game.3721w.com/api';
window.YQY.localHost = 'http://h5.3721w.com';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}

// if(getCookie('sid') == ''){
// 	localStorage.setItem('oldUrl',window.location.href);
// 	window.location.href = 'http://h5.3721w.com/#login';
// }

function rmbcz(){
    $('body').append('<div class="body-mark">'+
        '<form class="rmb-box">'+
            '<div class="title">'+
            '游戏充值<i class="fa fa-close"></i>'+
            '</div>'+
            '<div class="content">'+
            '<span class="btn-orange"><i class="fa fa-yen"></i> <span class="fr">10元</span></span>'+
            '<span class="btn-orange"><i class="fa fa-yen"></i> <span class="fr">20元</span></span>'+
            '<span class="btn-orange"><i class="fa fa-yen"></i> <span class="fr">50元</span></span>'+
            '<span class="btn-orange"><i class="fa fa-yen"></i> <span class="fr">100元</span></span>'+
            '</div>'+
        '</form>'+
    '</div>').find('.rmb-box').addClass('animated bounceInUp');
    $('.fa-close').click(function(){
        $('.body-mark').remove();
    });
    $('.btn-orange').click(function(){
        var i = $(this).find('.fr').text();
        paypanel(i);
        $('.body-mark').remove();
    });
}

function paypanel(i){
    var num = parseInt(i);
    $('body').append('<div class="paypanel">'+
        '<div class="name">商品名称:'+
            '<span class="text"><img src="'+YQY.localHost+'images/ymoney.png" alt="" />'+num*10000+'游戏币</span>'+
        '</div>'+
        '<div class="pay">支付金额:'+
            '<span class="text color"><img src="'+YQY.localHost+'images/rmoney.png" alt="" />'+i+'</span>'+
        '</div>'+
        '<h2>请选择支付方式</h2>'+
        '<div class="content">'+
            '<a href="" class="btn-success"><img src="'+YQY.localHost+'images/wechat.png" alt="" />微信支付</a>'+
            '<a href="" class="btn-orange"><img src="'+YQY.localHost+'images/alipay.png" alt="" />支付宝支付</a>'+
            '<p class="color2">温馨提示</p>'+
            '<p class="color3">若充值过程遇到问题，请与客服联系</p>'+
            '<p class="color3">客服QQ: 1467888888;微信：yiqu365</p>'+
            '<p class="color3">您也可以联系客服直接购买充值点卡</p>'+
        '</div>'+
        '<a class="btn-close"><i class="fa fa-arrow-circle-o-left"></i>返回游戏</a>'+
    '</div>').find('.paypanel').addClass('animated bounceInDown');
    $('.btn-close').click(function(event) {
        $('.paypanel').remove();
    });
}
