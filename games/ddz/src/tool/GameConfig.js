var GC = GC || {};

GC.pi = 3.1415926;
GC.maxInt = 0x0FFFFFFF;
GC.XYNUM = 1000;                      //xy坐标组合成一个int的向量,x*1000+y;
GC.xyToInt = function (x, y) {
    return x * 1000 + y;
};
GC.getXFormInt = function (xy) {
    return ~~(xy / 1000);
};
GC.getYFormInt = function (xy) {
    return xy % 1000;
};
//打印grid
GC.logGrid = function (grid, keys, date) {
    date = date || new Date();
    console.log(date.toLocaleString() + " " + date.getMilliseconds() + " ##########################################################");
    var cx = grid.length;
    var cy = grid[0].length;
    var str = "";
    for (var i = cy - 1; i >= 0; i--) {
        str += "y:" + (i < 10 ? ("0" + i) : i) + " (";
        for (var i2 = 0; i2 < cx; i2++) {
            var c = grid[i2][i];
            str += "";
            for (var i3 = 0; i3 < keys.length; i3++) {
                str += c[keys[i3]] + " "
            }
            if (keys.length <= 0) {
                str += c + " "
            }
            str += "";
        }
        str += ")";
        str += "\n";
    }
    console.log(str);
};
//对一个数随机正负
GC.getRandomZF = function (num) {
    var r = Math.random();
    if (r < 0.5)
        return -num;
    return num;
};

GC.getJsonLength = function (json) {
    var len = 0;
    for (var j in json) {
        len++;
    }
    return len;
};

//keyAndValue
GC.kav = function (ke, va) {
    return {key: ke, value: va};
};
//firstAndSecond
GC.fas = function (fi, se) {
    return {first: fi, second: se};
};
//1是否包含2
GC.objContent = function (f1, f2) {
    if (!f1 || !f2)
        return false;
    for (var key in f1) {
        if (GC.isEmpty(f2[key]))
            return false;
        if (f1[key] != f2[key])
            return false;
    }
    return true;
};
//让这个对象的数字都*num
GC.allMult = function (o, num) {
    for (var key in o) {
        if (typeof o[key] == "number") {
            o[key] *= num;
        }
    }
    return o;
};
//在数组中找到元素并返回索引值
GC.getIndexByArr = function (arr, value) {
    if (arr.constructor == Array) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return i;
            }
        }
    }
    return -1;
};
GC.arrConcat = function (arrTo, arrFrom) {
    for (var i = 0; i < arrFrom.length; i++) {
        arrTo.push(arrFrom[i]);
    }
};
//删除数组中的某个对象
GC.deleteByArr = function (arr, value) {
    var index = GC.getIndexByArr(arr, value);
    if (index == -1)
        return false;
    arr.splice(index, 1);
    return true;
};
//get,set
GC.dpGS = function (obj, key, getFunc, setFunc) {
    if (!obj || !key)
        return false;
    if (!getFunc)
        getFunc = function () {
            return this["_" + key];
        }.bind(obj)
    if (!setFunc)
        setFunc = function (v) {
            this["_" + key] = v;
        }.bind(obj)
    Object.defineProperty(obj, key, {get: getFunc, set: setFunc, enumerable: true, configurable: true});
    return true;
};
GC.angleTo4or8 = function (angle, is4) {
    angle = GC.angleTo360(angle);
    if (is4) {
        angle += 90 / 2;
        angle = GC.angleTo360(angle);
        return parseInt((angle) / 90) * 90;
    } else {
        angle += 45 / 2;
        angle = GC.angleTo360(angle);
        return parseInt((angle) / 45) * 45;
    }
};
//判断线段AB是否与线段CD相交 
GC.sideIntersectSide = function (A, B, C, D) {
    if (!GC.lineIntersectSide(A, B, C, D))
        return false;
    if (!GC.lineIntersectSide(C, D, A, B))
        return false;

    return true;
};
//判断直线AB是否与线段CD相交 ,附属于上面的方法,直接调用上面的方法即可
GC.lineIntersectSide = function (A, B, C, D) {
    // A(x1, y1), B(x2, y2)的直线方程为：
    // f(x, y) =  (y - y1) * (x1 - x2) - (x - x1) * (y1 - y2) = 0

    var fC = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    var fD = (D.y - A.y) * (A.x - B.x) - (D.x - A.x) * (A.y - B.y);

    if (fC * fD > 0)
        return false;

    return true;
};

//判断线段是否与矩形相交
GC.IsLineIntersectRect = function (ptStart, ptEnd, rect) {
    if (cc.rectContainsPoint(rect, ptStart) || cc.rectContainsPoint(rect, ptEnd))
        return true;

    rect.left = rect.x;
    rect.right = rect.x + rect.width;
    rect.bottom = rect.y;
    rect.top = rect.y + rect.height;

    if (GC.sideIntersectSide(ptStart, ptEnd, cc.p(rect.left, rect.top), cc.p(rect.left, rect.bottom)))
        return true;
    if (GC.sideIntersectSide(ptStart, ptEnd, cc.p(rect.left, rect.bottom), cc.p(rect.right, rect.bottom)))
        return true;
    if (GC.sideIntersectSide(ptStart, ptEnd, cc.p(rect.right, rect.bottom), cc.p(rect.right, rect.top)))
        return true;
    if (GC.sideIntersectSide(ptStart, ptEnd, cc.p(rect.left, rect.top), cc.p(rect.right, rect.top)))
        return true;

    return false;
};

//判断c是否在ab之间,如果不传入b则默认为正负ab之间
GC.isBetween = function (c, a, b) {
    if (!b)
        b = -a;
    if (b < a) {
        var d = a;
        a = b;
        b = d;
    }
    if (c > a && c < b)
        return true;
    else
        return false;
}
//判断c是否在ab之间,如果不传入b则默认为正负ab之间,等于也算在内
GC.isBetweenD = function (c, a, b) {
    if (!b)
        b = -a;
    if (b < a) {
        var d = a;
        a = b;
        b = d;
    }
    if (c >= a && c <= b)
        return true;
    else
        return false;
}

GC.angleToRadian = function (angle) {
    return angle * 2 * GC.pi / 360;
};
//计算角度对应的x,y的系数,不求精确值的话不使用,使用GC.mathAngles
GC.mathAngle = function (angle) {
    if (angle < 0) {
        if (angle <= -360) {
            angle = angle % 360;
        }
        angle = 360 - (-angle);
    }
    else if (angle > 0) {
        if (angle >= 360) {
            angle = angle % 360;
        }
    }
    var Cxiangxian = angle / 90;
    if (angle >= 90) {
        angle = angle % 90;
    }
    var x = Math.sin(GC.pi / 180 * angle);
    var y = Math.sin(GC.pi / 180 * (90 - angle));
    var Clinshi = 0;
    switch (parseInt(Cxiangxian)) {
        case 0:
            x = x;
            y = y;
            break;
        case 1:
            Clinshi = y;
            y = -x;
            x = Clinshi;
            break;
        case 2:
            x = -x;
            y = -y;
            break;
        case 3:
            Clinshi = -y;
            y = x;
            x = Clinshi;
            break;
        default:
            break;
    }
    return ({first: x, second: y});
};

//把数字转换为正
GC.toZheng = function (int) {
    if (int >= 0)
        return int;
    else
        return -int;
};
//坐标旋转一定角度后的值,第三个参数是原点,默认为0,0,注意angle一定要是0-360整形
GC.pointRotationByAngle = function (point, angle, pointyuan) {
    var p = cc.p(0, 0);
    if (!pointyuan) {
        p.x = point.x * GC.cos[angle] - point.y * GC.sin[angle];
        p.y = point.x * GC.sin[angle] + point.y * GC.cos[angle];
    }
    p.x = (point.x - pointyuan.x) * GC.cos[angle] - (point.y - pointyuan.y) * GC.sin[angle] + pointyuan.x;
    p.y = (point.x - pointyuan.x) * GC.sin[angle] + (point.y - pointyuan.y) * GC.cos[angle] + pointyuan.y;
    return p;
};

//目标1为原点,目标2到目标1的线段的角度,y+为原点
GC.angleTargetWithTarget = function (target, target2) {
//    var angel = GC.getRad(cc.p(target.x, target.y), cc.p(target2.x, target2.y));
//    angel = 180 - angel;
//    angel = GC.angleTo360(angel);
    var angle = Math.atan2((target.y - target2.y ), (target.x - target2.x)) * (180 / Math.PI);
    angle = GC.angleTo360(angle);
    return (90 - angle);
}
//此方法一般不使用,使用上面的方法
//获取两点线与X轴的角度,x正方向为0度,x上方为正,下方为负
GC.getRad = function (pos1, pos2) {
    var px1 = pos1.x;
    var py1 = pos1.y;
    var px2 = pos2.x;
    var py2 = pos2.y;

    //得到两点x的距离
    var x = px2 - px1;
    //得到两点y的距离
    var y = py1 - py2;
    //算出斜边长度
    var xie = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    //得到这个角度的余弦值(通过三角函数中的定理：角度余弦值=斜边/斜边)
    var cosAngle = x / xie;
    //通过反余弦定理获取到期角度的弧度
    var rad = Math.acos(cosAngle);
    //注意：当触屏的位置Y坐标<摇杆的Y坐标，我们要去反值-0~-180
    if (py2 < py1) {
        rad = -rad;
    }
    rad = rad * 180 / GC.pi + 90;
    return rad;
};
/*把半径和角度转换为坐标*/
GC.getAngelePosition = function (r, angle) {
    angle = GC.toAngle(angle);
    var xy = GC.mathAngle(angle);
    var x = r * xy.first;
    var y = r * xy.second;
    return cc.p(x, y);
};
//将弧度转换为角度
GC.toAngle = function (Rad) {
    var angle = Rad * 180 / GC.pi;
    if (angle > 0) {
        angle = 90 - angle;
    }
    else if (angle < 0) {
        angle = 90 - angle;
    }
    return angle;
};
//传入的角度是以X为0,向下为负,向上为正
GC.angleToMy = function (angle) {
    if (angle > 0) {
        angle = 90 - angle;
    }
    else if (angle < 0) {

        angle = 90 - angle;
    }
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}
//把角度转换成0-360度
GC.angleTo360 = function (angle) {
    if (angle < 0) {
        if (angle <= -360) {
            angle = angle % 360;
        }
        angle = 360 - (-angle);
    }
    else if (angle > 0) {
        if (angle >= 360) {
            angle = angle % 360;
        }
    }
    return angle;
};

