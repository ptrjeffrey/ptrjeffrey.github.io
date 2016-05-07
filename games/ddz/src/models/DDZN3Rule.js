DDZN3Rule = {
	SEAT: 3,
	POKER_PACK: 1,
	POKER_REMAIN: 3,
	SHOW_DIPAI: true,
	tryplay: function(base, play){
		if(DDZN3Rule.isRocket(play)) return true;
		if(DDZN3Rule.isRocket(base)) return false;

		var ret = DDZRule.pkBomb(base, play);

		if(ret == 0){
			if(DDZRule.isBomb(play)){
				return true;
			}
		}

		if(ret == 0)
			ret = DDZN3Rule.pkQuadplex2(base, play);

		if(ret == 0)
			ret = DDZN3Rule.pkQuadplex1(base, play);

		if(ret == 0)
			ret = DDZRule.pkSequenceTripletPair(base, play);

		if(ret == 0)
			ret = DDZN3Rule.pkSequenceTripletSingle(base, play);

		if(ret == 0)
			ret = DDZRule.pkSequenceTriplet(base, play);

		if(ret == 0)
			ret = DDZRule.pkSequencePair(base, play);

		if(ret == 0)
			ret = DDZRule.pkSequence(base, play);

		if(ret == 0)
			ret = DDZRule.pkTripletPair(base, play);

		if(ret == 0)
			ret = DDZN3Rule.pkTripletSingle(base, play);

		if(ret == 0)
			ret = DDZRule.pkTriplet(base, play);

		if(ret == 0)
			ret = DDZRule.pkPair(base, play);

		if(ret == 0)
			ret = DDZRule.pkSingle(base, play);

		if(ret == 1) return true;
		else return false;
	},
	isRocket: function(cards){
		return Pokers.same(cards, ['E1', 'E2']);
	},
	isTripletSingle: function(cards){
		if(null == cards || cards.length != 4) return false;

		for(var i=0; i<4; ++i){
			var t = cards.slice(0);
			t.splice(i, 1);

			var v = DDZRule.isTriplet(t);

			if(v){
				var t = DDZRule.rank(cards[i]);
				if(t!=DDZRule.rank(v)
					&& t!=16 && t!=17)
					return v;
			}
		}
		return false;
	},
	pkTripletSingle: function(base, cards){
		return DDZRule.pk(base, cards,
				DDZN3Rule.isTripletSingle);
	},
	isSequenceTripletSingle: function(cards){
		if(null == cards || cards.length<8 || cards.length%4!=0) 
			return false;

		DDZRule.sort(cards);
		var singles = [], triplets = [];

		for(var i=0; i<cards.length;++i){
			if(i+1<cards.length && i+2<cards.length){
				if(DDZRule.isTriplet([
				                      cards[i], cards[i+1], cards[i+2]])){
					triplets.push(cards[i]);
					i+=2;
					continue;
				}
			}

			var t = DDZRule.rank(cards[i]);
			if(t == 16 || t == 17) return false;

			singles.push(cards[i]);
		}

		if(triplets.length != singles.length) return false;

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

		if(dif != (cards.length/4)*2) return false;

		return triplets[0];
	},
	pkSequenceTripletSingle: function(base, cards){
		return DDZRule.pk(base, cards,
				DDZN3Rule.isSequenceTripletSingle);
	},
	// A5,B5,C5,D5 + A9,BQ
	isQuadplex1: function(cards){
		if(null == cards || cards.length != 6) 
			return false;

		DDZRule.sort(cards);
		var quad = null;

		for(var i=0; i<cards.length;++i){
			if(i+1<cards.length && i+2<cards.length && i+3<cards.length){
				if(DDZRule.isBomb([cards[i],
				                   cards[i+1], cards[i+2], cards[i+3]])){
					quad = cards[i];
					i+=3;
					continue;
				}
				var t = DDZRule.rank(cards[i]);
				if(t == 16 || t == 17) return false;
			}
		}

		var dif = 1;
		var last = DDZRule.rank(cards[0]);
		for(var i=1; i<cards.length; ++i){
			var v = DDZRule.rank(cards[i]);
			if(v != last) dif++;
			last = v;
		}

		if(dif != 3) return false;

		return quad;
	},
	pkQuadplex1: function(base, cards){
		return DDZRule.pk(base, cards,
				DDZN3Rule.isQuadplex1);
	},
	// A5,B5,C5,D5 + A9,B9,BB,CB
	isQuadplex2: function(cards){
		if(null == cards || cards.length != 8) 
			return false;

		DDZRule.sort(cards);
		var quad = null;

		for(var i=0; i<cards.length;++i){
			if(i+1<cards.length && i+2<cards.length && i+3<cards.length){
				if(DDZRule.isBomb([cards[i],
				                   cards[i+1], cards[i+2], cards[i+3]])){
					quad = cards[i];
					i+=3;
					continue;
				}
			}
			if(i+1>=cards.length ||
					!DDZRule.isPair([cards[i], cards[i+1]])){
				return false;
			}
			i++;
		}

		var dif = 1;
		var last = DDZRule.rank(cards[0]);
		for(var i=1; i<cards.length; ++i){
			var v = DDZRule.rank(cards[i]);
			if(v != last) dif++;
			last = v;
		}

		if(dif != 3) return false;

		return quad;
	},
	pkQuadplex2: function(base, cards){
		return DDZRule.pk(base, cards,
				DDZN3Rule.isQuadplex2);
	},
	spliteCards: function(cards, bound){
		if(typeof bound === undef) bound = 9999;

		//cc.log('DDZN3Rule spliteCards ',cards,bound);
		var ret = DDZRule.spliteCards(cards);
		ret['quadplex1'] = [];
		ret['quadplex2'] = [];
		ret['seqTriPairs'] = [];
		ret['seqTriSingles'] = [];
		ret['tripletPairs'] = [];
		ret['tripletSingles'] = [];

		if(cards.length == 0) return ret;

		if(bound >= 6){
			for(var i=0; i<ret.bombs.length; ++i){
				var bv = DDZRule.rank(ret.bombs[i][0]);

				for(var j=0; j<ret.singles.length; ++j){
					var sv = DDZRule.rank(ret.singles[j][0]);

					if(sv == bv)continue;
					for(var k=0; k<ret.singles.length; ++k){
						if(j!=k){
							var kv = DDZRule.rank(ret.singles[k][0]);

							if(bv != kv){
								var v = ret.bombs[i].slice(0);
								v.push(ret.singles[j][0]);
								v.push(ret.singles[k][0]);

								ret.quadplex1.push(v);
							}
						}
					}
				}

				if(bound >= 8){
					for(var j=0; j<ret.pairs.length; ++j){
						var pv = DDZRule.rank(ret.pairs[j][0]);

						if(pv == bv)continue;

						var v = ret.bombs[i].slice(0);
						v.push(ret.pairs[j][0]);
						v.push(ret.pairs[j][1]);
						ret.quadplex1.push(v);

						for(var k=0; k<ret.pairs.length; ++k){
							if(j!=k){
								var kv = DDZRule.rank(ret.pairs[k][0]);

								if(bv != kv){
									var v = ret.bombs[i].slice(0);
									v = v.concat(ret.pairs[j]);
									v = v.concat(ret.pairs[k]);

									ret.quadplex2.push(v);	
								}
							}
						}
					}
				}
			}
		}

		if(bound >= 4){
			for(var i=0; i<ret.triplets.length; ++i){
				var tv = DDZRule.rank(ret.triplets[i][0]);

				for(var j=0; j<ret.singles.length; ++j){
					var sv = DDZRule.rank(ret.singles[j][0]);

					if(tv != sv){
						var v = ret.triplets[i].slice(0);
						v.push(ret.singles[j][0]);

						ret.tripletSingles.push(v);
					}
				}

				if(bound >= 5){
					for(var j=0; j<ret.pairs.length; ++j){
						var pv = DDZRule.rank(ret.pairs[j][0]);

						if(tv != pv){
							var v = ret.triplets[i].slice(0);
							v.push(ret.pairs[j][0]);
							v.push(ret.pairs[j][1]);

							ret.tripletPairs.push(v);
						}
					}
				}
			}
		}

		if(bound >= 8){
			for(var i=0; i<ret.seqTris.length; ++i){
				var ct = ret.seqTris[i].length/3;

				var ev = [];
				for(var j=0; j<ct; ++j){
					ev.push(DDZRule.rank(ret.seqTris[i][j*3]));
				}

				DDZN3Rule.random(ct, [], ret.singles, 0, ev, function(picks){
					var v = ret.seqTris[i].slice(0);

					for(var j in picks){
						v.push(picks[j][0]);
					}
					ret.seqTriSingles.push(v);
				});

				if(bound >= 10){
					DDZN3Rule.random(ct, [], ret.pairs, 0, ev, function(picks){
						var v = ret.seqTris[i].slice(0);

						for(var j in picks){
							v.push(picks[j][0]);
							v.push(picks[j][1]);
						}
						ret.seqTriPairs.push(v);
					});
				}
			}
		}

		ret.count = ret.count + ret.quadplex1.length +ret.quadplex2.length + ret.seqTriPairs.length
		+ ret.seqTriSingles.length + ret.tripletPairs.length + ret.tripletSingles.length;

		//console.log("seqences "+ret.sequences);
		//console.log("seqences pairs "+ret.seqPairs);
		//console.log("seqences triplets "+ret.seqTris);
		//console.log(ret.seqTris);
		//console.log("quadplex1 "+ret.quadplex1);
		//console.log("quadplex2 "+ret.quadplex2);
		//console.log("triplet single "+ret.tripletSingles);
		//console.log("triplet pairs "+ret.tripletPairs);

		//console.log("seq triplet singles ");
		//console.log(ret.seqTriSingles);

		//console.log("seq triplet pairs ");
		//console.log(ret.seqTriPairs);

		return ret;
	},
	random: function(deep, picks, from, fst, exists, func){
		if(deep == 0){
			func(picks);
		}else{
			for(var i=fst; i<from.length; ++i){
				var v = DDZRule.rank(from[i][0]);
				var eidx = exists.indexOf(v);
				if(eidx >= 0)
					continue;

				var idx = picks.length;
				picks.push(from[i]);
				DDZN3Rule.random(deep-1, picks, from, i+1, exists, func);
				picks.splice(idx, 1);
			}
		}
	},
	splites2Array: function(splites){
		var plays = [];

		plays = plays.concat(splites.rocket);
		plays = plays.concat(splites.bombs);
		plays = plays.concat(splites.quadplex2);
		plays = plays.concat(splites.quadplex1);
		plays = plays.concat(splites.seqTriPairs);
		plays = plays.concat(splites.seqTriSingles);
		plays = plays.concat(splites.seqTriSingles);
		plays = plays.concat(splites.seqTris);
		plays = plays.concat(splites.seqPairs);
		plays = plays.concat(splites.sequences);
		plays = plays.concat(splites.tripletPairs);
		plays = plays.concat(splites.tripletSingles);
		plays = plays.concat(splites.triplets);
		plays = plays.concat(splites.pairs);
		plays = plays.concat(splites.singles);

		return plays;
	}
};