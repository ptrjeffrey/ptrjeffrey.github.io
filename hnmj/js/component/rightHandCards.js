/**
 * Created by dell on 2017/3/4.
 */

var RightCPGCards = function(resPos, res){
    this.kResHandPos = resPos
    this.cards = []
    for(var i = 0; i < resPos.length; i++){
        this.cards.push(new MJUnit(resPos[i], false, 0, i));
        this.cards[i].setRes(res);
    }
}

RightCPGCards.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.cards.length; i++){
        if(i > 0) {
            var card = this.cards[i - 1]
            this.cards[i].setPosition(card.getPositionX(), card.getPositionY() + card.getHeight() - 12)
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

RightCPGCards.prototype.setVisible = function(bShow){
    for(var i = 0; i < this.cards.length; i++){
        this.cards[i].setVisible(bShow);
    }
}

RightCPGCards.prototype.getInfoByIndex = function(index){
    var card = this.cards[index];
    if(card){
        return {x : card.getPositionX(), y : card.getPositionY(), w : card.getWidth(), h : card.getHeight()};
    }
    else{
        return {x : 0, y :0, w : 0, h : 0}
    }
}

RightCPGCards.prototype.getCardByIndex = function(index){
    return this.cards[index];
}

// �Լ��ĳ������ƹ���
var RightCPGCardsManager = function(){
    this.kCPGResPos   =[[84, 85, 86, 87], [88, 89, 90, 91], [92, 93, 94, 95], [96, 97, 98, 99]]
    this.pileCards = []
    this.pileList = []
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
    this.MJResForByteCard[MJConst.kBack] = 319
    for(var i = 0; i < this.kCPGResPos.length; i++) {
        this.pileCards.push(new RightCPGCards(this.kCPGResPos[i], this.MJResForByteCard))
        this.pileCards[i].setVisible(false);
    }
}

RightCPGCardsManager.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.pileCards.length; i++){
        var pileUI = this.pileCards[i]
        if (i > 0){
            var card = this.pileCards[i - 1].getInfoByIndex(2)
            pileUI.setPosition(card.x, card.y + card.h - 5);
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

RightCPGCardsManager.prototype.getCPGCardByIndex = function(index){
    return this.pileCards[index];
}

RightCPGCardsManager.prototype.addPile = function(mjByte, oper, pos){
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

RightCPGCardsManager.prototype.clear = function() {
    this.pileList = []
    for (var i = 0; i < this.kCPGResPos.length; i++) {
        this.pileCards[i].setVisible(false);
    }
}

var RightHandCards = function(){
    this.kResHandPos = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
    this.kResNewPos = 38
    this.kUpPosition = 15;
    this.handCards = [MJConst.kBack]
    this.newCard    = null
    this.handCardsUI = []
    this.selectedCard = null;
    this.canSeeHeight = 25;
    this.isShowMing = false;
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
    this.MJResForByteCard[MJConst.kBack] = 319

    for(var i = 0; i < this.kResHandPos.length; i++){
        this.handCardsUI.push(new MJUnit(this.kResHandPos[i], false, 0, i))
        this.handCardsUI[i].setRes(this.MJResForByteCard);
    }
    this.newCardUI = new MJUnit(this.kResNewPos);
    this.newCardUI.setRes(this.MJResForByteCard);
    this.cpgCardMgr = new RightCPGCardsManager()
}

RightHandCards.prototype.setData = function(cardList){
    this.handCards = cardList
}

RightHandCards.prototype.setNewCard = function(card){
    this.newCard = card
}

RightHandCards.prototype.refresh = function(){
    var num = this.handCards.length > this.handCardsUI.length ? this.handCardsUI.length : this.handCards.length
    for(var i = 0; i < this.kResHandPos.length; i++){
        var curCard = this.handCardsUI[i];
        if(i <  num){
            curCard.setVisible(true);
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
            curCard.setVisible(false);
        }
        if (i > 0){
            var curCard = this.handCardsUI[i];
            var lastCard = this.handCardsUI[i - 1];
            if(!this.isShowMing) {
                curCard.setPositionY(lastCard.getPositionY() + this.canSeeHeight)
            }
            else{
                curCard.setPositionY(lastCard.getPositionY() + lastCard.getHeight() - 18)
            }
        }
    }
    if(num > 0) {
        var x = this.handCardsUI[num - 1].getPositionX();
        var cpgCard = this.cpgCardMgr.getCPGCardByIndex(0)
        var card = cpgCard.getInfoByIndex(0);
        var y = this.handCardsUI[num - 1].getPositionY() + this.handCardsUI[num - 1].getHeight();
        this.cpgCardMgr.setPosition(x, y);
    }
}

RightHandCards.prototype.addCard = function(mjByte){
    this.setShowMingCards(mjByte != MJConst.kBack)
    this.handCards.push(mjByte)
    this.handCards.sort(function(l, r){return r - l});
    this.refresh()
}

RightHandCards.prototype.setNewCard = function(mjByte){
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

RightHandCards.prototype.deleteNewCard = function(){
    this.newCard = null;
    this.newCardUI.setVisible(false);
}


RightHandCards.prototype.clearHandCards = function(){
    this.handCards = [];
    this.refresh();
}

RightHandCards.prototype.clearCPGCards = function(){
    this.cpgCardMgr.clear();
}

RightHandCards.prototype.addPile = function(mjByte, oper, pos){
    this.cpgCardMgr.addPile(mjByte, oper, pos);
    this.refresh()
}

RightHandCards.prototype.setShowMingCards = function(bShow){
    this.isShowMing = bShow
}