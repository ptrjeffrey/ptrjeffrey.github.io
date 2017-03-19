/**
* Created by dell on 2017/2/25.
*/

var kAction = {
	'replaceSprite'    : 1,
	'setPositionX'     : 18,
	'setPositionY'     : 19,
	'setWidth'          : 20,
	'setHeight'         : 21,
	'setScale'          : 33,
	'setRotate'         : 34,
	'setAlpha'          : 35,
	'setDark'           : 36,
	'setVisible'        : 37,
	'enableTouch'       : 41,
	'setFrame'           : 43,
	'setAnchorPointX'   : 45,
	'setImageShow'      : 51,
	'setText'            : 7,
	'setTimer'           : 57,
}

var kActionType = {
	'equal' 	: 0,
	'add' 		: 1,
	'sub' 		: 2,
	'mutiple' 	: 3,
	'divided '	: 4
}

var kAnimation = {
	'stop' : 0,
	'run' : 1
}

var kLayOut = {
	'hide' : 0,
	'show' : 1
}

var EngineWrapper = {}
EngineWrapper.nodeListMap = {}
EngineWrapper.groupListMap = {}

EngineWrapper.seekNodeById = function(id){
	if (EngineWrapper.nodeListMap[id]){
		return EngineWrapper.nodeListMap[id];
	}
	else {
		var node = new Node(id)
		EngineWrapper.nodeListMap[id] = node;
		return node;
	}
}

EngineWrapper.seekGroupById = function(id){
	if (EngineWrapper.groupListMap[id]){
		return EngineWrapper.groupListMap[id];
	}
	else {
		var node = new Node(id, true)
		EngineWrapper.groupListMap[id] = node;
		return node;
	}
}

EngineWrapper.onMouseDown = function(id, x, y){
	var node = EngineWrapper.seekNodeById(id);
	if(node && node.callbackFunc){
		if(node.caller){
			node.callbackFunc.call(node.caller, node,  x, y);
		}
		else{
			node.callbackFunc(node, x, y)
		}
	}
}

EngineWrapper.onMouseMove = function(id, x, y){
	var node = EngineWrapper.seekNodeById(id);
	if(node && node.onMoveCallbackFunc){
		if(node.caller){
			node.onMoveCallbackFunc.call(node.caller, node,  x, y);
		}
		else{
			node.onMoveCallbackFunc(node, x, y)
		}
	}
}

EngineWrapper.onMouseUp = function(id, x, y){
	var node = EngineWrapper.seekNodeById(id);
	if(node && node.onUpCallbackFunc){
		if(node.caller){
			node.onUpCallbackFunc.call(node.caller, node,  x, y);
		}
		else{
			node.onUpCallbackFunc(node, x, y)
		}
	}
}

EngineWrapper.onClip = function(id){
	var node = EngineWrapper.seekNodeById(id);
	if(node && node.isClip){
		set_clip(node.id, node.clipMode, node.clipX, node.clipY, node.clipW, node.clipH,  
		node.startA, node.endA, node.fx)
	}
}

EngineWrapper.onActionOver = function(id, actionId, count, allEnd){
	var node = EngineWrapper.seekNodeById(id);
	if(node && node.actionList.length > 0){
		for(var i = 0; i < node.actionList.length; i++){
			var action = node.actionList[i];
			if (action.param[kAnimationPos.action] == actionId && allEnd == 1){
				if(action.callbackFunc){
					if(action.caller){
						action.callbackFunc.call(caller);
					}
					else{
						action.callbackFunc()
					}
				}
				// ɾ������action
				var index = node.findActionIndex(actionId);
				//console.log('-- actionList = ', node.actionList);
				if(index != null){
					node.actionList.splice(index, 1);
				}
				//console.log('-- actionList 1 = ', node.actionList);
				break;
			}
		}
	}
}

EngineWrapper.onSpeedOver = function(id, actionId, totalTime){
	var node = EngineWrapper.seekNodeById(id);
	if(node && node.speedList.length > 0){
		var list = node.speedList;
		for(var i = 0; i < list.length; i++){
			var action = list[i];
			if (action.param[kAnimationPos.action] == actionId){
				if(action.callbackFunc){
					if(action.caller){
						action.callbackFunc.call(caller);
					}
					else{
						action.callbackFunc()
					}
				}
				// ɾ������action
				var index = node.findActionIndex(actionId, true);
				//console.log('-- actionList = ', node.actionList);
				if(index != null){
					list.splice(index, 1);
				}
				//console.log('-- actionList 1 = ', node.actionList);
				break;
			}
		}
	}
}

