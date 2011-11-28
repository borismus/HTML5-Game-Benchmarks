define([ 'util/ensureCallback', 'sprites/canvas' ], function (ensureCallback, canvas) {
    function RenderContext(sourceData, frameData) {
        this.sourceData = sourceData;
        this.frameData = frameData;

        this.canvas = canvas();

        this.context = this.canvas.getContext('2d');
        this.context.globalCompositeOperation = 'source-over';
    }

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        document.body.appendChild(this.canvas);

        callback(null);
    };

    RenderContext.prototype.unload = function unload() {
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    };

    RenderContext.prototype.renderFrame = function renderFrame(frameIndex) {
        var transforms = this.frameData[frameIndex];
        var previousTransforms = this.previousTransforms;

        var context = this.context;
        var sourceData = this.sourceData;

        var count = transforms.length;

        // Reset view and transforms
        context.canvas.width = context.canvas.width;

        for (i = 0; i < count; ++i) {
            var m = transforms[i].matrix;
            context.setTransform(m[0], m[1], m[3], m[4], m[2], m[5]);
            sourceData.drawToCanvas(context, 0, 0, frameIndex);
        }

        this.previousTransforms = transforms;
    };

    return function (element, frameData) {
        return new RenderContext(element, frameData);
    };
});
