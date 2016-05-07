var ScrollNode = cc.Node.extend({
    scrollvbarStyle: null,//"scroll_vbar.png",
    scrollhbarStyle: null,//"scroll_hbar.png",
    scrollvbarDimension: cc.size(8 ,60),
    scrollhbarDimension: cc.size(60, 8),
    bottomGapping: 20,
    initComps: function(v, h){
        
        this.selectItems = [];
        
        this._content = new cc.Node();
        this._content.setContentSize(this.width, 0);
                
        this._scrollview = cc.ScrollView.create(cc.size(this.width, this.height), this._content);
        this._scrollview.ignoreAnchorPointForPosition(false);
        syntc.node.pos(this._scrollview, 0, 0, 0, 0);
        
        if(v && h){
            this._scrollview.direction = cc.SCROLLVIEW_DIRECTION_BOTH;
        }else if(v){
            this._scrollview.direction = cc.SCROLLVIEW_DIRECTION_VERTICAL;
        }else if(h){
            this._scrollview.direction = cc.SCROLLVIEW_DIRECTION_HORIZONTAL;
        }else{
            this._scrollview.direction = cc.SCROLLVIEW_DIRECTION_NONE;
        }
        
        this.addChild(this._scrollview);
        
        if(v){
            this.supportv = true;

            if(this.scrollvbarStyle){
                this._scrollvbar = new cc.Scale9Sprite;
                this._scrollvbar.initWithSpriteFrameName(this.scrollvbarStyle, cc.rect(0, this.scrollvbarDimension.width, 
                        this.scrollvbarDimension.width, 
                        this.scrollvbarDimension.height - 2 * this.scrollvbarDimension.width));
                this._scrollvbar.setContentSize(this.scrollvbarDimension);
                syntc.node.pos(this._scrollvbar, this.width - 2, this.height - 2, 1, 1);
                this._scrollvbar.opacity = 0;
                this.addChild(this._scrollvbar);
            }
        }
        
        if(h){
            this.supporth = true;
            
            if(this.scrollhbarStyle){
                this._scrollhbar = new cc.Scale9Sprite;
                this._scrollhbar.initWithSpriteFrameName(this.scrollhbarStyle, cc.rect(this.scrollhbarDimension.height, 0, 
                        this.scrollhbarDimension.width - 2 * this.scrollhbarDimension.height, this.scrollhbarDimension.height));
                this._scrollhbar.setContentSize(this.scrollhbarDimension);
                syntc.node.pos(this._scrollhbar, 2, 2, 0, 0);
                this._scrollhbar.opacity = 0;
                this.addChild(this._scrollhbar);
            }
        }

        this._scrollview.setContentOffset(cc.p(0, this._scrollview.height - this._content.height), false);
        
        var self = this;
        this._scrollview.setDelegate({
            scrollViewDidScroll:function (view) {
                var offset = view.getContentOffset();

                if(self.supportv && self._scrollvbar){
                    self._scrollvbar.opacity = 255 * .8;
                    self._scrollvbar.stopAllActions();
                    self._scrollvbar.runAction(cc.sequence(cc.delayTime(.2), cc.fadeOut(.6)));   

                    var minoffset = view.minContainerOffset().y;
                    //cc.log("min "+minoffset);

                    if(minoffset <= 0){
                        //cc.log("a "+minoffset);
                        var ratio = offset.y / minoffset;                    
                        posratio = Math.min(1.,Math.max(0, ratio));

                        var cratio = Math.min(1., Math.max(0., 1. - Math.abs(ratio - posratio) * 2));
                        self._scrollvbar.setContentSize(self._scrollvbar.width, 20 + (self.scrollvbarDimension.height - 20)*cratio);

                        self._scrollvbar.y = self._scrollvbar.height + posratio * (self.height - 4 - self._scrollvbar.height);

                    }else{
                        var ratio = 2 - offset.y / minoffset;
                        posratio = Math.min(1.,Math.max(0, ratio));
                        var cratio = Math.min(1., Math.max(0., 1. - Math.abs(ratio - posratio) * 2));
                        self._scrollvbar.setContentSize(self._scrollvbar.width, 20 + (self.scrollvbarDimension.height - 20)*cratio);
                        self._scrollvbar.y = self._scrollvbar.height + posratio * (self.height - 4 - self._scrollvbar.height);
                    }
                }
                
                if(self.supporth && self._scrollhbar){
                    self._scrollhbar.opacity = 255 * .8;
                    self._scrollhbar.stopAllActions();
                    self._scrollhbar.runAction(cc.sequence(cc.delayTime(.2), cc.fadeOut(.6))); 
                    
                    var minoffset = view.minContainerOffset().x;
                    //cc.log("min "+minoffset+" "+self._content.width );
                    
                    if(minoffset <= 0){
                        var ratio = offset.x / minoffset;                    
                        posratio = Math.min(1.,Math.max(0, ratio));

                        var cratio = Math.min(1., Math.max(0., 1. - Math.abs(ratio - posratio) * 2));
                        self._scrollhbar.setContentSize(20 + (self.scrollhbarDimension.width - 20)*cratio, self._scrollhbar.height);
                        self._scrollhbar.x = posratio * (self.width - 4 - self._scrollhbar.width);

                    }else{
                        //cc.log("b "+offset.x +' '+minoffset);
                        var ratio = 2 - offset.x / minoffset;
                        posratio = Math.min(1.,Math.max(0, ratio));
                        var cratio = Math.min(1., Math.max(0., 1. - Math.abs(ratio - posratio) * 2));
                        self._scrollhbar.setContentSize(20 + (self.scrollhbarDimension.width - 20)*cratio, self._scrollhbar.height);
                        self._scrollhbar.x = posratio * (self.width - 4 - self._scrollhbar.width);
                    }                   
                }
                
                
                if(self.delegate && self.delegate.scrollViewDidScroll){
                    self.delegate.scrollViewDidScroll(view);
                }
            },
            scrollViewDidZoom:function (view) {
                if(self.delegate && self.delegate.scrollViewDidZoom){
                    self.delegate.scrollViewDidZoom(view);
                }
            }
        });
        
    },
    onEnter: function(){
        this._super();
        //cc.log("schedule update");
    },
    onExit: function(){
        this._super();
    },
    addContent: function(content, selectable){
        var theight = content.getBoundingBox().y + content.getBoundingBox().height + this.bottomGapping;
        
        if(theight > this._content.height){
            var deltay = theight - this._content.height;
            this._content.height = theight;
            
            var children = this._content.children;
            for(var i=0; i<children.length; ++i){
                children[i].y += deltay;
            }
        }else{
            theight = this._content.height;
        }
        
        content.y = theight - content.y;
        content.anchorY = 1. - content.anchorY;
        
        var twidth = content.getBoundingBox().x + content.getBoundingBox().width;
        
        if(twidth > this._content.width){
            this._content.width = twidth;
        }
        
        this._content.addChild(content);
        
        if(selectable){
            this.selectItems.push(content);
            
            if(!this._touchListener){

                this._touchListener = {
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: true,
                        onTouchBegan: this.onTouchBegan,
                        onTouchMoved: this.onTouchMoved,
                        onTouchEnded: this.onTouchEnded
                };

                cc.eventManager.addListener(this._touchListener, this);
                //cc.log("add listener");
            }
        }
        
        this._scrollview.setContentOffset(cc.p(0, this.height - this._content.height), false);
    },
    updateui: function(){
        var theight = 0;
        
        var children = this._content.children;
        for(var i=0; i<children.length; ++i){
            theight = Math.max(theight, children[i].getBoundingBox().y + children[i].getBoundingBox().height);
        }
        
        if(theight != this._content.height){
            var deltay = theight - this._content.height;
            this._content.height = theight;
            
            var children = this._content.children;
            for(var i=0; i<children.length; ++i){
                children[i].y += deltay;
            }
        }
        this._scrollview.setContentOffset(cc.p(0, this.height - this._content.height), false);
    },
    setContentHeight: function(h){
        this._content.height = h;
        this._scrollview.setContentOffset(cc.p(0, this.height - this._content.height), false);
    },
    getContentOffset: function(){
        return this._scrollview.getContentOffset();
    },
    onTouchBegan : function(touch, event){
        var target = event.getCurrentTarget(); 

        //cc.log("touch "+target.tag);
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        
        if(cc.rectContainsPoint(cc.rect(0,0, target.width, target.height), locationInNode)){
            target.beganTouch = locationInNode;

            var contentOffset = target.getContentOffset();
            var offsetLocation = cc.p(locationInNode.x - contentOffset.x, locationInNode.y - contentOffset.y);

            //cc.log("targets "+target.tag+" "+target.selectItems.length);
            for(var idx in target.selectItems){
                var item = target.selectItems[idx];

                if(cc.rectContainsPoint(item.getBoundingBox(), offsetLocation)) {               
                    target.selectedItem = item;

                    if(target.delegate && target.delegate.onScrollTouchBegan){
                        target.delegate.onScrollTouchBegan(item, cc.p(offsetLocation.x - item.getBoundingBox().x, 
                                offsetLocation.y - item.getBoundingBox().y));
                    }
                    //cc.log("t "+target.tag);
                    return true;
                }
            }
        }

        return false;
    },
    onTouchMoved : function(touch, event){
        var target = event.getCurrentTarget(); 

        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        
        if(Math.abs(locationInNode.x - target.beganTouch.x) + Math.abs(locationInNode.y - target.beganTouch.y) > 50){
            target.selectedItem = null;
            
            if(target.delegate && target.delegate.onScrollTouchEnd){
                target.delegate.onScrollTouchEnd(null);
            }
        }
    },
    onTouchEnded : function(touch, event){
        var target = event.getCurrentTarget(); 

        if(target.selectedItem){
            if(target.delegate && target.delegate.onScrollTouchEnd){
                target.delegate.onScrollTouchEnd(target.selectedItem);
            }
            target.selectedItem = null;
        }
    },
});