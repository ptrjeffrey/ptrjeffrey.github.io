/**
 * Created by dell on 2017/3/18.
 */

var GameLayer = function(){
    this.selfHandCards = new SelfHandCards();
    this.rightHandCards = new RightHandCards();
    this.topHandCards = new TopHandCards();
    this.leftHandCards = new LefthandCards();
    this.handCards = [this.selfHandCards, this.rightHandCards, this.topHandCards, this.leftHandCards]

    this.riverCards = []
    this.selfRiver = new SelfRiverCards();
    this.rightRiver = new RightRiverCards();
    this.topRiver = new TopRiverCards();
    this.leftRiver = new LeftRiverCards();
    this.riverCards.push(this.selfRiver, this.rightRiver, this.topRiver, this.leftRiver);

    var self = this;
    var tmp = EngineWrapper.seekNodeById(9);
    tmp.setClickCallback(null, function(sender, x, y){
        var num = parseInt(Math.random()*MJConst.kJu+0, 10);
        self.selfRiver.pushMJ(num);
        self.rightRiver.pushMJ(num)
        self.topRiver.pushMJ(num)
        self.leftRiver.pushMJ(num)
    });

    tmp = EngineWrapper.seekNodeById(52);
    tmp.setClickCallback(null, function(sender, x, y){
        var num = parseInt(Math.random()*MJConst.k7Wan+ MJConst.k3Wan, 10);
        var operList = [MJConst.kGrabPeng, MJConst.kGrabZG, MJConst.kGrabAnG,
            MJConst.kGrabLChi, MJConst.kGrabMChi, MJConst.kGrabRChi]
        var oper = parseInt(Math.random()*operList.length+0, 10);
        self.selfHandCards.addPile(num, operList[oper], 2)
        self.topHandCards.addPile(num, operList[oper], 2)
        self.rightHandCards.addPile(num, operList[oper], 2)
        self.leftHandCards.addPile(num, operList[oper], 2)
        //self.topRiver.pushMJ(num)
        //self.leftRiver.pushMJ(num)
    });

    var btn = EngineWrapper.seekNodeById(MJUIConst.gameExit)
    btn.setClickCallback(null, function(sender, x, y){
        var hall = EngineWrapper.seekNodeById(3)
        hall.setLayertVisible(true);
    })

    this.leftTime = 0
    btn = EngineWrapper.seekNodeById(MJUIConst.gameSetting)
    btn.setClickCallback(null, function(sender, x, y){
        self.leftTime = parseInt(Math.random() * 99)
    })

    var handle = TimeHepler.setTimer(1000, this, this.onTimer, true)

    var clearCard = EngineWrapper.seekNodeById(7);
    clearCard.setClickCallback(this, this.clearCard);

    var addNewCard = EngineWrapper.seekNodeById(8);
    addNewCard.setClickCallback(this, this.addNewCard);

    var addCard = EngineWrapper.seekNodeById(1);
    addCard.setClickCallback(this, this.addCard);
}

GameLayer.prototype.setTime = function(time){
    var leftNum = EngineWrapper.seekNodeById(MJUIConst.leftTimeNum)
    var rightNum = EngineWrapper.seekNodeById(MJUIConst.rightTimeNum)
    if (time >= 0 && time < 100){
        if (time < 10){
            leftNum.setSprite(MJResConst.timeNum[0])
            rightNum.setSprite(MJResConst.timeNum[time])
        }
        else{
            leftNum.setSprite(MJResConst.timeNum[parseInt(time/10)])
            rightNum.setSprite(MJResConst.timeNum[time%10])
        }
    }
}

GameLayer.prototype.onTimer = function(){
    if(this.leftTime != null) {
        this.leftTime--;
        if (this.leftTime >= 0) {
            this.setTime(this.leftTime);
        }
    }
}

GameLayer.prototype.clearCard = function(sender, x, y){
    for(var i = 0; i < this.handCards.length; i++){
        this.handCards[i].clearHandCards()
        this.handCards[i].clearCPGCards();
    }
}

GameLayer.prototype.addNewCard = function(sender, x, y){
    var num = parseInt(Math.random()*MJConst.k8Wan+MJConst.k1Wan, 10);
    this.selfHandCards.setNewCard(num);
    // this.selfHandCards.moveNewToHand();
}

GameLayer.prototype.addCard = function(sender, x, y){
    var num = parseInt(Math.random()*MJConst.k8Wan+MJConst.k1Wan, 10);
    for(var i = 0; i < this.handCards.length; i++){
        this.handCards[i].addCard(num);
     }
}