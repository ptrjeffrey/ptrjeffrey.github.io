/**
* Created by dell on 2017/2/25.
*/

var HallLayer = function(){
    this.gameLayer = new GameLayer()
    console.log('-- hall ctor --')
    this.btnLeft = EngineWrapper.seekNodeById(2);
    this.btnLeft.setClickCallback(this, this.onCLickLeft)
    this.lbtnRight = EngineWrapper.seekNodeById(3);
    this.lbtnRight.setClickCallback(this, this.onClickRight)
    this.btnLS = EngineWrapper.seekNodeById(4);
    this.btnLS.setClickCallback(this, this.onClickOffsetX)
    this.btnRS = EngineWrapper.seekNodeById(5)
    this.btnRS.setClickCallback(this, this.onClickOffsetX1)
    this.txt = EngineWrapper.seekNodeById(1);
    this.num = 100;
    this.mj = EngineWrapper.seekNodeById(6);
    this.mj2 = EngineWrapper.seekNodeById(7);
    this.mj1 = EngineWrapper.seekNodeById(8);
    this.mjgroup = EngineWrapper.seekGroupById(6);

    
 
    //EngineWrapper.seekNodeById(3).setLayertVisible(false)

    var btn = EngineWrapper.seekNodeById(183)
    btn.setClickCallback(null, function(sender, x, y){
        var clip = EngineWrapper.seekNodeById(229);
        var action = AnimationHelper.moveToX(1280, -clip.getWidth() * 2, 20000, null, null);
        clip.runAction(action);
    })

    btn = EngineWrapper.seekNodeById(178)
    btn.setClickCallback(null, function(sender, x, y){
        var hall = EngineWrapper.seekNodeById(3)
        hall.setLayertVisible(false);
    })

    var clip = EngineWrapper.seekNodeById(MJUIConst.hallUserLogo);
    clip.setCricelClip(0, 0, 85, 85)//, 0, 0, 0);

    clip = EngineWrapper.seekNodeById(273);
    clip.setCricelClip(0, 0, 85, 85, 0, 60, 0);
}

HallLayer.prototype.onCLickLeft = function(x, y){
    this.txt.stopAction();
    this.txt.setPositionX(50)
    console.log('-- click left --');
    //EngineWrapper.setTimer(1, 1000);
    var self = this;
    var dt = new Date();
    console.log('- curTiem = ', dt.getMinutes() +":", dt.getSeconds())
    TimeHepler.setTimer(1000, null, function(){
        var dt = new Date();
        console.log('-- time out callback --', dt.getMinutes() +":", dt.getSeconds())
        self.txt.setText('new text');
    })
    for(var i = 0; i < this.handCards.length; i++){
        this.handCards[i].refresh();
    }
    var num = parseInt(Math.random()*MJConst.kJu+0, 10);
    this.selfRiver.pushMJ(num);
    this.rightRiver.pushMJ(num)
    this.topRiver.pushMJ(num)
    this.leftRiver.pushMJ(num)
}

HallLayer.prototype.onClickRight = function(x, y){
    this.txt.setPositionX(100)
    this.txt.setScale(100);
    console.log('-- click right --')
    //this.btnLS.setVisible(false)
}

HallLayer.prototype.onClickOffsetX = function(x, y){
    this.txt.setOffsetX(-10);
    this.txt.setText('左偏移')
    // 中文啊
    //TimeHepler.setTimer(1000, this, this.onTimerTest)
    var speed = SportHelper.moveToX(10, 100, 50, 3000, null, function(){
        console.log('-- 运动结束 --');
    })
    //this.mj.runSpeed(speed);
    //this.mj2.runSpeed(speed);
    //if(this.mj.getVisible()) {
    //    this.mjgroup.setPositionX(80);
    //}
    //else{
    //    this.mjgroup.setVisible(true);
    //}
    //this.mj1.setAlpha(100)

    var action = AnimationHelper.moveToY(this.mj.getPositionY(), this.mj.getPositionY() - 50, 1000, null, function(){})
    this.mj.runAction(action);
    action = AnimationHelper.moveToY(this.mj2.getPositionY(), this.mj2.getPositionY() - 50, 1000, null, function(){})
    this.mj2.runAction(action);
}

HallLayer.prototype.onClickOffsetX1 = function(x, y){
    this.txt.setOffsetX(10);
    this.txt.setText('右偏移')
    //var handle = TimeHepler.setTimer(2000, this, this.onTimerTest, true)
    //TimeHepler.deleteTimer(handle);
    this.btnRS.setScale(130);
    this.btnRS.setRotate(50);
    var from = this.txt.getPositionY();
    var action1 = AnimationHelper.moveToY(from, from + 300, 5000);
    this.txt.runAction(action1);
    //this.txt.setLayertVisible(true);

    from = this.txt.getPositionX();
    var action2 = AnimationHelper.moveToX(from, from + 300, 5000);
    this.txt.runAction(action2);

    var self = this;
    var action3 = AnimationHelper.rotateTo(0, 360, 1000, null, function(){
        self.txt.setText('rotate Over--')
        var action = AnimationHelper.scaleTo(20, 100, 1000);
        self.btnLeft.runAction(action);
    });
    //var action4 = AnimationHelper.createRepeat(AnimationHelper.kLoop, action3);
    this.mj.runAction(action3);
    this.mj2.runAction(action3);
    this.mj2.setColor(0, 0, 0, 100);
}

HallLayer.prototype.onTimerTest = function(){
    console.log('-- onTimerTest --',this.num);
}