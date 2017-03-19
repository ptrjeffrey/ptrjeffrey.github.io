/**
 * Created by dell on 2016/7/17.
 */
var MJCardPile = function(count, cardList, isGrab, pos, oper){
    this.cardList = cardList || [];
    this.oper     = oper || 0;
    this.isGrab   = isGrab || false;
    this.grabedPos = pos || 0;
    this.cardCount = count || 0;
}


MJCardPile.prototype.setPile = function(count, cardList, isGrab, pos, oper){
    if(count != 3 && count != 4){
        return false;
    }

    if(oper == MJConst.kGrabMXG){
        var card = new MJCard();
        card.fromByte(cardList[0]);
        if(!card.isValid()){
            return false;
        }
        if(cardList[0] != this.cardList[0]){
            return false;
        }
        if(this.oper != MJConst.kGrabPeng){
            return false;
        }
        this.cardList.push(cardList[0]);
        this.cardCount = count;
        this.oper = oper;
        this.isGrab = isGrab;
        this.grabedPos = pos;
    }
    else{
        var len = cardList.length;
        if(len != 3 && oper & MJConst.kGrabChi){
            return false;
        }
        for(var i = 0; i < len; i++){
            var card = new MJCard();
            card.fromByte(cardList[i]);
            if(!card.isValid()){
                this.cardList = [];
                return false;
            }
            this.cardList.push(cardList[i]);
        }
        this.cardCount = count;
        this.oper = oper;
        this.isGrab = isGrab;
    }
    return true;
}

MJCardPile.prototype.getCardCount = function(byteCard){
    var card = new MJCard({byte : byteCard});
    if(!card.isValid()){
        return 0;
    }
    var sum = 0;
    for(var i in this.cardList){
        if(byteCard  == i){
            sum ++;
        }
    }
    return sum;
}

MJCardPile.prototype.getSuitCount = function(suit){
    var card = new MJCard({byte : byteCard});
    if(!card.isValid()){
        return 0;
    }
    var sum = 0;
    for(var i in this.cardList){
        if(card.suit == suit){
            sum ++;
        }
    }
    return sum;
}


MJCardPile.prototype.isSamePile =  function(){
    return this.cardList[0] == this.cardList[1];
}

MJCardPile.prototype.clear = function () {
    this.cardCount = 0;
    this.cardList = [];
    this.oper = 0;
    this.grabedPos = 0;
}