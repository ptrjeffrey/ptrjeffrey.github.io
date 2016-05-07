var RoomScene = cc.Scene.extend({
    ctor: function (roomInfo, backInfo) {
        this._super();

        cc.spriteFrameCache.addSpriteFrames(res.ddzP.ddz_room_plist);
        cc.spriteFrameCache.addSpriteFrames(res.ddzP.ddz_cards_plist);
        cc.spriteFrameCache.addSpriteFrames(res.ddzP.ddz_eff_plist);

        RoomScene.instance = this;

        var container = new syntc.RootLayer();
        this.container = container;

        //var bgLayer = this.createBgLayer();

        var roomLayer = new DDZRoomLogic(roomInfo, backInfo);
        game.preferPhone(roomLayer);

        var settingLayer = new DDZRoomSetting();
        game.preferPhone(settingLayer);
        settingLayer.hide();
        this.settingLayer = settingLayer;

        var commonLayer = new DDZCommonLayer();
        commonLayer.hide();
        this.commonLayer = commonLayer;
        roomLayer.commonLayer = commonLayer;

        //container.addContentLayer(bgLayer);
        container.addContentLayer(roomLayer);
        container.addContentLayer(settingLayer);
        container.addContentLayer(commonLayer);

        this.addChild(container);

        cc.loader.load(g_sounds_ddz, function (result, count, loadedCount) {
        }, function () {
            cc.log('音频加载完毕...');
        });
    },
    createBgLayer: function () {
        var layer = new cc.Layer();
        game.preferPhone(layer);

        layer.initComps = function () {
            var bg = new cc.Sprite("#Room_bg.png");
            bg.scaleX = this.width / bg.width;
            bg.scaleY = this.height / bg.height;
            syntc.node.center(bg, this);

            this.addChild(bg);
        };

        return layer;
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.ddzP.ddz_cards_plist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.ddzP.ddz_room_plist);
    }
});
var RoomLayer = cc.Layer.extend({
    CARD_WIDTH: 116,//106,
    CARD_HEIGHT: 172,//144,
    CARD_GAP_H: 44,
    CARD_GAP_V: 16,
    CARD_GAP_SV: 58,
    CARD_GAP_BV: 6,
    CARD_GAP_PV: 80,
    CARD_SEAT_MAIN_SCALE: .85,
    CARD_SEAT_SIDE_SCALE: 0.45,
    CARD_SEAT_SIDE_BACK_SCALE: 1,
    CARD_PLAY_SCALE: 0.5,
    name: 'Room',
    TIMEOUT_READY: 5,
    TIMEOUT_POINT: 15,
    TIMEOUT_CALL: 15,
    TIMEOUT_DOUBLE: 5,
    TIMEOUT_PLAY: 20,
    TIMEOUT_PLAY_SHORT: 3,
    TIMEOUT_ROBOT_HOSTING: 1,
    _roomInfo: null,
    _robot: null,
    timeoutId: null,
    _startFlag: false,
    ctor: function () {
        this._super();
        //Connector.game_ui = this;
        //Connector.frame_ui = this;
        //
        //var label = new cc.LabelTTF('test', 'Arial', 20, cc.size(500, 600));
        //tool.node.pos(label, 300, 600);
        //this.addChild(label, 20);
        //this._label = label;

        this._hint = new DDZHint();
        this._desk = {};

        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            target: this,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        };
        cc.eventManager.addListener(listener, this);
    },
    initComps: function () {
        var bg = new cc.Sprite("#Room_bg.png");
        syntc.node.center(bg, this);
        this.addChild(bg);

        this.initUI();
        this._playingCard = true;

        this.initToast();

        this._tip = this.testMarquee();
        this.addChild(this._tip, 10);
        this.updateBullMsg();

    },
    initUI: function () {
        this.initBottom();

        //this.test();
        this._dipai = this.createDipai();

        this._desk = {
            main: new Desk(1, this),
            right: new Desk(2, this),
            left: new Desk(4, this)
        };

        this._timer = new Timer(this);
        this._timer.visible = false;
        this._menus = this.createMenus();
    },
    seatForPos: function (pos) {
        switch (pos) {
            case 1:
                return this._desk.main;
            case 2:
                return this._desk.right;
            case 4:
                return this._desk.left;
            default:
                return null;
        }
    },
    initBottom: function () {
        var title = new cc.Sprite("#Room_title.png");
        tool.node.pos(title, this.width / 2, this.height, .5, 1);
        this.addChild(title);
        //右上的倍数
        var beishuSp = new cc.Sprite("#Room_beishu.png");
        tool.node.pos(beishuSp, this.width - 70, this.height - 48);
        beishuSp.scaleX = 1.2;
        this.addChild(beishuSp);

        //顶部几个按钮  设置 + 退出
        var exitBtn = new MenuButton("Room_tuichu.png", "Room_tuichu1.png", cc.p(this.width / 2 - 120, this.height - 50));
        exitBtn.addTouchEventListener(this.roomExitBtn, this);
        this.addChild(exitBtn);

        var settingBtn = new MenuButton("Room_shezhi.png", "Room_shezhi1.png", cc.p(this.width / 2 + 123, this.height - 50));
        settingBtn.addTouchEventListener(this.roomSettingBtn, this);
        this.addChild(settingBtn);

        //底部 底分
        var difenSp = new cc.Sprite('#Room_jcf.png');
        tool.node.pos(difenSp, this.width - 100, 42);
        this.addChild(difenSp, 2);
        //底部条
        var bottomInfo = new cc.Sprite("#Hall_dibu.png");
        tool.node.pos(bottomInfo, 0, 0, 0, 0);
        this.addChild(bottomInfo);

        //左右两个桌子
        var leftDesk = new cc.Sprite('#Room_toux.png');
        var rightDesk = new cc.Sprite('#Room_toux.png');
        tool.node.pos(leftDesk, 100, this.height * .75);
        tool.node.pos(rightDesk, this.width - 100, this.height * .75);

        this.addChild(leftDesk, 2);
        this.addChild(rightDesk, 2);

        //时间
        var timeLabel = new cc.LabelTTF('', game.fonts.helvetica, 28);
        tool.node.pos(timeLabel, title.width / 2 - 6, title.height / 2 - 5);
        title.addChild(timeLabel);

        var fix = function (num, length) {
            return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
        };

        var getTime = function () {
            var myDate = new Date();
            var hour = myDate.getHours();
            var minute = myDate.getMinutes();
            timeLabel.setString(fix(hour, 2) + ' : ' + fix(minute, 2));
        };
        getTime();
        this.schedule(getTime, 10, cc.REPEAT_FOREVER, 0, "time");

        //初始化炸弹 火箭等动画
        var playAnimation = new cc.Sprite("#eff_shunzi_1.png");
        syntc.node.center(playAnimation, this);
        playAnimation.originY = playAnimation.y;
        this.addChild(playAnimation, 50);
        playAnimation.visible = false;
        this._playAnimation = playAnimation;

        this._animation_rocket = this.createAnimation('eff_rocket_', 3, .2);
        this._animation_bomb = this.createAnimation('eff_zhadan_0', 9, .15);
        this._animation_shun = this.createAnimation('eff_shunzi_', 8, .2);
        this._animation_plane = this.createAnimation('eff_plane_', 3, .2);

        this.shunziAni = function () {
            tool.node.pos(this._playAnimation, this.width / 2 - 200, this.height * .6);
            this._playAnimation.runAction(cc.sequence(cc.show(), cc.spawn(cc.animate(this._animation_shun)
                , cc.moveTo(1.5, this.width / 2 + 200, this.height * .6)), cc.hide()));
        };
        this.planeAni = function () {
            tool.node.pos(this._playAnimation, this.width / 2 + 200, this.height * .6);
            this._playAnimation.runAction(cc.sequence(cc.show(), cc.spawn(cc.moveTo(1, this.width / 2 - 200, this.height * .6)
                , cc.animate(this._animation_plane)), cc.hide()));
        };
    },
    createMenus: function () {
        var self = this;

        var menus = {
            'score': this.createMenuBar([false, true],
                ['不叫', '叫地主'],
                [function () {
                    menus.hide();
                    self._timer.stop();
                    //发送服务器数据
                    Connector.score(0);
                }, function () {
                    menus.hide();
                    self._timer.stop();
                    Connector.score(3);

                }], 0),
            'call': this.createMenuBar([false, true],
                ['不抢', '抢地主'],
                [function () {
                    menus.hide();
                    self._timer.stop();
                    //发送服务器数据
                    Connector.qiang(false);
                }, function () {
                    menus.hide();

                    self._timer.stop();
                    Connector.qiang(true);
                }], 0),
            'double': this.createMenuBar([false, true],
                ['不加倍', '加倍'],
                [function () {
                    menus.hide();
                    self._timer.stop();

                    Connector.callDouble(false);
                }, function () {
                    menus.hide();
                    self._timer.stop();

                    Connector.callDouble(true);
                }], 0),
            'play1': this.createMenuBar([true],
                ['出牌'],
                [function () {
                    self.playAction();
                }, function () {
                    menus.hide();
                    self._timer.stop();
                    var c = self._desk.main._cards;
                    Connector.play([c[c.length - 1]]);
                }], 1),
            'play2': this.createMenuBar([false, true, true],
                ['过牌', '提示', '出牌'],
                [function () {
                    self.passAction();
                }, function () {
                    self.hintCards();
                }, function () {
                    self.playAction();
                }], 0),
            'pass': this.createMenuBar([false],
                ["过牌"],
                [function () {
                    self.passAction();
                }], 0),
            'hide': function () {
                this['score'].visible = false;
                this['call'].visible = false;
                this['double'].visible = false;
                this['play1'].visible = false;
                this['play2'].visible = false;
                this['pass'].visible = false;
            },
            'show': function (mtag) {
                this.hide();
                this[mtag].visible = true;
            },
            'defaultAction': function () {
                for (var m in this) {
                    if (this[m].visible && this[m].defaultAction) {
                        console.log(m ,!self._robot);
                        this[m].defaultAction();
                        if ((m == 'play2' || m == 'play1') && !self._robot) {
                            console.log('自动托管');
                            Connector.hosting();
                        }
                    }
                }
            }
        };
        this.playAction = function () {
            menus.hide();
            this._timer.stop();
            var cards = this.playPickedCards();
            Connector.play(cards);
            this.removePlayedCard(cards);
        };
        this.passAction = function () {
            menus.hide();
            this._timer.stop();
            this._passmask.visible = false;
            Connector.play([]);
            this.cancelPickCards();
        };
        return menus;
    },
    createMenuBar: function (texs, txts, funcs, def) {
        var items = [];
        var px = this.width * .5 - 90 * (texs.length - 1);

        var layer = new cc.Node;
        layer.ignoreAnchorPointForPosition(false);
        layer.width = this.width;
        layer.height = this.height;
        tool.node.center(layer, this);
        this.addChild(layer, 2);

        for (var i in texs) {
            var t = texs[i];

            var tex = t ? '#Room_but.png' : '#Room_but.png';
            var texp = t ? '#Room_but1.png' : '#Room_but1.png';
            var btn = new cc.Sprite(tex);
            var btnp = new cc.Sprite(texp);
            var btnd = new cc.Sprite("#Room_nbut.png");

            var menuItem = new cc.MenuItemSprite(btn, btnp, btnd, funcs[i], layer);
            items.push(menuItem);
            tool.node.pos(menuItem, px + 180 * i, layer.height / 2 - 20);

            var label = new cc.LabelTTF(txts[i], game.fonts.helveticaMedium,
                26, cc.size(176, 80), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            label.fillStyle = cc.color(255, 252, 233);
            tool.node.pos(label, menuItem.x, menuItem.y + 2);
            layer.addChild(label, 1);
        }

        var menu = new cc.Menu(items);
        menu.ignoreAnchorPointForPosition(false);
        menu.width = this.width;
        menu.height = this.height;
        syntc.node.center(menu, this);
        layer.addChild(menu);
        layer._menu = menu;

        if (def !== undef)
            layer.defaultAction = funcs[def].bind(layer);

        layer.toggle = function (idx, on) {
            items[idx].setEnabled(on);
        };

        return layer;
    },
    createDipai: function () {
        var self = this;
        var roomInfo = Global.curPlayer.roomInfo;

        var bg = new cc.Node;
        tool.node.pos(bg, 140, this.height - 20);
        this.addChild(bg, 3);

        var dipai1 = new cc.Sprite("#bg_card.png");
        tool.node.pos(dipai1, bg.width * .5 - 106, bg.height - 10, .5, 1);
        bg.addChild(dipai1);
        bg._1 = dipai1;
        dipai1.scale = 42 / dipai1.width;

        var dipai2 = new cc.Sprite("#bg_card.png");
        tool.node.pos(dipai2, bg.width * .5 - 60, bg.height - 10, .5, 1);
        bg.addChild(dipai2);
        bg._2 = dipai2;
        dipai2.scale = 42 / dipai1.width;

        var dipai3 = new cc.Sprite("#bg_card.png");
        tool.node.pos(dipai3, bg.width * .5 - 14, bg.height - 10, .5, 1);
        bg.addChild(dipai3);
        bg._3 = dipai3;
        dipai3.scale = 42 / dipai1.width;

        var jishulabel = new cc.LabelTTF("底分:", game.fonts.helveticaMedium,
            20, cc.size(90, 32), cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        jishulabel.fillStyle = cc.color.WHITE;
        tool.node.pos(jishulabel, this.width / 2 - 15, -this.height + 65, 0);
        bg.addChild(jishulabel, 3);

        var jishu = new cc.LabelTTF(roomInfo.baseBet, game.fonts.helveticaMedium,
            20, cc.size(90, 32), cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        jishu.fillStyle = cc.color.WHITE;
        tool.node.pos(jishu, this.width / 2 + 50, -this.height + 65, 0);
        bg.addChild(jishu);

        var jiaofen = new cc.LabelTTF(roomInfo.beishu, 'Arial',
            24, cc.size(90, 32), cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        jiaofen.fillStyle = cc.color.RED;
        tool.node.pos(jiaofen, this.width / 2 + 50, -45, 0, 0);
        bg.addChild(jiaofen);
        this._jiaofen = jiaofen;

        bg.setDipai = function (dipai) {
            this._1.visible = true;
            this._2.visible = true;
            this._3.visible = true;

            //cc.log("set dipai", dipai);
            this._1.setSpriteFrame(self.toCardSprite(dipai[0]));
            this._2.setSpriteFrame(self.toCardSprite(dipai[1]));
            this._3.setSpriteFrame(self.toCardSprite(dipai[2]));
        };

        bg.clearDipai = function (flag) {
            this._1.visible = flag ? flag : false;
            this._2.visible = flag ? flag : false;
            this._3.visible = flag ? flag : false;
            this._1.setSpriteFrame('bg_card.png');
            this._2.setSpriteFrame('bg_card.png');
            this._3.setSpriteFrame('bg_card.png');
        };
        return bg;
    },
    afterGameOver: function (flag) {
        this._startFlag = false;

        var layer = new cc.Layer();
        this.addChild(layer, 10);
        var readyPos = cc.p(this.width * .5, this.height * .3 - 7);
        if (flag) {
            var exitBtn = new MenuButton('Room_exit1.png', "Room_exit2.png", cc.p(this.width * .32, this.height * .3));
            exitBtn.addTouchEventListener(this.exitRoom, this);
            layer.addChild(exitBtn, 2);

            readyPos = cc.p(this.width * .68, this.height * .3 - 7);
        }

        var readyBtn = new MenuButton('Room_ready1.png', "Room_ready2.png", readyPos);
        if (flag) {
            readyBtn.addTouchEventListener(this.roomGameAgain, this);
        } else {
            readyBtn.addTouchEventListener(this.roomReadyBtn, this);
        }
        layer.addChild(readyBtn, 2);
        this._readyBtnLayer = layer;
    },
    displayCardOnPosition: function (pos, card, total, idx) {
        var cw = this.CARD_WIDTH;
        var cs = this.CARD_PLAY_SCALE;
        var ms = this.CARD_SEAT_MAIN_SCALE;

        var gh = (this.width - cw * ms - 40) / (10 - 1);
        gh = Math.min(80, gh);

        switch (pos) {
            case 1:
                if (idx >= 10) {
                    var w1 = (total - 10 - 1) * gh + cw * ms;
                    var x1 = (this.width - w1) * .5;
                    var x11 = x1 + (cw * ms * .5 + gh * (idx - 10));
                    card.originy = 210;
                    tool.node.pos(card, x11, card.originy);
                } else {
                    var w = (10 - 1) * gh + cw * ms;
                    var xs = (this.width - w) * .5;
                    var x = xs + (cw * ms * .5 + gh * idx);

                    card.originy = 380;
                    tool.node.pos(card, x, card.originy);
                }
                break;
        }
    },
    pickCards: function (cards) {
        for (var i in this._desk.main.cards) {
            if (!this._desk.main.cards[i]._pick) {
                for (var j in cards) {
                    if (this._desk.main.cards[i].card == cards[j])
                        this._desk.main.cards[i].pick();
                }
            }
        }

        this.checkPickedCards();
    },
    hintCards: function () {
        if (!this._playingCard) return;

        var selected = this.getPickedCards();

        var picks = null;

        if (selected.length == 0 && null == this._ondesk) {
            var last = this._desk.main.cards[this._desk.main.cards.length - 1].card;
            picks = this._hint.trypick(null, [last]);
            if (null != picks) {
                picks.push(last);
            }
        } else {
            picks = this._hint.trypick(this._ondesk, selected);
        }

        if (null == picks) {
            //     this.cancelPickCards();
        } else if (picks.length > 0) {
            this.cancelPickCards();
            this.pickCards(picks);
        } else {
            cc.log("找不到与已选牌对应的提示");
        }

    },
    autoPickCards: function () {
        var selected = this.getPickedCards();

        var hint = this._hint.autopick(this._ondesk, selected);

        if (null != hint) {
            if (selected.length == 0 &&
                hint.length != this._desk.main._cards.length) {
                this.checkPickedCards();
                return;
            }

            var cards = [];
            for (var j in this._desk.main.cards) {
                if (!this._desk.main.cards[j].beenSelected) {
                    var v1 = DDZRule.rank(this._desk.main.cards[j].card);

                    for (var i in hint) {
                        var v2 = DDZRule.rank(hint[i]);

                        if (v1 == v2) {
                            cards.push(this._desk.main.cards[j].card);
                            hint.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        this.pickCards(cards);
        this.checkPickedCards();
    },
    playPickedCards: function () {
        var cards = this.getPickedCards();
        this._menus.hide();
        return cards;
    },
    checkPickedCards: function () {
        var cards = this.getPickedCards();

        this._menus['play1'].toggle(0, false);
        this._menus['play2'].toggle(2, false);

        if (cards.length > 0) {
            if (DDZN3Rule.tryplay(this._ondesk, cards)) {
                this._menus['play1'].toggle(0, true);
                this._menus['play2'].toggle(2, true);
            }
        }
    },
    cancelPickCards: function () {
        for (var i in this._desk.main.cards) {
            if (this._desk.main.cards[i]._pick) {
                this._desk.main.cards[i].unpick();
            }
        }
    },
    getPickedCards: function () {
        var cards = [];

        for (var i in this._desk.main.cards) {
            var c = this._desk.main.cards[i];

            if (c._pick) {
                cards.push(c.card);
            }
        }
        return cards;
    },
    displayCards: function (pos, cards) {
        var seat = this.seatForPos(pos);
        if (null == seat) {
            cc.warn('no seat for pos ' + pos);
        }
        if (!cards) {
            return;
        }
        cards = DDZRule.sort(cards);
        if (seat == this._desk.main) {
            this._desk.main._cards = cards;
            this._hint.prepare(cards);
        }
        _.each(seat.cards, function (i) {
            i.removeFromParent(true);
        });
        seat.cards = [];

        for (var i in cards) {
            var p = null;
            if (i < seat.cards.length) {
                p = seat.cards[i];
                p.setSpriteFrame(this.toCardSprite(cards[i]));
            }
            if (null == p) {
                p = new cc.Sprite("#" + this.toCardSprite(cards[i]));
                this.addChild(p);
                seat.cards.push(p);

                var mask = new cc.Sprite("#cover.png");
                syntc.node.center(mask, p);
                p.addChild(mask);
                p._mask = mask;
                mask.visible = false;

                if (seat != this._desk.main) {
                    p.scale = this.CARD_SEAT_SIDE_SCALE;
                } else {
                    p.scale = this.CARD_SEAT_MAIN_SCALE;
                }
            }
            p.beenSelected = false;
            this.displayCardOnPosition(pos, p, cards.length, i);
            p.card = cards[i];

            p._pick = false;
            p.togglePick = function () {
                if (this._pick) {
                    this.unpick();
                } else {
                    this.pick();
                }
            };

            p.pick = function () {
                this.y = this.originy + 15;
                this._pick = true;
            };

            p.unpick = function () {
                this.y = this.originy;
                this._pick = false;
            };
        }

    },
    toCardSprite: function (token) {
        if (token.length != 2) {
            throw "牌不对 " + token;
        }

        if (token == 'E2') return "r1_c17.png";
        if (token == 'E1') return "r1_c16.png";

        var r = '';
        if (token[0] == 'A') r = "r1_";
        if (token[0] == 'B') r = "r2_";
        if (token[0] == 'C') r = "r3_";
        if (token[0] == 'D') r = "r4_";

        if (r == '') {
            throw "牌不对2 " + token;
        }

        var v = (Pokers.a2n(token[1]) + 1);
        if (v == 1) r += "c1.png";
        else if (v == 10) r += "c10.png";
        else if (v == 11) r += "c11.png";
        else if (v == 12) r += "c12.png";
        else if (v == 13) r += "c13.png";
        else r += "c" + v + ".png";

        return r;
    },
    onTouchBegan: function (touch, event) {

        if (this._playingCard) {
            var locationInNode = this.convertToNodeSpace(touch.getLocation());
            var cards = this._desk.main.cards;

            for (var i = cards.length - 1; i >= 0; i--) {
                if (cc.rectContainsPoint(cards[i].getBoundingBox(), locationInNode)) {
                    this._touchStart = locationInNode;
                    //cc.log('began card ', i);
                    return true;
                }
            }
        }
        return false;
    },
    onTouchMoved: function (touch, event) {
        if (this._playingCard) {
            var locationInNode = this.convertToNodeSpace(touch.getLocation());
            var cards = this._desk.main.cards;

            var msx = Math.min(this._touchStart.x, locationInNode.x);
            var mex = Math.max(this._touchStart.x, locationInNode.x);
            var msy = Math.min(this._touchStart.y, locationInNode.y);
            var mey = Math.max(this._touchStart.y, locationInNode.y);

            var picked = false;

            for (var i = cards.length - 1; i >= 0; i--) {
                cards[i]._mask.visible = false;

                var px = cards[i].getBoundingBox().x;
                var tx = cards[i].getBoundingBox().x + cards[i].getBoundingBox().width;
                var py = cards[i].getBoundingBox().y;
                var ty = cards[i].getBoundingBox().y + cards[i].getBoundingBox().height;


                if (cards.length <= 10) {
                    if (i < cards.length - 1) {
                        tx = cards[i + 1].getBoundingBox().x;
                    }
                } else {
                    if (i < cards.length - 1) {
                        tx = cards[i + 1].getBoundingBox().x;
                        if (i == 9) {
                            tx = cards[9].getBoundingBox().x + cards[i].getBoundingBox().height;
                        }
                    }
                }

                if (tx > msx && px < mex && ty > msy && py < mey) {
                    cards[i]._mask.visible = true;
                } else {
                    cards[i]._mask.visible = false;
                }
            }

        }
    },
    onTouchEnded: function (touch, event) {
        if (this._playingCard) {
            //cc.log('end');

            var locationInNode = this.convertToNodeSpace(touch.getLocation());
            var cards = this._desk.main.cards;

            var msx = Math.min(this._touchStart.x, locationInNode.x);
            var mex = Math.max(this._touchStart.x, locationInNode.x);
            var msy = Math.min(this._touchStart.y, locationInNode.y);
            var mey = Math.max(this._touchStart.y, locationInNode.y);

            var picked = false;

            for (var i = cards.length - 1; i >= 0; i--) {
                cards[i]._mask.visible = false;

                var px = cards[i].getBoundingBox().x;
                var tx = cards[i].getBoundingBox().x + cards[i].getBoundingBox().width;
                var py = cards[i].getBoundingBox().y;
                var ty = cards[i].getBoundingBox().y + cards[i].getBoundingBox().height;


                if (cards.length <= 10) {
                    if (i < cards.length - 1) {
                        tx = cards[i + 1].getBoundingBox().x;
                    }
                } else {
                    if (i < cards.length - 1) {
                        tx = cards[i + 1].getBoundingBox().x;
                        if (i == 9) {
                            tx = cards[9].getBoundingBox().x + cards[i].getBoundingBox().height;
                        }
                    }
                }
                if (tx > msx && px < mex && ty > msy && py < mey) {
                    picked = true;
                    cards[i].togglePick();
                }
            }

            if (picked) {
                this.autoPickCards();
                this.checkPickedCards();
            }
        }
    },
    initToast: function () {
        this._toast = new cc.Scale9Sprite;
        this._toast.initWithSpriteFrameName("ddz_toast_bg.png", cc.rect(80, 42, 370, 2));
        this.addChild(this._toast, 100);
        syntc.node.center(this._toast, this);
        this._toast.visible = false;

        var toaststr = new cc.LabelTTF("", game.fonts.helveticaMedium,
            22, cc.size(460, 80), cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        toaststr.fillStyle = cc.color.WHITE;
        syntc.node.center(toaststr, this._toast);
        this._toast.addChild(toaststr);

        this.showToast = function (line, str, timeout) {
            self._toast.visible = true;
            self._toast.scaleY = line;
            toaststr.setString(str);

            if (timeout && timeout > 0) {
                self.scheduleOnce(function () {
                    self.hideToast();
                }, timeout, "toast");
            }
        };

        this.hideToast = function () {
            self._toast.visible = false;
        };
    },
    reset: function () {
        this._ondesk = null;
        this._chuntian = -1;
        this._menus.hide();
        this._dipai.clearDipai(false);
        this._jiaofen.setString(1);

        this._desk.main.reset();
        this._desk.left.reset();
        this._desk.right.reset();
    },
    clearPlayer: function () {
        this.reset();

        this._desk.main.player.clear();
        this._desk.main.player.setMoney(Global.curPlayer.money);

    },
    onEnter: function () {
        this._super();

        Connector.game_ui = this;
        Connector.frame_ui = this;
    },
    onExit: function () {
        this._super();

        Connector.game_ui = null;
        Connector.frame_ui = null;
        PomeloRemoveListen();
    },
    testMarquee: function () {
        var tbg = new cc.Sprite('#Room_gongg.png');
        tool.node.pos(tbg, this.width / 2, this.height - 130, .5, .5);

        var stencil = new cc.Sprite("#Room_gongg.png");
        syntc.node.pos(stencil, 0, 0, 0, 0);

        var clipping = new cc.ClippingNode;
        clipping.scaleX = .88;
        clipping.setStencil(stencil);
        clipping.setInverted(false);
        clipping.setAlphaThreshold(0);

        syntc.node.pos(clipping, 68, 0, 0, 0);
        tbg.addChild(clipping);

        tbg._clipping = clipping;

        this.schedule(function () {
            var childs = tbg._clipping.getChildren();
            for (var i in childs) {
                childs[i].x -= 1;
            }
            if (childs.length > 0) {
                var last = childs[childs.length - 1];
                if (last.x + last.width < 0) {
                    var pos = tbg.width;

                    for (var i in childs) {
                        childs[i].x = pos;
                        pos += childs[i].width + 20;
                    }
                }
            }
        }, 0, cc.REPEAT_FOREVER);
        return tbg;
    },
    updateBullMsg: function () {
        this._tip._clipping.removeAllChildren();
        var posx = 0;

        var content = new cc.LabelTTF("", game.fonts.helvetica,
            22, cc.size(0, this._tip.height));
        content.fillStyle = cc.color.RED;
        syntc.node.pos(content, posx, this._tip.height * .5, 0, .5);
        this._tip._clipping.addChild(content);
        //posx += content.width + 20;
    },
    shakeScreen: function (hz, delta) {
        var Hz = hz ? hz : 16;
        var move = [];
        var time = delta ? delta : .02;
        for (var i = Hz / 2; i > 0; i--) {
            move.push(cc.moveTo(time, cc.p(-i * 1, -i * 1)));
            move.push(cc.moveTo(time, cc.p(i * 1, i * 1)));
        }
        move.push(cc.moveTo(time, cc.p(0, 0)));
        cc.director.getRunningScene().runAction(cc.sequence(move));
    },
    createAnimation: function (filename, count, time) {
        var spriteFrames = [];
        for (var i = 0; i < count; ++i) {
            var frame = cc.spriteFrameCache.getSpriteFrame(filename + (i + 1) + ".png");
            spriteFrames.push(frame);
        }

        return new cc.Animation(spriteFrames, time);
    }
});
