syntc.Layer =  cc.Layer.extend({
	_background: null,
	ctor: function(){
		this._super();
	},
	setBackground: function(color){
		if(!this._background){
			this._background = new cc.LayerColor(color);
			syntc.layer.fit(this._background, this);
			this.addChild(this._background, -1);
		}
	},
	pauseEvent: function(recursive){
		if(recursive !== false)
			cc.eventManager.pauseTarget(this, true);
		else
			cc.eventManager.pauseTarget(this, false);
	},
	resumeEvent: function(recursive){
		if(recursive !== false)
			cc.eventManager.resumeTarget(this, true);
		else
			cc.eventManager.resumeTarget(this, false);
	},
	show: function(parent){
		if(parent && parent.pauseEvent){
			parent.pauseEvent();
		}
		this.visible = true;
		this.resumeEvent();
	},
	hide: function(parent){
		this.visible = false;
		this.pauseEvent();
		if(parent && parent.resumeEvent){
			parent.resumeEvent();
		}
	}
});