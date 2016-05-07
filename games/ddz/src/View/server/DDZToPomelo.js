var PomeloListen = function () {
    pomelo.on('on_ready_result', readyCallback);
    pomelo.on('onUpdateDesk', updateDeskCallback);
    pomelo.on('on_deliver', deliverCallback);
    pomelo.on('on_jiao', jiaoCallback);
    pomelo.on('on_jiao_result', jiaoResultCallback);
    pomelo.on('on_qiang', qiangCallback);
    pomelo.on('on_qiang_result', qiangResultCallback);
    pomelo.on('on_dizhu', dizhuCallback);
    pomelo.on('on_double', doubleCallback);
    pomelo.on('on_double_result', doubleResultCallback);
    pomelo.on('on_play', playCallback);
    pomelo.on('on_play_result', playResultCallback);
    pomelo.on('on_gameOver', gameOverCallback);
    pomelo.on('on_disconnect', deskDisconnectCallback);
    pomelo.on('on_connect', connectCallback);
    pomelo.on('on_leave', leaveCallback);
    pomelo.on('on_chat', chatCallback);
    pomelo.on('on_hosting', hostingCallback);
    pomelo.on('on_unHosting', unhostingCallback);
    pomelo.on('on_helpMoney', on_helpMoneyCallback);
    pomelo.on('disconnect', disconnectCallback);
    pomelo.on('heartbeat timeout', timeoutCallback);
    pomelo.on('on_jiabei',testJB);
};

