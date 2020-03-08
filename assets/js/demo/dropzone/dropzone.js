Dropzones = (function () {
    var e = $('[data-toggle="dropzone"]'), a = $(".dz-preview");
    e.length && (Dropzone.autoDiscover = !1, e.each((function () {
        var e, t, n, i, o;
        e = $(this), t = void 0 !== e.data("dropzone-multiple"), n = e.find(a), i = void 0, o = {
            url: e.data("dropzone-url"),
            thumbnailWidth: null,
            thumbnailHeight: null,
            previewsContainer: n.get(0),
            previewTemplate: n.html(),
            maxFiles: t ? null : 1,
            acceptedFiles: t ? null : "image/*",
            init: function () {
                this.on("addedfile", (function (e) {
                    !t && i && this.removeFile(i), i = e
                }))
            }
        }, n.html(""), e.dropzone(o)
    })))
})()
