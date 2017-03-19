/**
 * Created by dell on 2017/3/4.
 */

var LeftCPGCards = function(resPos, res){
    this.kResHandPos = resPos
    this.cards = []
    for(var i = 0; i < resPos.length; i++){
        this.cards.push(new MJUnit(resPos[i], false, 0, i));
        this.cards[i].setRes(res);
    }
}

LeftCPGCards.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.cards.length; i++){
        if(i > 0) {
            var card = this.cards[i - 1]
            this.cards[i].setPosition(card.getPositionX(), card.getPositionY() - card.getHeight() + 12)
        }
        else {
            this.cards[i].setPositionX(x)
            this.cards[i].setPositionY(y)
        }
    }
    this.cards[this.cards.length - 1].setPositionX(this.cards[1].getPositionX())
    this.cards[this.cards.length - 1].setPositionY(this.cards[1].getPositionY())
    //console.log(('right cards = ', this.cards))
}

LeftCPGCards.prototype.setVisible = function(bShow){
    for(var i = 0; i < this.cards.length; i++){
        this.cards[i].setVisible(bShow);
    }
}

LeftCPGCards.prototype.getInfoByIndex = function(index){
    var card = this.cards[index];
    if(card){
        return {x : card.getPositionX(), y : card.getPositionY(), w : card.getWidth(), h : card.getHeight()};
    }
    else{
        return {x : 0, y :0, w : 0, h : 0}
    }
}

LeftCPGCards.prototype.getCardByIndex = function(index){
    return this.cards[index];
}


// 自己的吃碰杠牌管理
var LeftCPGCardsManager = function(){
    this.kCPGResPos   =[[130, 129, 128, 131], [126, 125, 124, 127], [122, 121, 120, 123], [118, 117, 116, 119]]
    this.pileCards = []
    this.pileList = []
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
    this.MJResForByteCard[MJConst.kBack] = 320
    for(var i = 0; i < this.kCPGResPos.length; i++) {
        this.pileCards.push(new LeftCPGCards(this.kCPGResPos[i], this.MJResForByteCard))
        this.pileCards[i].setVisible(false);
    }
}

LeftCPGCardsManager.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.pileCards.length; i++){
        var pileUI = this.pileCards[i]
        if (i > 0){
            var card = this.pileCards[i - 1].getInfoByIndex(2)
            pileUI.setPosition(card.x, card.y - card.h + 5);
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

LeftCPGCardsManager.prototype.getCPGCardByIndex = function(index){
    return this.pileCards[index];
}

LeftCPGCardsManager.prototype.addPile = function(mjByte, oper, pos){
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

LeftCPGCardsManager.prototype.clear = function() {
    this.pileList = []
    for (var i = 0; i < this.kCPGResPos.length; i++) {
        this.pileCards[i].setVisible(false);
    }
}

var LefthandCards = function(){
    this.kResHandPos = [65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53]
    this.kResNewPos = 66
    this.kUpPosition = 15;
    this.handCards = [MJConst.kBack]
    this.newCard    = null
    this.handCardsUI = []
    this.selectedCard = null;
    this.canSeeHeight = 25;
    this.isShowMing = false;
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
    this.MJResForByteCard[MJConst.kBack] = 320
    for(var i = 0; i < this.kResHandPos.length; i++){
        this.handCardsUI.push(new MJUnit(this.kResHandPos[i], false, 0, i))
        this.handCardsUI[i].setRes(this.MJResForByteCard);
    }
    this.newCardUI = new MJUnit(this.kResNewPos);
    this.newCardUI.setRes(this.MJResForByteCard);
    this.cpgCardMgr = new LeftCPGCardsManager()
}

LefthandCards.prototype.setData = function(cardList){
    this.handCards = cardList
}

LefthandCards.prototype.setNewCard = function(card){
    this.newCard = card
}

LefthandCards.prototype.refresh = function(){
    var num = this.handCards.length > this.handCardsUI.length ? this.handCardsUI.length : this.handCards.length
    for(var i = 0; i < this.kResHandPos.length; i++){
        var curCard = this.handCardsUI[i];
        if(i <  num){
            curCard.setVisible(true)
            if(this.isShowMing) {
                curCard.setWidth(54)
                curCard.setHeight(48)
            }
            else{
                curCard.setWidth(25)
                curCard.setHeight(58)
            }
            curCard.setMJData(this.handCards[i]);
        }
        else{
            this.handCardsUI[i].setVisible(false);
        }
        if (i > 0) {
            var curCard = this.handCardsUI[i];
            var lastCard = this.handCardsUI[i - 1];
            if(!this.isShowMing) {
                curCard.setPositionY(lastCard.getPositionY() - this.canSeeHeight)
            }
            else{
                curCard.setPositionY(lastCard.getPositionY() - lastCard.getHeight() + 18)
            }
        }
    }
    if(num > 0) {
        var x = this.handCardsUI[num - 1].getPositionX();
        var cpgCard = this.cpgCardMgr.getCPGCardByIndex(0)
        var card = cpgCard.getInfoByIndex(0);
        var y = this.handCardsUI[num - 1].getPositionY() - card.h;
        this.cpgCardMgr.setPosition(x, y);
    }
}

// 显示麻将牌，用于结算以或听牌以后的明牌
LefthandCards.prototype.setShowMingCards = function(bShow){
    this.isShowMing = bShow
}

LefthandCards.prototype.addCard = function(mjByte){
    this.setShowMingCards(mjByte != MJConst.kBack)
    this.handCards.push(mjByte)
    this.handCards.sort(function(l, r){return r - l});
    this.refresh()
}

LefthandCards.prototype.setNewCard = function(mjByte){
    this.newCard = mjByte;
    this.isShowMing = mjByte != MJConst.kBack;
    if(this.isShowMing) {
        this.newCardUI.setWidth(54)
        this.newCardUI.setHeight(48)
    }
    else{
        this.newCardUI.setWidth(25)
        this.newCardUI.setHeight(58)
    }
    this.newCardUI.setVisible(true);
    this.newCardUI.setMJData(mjByte);
}

LefthandCards.prototype.deleteNewCard = function(){
    this.newCard = null;
    this.newCardUI.setVisible(false);
}


LefthandCards.prototype.clearHandCards = function(){
    this.handCards = [];
    this.refresh();
}

LefthandCards.prototype.clearCPGCards = function(){
    this.cpgCardMgr.clear();
}

LefthandCards.prototype.addPile = function(mjByte, oper, pos){
    this.cpgCardMgr.addPile(mjByte, oper, pos);
    this.refresh()
}