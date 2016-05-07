/**
 * Created by Mic on 15/11/20.
 */
var Player = function (pos, target) {
    var self = target;
    var bg = new cc.Node();
    var gender = Math.round(Math.random() + .1);
    bg.init = false;

    var icon = new cc.Sprite();
    bg.addChild(icon, 3);
    bg.icon = icon;

    var username = new cc.LabelTTF("_username", game.fonts.helvetica,
        16, cc.size(115, 16), (pos == 2) ? cc.TEXT_ALIGNMENT_RIGHT : cc.TEXT_ALIGNMENT_LEFT);
    username.fillStyle = cc.color.WHITE;
    bg.addChild(username);

    var hat = new cc.Sprite('#ddzn_nongming.png');
    bg.addChild(hat, 3);

    //金币
    var coins = new cc.LabelTTF("", game.fonts.helveticaMedium,
        20, cc.size(100, 20), cc.TEXT_ALIGNMENT_LEFT);
    coins.fillStyle = cc.color(255, 179, 34);
    //加倍标志
    var db = new cc.Sprite("#ddzn_double_2.png");
    bg.addChild(db);

    //掉线和托管的标示
    var hosting = new cc.Sprite();
    bg.addChild(hosting, 3);
    hosting.visible = false;

    var popups = [];
    popups[0] = new cc.Sprite("#Room_bujiao.png");
    popups[1] = new cc.Sprite("#Room_jdz.png");
    popups[2] = new cc.Sprite("#Room_buqiang.png");
    popups[3] = new cc.Sprite("#Room_qdz.png");
    popups[4] = new cc.Sprite("#Room_nbujiab.png");
    popups[5] = new cc.Sprite("#Room_jiabei.png");

    for (var i in popups) {
        bg.addChild(popups[i]);
    }

    switch (pos) {
        case 1:
            icon.scale = .85;
            tool.node.pos(icon, 21, 22);
            tool.node.pos(username, 190, 10);
            tool.node.pos(coins, 155, -24);  //金币 只有desk =1 显示
            tool.node.pos(hat, 105, 60);
            tool.node.pos(db, 150, 55);
            bg.addChild(coins, 2);
            for (var i in popups) {
                //tool.node.pos(popups[i], self.width / 2, 480, .5, 0);
                tool.node.pos(popups[i], 340, 480, 1, 0);
            }
            break;
        case 2:
            tool.node.pos(icon, 100, 20);
            tool.node.pos(username, 55, 105);
            tool.node.pos(hat, 10, 10);
            tool.node.pos(db, 10, -30);
            tool.node.pos(hosting,100,20);
            for (var i in popups) {
                tool.node.pos(popups[i], 30, -140, .5, 0);
            }
            break;
        case 4:
            tool.node.pos(icon, 45, 20);
            tool.node.pos(username, 85, 105);
            tool.node.pos(hat, 135, 10);
            tool.node.pos(db, 135, -30);
            tool.node.pos(hosting,40,20);

            for (var i in popups) {
                tool.node.pos(popups[i], 70, -140, .5, 0);
            }
            break;
    }
    bg.deskClear = function () {
        for (var i in popups) {
            popups[i].visible = false;
        }
    };
    bg.clear = function () {
        //关闭其他的精灵 比如头像..etc
        hat.visible = false;
        db.visible = false;
        hosting.visible = false;

        for (var i in popups) {
            popups[i].visible = false;
        }
    };
    bg.reset = function () {
        this.clear();
        this.init = false;

        bg.icon.visible = false;
        bg.icon.removeAllChildren(true);
        this.setUserName(null);
    };
    bg.setMoney = function (money) {
        coins.setString(money);
    };
    bg.setUserIcon = function (ic) {
        icon.visible = true;
        if(ic){
            cc.loader.loadImg(ic, {isCrossOrigin: true}, function (err, img) {
                //showPicture(img,cc.p(icon.width / 2, icon.height / 2), icon);
                testShow(img,cc.p(icon.width / 2, icon.height / 2), icon);
            });
        }else{
            icon.setSpriteFrame('Hall_tx.png');
        }
    };
    bg.setUserName = function (name) {
        if (name) {
            username.visible = true;
            username.setString(name);
        } else {
            username.visible = false;
        }
    };
    bg.setDiZhu = function () {
        hat.visible = true;
        hat.setSpriteFrame('ddzn_dizhu.png');
    };
    bg.setNongMin = function () {

        hat.visible = true;
        hat.setSpriteFrame('ddzn_nongming.png');
    };
    bg.setDisconnect = function () {
        cc.log(pos + '  setDisconnect');
    };
    bg.setDouble = function (v) {
        if (v == 2) {
            db.visible = true;
            db.setSpriteFrame("ddzn_double_2.png");
        } else {
            db.visible = false;
        }
    };
    bg.popScore = function (s) {
        var popup = null;
        if (s == 0) {
            popup = popups[0];

            if (gender == 0) {
                game.sound.playSound(res.ddz.w_m0f);
            } else {
                game.sound.playSound(res.ddz.m_0f);
            }
            //} else if (s == 3) {
        } else {
            popup = popups[1];

            if (gender == 0) {
                game.sound.playSound(res.ddz.w_jiao);
            } else {
                game.sound.playSound(res.ddz.m_jiao);
            }
        }

        if (popup) {
            popup.stopAllActions();
            popup.visible = true;
            popup.runAction(cc.sequence(cc.delayTime(2), cc.hide()));
        }
    };
    bg.popQiang = function (v) {
        var popup = null;
        if (v) {
            popup = popups[3];
            //qiang.visible = true;

            if (gender == 0) {
                game.sound.playSound(res.ddz.w_qiang);
            } else {
                game.sound.playSound(res.ddz.m_qiang);
            }
        } else {
            popup = popups[2];
            //qiang.visible = false;

            if (gender == 0) {
                game.sound.playSound(res.ddz.w_noqiang);
            } else {
                game.sound.playSound(res.ddz.m_noqiang);
            }
        }

        if (popup) {
            popup.stopAllActions();
            popup.visible = true;
            popup.runAction(cc.sequence(cc.delayTime(2), cc.hide()));
        }
    };
    bg.popDouble = function (v) {
        var popup = null;
        if (v == 2) {
            popup = popups[5];

            if (gender == 0) {
                game.sound.playSound(res.ddz.w_double);
            } else {
                game.sound.playSound(res.ddz.m_double);
            }
        } else {
            popup = popups[4];

            if (gender == 0) {
                game.sound.playSound(res.ddz.w_nodouble);
            } else {
                game.sound.playSound(res.ddz.m_nodouble);
            }
        }

        this.setDouble(v);
        if (popup) {
            popup.stopAllActions();
            popup.visible = true;
            popup.runAction(cc.sequence(cc.delayTime(1), cc.hide()));
        }
    };
    bg.getGender = function () {
        return gender;
    };
    bg.setGender = function (sex) {
        gender = sex;
    };

    bg.setDisconnect = function () {
        console.log(pos + '  setDisconnect');
        hosting.setSpriteFrame('ddz_icon_disconnect.png');
        hosting.visible = true;
    };
    bg.setConnect = function () {
        hosting.visible = false;
    };
    bg.hosting = function () {
        console.log(pos + ' hosting');
        //hosting.setSpriteFrame('DDZ_room_host_head.png');
        hosting.visible = true;
    };
    bg.unHosting = function () {
        hosting.visible = false;
    };
    bg.reset();

    return bg;
};

