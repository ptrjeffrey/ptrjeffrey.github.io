/**
 * Created by Mic on 15/9/18.
 */

var BaseLayer = cc.Layer.extend({
    _className: "BaseLayer",
    _background: null,
    ctor: function () {
        this._super();
    },
    setBackgroundColor: function (color) {
        if (this._background) {
            this._background.removeFromParent(true);
            this._background = null;
        }
        if (!color)
            color = GC.color_BG;

        this._background = new cc.LayerColor(color);

        this.addChild(this._background, -1);
    },
    setBackground: function (bg, isfill) {
        if (this._background) {
            this._background.removeFromParent(true);
            this._background = null;
        }
        if (bg instanceof cc.Node) {
            this._background = bg;

            if (isfill) {
                bg.scaleX = this.width / bg.width;
                bg.scaleY = this.height / bg.height;
            } else {
                var ws = this.width / bg.width;
                var hs = this.height / bg.height;

                if (ws < hs) {
                    bg.scale = ws;
                } else {
                    bg.scale = hs;
                }
            }
            bg.setPosition(this.width / 2, this.height / 2);
            bg.setAnchorPoint(.5, .5);
        } else if (typeof bg === 'string') {
            return this.setBackground(new cc.Sprite(bg), isfill);
        }

        this.addChild(this._background, -1);
    },
    showReturnBtn: function (info, classname) {
        var systemMenu = new cc.MenuItemFont(info, function () {
            cc.director.runScene(new classname());
        });
        systemMenu.setColor(GC.color_Black);
        var menu = new cc.Menu(systemMenu);
        menu.x = 0;
        menu.y = 0;
        systemMenu.attr({
            x: GC.w - 100,
            y: 100,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(menu, 1, 2);
        return systemMenu;
    },
    pauseEvent: function (recursive) {
        if (recursive != false) {
            cc.eventManager.pauseTarget(this, true);
        } else {
            cc.eventManager.pauseEvent(this, false);
        }
    },
    resumeEvent: function (recursive) {
        if (recursive !== false)
            cc.eventManager.resumeTarget(this, true);
        else
            cc.eventManager.resumeTarget(this, false);
    },
    show: function (parent) {
        if (!this.visible) {
            if (parent && parent.pauseEvent) {
                parent.pauseEvent();
            }

            this.visible = true;
            this.resumeEvent();
        }
    },
    hide: function (parent) {
        if (this.visible) {
            this.pauseEvent();
            this.visible = false;

            if (parent && parent.resumeEvent()) {
                parent.resumeEvent();
            }
        }
    },
    createScale9Sprite: function (filename, rect, size, pos) {
        var sprite = new cc.Scale9Sprite;
        if (filename && filename.substr(0, 1) == '#') {
            filename = filename.substr(1);
        }
        cc.log(filename, rect, size, pos);
        //sprite.initWithSpriteFrame(filename, rect);
        //sprite.initWithSpriteFrame(filename);
        sprite.initWithFile(filename);
        sprite.setContentSize(size);
        sprite.setAnchorPoint(.5, .5);
        if (pos !== undefined)
            sprite.setPosition(pos);
        //this.addChild(sprite);
        return sprite;
    },
    createMenuItemSprite: function (normalFileName, selectedFileName, pos, callback) {
        var menuItem = new cc.MenuItemSprite();
        if (cc.isFunction(selectedFileName) && callback) {

        }
        menuItem.normal = new cc.Sprite(normalFileName);
        menuItem.selector = new cc.Sprite(selectedFileName);
        menuItem.selector.setPosition(menuItem.normal.width / 2, menuItem.height / 2);
        menuItem.selector.setAnchorPoint(.5, .5);
        menuItem.normal.addChild(menuItem.selector);
        menuItem.setNormalImage(menuItem.normal);
        menuItem.setSelectedImage(menuItem.selector);
        menuItem.setCallback(callback, this);
        menuItem.attr({
            x: pos.x,
            y: pos.y,
            anchorX: .5,
            anchorY: .5
        });

        return menuItem;
    },
    menuSprite: function (normalFileName, selectedFileName, pos, callback, target) {
        var normal = new cc.Sprite(normalFileName);
        var selected = new cc.Sprite(selectedFileName);
        selected.scale = 1.05;
        var menuSp = new cc.MenuItemSprite(normal, selected, callback, target);
        tool.node.center(selected, normal);
        tool.node.pos(menuSp, pos.x,pos.y, .5, .5);

        return menuSp;
    },
    createListView: function (bg) {

        var listView = new ccui.ListView();
        listView.setBounceEnabled(false);
        listView.setBackGroundImage(bg);
        listView.setBackGroundImageScale9Enabled(true);

        return listView;
    },
    createCustomItem: function (imgFiles, size, callback) {
        var custom_button = new ccui.Button();
        custom_button.setName("Skill Button");
        custom_button.setTouchEnabled(true);
        custom_button.setScale9Enabled(true);
        custom_button.loadTextures(imgFiles[0]);
        custom_button.setContentSize(size);

        var custom_item = new ccui.Layout();
        custom_item.setContentSize(custom_button.getContentSize());
        custom_button.x = custom_item.width / 2;
        custom_button.y = custom_item.height / 2 - 10;
        custom_item.addChild(custom_button);
        custom_item.custom_button = custom_button;

        custom_item.callback = callback;

        return custom_item;
    },
    createLabelTTF: function (string, pos, font, color) {
        var label = new cc.LabelTTF(string, "STHeiti", 24);
        label.fillStyle = cc.color(46, 121, 199);
        label.setPosition(pos);

        return label;
    },
    createProgressBar: function (barFile, bgFile, pos, size) {
        var sprite, bg;
        if (bgFile instanceof cc.Node) {
            bg = bgFile;
        } else {
            bg = new cc.Sprite(bgFile);
        }
        bg.setAnchorPoint(0, 0);
        bg.setColor(cc.color.RED);

        //var p = this.initScale9Sprite(res.test1_png,cc.rect(10,10,1,1),cc.size(200,50));
        if (barFile instanceof cc.Node) {
            sprite = barFile;
        } else {
            sprite = new cc.Sprite(barFile);
        }
        var progressBar = new cc.ProgressTimer(sprite);
        progressBar.setAnchorPoint(.5, .5);
        progressBar.setBarChangeRate(cc.p(1, 0));
        progressBar.addChild(bg, -1);
        progressBar.bg = bg;
        progressBar.sprite = sprite;
        progressBar.setPosition(pos);
        progressBar.setMidpoint(cc.p(0, 1));

        return progressBar;
    },
    createMenuItemLabel: function (label, pos, cb) {
        if (!(label instanceof cc.Node)) {
            label = new cc.LabelTTF(label, 'Arial', 30);
        }
        var item = new cc.MenuItemLabel(label, cb);
        tool.node.pos(item, pos.x, pos.y, .5, .5);

        return item;
    },
    createLabel: function () {
        var zhu = new cc.LabelTTF("注：注册绑定成为会员后记录最高分，游戏不限次数，分数不重复累计。",
            "STHeiti", 24, cc.size(480, 70), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        zhu.fillStyle = cc.color(46, 121, 199);
        zhu.opacity = 255 * .9;
        zhu.setLineHeight(30);
        syntc.node.pos(zhu, this.width / 2, 40, .5, 0);
        this.addChild(zhu);
    },
    gameClipping: function (fileName, highLightFileName, isScale) {
        var star1 = cc.Sprite.create(fileName);
        var clipper = cc.ClippingNode.create();
        var star = cc.Sprite.create(fileName);
        clipper.setStencil(star);
        clipper.setAlphaThreshold(0);
        clipper.setContentSize(star.getContentSize());
        if (isScale)
            star.scale = .8;
        //syntc.node.center(star, clipper);
        //syntc.node.center(clipper, star1);
        star1.addChild(clipper);
        var clipSize = clipper.getContentSize();

        var spark = cc.Sprite.create(highLightFileName);
        //syntc.node.center(spark, clipper);
        clipper.addChild(spark, 2);

        var moveAction = cc.MoveTo.create(0.8, cc.p(clipSize.width + spark.width * .5, spark.height * .5));
        var moveBackAction = cc.MoveTo.create(0, cc.p(-clipSize.width + spark.width * .5, spark.height * .5));
        var delay = cc.DelayTime.create(2);
        var seq = cc.Sequence.create(moveAction, delay, moveBackAction);
        var repeatAction = cc.RepeatForever.create(seq);
        spark.runAction(repeatAction);
        return star1;
    }

});