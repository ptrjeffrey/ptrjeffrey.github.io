/**
 * Created by dell on 2017/3/3.
 */
var kMaxCPGCardCount = 4;


var SelfCPGCards = function(resPos, res){
    this.kResHandPos = resPos
    this.cards = []
    for(var i = 0; i < resPos.length; i++){
        this.cards.push(new MJUnit(resPos[i], false, 0, i));
        this.cards[i].setRes(res);
    }
}

SelfCPGCards.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.cards.length; i++){
        this.cards[i].setPositionX(x - this.cards[i].getWidth() * i)
        this.cards[i].setPositionY(y)
    }
    this.cards[this.cards.length - 1].setPositionX(this.cards[1].getPositionX())
    this.cards[this.cards.length - 1].setPositionY(this.cards[1].getPositionY() - 10)
}

SelfCPGCards.prototype.setVisible = function(bShow){
    for(var i = 0; i < this.cards.length; i++){
        this.cards[i].setVisible(bShow);
    }
}

SelfCPGCards.prototype.getInfoByIndex = function(index){
    var card = this.cards[index];
    if(card){
        return {x : card.getPositionX(), y : card.getPositionY(), w : card.getWidth(), h : card.getHeight()};
    }
    else{
        return {x : 0, y :0, w : 0, h : 0}
    }
}

SelfCPGCards.prototype.getCardByIndex = function(index){
    return this.cards[index];
}

// 自己的吃碰杠牌管理
var SelfCPGCardsManager = function(){
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

    this.kCPGResPos   =[[68, 69, 70, 71], [72, 73, 74, 75], [76, 77, 78, 79], [80, 81, 82, 83]]
    this.pileCards = []
    this.pileList = [];
    for(var i = 0; i < this.kCPGResPos.length; i++) {
        this.pileCards.push(new SelfCPGCards(this.kCPGResPos[i], this.MJResForByteCard))
        this.pileCards[i].setVisible(false);
    }
}

