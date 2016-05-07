CHARS = ['A', 'B', 'C', 'D', 'E'];
CARDS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'AA', 'AB', 'AC', 'AD', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'BA', 'BB', 'BC', 'BD', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'CA', 'CB', 'CC', 'CD', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'DA', 'DB', 'DC', 'DD', 'E1', 'E2'];
undef = 'undefined';

RET = function (error, value) {
    if (typeof error === 'string') {
        return error;
    }
    return value;
};

Pokers = function () {
    // A1, E2, CA
    // 1st - Pattern (0-4, A黑桃,B红桃,C草花,D方块,E大小怪)
    // 2nd - Card (0-12 / 0-1, 1-D / 1-2)
    this._cards = [];

    this.addCard = function (cardtoken) {
        this._cards.push(cardtoken);
        return this;
    };

    this.addCards = function (cardtokens) {
        for (var i in cardtokens) {
            this.addCard(cardtokens[i]);
        }
        return this;
    };

    this.addPacks = function (num, removes) {
        if (typeof removes === undef) removes = [];

        while (num > 0) {
            num--;

            for (var i = 0; i < CARDS.length; ++i) {
                var e = false;
                for (var j = 0; j < removes.length; ++j) {
                    if (removes[j] == CARDS[i]) {
                        e = true;
                        break;
                    }
                }
                if (!e) {
                    this.addCard(CARDS[i]);
                }
            }
        }
        return this;
    };

    this.count = function () {
        return this._cards.length;
    };

    this.shuffle = function () {
        //this._cards = ["C6", "B7", "B4", "DB", "AD", "AA", "D1", "A7", "C4", "A2", "A5", "C2", "D7", "A3", "BC", "D9", "B5", "D3", "C7", "B9", "D4", "B8", "BB", "B1", "C5", "DA", "CA", "D5", "C3", "B3", "B2", "C1", "D2", "D8", "CC", "C8", "A8", "CB", "A9", "DD", "BD", "B6", "A1", "AB", "D6", "E1", "C9", "BA", "CD", "A4", "A6", "AC", "E2", "DC"];
        //this._cards = ["D5", "DC", "B1", "DB", "C6", "BB", "CD", "A8", "A6", "B6", "DA", "C8", "CB", "B3", "B7", "A5", "BC", "BD", "E2", "A1", "BA", "A9", "C7", "AB", "D8", "A7", "C1", "C4", "D3", "C3", "D1", "B5", "A2", "A4", "D2", "C2", "CC", "D4", "AA", "B4", "A3", "DD", "D6", "B8", "C5", "C9", "AD", "E1", "D9", "AC", "B2", "CA", "D7", "B9"];

        for (var i = 0; i < this.count(); ++i) {
            var j = Math.floor(i + Math.random() * (this.count() - i));
            var t = this._cards[i];
            this._cards[i] = this._cards[j];
            this._cards[j] = t;
        }

        //console.log(this._cards);
        return this;
    };

    this.first = function () {
        return this._cards.shift();
    };

    this.last = function () {
        return this._cards.pop();
    };

    this.clear = function () {
        this._cards = [];
        return this;
    };
};

Pokers.a2n = function (a) {
    a = a.toUpperCase();
    if (a >= '1' && a <= '9') return parseInt(a) - 1;
    if (a >= 'A' && a <= 'G') return parseInt(a, 16) - 1;
    return -1;
};

Pokers.n2a = function (n) {
    if (n < 9) return (n + 1) + '';
    if (n < 16) return CHARS[n - 10 + 1];
    return false;
};

Pokers.p2n = function (p) {
    p = p.toUpperCase();
    if (p >= 'A' && p <= 'E') return parseInt(p, 16) - 10;
    return -1;
};

Pokers.n2p = function (n) {
    if (n >= 0 && n < 5) return CHARS[n];
    return false;
};

Pokers.token2card = function (token) {
    var pattern = Pokers.p2n(token[0]);
    var card = Pokers.a2n(token[1]);

    if (((pattern >= 0 && pattern < 4) && (card >= 0 && card < 13))
        || (pattern == 4 && (card == 0 || card == 1)))
        return [pattern, card];

    return false;
};

Pokers.card2token = function (card, pattern) {
    var token = '';

    if (((pattern >= 0 && pattern < 4) && (card >= 0 && card < 13))
        || (pattern == 4 && (card == 0 || card == 1)))
        return token + Pokers.n2p(pattern) + Pokers.n2a(card);

    return false;
};

Pokers.same = function (cards1, cards2) {
    if (cards1 == cards2) return true;
    if (null == cards1 || null == cards2) return false;
    if (cards1.length != cards2.length) return false;
    var p1 = cards2.slice(0);
    for (var i in cards1) {
        var idx = p1.indexOf(cards1[i]);
        if (idx >= 0) {
            p1.splice(idx, 1);
        }
    }
    return p1.length == 0;
};

Pokers.toChinese = function (token) {
    if (token.length != 2) {
        return "牌不对";
    }

    if (token == 'E2') return "大怪";
    if (token == 'E1') return "小怪";

    var r = '';
    if (token[0] == 'A') r = '黑桃';
    if (token[0] == 'B') r = '红桃';
    if (token[0] == 'C') r = '草花';
    if (token[0] == 'D') r = '方块';

    if (r == '') {
        return "牌不对";
    }

    var v = (Pokers.a2n(token[1]) + 1);
    if (v == 1) r += 'A';
    else if (v == 10) r += 'X';
    else if (v == 11) r += 'J';
    else if (v == 12) r += 'Q';
    else if (v == 13) r += 'K';
    else r += v;
    return r;
};

Pokers.toCardSprite = function(token){
    if(token.length != 2){
        throw "牌不对 "+token;
    }

    if (token == 'E2') return "r1_c17.png";
    if (token == 'E1') return "r1_c16.png";

    var r = '';
    if (token[0] == 'A') r = "r1_";
    if (token[0] == 'B') r = "r2_";
    if (token[0] == 'C') r = "r3_";
    if (token[0] == 'D') r = "r4_";

    if(r == ''){
        throw "牌不对2 "+token;
    }

    var v = (Pokers.a2n(token[1])+1);
    if(v == 1) r+="c1.png";
    else if(v == 10) r+="c10.png";
    else if(v == 11) r+="c11.png";
    else if(v == 12) r+="c12.png";
    else if(v == 13) r+="c13.png";
    else r+="c"+v + ".png";

    return r;
}
