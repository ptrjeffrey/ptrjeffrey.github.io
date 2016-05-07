//*******************
// tool
//******************

var undef = 'undefined';
var tool = {
    node: {
        pos: function (node, posx, posy, ax, ay) {
            if (typeof ax === undef) {
                ax = .5;
            }
            if (typeof ay === undef) {
                ay = .5;
            }
            node.attr({
                x: posx,
                y: posy,
                anchorX: ax,
                anchorY: ay
            });
        },
        posAB: function (nodeA, nodeB, wr, hr, ax, ay) {
            if (typeof ax === undef) {
                ax = .5;
            }
            if (typeof ay === undef) {
                ay = .5;
            }
            this.pos(nodeA, nodeB.width * wr, nodeB.height * hr, ax, ay);
        },
        center: function (a, b) {
            this.posAB(a, b, .5, .5, .5, .5);
        }
    },
    //**************************
    //tool play music and sound
    //**************************
    playingMusic: null,
    enableMusic: true,
    enableSound: true,
    playMusic: function (music) {
        if (music != this.playingMusic) {
            if (cc.audioEngine.isMusicPlaying()) {
                cc.audioEngine.stopMusic();
            }
            this.playingMusic = music;
            this.updateMusic();
        }
    },
    playSound: function (sound) {
        if (this.enableSound) {
            cc.audioEngine.playEffect(sound);
        }
    },
    updateMusic: function () {
        if (this.enableMusic) {
            if (!cc.audioEngine.isMusicPlaying() && this.playingMusic) {
                cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(this.playingMusic, true);
                if (!cc.audioEngine.isMusicPlaying()) {
                    cc.audioEngine.playMusic(this.playingMusic, true);
                }
                if (!cc.audioEngine.isMusicPlaying()) {
                    this.playingMusic = null;
                }
            }
        } else {
            if (cc.audioEngine.isMusicPlaying()) {
                cc.audioEngine.stopMusic();
            }
        }
    },
    //**************************
    //tool--> call native (java ios)
    //**************************
    callNative: function (map) {
        //use eg. tool.callNative({
        //   'java': {
        //        'method': 'initGameData',
        //        'sign': '(Ljava/lang/String;)V',
        //        'args': [str]
        //    }
        // });
        if (window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX) && (typeof map['objc'] !== undef)) {
            var cmap = map['objc'];
            var args = [];
            if (typeof cmap['class'] !== undef) {
                args.push(cmap['class']);
            } else {
                args.push("NativeCalls");
            }

            args.push(cmap['method']);

            if (typeof cmap['args'] !== undef) {
                args = args.concat(cmap['args']);
            }

            //syntc.debug(args);
            return jsb.reflection.callStaticMethod.apply(
                jsb.reflection,
                args);

        } else if (window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID && (typeof map['java'] !== 'undefined')) {
            var cmap = map['java'];
            var args = [];
            if (typeof cmap['class'] !== undef) {
                args.push(cmap['class']);
            } else {
                args.push("com/syntc/cocos371/NativeCalls");
            }

            args.push(cmap['method']);
            args.push(cmap['sign']);

            if (typeof cmap['args'] !== undef) {
                args = args.concat(cmap['args']);
            }

            //syntc.debug(args);
            return jsb.reflection.callStaticMethod.apply(
                jsb.reflection,
                args);
        } else if ((cc.sys.platform == cc.sys.DESKTOP_BROWSER || cc.sys.platform == cc.sys.MOBILE_BROWSER) && (typeof map['web'] !== undef)) {
            var cmap = map['web'];
            var method = "";
            if (typeof cmap['class'] !== undef) {
                method = cmap['class'];
            } else {
                method = "NativeCalls";
            }

            method += "." + cmap['method'];

            if (typeof eval(method) !== undef) {
                if (typeof cmap['args'] !== undef) {
                    return eval(method).apply(window, cmap['args']);
                } else {
                    return eval(method)();
                }
            } else {
                cc.warn("native call -");
                cc.warn(cmap);
            }

        }
        return null;
    },
    //********************
    //particleSystem
    //*******************
    particleSystem:function(filename){
        var particle = new cc.ParticleSystem(filename);
        particle.stopSystem();

        return particle;
    }
};
