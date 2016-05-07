/**
 * Created by Mic on 15/11/26.
 */

var Global = {
    curPlayer: null,
    curGameLayer: null,
    DESK: {
        DESK_REST: 0,
        DESK_BUSY: 1,
        DESK_FULL: 2,
        DESK_NOFULL: 3,
        DESK_WIN_DIZHU: 4,   //地主胜
        DESK_WIN_FARMER: 5
    },
    ROOM: {
        name: ['', '初级场', '中级场', '高级场']
    },
    PLAYER: {
        PLAYER_NOCALL: 0,
        PLAYER_SELFCALL: 2,
        PLAYER_CALL: 3,
        Status: {
            Room_Money_No: 0,    //choose rooms not enough money
            Desk_Money_No: 1,    //enter desk not enough money
            Disconnect: 2,       //掉线
            Hosting: 3,          //托管
            Normal: 4            //正常
        }
    }

};