
var undef = 'undefined';

var syntc = {
    needfocus: false,
    portrait : 1,
    landscape : 0,
    landscape_left_from_portrait : 2,
    landscape_right_from_portrait : 3,
    url: {
        checkTag: function(tag){
            if(window && window.location){
                var hash = window.location.hash.substr(1).split(".");

                for(var i in hash){
                    if(hash[i] == tag) return true;
                }
            }
        }
    },
    layer: {
        fit: function(from, to){
            from.ignoreAnchorPointForPosition(false);
            from.width = to.width;
            from.height = to.height;
            syntc.node.pos(from, 0, 0, 0, 0);
        }
    },
    node : {
    	create : function(type, size){
    		obj = new type;
    		obj.ignoreAnchorPointForPosition(false);
    		if(typeof size !== undef)
    			obj.setContentSize(size);
    		return obj;
    	},
    	create1 : function(type, arg1, size){
    		obj = new type(arg1);
    		obj.ignoreAnchorPointForPosition(false);
    		if(typeof size !== undef)
    			obj.setContentSize(size);
    		return obj;
    	},
    	createOpacityMenuItem: function(texture, normalOpacity, selectedOpacity, disabledOpacity, func, target){
    		var normal = new cc.Sprite(texture);
    		normal.opacity = normalOpacity;
    		var selected = new cc.Sprite(texture);
    		selected.opacity = selectedOpacity;
    		var disabled = new cc.Sprite(texture);
    		disabled.opacity = disabledOpacity;

    		return new cc.MenuItemSprite(normal, selected, disabled, func, target);
    	},
    	updateOpacityMenuItem: function(menuItem, texture, normalOpacity, selectedOpacity, disabledOpacity){
    		var normal = new cc.Sprite(texture);
    		normal.opacity = normalOpacity;
    		var selected = new cc.Sprite(texture);
    		selected.opacity = selectedOpacity;
    		var disabled = new cc.Sprite(texture);
    		disabled.opacity = disabledOpacity;

    		menuItem.setNormalImage(normal);
    		menuItem.setSelectedImage(selected);
    		menuItem.setDisabledImage(disabled);
    	},
        center : function(a, b){
            this.posr(a, b, .5, .5, .5, .5);
        },
        posr : function(a, b, wr, hr, ax, ay){
            if(typeof ax === undef){
                ax = .5;
            }
            
            if(typeof ay === undef){
                ay = .5;
            }
            
            this.pos(a, b.width * wr, b.height * hr, ax, ay);
        },
        pos: function(a, x, y, ax, ay){
            if(typeof ax === undef){
                ax = .5;
            }
            
            if(typeof ay === undef){
                ay = .5;
            }
            a.attr({
                x: x,
                y: y,
                anchorX: ax,
                anchorY: ay
            });
        }
    },
    sprite :{
    	pos : function(tex, x, y, ax, ay){
    		var s = new cc.Sprite(tex);
    		syntc.node.pos(s, x, y, ax, ay);
    		return s;
    	},
    	center : function(tex, center){
    		var s = new cc.Sprite(tex);
    		syntc.node.center(s, center);
    		return s;
    	},
    },
    createButtonMenu: function(texture, func, target){
        var btn = cc.Sprite.create(texture);
        var btnBig = cc.Sprite.create(texture);
        var btnDown = cc.Sprite.create(texture);
        btnBig.scale = 1.1;
        var btnItem = cc.MenuItemSprite.create(btn, btnBig, btnDown, func, target);
        btn.attr({
            x: btn.width * .5,
            y: btn.height * .5,
            anchorX: .5,
            anchorY: .5
        });
        btnBig.attr({
            x: btn.width * .5,
            y: btn.height * .5,
            anchorX: .5,
            anchorY: .5
        });
        
        btn.tag = 1;
        btnBig.tag = 2;
        btnDown.tag = 3;
        
        return btnItem;
    },
    forhook: function(){
    	cc.warn("method is waiting for hook");
    },
    callNative: function(map){

    	if(window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX) && (typeof map['objc'] !== undef)){
    		var cmap = map['objc'];
    		var args = [];
    		if(typeof cmap['class'] !== undef){
    			args.push(cmap['class']);
    		}else{
    			args.push("NativeCalls");
    		}

    		args.push(cmap['method']);

    		if(typeof cmap['args'] !== undef){
    			args = args.concat(cmap['args']);
    		}

    		//syntc.debug(args);
    		return jsb.reflection.callStaticMethod.apply(
    				jsb.reflection, 
    				args);

    	}else if(window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID && (typeof map['java'] !== 'undefined')){
    		var cmap = map['java'];
    		var args = [];
    		if(typeof cmap['class'] !== undef){
    			args.push(cmap['class']);
    		}else{
    			args.push("org/cocos2dx/javascript/NativeCalls");
    		}

    		args.push(cmap['method']);
    		args.push(cmap['sign']);

    		if(typeof cmap['args'] !== undef){
    			args = args.concat(cmap['args']);
    		}

    		//syntc.debug(args);
    		return jsb.reflection.callStaticMethod.apply(
    				jsb.reflection, 
    				args);
    	}else if((cc.sys.platform == cc.sys.DESKTOP_BROWSER || cc.sys.platform == cc.sys.MOBILE_BROWSER) && (typeof map['web'] !== undef)){
    		var cmap = map['web'];
    		var method = "";
    		if(typeof cmap['class'] !== undef){
    			method = cmap['class'];
    		}else{
    			method = "NativeCalls";
    		}

    		method += "."+cmap['method'];
    		
    		if(typeof eval(method) !== undef){
    			if(typeof cmap['args'] !== undef){
    				return eval(method).apply(window, cmap['args']);
    			}else{
    				return eval(method)();
    			}    			
    		}else{
    			cc.warn("native call -");
    			cc.warn(cmap);
    		}

    	}
    	return null;
    },
    callNativeMethod: function(method, sign, args){
    	var objmethod = method;
    	var javasign = "()V";

    	if(typeof sign !== undef){
    		javasign = "(";
    		for(var i in sign){
    			objmethod += ":";
    			if(sign[i] == 'S'){
    				javasign += "Ljava/lang/String;";
    			}else{
    				javasign += sign[i];
    			}
    		}

    		javasign += ")V";
    	}

    	return this.callNative({
    		'objc': {
    			'method': objmethod,
    			'args': args
    		},
    		'java': {
    			'method': method,
    			'sign': javasign,
    			'args': args
    		},
    		'web': {
    			'method': method,
    			'args': args
    		}
    	});
    },
    trackEvent: function(event){
    	this.callNativeMethod('trackEvent', ['S'], [event]);
    },
    trackLabel: function(event, label){
    	this.callNativeMethod('trackLabel', ['S', 'S'], [event, label]);
    },
    trackNumber: function(event, num){
    	this.callNativeMethod('trackNumber', ['S', 'F'], [event, num]);
    },
    trackLevelStart: function(levelid){
    	this.callNativeMethod('trackLevelStart', ['S'], [levelid]);
    },
    trackLevelFinish: function(levelid){
    	this.callNativeMethod('trackLevelFinish', ['S'], [levelid]);
    },
    trackLevelFailed: function(levelid){
    	this.callNativeMethod('trackLevelFailed', ['S'], [levelid]);
    },
    trackUserLevel: function(level){
    	this.callNativeMethod('trackUserLevel', ['S'], [level]);
    },
    trackPayment: function(cash, coin, source){
    	this.callNativeMethod('trackPayment', ['F', 'F', 'I'], [cash, coin, source]);
    },
    debug : {
    	enable : function(){
    		var mode = cc.game.config[cc.game.CONFIG_KEY.debugMode];
    		return mode != cc.game.DEBUG_MODE_NONE;
    	},
    	infos: {},
    	filters: [],
    	time : function(tag, print){
    		if(this.enable() && this.filters.indexOf(tag)>=0){
    			if(typeof print === undef){
    				print = true;
    			}

    			var newdate = new Date();
    			if(typeof this.infos[tag] !== undef && print){
    				cc.warn("[debug-time:"+tag+"] use "+(newdate.getTime() - this.infos[tag].getTime()));
    			}

    			this.infos[tag] = newdate;
    		}	
    	},
    	log : function(tag, msg) {
    		if(this.enable()){
    			cc.log("["+tag+"] "+msg);
    		}
    	},
    	obj : function(obj){
    		if(cc.sys.platform == cc.sys.DESKTOP_BROWSER){
    			cc.log(obj);
    		}else{
    			var str = '[util.debug] - ';
    			for (var p in obj) {
    				if (obj.hasOwnProperty(p)) {
    					str += p + '::' + obj[p] + '\n';
    				}
    			}
    			cc.log(str);
    		}
    	}
    },
    guid : function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
};