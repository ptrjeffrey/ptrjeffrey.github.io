/**
 * Created by dell on 2017/2/25.
 *  时间管理类，用于管理所有的超时，设置回调函数
 *  此组件依赖于必须有id为1的精灵对象，这个定时器精确到0.1秒
 */
var TimeHepler               = {}
TimeHepler.timerList        = []
TimeHepler.timerID          = 1
TimeHepler.kCancelTimeOut  = 0
TimeHepler.kConstTimeerID   = 1
TimeHepler.kInterval         = 100

var TimerItem = function(id, caller, callbackFunc, timeOut, loop){
    this.isLoop = loop;
    this.id     = id
    this.caller = caller;
    this.func   = callbackFunc;
    this.timeOut = timeOut
    this.stopTime = new Date().getTime() + timeOut;
}

TimeHepler.start = function(){
    //console.log('helper.start')
    EngineWrapper.setTimer(TimeHepler.kConstTimeerID, TimeHepler.kInterval)
}

TimeHepler.stop = function(){
    console.log('helper.stop')
    EngineWrapper.setTimer(TimeHepler.kConstTimeerID, TimeHepler.kCancelTimeOut)
}

TimeHepler.setInterval = function(value){
    TimeHepler.kInterval = value
    EngineWrapper.setTimer(TimeHepler.kConstTimeerID, TimeHepler.kCancelTimeOut)
    TimeHepler.start();
}

// obj是调用callbackFunc的对象
TimeHepler.setTimer = function(timeOut, caller,  callbackFunc, loop){
    var handle = TimeHepler.timerID;
    var isLoop = loop == null ? false : loop;
    //console.log('== timeOut =', timeOut)
    TimeHepler.timerList.push(new TimerItem(handle, caller, callbackFunc, timeOut, isLoop));
    TimeHepler.timerID++;
    //console.log('-- settime --')
    return handle;
}

TimeHepler.deleteTimer = function(handle){
    for(var i in TimeHepler.timerList){
        if(TimeHepler.timerList[i].id == handle){
            TimeHepler.timerList.splice(i, 1);
            break;
        }
    }
}

TimeHepler.dealEvent = function(){
    //console.log('TimeHepler.timerList = ', TimeHepler.timerList)
    var curTime = new Date().getTime();
    //console.log('curTime = ', curTime);
    var copyList = []
    for(var i = 0;i < TimeHepler.timerList.length; i++){
        if(TimeHepler.timerList[i]) {
            copyList.push(TimeHepler.cloneItem(TimeHepler.timerList[i]));
        }
    }
    //console.log('copyList = ', copyList)
    for(var i = 0;  i < copyList.length; i++) {
        var item = copyList[i];
        if(TimeHepler.isTimeUp(curTime, item)) {
            if (item.func) {
                if (item.caller) {
                    item.func.call(item.caller);
                }
                else {
                    item.func()
                }
            }
            if (!item.isLoop) {
                TimeHepler.deleteTimer(item.id);
            }
            else{
                var index = TimeHepler.getItemIndexByHandle(item.id)
                //console.log('loop ', item, ' index = ', index)
                if(index != null){
                    TimeHepler.timerList[index].stopTime = curTime + item.timeOut
                }
            }
        }
    }
}

TimeHepler.getItemIndexByHandle = function(handle){
    for(var i in TimeHepler.timerList) {
        if(TimeHepler.timerList[i].id == handle) {
            return i;
        }
    }
    return null;
}

TimeHepler.cloneItem = function(item){
    var cpy = new TimerItem(item.id, item.caller, item.func, item.timeOut, item.isLoop)
    cpy.stopTime = item.stopTime;
    return cpy;
}

TimeHepler.isTimeUp = function(curTime, item){
    if(item && item.stopTime) {
        return curTime >= item.stopTime;
    }
}