//根据速度和距离计算移动所需时间,这里已0.1秒为刷新为单位
GC.timeMath = function (r, speed) {
    return r / speed / 10;
};

//把第一个参数的内容拷贝到第二个参数中
GC.copy = function (p, c) {
    var c = c || {};
    for (var i in p) {
        c[i] = p[i];
    }
    return c;
};
//第二个参数增加在第一个中没有的参数
GC.copyAdd = function (p, c) {
    var c = c || {};
    for (var i in p) {
        if (!c[i])
            c[i] = p[i];
    }
    return c;
};
GC.copyNoNull = function (p, c) {
    var c = c || {};
    for (var i in p) {
        if (GC.isEmpty(p[i]))
            continue;
        c[i] = p[i];
    }
    return c;
};
//深拷贝
GC.copyX = function (p, c) {
    var c = c || {};
    for (var i in p) {
        if (GC.isEmpty(p[i]))
            continue;
        if (typeof p[i] === 'object') {
            c[i] = (p[i].constructor === Array) ? [] : {};
            GC.copyX(p[i], c[i]);
        }
        else {
            c[i] = p[i];
        }
    }
    return c;
};

//判断是否为空
GC.isEmpty = function (value) {
    if (value === null || value === undefined) {
        return true;
    }

    return false;
};
//加强版
GC.isEmptyAD = function (value) {
    if (value === null || value === undefined || value == "" || (value.constructor == Array && value.length <= 0)) {
        return true;
    }
    return false;
};
//终极加强版
GC.isEmptyADD = function (value) {
    if (value === 0 || value === false || value === null || value === undefined || value == "" || (value.constructor == Array && value.length <= 0)) {
        return true;
    }
    return false;
};
GC.isNull = function (value) {
    if (value === null) {
        return true;
    }
    return false;
};
GC.isUndefined = function (value) {
    if (value === undefined) {
        return true;
    }
    return false;
};


// 两数相除取整
GC.div = function (exp1, exp2) {
    var n1 = Math.round(exp1); //四舍五入
    var n2 = Math.round(exp2); //四舍五入

    var rslt = n1 / n2; //除

    if (rslt >= 0) {
        rslt = Math.floor(rslt); //返回值为小于等于其数值参数的最大整数值。
    }
    else {
        rslt = Math.ceil(rslt); //返回值为大于等于其数字参数的最小整数。
    }

    return rslt;
};


//两数的最大最小值
GC.getMin = function (x, y) {
    return (x < y ? x : y);
};
GC.getMax = function (x, y) {
    return (x > y ? x : y);
};


//两数之间的随机值
GC.getRandom = function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
};

//计算两个矩形相交的中心点
GC.getCenterPoint = function (r1, r2) {
    r1.x = Math.round(r1.x);
    r1.y = Math.round(r1.y);
    r2.x = Math.round(r2.x);
    r2.y = Math.round(r2.y);
    var x = null;
    var y = null;
    // 计算交点的X坐标
    if (r1.x <= r2.x) {
        if ((r1.x + r1.width) < (r2.x + r2.width)) {
            x = (r1.x + r2.x + r1.width) / 2;
        }
        else {
            x = r2.x + r2.width / 2;
        }
    }
    else {
        if ((r1.x + r1.width) > (r2.x + r2.width)) {
            x = (r1.x + r2.x + r2.width) / 2;
        }
        else {
            x = r1.x + r1.width / 2;
        }
    }

    // 计算交点的Y坐标
    if (r2.y <= r1.y) {
        if ((r2.y + r2.height) < (r1.y + r1.height)) {
            y = (r1.y + r2.y + r2.height) / 2;
        }
        else {
            y = r1.y + r1.height / 2;
        }
    }
    else {
        if ((r2.y + r2.height) > (r1.y + r1.height)) {
            y = (r1.y + r2.y + r1.height) / 2;
        }
        else {
            y = r2.y + r2.height / 2;
        }
    }
    if (x == null || y == null) {
        return null;
    }
    else {
        return cc.p(x, y);
    }
};

GC.toUnicode = function (strUtf8) {
    if (!strUtf8) {
        return;
    }
    var bstr = "";
    var nTotalChars = strUtf8.length; // total chars to be processed.
    var nOffset = 0; // processing point on strUtf8
    var nRemainingBytes = nTotalChars; // how many bytes left to be converted
    var nOutputPosition = 0;
    var iCode, iCode1, iCode2; // the value of the unicode.
    while (nOffset < nTotalChars) {
        iCode = strUtf8.charCodeAt(nOffset);
        if ((iCode & 0x80) == 0) // 1 byte.
        {
            if (nRemainingBytes < 1) // not enough data
                break;
            bstr += String.fromCharCode(iCode & 0x7F);
            nOffset++;
            nRemainingBytes -= 1;
        }
        else if ((iCode & 0xE0) == 0xC0) // 2 bytes
        {
            iCode1 = strUtf8.charCodeAt(nOffset + 1);
            if (nRemainingBytes < 2 || // not enough data
                (iCode1 & 0xC0) != 0x80) // invalid pattern
            {
                break;
            }
            bstr += String.fromCharCode(((iCode & 0x3F) << 6) | (iCode1 & 0x3F));
            nOffset += 2;
            nRemainingBytes -= 2;
        }
        else if ((iCode & 0xF0) == 0xE0) // 3 bytes
        {
            iCode1 = strUtf8.charCodeAt(nOffset + 1);
            iCode2 = strUtf8.charCodeAt(nOffset + 2);
            if (nRemainingBytes < 3 || // not enough data
                (iCode1 & 0xC0) != 0x80 || // invalid pattern
                (iCode2 & 0xC0) != 0x80) {
                break;
            }
            bstr += String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
            nOffset += 3;
            nRemainingBytes -= 3;
        }
        else                  // 4 or more bytes -- unsupported
            break;
    }
    if (nRemainingBytes != 0) { // bad UTF8 string.
        return "";
    }
    return bstr;
};

