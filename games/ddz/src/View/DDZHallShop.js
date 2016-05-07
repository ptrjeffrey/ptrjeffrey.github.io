/**
 * Created by Mic on 15/12/20.
 */

var DDZHallShop = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 150));
    },
    initComps: function () {
        var bg = new cc.Sprite('#Hall_shop_bg.png');
        tool.node.pos(bg, this.width / 2, this.height * .6);
        this.addChild(bg);
        this.bg = bg;
        this.bg.visible = false;

        var exitBtn = new MenuButton("Hall_shop_exit1.png", "Hall_shop_exit2.png", cc.p(bg.width - 50, bg.height - 80));
        exitBtn.addTouchEventListener(this.exitPress, this);
        bg.addChild(exitBtn);

        var money = [2, 5, 10, 20, 50, 100];
        var self = this;
        _.each(money, function (each, i) {
            var x = self.bg.width * .2 + i % 3 * 200;
            var y = self.height * .31 - parseInt(i / 3) * 170;
            var btn = new MenuButton("Hall_shop_btn1.png", "Hall_shop_btn2.png", cc.p(x, y));
            btn.tag = each;
            btn.addTouchEventListener(self.moneyPress, self);
            bg.addChild(btn);

            var label = new cc.Sprite("#Hall_shop_" + each + ".png");
            tool.node.pos(label, btn.width / 2, btn.height / 2);
            btn.addChild(label);
        });
    },
    displayEff: function () {
        this.bg.runAction(cc.sequence(cc.scaleTo(.01, .2), cc.callFunc(function () {
                this.bg.visible = true;
            }, this),
            cc.scaleTo(.5, .9).easing(cc.easeIn(.5))));
    },
    exitPress: function (object, type) {
        if (type == 2) {
            this.hide();
        }
    },
    moneyPress: function (object, type) {
        if (type == 2) {
            cc.log(object.tag);
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