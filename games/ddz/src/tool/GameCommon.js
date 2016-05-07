var GC = GC || {};
//颜色常量
GC.color_Black = cc.color(0, 0, 0, 255);    //黑色
GC.color_BG = cc.color(238, 238, 238, 255);  //背景颜色
GC.resolutionSizeType = {
    "L_Android": cc.size(800, 480),
    "P_Android": cc.size(480, 800),
    "L_HTC": cc.size(960, 640),
    "P_HTC": cc.size(640, 960),
    "L_Iphone4": cc.size(960, 640),
    "P_Iphone4": cc.size(640, 960),
    "L_Iphone5": cc.size(1136, 640),
    "P_Iphone5": cc.size(640, 1136),
    "L_HD": cc.size(1280, 720),
    "P_HD": cc.size(720, 1280),
    "L_Ipad12m": cc.size(1024, 768),
    "P_Ipad12m": cc.size(768, 1024),
    "L_Ipad34AirM2": cc.size(2048, 1536),
    "P_Ipad34AirM2": cc.size(1536, 2048),
    "L_TV": cc.size(1920, 1080),
    "P_TV": cc.size(1080, 1920)
};
GC.setResolution = function (width, height, WorH) {
    if (typeof width == "object") {
        if (height)
            WorH = height;
        if (!width.height || !width.width)
            width = cc.size(1136, 640);
        height = width.height;
        width = width.width;
    }
    if (width && height && WorH) {
        if (WorH)
            if (WorH == "W")
                cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.FIXED_WIDTH);
            else if (WorH == "H")
                cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.FIXED_HEIGHT);
            else
                cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.SHOW_ALL);
    } else {
        var winSize = cc.size(width, height);
        var s = cc.view.getFrameSize();
        var widthRate = s.width / winSize.width;
        var heightRate = s.height / winSize.height;
        if (!cc.sys.isNative) {
            //cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.NO_BORDER);
            //cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.FIXED_WIDTH);

        } else if (widthRate > heightRate) {
            //cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.FIXED_WIDTH);
            cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.NO_BORDER);

        }
        else {
            //cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.FIXED_HEIGHT);
            cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.NO_BORDER);
        }
    }
    GC.setSize();
};
GC.setSize = function (winsize) {
    if (!winsize)
        winsize = cc.winSize;
    GC.winSize = winsize;
    GC.h = winsize.height;
    GC.w = winsize.width;
    GC.w_2 = GC.w / 2;
    GC.h_2 = GC.h / 2;
    GC.z = cc.p(GC.w_2, GC.h_2);
    if (GC.w > GC.h)
        GC.isLandscape = true;
    else
        GC.isLandscape = false;
};
GC.isLandscape = true;            //是否是横屏
//常用坐标
GC.winSize = cc.size(1136, 640);

GC.h = GC.winSize.height;

GC.w = GC.winSize.width;

GC.w_2 = GC.winSize.width / 2;

GC.h_2 = GC.winSize.height / 2;

GC.z = cc.p(GC.w_2, GC.h_2);

GC.FPS = 60;

GC.wayLength = 1500;              //计算move的移动路程的参数

//设置A节点在b节点宽度的wr,hr倍上
GC.setPinP = function (a, b, wr, hr, ax, ay) {
    if (!ax) {
        ax = .5;
    }

    if (!ay) {
        ay = .5;
    }

    this.pos(a, b.width * wr, b.height * hr, ax, ay);
};

//给节点设置坐标
GC.setPosition = function (a, x, y, ax, ay) {
    if (ax) {
        a.anchorX = ax;
    }

    if (ax) {
        a.anchorY = ay;
    }
    a.attr({
        x: x,
        y: y
    });
};


//这个方法一般是不需要使用的,当场景缩放以后2级子节点的坐标会产生多倍的缩放,所以要进行调整
//GC.getGamePoint = function (target, p) {
//    if (!p)
//        p = target.getPosition();
//    var pp = target.convertToWorldSpace(p);
//    var gamep = data_gameScene.getInstance()._gameScene.getPosition();
//    var scale = data_gameScene.getInstance()._gameScene.getParent().getScale();
//    pp = cc.pMult(pp, 1 / scale);
//    pp = cc.pSub(pp, gamep);
//    return pp;
//};

//返回当前节点是否已被删除(与cocos相关),3.6版本以上才支持
GC.isCCHave = function (target) {
    if (GC.isEmpty(target))
        return false;
    return cc.sys.isObjectValid(target);
};

//这个方法会先判断传入类的父节点引用是否存在,如果不存在则获取父类并赋值上去
GC.getParentifnull = function (target) {
    if (!target._parent)
        target._parent = target.getParent();
    if (!target._parent) {
        return null;
    }
    return target._parent;
};