//jsondump - a simple javascript function to dump a json object
//var foo = {a: 1, b: "test", c: {d: true}};
//jsondump(foo);
GC.jsondump = function (arr, level) {
    var dumped_text = "";
    if (!level) level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";

    if (typeof(arr) == 'object') { //Array/Hashes/Objects
        for (var item in arr) {
            var value = arr[item];

            if (typeof(value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += GC.jsondump(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    }
    return dumped_text;
};

// * 去掉字符串前后的空格
//* @param str 入参:要去掉空格的字符串
GC.trimAll = function (str) {
    return str.replace(/(^s*)|(s*$)/g, '');

};
// 去掉字符串前的空格
GC.trimLeft = function (str) {
    return str.replace(/^s*/g, '');

};
//去掉字符串后的空格
GC.trimRight = function (str) {
    return str.replace(/s*$/, '');
}


// * 忽略大小写判断字符串是否相同

GC.isEqualsIgnorecase = function (str1, str2) {
    if (str1.toUpperCase() == str2.toUpperCase()) {
        return true;
    }
    return false;
}


// * 判断是否是数字
GC.isNum = function (value) {
    if (value != null && value.length > 0 && isNaN(value) == false) {
        return true;
    }
    else {
        return false;
    }

}

// * 判断是否是中文
GC.isChine = function (str) {
    var reg = /^([u4E00-u9FA5]|[uFE30-uFFA0])*$/;
    if (reg.test(str)) {
        return false;
    }
    return true;
};

GC.Class = function () {
};

GC.Class.extend = function (props) {
    var _super = this.prototype;

    // Instantiate a base Class (but only create the instance,
    // don't run the init constructor)
    var prototype = Object.create(_super);

    var classId = ClassManager.getNewID();
    ClassManager[classId] = _super;
    // Copy the properties over onto the new prototype. We make function
    // properties non-eumerable as this makes typeof === 'function' check
    // unneccessary in the for...in loop used 1) for generating Class()
    // 2) for cc.clone and perhaps more. It is also required to make
    // these function properties cacheable in Carakan.
    var desc = {writable: true, enumerable: false, configurable: true};

    prototype.__instanceId = null;

    // The dummy Class constructor
    function Class() {
        this.__instanceId = ClassManager.getNewInstanceId();
        // All construction is actually done in the init method
        if (this.ctor)
            this.ctor.apply(this, arguments);
    }

    Class.id = classId;
    // desc = { writable: true, enumerable: false, configurable: true,
    //          value: XXX }; Again, we make this non-enumerable.
    desc.value = classId;
    Object.defineProperty(prototype, '__pid', desc);

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    desc.value = Class;
    Object.defineProperty(Class.prototype, 'constructor', desc);

    // Copy getter/setter
    this.__getters__ && (Class.__getters__ = cc.clone(this.__getters__));
    this.__setters__ && (Class.__setters__ = cc.clone(this.__setters__));

    for (var idx = 0, li = arguments.length; idx < li; ++idx) {
        var prop = arguments[idx];
        for (var name in prop) {
            var isFunc = (typeof prop[name] === "function");
            var override = (typeof _super[name] === "function");
            var hasSuperCall = fnTest.test(prop[name]);

            if (releaseMode && isFunc && override && hasSuperCall) {
                desc.value = ClassManager.compileSuper(prop[name], name, classId);
                Object.defineProperty(prototype, name, desc);
            } else if (isFunc && override && hasSuperCall) {
                desc.value = (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-Class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]);
                Object.defineProperty(prototype, name, desc);
            } else if (isFunc) {
                desc.value = prop[name];
                Object.defineProperty(prototype, name, desc);
            } else {
                prototype[name] = prop[name];
            }

            if (isFunc) {
                // Override registered getter/setter
                var getter, setter, propertyName;
                if (this.__getters__ && this.__getters__[name]) {
                    propertyName = this.__getters__[name];
                    for (var i in this.__setters__) {
                        if (this.__setters__[i] === propertyName) {
                            setter = i;
                            break;
                        }
                    }
                    cc.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
                }
                if (this.__setters__ && this.__setters__[name]) {
                    propertyName = this.__setters__[name];
                    for (var i in this.__getters__) {
                        if (this.__getters__[i] === propertyName) {
                            getter = i;
                            break;
                        }
                    }
                    cc.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
                }
            }
        }
    }

    // And make this Class extendable
    Class.extend = cc.Class.extend;

    //add implementation method
    Class.implement = function (prop) {
        for (var name in prop) {
            prototype[name] = prop[name];
        }
    };
    return Class;
};


GC.mathAngles = [
    {first: 0, second: 0.999},
    {first: 0.017, second: 0.999},
    {first: 0.034, second: 0.999},
    {
        first: 0.052, second: 0.998
    },
    {first: 0.069, second: 0.997},
    {first: 0.087, second: 0.996},
    {first: 0.104, second: 0.994},
    {first: 0.121, second: 0.992},
    {first: 0.139, second: 0.99},
    {first: 0.156, second: 0.987},
    {first: 0.173, second: 0.984},
    {first: 0.19, second: 0.981},
    {
        first: 0.207,
        second: 0.978
    },
    {first: 0.224, second: 0.974},
    {
        first: 0.241,
        second: 0.97
    },
    {first: 0.258, second: 0.965},
    {first: 0.275, second: 0.961},
    {first: 0.292, second: 0.956},
    {
        first: 0.309, second: 0.951
    },
    {first: 0.325, second: 0.945},
    {first: 0.342, second: 0.939},
    {first: 0.358, second: 0.933},
    {first: 0.374, second: 0.927},
    {first: 0.39, second: 0.92},
    {first: 0.406, second: 0.913},
    {first: 0.422, second: 0.906},
    {first: 0.438, second: 0.898},
    {
        first: 0.453,
        second: 0.891
    },
    {first: 0.469, second: 0.882},
    {
        first: 0.484,
        second: 0.874
    },
    {first: 0.499, second: 0.866},
    {
        first: 0.515,
        second: 0.857
    },
    {first: 0.529, second: 0.848},
    {
        first: 0.544,
        second: 0.838
    },
    {first: 0.559, second: 0.829},
    {
        first: 0.573,
        second: 0.819
    },
    {first: 0.587, second: 0.809},
    {
        first: 0.601,
        second: 0.798
    },
    {first: 0.615, second: 0.788},
    {
        first: 0.629,
        second: 0.777
    },
    {first: 0.642, second: 0.766},
    {
        first: 0.656,
        second: 0.754
    },
    {first: 0.669, second: 0.743},
    {
        first: 0.681,
        second: 0.731
    },
    {first: 0.694, second: 0.719},
    {
        first: 0.707,
        second: 0.707
    },
    {first: 0.719, second: 0.694},
    {
        first: 0.731,
        second: 0.681
    },
    {first: 0.743, second: 0.669},
    {
        first: 0.754,
        second: 0.656
    },
    {first: 0.766, second: 0.642},
    {
        first: 0.777,
        second: 0.629
    },
    {first: 0.788, second: 0.615},
    {
        first: 0.798,
        second: 0.601
    },
    {first: 0.809, second: 0.587},
    {
        first: 0.819,
        second: 0.573
    },
    {first: 0.829, second: 0.559},
    {
        first: 0.838,
        second: 0.544
    },
    {first: 0.848, second: 0.529},
    {
        first: 0.857,
        second: 0.515
    },
    {first: 0.866, second: 0.499},
    {
        first: 0.874,
        second: 0.484
    },
    {first: 0.882, second: 0.469},
    {
        first: 0.891,
        second: 0.453
    },
    {first: 0.898, second: 0.438},
    {
        first: 0.906,
        second: 0.422
    },
    {first: 0.913, second: 0.406},
    {first: 0.92, second: 0.39},
    {first: 0.927, second: 0.374},
    {
        first: 0.933, second: 0.358
    },
    {first: 0.939, second: 0.342},
    {first: 0.945, second: 0.325},
    {first: 0.951, second: 0.309},
    {first: 0.956, second: 0.292},
    {first: 0.961, second: 0.275},
    {first: 0.965, second: 0.258},
    {first: 0.97, second: 0.241},
    {first: 0.974, second: 0.224},
    {first: 0.978, second: 0.207},
    {first: 0.981, second: 0.19},
    {
        first: 0.984,
        second: 0.173
    },
    {first: 0.987, second: 0.156},
    {first: 0.99, second: 0.139},
    {first: 0.992, second: 0.121},
    {
        first: 0.994, second: 0.104
    },
    {first: 0.996, second: 0.087},
    {first: 0.997, second: 0.069},
    {first: 0.998, second: 0.052},
    {first: 0.999, second: 0.034},
    {first: 0.999, second: 0.017},
    {first: 0.999, second: 0},
    {first: 0.999, second: -0.017},
    {first: 0.999, second: -0.034},
    {first: 0.998, second: -0.052},
    {first: 0.997, second: -0.069},
    {first: 0.996, second: -0.087},
    {first: 0.994, second: -0.104},
    {first: 0.992, second: -0.121},
    {first: 0.99, second: -0.139},
    {first: 0.987, second: -0.156},
    {first: 0.984, second: -0.173},
    {first: 0.981, second: -0.19},
    {first: 0.978, second: -0.207},
    {first: 0.974, second: -0.224},
    {first: 0.97, second: -0.241},
    {first: 0.965, second: -0.258},
    {first: 0.961, second: -0.275},
    {first: 0.956, second: -0.292},
    {first: 0.951, second: -0.309},
    {first: 0.945, second: -0.325},
    {first: 0.939, second: -0.342},
    {first: 0.933, second: -0.358},
    {first: 0.927, second: -0.374},
    {first: 0.92, second: -0.39},
    {first: 0.913, second: -0.406},
    {
        first: 0.906,
        second: -0.422
    },
    {first: 0.898, second: -0.438},
    {
        first: 0.891,
        second: -0.453
    },
    {first: 0.882, second: -0.469},
    {
        first: 0.874,
        second: -0.484
    },
    {first: 0.866, second: -0.499},
    {
        first: 0.857,
        second: -0.515
    },
    {first: 0.848, second: -0.529},
    {
        first: 0.838,
        second: -0.544
    },
    {first: 0.829, second: -0.559},
    {
        first: 0.819,
        second: -0.573
    },
    {first: 0.809, second: -0.587},
    {
        first: 0.798,
        second: -0.601
    },
    {first: 0.788, second: -0.615},
    {
        first: 0.777,
        second: -0.629
    },
    {first: 0.766, second: -0.642},
    {
        first: 0.754,
        second: -0.656
    },
    {first: 0.743, second: -0.669},
    {
        first: 0.731,
        second: -0.681
    },
    {first: 0.719, second: -0.694},
    {
        first: 0.707,
        second: -0.707
    },
    {first: 0.694, second: -0.719},
    {
        first: 0.681,
        second: -0.731
    },
    {first: 0.669, second: -0.743},
    {
        first: 0.656,
        second: -0.754
    },
    {first: 0.642, second: -0.766},
    {
        first: 0.629,
        second: -0.777
    },
    {first: 0.615, second: -0.788},
    {
        first: 0.601,
        second: -0.798
    },
    {first: 0.587, second: -0.809},
    {
        first: 0.573,
        second: -0.819
    },
    {first: 0.559, second: -0.829},
    {
        first: 0.544,
        second: -0.838
    },
    {first: 0.529, second: -0.848},
    {
        first: 0.515,
        second: -0.857
    },
    {first: 0.499, second: -0.866},
    {
        first: 0.484,
        second: -0.874
    },
    {first: 0.469, second: -0.882},
    {
        first: 0.453,
        second: -0.891
    },
    {first: 0.438, second: -0.898},
    {
        first: 0.422,
        second: -0.906
    },
    {first: 0.406, second: -0.913},
    {
        first: 0.39,
        second: -0.92
    },
    {first: 0.374, second: -0.927},
    {
        first: 0.358,
        second: -0.933
    },
    {first: 0.342, second: -0.939},
    {
        first: 0.325,
        second: -0.945
    },
    {first: 0.309, second: -0.951},
    {
        first: 0.292,
        second: -0.956
    },
    {first: 0.275, second: -0.961},
    {
        first: 0.258,
        second: -0.965
    },
    {first: 0.241, second: -0.97},
    {
        first: 0.224,
        second: -0.974
    },
    {first: 0.207, second: -0.978},
    {
        first: 0.19,
        second: -0.981
    },
    {first: 0.173, second: -0.984},
    {
        first: 0.156,
        second: -0.987
    },
    {first: 0.139, second: -0.99},
    {
        first: 0.121,
        second: -0.992
    },
    {first: 0.104, second: -0.994},
    {
        first: 0.087,
        second: -0.996
    },
    {first: 0.069, second: -0.997},
    {
        first: 0.052,
        second: -0.998
    },
    {first: 0.034, second: -0.999},
    {
        first: 0.017,
        second: -0.999
    },
    {first: 0, second: -0.999},
    {first: -0.017, second: -0.999},
    {first: -0.034, second: -0.999},
    {first: -0.052, second: -0.998},
    {first: -0.069, second: -0.997},
    {first: -0.087, second: -0.996},
    {first: -0.104, second: -0.994},
    {first: -0.121, second: -0.992},
    {first: -0.139, second: -0.99},
    {first: -0.156, second: -0.987},
    {first: -0.173, second: -0.984},
    {first: -0.19, second: -0.981},
    {first: -0.207, second: -0.978},
    {first: -0.224, second: -0.974},
    {first: -0.241, second: -0.97},
    {first: -0.258, second: -0.965},
    {first: -0.275, second: -0.961},
    {first: -0.292, second: -0.956},
    {first: -0.309, second: -0.951},
    {first: -0.325, second: -0.945},
    {first: -0.342, second: -0.939},
    {first: -0.358, second: -0.933},
    {first: -0.374, second: -0.927},
    {first: -0.39, second: -0.92},
    {first: -0.406, second: -0.913},
    {first: -0.422, second: -0.906},
    {first: -0.438, second: -0.898},
    {first: -0.453, second: -0.891},
    {first: -0.469, second: -0.882},
    {first: -0.484, second: -0.874},
    {first: -0.499, second: -0.866},
    {first: -0.515, second: -0.857},
    {first: -0.529, second: -0.848},
    {first: -0.544, second: -0.838},
    {first: -0.559, second: -0.829},
    {first: -0.573, second: -0.819},
    {first: -0.587, second: -0.809},
    {first: -0.601, second: -0.798},
    {first: -0.615, second: -0.788},
    {first: -0.629, second: -0.777},
    {first: -0.642, second: -0.766},
    {first: -0.656, second: -0.754},
    {first: -0.669, second: -0.743},
    {first: -0.681, second: -0.731},
    {first: -0.694, second: -0.719},
    {first: -0.707, second: -0.707},
    {first: -0.719, second: -0.694},
    {first: -0.731, second: -0.681},
    {first: -0.743, second: -0.669},
    {first: -0.754, second: -0.656},
    {first: -0.766, second: -0.642},
    {first: -0.777, second: -0.629},
    {first: -0.788, second: -0.615},
    {first: -0.798, second: -0.601},
    {first: -0.809, second: -0.587},
    {first: -0.819, second: -0.573},
    {first: -0.829, second: -0.559},
    {first: -0.838, second: -0.544},
    {first: -0.848, second: -0.529},
    {first: -0.857, second: -0.515},
    {first: -0.866, second: -0.499},
    {first: -0.874, second: -0.484},
    {first: -0.882, second: -0.469},
    {first: -0.891, second: -0.453},
    {first: -0.898, second: -0.438},
    {first: -0.906, second: -0.422},
    {first: -0.913, second: -0.406},
    {first: -0.92, second: -0.39},
    {first: -0.927, second: -0.374},
    {first: -0.933, second: -0.358},
    {first: -0.939, second: -0.342},
    {first: -0.945, second: -0.325},
    {first: -0.951, second: -0.309},
    {first: -0.956, second: -0.292},
    {first: -0.961, second: -0.275},
    {first: -0.965, second: -0.258},
    {first: -0.97, second: -0.241},
    {first: -0.974, second: -0.224},
    {first: -0.978, second: -0.207},
    {first: -0.981, second: -0.19},
    {first: -0.984, second: -0.173},
    {first: -0.987, second: -0.156},
    {first: -0.99, second: -0.139},
    {first: -0.992, second: -0.121},
    {first: -0.994, second: -0.104},
    {first: -0.996, second: -0.087},
    {first: -0.997, second: -0.069},
    {first: -0.998, second: -0.052},
    {first: -0.999, second: -0.034},
    {first: -0.999, second: -0.017},
    {first: -0.999, second: 0},
    {
        first: -0.999, second: 0.017
    },
    {first: -0.999, second: 0.034},
    {first: -0.998, second: 0.052},
    {first: -0.997, second: 0.069},
    {first: -0.996, second: 0.087},
    {first: -0.994, second: 0.104},
    {first: -0.992, second: 0.121},
    {first: -0.99, second: 0.139},
    {first: -0.987, second: 0.156},
    {first: -0.984, second: 0.173},
    {first: -0.981, second: 0.19},
    {first: -0.978, second: 0.207},
    {first: -0.974, second: 0.224},
    {first: -0.97, second: 0.241},
    {first: -0.965, second: 0.258},
    {first: -0.961, second: 0.275},
    {first: -0.956, second: 0.292},
    {first: -0.951, second: 0.309},
    {first: -0.945, second: 0.325},
    {first: -0.939, second: 0.342},
    {first: -0.933, second: 0.358},
    {first: -0.927, second: 0.374},
    {first: -0.92, second: 0.39},
    {first: -0.913, second: 0.406},
    {first: -0.906, second: 0.422},
    {first: -0.898, second: 0.438},
    {first: -0.891, second: 0.453},
    {first: -0.882, second: 0.469},
    {first: -0.874, second: 0.484},
    {first: -0.866, second: 0.499},
    {first: -0.857, second: 0.515},
    {first: -0.848, second: 0.529},
    {first: -0.838, second: 0.544},
    {first: -0.829, second: 0.559},
    {first: -0.819, second: 0.573},
    {first: -0.809, second: 0.587},
    {first: -0.798, second: 0.601},
    {first: -0.788, second: 0.615},
    {first: -0.777, second: 0.629},
    {first: -0.766, second: 0.642},
    {first: -0.754, second: 0.656},
    {first: -0.743, second: 0.669},
    {first: -0.731, second: 0.681},
    {first: -0.719, second: 0.694},
    {first: -0.707, second: 0.707},
    {first: -0.694, second: 0.719},
    {first: -0.681, second: 0.731},
    {first: -0.669, second: 0.743},
    {first: -0.656, second: 0.754},
    {first: -0.642, second: 0.766},
    {first: -0.629, second: 0.777},
    {first: -0.615, second: 0.788},
    {first: -0.601, second: 0.798},
    {first: -0.587, second: 0.809},
    {first: -0.573, second: 0.819},
    {first: -0.559, second: 0.829},
    {first: -0.544, second: 0.838},
    {first: -0.529, second: 0.848},
    {first: -0.515, second: 0.857},
    {first: -0.499, second: 0.866},
    {first: -0.484, second: 0.874},
    {first: -0.469, second: 0.882},
    {first: -0.453, second: 0.891},
    {first: -0.438, second: 0.898},
    {first: -0.422, second: 0.906},
    {first: -0.406, second: 0.913},
    {first: -0.39, second: 0.92},
    {first: -0.374, second: 0.927},
    {first: -0.358, second: 0.933},
    {first: -0.342, second: 0.939},
    {first: -0.325, second: 0.945},
    {first: -0.309, second: 0.951},
    {first: -0.292, second: 0.956},
    {first: -0.275, second: 0.961},
    {first: -0.258, second: 0.965},
    {first: -0.241, second: 0.97},
    {first: -0.224, second: 0.974},
    {first: -0.207, second: 0.978},
    {first: -0.19, second: 0.981},
    {first: -0.173, second: 0.984},
    {first: -0.156, second: 0.987},
    {first: -0.139, second: 0.99},
    {first: -0.121, second: 0.992},
    {first: -0.104, second: 0.994},
    {first: -0.087, second: 0.996},
    {first: -0.069, second: 0.997},
    {first: -0.052, second: 0.998},
    {first: -0.034, second: 0.999},
    {first: -0.017, second: 0.999},
    {first: 0, second: 0.999}
];

GC.angleToRadians = [0, 0.017453292222222222, 0.034906584444444444,
    0.05235987666666667, 0.06981316888888889, 0.08726646111111111,
    0.10471975333333335, 0.12217304555555557, 0.13962633777777778,
    0.15707963, 0.17453292222222222, 0.19198621444444444,
    0.2094395066666667, 0.22689279888888889, 0.24434609111111114,
    0.2617993833333333, 0.27925267555555555, 0.2967059677777778,
    0.31415926, 0.33161255222222225, 0.34906584444444444,
    0.3665191366666667, 0.3839724288888889, 0.4014257211111111,
    0.4188790133333334, 0.4363323055555556, 0.45378559777777777,
    0.47123888999999997, 0.48869218222222227, 0.5061454744444445,
    0.5235987666666666, 0.541052058888889, 0.5585053511111111,
    0.5759586433333334, 0.5934119355555556, 0.6108652277777777,
    0.62831852, 0.6457718122222222, 0.6632251044444445,
    0.6806783966666666, 0.6981316888888889, 0.715584981111111,
    0.7330382733333334, 0.7504915655555556, 0.7679448577777778,
    0.78539815, 0.8028514422222222, 0.8203047344444444,
    0.8377580266666668, 0.855211318888889, 0.8726646111111112,
    0.8901179033333334, 0.9075711955555555, 0.9250244877777778,
    0.9424777799999999, 0.9599310722222223, 0.9773843644444445,
    0.9948376566666667, 1.012290948888889, 1.029744241111111,
    1.0471975333333332, 1.0646508255555556, 1.082104117777778, 1.09955741,
    1.1170107022222222, 1.1344639944444443, 1.1519172866666667,
    1.1693705788888888, 1.1868238711111112, 1.2042771633333333,
    1.2217304555555555, 1.2391837477777778, 1.25663704,
    1.2740903322222221, 1.2915436244444445, 1.3089969166666668,
    1.326450208888889, 1.3439035011111111, 1.3613567933333333,
    1.3788100855555556, 1.3962633777777778, 1.4137166700000001,
    1.431169962222222, 1.4486232544444444, 1.4660765466666668,
    1.483529838888889, 1.5009831311111113, 1.5184364233333332,
    1.5358897155555555, 1.5533430077777777, 1.5707963, 1.5882495922222224,
    1.6057028844444443, 1.6231561766666667, 1.6406094688888888,
    1.6580627611111112, 1.6755160533333335, 1.6929693455555557,
    1.710422637777778, 1.72787593, 1.7453292222222223, 1.7627825144444444,
    1.7802358066666668, 1.7976890988888892, 1.815142391111111,
    1.8325956833333334, 1.8500489755555556, 1.867502267777778,
    1.8849555599999999, 1.9024088522222222, 1.9198621444444446,
    1.9373154366666667, 1.954768728888889, 1.972222021111111,
    1.9896753133333334, 2.0071286055555553, 2.024581897777778, 2.04203519,
    2.059488482222222, 2.0769417744444447, 2.0943950666666664,
    2.111848358888889, 2.129301651111111, 2.1467549433333333,
    2.164208235555556, 2.1816615277777776, 2.19911482, 2.2165681122222223,
    2.2340214044444444, 2.251474696666667, 2.2689279888888887,
    2.2863812811111113, 2.3038345733333334, 2.3212878655555556,
    2.3387411577777777, 2.35619445, 2.3736477422222224,
    2.3911010344444446, 2.4085543266666667, 2.426007618888889,
    2.443460911111111, 2.4609142033333335, 2.4783674955555557,
    2.495820787777778, 2.51327408, 2.5307273722222225, 2.5481806644444442,
    2.565633956666667, 2.583087248888889, 2.600540541111111,
    2.6179938333333337, 2.6354471255555554, 2.652900417777778, 2.67035371,
    2.6878070022222222, 2.705260294444445, 2.7227135866666665,
    2.740166878888889, 2.7576201711111112, 2.7750734633333334,
    2.7925267555555555, 2.8099800477777777, 2.8274333400000002,
    2.8448866322222224, 2.862339924444444, 2.879793216666667,
    2.897246508888889, 2.914699801111111, 2.9321530933333335,
    2.9496063855555557, 2.967059677777778, 2.98451297, 3.0019662622222225,
    3.0194195544444447, 3.0368728466666663, 3.0543261388888894,
    3.071779431111111, 3.089232723333333, 3.1066860155555553,
    3.124139307777778, 3.1415926, 3.159045892222222, 3.176499184444445,
    3.193952476666667, 3.2114057688888886, 3.2288590611111108,
    3.2463123533333333, 3.2637656455555555, 3.2812189377777776,
    3.29867223, 3.3161255222222223, 3.3335788144444445, 3.351032106666667,
    3.368485398888889, 3.3859386911111113, 3.403391983333333,
    3.420845275555556, 3.4382985677777778, 3.45575186, 3.4732051522222225,
    3.4906584444444446, 3.5081117366666668, 3.525565028888889,
    3.5430183211111115, 3.5604716133333336, 3.5779249055555553,
    3.5953781977777783, 3.61283149, 3.630284782222222, 3.6477380744444443,
    3.665191366666667, 3.682644658888889, 3.700097951111111,
    3.7175512433333338, 3.735004535555556, 3.7524578277777776,
    3.7699111199999997, 3.7873644122222223, 3.8048177044444444,
    3.8222709966666666, 3.839724288888889, 3.8571775811111113,
    3.8746308733333334, 3.892084165555555, 3.909537457777778, 3.92699075,
    3.944444042222222, 3.9618973344444446, 3.9793506266666667,
    3.996803918888889, 4.014257211111111, 4.031710503333334,
    4.049163795555556, 4.066617087777778, 4.08407038, 4.101523672222222,
    4.118976964444444, 4.136430256666667, 4.153883548888889,
    4.171336841111112, 4.188790133333333, 4.206243425555556,
    4.223696717777778, 4.24115001, 4.258603302222222, 4.276056594444444,
    4.2935098866666666, 4.310963178888889, 4.328416471111112,
    4.345869763333334, 4.363323055555555, 4.380776347777778, 4.39822964,
    4.415682932222222, 4.4331362244444446, 4.450589516666667,
    4.468042808888889, 4.485496101111111, 4.502949393333334,
    4.520402685555556, 4.537855977777777, 4.5553092699999995,
    4.5727625622222225, 4.590215854444445, 4.607669146666667,
    4.625122438888889, 4.642575731111111, 4.660029023333333,
    4.677482315555555, 4.694935607777778, 4.7123889, 4.729842192222222,
    4.747295484444445, 4.764748776666667, 4.782202068888889,
    4.799655361111111, 4.817108653333333, 4.8345619455555555,
    4.852015237777778, 4.869468530000001, 4.886921822222222,
    4.904375114444444, 4.921828406666667, 4.939281698888889,
    4.956734991111111, 4.9741882833333335, 4.991641575555556,
    5.009094867777778, 5.02654816, 5.044001452222223, 5.061454744444445,
    5.078908036666666, 5.0963613288888885, 5.1138146211111115,
    5.131267913333334, 5.148721205555556, 5.166174497777778, 5.18362779,
    5.201081082222222, 5.218534374444444, 5.235987666666667,
    5.253440958888889, 5.270894251111111, 5.288347543333334,
    5.305800835555556, 5.323254127777778, 5.34070742, 5.358160712222222,
    5.3756140044444445, 5.393067296666667, 5.41052058888889,
    5.427973881111111, 5.445427173333333, 5.462880465555555,
    5.480333757777778, 5.49778705, 5.5152403422222225, 5.532693634444445,
    5.550146926666667, 5.567600218888889, 5.585053511111111,
    5.602506803333333, 5.619960095555555, 5.6374133877777775,
    5.6548666800000005, 5.672319972222223, 5.689773264444445,
    5.707226556666667, 5.724679848888888, 5.742133141111112,
    5.759586433333334, 5.7770397255555554, 5.794493017777778, 5.81194631,
    5.829399602222222, 5.846852894444444, 5.864306186666667,
    5.881759478888889, 5.899212771111111, 5.9166660633333334,
    5.934119355555556, 5.951572647777778, 5.96902594, 5.986479232222223,
    6.003932524444445, 6.021385816666667, 6.038839108888889,
    6.0562924011111114, 6.073745693333333, 6.091198985555555,
    6.108652277777779, 6.126105570000001, 6.143558862222222,
    6.161012154444444, 6.178465446666666, 6.1959187388888886,
    6.213372031111111, 6.230825323333334, 6.248278615555556,
    6.265731907777778, 6.2831852];

GC.sin = [0, 0.01745, 0.03489, 0.05233, 0.06975, 0.08715, 0.10452,
    0.12186, 0.13917, 0.15643, 0.17364, 0.1908, 0.20791, 0.22495, 0.24192,
    0.25881, 0.27563, 0.29237, 0.30901, 0.32556, 0.34202, 0.35836, 0.3746,
    0.39073, 0.40673, 0.42261, 0.43837, 0.45399, 0.46947, 0.4848, 0.49999,
    0.51503, 0.52991, 0.54463, 0.55919, 0.57357, 0.58778, 0.60181,
    0.61566, 0.62932, 0.64278, 0.65605, 0.66913, 0.68199, 0.69465, 0.7071,
    0.71933, 0.73135, 0.74314, 0.7547, 0.76604, 0.77714, 0.78801, 0.79863,
    0.80901, 0.81915, 0.82903, 0.83867, 0.84804, 0.85716, 0.86602,
    0.87461, 0.88294, 0.891, 0.89879, 0.9063, 0.91354, 0.9205, 0.92718,
    0.93358, 0.93969, 0.94551, 0.95105, 0.9563, 0.96126, 0.96592, 0.97029,
    0.97437, 0.97814, 0.98162, 0.9848, 0.98768, 0.99026, 0.99254, 0.99452,
    0.99619, 0.99756, 0.99862, 0.99939, 0.99984, 0.99999, 0.99984,
    0.99939, 0.99862, 0.99756, 0.99619, 0.99452, 0.99254, 0.99026,
    0.98768, 0.9848, 0.98162, 0.97814, 0.97437, 0.97029, 0.96592, 0.96126,
    0.9563, 0.95105, 0.94551, 0.93969, 0.93358, 0.92718, 0.9205, 0.91354,
    0.9063, 0.89879, 0.891, 0.88294, 0.87461, 0.86602, 0.85716, 0.84804,
    0.83867, 0.82903, 0.81915, 0.80901, 0.79863, 0.78801, 0.77714,
    0.76604, 0.7547, 0.74314, 0.73135, 0.71933, 0.7071, 0.69465, 0.68199,
    0.66913, 0.65605, 0.64278, 0.62932, 0.61566, 0.60181, 0.58778,
    0.57357, 0.55919, 0.54463, 0.52991, 0.51503, 0.5, 0.4848, 0.46947,
    0.45399, 0.43837, 0.42261, 0.40673, 0.39073, 0.3746, 0.35836, 0.34202,
    0.32556, 0.30901, 0.29237, 0.27563, 0.25881, 0.24192, 0.22495,
    0.20791, 0.1908, 0.17364, 0.15643, 0.13917, 0.12186, 0.10452, 0.08715,
    0.06975, 0.05233, 0.03489, 0.01745, 0, -0.01745, -0.03489, -0.05233,
    -0.06975, -0.08715, -0.10452, -0.12186, -0.13917, -0.15643, -0.17364,
    -0.1908, -0.20791, -0.22495, -0.24192, -0.25881, -0.27563, -0.29237,
    -0.30901, -0.32556, -0.34202, -0.35836, -0.3746, -0.39073, -0.40673,
    -0.42261, -0.43837, -0.45399, -0.46947, -0.4848, -0.49999, -0.51503,
    -0.52991, -0.54463, -0.55919, -0.57357, -0.58778, -0.60181, -0.61566,
    -0.62932, -0.64278, -0.65605, -0.66913, -0.68199, -0.69465, -0.7071,
    -0.71933, -0.73135, -0.74314, -0.7547, -0.76604, -0.77714, -0.78801,
    -0.79863, -0.80901, -0.81915, -0.82903, -0.83867, -0.84804, -0.85716,
    -0.86602, -0.87461, -0.88294, -0.891, -0.89879, -0.9063, -0.91354,
    -0.9205, -0.92718, -0.93358, -0.93969, -0.94551, -0.95105, -0.9563,
    -0.96126, -0.96592, -0.97029, -0.97437, -0.97814, -0.98162, -0.9848,
    -0.98768, -0.99026, -0.99254, -0.99452, -0.99619, -0.99756, -0.99862,
    -0.99939, -0.99984, -0.99999, -0.99984, -0.99939, -0.99862, -0.99756,
    -0.99619, -0.99452, -0.99254, -0.99026, -0.98768, -0.9848, -0.98162,
    -0.97814, -0.97437, -0.97029, -0.96592, -0.96126, -0.9563, -0.95105,
    -0.94551, -0.93969, -0.93358, -0.92718, -0.9205, -0.91354, -0.9063,
    -0.89879, -0.891, -0.88294, -0.87461, -0.86602, -0.85716, -0.84804,
    -0.83867, -0.82903, -0.81915, -0.80901, -0.79863, -0.78801, -0.77714,
    -0.76604, -0.7547, -0.74314, -0.73135, -0.71933, -0.7071, -0.69465,
    -0.68199, -0.66913, -0.65605, -0.64278, -0.62932, -0.61566, -0.60181,
    -0.58778, -0.57357, -0.55919, -0.54463, -0.52991, -0.51503, -0.5,
    -0.4848, -0.46947, -0.45399, -0.43837, -0.42261, -0.40673, -0.39073,
    -0.3746, -0.35836, -0.34202, -0.32556, -0.30901, -0.29237, -0.27563,
    -0.25881, -0.24192, -0.22495, -0.20791, -0.1908, -0.17364, -0.15643,
    -0.13917, -0.12186, -0.10452, -0.08715, -0.06975, -0.05233, -0.03489,
    -0.01745, 0];

GC.cos = [1, 0.99984, 0.99939, 0.99862, 0.99756, 0.99619, 0.99452,
    0.99254, 0.99026, 0.98768, 0.9848, 0.98162, 0.97814, 0.97437, 0.97029,
    0.96592, 0.96126, 0.9563, 0.95105, 0.94551, 0.93969, 0.93358, 0.92718,
    0.9205, 0.91354, 0.9063, 0.89879, 0.891, 0.88294, 0.87461, 0.86602,
    0.85716, 0.84804, 0.83867, 0.82903, 0.81915, 0.80901, 0.79863,
    0.78801, 0.77714, 0.76604, 0.7547, 0.74314, 0.73135, 0.71933, 0.7071,
    0.69465, 0.68199, 0.66913, 0.65605, 0.64278, 0.62932, 0.61566,
    0.60181, 0.58778, 0.57357, 0.55919, 0.54463, 0.52991, 0.51503, 0.5,
    0.4848, 0.46947, 0.45399, 0.43837, 0.42261, 0.40673, 0.39073, 0.3746,
    0.35836, 0.34202, 0.32556, 0.30901, 0.29237, 0.27563, 0.25881,
    0.24192, 0.22495, 0.20791, 0.1908, 0.17364, 0.15643, 0.13917, 0.12186,
    0.10452, 0.08715, 0.06975, 0.05233, 0.03489, 0.01745, 0, -0.01745,
    -0.03489, -0.05233, -0.06975, -0.08715, -0.10452, -0.12186, -0.13917,
    -0.15643, -0.17364, -0.1908, -0.20791, -0.22495, -0.24192, -0.25881,
    -0.27563, -0.29237, -0.30901, -0.32556, -0.34202, -0.35836, -0.3746,
    -0.39073, -0.40673, -0.42261, -0.43837, -0.45399, -0.46947, -0.4848,
    -0.49999, -0.51503, -0.52991, -0.54463, -0.55919, -0.57357, -0.58778,
    -0.60181, -0.61566, -0.62932, -0.64278, -0.65605, -0.66913, -0.68199,
    -0.69465, -0.7071, -0.71933, -0.73135, -0.74314, -0.7547, -0.76604,
    -0.77714, -0.78801, -0.79863, -0.80901, -0.81915, -0.82903, -0.83867,
    -0.84804, -0.85716, -0.86602, -0.87461, -0.88294, -0.891, -0.89879,
    -0.9063, -0.91354, -0.9205, -0.92718, -0.93358, -0.93969, -0.94551,
    -0.95105, -0.9563, -0.96126, -0.96592, -0.97029, -0.97437, -0.97814,
    -0.98162, -0.9848, -0.98768, -0.99026, -0.99254, -0.99452, -0.99619,
    -0.99756, -0.99862, -0.99939, -0.99984, -0.99999, -0.99984, -0.99939,
    -0.99862, -0.99756, -0.99619, -0.99452, -0.99254, -0.99026, -0.98768,
    -0.9848, -0.98162, -0.97814, -0.97437, -0.97029, -0.96592, -0.96126,
    -0.9563, -0.95105, -0.94551, -0.93969, -0.93358, -0.92718, -0.9205,
    -0.91354, -0.9063, -0.89879, -0.891, -0.88294, -0.87461, -0.86602,
    -0.85716, -0.84804, -0.83867, -0.82903, -0.81915, -0.80901, -0.79863,
    -0.78801, -0.77714, -0.76604, -0.7547, -0.74314, -0.73135, -0.71933,
    -0.7071, -0.69465, -0.68199, -0.66913, -0.65605, -0.64278, -0.62932,
    -0.61566, -0.60181, -0.58778, -0.57357, -0.55919, -0.54463, -0.52991,
    -0.51503, -0.5, -0.4848, -0.46947, -0.45399, -0.43837, -0.42261,
    -0.40673, -0.39073, -0.3746, -0.35836, -0.34202, -0.32556, -0.30901,
    -0.29237, -0.27563, -0.25881, -0.24192, -0.22495, -0.20791, -0.1908,
    -0.17364, -0.15643, -0.13917, -0.12186, -0.10452, -0.08715, -0.06975,
    -0.05233, -0.03489, -0.01745, 0, 0.01745, 0.03489, 0.05233, 0.06975,
    0.08715, 0.10452, 0.12186, 0.13917, 0.15643, 0.17364, 0.1908, 0.20791,
    0.22495, 0.24192, 0.25881, 0.27563, 0.29237, 0.30901, 0.32556,
    0.34202, 0.35836, 0.3746, 0.39073, 0.40673, 0.42261, 0.43837, 0.45399,
    0.46947, 0.4848, 0.49999, 0.51503, 0.52991, 0.54463, 0.55919, 0.57357,
    0.58778, 0.60181, 0.61566, 0.62932, 0.64278, 0.65605, 0.66913,
    0.68199, 0.69465, 0.7071, 0.71933, 0.73135, 0.74314, 0.7547, 0.76604,
    0.77714, 0.78801, 0.79863, 0.80901, 0.81915, 0.82903, 0.83867,
    0.84804, 0.85716, 0.86602, 0.87461, 0.88294, 0.891, 0.89879, 0.9063,
    0.91354, 0.9205, 0.92718, 0.93358, 0.93969, 0.94551, 0.95105, 0.9563,
    0.96126, 0.96592, 0.97029, 0.97437, 0.97814, 0.98162, 0.9848, 0.98768,
    0.99026, 0.99254, 0.99452, 0.99619, 0.99756, 0.99862, 0.99939,
    0.99984, 0.99999];

//目前只存了50以内的,若需要更大,替换
//var str=[];
//for(var i=0;i<50;i++){
//    str[i]=[];
//    for(var i2=0;i2<50;i2++){
//        str[i][i2]=i*1000+i2;
//    }
//}
//console.log(JSON.stringify(str));
GC.gridXYs = GC.gridXYs || [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
        [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049],
        [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049],
        [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3034, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044, 3045, 3046, 3047, 3048, 3049],
        [4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4011, 4012, 4013, 4014, 4015, 4016, 4017, 4018, 4019, 4020, 4021, 4022, 4023, 4024, 4025, 4026, 4027, 4028, 4029, 4030, 4031, 4032, 4033, 4034, 4035, 4036, 4037, 4038, 4039, 4040, 4041, 4042, 4043, 4044, 4045, 4046, 4047, 4048, 4049],
        [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009, 5010, 5011, 5012, 5013, 5014, 5015, 5016, 5017, 5018, 5019, 5020, 5021, 5022, 5023, 5024, 5025, 5026, 5027, 5028, 5029, 5030, 5031, 5032, 5033, 5034, 5035, 5036, 5037, 5038, 5039, 5040, 5041, 5042, 5043, 5044, 5045, 5046, 5047, 5048, 5049],
        [6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009, 6010, 6011, 6012, 6013, 6014, 6015, 6016, 6017, 6018, 6019, 6020, 6021, 6022, 6023, 6024, 6025, 6026, 6027, 6028, 6029, 6030, 6031, 6032, 6033, 6034, 6035, 6036, 6037, 6038, 6039, 6040, 6041, 6042, 6043, 6044, 6045, 6046, 6047, 6048, 6049],
        [7000, 7001, 7002, 7003, 7004, 7005, 7006, 7007, 7008, 7009, 7010, 7011, 7012, 7013, 7014, 7015, 7016, 7017, 7018, 7019, 7020, 7021, 7022, 7023, 7024, 7025, 7026, 7027, 7028, 7029, 7030, 7031, 7032, 7033, 7034, 7035, 7036, 7037, 7038, 7039, 7040, 7041, 7042, 7043, 7044, 7045, 7046, 7047, 7048, 7049],
        [8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016, 8017, 8018, 8019, 8020, 8021, 8022, 8023, 8024, 8025, 8026, 8027, 8028, 8029, 8030, 8031, 8032, 8033, 8034, 8035, 8036, 8037, 8038, 8039, 8040, 8041, 8042, 8043, 8044, 8045, 8046, 8047, 8048, 8049],
        [9000, 9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010, 9011, 9012, 9013, 9014, 9015, 9016, 9017, 9018, 9019, 9020, 9021, 9022, 9023, 9024, 9025, 9026, 9027, 9028, 9029, 9030, 9031, 9032, 9033, 9034, 9035, 9036, 9037, 9038, 9039, 9040, 9041, 9042, 9043, 9044, 9045, 9046, 9047, 9048, 9049],
        [10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10027, 10028, 10029, 10030, 10031, 10032, 10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10041, 10042, 10043, 10044, 10045, 10046, 10047, 10048, 10049],
        [11000, 11001, 11002, 11003, 11004, 11005, 11006, 11007, 11008, 11009, 11010, 11011, 11012, 11013, 11014, 11015, 11016, 11017, 11018, 11019, 11020, 11021, 11022, 11023, 11024, 11025, 11026, 11027, 11028, 11029, 11030, 11031, 11032, 11033, 11034, 11035, 11036, 11037, 11038, 11039, 11040, 11041, 11042, 11043, 11044, 11045, 11046, 11047, 11048, 11049],
        [12000, 12001, 12002, 12003, 12004, 12005, 12006, 12007, 12008, 12009, 12010, 12011, 12012, 12013, 12014, 12015, 12016, 12017, 12018, 12019, 12020, 12021, 12022, 12023, 12024, 12025, 12026, 12027, 12028, 12029, 12030, 12031, 12032, 12033, 12034, 12035, 12036, 12037, 12038, 12039, 12040, 12041, 12042, 12043, 12044, 12045, 12046, 12047, 12048, 12049],
        [13000, 13001, 13002, 13003, 13004, 13005, 13006, 13007, 13008, 13009, 13010, 13011, 13012, 13013, 13014, 13015, 13016, 13017, 13018, 13019, 13020, 13021, 13022, 13023, 13024, 13025, 13026, 13027, 13028, 13029, 13030, 13031, 13032, 13033, 13034, 13035, 13036, 13037, 13038, 13039, 13040, 13041, 13042, 13043, 13044, 13045, 13046, 13047, 13048, 13049],
        [14000, 14001, 14002, 14003, 14004, 14005, 14006, 14007, 14008, 14009, 14010, 14011, 14012, 14013, 14014, 14015, 14016, 14017, 14018, 14019, 14020, 14021, 14022, 14023, 14024, 14025, 14026, 14027, 14028, 14029, 14030, 14031, 14032, 14033, 14034, 14035, 14036, 14037, 14038, 14039, 14040, 14041, 14042, 14043, 14044, 14045, 14046, 14047, 14048, 14049],
        [15000, 15001, 15002, 15003, 15004, 15005, 15006, 15007, 15008, 15009, 15010, 15011, 15012, 15013, 15014, 15015, 15016, 15017, 15018, 15019, 15020, 15021, 15022, 15023, 15024, 15025, 15026, 15027, 15028, 15029, 15030, 15031, 15032, 15033, 15034, 15035, 15036, 15037, 15038, 15039, 15040, 15041, 15042, 15043, 15044, 15045, 15046, 15047, 15048, 15049],
        [16000, 16001, 16002, 16003, 16004, 16005, 16006, 16007, 16008, 16009, 16010, 16011, 16012, 16013, 16014, 16015, 16016, 16017, 16018, 16019, 16020, 16021, 16022, 16023, 16024, 16025, 16026, 16027, 16028, 16029, 16030, 16031, 16032, 16033, 16034, 16035, 16036, 16037, 16038, 16039, 16040, 16041, 16042, 16043, 16044, 16045, 16046, 16047, 16048, 16049],
        [17000, 17001, 17002, 17003, 17004, 17005, 17006, 17007, 17008, 17009, 17010, 17011, 17012, 17013, 17014, 17015, 17016, 17017, 17018, 17019, 17020, 17021, 17022, 17023, 17024, 17025, 17026, 17027, 17028, 17029, 17030, 17031, 17032, 17033, 17034, 17035, 17036, 17037, 17038, 17039, 17040, 17041, 17042, 17043, 17044, 17045, 17046, 17047, 17048, 17049],
        [18000, 18001, 18002, 18003, 18004, 18005, 18006, 18007, 18008, 18009, 18010, 18011, 18012, 18013, 18014, 18015, 18016, 18017, 18018, 18019, 18020, 18021, 18022, 18023, 18024, 18025, 18026, 18027, 18028, 18029, 18030, 18031, 18032, 18033, 18034, 18035, 18036, 18037, 18038, 18039, 18040, 18041, 18042, 18043, 18044, 18045, 18046, 18047, 18048, 18049],
        [19000, 19001, 19002, 19003, 19004, 19005, 19006, 19007, 19008, 19009, 19010, 19011, 19012, 19013, 19014, 19015, 19016, 19017, 19018, 19019, 19020, 19021, 19022, 19023, 19024, 19025, 19026, 19027, 19028, 19029, 19030, 19031, 19032, 19033, 19034, 19035, 19036, 19037, 19038, 19039, 19040, 19041, 19042, 19043, 19044, 19045, 19046, 19047, 19048, 19049],
        [20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20018, 20019, 20020, 20021, 20022, 20023, 20024, 20025, 20026, 20027, 20028, 20029, 20030, 20031, 20032, 20033, 20034, 20035, 20036, 20037, 20038, 20039, 20040, 20041, 20042, 20043, 20044, 20045, 20046, 20047, 20048, 20049],
        [21000, 21001, 21002, 21003, 21004, 21005, 21006, 21007, 21008, 21009, 21010, 21011, 21012, 21013, 21014, 21015, 21016, 21017, 21018, 21019, 21020, 21021, 21022, 21023, 21024, 21025, 21026, 21027, 21028, 21029, 21030, 21031, 21032, 21033, 21034, 21035, 21036, 21037, 21038, 21039, 21040, 21041, 21042, 21043, 21044, 21045, 21046, 21047, 21048, 21049],
        [22000, 22001, 22002, 22003, 22004, 22005, 22006, 22007, 22008, 22009, 22010, 22011, 22012, 22013, 22014, 22015, 22016, 22017, 22018, 22019, 22020, 22021, 22022, 22023, 22024, 22025, 22026, 22027, 22028, 22029, 22030, 22031, 22032, 22033, 22034, 22035, 22036, 22037, 22038, 22039, 22040, 22041, 22042, 22043, 22044, 22045, 22046, 22047, 22048, 22049],
        [23000, 23001, 23002, 23003, 23004, 23005, 23006, 23007, 23008, 23009, 23010, 23011, 23012, 23013, 23014, 23015, 23016, 23017, 23018, 23019, 23020, 23021, 23022, 23023, 23024, 23025, 23026, 23027, 23028, 23029, 23030, 23031, 23032, 23033, 23034, 23035, 23036, 23037, 23038, 23039, 23040, 23041, 23042, 23043, 23044, 23045, 23046, 23047, 23048, 23049],
        [24000, 24001, 24002, 24003, 24004, 24005, 24006, 24007, 24008, 24009, 24010, 24011, 24012, 24013, 24014, 24015, 24016, 24017, 24018, 24019, 24020, 24021, 24022, 24023, 24024, 24025, 24026, 24027, 24028, 24029, 24030, 24031, 24032, 24033, 24034, 24035, 24036, 24037, 24038, 24039, 24040, 24041, 24042, 24043, 24044, 24045, 24046, 24047, 24048, 24049],
        [25000, 25001, 25002, 25003, 25004, 25005, 25006, 25007, 25008, 25009, 25010, 25011, 25012, 25013, 25014, 25015, 25016, 25017, 25018, 25019, 25020, 25021, 25022, 25023, 25024, 25025, 25026, 25027, 25028, 25029, 25030, 25031, 25032, 25033, 25034, 25035, 25036, 25037, 25038, 25039, 25040, 25041, 25042, 25043, 25044, 25045, 25046, 25047, 25048, 25049],
        [26000, 26001, 26002, 26003, 26004, 26005, 26006, 26007, 26008, 26009, 26010, 26011, 26012, 26013, 26014, 26015, 26016, 26017, 26018, 26019, 26020, 26021, 26022, 26023, 26024, 26025, 26026, 26027, 26028, 26029, 26030, 26031, 26032, 26033, 26034, 26035, 26036, 26037, 26038, 26039, 26040, 26041, 26042, 26043, 26044, 26045, 26046, 26047, 26048, 26049],
        [27000, 27001, 27002, 27003, 27004, 27005, 27006, 27007, 27008, 27009, 27010, 27011, 27012, 27013, 27014, 27015, 27016, 27017, 27018, 27019, 27020, 27021, 27022, 27023, 27024, 27025, 27026, 27027, 27028, 27029, 27030, 27031, 27032, 27033, 27034, 27035, 27036, 27037, 27038, 27039, 27040, 27041, 27042, 27043, 27044, 27045, 27046, 27047, 27048, 27049],
        [28000, 28001, 28002, 28003, 28004, 28005, 28006, 28007, 28008, 28009, 28010, 28011, 28012, 28013, 28014, 28015, 28016, 28017, 28018, 28019, 28020, 28021, 28022, 28023, 28024, 28025, 28026, 28027, 28028, 28029, 28030, 28031, 28032, 28033, 28034, 28035, 28036, 28037, 28038, 28039, 28040, 28041, 28042, 28043, 28044, 28045, 28046, 28047, 28048, 28049],
        [29000, 29001, 29002, 29003, 29004, 29005, 29006, 29007, 29008, 29009, 29010, 29011, 29012, 29013, 29014, 29015, 29016, 29017, 29018, 29019, 29020, 29021, 29022, 29023, 29024, 29025, 29026, 29027, 29028, 29029, 29030, 29031, 29032, 29033, 29034, 29035, 29036, 29037, 29038, 29039, 29040, 29041, 29042, 29043, 29044, 29045, 29046, 29047, 29048, 29049],
        [30000, 30001, 30002, 30003, 30004, 30005, 30006, 30007, 30008, 30009, 30010, 30011, 30012, 30013, 30014, 30015, 30016, 30017, 30018, 30019, 30020, 30021, 30022, 30023, 30024, 30025, 30026, 30027, 30028, 30029, 30030, 30031, 30032, 30033, 30034, 30035, 30036, 30037, 30038, 30039, 30040, 30041, 30042, 30043, 30044, 30045, 30046, 30047, 30048, 30049],
        [31000, 31001, 31002, 31003, 31004, 31005, 31006, 31007, 31008, 31009, 31010, 31011, 31012, 31013, 31014, 31015, 31016, 31017, 31018, 31019, 31020, 31021, 31022, 31023, 31024, 31025, 31026, 31027, 31028, 31029, 31030, 31031, 31032, 31033, 31034, 31035, 31036, 31037, 31038, 31039, 31040, 31041, 31042, 31043, 31044, 31045, 31046, 31047, 31048, 31049],
        [32000, 32001, 32002, 32003, 32004, 32005, 32006, 32007, 32008, 32009, 32010, 32011, 32012, 32013, 32014, 32015, 32016, 32017, 32018, 32019, 32020, 32021, 32022, 32023, 32024, 32025, 32026, 32027, 32028, 32029, 32030, 32031, 32032, 32033, 32034, 32035, 32036, 32037, 32038, 32039, 32040, 32041, 32042, 32043, 32044, 32045, 32046, 32047, 32048, 32049],
        [33000, 33001, 33002, 33003, 33004, 33005, 33006, 33007, 33008, 33009, 33010, 33011, 33012, 33013, 33014, 33015, 33016, 33017, 33018, 33019, 33020, 33021, 33022, 33023, 33024, 33025, 33026, 33027, 33028, 33029, 33030, 33031, 33032, 33033, 33034, 33035, 33036, 33037, 33038, 33039, 33040, 33041, 33042, 33043, 33044, 33045, 33046, 33047, 33048, 33049],
        [34000, 34001, 34002, 34003, 34004, 34005, 34006, 34007, 34008, 34009, 34010, 34011, 34012, 34013, 34014, 34015, 34016, 34017, 34018, 34019, 34020, 34021, 34022, 34023, 34024, 34025, 34026, 34027, 34028, 34029, 34030, 34031, 34032, 34033, 34034, 34035, 34036, 34037, 34038, 34039, 34040, 34041, 34042, 34043, 34044, 34045, 34046, 34047, 34048, 34049],
        [35000, 35001, 35002, 35003, 35004, 35005, 35006, 35007, 35008, 35009, 35010, 35011, 35012, 35013, 35014, 35015, 35016, 35017, 35018, 35019, 35020, 35021, 35022, 35023, 35024, 35025, 35026, 35027, 35028, 35029, 35030, 35031, 35032, 35033, 35034, 35035, 35036, 35037, 35038, 35039, 35040, 35041, 35042, 35043, 35044, 35045, 35046, 35047, 35048, 35049],
        [36000, 36001, 36002, 36003, 36004, 36005, 36006, 36007, 36008, 36009, 36010, 36011, 36012, 36013, 36014, 36015, 36016, 36017, 36018, 36019, 36020, 36021, 36022, 36023, 36024, 36025, 36026, 36027, 36028, 36029, 36030, 36031, 36032, 36033, 36034, 36035, 36036, 36037, 36038, 36039, 36040, 36041, 36042, 36043, 36044, 36045, 36046, 36047, 36048, 36049],
        [37000, 37001, 37002, 37003, 37004, 37005, 37006, 37007, 37008, 37009, 37010, 37011, 37012, 37013, 37014, 37015, 37016, 37017, 37018, 37019, 37020, 37021, 37022, 37023, 37024, 37025, 37026, 37027, 37028, 37029, 37030, 37031, 37032, 37033, 37034, 37035, 37036, 37037, 37038, 37039, 37040, 37041, 37042, 37043, 37044, 37045, 37046, 37047, 37048, 37049],
        [38000, 38001, 38002, 38003, 38004, 38005, 38006, 38007, 38008, 38009, 38010, 38011, 38012, 38013, 38014, 38015, 38016, 38017, 38018, 38019, 38020, 38021, 38022, 38023, 38024, 38025, 38026, 38027, 38028, 38029, 38030, 38031, 38032, 38033, 38034, 38035, 38036, 38037, 38038, 38039, 38040, 38041, 38042, 38043, 38044, 38045, 38046, 38047, 38048, 38049],
        [39000, 39001, 39002, 39003, 39004, 39005, 39006, 39007, 39008, 39009, 39010, 39011, 39012, 39013, 39014, 39015, 39016, 39017, 39018, 39019, 39020, 39021, 39022, 39023, 39024, 39025, 39026, 39027, 39028, 39029, 39030, 39031, 39032, 39033, 39034, 39035, 39036, 39037, 39038, 39039, 39040, 39041, 39042, 39043, 39044, 39045, 39046, 39047, 39048, 39049],
        [40000, 40001, 40002, 40003, 40004, 40005, 40006, 40007, 40008, 40009, 40010, 40011, 40012, 40013, 40014, 40015, 40016, 40017, 40018, 40019, 40020, 40021, 40022, 40023, 40024, 40025, 40026, 40027, 40028, 40029, 40030, 40031, 40032, 40033, 40034, 40035, 40036, 40037, 40038, 40039, 40040, 40041, 40042, 40043, 40044, 40045, 40046, 40047, 40048, 40049],
        [41000, 41001, 41002, 41003, 41004, 41005, 41006, 41007, 41008, 41009, 41010, 41011, 41012, 41013, 41014, 41015, 41016, 41017, 41018, 41019, 41020, 41021, 41022, 41023, 41024, 41025, 41026, 41027, 41028, 41029, 41030, 41031, 41032, 41033, 41034, 41035, 41036, 41037, 41038, 41039, 41040, 41041, 41042, 41043, 41044, 41045, 41046, 41047, 41048, 41049],
        [42000, 42001, 42002, 42003, 42004, 42005, 42006, 42007, 42008, 42009, 42010, 42011, 42012, 42013, 42014, 42015, 42016, 42017, 42018, 42019, 42020, 42021, 42022, 42023, 42024, 42025, 42026, 42027, 42028, 42029, 42030, 42031, 42032, 42033, 42034, 42035, 42036, 42037, 42038, 42039, 42040, 42041, 42042, 42043, 42044, 42045, 42046, 42047, 42048, 42049],
        [43000, 43001, 43002, 43003, 43004, 43005, 43006, 43007, 43008, 43009, 43010, 43011, 43012, 43013, 43014, 43015, 43016, 43017, 43018, 43019, 43020, 43021, 43022, 43023, 43024, 43025, 43026, 43027, 43028, 43029, 43030, 43031, 43032, 43033, 43034, 43035, 43036, 43037, 43038, 43039, 43040, 43041, 43042, 43043, 43044, 43045, 43046, 43047, 43048, 43049],
        [44000, 44001, 44002, 44003, 44004, 44005, 44006, 44007, 44008, 44009, 44010, 44011, 44012, 44013, 44014, 44015, 44016, 44017, 44018, 44019, 44020, 44021, 44022, 44023, 44024, 44025, 44026, 44027, 44028, 44029, 44030, 44031, 44032, 44033, 44034, 44035, 44036, 44037, 44038, 44039, 44040, 44041, 44042, 44043, 44044, 44045, 44046, 44047, 44048, 44049],
        [45000, 45001, 45002, 45003, 45004, 45005, 45006, 45007, 45008, 45009, 45010, 45011, 45012, 45013, 45014, 45015, 45016, 45017, 45018, 45019, 45020, 45021, 45022, 45023, 45024, 45025, 45026, 45027, 45028, 45029, 45030, 45031, 45032, 45033, 45034, 45035, 45036, 45037, 45038, 45039, 45040, 45041, 45042, 45043, 45044, 45045, 45046, 45047, 45048, 45049],
        [46000, 46001, 46002, 46003, 46004, 46005, 46006, 46007, 46008, 46009, 46010, 46011, 46012, 46013, 46014, 46015, 46016, 46017, 46018, 46019, 46020, 46021, 46022, 46023, 46024, 46025, 46026, 46027, 46028, 46029, 46030, 46031, 46032, 46033, 46034, 46035, 46036, 46037, 46038, 46039, 46040, 46041, 46042, 46043, 46044, 46045, 46046, 46047, 46048, 46049],
        [47000, 47001, 47002, 47003, 47004, 47005, 47006, 47007, 47008, 47009, 47010, 47011, 47012, 47013, 47014, 47015, 47016, 47017, 47018, 47019, 47020, 47021, 47022, 47023, 47024, 47025, 47026, 47027, 47028, 47029, 47030, 47031, 47032, 47033, 47034, 47035, 47036, 47037, 47038, 47039, 47040, 47041, 47042, 47043, 47044, 47045, 47046, 47047, 47048, 47049],
        [48000, 48001, 48002, 48003, 48004, 48005, 48006, 48007, 48008, 48009, 48010, 48011, 48012, 48013, 48014, 48015, 48016, 48017, 48018, 48019, 48020, 48021, 48022, 48023, 48024, 48025, 48026, 48027, 48028, 48029, 48030, 48031, 48032, 48033, 48034, 48035, 48036, 48037, 48038, 48039, 48040, 48041, 48042, 48043, 48044, 48045, 48046, 48047, 48048, 48049],
        [49000, 49001, 49002, 49003, 49004, 49005, 49006, 49007, 49008, 49009, 49010, 49011, 49012, 49013, 49014, 49015, 49016, 49017, 49018, 49019, 49020, 49021, 49022, 49023, 49024, 49025, 49026, 49027, 49028, 49029, 49030, 49031, 49032, 49033, 49034, 49035, 49036, 49037, 49038, 49039, 49040, 49041, 49042, 49043, 49044, 49045, 49046, 49047, 49048, 49049]
    ];