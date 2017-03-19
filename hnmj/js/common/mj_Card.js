/**
 * Created by dell on 2016/7/10.
 */

var MJCard = function(param){
    if(!param){
        this.clear()
        return
    }
    if(param.byte){
        this.fromByte(param.byte);
    }
    else if(param.suit && param.point){
        this.suit = param.suit;
        this.point = param.point;
    }
    else{
        this.clear();
    }
    if(!this.isValid()){
        this.clear();
    }
}

MJCard.prototype.toByte = function(){
    return this.suit * MJConst.kPointMask + this.point;
}

MJCard.prototype.fromByte = function(byte){
this.suit = Math.floor(byte / MJConst.kPointMask);
    this.point = byte - this.suit * MJConst.kPointMask;
    return this;
}

MJCard.prototype.isValid = function(){
    if(this.suit <= MJConst.kSuitNone || this.point <= MJConst.kPointNone){
        return false;
    }
    else if(this.suit >= MJConst.kSuitWan && this.suit <= MJConst.kSuitTong){
        return this.point >= MJConst.kPoint1 && this.point <= MJConst.kPoint9;
    }
    else if(this.suit == MJConst.kSuitFeng){
        return this.point >= MJConst.kPoint1 && this.point <= MJConst.kPoint7;
    }
    else if(this.suit == MJConst.kSuitHua){
        return this.point >= MJConst.kPoint1 && this.point <= MJConst.kPoint8;
    }
    else{
        return false;
    }
}

MJCard.prototype.isSame = function(mjCard){
    return this.suit == mjCard.suit && this.point == mjCard.point;
}

MJCard.prototype.clear = function(){
    this.suit = MJConst.kSuitNone;
    this.point = MJConst.kPointNone;
}
