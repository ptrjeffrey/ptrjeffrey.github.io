/**
 * Created by Mic on 16/1/22.
 */

var DDZCommonLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 150));
        this.init();
    },
    init: function () {

        var windowSp = new cc.Sprite('#Hall_window.png');
        tool.node.pos(windowSp, this.width * .5, this.height * .5);
        if (cc.sys.os == "Android") {
            windowSp.scale = 1;
        }else{
            windowSp.scale = .7;
        }
        this.addChild(windowSp);
        this.bg = windowSp;

        var tipsLabel = new cc.LabelTTF('', game.fonts.droid, 20);
        tool.node.pos(tipsLabel, windowSp.width / 2, windowSp.height / 2);
        windowSp.addChild(tipsLabel);
        tipsLabel.fillStyle = cc.color.GRAY;
        this.tips = tipsLabel;
    },
    setTipsString: function (label, time, cb) {
        this.show();
        this.tips.setString(label);

        if (!!time) {
            this.doAction(time, cb);
        }
    },
    doAction: function (time, cb) {
        if (!!cb) {
            this.bg.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(function () {
                this.hide();
                cb();
            }, this)));
        } else {
            this.bg.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(function () {
                this.hide();
            }, this)));
        }
    },
    show: function () {
        this.visible = true;
    },
    hide: function () {
        this.visible = false;
    }
});