syntc.RootLayer = syntc.Layer.extend({
    keymapper: {},
    ctor:function (color) {
    	this._super();

        if(typeof color === undef){
            color = cc.color.BLACK;
        }
        this.setBackground(color);
        
        var winSize = cc.director.getWinSize();
        this.width = winSize.width;
        this.height = winSize.height;
    },
    onEnter:function () {
        this._super();
    },
    setBaseLayer: function(node) {
        var ns = node.width / node.height;
        var ss = this.width / this.height;
        
        if(ns < ss){
            node.scale = this.width / node.width;
        }else{
            node.scale = this.height / node.height;
        }
        
        syntc.node.center(node, this);
        this.addChild(node, 0);
    },
    addContentLayer: function(layer, area, fixed) {
        if(typeof area === undef || null == area){
            area = cc.rect(0, 0, this.width, this.height);
        }
        
        var lratio = layer.preferWidth / layer.preferHeight;
        var tratio = area.width / area.height;

        layer.ignoreAnchorPointForPosition(false);
        layer.attr({
            x: area.x + area.width * .5, 
            y: area.y + area.height * .5,
            anchorX: .5,
            anchorY: .5
        });
        if(layer.orient == syntc.portrait) {
            if(lratio > tratio) {
                layer.scale = area.width / layer.preferWidth;
                
                area.width = layer.preferWidth;
                area.height = area.height / layer.scale;
            }else {
                layer.scale = area.height / layer.preferHeight;
                
                area.height = layer.preferHeight;
                
                area.x = area.x + (area.width - layer.preferWidth * layer.scale) * .5;
                area.width = layer.preferWidth;
            }
        } else if(layer.orient == syntc.landscape){
            if(lratio < tratio) {
                layer.scale = area.height / layer.preferHeight;
                
                area.height = layer.preferHeight;
                area.width = area.width / layer.scale;
            }else {
                layer.scale = area.width / layer.preferWidth;
                
                area.width = layer.preferWidth;
                area.y = area.y + (area.height - layer.preferHeight * layer.scale) * .5;
                area.height = layer.preferHeight;
            }
        } else if(layer.orient == syntc.landscape_left_from_portrait) {
            layer.rotation = 90;
            tratio = 1./tratio;
            
            if(lratio < tratio) {
                layer.scale = area.width / layer.preferHeight;
                
                area.width = area.height / layer.scale;
                area.height = layer.preferHeight;
                
            }else {
                layer.scale = area.height / layer.preferWidth;
                
                area.height = layer.preferHeight;
                
                area.x = area.x + (area.width - layer.preferHeight * layer.scale) * .5;
                area.width = layer.preferWidth;
            }
            
        } else if(layer.orient == syntc.landscape_right_from_portrait) {
            layer.rotation = 270;
            tratio = 1./tratio;
            
            if(lratio < tratio) {
                layer.scale = area.width / layer.preferHeight;
                
                area.width = area.height / layer.scale;
                area.height = layer.preferHeight;
            }else {
                layer.scale = area.height / layer.preferWidth;
                
                area.height = layer.preferHeight;
                
                area.x = area.x + (area.width - layer.preferHeight * layer.scale) * .5;
                area.width = layer.preferWidth;
            }
        }
        
        if(fixed){
            layer.width = layer.preferWidth;
            layer.height = layer.preferHeight;
        }else{
            layer.width = area.width;
            layer.height = area.height;
        }
        
        if(layer.initComps)
        	layer.initComps();
        this.addChild(layer, 1);
    }
});

