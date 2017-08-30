~function(w,d){

    var A = function(f){if(!window[f])['','webkit','moz','ms'].forEach(function(d){if(window[d+f])window[f]=window[d+f]});return window[f]}

    w.PlayPrompt = function(url){

        this.ac = new (A('AudioContext'))
        this.source = null
        this.audioBuffer = null
        this.times = 0
        this.loadAudioFile(url)
    }

    w.PlayPrompt.prototype.play = function(){
        if(this.audioBuffer)this.playSound()
        else this.times++
    }

    w.PlayPrompt.prototype.playSound = function () {
        delete this.source;
        this.source = this.ac.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.ac.destination);
        this.source.start(0,0);
    }
    w.PlayPrompt.prototype.initSound = function (arrayBuffer) {
        var that = this
        that.ac.decodeAudioData(arrayBuffer, function(buffer) {
            that.audioBuffer = buffer
            for(;that.times > 0;){
                that.times--
                that.playSound()
            }
            
        }, function(e) {
            console.log('Error decoding file', e)
        });
    }

    w.PlayPrompt.prototype.loadAudioFile = function (url) {
        var xhr;
        if(w.XMLHttpRequest)xhr = new w.XMLHttpRequest()
        else if(w.ActiveXObject){
            try{
                xhr = new w.ActiveXObject("Msxml2.HTTP")
            }catch(e){
                try{
                    xhr = new w.ActiveXObject("microsoft.HTTP");
                }catch(e){
                    alert("请升级你的浏览器");
                }
            }
        }
        var that = this;
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            that.initSound(this.response);
        };
        xhr.send();
    }

}(window)