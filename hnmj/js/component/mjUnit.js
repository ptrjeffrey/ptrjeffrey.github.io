/**
 * Created by dell on 2017/3/5.
 */

MJUnit = Node.extend({
    ctor : function(id, isgroup, byteCard, index){
        this._super(id, isgroup);
        this.byteCard = byteCard;
        this.index = index;
        this.MJResForByteCard = {}
        return true;
    },
    setRes : function(res){
        this.MJResForByteCard = res;
    },
    setMJData : function(byteCard){
        this.byteCard = byteCard;
        if (this.MJResForByteCard[byteCard]){
            this.setSprite(this.MJResForByteCard[byteCard]);
        }
    },
    getMJData : function(){
        return this.byteCard;
    }
});