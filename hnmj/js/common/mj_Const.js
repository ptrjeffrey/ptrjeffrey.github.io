/**
 * Created by dell on 2016/7/10.
 */
var MJConst = {};

MJConst.kBack = 99;     // 用于牌背的显示

MJConst.kSuitNone  = -1;
MJConst.kSuitWan   = 0;
MJConst.kSuitTiao  = 1;
MJConst.kSuitTong  = 2;
MJConst.kSuitFeng  = 3;
MJConst.kSuitHua   = 4;

MJConst.kPointNone = -1;
MJConst.kPoint1    = 1;
MJConst.kPoint2    = 2;
MJConst.kPoint3    = 3;
MJConst.kPoint4    = 4;
MJConst.kPoint5    = 5;
MJConst.kPoint6    = 6;
MJConst.kPoint7    = 7;
MJConst.kPoint8    = 8;
MJConst.kPoint9    = 9;
MJConst.kPointMask = 10;

MJConst.kCardNone = -1;
// 整型值 方便做牌
MJConst.k1Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint1;
MJConst.k2Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint2;
MJConst.k3Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint3;
MJConst.k4Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint4;
MJConst.k5Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint5;
MJConst.k6Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint6;
MJConst.k7Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint7;
MJConst.k8Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint8;
MJConst.k9Wan = MJConst.kSuitWan * MJConst.kPointMask + MJConst.kPoint9;
////////////////条///////////////
MJConst.k1Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint1;
MJConst.k2Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint2;
MJConst.k3Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint3;
MJConst.k4Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint4;
MJConst.k5Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint5;
MJConst.k6Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint6;
MJConst.k7Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint7;
MJConst.k8Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint8;
MJConst.k9Tiao = MJConst.kSuitTiao * MJConst.kPointMask + MJConst.kPoint9;
/////////////////筒//////////////////
MJConst.k1Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint1;
MJConst.k2Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint2;
MJConst.k3Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint3;
MJConst.k4Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint4;
MJConst.k5Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint5;
MJConst.k6Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint6;
MJConst.k7Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint7;
MJConst.k8Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint8;
MJConst.k9Tong = MJConst.kSuitTong * MJConst.kPointMask + MJConst.kPoint9;
////////////////字//////////////
MJConst.kDong = MJConst.kSuitFeng * MJConst.kPointMask + MJConst.kPoint1;
MJConst.kNan = MJConst.kSuitFeng * MJConst.kPointMask + MJConst.kPoint2;
MJConst.kXi = MJConst.kSuitFeng * MJConst.kPointMask + MJConst.kPoint3;
MJConst.kBei = MJConst.kSuitFeng * MJConst.kPointMask + MJConst.kPoint4;
MJConst.kZhong = MJConst.kSuitFeng * MJConst.kPointMask + MJConst.kPoint5;
MJConst.kFa = MJConst.kSuitFeng * MJConst.kPointMask + MJConst.kPoint6;
MJConst.kBai = MJConst.kSuitFeng * MJConst.kPointMask + MJConst.kPoint7;
//////////////////花//////////
MJConst.kChun = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint1;
MJConst.kXia = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint2;
MJConst.kQiu = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint3;
MJConst.kDon = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint4;
MJConst.kMei = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint5;
MJConst.kLan = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint6;
MJConst.kZhu = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint7;
MJConst.kJu = MJConst.kSuitHua * MJConst.kPointMask + MJConst.kPoint8;
/////////////////

MJConst.kWanList = [MJConst.k1Wan, MJConst.k2Wan, MJConst.k3Wan, MJConst.k4Wan, MJConst.k5Wan, MJConst.k6Wan,
    MJConst.k7Wan, MJConst.k8Wan, MJConst.k9Wan];
MJConst.kTiaoList = [MJConst.k1Tiao, MJConst.k2Tiao, MJConst.k3Tiao, MJConst.k4Tiao, MJConst.k5Tiao, MJConst.k6Tiao,
    MJConst.k7Tiao, MJConst.k8Tiao, MJConst.k9Tiao];
MJConst.kTongList = [MJConst.k1Tong , MJConst.k2Tong , MJConst.k3Tong , MJConst.k4Tong , MJConst.k5Tong , MJConst.k6Tong ,
    MJConst.k7Tong , MJConst.k8Tong , MJConst.k9Tong ];
MJConst.kFengList = [MJConst.kDong, MJConst.kNan, MJConst.kXi, MJConst.kBei, MJConst.kZhong, MJConst.kFa, MJConst.kBai];
MJConst.kHuaList = [MJConst.kChun, MJConst.kXia, MJConst.kQiu, MJConst.kDon, MJConst.kMei, MJConst.kLan, MJConst.kZhu, MJConst.kJu];

MJConst.kMJAnyCard = -1;
MJConst.kGrabNone       = 0x00000000;
MJConst.kGrabHu         = 0x00000001;
MJConst.kGrabPeng       = 0x00000002;
MJConst.kGrabZG         = 0x00000004;
MJConst.kGrabMXG        = 0x00000008;
MJConst.kGrabAnG        = 0x00000010;
MJConst.kGrabLChi       = 0x00000020;
MJConst.kGrabMChi       = 0x00000040;
MJConst.kGrabRChi       = 0x00000080;
MJConst.kGrabBuHUa      = 0x00000100;
MJConst.kGrabPlay       = 0x00000200;
MJConst.kGrabCancel     = 0x00000400;
MJConst.kGrabTing       = 0x00000800;
MJConst.kGrabGetNew     = 0x00001000;
MJConst.kGrabPrevTing   = 0x00002000;

MJConst.kGrabChi   = MJConst.kGrabLChi | MJConst.kGrabMChi | MJConst.kGrabRChi;
MJConst.kGrabGang  =  MJConst.kGrabZG | MJConst.kGrabMXG | MJConst.kGrabAnG;

MJConst.kClientMyPos = 0;