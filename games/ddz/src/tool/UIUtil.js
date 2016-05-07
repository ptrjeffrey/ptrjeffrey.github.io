//***************
//*    UIButton
//***************
(function(){
    var MenuButton = ccui.Button.extend({

        ctor:function ( image1,image2,pos ) {
            this._super();

            this.setTouchEnabled( true );
            this.loadTextures(image1,image2,"", ccui.Widget.PLIST_TEXTURE);
            this.setPosition(pos);
            this.setAnchorPoint(.5,.5);

            return true;
        }

    });
    this.MenuButton = MenuButton;
}).call(this);