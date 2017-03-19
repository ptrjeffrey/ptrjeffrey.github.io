/**
 * Created by dell on 2017/3/7.
 */

var MJUIConst = {}
MJUIConst.selfHandRes = {
    'stand' : {}
}

for(var i = MJConst.k1Wan; i <= MJConst.k9Wan; i++) {
    MJUIConst.selfHandRes.stand[i] = 165 + i - MJConst.k1Wan
}

for(var i = MJConst.k1Tong; i <= MJConst.k9Tong; i++) {
    MJUIConst.selfHandRes.stand[i] = 147 + i - MJConst.k1Tong
}

for(var i = MJConst.k1Tiao; i <= MJConst.k9Tiao; i++) {
    MJUIConst.selfHandRes.stand[i] = 156 + i - MJConst.k1Tiao
}

MJUIConst.rightHandRes = {
    'stand' : 319,
     'down' : {}
}
MJUIConst.topHandRes = {
    'stand' : 274,
    'down' : {},
    'back' : 9
}
MJUIConst.leftHandRew = {
    'stand' : 320,
    'down' : {},
    'back' : 9
}

MJUIConst.selfRiverRes = {}

MJUIConst.leftTimeNum = 268
MJUIConst.rightTimeNum = 269


MJUIConst.gameSetting = 271
MJUIConst.gameExit = 270
MJUIConst.hallUserLogo = 174


var MJResConst = {}
MJResConst.timeNum = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26]