var PomeloRemoveListen = function () {
    pomelo.removeListener('on_ready_result', readyCallback);
    pomelo.removeListener('onUpdateDesk', updateDeskCallback);
    pomelo.removeListener('on_deliver', deliverCallback);
    pomelo.removeListener('on_jiao', jiaoCallback);
    pomelo.removeListener('on_jiao_result', jiaoResultCallback);
    pomelo.removeListener('on_qiang', qiangCallback);
    pomelo.removeListener('on_qiang_result', qiangResultCallback);
    pomelo.removeListener('on_dizhu', dizhuCallback);
    pomelo.removeListener('on_double', doubleCallback);
    pomelo.removeListener('on_double_result', doubleResultCallback);
    pomelo.removeListener('on_play', playCallback);
    pomelo.removeListener('on_play_result', playResultCallback);
    pomelo.removeListener('on_gameOver', gameOverCallback);
    pomelo.removeListener('on_disconnect', deskDisconnectCallback);
    pomelo.removeListener('on_connect', connectCallback);
    pomelo.removeListener('on_leave', leaveCallback);
    pomelo.removeListener('on_chat', chatCallback);
    pomelo.removeListener('on_hosting', hostingCallback);
    pomelo.removeListener('on_unHosting', unhostingCallback);
    pomelo.removeListener('on_helpMoney', on_helpMoneyCallback);
    pomelo.removeListener('disconnect', disconnectCallback);
    pomelo.removeListener('heartbeat timeout', timeoutCallback);
};
var readyCallback = function (data) {
    Connector.frame_ui.notifyReady(DDZApi.curPos[data.data.seatIndex]);
};
var updateDeskCallback = function (data) {
    var playerList = data.data.playerList;
    Global.curPlayer = getGlobalPlayer(data.data.playerList);

    DDZApi.convertToDeskPos(playerList, Global.curPlayer.seatIndex, function (player, pos) {
        Connector.frame_ui.notifyPlayer(player, pos);
        Connector.frame_ui.notifyReady(pos);
    });
};
var deliverCallback = function (data) {
    Global.curPlayer = getGlobalPlayer(data.data.playerList);

    Connector.frame_ui.deliverCards(1, Global.curPlayer.cards, function () {
    });
};
var jiaoCallback = function (data) {
    //Global.curPlayer = getGlobalPlayer(data.data.playerList);
    var jiaoIndex = data.data.seatIndex % 3;
    Connector.frame_ui.askPoint(DDZApi.curPos[jiaoIndex]);
};
var jiaoResultCallback = function (data) {
    var jiaoIndex = data.data.seatIndex % 3;
    var value = data.data.value;
    Connector.frame_ui.notifyPoint(DDZApi.curPos[jiaoIndex], value, function () {
    });
};
var qiangCallback = function (data) {
    var qiangIndex = data.data.seatIndex % 3;
    Connector.frame_ui.askQiang(DDZApi.curPos[qiangIndex]);
};
var qiangResultCallback = function (data) {
    var qiangIndex = data.data.seatIndex % 3;
    var value = data.data.value;
    Connector.frame_ui.notifyQiang(DDZApi.curPos[qiangIndex], value, function () {
    });
};
var dizhuCallback = function (data) {
    var dizhuIndex = data.data.dizhu;
    var value = data.data.dipai;
    Global.curPlayer = getGlobalPlayer(data.data.playerList);

    Connector.frame_ui.notifyDizhu(DDZApi.curPos[dizhuIndex], true);
    Connector.frame_ui.notifyDipai(value, true, function () {
    });
};
var doubleCallback = function () {
    Connector.frame_ui.askDouble();
};
var doubleResultCallback = function (data) {
    var index = data.data.seatIndex;
    var value = data.data.value;
    Connector.frame_ui.notifyDouble(DDZApi.curPos[index], value);
};
var playCallback = function (data) {
    var playIndex = data.data.curTalkIndex % 3;
    var player = data.data.playerList[playIndex];
    Connector.frame_ui.askPlay(DDZApi.curPos[playIndex], player.cards);
};
var playResultCallback = function (data) {
    var playIndex = data.data.curTalkIndex % 3;
    var value = data.data.value;
    var playerList = data.data.playerList;
    var len = playerList[playIndex].cards.length;
    Connector.frame_ui.notifyPlay(DDZApi.curPos[playIndex], value, len);
};
var gameOverCallback = function (data) {
    Connector.frame_ui.showCardsAtOver(data);
};
var deskDisconnectCallback = function (data) {
    var seatIndex = data.data.seatIndex;
    Connector.frame_ui.notifyAuto(DDZApi.curPos[seatIndex]);
};
var connectCallback = function (data) {
    var seatIndex = data.data.seatIndex;
    Connector.frame_ui.notifyConnect(DDZApi.curPos[seatIndex]);
};
var leaveCallback = function (data) {
    console.log('on_leave ', data);
    var playerList = data.data.playerList;
    _.each(playerList, function (p, i) {
        if (p == null) {
            Connector.frame_ui.notifyLeave(DDZApi.curPos[i]);
        }
    });
};
var hostingCallback = function (data) {
    var seatIndex = data.data.seatIndex;
    Connector.frame_ui.notifyHosting(DDZApi.curPos[seatIndex]);
};
var unhostingCallback = function (data) {
    var seatIndex = data.data.seatIndex;
    Connector.frame_ui.notifyNoHosting(DDZApi.curPos[seatIndex]);
};
var onHelpMoney = false;
var on_helpMoneyCallback = function (data) {
    var str = null;
    if (data.code == 200) {
        str = '今天第 ' + data.counts + ' 次领取 10000 救济金';
        Global.curPlayer.money = data.money;
        if (Connector.frame_ui.name == 'Room') {
            onHelpMoney = true;
            Connector.frame_ui._desk.main.player.setMoney(data.money);
        }
    } else {
        str = '今天领取救济金次数用完,请去商城充值!'
    }
    Connector.frame_ui.commonLayer.setTipsString(str, 3);
    if (Connector.frame_ui.name == 'Hall') {
        Connector.frame_ui.updateUserInfo();
    }
};

var getGlobalPlayer = function (playerList) {
    var player = _.find(playerList, function (p) {
        if (p)
            return p.uuid == Global.curPlayer.uuid;
    });
    Global.curPlayer = null;
    return player;
};
var disconnectCallback = function (data) {
    Connector.frame_ui.commonLayer.setTipsString('与服务器断开连接,请重连...');
};
var timeoutCallback = function (data) {
    Connector.frame_ui.commonLayer.setTipsString('当前网络不佳...', 3);
};
var chatCallback = function (data) {
};
var testJB = function(data){
    console.log(data);
};