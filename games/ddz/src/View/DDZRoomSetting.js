/**
 * Created by Mic on 15/12/20.
 */

var DDZRoomSetting = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 150));
    },
    initComps: function () {
        var bg = new cc.Sprite('#Room_setting_bg.png');
        tool.node.pos(bg, this.width / 2, this.height * .8);
        this.addChild(bg);
        this.bg = bg;
        this.bg.visible = false;

        var exitBtn = new MenuButton("Room_setting_exit1.png", "Room_setting_exit2.png", cc.p(bg.width - 50, bg.height - 50));
        exitBtn.addTouchEventListener(this.exitPress, this);
        exitBtn.scale = .8;
        bg.addChild(exitBtn);

        var musicSlider = new ccui.Slider();
        musicSlider.setTouchEnabled(true);
        musicSlider.loadBarTexture("Room_setting_barp.png",ccui.Widget.PLIST_TEXTURE);
        musicSlider.loadSlidBallTextures("Room_setting_btn.png", "Room_setting_btn.png", "",ccui.Widget.PLIST_TEXTURE);
        musicSlider.loadProgressBarTexture("Room_setting_bar.png",ccui.Widget.PLIST_TEXTURE);
        musicSlider.addEventListener(this.musicSliderEvent, this);
        bg.addChild(musicSlider);
        tool.node.pos(musicSlider,bg.width/2+33,bg.height *.5+11);
        musicSlider.setPercent(50);

        var soundSlider = new ccui.Slider();
        soundSlider.setTouchEnabled(true);
        soundSlider.loadBarTexture("Room_setting_barp.png",ccui.Widget.PLIST_TEXTURE);
        soundSlider.loadSlidBallTextures("Room_setting_btn.png", "Room_setting_btn.png", "",ccui.Widget.PLIST_TEXTURE);
        soundSlider.loadProgressBarTexture("Room_setting_bar.png",ccui.Widget.PLIST_TEXTURE);
        soundSlider.addEventListener(this.soundSliderEvent, this);
        bg.addChild(soundSlider);
        tool.node.pos(soundSlider,bg.width/2+33,bg.height *.3+20);
        soundSlider.setPercent(50);
    },
    musicSliderEvent: function (sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var slider = sender;
                var percent = slider.getPercent();
                percent =  percent.toFixed(0);
                cc.audioEngine.setMusicVolume(percent/100);
                break;
            default:
                break;
        }
    },
    soundSliderEvent: function (sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var slider = sender;
                var percent = slider.getPercent();
                percent =  percent.toFixed(0);
                cc.audioEngine.setEffectsVolume(percent/100);
                break;
            default:
                break;
        }
    },
    displayEff: function () {
        this.bg.runAction(cc.sequence(cc.scaleTo(.01, .2), cc.callFunc(function () {
                this.bg.visible = true;
            }, this),
            cc.scaleTo(.3, .9).easing(cc.easeIn(.3))));
    },
    exitPress: function (object, type) {
        if (type == 2) {
            this.hide();
        }
    },
    show: function () {
        this.visible = true;
        this.displayEff();
    },
    hide: function () {
        this.visible = false;
        if (this.bg)
            this.bg.visible = false;
    }
});