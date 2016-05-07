/**
 * Created by Mic on 15/12/8.
 */

var DDZResultDialog = cc.LayerColor.extend({
    ctor: function (result, cb) {
        this._super(cc.color(0, 0, 0, 150));
        this._result = result;
        this._cb = cb;
    },
    initComps: function () {
        //console.log(this._result);
        var flag = this._result.flag;
        var seatIndex = this._result.seatIndex;
        var gameCoins = this._result.overInfo.gameCoins;
        var money = gameCoins[seatIndex];
        var beishu = this._result.beishu;
        var dizhu = this._result.dizhu;

        var bgFile = null, titleFile = null, font = null, eff = null, effFile;
        switch (flag) {
            case true:
                bgFile = '#Room_win_bg.png';
                titleFile = '#Room_win_label.png';
                money = "+" + money;
                font = res.ddzP.ddz_win_num_fnt;
                eff = "#Room_win_eff.png";
                effFile = res.ddz.eff_win;
                break;
            case false:
                bgFile = '#Room_lose_bg.png';
                titleFile = '#Room_lose_label.png';
                money = '' + money;
                font = res.ddzP.ddz_lose_num_fnt;
                eff = "#Room_lose_eff.png";
                effFile = res.ddz.eff_lose;
                break;
        }
        game.sound.playSound(effFile);

        var bg = new cc.Sprite(bgFile);
        tool.node.pos(bg, this.width / 2, this.height * .5);
        this.addChild(bg);
        this.bg = bg;

        if(seatIndex != dizhu) {
            var label = new cc.LabelTTF("倍数     倍", "Arial", 26);
            tool.node.pos(label, bg.width * .5, bg.height * .64 - 5);
            bg.addChild(label);

            var bs = new cc.LabelTTF(beishu * this._result.playerList[seatIndex].beishu, "Arial", 24);
            tool.node.pos(bs, bg.width * .5 + 12, bg.height * .64 - 5);
            bs.fillStyle = cc.color.GREEN;
            bg.addChild(bs);
        }

        var effSp = new cc.Sprite(eff);
        tool.node.pos(effSp, bg.width / 2, bg.height / 2 - 50);
        effSp.scale = .2;
        bg.addChild(effSp);

        var title = new cc.Sprite(titleFile);
        tool.node.pos(title, bg.width / 2, bg.height / 2);
        title.scale = .8;
        bg.addChild(title);

        var num = new cc.LabelBMFont(money, font);
        tool.node.pos(num, bg.width / 2 - 10, bg.height * .3 + 12);
        num.scale = .6;
        bg.addChild(num);

        //显示另外两个人的信息
        var playerList = this._result.playerList;
        playerList.splice(seatIndex, 1);
        console.log(playerList);


        var self = this;
        _.each(playerList, function (p, i) {
            self.addPlayerInfo(p, cc.p(bg.width * .2 + bg.width * i * .4, bg.height * .25), bg);
        });

        effSp.runAction(cc.sequence(cc.scaleTo(.5, .9).easing(cc.easeIn(.5))));

        this.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(function () {
            this.removeFromParent();
            this._cb();
        }, this)));
    },
    addPlayerInfo: function (playerInfo, pos, target) {
        if (playerInfo.headUrl) {
            cc.loader.loadImg(playerInfo.headUrl, {isCrossOrigin: true}, function (err, img) {
                //showPicture(img, pos, target, .35);
                testShow(img, pos, target, .35);
            });
        }
        var username = new cc.LabelTTF(playerInfo.userName, game.fonts.helvetica,
            18, cc.size(70, 20), cc.TEXT_ALIGNMENT_LEFT);
        username.fillStyle = cc.color.WHITE;
        username.setPosition(cc.p(pos.x + 55, pos.y));
        target.addChild(username);

        var moneyBox = new cc.Sprite('#DDZ_result_box.png');
        tool.node.pos(moneyBox, pos.x + target.width * .1, pos.y - moneyBox.height * .7, .5, .5);
        target.addChild(moneyBox);
        moneyBox.scale = .8;

        var money = this._result.overInfo.gameCoins[playerInfo.seatIndex];
        if (Number(money) > 0){
            money = '+'+ money;
        }
        var coins = new cc.LabelTTF(money, game.fonts.helveticaMedium,
            22, cc.size(160, 23), cc.TEXT_ALIGNMENT_RIGHT);
        coins.fillStyle = cc.color(255, 179, 34);
        tool.node.pos(coins, moneyBox.width * .9, moneyBox.height / 2, 1, .5);
        moneyBox.addChild(coins);

        //倍数
        if(playerInfo.seatIndex != this._result.dizhu) {
            var beishuSp = new cc.Sprite("#Room_beishu.png");
            tool.node.pos(beishuSp, pos.x + target.width * .2, pos.y);
            beishuSp.scaleX = .68;
            beishuSp.scaleY = .6;
            target.addChild(beishuSp);
            console.log('倍数信息 ',playerInfo.beishu,'   ',this._result.beishu);
            var jiaofen = new cc.LabelTTF(playerInfo.beishu * this._result.beishu, 'Arial',
                26, cc.size(90, 32), cc.TEXT_ALIGNMENT_CENTER,
                cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            jiaofen.fillStyle = cc.color.RED;
            tool.node.pos(jiaofen, beishuSp.width * .3, beishuSp.height / 2);
            beishuSp.addChild(jiaofen);
        }
    },
    hide: function () {
        this.visible = false;
    },
    show: function () {
        this.visible = true;
    }
});