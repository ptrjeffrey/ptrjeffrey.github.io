/**
 * Created by dell on 2017/3/4.
 */


var TopCPGCards = function(resPos, res){
    this.kResHandPos = resPos
    this.cards = []
    for(var i = 0; i < resPos.length; i++){
        this.cards.push(new MJUnit(resPos[i], false, 0, i));
        this.cards[i].setRes(res);
    }
}

TopCPGCards.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.cards.length; i++){
        this.cards[i].setPosition(x + this.cards[i].getWidth() * i, y)
    }
    this.cards[this.cards.length - 1].setPositionX(this.cards[1].getPositionX())
    this.cards[this.cards.length - 1].setPositionY(this.cards[1].getPositionY() - 10)
}

TopCPGCards.prototype.setVisible = function(bShow){
    for(var i = 0; i < this.cards.length; i++){
        this.cards[i].setVisible(bShow);
    }
}

TopCPGCards.prototype.getInfoByIndex = function(index){
    var card = this.cards[index];
    if(card){
        return {x : card.getPositionX(), y : card.getPositionY(), w : card.getWidth(), h : card.getHeight()};
    }
    else{
        return {x : 0, y :0, w : 0, h : 0}
    }
}

TopCPGCards.prototype.getCardByIndex = function(index){
    return this.cards[index];
}

// 自己的吃碰杠牌管理
var TopCPGCardsManager = function(){
    this.MJResForByteCard = {}
    for(var i = MJConst.k1Wan; i <= MJConst.k9Wan; i++) {
        this.MJResForByteCard[i] = 165 + i - MJConst.k1Wan
    }

    for(var i = MJConst.k1Tong; i <= MJConst.k9Tong; i++) {
        this.MJResForByteCard[i] = 147 + i - MJConst.k1Tong
    }

    for(var i = MJConst.k1Tiao; i <= MJConst.k9Tiao; i++) {
        this.MJResForByteCard[i] = 156 + i - MJConst.k1Tiao
    }
    for(var i = MJConst.kDong; i < MJConst.kBai; i++){
        this.MJResForByteCard[i] = 174 + i - MJConst.kDong
    }
    for(var i = MJConst.kChun; i < MJConst.kJu; i++){
        this.MJResForByteCard[i] = 181 + i - MJConst.kChun
    }
    this.MJResForByteCard[MJConst.kBack] = 274

    this.kCPGResPos   =[[114, 113, 112, 115], [110, 109, 108, 111], [106, 105, 104, 107], [102, 101, 100, 103]]
    this.pileCards = []
    this.pileList = [];
    for(var i = 0; i < this.kCPGResPos.length; i++) {
        this.pileCards.push(new TopCPGCards(this.kCPGResPos[i], this.MJResForByteCard))
        this.pileCards[i].setVisible(false);
    }
}

TopCPGCardsManager.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.pileCards.length; i++){
        var pileUI = this.pileCards[i]
        if (i > 0){
            var card = this.pileCards[i - 1].getInfoByIndex(2)
            //console.log(card)
            pileUI.setPosition(card.x + card.w + 20, y);
        }
        else {
            pileUI.setPosition(x, y);
        }
        if(i < this.pileList.length) {
            pileUI.setVisible(true);
            var pile = this.pileList[i]
            for (var j = 0; j < 4; j++) {
                if (j < pile.cardList.length) {
                    pileUI.getCardByIndex(j).setMJData(pile.cardList[j]);
                    pileUI.getCardByIndex(j).setVisible(true);
                }
                else {
                    pileUI.getCardByIndex(j).setVisible(false);
                }
            }
        }
        else{
            pileUI.setVisible(false);
        }
    }
}

TopCPGCardsManager.prototype.getCPGCardByIndex = function(index){
    return this.pileCards[index];
}

TopCPGCardsManager.prototype.addPile = function(mjByte, oper, pos){
    var mjPile = new MJCardPile();
    switch (oper){
        case MJConst.kGrabPeng:
            mjPile.setPile(3, [mjByte, mjByte, mjByte], true, pos, oper);
            break;
        case MJConst.kGrabLChi:
            mjPile.setPile(3, [mjByte, mjByte + 1, mjByte + 2], true, pos, oper);
            break;
        case MJConst.kGrabMChi:
            mjPile.setPile(3, [mjByte, mjByte - 1, mjByte + 1], true, pos, oper);
            break;
        case MJConst.kGrabRChi:
            mjPile.setPile(3, [mjByte, mjByte - 1, mjByte - 2], true, pos, oper);
            break;
        case MJConst.kGrabAnG:
            mjPile.setPile(4, [mjByte, mjByte, mjByte, mjByte], false, pos, oper);
            break;
        case MJConst.kGrabZG:
            mjPile.setPile(4, [mjByte, mjByte, mjByte, mjByte], true, pos, oper);
            break;
        case MJConst.kGrabMXG:
            mjPile.setPile(4, [mjByte, mjByte, mjByte, mjByte], true, pos, oper);
            break;
    }
    this.pileList.push(mjPile);
}

