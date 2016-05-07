/**
 * Created by Mic on 15/12/20.
 */

var DDZHallHelp = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 150));
    },
    initComps: function () {
        var bg = new cc.Sprite('#Hall_help_bg.png');
        tool.node.pos(bg, this.width / 2, this.height * .6);
        this.addChild(bg);
        this.bg = bg;
        this.bg.scale = .9;
        this.bg.visible = false;

        var exitBtn = new MenuButton("Hall_shop_exit1.png", "Hall_shop_exit2.png", cc.p(bg.width - 50, bg.height - 80));
        exitBtn.addTouchEventListener(this.exitPress, this);
        bg.addChild(exitBtn);

        var title = new cc.Sprite("#Hall_help_title.png");
        tool.node.pos(title, bg.width * .2, bg.height * .78);
        bg.addChild(title);

        var label = new cc.LabelTTF('斗地主游戏玩法规则简单需由3个玩家进行，' +
            '用一副54张牌(连鬼牌)，其中一方为地主,' +
            '其余两家为另一方，双方对战，先出完牌的一方获胜。',
            game.fonts.helvetica, 30, cc.size(530, 500), cc.TEXT_ALIGNMENT_LEFT);
        tool.node.pos(label, bg.width / 2, bg.height * .7, .5, 1);
        bg.addChild(label);
    },
    displayEff: function () {
        this.bg.visible = true;
    },
    exitPress: function (object, type) {
        if (type == 2) {
            this.hide();
        }
    },
    show: function () {
        this.visible = true;
        this.displayEff();
    },
    hide: function () {
        this.visible = false;
        if (this.bg)
            this.bg.visible = false;
    }
});