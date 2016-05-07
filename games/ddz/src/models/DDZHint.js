DDZHint = function(){
	this._hints = null;
    this._hintidx = 0;

	this.prepare = function(cards){
		var hints = DDZN3Rule.spliteCards(cards, cards.length);
        this._hints = DDZN3Rule.splites2Array(hints).reverse();
	};

	this.available = function(ondesk){
		var cards = [];
        for(var i in this._hints){
            if(DDZN3Rule.tryplay(ondesk, this._hints[i])) {
                cards.push(this._hints[i]);
            }
        }

        return cards;
	};

    this.resetIndex = function(){
        this._hintidx = 0;
    };

	this.trypick = function(ondesk, ignore){
		var cards = this.available(ondesk);

		if(cards.length == 0) return null;

		var founded = null;

        var i = this._hintidx;
        do{
            // var match = true;
            // for(var j in ignore){
            //     var matchf = false;
            //     for(var k in cards[i]){
            //         var v1 = DDZRule.rank(cards[i][k]);
            //         var v2 = DDZRule.rank(ignore[j]);

            //         if(v1 == v2){
            //             matchf = true;
            //             break;
            //         }
            //     }

            //     if(!matchf)
            //         match = false;
            // }
            // if(match){
                if(null != ondesk){
                    founded = cards[i];
                    break;
                }else if(null == founded){
                    founded = cards[i];
                }else if(cards[i].length > founded.length){
                    founded = cards[i];
                }
            // }
            //cc.log("find ",i);
            i = i +1 % cards.length;
        }while(i != this._hintidx && null == founded);

        if(null != founded){
            this._hintidx = (i+1)%cards.length;
            var topick = founded.slice(0);
            // for(var i in ignore){
            //     var lastm = -1;
            //     for(var j in topick){
            //         if(topick[j] == ignore[i]){
            //             lastm = j;
            //             break;
            //         }else{
            //             var v1 = DDZRule.rank(topick[j]);
            //             var v2 = DDZRule.rank(ignore[i]);

            //             if(v1 == v2){
            //                 lastm = j;
            //             }
            //         }
            //     }
            //     if(lastm >= 0)
            //         topick.splice(lastm, 1);
            // }
            return topick;
        }

        return [];
	};

    this.autopick = function(ondesk, selected){
        selected = selected || [];

        var hint = null;
        for(var i in this._hints){
            var h = this._hints[i];

            if(h.length >= selected.length){

                if(!DDZN3Rule.tryplay(ondesk, h))
                    continue;

                var t = h.slice(0);
                for(var j in selected){
                    var found = -1;
                    var v2 = DDZRule.rank(selected[j]);

                    for(var k in t){
                        var v1 = DDZRule.rank(t[k]);

                        if(v1 == v2){
                            found = k;
                            break;
                        }
                    }

                    if(found >=0 ){
                        t.splice(found, 1);
                    }else{
                        break;
                    }
                }

                if(h.length - t.length == selected.length){
                    if(null == hint){
                        hint = t;
                    }else{
                        if(hint.length >= t.length && this.containsCard(hint, t)){
                            hint = t;
                        }else if(hint.length > t.length || !this.containsCard(t, hint)){
                            return null;
                        }
                    }
                }
            }
        }

        return hint;
    };

    this.containsCard = function(big, small){
        var b = big.slice(0);

        for(var i in small){
            var v1 = DDZRule.rank(small[i]);
            var found = false;
            for(var j in b){
                var v2 = DDZRule.rank(b[j]);

                if(v1 == v2){
                    b.splice(j, 1);
                    found = true;
                    break;
                }
            }

            if(!found) return false;
        }

        return true;
    };
};