TopCPGCardsManager.prototype.clear = function() {
    this.pileList = []
    for (var i = 0; i < this.kCPGResPos.length; i++) {
        this.pileCards[i].setVisible(false);
    }
}

var TopHandCards = function(){
    this.kResHandPos = [36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24]
    this.kResNewPos = 37
    this.kUpPosition = 15;
    this.handCards = [MJConst.kBack]
    this.newCard    = null
    this.handCardsUI = []
    this.selectedCard = null;
    this.isShowMing = false;
    this.MJResForByteCard = {}
    for(var i = MJConst.k1Wan; i <= MJConst.k9Wan; i++) {
        this.MJResForByteCard[i] = 165 + i - MJConst.k1Wan
    }

    for(var i = MJConst.k1Tong; i <= MJConst.k9Tong; i++) {
        this.MJResForByteCard[i] = 147 + i - MJConst.k1Tong
    }

    for(var i = MJConst.k1Tiao; i <= MJConst.k9Tiao; i++) {
        this.MJResForByteCard[i] = 156 + i - MJConst.k1Tiao
    }
    for(var i = MJConst.kDong; i < MJConst.kBai; i++){
        this.MJResForByteCard[i] = 174 + i - MJConst.kDong
    }
    for(var i = MJConst.kChun; i < MJConst.kJu; i++){
        this.MJResForByteCard[i] = 181 + i - MJConst.kChun
    }
    this.MJResForByteCard[MJConst.kBack] = 274
    for(var i = 0; i < this.kResHandPos.length; i++){
        this.handCardsUI.push(new MJUnit(this.kResHandPos[i], false, 0, i))
        this.handCardsUI[i].setRes(this.MJResForByteCard);
    }
    this.newCardUI = new MJUnit(this.kResNewPos);
    this.newCardUI.setRes(this.MJResForByteCard);
    this.cpgCardMgr = new TopCPGCardsManager()
}

TopHandCards.prototype.setData = function(cardList){
    this.handCards = cardList
}

TopHandCards.prototype.setNewCard = function(card){
    this.newCard = card
}

TopHandCards.prototype.refresh = function(){
    var num = this.handCards.length > this.handCardsUI.length ? this.handCardsUI.length : this.handCards.length
    for(var i = 0; i < this.kResHandPos.length; i++){
        var handCard = this.handCardsUI[i];
        if(i < num){
            handCard.setVisible(true);
            handCard.setMJData(this.handCards[i]);
        }
        else{
            handCard.setVisible(false);
        }
        if(i > 0){
            var card = this.handCardsUI[i - 1]
            handCard.setPosition(card.getPositionX() + card.getWidth(), card.getPositionY())
        }
    }
    if(num > 0) {
        var lastCard = this.handCardsUI[this.handCards.length - 1]
        var x = lastCard.getPositionX() + lastCard.getWidth();
        var cpgCard = this.cpgCardMgr.getCPGCardByIndex(0)
        var card = cpgCard.getInfoByIndex(0);
        var y = lastCard.getPositionY() + lastCard.getHeight() - card.h;
        this.cpgCardMgr.setPosition(x + 5, y);
    }
}

// 显示麻将牌，用于结算以或听牌以后的明牌
TopHandCards.prototype.showMingCards = function(){
    this.isShowMing = true
}

TopHandCards.prototype.addCard = function(mjByte){
    this.handCards.push(mjByte)
    this.handCards.sort(function(l, r){return r - l});
    this.refresh()
}

TopHandCards.prototype.setNewCard = function(mjByte){
    this.newCard = mjByte;
    this.newCardUI.setVisible(true);
    this.newCardUI.setMJData(mjByte);
}


TopHandCards.prototype.deleteNewCard = function(){
    this.newCard = null;
    this.newCardUI.setVisible(false);
}


TopHandCards.prototype.clearHandCards = function(){
    this.handCards = [];
    this.refresh();
}

TopHandCards.prototype.clearCPGCards = function(){
    this.cpgCardMgr.clear();
}

TopHandCards.prototype.addPile = function(mjByte, oper, pos){
    this.cpgCardMgr.addPile(mjByte, oper, pos);
    this.refresh()
}