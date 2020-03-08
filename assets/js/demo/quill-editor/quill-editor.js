QuillEditor = (function () {
    var e = $('[data-toggle="quill"]');
    e.length && e.each((function () {
        var e, a;
        e = $(this), a = e.data("quill-placeholder"), new Quill(e.get(0), {
            modules: {toolbar: [["bold", "italic"], ["link", "blockquote", "code", "image"], [{list: "ordered"}, {list: "bullet"}]]},
            placeholder: a,
            theme: "snow"
        })
    }))
})();