EngineWrapper.setTimer = function(id, intervel){
	set_self(id, kAction.setTimer, intervel, kActionType.equal, 0)
}

var wrapperFunc = function(caller, func){
	var Obj = {
		parent : caller,
		func : func
	}
	return Obj;
}

//// the base object node extend from cc.class
Node = cc.Class.extend({
	ctor : function(id, isgroup){
		//console.log('== new Node ctor --')
		this.id = id;
		this.actionList = [];
		this.speedList = [];
		this.isGroup = !isgroup ? false : true;
		this.tag = -1;
		this.parent = null
		this.children = [];
		this.isClip = false
		EngineWrapper.nodeListMap[id] = this;
	},
	setSelf : function(x1, x2, x3, x4, x5){
		//console.log('this.isGroup ', this.isGroup)
		if(!this.isGroup) {
			set_self(x1, x2, x3, x4, x5);
		}
		else{
			//console.log('-- setGroup --');
			set_group(x1, x2, x3, x4, x5);
		}
	},
	getSelf : function(x1, x2, x3, x4, x5){
		if(!this.isGroup){
			return get_self(x1, x2, x3, x4, x5);
		}
		else{
			return null;
		}
	},
	setSprite : function(Id){
		this.setSelf(this.id, kAction.replaceSprite, Id, kActionType.equal, 0)
	},
	setPositionX : function(x){
		this.setSelf(this.id, kAction.setPositionX, x,kActionType.equal, 0)
	},
	getPositionX : function(){
		return this.getSelf(this.id, kAction.setPositionX, kActionType.equal, 0, 0)
	},
	setOffsetX : function(x){
		this.setSelf(this.id, kAction.setPositionX, x,kActionType.add, 0)
	},
	setPositionY : function(y){
		this.setSelf(this.id, kAction.setPositionY, y,kActionType.equal, 0)
	},
	setPosition : function(x, y){
		this.setPositionX(x)
		this.setPositionY(y)
	},
	setOffsetY : function(x){
		this.setSelf(this.id, kAction.setPositionY, x,kActionType.add, 0)
	},
	getPositionY : function(){
		return this.getSelf(this.id, kAction.setPositionY, 0, 0, 0)
	},
	setWidth : function(w){
		this.setSelf(this.id, kAction.setWidth, w,kActionType.equal, 0)
	},
	setHeight : function(h){
		this.setSelf(this.id, kAction.setHeight, h,kActionType.equal, 0)
	},
	getWidth : function(){
		return this.getSelf(this.id, kAction.setWidth, 0, kActionType.equal, 0)
	},
	getHeight : function(){
		return this.getSelf(this.id, kAction.setHeight, 0, kActionType.equal, 0)
	},
	setScale : function(scale){
		this.setSelf(this.id, kAction.setScale, scale, kActionType.equal, 0)
	},
	getScale : function(){
		return this.getSelf(this.id, kAction.setScale, 0, kActionType.equal, 0)
	},
	setRotate : function(r){
		this.setSelf(this.id, kAction.setRotate, r,kActionType.equal, 0)
	},
	getRotate : function() {
		return this.getSelf(this.id, kAction.setRotate, 0, kActionType.equal, 0)
	},
	setAlpha : function(value){
		this.setSelf(this.id, kAction.setAlpha, value,kActionType.equal, 0)
	},
	getAlpha : function(){
		this.setSelf(this.id, kAction.setAlpha, 0, kActionType.equal, 0)
	},
	setDark : function(value){
		this.setSelf(this.id, kAction.setDark, value,kActionType.equal, 0)
	},
	getDark : function(){
		return this.getSelf(this.id, kAction.setDark, 0, kActionType.equal, 0)
	},
	setVisible : function(bShow){
		this.setSelf(this.id, kAction.setVisible, bShow,kActionType.equal, 0)
	},
	setColor : function(r, g, b, a){
		if(!this.isGroup){
			set_color(this.id, r, g, b, a)
		}
	},
	setLayertVisible : function(bShow){
		console.log('-- setLayer --')
		try {
			if(!this.isGroup){
				set_level(this.id, bShow ? kLayOut.show : kLayOut.hide)
			}
		}
		catch(err){
			console.log('-- set layer fail! --')
		}
	},
	setLayerLevel : function(level){
		if(!this.isGroup){
			set_level_up(this.id, level)
		}
	},
	getVisible : function(){
		return this.getSelf(this.id, kAction.setVisible, 0, kActionType.equal, 0)
	},
	setEnable : function(bEnable){
		this.setSelf(this.id, kAction.enableTouch, bEnable,kActionType.equal, 0)
	},
	getEnable : function(){
		return this.getSelf(this.id, kAction.enableTouch, 0,kActionType.equal, 0)
	},
	setFrame : function(frameNum){
		this.setSelf(this.id, kAction.setFrame, frameNum,kActionType.equal, 0)
	},
	getFrame : function(){
		return this.getSelf(this.id, kAction.setFrame, 0, kActionType.equal, 0)
	},
	moveByAnchorX : function(x){
		this.setSelf(this.id, kAction.setAnchorPointX, x,kActionType.equal, 0)
	},
	setText : function(text){
		this.setSelf(this.id, kAction.setText, text, kActionType.equal, 0)
	},
	getText : function(){
		return this.getSelf(this.id, kAction.setText, 0, kActionType.equal, 0)
	},
	setClickCallback : function(caller, func){
		this.caller = caller;
		this.callbackFunc = func;
	},
	setClip : function(x, y, w, h){
		this.isClip = true;
		this.clipX = x
		this.clipY = y
		this.clipW = w
		this.clipH = h
		this.clipMode = 0
		this.startA = 0
		this.endA = 0
		this.fx = 0
	},
	setCricelClip : function(x, y, w, h, startA, endA, fx){
		this.isClip = true;
		this.clipX = x
		this.clipY = y
		this.clipW = w
		this.clipH = h
		this.startA = startA || 0
		this.endA = endA || 0
		this.fx = fx || 1
		this.clipMode = 1
	},
	setRawClip : function(x, y, w, h){
		set_clip(this.id, 0, x, y, w, h, 0, 0, 0)
	},
	setOnMoveCallBack : function(caller, func){
		this.caller = caller;
		this.onMoveCallbackFunc = func
	},
	setOnUpCallBack : function(caller, func){
		this.caller = caller;
		this.onUpCallbackFunc = func;
	},
	addChild : function(node, x, y, tag){
		if (node.parent != null){
			return false;
		}
		if (tag == null){
			return false;
		}
		node.parent = this;
		ifast_addtospritefromspritecopy(this.id, node.id, x, y, tag);
		if(typeof (tag) == typeof (1)){
			this.children.push(node);
		}
		return true;
	},
	removeChild : function(tag) {
		ifast_dllpritefromspritecopy(this.id, tag);
	},
	getChildren : function(){
		return this.children;
	},
	runAction : function(action){
		if(action.param.length != 11){
			return;
		}
		var params = action.param;
		play_ani(kAnimation.run, this.id, params[0], params[1], params[2], params[3], params[4], params[5], params[6],
			params[7], params[8], params[9], params[10]);

		var index = this.findActionIndex(params[kAnimationPos.action]);
		if(index == null) {
			this.actionList.push(action);
		}
		else{
			this.actionList[index] = action;
		}
	},
	runSpeed : function(speedItem){
		if(speedItem.param.length != 5){
			return;
		}
		var params = speedItem.param;
		play_box(kAnimation.run, this.id, params[0], params[1], params[2], params[3], params[4])
		var index = this.findActionIndex(params[kAnimationPos.action], true);
		if(index == null) {
			this.speedList.push(speedItem);
		}
		else{
			this.speedList[index] = speedItem;
		}
	},
	findActionIndex : function(actionId, isSpeed){
		var list = this.speedList;
		if(isSpeed){
			list = this.actionList;
		}
		for(var i = 0; i < list.length; i++){
			var tmpParam = list[i].param;
			if(tmpParam[kAnimationPos.action] == actionId){
				return i;
			}
		}
		return null;
	},
	stopAction : function(){
		play_ani(kAnimation.stop, this.id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
});