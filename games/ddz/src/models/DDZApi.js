
DDZApi = {
    curPos: [],
    convertToDeskPos: function (playerList, seatIndex, next) {
        var clientPos = 0;
        var player = null;
        for (var i = 0; i < playerList.length; i++) {
            player = playerList[i];
            if (player) {
                clientPos = (player.seatIndex + playerList.length - seatIndex) % playerList.length;
                if (clientPos == 2) {
                    clientPos = 3;
                }
                this.curPos[i] = clientPos + 1;
                next(player, clientPos + 1);
            }
        }
    },
    readMsg: function (result) {
        var msg = '';
        switch (result) {
            case 0:
                msg = "错误代码 " + result;
                break;
            case 1:
                msg = "你的金币太少了，去充点吧~";
                break;
            case 2:
                msg = "请去高级场，不要虐菜~";
                break;
        }
        return msg;
    },
    getCardType: function(cards){
        var type = null;
        var maxv = null;

        type = "single";
        maxv = DDZRule.isSingle(cards);
        if(maxv === false){
            type = "rocket";
            maxv = DDZN3Rule.isRocket(cards);
            if(maxv){
                maxv = 'E2';
            }
        }

        if(maxv === false){
            type = "pair";
            maxv = DDZRule.isPair(cards);
        }

        if(maxv === false){
            type = "triplet";
            maxv = DDZRule.isTriplet(cards);
        }

        if(maxv === false){
            type = "bomb";
            maxv = DDZRule.isBomb(cards);
        }

        if(maxv === false){
            type = "tripletSingle";
            maxv = DDZN3Rule.isTripletSingle(cards);
        }

        if(maxv === false){
            type = "tripletPair";
            maxv = DDZRule.isTripletPair(cards);
        }

        if(maxv === false){
            type = "sequence";
            maxv = DDZRule.isSequence(cards);
        }

        if(maxv === false){
            type = "sequencePair";
            maxv = DDZRule.isSequencePair(cards);
        }

        if(maxv === false){
            type = "sequenceTriplet";
            maxv = DDZRule.isSequenceTriplet(cards);
        }

        if(maxv === false){
            type = "quadplex1";
            maxv = DDZN3Rule.isQuadplex1(cards);
        }

        if(maxv === false){
            type = "quadplex2";
            maxv = DDZN3Rule.isQuadplex2(cards);
        }

        if(maxv === false){
            type = "sequenceTripletSingle";
            maxv = DDZN3Rule.isSequenceTripletSingle(cards);
        }

        if(maxv === false){
            type = "sequenceTripletPair";
            maxv = DDZRule.isSequenceTripletPair(cards);
        }

        if(!maxv) type = '';
        return {'type': type, 'maxv': maxv};
    }
};

