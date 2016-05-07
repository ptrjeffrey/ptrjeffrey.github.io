/**
 * Created by Mic on 15/11/23.
 */

DDZRobot = function (dizhu, show) {
    this._seat = null;
    this._remains = [];
    this._remaincnts = [];
    this._tryplays = {};
    this._lastplay = null;
    this._dizhupass = false;

    this._deep = 0;
    this._updates = 0;

    var self = this;

    // 当就座成功
    this.onSit = function (seat) {
        this._seat = seat;
        console.log("机器人就座 座位" + this._seat._pos);

        setTimeout(function () {
            CATCH(seat.ready());
        }, 100);
    };

    this.onReset = function (seat) {

    };

    // 接收牌
    this.onReceive = function (card) {
        //console.log("seat "+this._seat._pos+" receive card "+card);
    };

    // 当被问地主
    this.onAskDizhu = function () {
        if (dizhu) {
            console.log("叫地主");
        } else {
            console.log("不叫地主");
        }

        setTimeout(function () {
            CATCH(self._seat.answerDizhu(dizhu));
        }, 100);
    };

    // 准备开始, 牌已排序
    this.onAskShowCard = function (dizhu, dipai) {
        this._dizhu = dizhu;

        this._remains = CARDS.slice(0);
        DDZRule.sort(this._remains);

        for (var i = 0; i < this._seat._cards; ++i) {
            var idx = this._remains.indexOf(this._seat._cards[i]);
            this._remains.splice(idx, 1);
        }

        return RET(this._seat.answerShowCard(show), this);
    };

    this.onStart = function (remains) {
        this._remaincnts = [];
        for (var i = 0; i < 3; ++i) {
            if (Array.isArray(remains[i])) {
                this._remaincnts[i] = remains[i].length;
            } else {
                this._remaincnts[i] = remains[i];
            }
        }
    }

    this.isDiZhu = function () {
        //return this._dizhu == this._seat._pos;
        return this._dizhu;
    };

    this.isMengBan = function () {
        //return this._seat._pos%3 + 1 == this._dizhu;
        return true;
    };

    this.onAsk = function (ondesk) {
        var c = this.pickCard(ondesk);

        //setTimeout(function(){
        //    //console.log("ask "+ondesk);
        //    if(null != c){
        //        var ret = RET(self._seat.play(c), self);
        //
        //        if(typeof ret === 'string'){
        //            console.log(self._seat._cards);
        //            console.log(ret);
        //        }
        //        // else
        //        // 	console.log("座位"+self._seat._pos+" 打 "+c+" 剩 "+self._seat.count());
        //    }else{
        //        CATCH(self._seat.pass());
        //        //console.log("座位"+self._seat._pos+" 过");
        //    }
        //}, 1000);
        return c ? c : [];
    };

    this.notifySit = function (pos) {
        // nothing to do
        //console.log("another sit on seat "+pos);
    };

    this.notifyReady = function (pos) {
        // nothing to do
        //console.log("another ready on seat "+pos);
    };

    this.notifyPlay = function (pos, play, remains) {
        if (null != play) {
            for (var i = 0; i < play.length; ++i) {
                var idx = this._remains.indexOf(play[i]);
                this._remains.splice(idx, 1);
            }
            for (var i = 0; i < 3; ++i) {
                if (Array.isArray(remains[i])) {
                    this._remaincnts[i] = remains[i].length;
                } else {
                    this._remaincnts[i] = remains[i];
                }
            }
            this._tryplays = {};
            this._lastplay = pos - 1;
        }

        if (this._dizhu == pos - 1 && null == play) {
            this._dizhupass = true;
        } else {
            this._dizhupass = false;
        }
        //test
        this.cards = remains[pos];
        return this.onAsk(play);
    };

    this.notifyFinish = function (winpos) {
        if (this._seat._pos == winpos) {
            setTimeout(function () {
                console.log("胜利 座位" + winpos)
            }, 100);
        }
        ;
    };

    this.pickCard = function (ondesk) {
        if (null != ondesk && DDZN3Rule.isRocket(ondesk)) {
            return null;
        }

        var opremain = 9999;

        //if(this.isDiZhu()){
        //    for(var i=0; i<3; ++i){
        //        if(i != this._seat._pos-1){
        //            opremain = Math.min(opremain, this._remaincnts[i]);
        //        }
        //    }
        //}else{
        opremain = this._remaincnts[this._dizhu - 1];
        //}

        //console.log("b - "+this._seat._pos + " "+this._remains);
        var me = DDZN3Rule.spliteCards(this.cards, this.cards.length);
        var he = DDZN3Rule.spliteCards(this._remains, opremain);

        var prepare = this.prepareSearch(me, he);

        var cards = this.cards;
        DDZRule.sort(cards);
        if (null == ondesk) {
            return this.pickFirstCard(cards, prepare);
        }
        if (this._dizhupass) {
            return null;
        }
        var istongmen = this._lastplay != this._dizhu;
        var mengban = istongmen && this.isMengBan();
        var ret = null;

        var t = DDZRule.isBomb(ondesk);

        if (false != t) {
            ret = this.pickFromItems(ondesk, cards, me.bombs, opremain, DDZRule.pkBomb, prepare, true);
        }

        if (me.rocket.length > 0) {
            cards = this.removeCards(cards, me.rocket[0]);
        }

        for (var i in me.bombs) {
            cards = this.removeCards(cards, me.bombs[i]);
        }

        if (false == t) {
            t = DDZN3Rule.isQuadplex2(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.quadplex2, opremain, DDZN3Rule.pkQuadplex2, prepare, true);
            }
        }

        if (false == t) {
            t = DDZN3Rule.isQuadplex1(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.quadplex1, opremain, DDZN3Rule.pkQuadplex1, prepare, true);
            }
        }

        if (false == t) {
            t = DDZRule.isSequenceTripletPair(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.seqTriPairs, opremain, DDZRule.pkSequenceTripletPair, prepare, false);
            }
        }

        if (false == t) {
            t = DDZN3Rule.isSequenceTripletSingle(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.seqTriSingles, opremain, DDZN3Rule.pkSequenceTripletSingle, prepare, false);
            }
        }

        if (false == t) {
            t = DDZRule.isSequenceTriplet(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.seqTris, opremain, DDZRule.pkSequenceTriplet, prepare, false);
            }
        }

        if (false == t) {
            t = DDZRule.isSequencePair(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.seqPairs, opremain, DDZRule.pkSequencePair, prepare, false);
            }
        }

        if (false == t) {
            t = DDZRule.isSequence(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.sequences, opremain, DDZRule.pkSequence, prepare, false);
            }
        }

        if (false == t) {
            t = DDZRule.isTripletPair(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.tripletPairs, opremain, DDZRule.pkTripletPair, prepare, false);
            }
        }

        if (false == t) {
            t = DDZN3Rule.isTripletSingle(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.tripletSingles, opremain, DDZN3Rule.pkTripletSingle, prepare, false);
            }
        }

        if (false == t) {
            t = DDZRule.isTriplet(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.triplets, opremain, DDZRule.pkTriplet, prepare, false);
            }
        }

        if (false == t) {
            t = DDZRule.isPair(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.pairs, opremain, DDZRule.pkPair, prepare, false, mengban ? 5 : 999);
            }
        }

        if (false == t) {
            t = DDZRule.isSingle(ondesk);

            if (false != t) {
                ret = this.pickFromItems(ondesk, cards, me.singles, opremain, DDZRule.pkSingle, prepare, false, mengban ? 5 : 999);
            }
        }

        if (null == ret && !DDZRule.isBomb(ondesk)) {
            var danger = false;
            if (this.isDiZhu()) {
                danger = this._remaincnts[this._lastplay] < 6;
            } else {
                danger = !mengban && this._remaincnts[this._dizhu] < 7;
            }

            if (me.bombs.length > 0 && danger) {
                return me.bombs[me.bombs.length - 1];
            }
            if (me.rocket.length > 0 && danger) {
                return me.rocket[0];
            }
        }

        return ret;
    };

    this.prepareSearch = function (me, he) {
        var plays = [];
        var pscores = [];
        var scores = {};

        for (var i in me.singles) {
            var s = this.scorePlay(me.singles[i], he.singles, DDZRule.pkSingle);
            scores[this.keyof(me.singles[i])] = s;
            plays.push(me.singles[i]);
            pscores.push(s);
        }

        for (var i in me.pairs) {
            var s = this.scorePlay(me.pairs[i], he.pairs, DDZRule.pkPair);
            scores[this.keyof(me.pairs[i])] = s;
            plays.push(me.pairs[i]);
            pscores.push(s);
        }

        for (var i in me.triplets) {
            var s = this.scorePlay(me.triplets[i], he.triplets, DDZRule.pkTriplet);
            scores[this.keyof(me.triplets[i])] = s;
            plays.push(me.triplets[i]);
            pscores.push(s);
        }

        for (var i in me.seqTris) {
            var s = this.scorePlay(me.seqTris[i], he.seqTris, DDZRule.pkSequenceTriplet) * 2. / (me.seqTris[i].length / 3.);
            scores[this.keyof(me.seqTris[i])] = s;
            plays.push(me.seqTris[i]);
            pscores.push(s);
        }

        for (var i in me.seqPairs) {
            var s = this.scorePlay(me.seqPairs[i], he.seqPairs, DDZRule.pkSequencePair) * 3. / (me.seqPairs[i].length / 2.);
            scores[this.keyof(me.seqPairs[i])] = s;
            plays.push(me.seqPairs[i]);
            pscores.push(s);
        }

        for (var i in me.sequences) {
            var s = this.scorePlay(me.sequences[i], he.sequences, DDZRule.pkSequence) * 5. / me.sequences[i].length;
            scores[this.keyof(me.sequences[i])] = s;
            plays.push(me.sequences[i]);
            pscores.push(s);
        }

        for (var i in me.seqTriPairs) {
            var s = this.scoreCombinePlay(me.seqTriPairs[i], me.seqTris, scores) * 2. / (me.seqTriPairs[i].length / 5.);
            scores[this.keyof(me.seqTriPairs[i])] = s;
            plays.push(me.seqTriPairs[i]);
            pscores.push(s);
        }

        for (var i in me.seqTriSingles) {
            var s = this.scoreCombinePlay(me.seqTriSingles[i], me.seqTris, scores) * 2. / (me.seqTriSingles[i].length / 4.);
            scores[this.keyof(me.seqTriSingles[i])] = s;
            plays.push(me.seqTriSingles[i]);
            pscores.push(s);
        }

        for (var i in me.tripletPairs) {
            var s = this.scoreCombinePlay(me.tripletPairs[i], me.triplets, scores);
            scores[this.keyof(me.tripletPairs[i])] = s;
            plays.push(me.tripletPairs[i]);
            pscores.push(s);
        }

        for (var i in me.tripletSingles) {
            var s = this.scoreCombinePlay(me.tripletSingles[i], me.triplets, scores);
            scores[this.keyof(me.tripletSingles[i])] = s;
            plays.push(me.tripletSingles[i]);
            pscores.push(s);
        }

        //console.log(scores);
        //console.log(plays);

        return {"scores": scores, "plays": plays, "pscores": pscores, "me": me};
    };

    this.pickFirstCard = function (cards, prepare) {
        var plays = prepare['plays'];
        var pscores = prepare['pscores'];
        var scores = prepare['scores'];
        var me = prepare['me'];

        if (me.quadplex1.length == 1 && cards.length == 6) {
            return me.quadplex1[0];
        }

        if (me.quadplex2.length == 1 && cards.length == 8) {
            return me.quadplex2[0];
        }

        if (me.rocket.length > 0) {
            cards = this.removeCards(cards, me.rocket[0]);
        }

        for (var i in me.bombs) {
            cards = this.removeCards(cards, me.bombs[i]);
        }

        if (cards.length == 0) {
            if (me.bombs.length > 0)
                return me.bombs[me.bombs.length - 1];
            else if (me.rocket.length > 0)
                return me.rocket[0];

            return null;
        }

        if (!this.isDiZhu() && !this.isMengBan() && null != this._remaincnts) {
            if (this._remaincnts[(this._seat._pos + 1) % 3] == 1) {
                var card = me.singles[me.singles.length - 1];
                if (scores[this.keyof(card)] > 4)
                    return card;
            }
        }

        //console.log(scores);
        //console.log(plays);

        var bestplay = this.tryBestPlay(cards, plays, pscores, 999999);
        //console.log(this._deep);
        //console.log(bestplay);

//		var plays = [];
//
//		var v = bestplay;
//		var play = "";
//
//		while(null != v && null != v.play){
//			if(plays.length >0 && v.score > plays[0].score){
//				plays.splice(0, 0, v);
//			}else{
//				plays.push(v);
//			}
//
//			play += v['play']+"  ";
//			v = v.next;
//		}
//		console.log(play);

        return bestplay.play;
    };

    this.containsCard = function (card, play) {
        var rank = DDZRule.rank(card);
        for (var i in play) {
            var r = DDZRule.rank(play[i]);
            if (rank == r) return true;
        }

        return false;
    };

    this.pickFromItems = function (ondesk, cards, items, opremain, pkfunc, prepare, needbreak, mengban) {
        var bestret = null;
        var bestscore = 999999;
        var plays = prepare['plays'];
        var pscores = prepare['pscores'];

        for (var i = items.length - 1; i >= 0; i--) {
            if (pkfunc(ondesk, items[i]) > 0) {

                if (needbreak) {
                    bestret = items[i];
                    break;
                } else {
                    var c = this.removeCards(cards, items[i]);

                    if (null == c)continue;
                    var score = prepare['scores'][this.keyof(items[i])];

                    if (items[i][0] == 'CA' && items[i][1] == 'BA')
                        cc.log("break");

                    var bestplay = this.tryBestPlay(c, plays, pscores, 999999);
                    var s = bestplay.score + bestplay.remain;

                    if (s < bestscore && (typeof mengban === undef || score < mengban)) {
                        bestret = items[i];
                        bestscore = s;
                    }
                }
            }
        }

        return bestret;
    };

    this.scoreBomb = function (play, remains) {
        var score = 0;
        for (var i in remains) {
            if (DDZRule.pkBomb(play, remains[i]) > 0) {
                score++;
            }
            ;
        }
        return score;
    };

    this.scorePlay = function (play, remains, cpfunc) {
        var score = 0;
        for (var i in remains) {
            var ret = cpfunc(play, remains[i]);
            if (ret > 0) {
                score++;
            } else if (ret == -2) {
                score += 0.2;
            }
            ;
        }
        return score;
    };

    this.scoreCombinePlay = function (play, combineref, scores) {
        var a = DDZRule.rank(play[0]);

        for (var j in combineref) {
            var b = DDZRule.rank(combineref[j][0]);

            if (a == b) {
                return scores[this.keyof(combineref[j])];
            }
        }

        return 0;
    };

    this.logit = function (cards, best, p) {
        if (cards.length == 20) {
            if (this._deep > 0) {
                cc.log("deep " + this._deep + " update " + this._updates);
                var v = best;
                var play = "";
                while (v != null) {
                    play += v['play'] + "  ";
                    v = v['next'];
                }
                console.log(play);

                console.log("play " + p);
                console.log("score " + best['score'] + " " + best['remain'] + " " + (best['score'] + best['remain']));
                console.log("");
            }
            this._deep = 0;
            this._updates = 0;
        }
    };

    this.tryBestPlay = function (cards, plays, scores, max) {
        var best = {"play": null, "score": 0, "remain": 0, "next": null};

        if (cards.length == 0) return best;

        var key = this.keyof(cards);

        if (typeof this._tryplays[key] !== undef) {
            return this._tryplays[key];
        }

        this._deep = this._deep + 1;
        best.remain = 999999;

        for (var i in plays) {
            if (!this.containsCard(cards[cards.length - 1], plays[i])) continue;

            var s = scores[i];

            if (s < max) {
                var c = this.removeCards(cards, plays[i]);

                if (null == c) continue;

                if (c.length > 0) {
                    var ret = this.tryBestPlay(c, plays, scores, best['remain']);

                    if ((ret['remain'] + ret['score']) < best['remain'] &&
                        (ret['remain'] + ret['score'] + s) < max) {
                        best['play'] = plays[i];
                        best['score'] = s;
                        best['remain'] = ret['remain'] + ret['score'];
                        best['next'] = ret;

                        this._updates++;
                    }

                } else {
                    best['play'] = plays[i];
                    best['score'] = s;
                    best['remain'] = 0;
                    best['next'] = 0;
                }
                //this.logit(cards, best, plays[i]);
            }
        }

        if (null != best.play)
            this._tryplays[key] = best;

        //console.log(cards+" "+best["play"]+" "+best['score']+" "+best['remain']);

        return best;
    };

    this.keyof = function (cards) {
        var key = "";

        for (var i in cards) {
            if (cards[i] == 'E2') {
                key += 'F';
            } else if (cards[i] == 'E1') {
                key += 'E';
            } else {
                key += cards[i][1];
            }
        }

        return key;
    };

    this.removeCards = function (cards, play) {
        if (play.length > cards.length) return null;

        var p = play.slice(0);
        var c = [];
        for (var i = 0; i < cards.length; ++i) {
            var ignore = false;
            ;
            for (var j = p.length - 1; j >= 0; --j) {
                if (DDZRule.rank(cards[i]) == DDZRule.rank(p[j])) {
                    ignore = true;
                    p.splice(j, 1);
                    break;
                }
            }
            if (!ignore)
                c.push(cards[i]);
        }

        if (p.length == 0) {
            return c;
        }
        return null;
    }
};