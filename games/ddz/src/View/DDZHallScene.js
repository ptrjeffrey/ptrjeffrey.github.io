/**
 * Created by Mic on 15/11/10.
 */


var HallScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.ddzP.ddz_hall_plist);
        //cc.spriteFrameCache.addSpriteFrames(res.ddzP.ddz_room_plist);

        HallScene.instance = this;

        var container = new syntc.RootLayer();
        this.container = container;

        //var bgLayer = this.createBgLayer();
        var hallLayer = new HallLayer();
        game.preferPhone(hallLayer);

        var helpLayer = new DDZHallHelp();
        game.preferPhone(helpLayer);
        helpLayer.hide();
        this.helpLayer = helpLayer;

        var commonLayer = new DDZCommonLayer();
        //game.preferPhone(commonLayer);
        commonLayer.hide();
        this.commonLayer = commonLayer;
        hallLayer.commonLayer = commonLayer;

        //container.addContentLayer(bgLayer);
        container.addContentLayer(hallLayer);
        container.addContentLayer(helpLayer);
        container.addContentLayer(commonLayer);

        this.addChild(container);
    },
    createBgLayer: function () {
        //var layer = new cc.Layer();
        //game.preferPhone(layer);
        //
        //layer.initComps = function () {
        //    var bg = new cc.Sprite("#Hall_bg.png");
        //    //bg.scale = size.width / bg.width;
        //    syntc.node.center(bg, this);
        //
        //    this.addChild(bg);
        //};
        //return layer;
    },
    onEnter: function () {
        this._super();
        //if (!Connector.LOGIN) {
        //    this.commonLayer.setTipsString('正在连接服务器...');
        //    Connector.login();
        //}

        cc.loader.load(g_hall_sound, function (result, count, loadedCount) {
        }, function () {
            cc.log('大厅音频加载完毕...');
            //game.sound.playMusic(res.hall_sound.ddz_bgm);
        });
    },
    onExit: function () {
        this._super();
        //cc.spriteFrameCache.removeSpriteFrames(res.ddz.ddz_hall_plist);

    }
});
var HallLayer = cc.Layer.extend({
    name: 'Hall',
    ctor: function () {
        this._super();
    },
    initComps: function () {

        var bg = new cc.Sprite("#Hall_bg.png");
        syntc.node.center(bg, this);
        this.addChild(bg);

        var hallBg = new cc.Sprite('#Hall_model.png');
        tool.node.pos(hallBg, 0, this.height, 0, 1);
        this.addChild(hallBg);
        this._hallBg = hallBg;

        this.initBottom();
        var hall1 = this.initHallContent("#Hall_nr1.png", '#Hall_rw1.png', cc.p(this.width / 3 + 5, this._hallBg.height * .685), this.hall1CallBack);
        hall1.setTag('normal_room1');
        var hall2 = this.initHallContent("#Hall_nr2.png", '#Hall_rw2.png', cc.p(this.width / 3 + 5, this._hallBg.height * .385), this.hall1CallBack);
        hall2.setTag('normal_room2');
        var hall3 = this.initHallContent("#Hall_nr3.png", '#Hall_rw3.png', cc.p(this.width / 3 + 5, this._hallBg.height * .105), this.hall1CallBack);
        hall3.setTag('normal_room3');
        this.initLittleMenuButton();

        this.player = this.displayPlayerInfo();
        tool.node.pos(this.player, 55, 48, 0);
        this.addChild(this.player, 3);

        if (Connector.LOGIN) {
            this.updateUserInfo();
        }
        this.pomeloListen();
    },
    initBottom: function () { //底部条
        var bottomInfo = new cc.Sprite("#Hall_dibu.png");
        tool.node.pos(bottomInfo, 0, 0, 0, 0);
        this.addChild(bottomInfo);

        //快速加入
        var startBtn = new MenuButton("Hall_star1.png", "Hall_star2.png", cc.p(this.width / 2, bottomInfo.height - 5));
        startBtn.scale = .7;
        startBtn.addTouchEventListener(this.quickJoinCallBack, this);
        this.addChild(startBtn);
    },
    initHallContent: function (image1, image2, pos, cb) {  //大厅的按钮
        var hallBg = new MenuButton("Hall_boli1.png", "Hall_boli2.png", pos);
        hallBg.addTouchEventListener(cb, this);
        this._hallBg.addChild(hallBg);

        var hallInfo = new cc.Sprite(image1);
        tool.node.center(hallInfo, hallBg);
        hallBg.addChild(hallInfo);

        var anti = new cc.Sprite(image2);
        tool.node.pos(anti, hallBg.width * 1.5, hallBg.height / 2 + 20);
        hallBg.addChild(anti);

        return hallBg;
    },
    initLittleMenuButton: function () {  //四个按钮   左上 右上 右下和快速加入
        var helpBtn = new MenuButton("Hall_help1.png", "Hall_help2.png", cc.p(this.width - 70, this.height - 50));
        helpBtn.addTouchEventListener(this.pressHelp, this);
        this.addChild(helpBtn);

        var gameBtn = new MenuButton("Hall_game1.png", "Hall_game2.png", cc.p(70, this.height - 50));
        gameBtn.addTouchEventListener(this.moreGame, this);
        this.addChild(gameBtn);

        var bagBtn = new MenuButton("Hall_bag1.png", "Hall_bag2.png", cc.p(this.width - 70, 50));
        bagBtn.addTouchEventListener(this.pressShop, this);
        this.addChild(bagBtn);
    },
    pressHelp: function (object, type) {
        if (type == 2) {
            HallScene.instance.helpLayer.show();
            cc.audioEngine.playMusic(res.hall_sound.ddz_btn_mp3, false);
        }
    },
    pressShop: function (object, type) {
        if (type == 2) {
            window.open('http://h5.3721w.com/#user/qianbao');
            //game.sound.playMusic(res.hall_sound.ddz_btn_mp3);
            cc.audioEngine.playMusic(res.hall_sound.ddz_btn_mp3, false);

        }
    },
    moreGame: function (object, type) {
        if (type == 2) {
            window.open("http://h5.3721w.com/");
            cc.audioEngine.playMusic(res.hall_sound.ddz_btn_mp3, false);
        }
    },
    //***********
    //* 回调函数
    //**********
    quickJoinCallBack: function (object, type) {  //快速加入
        if (type == 2) {
            cc.audioEngine.playMusic(res.hall_sound.ddz_btn_mp3, false);
            if (Global.curPlayer.money < 10000) {
                this.commonLayer.setTipsString('金币不足,请去商城充值...', 3);
            } else {
                this.commonLayer.setTipsString('正在进入游戏场 ...');
                Global.curGameLayer = this;
                Connector.quickJoin();
            }
        }
    },
    hall1CallBack: function (object, type) {
        if (type == 2) {
            var roomTag = object.getTag();
            cc.audioEngine.playMusic(res.hall_sound.ddz_btn_mp3, false);

            if (Global.curPlayer.money < 10000) {
                this.commonLayer.setTipsString('金币不足,请去商城充值...', 3);
            } else {
                object.setEnabled(false);
                this.commonLayer.setTipsString('正在进入 ' + Global.ROOM.name[Number(roomTag.charAt(roomTag.length - 1))] + ' ...');
                Connector.enterRoom(roomTag, function () {
                    object.setEnabled(true);
                });
            }
        }
    },
    onEnter: function () {
        this._super();
        Connector.frame_ui = this;
        var self = this;

        //this.updateUserInfo();
        //for test
        //var label = new cc.LabelTTF('test', 'Arial', 20, cc.size(500, 600));
        //tool.node.pos(label, 300, 600);
        //this.addChild(label, 20);
        //this._label = label;

        if (!Connector.LOGIN) {
            Login.getUserInfo(function (isSuccess, data) {
                if (isSuccess) {
                    //self._label.setString('login1 ' + JSON.stringify(data));
                    console.log('login getUserInfo ', data);
                    //data = null;
                    //data = {
                    //    sid:"ecgteqe7sk4k03glr9e205rd66&nsukey",
                    //    scode:"14622700676004ikkorfxsenzgdwfc3xif8vjn9ia56nl"
                    //};
                    //self.commonLayer.setTipsString('data= ' + JSON.stringify(data), 100);
                    Connector.login(data);
                } else {
                    self.commonLayer.setTipsString('获取用户信息失败...', 3);
                    delCookie('sid');
                    delCookie('scode');
                    window.location.href = 'login.html';
                }
            });
        }
        //for test
        //if (!Connector.LOGIN) {
        //    Connector.login({
        //        //sid: "ogiq6f7obsk3idpveqhuteeqg2&nsukey",
        //        sid: "sk2to3r322qgqri85iu07qbq32&nsuk",
        //        scode: "14622700676004ikkorfxsenzgdwfc3xif8vjn9ia56nl"
        //    });
        //}
    },
    onExit: function () {
        this._super();
        Connector.frame_ui = null;

        pomelo.removeListener('on_helpMoney', on_helpMoneyCallback);
        pomelo.removeListener('disconnect', disconnectCallback);
        pomelo.removeListener('heartbeat timeout', timeoutCallback);
    },
    updateUserInfo: function () {
        var player = Global.curPlayer;
        cc.log(player);
        this.player.setUserName(player.userName);
        this.player.setMoney(player.hasOwnProperty('money') ? '' + player.money : player.info.money);
        this.player.setUserIcon(player.headUrl);
    },
    displayPlayerInfo: function () {
        var bg = new cc.Node();

        var icon = new cc.Sprite();
        bg.addChild(icon, 3);
        bg.icon = icon;

        var username = new cc.LabelTTF("", game.fonts.helvetica,
            20, cc.size(115, 20), cc.TEXT_ALIGNMENT_RIGHT);
        username.fillStyle = cc.color.WHITE;
        bg.addChild(username);

        var coins = new cc.LabelTTF("", game.fonts.helveticaMedium,
            20, cc.size(100, 20), cc.TEXT_ALIGNMENT_RIGHT);
        coins.fillStyle = cc.color(255, 179, 34);
        bg.addChild(coins);

        icon.scale = .85;
        tool.node.pos(icon, 21, 22);
        tool.node.pos(username, 140, 10);
        tool.node.pos(coins, 155, -24);

        bg.setUserName = function (name) {
            if (name) {
                username.visible = true;
                username.setString(name);
            } else {
                username.visible = false;
            }
        };
        bg.setMoney = function (money) {
            if (money) {
                coins.visible = true;
                coins.setString(money);
            } else {
                coins.visible = false;
            }
        };
        bg.setUserIcon = function (ic) {
            icon.visible = true;
            //Connector.frame_ui._label.setString(ic);
            //ic = 'http://wx.qlogo.cn/mmopen/eFvXSNCqWRPkAwK4PfNW1CZuzo2kwhsibXficAMeGdTH4MZHrco95iawepoENYbwdgwR0SW09gR6icX6RNibqOSSEAEdPj6AUicPNv/0';
            //ic = 'http://img2.imgtn.bdimg.com/it/u=2833698760,3730205312&fm=21&gp=0.jpg';
            if (ic) {
                cc.loader.loadImg(ic, {isCrossOrigin: true}, function (err, img) {
                    //showPicture(img, cc.p(icon.width / 2, icon.height / 2), icon);
                    testShow(img, cc.p(icon.width / 2, icon.height / 2), icon);
                });
            }
        };
        bg.reset = function () {
            bg.icon.visible = false;
            bg.icon.removeAllChildren(true);

            this.setUserName(null);
            this.setMoney(null);
        };
        //bg.reset();
        return bg;
    },
    pomeloListen: function () {
        pomelo.on('on_helpMoney', on_helpMoneyCallback);
        pomelo.on('disconnect', disconnectCallback);
        pomelo.on('heartbeat timeout', timeoutCallback);
        pomelo.on('on_login', function (data) {
            console.error(data);
            Connector.frame_ui.commonLayer.setTipsString('签到', 2);
        });
    }
});
var showPicture = function (filename, position, target, scale) {

    var senticl = new cc.Sprite(res.ddzP.ddz_common_icon);
    var clipping = new cc.ClippingNode;
    clipping.setStencil(senticl);
    clipping.setInverted(false);
    clipping.setAlphaThreshold(0);
    target.addChild(clipping);

    var icon = new cc.Sprite(filename);
    icon.scale = 106 / icon.getContentSize().width;

    syntc.node.center(icon, clipping);
    clipping.addChild(icon);
    clipping.setPosition(position);

    if (!!scale) {
        clipping.scale = scale;
    }
};
var testShow = function (filename, pos, target,scale) {
    //要显示的圆形模板
    var shape = new cc.DrawNode();
    shape.drawCircle(cc.p(0, 0), 48, cc.degreesToRadians(0), 100, false, 10, cc.color(255, 255, 255, 255));
    // 增加一个圆形显示
    var clipper = new cc.ClippingNode();
    clipper.setPosition(pos);
    clipper.stencil = shape;  // 把刚刚创建的圆形模板放入
    target.addChild(clipper);

    var logo = new cc.Sprite(filename);
    logo.scale = 106 / logo.getContentSize().width;
    clipper.addChild(logo);    // 在这个clippingnode中只显示圆形模板的部分.

    if (!!scale) {
        clipper.scale = scale;
    }
};

var delCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
var getCookie = function (name) {
    console.log('----------getcook ', name);
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null)
        return arr[2];
    return null;
};
