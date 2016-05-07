/**
 * Created by Mic on 15/11/20.
 */
var CardBack = function () {
    var back = new cc.Sprite('#Room_xiaop.png');
    back.scale = 1.3;

    var label = new cc.LabelBMFont("", res.ddzP.ddz_card_num_fnt);
    label.scale = .6;
    syntc.node.center(label, back);
    back.addChild(label, 1);
    back.label = label;

    back.setCard = function (num) {
        this.label.setString(num);
    };
    back.setCard("");
    return back;
};

var Desk = function (pos, target) {
    this.player = new Player(pos, target);
    this.cards = [];
    this.plays = [];
    this.pass = new cc.Sprite('#Room_guo.png');
    this.ready = new cc.Sprite('#ready_ddz.png');
    this.ready.scale = .8;
    var self = target;

    if (pos != 1) {          //卡背
        this.back = new CardBack();
        self.addChild(this.back, 1);
    }

    switch (pos) {
        case 1:
            tool.node.pos(this.player, 55, 48, 0);
            tool.node.pos(this.ready, self.width * .5, 300);
            tool.node.pos(this.pass, self.width * .5, 550);
            break;
        case 2:
            tool.node.pos(this.player, self.width - 200, self.height * .73, 0);
            tool.node.pos(this.ready, self.width - 100, self.height * .6);
            tool.node.pos(this.back, self.width - 190, self.height * .79);
            tool.node.pos(this.pass, self.width - 70, self.height * .6);
            break;
        case 4:
            tool.node.pos(this.player, 55, self.height * .73, 0);
            tool.node.pos(this.ready, 100, self.height * .6);
            tool.node.pos(this.back, 190, self.height * .79);
            tool.node.pos(this.pass, 70, self.height * .6);

            break;
    }
    self.addChild(this.pass, 2);
    self.addChild(this.ready, 2);
    self.addChild(this.player, 2);

    this.reset = function () {
        this.clearDesk();
        this.player.clear();

        if (this.back) {
            this.back.setCard(0);
        }

        for (var i in this.cards) {
            this.cards[i].removeFromParent();
        }
        this.cards = [];
    };

    this.clearDesk = function () {
        for (var i in this.plays) {
            this.plays[i].removeFromParent();
        }
        this.plays = [];

        if (self._dizhu == pos) {
            self._dizhumask.visible = false;
        }

        if (this.ready)
            this.ready.visible = false;
        if (this.pass)
            this.pass.visible = false;
    };
    this.clearCards = function () {
        for (var i in this.cards) {
            this.cards[i].removeFromParent();
        }
        this.cards = [];
    };

    this.reset();
};


