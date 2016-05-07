/**
 * Created by Mic on 15/11/23.
 */

var Api = {
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