SelfCPGCardsManager.prototype.setPosition = function(x, y){
    for(var i = 0; i < this.kCPGResPos.length; i++){
        var pileUI = this.pileCards[i]
        if (i > 0){
            var card = this.pileCards[i - 1].getInfoByIndex(2)
            pileUI.setPosition(card.x - card.w - 20, y);
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

SelfCPGCardsManager.prototype.getCPGCardByIndex = function(index){
    return this.pileCards[index];
}

SelfCPGCardsManager.prototype.addPile = function(mjByte, oper, pos){
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

SelfCPGCardsManager.prototype.clear = function(){
    this.pileList = []
    for(var i = 0; i < this.kCPGResPos.length; i++){
        this.pileCards[i].setVisible(false);
    }
}

var SelfHandCards = function(){
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
    // 资源和在手牌中哪个位置的列表
    this.kResHandPos = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    this.kResNewPos = 10;
    this.kUpPosition = 25;
    this.handCards = [1, 2]
    this.pileCards = [];
    this.newCard    = null
    this.handCardsUI = []
    this.selectedCard = null;
    for(var i = 0; i < this.kResHandPos.length; i++){
        this.handCardsUI.push(new MJUnit(this.kResHandPos[i], false, 0, i))
        this.handCardsUI[i].setRes(this.MJResForByteCard);
        this.handCardsUI[i].setClickCallback(this, this.onClickCard, 0, i);
        this.handCardsUI[i].setOnMoveCallBack(this, this.onMove);
        this.handCardsUI[i].setOnUpCallBack(this, this.onMouseUp);
    }
    this.newCardUI = new MJUnit(this.kResNewPos);
    this.newCardUI.setClickCallback(this, this.onClickCard);
    this.newCardUI.setOnMoveCallBack(this, this.onMove);
    this.newCardUI.setOnUpCallBack(this, this.onMouseUp);
    this.newCardUI.setRes(this.MJResForByteCard);
    this.cpgCardMgr = new SelfCPGCardsManager()
    this.flyingCard = new MJUnit(137);
    this.flyingCard.setAlpha(160);
}

SelfHandCards.prototype.setData = function(cardList){
    this.handCards = cardList
}

SelfHandCards.prototype.setNewCard = function(card){
    this.newCard = card
}

SelfHandCards.prototype.onClickCard = function(sender, x, y){
    if(this.selectedCard == sender){
        sender.setPositionY(sender.getPositionY() + this.kUpPosition);
        this.selectedCard = null
    }
    else {
        if (this.selectedCard) {
            this.selectedCard.setPositionY(this.selectedCard.getPositionY() + this.kUpPosition);
        }
        sender.setPositionY(sender.getPositionY() - this.kUpPosition);
        this.selectedCard = sender;
    }
}

SelfHandCards.prototype.onMove = function(sender, x, y){
    this.flyingCard.setVisible(true);
    this.flyingCard.setMJData(sender.getMJData())
    this.flyingCard.setPosition(x, y);
}

SelfHandCards.prototype.onMouseUp = function(sender, x, y){
    this.flyingCard.setVisible(false);
}

SelfHandCards.prototype.refresh = function(){
    var num = this.handCards.length > this.handCardsUI.length ? this.handCardsUI.length : this.handCards.length
    //console.log('random = ', num)
    for(var i = 0; i < this.kResHandPos.length; i++){
        //console.log('i = ', i, '-- obj = ', this.handCardsUI[i])
        if(i < this.handCards.length){
            var mjByte = this.handCards[i]
            this.handCardsUI[i].setVisible(true);
            this.handCardsUI[i].setMJData(mjByte);
        }
        else{
            this.handCardsUI[i].setVisible(false);
        }
        if(i > 0){
            var card = this.handCardsUI[i - 1]
            this.handCardsUI[i].setPosition(card.getPositionX() - card.getWidth(), card.getPositionY())
        }
    }
    if (num > 0) {
        var lastCard = this.handCardsUI[num - 1]
        var x = lastCard.getPositionX();
        var cpgCard = this.cpgCardMgr.getCPGCardByIndex(0)
        var card = cpgCard.getInfoByIndex(0);
        var y = lastCard.getPositionY() + lastCard.getHeight() - card.h;
        this.cpgCardMgr.setPosition(x - card.w - 5, y);
    }
}

SelfCPGCards.prototype.deleteCard = function(mjByte){
    for(var i = 0; i < this.handList.length; i++){
        if(this.handList[i] == mjByte){
            this.handList.splice(i, 1);
            this.refresh();
            break
        }
    }
}

SelfHandCards.prototype.addCard = function(mjByte){
    this.handCards.push(mjByte)
    this.handCards.sort(function(l, r){return r - l});
    this.refresh()
}

SelfHandCards.prototype.setNewCard = function(mjByte){
    this.newCard = mjByte;
    this.newCardUI.setVisible(true);
    this.newCardUI.setMJData(mjByte);
}

SelfHandCards.prototype.deleteNewCard = function(){
    this.newCard = null;
    this.newCardUI.setVisible(false);
}


SelfHandCards.prototype.clearHandCards = function(){
    this.handCards = [];
    this.refresh();
}

SelfHandCards.prototype.clearCPGCards = function(){
    this.cpgCardMgr.clear();
}

SelfHandCards.prototype.moveNewToHand = function(){
    if(!this.newCard){
        return;
    }
    this.addCard(this.newCard);
    this.deleteNewCard();
}

SelfHandCards.prototype.moveHandToNew = function(){
    if(this.handCards.length > 0) {
        this.setNewCard(this.handCards[0]);
        this.handCards.shift()
        this.refresh();
    }
}

SelfHandCards.prototype.addPile = function(mjByte, oper, pos){
    console.log(' set pile ', mjByte, ' oper ', oper)
    this.cpgCardMgr.addPile(mjByte, oper, pos);
    this.refresh()
}