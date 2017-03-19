/**
 * Created by dell on 2017/3/5.
 */

var LeftRiverCards = function(){
    // 麻将资源与麻将数值的对应表
    this.MJResForByteCard = {}
    for(var i = MJConst.k1Wan; i <= MJConst.k9Wan; i++) {
        this.MJResForByteCard[i] = 285 + i - MJConst.k1Wan
    }

    for(var i = MJConst.k1Tong; i <= MJConst.k9Tong; i++) {
        this.MJResForByteCard[i] = 276 + i - MJConst.k1Tong
    }

    for(var i = MJConst.k1Tiao; i <= MJConst.k9Tiao; i++) {
        this.MJResForByteCard[i] = 294 + i - MJConst.k1Tiao
    }
    for(var i = MJConst.kDong; i < MJConst.kBai; i++){
        this.MJResForByteCard[i] = 303 + i - MJConst.kDong
    }
    for(var i = MJConst.kChun; i < MJConst.kJu; i++){
        this.MJResForByteCard[i] = 311 + i - MJConst.kChun
    }

    this.mjByteList = []
    this.resForPos = [];
    this.cardUIList = [];
    for(var i = 236; i < 248; i++){
        this.resForPos.push(i);
    }
    for(var i = 248; i < 260; i++){
        this.resForPos.push(i);
    }

    for(var i = 0; i < this.resForPos.length; i++){
        this.cardUIList.push(new MJUnit(this.resForPos[i], false, 0, i))
        this.cardUIList[i].setVisible(false);
        this.cardUIList[i].setRes(this.MJResForByteCard);
    }
}

LeftRiverCards.prototype.pushMJ = function(byteCard){
    this.mjByteList.push(byteCard)
    //todo
    var len = this.mjByteList.length - 1;
    if(len < this.cardUIList.length) {
        this.cardUIList[len].setMJData(byteCard);
        this.cardUIList[len].setVisible(true);
    }
    this.updatePos()
}

LeftRiverCards.prototype.popMJ = function(){
    if (this.mjByteList.length > 0) {
        this.mjByteList.shift();
        this.cardUIList[this.mjByteList.length - 1].setVisible(false);
    }
}

LeftRiverCards.prototype.updatePos = function(){
    var len = this.mjByteList.length;
    if(len >= this.cardUIList.length) {
        len = this.cardUIList.length
    }
    for(var i = 0; i < len; i++){
        if (i % 12 != 0){
            var card = this.cardUIList[i - 1]
            this.cardUIList[i].setPosition(card.getPositionX(), card.getPositionY() + card.getHeight() - 12)
        }
    }
}