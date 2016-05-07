var KEY_SOUND = "daba_setting_sound";
var KEY_MUSIC = "daba_setting_music";

var game = {
    start: function () {
        game.sound.syncConfig();
    },
    preferPhone: function (layer) {
        layer.preferWidth = 640;
        layer.preferHeight = 960;
        layer.orient = syntc.portrait;
        //if (cc.sys.os == "Android") {
        //    layer.preferWidth = 640;
        //    layer.preferHeight = 800;
        //}
    },
    preferPhoneLandscape: function (layer) {
        layer.preferWidth = 800;
        layer.preferHeight = 640;
        layer.orient = syntc.landscape_right_from_portrait;
    },
    fonts: {
        helvetica: "HelveticaNeue-Light",
        helveticaBold: "HelveticaNeue-Bold",
        helveticaMedium: "HelveticaNeue-Medium",
        helveticaBold2: "HelveticaNeue-CondensedBlack",
        droid: "Droid Sans Fallback"
    },
    sound: {
        enableMusic: true,
        enableSound: true,
        syncConfig: function () {
            this.enableMusic = (cc.sys.localStorage.getItem(KEY_MUSIC) || "true") == "true";
            this.enableSound = (cc.sys.localStorage.getItem(KEY_SOUND) || "true") == "true";
        },
        playingMusic: null,
        playMusic: function (music) {
            //cc.log("play "+music);
            if (music != this.playingMusic) {
                //cc.log("music playing "+cc.audioEngine.isMusicPlaying());
                if (cc.audioEngine.isMusicPlaying()) {
                    cc.audioEngine.stopMusic();
                }
                this.playingMusic = music;
                this.updateMusic();
            }
        },
        playSound: function (sound) {
            //if (this.enableSound) {
            //    cc.audioEngine.playEffect(sound);
            //}
            cc.audioEngine.playMusic(sound, false);
        },
        playBtnSound: function () {
            //this.playSound(res.lobby.sound_btn);
        },
        updateMusic: function () {
            if (this.enableMusic) {
                if (!cc.audioEngine.isMusicPlaying() && this.playingMusic) {
                    cc.audioEngine.stopMusic();
                    cc.audioEngine.playMusic(this.playingMusic, true);
                    if (!cc.audioEngine.isMusicPlaying()) {
                        cc.audioEngine.playMusic(this.playingMusic, true);
                    }
                    if (!cc.audioEngine.isMusicPlaying()) {
                        this.playingMusic = null;
                    }
                }
            } else {
                if (cc.audioEngine.isMusicPlaying()) {

                    cc.audioEngine.stopMusic();
                }
            }
        }
    }
};