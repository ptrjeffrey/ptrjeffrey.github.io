var Connector = {
    frame_ui: null,
    game_ui: null,
    LOGIN: false,
    queryEntry: function (player, callback) {
        var route = "gate.gateHandler.queryEntry";
        pomelo.init({
            //host: "120.24.246.144",
            //host: '127.0.0.1',
            host:"114.55.92.111",
            port: 8014,
            log: true
        }, function () {
            pomelo.request(route, player, function (data) {
                console.log('gate data', data);
                //Connector.frame_ui._label.setString(JSON.stringify(data));
                if (data.code === 500) {
                    return;
                }
                callback(data.host, data.port);
            });
        });
    },
    login: function (info) {
        this.queryEntry(info, function (host, port) {
            pomelo.init({
                host: host,
                port: port,
                log: true
            }, function () {
                var route = "connector.entryHandler.enter";
                pomelo.request(route, info, function (data) {
                    console.log('enter ', data);
                    //Connector.frame_ui._label.setString(JSON.stringify(data));

                    if (data.code == 500) {
                        Connector.frame_ui.commonLayer.setTipsString('连接服务器失败...');
                        return;
                    }
                    Connector.frame_ui.commonLayer.setTipsString('连接服务器成功...', 1);
                    Global.curPlayer = data.user;

                    Connector.LOGIN = true;
                    Connector.frame_ui.updateUserInfo();
                });
            });
        });
    },
    enterRoom: function (roomName, cb) {
        var route = 'hall.hallHandler.enterRoom';
        var msg = {
            player: Global.curPlayer,
            roomName: roomName
        };
        pomelo.request(route, msg, function (data) {
            console.log('enterRoom ', data);
            cb();
            if (data.code && data.code == 500) {
                //错误提示弹窗
                var msg = DDZApi.readMsg(data.msg);
                Connector.frame_ui.commonLayer.setTipsString(msg, 2);
            } else {
                var roomInfo = data.roomInfo;
                var backInfo = null;
                Global.curPlayer.roomInfo = data.roomInfo;

                if (data && data.info) {
                    console.error('重连上', data.info);
                    backInfo = data.info;
                }
                cc.director.runScene(new RoomScene(roomInfo, backInfo));
            }
        });
    },
    quickJoin: function () {
        var route = "hall.hallHandler.quickJoin";
        var msg = {player: Global.curPlayer};
        pomelo.request(route, msg, function (data) {
            console.log('quickJoin ', data);

            Global.curPlayer.roomInfo = data.roomInfo;

            var roomInfo = data.roomInfo;
            var backInfo = null;
            if (data && data.info) {
                backInfo = data.info;
            }
            cc.director.runScene(new RoomScene(roomInfo, backInfo));

        });
    },
    enterDesk: function () {
        var route = 'room.roomHandler.enterDesk';
        var msg = {
            player: Global.curPlayer,
            ready: 1
        };
        pomelo.request(route, msg, function (data) {
            console.log('connector enterDesk ', data.code, '  ', Global.PLAYER.Status.Desk_Money_No);
            if (data.code == Global.PLAYER.Status.Desk_Money_No) {
                console.log('钱不够1111!');
                Connector.frame_ui.commonLayer.setTipsString('金币不足,无法继续游戏,请去商城充值!', 1.5, function () {
                    Connector.exitRoom();
                });
            }
        });
    },
    start: function (flag, value) {   //第一个参数是重新一桌 第二个是直接开始还是明牌开始
        if (flag) {
            var route = 'room.roomHandler.enterDesk';
            var msg = {
                player: Global.curPlayer,
                ready: value
            };
            pomelo.request(route, msg, function (data) {
                console.log('connector enterDesk ', data.code, '  ', Global.PLAYER.Status.Desk_Money_No);
                if (data.code == Global.PLAYER.Status.Desk_Money_No) {
                    console.log('钱不够2222!');
                    Connector.frame_ui.commonLayer.setTipsString('金币不足,无法继续游戏,请去商城充值!', 1.5, function () {
                        Connector.exitRoom();
                    });
                }
            });
        } else {
            console.log('准备???');
            Connector.ready(value);
        }
    },
    ready: function (value) {
        var msg = {
            player: Global.curPlayer,
            value: value
        };
        var route = 'room.deskHandler.ready';
        pomelo.request(route, msg, function () {
        });
    },
    askJiaoDizhu: function (msg, cb) {
        var route = 'room.roomHandler.askJiaoDizhu';
        pomelo.request(route, msg, function (data) {
            var pos = DDZApi.curPos[0];
            Connector.frame_ui.askPoint(pos);
        });
    },
    //叫完地主
    score: function (num) {
        var route = 'room.deskHandler.jiao';
        var msg = {
            player: Global.curPlayer,
            value: num
        };
        pomelo.request(route, msg, function (data) {
            //console.log('叫地主结果出来..', data);
        });
    },
    qiang: function (flag) {
        var route = 'room.deskHandler.qiang';
        var msg = {
            player: Global.curPlayer,
            value: flag
        };
        pomelo.request(route, msg, function (data) {
        });
    },
    callDouble: function (num) {
        //加倍了才能调用
        var route = 'room.deskHandler.double';
        var msg = {
            player: Global.curPlayer,
            value: num
        };
        pomelo.request(route, msg, function () {

        });
    },
    play: function (value) {
        var route = 'room.deskHandler.play';
        var msg = {
            player: Global.curPlayer,
            value: value
        };
        pomelo.request(route, msg, function () {

        });
    },
    hosting: function () {
        var route = 'room.deskHandler.hosting';
        var msg = {player: Global.curPlayer};
        pomelo.request(route, msg, function () {

        });
    },
    unHosting: function () {
        var route = 'room.deskHandler.unHosting';
        var msg = {player: Global.curPlayer};
        pomelo.request(route, msg, function () {

        });
    },
    test: function () {
        var route = 'room.roomHandler.test';
        pomelo.request(route, {userName: 'mic'}, function (data) {
            console.log('Just test  ', data);
        });
    },
    exitRoom: function () {
        var route = 'room.roomHandler.exitRoom';
        var msg = {player: Global.curPlayer};
        pomelo.request(route, msg, function (data) {
            console.log('退出房间成功', data);
            cc.director.runScene(new HallScene());
        });
    }
};



