/**
 * Created by Mic on 15/11/18.
 */
DDZRule = {
    isBomb: function(cards){
        if(null != cards && cards.length>=4){
            var b = cards[0];
            if(b[0] == 'E') return false;
            for(var i=1; i<cards.length; ++i){
                if(b[1] != cards[i][1]){
                    return false;
                }
                if(cards[i][0] == 'E') return false;
            }
            return b;
        }
        return false;
    },
    pkBomb: function(base, cards){
        var b = DDZRule.isBomb(base);
        if(b){
            var c = DDZRule.isBomb(cards);
            if(c){
                if(base.length > cards.length){
                    return -1;
                }else if(base.length < cards.length){
                    return 1;
                }else{
                    return DDZRule.pkSingle([b], [c]);
                }
            }else{
                return -1;
            }
        }else if(DDZRule.isBomb(cards)){
            return 1;
        }
        return 0;
    },
    isSingle: function(cards){
        if(null == cards || cards.length != 1) return false;
        return cards[0];
    },
    pkSingle: function(base, cards){
        var b = DDZRule.isSingle(base);
        if(b){
            var c = DDZRule.isSingle(cards);
            if(c){
                if(b == c) return -1;

                var vb = DDZRule.rank(b);
                var vc = DDZRule.rank(c);

                if(vb > vc) return -1;
                if(vb == vc) return -2;
                else return 1;
            }else
                return -1;
        }else if(null == base && DDZRule.isSingle(cards)){
            return 1;
        }
        return 0;
    },
    isPair: function(cards){
        if(null == cards || cards.length != 2) return false;

        if(cards[0] == cards[1]) return cards[0];

        if(cards[0][0] == 'E' || cards[1][0] == 'E') return false;
        if(cards[0][1] == cards[1][1]) return cards[0];
        return false;
    },
    pkPair: function(base, cards){
        return DDZRule.pk(base, cards,
            DDZRule.isPair);
    },
    isTriplet: function(cards){
        if(null == cards || cards.length != 3) return false;

        if(cards[0][0] == 'E' || cards[1][0] == 'E' || cards[2][0] == 'E') return false;

        if(cards[0][1] == cards[1][1] && cards[0][1] == cards[2][1]) return cards[0];
        return false;
    },
    pkTriplet: function(base, cards){
        return DDZRule.pk(base, cards,
            DDZRule.isTriplet);
    },
    isTripletPair: function(cards){
        if(null == cards || cards.length != 5) return false;

        for(var i=0; i<5; ++i){
            for(var j=i+1; j<5; ++j){
                var t = cards.slice(0);
                var p = [];
                p = p.concat(t.splice(j, 1));
                p = p.concat(t.splice(i, 1));

                var v = DDZRule.isTriplet(t);
                var p = DDZRule.isPair(p);
                if(v && p && DDZRule.rank(v)!=DDZRule.rank(p)){
                    return v;
                }
            }
        }
        return false;
    },
    pkTripletPair: function(base, cards){
        return DDZRule.pk(base, cards,
            DDZRule.isTripletPair);
    },
    isSequence: function(cards){
        if(null == cards || cards.length<5) return false;

        DDZRule.sort(cards);
        for(var i=1; i<cards.length; ++i){

            var a1 = DDZRule.rank(cards[i]);
            var b1 = DDZRule.rank(cards[i-1]);

            if(b1 == 14) return false;
            if(b1 - a1 != 1) return false;
        }

        return cards[0];
    },
    pkSequence: function(base, cards){
        return DDZRule.pk(base, cards,
            DDZRule.isSequence);
    },
    isSequencePair: function(cards){
        if(null == cards || cards.length<6 || cards.length%2!=0)
            return false;

        DDZRule.sort(cards);
        for(var i=1; i<cards.length; ++i){
            if(i%2==1){
                if(!DDZRule.isPair([cards[i],cards[i-1]]))
                    return false;
            }else{
                var a1 = DDZRule.rank(cards[i]);
                var b1 = DDZRule.rank(cards[i-2]);

                if(b1 == 14) return false;
                if(b1 - a1 != 1) return false;
            }
        }

        return cards[0];
    },
    pkSequencePair: function(base, cards){
        return DDZRule.pk(base, cards,
            DDZRule.isSequencePair);
    },
    isSequenceTriplet: function(cards){
        if(null == cards || cards.length<6 || cards.length%3!=0)
            return false;

        DDZRule.sort(cards);
        for(var i=1; i<cards.length; ++i){
            if(i%3 == 2){
                if(!DDZRule.isTriplet([cards[i], cards[i-1], cards[i-2]]))
                    return false;
            }else if(i%3==0){
                var a1 = DDZRule.rank(cards[i]);
                var b1 = DDZRule.rank(cards[i-3]);

                if(b1 == 14) return false;
                if(b1 - a1 != 1) return false;
            }
        }

        return cards[0];
    },
    pkSequenceTriplet: function(base, cards){
        return DDZRule.pk(base, cards,
            DDZRule.isSequenceTriplet);
    },
    isSequenceTripletPair: function(cards){
        if(null == cards || cards.length<10 || cards.length%5!=0)
            return false;

        DDZRule.sort(cards);
        var pairs = [], triplets = [];

        for(var i=0; i<cards.length;++i){
            if(i+1<cards.length && i+2<cards.length){
                if(DDZRule.isTriplet([cards[i], cards[i+1], cards[i+2]])){
                    triplets.push(cards[i]);
                    i+=2;
                    continue;
                }
            }
            if(i+1<cards.length && DDZRule.isPair([cards[i], cards[i+1]])){
                pairs.push(cards[i]);
                i++;
                continue;
            }
            return false;
        }

        if(triplets.length != pairs.length) return false;

        for(var i=1; i<triplets.length; ++i){
            var a1 = DDZRule.rank(triplets[i]);
            var b1 = DDZRule.rank(triplets[i-1]);

            if(b1 == 14) return false;
            if(b1 - a1 != 1) return false;
        }

        var dif = 1;
        var last = DDZRule.rank(cards[0]);
        for(var i=1; i<cards.length; ++i){
            var v = DDZRule.rank(cards[i]);
            if(v != last) dif++;
            last = v;
        }

        if(dif != (cards.length/5)*2) return false;

        return triplets[0];
    },
    pkSequenceTripletPair: function(base, cards){
        return DDZRule.pk(base, cards,
            DDZRule.isSequenceTripletPair);
    },
    pk: function(base, cards, check){
        var b = check(base);
        if(b){
            if(base.length != cards.length) return -1;
            var c = check(cards);
            if (c)
                return DDZRule.pkSingle([b], [c]);
            else
                return -1;
        }else if(null == base && check(cards)){
            return 1;
        }
        return 0;
    },
    rank: function(card){
        if (card == 'E1') return 16;
        if (card == 'E2') return 17;

        var a = Pokers.a2n(card[1]);
        if(a <=1) return 13 + a;
        return a;
    },
    sort: function(cards){
        if(cards)
            cards.sort(function (a, b) {
                if (a == b) return 0;

                var a1 = DDZRule.rank(a);
                var b1 = DDZRule.rank(b);

                if (a1 == b1) {
                    var a2 = Pokers.p2n(a[0]);
                    var b2 = Pokers.p2n(b[0]);

                    if (a2 == b2) return 0;
                    if (a2 > b2) return 1;
                    else return -1;
                } else if (a1 > b1) return -1;
                else return 1;
            });
        return cards;
    },
    spliteCards: function(cards, bound){
        if(typeof bound === undef) bound = 9999;

        var ret = {
            rocket: [],
            bombs: [],
            pairs: [],
            singles: [],
            triplets: [],
            seqTris: [],
            seqPairs: [],
            sequences: [],
            count: 0
        };

        if(cards.length == 0) return ret;

        var s = 0;
        if(cards[0] == 'E2' && cards[1] == 'E1'){
            if(bound >= 2){
                ret.rocket.push(['E2', 'E1']);
            }
            ret.singles.push(['E2']);
            ret.singles.push(['E1']);
            s = 2;
        }

        if(s >= cards.length) return ret;

        var last = cards[s];
        var lastv = DDZRule.rank(last);
        var t = [last];
        var ttri = [];
        var lastt = lastv;
        var tpair = [];
        var lastp = lastv;
        var tsin = [];
        var lasts = lastv;
        for(var i=s+1; i<=cards.length; ++i){
            var v = -1;

            if(i<cards.length)
                v = DDZRule.rank(cards[i]);

            if(v != lastv){
                if(i-s > 3 && bound>=4){
                    ret.bombs.push(t);

                    t = t.slice(0, 3);
                    s = i-3;
                }

                if(i-s == 3 && bound>=3){
                    ret.triplets.push(t);

                    if(lastv != 14 && (ttri.length == 0 || lastt - lastv == 1)){
                        ttri.push(t[0]);
                        ttri.push(t[1]);
                        ttri.push(t[2]);
                        lastt = lastv;
                    }

                    t = t.slice(0, 2);
                    s = i-2;
                }else{
                    if(ttri.length > 5 && bound>=6){
                        ret.seqTris.push(ttri);
                    }
                    ttri = [];
                }

                if(i-s == 2 && bound>=2){
                    ret.pairs.push(t);

                    if(lastv != 14 && (tpair.length == 0 || lastp - lastv == 1)){
                        tpair.push(t[0]);
                        tpair.push(t[1]);
                        lastp = lastv;
                    }

                    t = t.slice(0,1);
                    s = i-1;
                }else{
                    if(tpair.length > 5 && bound>=6){
                        ret.seqPairs.push(tpair);
                    }
                    tpair = [];
                }

                if(i-s == 1){
                    ret.singles.push(t);

                    if(lastv != 14 && (tsin.length == 0 || lasts - lastv == 1)){
                        tsin.push(t[0]);
                        lasts = lastv;
                    }
                }else{
                    if(tsin.length > 4 && bound>=5){
                        req.sequences.push(tsin);
                    }
                    tsin = [];
                }

                if(lastv - v != 1){
                    if(ttri.length > 5 && bound>=6){
                        ret.seqTris.push(ttri);
                    }
                    if(tpair.length > 5 && bound>=6){
                        ret.seqPairs.push(tpair);
                    }
                    if(tsin.length > 4 && bound>=5){
                        ret.sequences.push(tsin);
                    }

                    ttri = [];
                    tpair = [];
                    tsin = [];
                }

                s = i;
                if(i>=0){
                    t = [cards[i]];
                    lastv = v;
                }
            }else{
                t.push(cards[i]);
            }
        }

        // console.log("rocket "+ret.rocket);
        // console.log("bombs "+ret.bombs);
        // console.log("triplets "+ret.triplets);
        // console.log("pairs "+ret.pairs);
        // console.log("singles "+ret.singles);

        if(bound>=6){

            var seqTris = ret.seqTris.slice(0);
            for(var i=0; i<seqTris.length; ++i){
                var ct = seqTris[i].length/3;
                for(var st=0; st<ct; ++st){
                    for(var ed=st+1; ed<ct; ++ed){
                        if(st == 0 && ed == ct-1)continue;

                        var v = [];
                        for(var j=st*3; j<(ed+1)*3; ++j){
                            v.push(seqTris[i][j]);
                        }
                        ret.seqTris.push(v);
                    }
                }
            }

            var seqPairs = ret.seqPairs.slice(0);
            for(var i=0; i<seqPairs.length; ++i){
                var ct = seqPairs[i].length/2;
                for(var st=0; st<ct; ++st){
                    for(var ed=st+2; ed<ct; ++ed){
                        if(st == 0 && ed == ct-1)continue;

                        var v = [];
                        for(var j=st*2; j<(ed+1)*2; ++j){
                            v.push(seqPairs[i][j]);
                        }
                        ret.seqPairs.push(v);
                    }
                }
            }
        }


        if(bound>=5){
            var sequences = ret.sequences.slice(0);
            for(var i=0; i<sequences.length; ++i){
                for(var st=0; st<sequences[i].length; ++st){
                    for(var ed=st+4; ed<sequences[i].length; ++ed){
                        if(st == 0 && ed == sequences[i].length-1)continue;

                        var v = sequences[i].slice(st, ed+1);
                        ret.sequences.push(v);
                    }
                }
            }
        }


        ret.count = ret.rocket.length + ret.bombs.length + ret.pairs.length
            + ret.singles.length + ret.triplets.length + ret.seqTris.length
            + ret.seqPairs.length + ret.sequences.length;

        return ret;
    },
    splites2Array: function(splites){
        var plays = [];

        plays = plays.concat(splites.rocket);
        plays = plays.concat(splites.bombs);
        plays = plays.concat(splites.triplets);
        plays = plays.concat(splites.pairs);
        plays = plays.concat(splites.singles);

        return plays;
    }
};