/**
 * Created by Mic on 15/11/21.
 */
var DDZRoomLogic = RoomLayer.extend({
    _back: null,
    ctor: function (roomInfo, backInfo) {
        this._super();

        this._roomInfo = roomInfo;
        this._back = backInfo;
    },
    initComps: function () {
        this._super();

        this._dizhumask = new cc.Sprite("#land_owner_flag.png");
        this.addChild(this._dizhumask, 5);
        this._dizhumask.visible = false;

        this._waitJoin = new cc.Sprite('#Room_waiting.png');
        syntc.node.pos(this._waitJoin, this.width * .5, this.height * .55);
        this._waitJoin.scale = .6;
        this.addChild(this._waitJoin, 1);
        this._waitJoin.visible = false;

        this._waitdizhu = new cc.Sprite("#ddz_waiting_dz.png");
        syntc.node.pos(this._waitdizhu, this.width * .5, this.height * .4);
        this.addChild(this._waitdizhu, 5);
        this._waitdizhu.visible = false;

        this._passmask = new cc.Sprite("#msg_nobigger_ddz.png");
        syntc.node.pos(this._passmask, this.width * .5, this.height * .35);
        this.addChild(this._passmask, 5);
        this._passmask.visible = false;

        this.reset();
        this.notifyPlayer(Global.curPlayer, 1);
        PomeloListen();

        if (this._back) {
            this.notifyComeBack(this._back);
        }
    },
    clearDesk: function () {
        this._menus.hide();
        this._waitdizhu.visible = false;
        this._passmask.visible = false;
        this._waitJoin.visible = false;

        this._desk.left.clearDesk();
        this._desk.right.clearDesk();
        this._desk.main.clearDesk();
        this._timer.stop();
    },
    deliverCards: function (pos, cards, cb) {
        this._startFlag = true;
        game.sound.playSound(res.ddz.fapai_ogg);

        this.clearDesk();
        this._dipai.clearDipai(true);
        //this.setHintLabel('正在分配对手...', .1);
        var i = 0;
        var self = this;
        var func = function () {
            self.displayCards(1, cards.slice(0, i));
            if (i == 16) {
                cb();
            }
            i++;
        }.bind(this);
        this.schedule(func, .2, 17);
        this._desk.left.back.setCard(17);
        this._desk.right.back.setCard(17);
    },
    askReady: function () {
        this.afterGameOver(false);
    },
    askPoint: function (pos) {
        this._menus.hide();
        if (pos == 1) {
            this._menus.show('score');
            this._waitdizhu.visible = false;
        } else {
            this._waitdizhu.visible = true;
        }

        this._timer.stop();
        if (this.debug)
            Api.score(3);
        else
            this._timer.alert(pos, this.TIMEOUT_POINT);
    },
    askQiang: function (pos) {
        this._waitdizhu.visible = false;
        if (pos == 1) {
            this._menus.show('call');
            this._waitdizhu.visible = false;
        } else {
            this._waitdizhu.visible = true;
        }
        if (this.debug)
            this._menus.defaultAction();
        else
            this._timer.alert(pos, this.TIMEOUT_CALL);
    },
    askDouble: function () {
        this._waitdizhu.visible = false;

        for (var i = 1; i <= 4; ++i) {
            if (i == 3)continue;

            if (i != this._dizhu) {
                this.seatForPos(i).player.setNongMin();
            } else {
                this.seatForPos(i).player.setDiZhu();
            }
        }

        this._menus.show('double');
        if (this.debug)
            this._menus.defaultAction();
        else
            this._timer.alert(1, this.TIMEOUT_DOUBLE);
    },
    askPlay: function (pos, cards) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        seat.player.deskClear();
        seat.clearDesk();

        if (pos == 1) {
            if (cards.length != this._desk.main._cards.length) {
                this.displayPlay(1, cards);
            }
            this._hint.resetIndex();
            this._playingCard = true;

            var flag = this.noMoreCards();
            if (!this._hostingLayer) {
                if (!flag) {
                    if (null == this._ondesk) {
                        this._menus.show('play1');
                    } else {
                        this._menus.show('play2');
                    }
                    this.checkPickedCards();
                    this._timer.alert(1, this.TIMEOUT_PLAY);

                } else {
                    this._menus.show('pass');
                    this._passmask.visible = true;
                    this._timer.alert(1, this.TIMEOUT_PLAY_SHORT);
                }
            }
        } else {
            this._timer.alert(pos, this.TIMEOUT_PLAY);
        }
    },
    notifyPlayer: function (user, pos) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        if (seat.player.init) return;

        if (pos == 1 && !this._back) {
            this.askReady(1);
        }
        seat.player.setUserIcon(user.headUrl);
        seat.player.setUserName(user.userName);
        seat.player.setMoney(user.money ? user.money : user.info.money);
        seat.player.gender = user.gender;
        seat.player.init = true;
        if (user.mingpai) {
            this.notifyReady(pos);
        }
    },
    notifyReady: function (pos) {
        if (pos == undefined)pos = 1;
        if (pos == 1) {
            this._waitJoin.visible = true;
        }
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        seat.ready.visible = true;
    },
    notifyPoint: function (pos, demand, cb) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        this._menus.hide();
        this._timer.stop();
        seat.player.popScore(demand);
        cb();
    },
    notifyDizhu: function (pos, what) {
        this._waitdizhu.visible = false;

        this._dizhu = pos;

        if (what) {
            for (var i = 1; i <= 4; ++i) {
                if (i == 3)continue;

                if (i != this._dizhu) {
                    this.seatForPos(i).player.setNongMin();
                } else {
                    this.seatForPos(i).player.setDiZhu();
                }
            }
        }
    },
    notifyQiang: function (pos, qiang, cb) {

        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;

        if (qiang) {
            var s = parseFloat(this._jiaofen.string);
            this._jiaofen.setString(s * 2);
        }
        this._menus.hide();
        this._timer.stop();
        seat.player.popQiang(qiang);
        cb();
    },
    notifyDipai: function (dipai, deliver, cb) {
        for (var i = 1; i <= 4; i++) {
            if (this.seatForPos(i))
                this.seatForPos(i).player.deskClear();
        }
        this._dipai.setDipai(dipai);

        if (deliver) {
            if (this._dizhu == 1 && this._desk.main._cards.length == 17) {
                var ca = this._desk.main._cards.slice(0);
                ca = ca.concat(dipai);
                this.displayCards(1, ca);

            } else if (this._dizhu == 2) {
                this._desk.right.back.setCard(20);

            } else if (this._dizhu == 4) {
                this._desk.left.back.setCard(20);
            }
        }
        cb();
    },
    notifyDouble: function (pos, doublev) {
        console.log('加倍 ', pos + ' ' + doublev);
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        seat.player.popDouble(doublev ? 2 : 1);
        if (pos == 1) {
            this._menus.hide();
        }
        if (pos == this._dizhu) {
            var s = parseFloat(this._jiaofen.string);
            this._jiaofen.setString(s * 2);
        }
    },
    notifyHosting: function (pos) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        if (pos != 1) {
            seat.player.hosting();
        } else {
            this.hosting();
        }
    },
    notifyNoHosting: function (pos) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        if (pos != 1) {
            seat.player.unHosting();
        }
    },
    notifyConnect: function (pos) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;

        seat.player.setConnect();
    },
    notifyAuto: function (pos, auto) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;

        seat.player.setDisconnect(auto);
    },
    notifyPlay: function (pos, cards, len) {
        //console.log("play "+pos+" "+cards);
        this._menus.hide();
        this._timer.stop();
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        seat.pass.visible = false;
        seat.player.deskClear();

        if (this._pass == 2) {
            this.clearDesk();
        }
        this.displayPlay(pos, cards);

        var type = DDZApi.getCardType(cards).type;
        if (type == 'bomb' || type == 'rocket') {
            var s = parseFloat(this._jiaofen.string);
            this._jiaofen.setString(s * 2);
        }

        if (this._chuntian < 0) {
            this._chuntian = pos;
        } else if (this._chuntian != pos && cards.length > 0) {
            this._chuntian = 0;
        }
        if (cards && cards.length > 0) {
            //game.sound.playSound(res.ddz.chupai_ogg);

            this._ondesk = cards;
            this._pass = 0;

            if (pos == 1) {
                var remains = this._desk.main._cards.slice(0);
                for (var i = remains.length - 1; i >= 0; --i) {
                    for (var j = 0; j < cards.length; ++j) {
                        if (cards[j] == remains[i]) {
                            remains.splice(i, 1);
                        }
                    }
                }
                this.displayCards(1, remains);
            } else {
                seat.back.setCard(len);
                if (len == 2 || len == 1) {
                    console.log('只剩 ' + len + ' 牌了');
                }
            }
        } else {
            var guo = parseInt(Math.random() * 3);
            var gender = seat.player.getGender();
            if (gender == 0) {
                game.sound.playSound(res.ddz["w_buyao" + guo]);
            } else {
                game.sound.playSound(res.ddz["m_buyao" + guo]);
            }

            seat.pass.visible = true;
            if (this._dizhu == pos) {
                this._dizhumask.visible = false;
            }
            this._pass++;
            if (this._pass == 2) {
                this._ondesk = null;
            }
        }
    },
    notifyLeave: function (pos) {
        var seat = this.seatForPos(pos);
        if (null == seat) return "no seat for pos " + pos;
        if (pos == 1) {  //自己被桌子踢出
            this._desk.left.player.reset();
            this._desk.right.player.reset();
            this._desk.left.reset();
            this._desk.right.reset();
        } else {
            seat.player.reset();
        }
    },
    notifyComeBack: function (info) {
        if (this._readyBtnLayer) {
            this._readyBtnLayer.removeFromParent(true);
        }
        console.log('重连上之前的对局 ');
        var playerList = info.playerList;
        var baseBet = info.baseBet;
        var dipai = info.dipai;
        var ondesk = info.ondesk;
        var curTalkIndex = info.curTalkIndex % 3;
        var beishu = info.beishu;
        var dizhu = info.dizhu;

        var self = this;

        Global.curPlayer = _.find(playerList, function (player) {
            if (player) {
                return player.uuid == Global.curPlayer.uuid;
            }
        });
        DDZApi.convertToDeskPos(playerList, Global.curPlayer.seatIndex, function (player, pos) {
            self.notifyPlayer(player, pos);
        });
        this._dipai.clearDipai(true);
        //倍数
        this._jiaofen.setString('' + beishu);
        //如果地主没选出来就不显示底牌
        if (dizhu != -1) {  //地主选出来了
            this.notifyDizhu(DDZApi.curPos[dizhu], true);
            this.notifyDipai(dipai, false, function () {
            });
        }
        //绘制出牌
        console.log('come on ', playerList);
        _.each(playerList, function (p, i) {
            if (p.uuid == Global.curPlayer.uuid) {
                self.displayCards(1, p.cards);
            } else {
                //console.log(p.cards.length, self._desk, DDZApi.curPos[i]);
                if (DDZApi.curPos[i] == 2) {
                    self._desk.right.back.setCard(p.cards.length);
                } else if (DDZApi.curPos[i] == 4) {
                    self._desk.left.back.setCard(p.cards.length);
                }
            }
        });

        this._back = null;
        this._waitJoin.visible = false;
    },

    displayPlayOnPlayer: function (pos, seat, play, i, total) {
        var cwidth = this.CARD_WIDTH;
        var gh = this.CARD_GAP_H;
        var cs = this.CARD_PLAY_SCALE;
        var pv = this.CARD_GAP_PV;
        var fold = 10;
        var ybase = this.height * .6, basey, posx;

        var p = new cc.Sprite("#" + this.toCardSprite(play));
        p.scale = cs;
        this.addChild(p, 2);
        seat.plays.push(p);

        switch (pos) {
            case 1:
            {
                posx = -(gh * (total - 1)) * .5;
                syntc.node.pos(p, this.width * .5 + (posx + gh * i) * cs, this.height * .5);
            }
                break;
            case 2:
            {
                var y = 0;
                if (total > fold) {
                    if (i >= fold) {
                        basey = this.height * .6 - 50;
                        y = 1;
                    } else {
                        basey = this.height * .6;
                    }
                } else {
                    basey = ybase;
                }
                posx = this.width - 80;

                var m = Math.min(fold, total - fold * y) - 1;
                syntc.node.pos(p, posx - gh * (m - i % fold) * cs, basey);
            }
                break;
            case 4:
            {
                if (total > fold) {
                    if (i >= fold) {
                        //basey = 300;
                        basey = this.height * .6 - 50;

                    } else {
                        //basey = 390;
                        basey = this.height * .6;

                    }
                } else {
                    basey = ybase;
                }
                posx = 80;

                syntc.node.pos(p, posx + gh * (i % fold) * cs, basey);
            }
                break;
        }

    },
    noMoreCards: function () {
        var cards = this._hint.available(this._ondesk);
        if (cards.length == 0) {
            return true;
        }
        return false;
    },
    displayPlay: function (pos, play) {
        var seat = this.seatForPos(pos);
        seat.clearDesk();

        if (play && play.length == 0) {
            play = null;
        }
        if (null == play) {
            seat.pass.visible = true;
        } else {
            play = DDZRule.sort(play);
            seat.pass.visible = false;

            for (var i in play) {
                this.displayPlayOnPlayer(pos, seat, play[i], i, play.length);
            }

            if (pos == this._dizhu) {
                var last = seat.plays[seat.plays.length - 1];
                if (last) {
                    syntc.node.pos(this._dizhumask, last.getBoundingBox().x + last.width * last.scale + 4,
                        last.getBoundingBox().y + last.height * last.scale + 2, 1, 1);
                    this._dizhumask.scale = this.CARD_SEAT_MAIN_SCALE;
                    this._dizhumask.visible = true;
                }
            }
            //this._playAnimation.runAction(cc.sequence(cc.show(), cc.animate(this._animation_rocket), cc.hide()));
            seat.player.gender = seat.player.getGender();

            var ret = DDZApi.getCardType(play);
            switch (ret.type) {
                case 'rocket':
                    tool.node.pos(this._playAnimation, this.width / 2, this.height / 2);
                    this._playAnimation.runAction(cc.sequence(cc.show(), cc.spawn(cc.animate(this._animation_rocket)
                        , cc.moveTo(.6, this.width / 2, this.height / 2 + 300)), cc.hide()));

                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_wangzha);
                    } else {
                        game.sound.playSound(res.ddz.m_wangzha);
                    }
                    this.shakeScreen();
                    break;
                case 'bomb':
                    this._playAnimation.x = this.width / 2 + 150;
                    this._playAnimation.y = this.height * .7;

                    this._playAnimation.runAction(cc.sequence(cc.show(), cc.spawn(cc.animate(this._animation_bomb),
                        cc.moveTo(.5, this.width / 2, this.height * .55)), cc.hide()));
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_zhadan);
                    } else {
                        game.sound.playSound(res.ddz.m_zhadan);
                    }
                    this.shakeScreen();
                    break;
                case 'sequenceTriplet':
                    this.planeAni();
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_feiji);
                    } else {
                        game.sound.playSound(res.ddz.m_feiji);
                    }
                    break;
                case 'sequenceTripletSingle':  //飞机1
                    this.planeAni();
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_feiji);
                    } else {
                        game.sound.playSound(res.ddz.m_feiji);
                    }
                    break;
                case 'sequenceTripletPair':    //飞机2
                    this.planeAni();
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_feiji);
                    } else {
                        game.sound.playSound(res.ddz.m_feiji);
                    }
                    break;
                case 'sequence':   //顺子
                    this.shunziAni();
                    //this._playAnimation.runAction(cc.sequence(cc.show(), cc.animate(this._animation_shun), cc.hide()));
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_shunzi);
                    } else {
                        game.sound.playSound(res.ddz.m_shunzi);
                    }
                    break;
                case 'sequencePair':  //连队
                    this.shunziAni();
                    //this._playAnimation.runAction(cc.sequence(cc.show(), cc.animate(this._animation_shun), cc.hide()));
                    //this._playAnimation2.runAction(cc.sequence(cc.show(), cc.animate(this._animation_shun), cc.hide()));
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_liandui);
                    } else {
                        game.sound.playSound(res.ddz.m_liandui);
                    }
                    break;
                case 'tripletSingle': //三带一
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_sandaiyi);
                    } else {
                        game.sound.playSound(res.ddz.m_sandaiyi);
                    }
                    break;
                case 'tripletPair':   //三带二
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_sandaiyidui);
                    } else {
                        game.sound.playSound(res.ddz.m_sandaiyidui);
                    }
                    break;
                case 'quadplex1':   //四带2
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_sidaier);
                    } else {
                        game.sound.playSound(res.ddz.m_sidaier);
                    }
                    break;
                case 'quadplex2':   //四带2对
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_sidailiangdui);
                    } else {
                        game.sound.playSound(res.ddz.m_sidailiangdui);
                    }
                    break;
                case 'triplet':
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz.w_sange);
                    } else {
                        game.sound.playSound(res.ddz.m_sange);
                    }
                    break;
                case 'single':
                    var str;
                    if (play[0][0] == 'E') {
                        if (play[0][1] == "1") {
                            str = "25";
                        } else {
                            str = "26";
                        }
                    } else {
                        switch (play[0][1]) {
                            case "1":
                                str = "14";
                                break;
                            case "2":
                                str = "20";
                                break;
                            case "B":
                                str = "11";
                                break;
                            case "C":
                                str = "12";
                                break;
                            case "D":
                                str = "13";
                                break;
                            case "A":
                                str = '10';
                                break;
                            default :
                                str = play[0][1];
                        }
                    }
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz["w_" + str]);
                    } else {
                        game.sound.playSound(res.ddz["m_" + str]);
                    }
                    break;
                case 'pair':
                    var str = "3";
                    switch (play[0][1]) {
                        case "1":
                            str = "14";
                            break;
                        case "2":
                            str = "20";
                            break;
                        case "A":
                            str = '10';
                            break;
                        case "B":
                            str = "11";
                            break;
                        case "C":
                            str = "12";
                            break;
                        case "D":
                            str = "13";
                            break;
                        default :
                            str = play[0][1];
                    }
                    if (seat.player.gender == 0) {
                        game.sound.playSound(res.ddz["w_dui" + str]);
                    } else {
                        game.sound.playSound(res.ddz["m_dui" + str]);
                    }
                    break;
            }
        }
    },
    showCardsAtOver: function (data) {
        var self = this;
        self.clearDesk();
        self._timer.stop();
        self.displayCards(1, []);

        //console.log('游戏结束 ', data);
        var player = data.data.playerList;
        _.each(player, function (p, i) {
            var pos = DDZApi.curPos[i];
            if (p.cards && p.cards.length > 0) {
                p.cards = DDZRule.sort(p.cards);
                _.each(p.cards, function (c, i) {
                    self.displayPlayOnPlayer(pos, self.seatForPos(pos), c, i, p.cards.length);
                });
            }
        });
        setTimeout(function () {
            self.displayResult(data);
        }, 2000);

        //TODO 春天没素材 没写
        //var spring = data.data.overInfo.spring;
    },
    displayResult: function (data) {
        //更新桌子 退出当前桌子
        console.log(data);
        if (this._hostingLayer) {
            this._robot = null;
            this._hostingLayer.removeFromParent();
        }

        var self = this;
        var seatIndex = Global.curPlayer.seatIndex;
        var player = data.data.playerList[seatIndex];
        var overInfo = data.data.overInfo;
        var flag = overInfo.gameCoins[seatIndex] >= 0;

        if (!!onHelpMoney) {
            player.money = Global.curPlayer.money;
            onHelpMoney = false;
        }

        var resultLayer = new DDZResultDialog({
            flag: flag,
            seatIndex: seatIndex,
            overInfo: overInfo,
            beishu: overInfo.deskBeishu,
            playerList: data.data.playerList,
            dizhu: data.data.dizhu
        }, function () {
            self.updateUserInfo(player);
            self.clearPlayer();
            self.afterGameOver(true);

            console.log('Global.player', Global.curPlayer);
            if (Global.curPlayer.money <= 0) {
                console.log('你的钱不够了，请去商城充值');
            }
        });
        game.preferPhone(resultLayer);
        RoomScene.instance.container.addContentLayer(resultLayer);
    },
    updateUserInfo: function (player) {
        Global.curPlayer = {
            userName: player.userName,
            money: player.money,
            headUrl: player.headUrl,
            roomName: player.roomName,
            uuid: player.uuid,
            gender: player.gender,
            seatIndex: player.seatIndex
        };
    },
    //*********************************
    //****       几个按钮
    //*********************************
    exitRoom: function (object, type) {
        if (type == 2) {
            Connector.exitRoom();
        }
    },
    roomExitBtn: function (object, type) {
        if (type == 2) {
            game.sound.playSound(res.hall_sound.ddz_btn_mp3);
            if (!this._startFlag) {
                //如果没有开始游戏或者游戏已经结束了
                Connector.exitRoom();
            } else {

                var layer = new cc.LayerColor(cc.color(0, 0, 0, 150));
                layer.width = this.width;
                layer.height = this.height;
                this.addChild(layer, 10);
                var quitDialog = new cc.Sprite('#Room_quitDesk.png');
                tool.node.pos(quitDialog, this.width / 2, this.height * .6);
                layer.addChild(quitDialog);

                var confirmBtn = new MenuButton('Room_confirm1.png', 'Room_confirm2.png', cc.p(quitDialog.width / 2, quitDialog.height * .30));
                confirmBtn.addTouchEventListener(function () {
                    layer.removeFromParent();
                }, this);
                quitDialog.addChild(confirmBtn);
            }
        }
    },
    roomSettingBtn: function (object, type) {
        if (type == 2) {
            game.sound.playSound(res.hall_sound.ddz_btn_mp3);
            RoomScene.instance.settingLayer.show();
        }
    },
    roomReadyBtn: function (object, type) {
        if (type == 2) {
            //game.sound.playSound(res.hall_sound.ddz_btn_mp3);
            object.parent.removeFromParent(true);
            this._readyBtnLayer = null;
            Connector.start(true, 1);
        }
    },
    roomGameAgain: function (object, type) {
        if (type == 2) {
            Connector.start(true, 1);
            object.parent.removeFromParent();
            this._readyBtnLayer = null;
        }
    },
    hosting: function () {
        this.roomHost();
    },
    roomHost: function () {
        if (this._hostingLayer && this._robot) {
            this._hostingLayer.removeFromParent(true);
            this._robot = null;
            this._hostingLayer = null;
            return;
        }
        this.cancelPickCards();
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 70));
        layer.width = this.width;
        layer.height = this.height * .48;
        this.addChild(layer, 10);

        var hostingBtn = new MenuButton('Room_hosting1.png', 'Room_hosting2.png', cc.p(layer.width - 80, layer.height * .32));
        hostingBtn.addTouchEventListener(this.cancelHostingCallBack, this);
        layer.addChild(hostingBtn);
        this._hostingLayer = layer;
        this._robot = true;
    },
    cancelHostingCallBack: function (object, type) {
        if (type == 2) {
            if (this._robot) {
                this._hostingLayer.removeFromParent(true);
                this._robot = null;
                this._hostingLayer = null;
                Connector.unHosting();
            }
        }
    },
    removePlayedCard: function (cards) {
        //减去出的牌
        _.each(cards, function (p) {
            Global.curPlayer.cards = _.filter(Global.curPlayer.cards, function (c) {
                return c != p;
            });
        });
        //cc.log('出牌 ..', Global.curPlayer.cards);
    }
});