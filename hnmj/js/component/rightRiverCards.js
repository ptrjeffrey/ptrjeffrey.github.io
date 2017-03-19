/**
 * Created by dell on 2017/3/5.
 */

var RightRiverCards = function(){
    // 麻将资源与麻将数值的对应表
    this.MJResForByteCard = {}
    for(var i = MJConst.k1Wan; i <= MJConst.k9Wan; i++) {
        this.MJResForByteCard[i] = 241 + i - MJConst.k1Wan
    }

    for(var i = MJConst.k1Tong; i <= MJConst.k9Tong; i++) {
        this.MJResForByteCard[i] = 232 + i - MJConst.k1Tong
    }

    for(var i = MJConst.k1Tiao; i <= MJConst.k9Tiao; i++) {
        this.MJResForByteCard[i] = 250 + i - MJConst.k1Tiao
    }
    for(var i = MJConst.kDong; i < MJConst.kBai; i++){
        this.MJResForByteCard[i] = 259 + i - MJConst.kDong
    }
    for(var i = MJConst.kChun; i < MJConst.kJu; i++){
        this.MJResForByteCard[i] = 266 + i - MJConst.kChun
    }
    this.mjByteList = []
    this.resForPos = [];
    this.cardUIList = [];
    for(var i = 1000; i >= 989; i--){
        this.resForPos.push(i);
    }
    for(var i = 987; i >= 976; i--){
        this.resForPos.push(i);
    }

    for(var i = 0; i < this.resForPos.length; i++){
        this.cardUIList.push(new MJUnit(this.resForPos[i], false, 0, i))
        this.cardUIList[i].setVisible(false);
        this.cardUIList[i].setRes(this.MJResForByteCard);
    }


}

RightRiverCards.prototype.pushMJ = function(byteCard){
    this.mjByteList.push(byteCard)
    //todo
    var len = this.mjByteList.length - 1;
    if(len < this.cardUIList.length) {
        this.cardUIList[len].setMJData(byteCard);
        this.cardUIList[len].setVisible(true);
    }
    this.updatePos()
}

RightRiverCards.prototype.popMJ = function(){
    if (this.mjByteList.length > 0) {
        this.mjByteList.shift();
        this.cardUIList[this.mjByteList.length - 1].setVisible(false);
    }
}

RightRiverCards.prototype.updatePos = function(){
    var len = this.mjByteList.length;
    if(len >= this.cardUIList.length) {
        len = this.cardUIList.length
    }
    for(var i = 0; i < len; i++){
        if (i % 12 != 0){
            var card = this.cardUIList[i - 1]
            this.cardUIList[i].setPosition(card.getPositionX(), card.getPositionY() +- card.getHeight() + 12)
        }
    }
}