//获取目标的原大小的中心距离
GC.getTargetZP = function (target) {
    var x = target.getContentSize().width / 2;
    var y = target.getContentSize().height / 2;
    return cc.p(x, y);
};
//所有子类执行某个方法这个方法会把每个子类传进去
GC.childDoAction = function (target, callfunc) {
    var chids = target.getChildren();
    for (var t = 0; t < chids.length; t++) {
        GC.childDoAction(chids[t], callfunc);
        callfunc(chids[t]);
    }
};
GC.getBoundingSize = function (node) {
    try {
        var rect = node.getBoundingBox();
        return cc.size(rect.width, rect.height);
    }
    catch (e) {
        return cc.size(0, 0);
    }
};
//以后这些动作都必须要有单独的tag作为标记
//一直像果冻一样的抖动
GC.spriteCguodong = function (target) {
    target.runAction(cc.RepeatForever.create(
        cc.Sequence.create(
            cc.ScaleTo.create(.3, .95, 1.05),
            cc.ScaleTo.create(.3, 1., 1.)
        )
    ));
};
//每个眼睛有个ID
GC.spriteCzhayan = function (target) {
    target.blinkEyeOpen = function () {
        target.setSpriteFrame("zhayan_eye_" + target.eyeID + "O.png");
    };
    target.blinkEyeClose = function () {
        target.setSpriteFrame("zhayan_eye_" + target.eyeID + "C.png");
    };
    target.runAction(cc.RepeatForever.create(
        cc.Sequence.create(
            cc.DelayTime.create(1.5),
            cc.CallFunc.create(target.blinkEyeClose, target),
            cc.DelayTime.create(.05),
            cc.CallFunc.create(target.blinkEyeOpen, target)
        )
    ));
};
//一直跳动,固定移动动作
GC.spriteCtiaodong = function (target) {
    var mscale = target.getScale();
    target.runAction(cc.RepeatForever.create(
        cc.Sequence.create(cc.DelayTime.create(2.),
            cc.ScaleTo.create(.1, mscale, .8 * mscale),
            cc.ScaleTo.create(.1, mscale, 1.1 * mscale),
            cc.MoveBy.create(.1, cc.p(0, 30)),
            cc.MoveBy.create(.1, cc.p(0, -30)),
            cc.ScaleTo.create(.1, mscale, .9 * mscale),
            cc.ScaleTo.create(.1, mscale, 1.1 * mscale),
            cc.ScaleTo.create(.1, mscale, mscale)
        )));
};
//渐隐渐现,常用于开始按钮
GC.fadeInOut = function (target) {
    target.setOpacity(0);
    var fadeIn = cc.fadeIn(.3);
    var delay = cc.delayTime(.3);
    var fadeOut = cc.fadeOut(.3);
    var action1 = cc.repeatForever(cc.sequence(fadeIn, delay, fadeOut));
    target.runAction(action1);
};

GC.addSpriteFrameForOne = function (filename) {
    var teture = cc.textureCache.addImage(filename);
    cc.spriteFrameCache.addSpriteFrame(new cc.SpriteFrame(filename, cc.rect(0, 0, teture.width, teture.height)), filename);
};

GC.saveStorage = function (stageObj) {
    /*var ss1 = {};
     ss1.id = 0;
     ss1.best = 0;
     ss1.times = 0;
     ss1.state = 1;*/
    var ll = cc.sys.localStorage;


    var jsonStr = JSON.stringify(stageObj);
    cc.log("[存储对象字符串] [key:" + stageObj.id + "] [字符串:" + jsonStr + "]");
    ll.setItem(stageObj.id, jsonStr);

    /*var getStage1 = ll.getItem(KEY_STAGE_1);
     var jsonObj = JSON.parse(getStage1);
     cc.log("关卡1的状态:"+jsonObj.state);*/

};

GC.loadStorage = function (stageId) {
    var ll = cc.sys.localStorage;
    var stageStr = ll.getItem(stageId);
    if (stageStr != null && stageStr != "") {
        cc.log("[加载以存字符串] [key:" + stageId + "] [字符串:" + stageStr + "]");
        return JSON.parse(stageStr);
    }
    return null;
};

GC.removeStorage = function (stageId) {
    var ll = cc.sys.localStorage;
    ll.removeItem(stageId);
    cc.log("[删除以存字符串] [key:" + stageId + "]");
};
//length可以是负
GC.getCCMoveTime = function (length, speed) {
    return Math.abs(length) / speed / GC.FPS;
};

GC.getCCMoveby = function (length, speed, cp) {
    return cc.moveBy(GC.getCCMoveTime(length, speed), cp);
};