/**
 * Created by Mic on 15/11/21.
 */

var Timer = function (target) {
    var self = target;
    var bg = new cc.Sprite('#Room_lzhong.png');
    tool.node.pos(bg, this.width / 2, this.height * .8);
    self.addChild(bg, 10);

    var num = new cc.LabelBMFont("", res.ddzP.ddz_timer_num_fnt);
    syntc.node.pos(num, bg.width * .5, bg.height * .5 - 5);
    bg.addChild(num, 5);
    bg.num = num;

    bg.alert = function (pos, t) {
        bg.visible = true;
        switch (pos) {
            case 1:
                tool.node.pos(bg, self.width / 2, self.height * .5+50);
                break;
            case 2:
                tool.node.pos(bg, self.width - 100, self.height * .63);
                break;
            case 4:
                tool.node.pos(bg, 100, self.height * .63);

                break;
        }
        bg.num.setString(t, true);
        bg.stopAllActions();
        bg.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.), cc.callFunc(function () {
            var v = parseInt(bg.num.string) - 1;
            if (v >= 0)
                bg.num.setString(v);
            else {
                self._menus.defaultAction();
                bg.stopAllActions();
            }
        }, bg))));
    };
    bg.stop = function () {
        bg.visible = false;
        bg.stopAllActions();
    };

    return bg;
};