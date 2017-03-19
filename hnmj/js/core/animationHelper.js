/**
 * Created by dell on 2017/2/26.
 */

var AnimationHelper = {}
AnimationHelper.kLoop = 0;

var kAnimationPos = {
    'action'    : 0,
    'from'      : 1,
    'to'        : 2,
    'X6'        : 3,
    'during'    : 4,
    'X8'        : 5,
    'delay'     : 6,
    'X10'       : 7,
    'repeat'    : 8,
    'X12'       : 9,
    'state'     : 10,
}
AnimationHelper.moveToX = function(from, to, during, caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setPositionX, from, to, 0, during, 0, 0, 0, 1, 0, 0]}
}

AnimationHelper.moveToY = function(from, to, during, caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setPositionY, from, to, 0, during, 0, 0, 0, 1, 0, 0]}
}

AnimationHelper.rotateTo = function(from, to, during, caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setRotate, from, to, 0, during, 0, 0, 0, 1, 0, 0]}
}

AnimationHelper.scaleTo = function(from, to, during, caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setScale, from, to, 0, during, 0, 0, 0, 1, 0, 0] }
}

AnimationHelper.alphaTo = function(from, to, during, caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setAlpha, from, to, 0, during, 0, 0, 0, 1, 0, 0] }
}

AnimationHelper.darkTo = function(from, to, during, caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setDark, from, to, 0, during, 0, 0, 0, 1, 0, 0] }
}

AnimationHelper.createRepeat = function(num, action){
    action.param[kAnimationPos.repeat] = num;
    return action;
}
var SportHelper = {}
SportHelper.moveToX = function(from, initSpeed, addSpeed, totalTime,  caller, callBackFunc){
    return {caller: caller, callbackFunc : callBackFunc,  param :[kAction.setPositionX, from, initSpeed, addSpeed, totalTime]}
}

SportHelper.moveToY = function(from, initSpeed, addSpeed, totalTime,  caller, callBackFunc){
    return {caller: caller, callbackFunc : callBackFunc,  param :[kAction.setPositionY, from, initSpeed, addSpeed, totalTime]}
}

SportHelper.rotateTo = function(from, initSpeed, addSpeed, totalTime,  caller, callBackFunc){
    return {caller: caller, callbackFunc : callBackFunc,  param :[kAction.setRotate, from, initSpeed, addSpeed, totalTime]}
}

SportHelper.scaleTo = function(from, initSpeed, addSpeed, totalTime,  caller, callBackFunc){
    return {caller: caller, callbackFunc : callBackFunc,  param :[kAction.setScale, from, initSpeed, addSpeed, totalTime]}
}

SportHelper.alphaTo = function(from, initSpeed, addSpeed, totalTime,  caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setAlpha,  from, initSpeed, addSpeed, totalTime]}
}

SportHelper.darkTo = function(from, initSpeed, addSpeed, totalTime,  caller, callBackFunc){
    return {caller : caller, callbackFunc : callBackFunc,  param :[kAction.setDark,  from, initSpeed, addSpeed, totalTime]}
}