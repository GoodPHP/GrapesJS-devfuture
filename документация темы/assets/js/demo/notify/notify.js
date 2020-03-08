// Notify

Notify = (function () {
    var e = $('[data-toggle="notify"]');
    e.length && e.on("click", (function (e) {
        e.preventDefault(),
            (function (e, a, t, n, i, o, l, m) {
                $.notify({
                    icon: t,
                    title: l,
                    message: m,
                    url: ""
                }, {
                    element: "body",
                    type: n,
                    newest_on_top: true,
                    showProgressbar: true,
                    allow_dismiss: true,
                    placement: {from: e, align: a},
                    offset: {x: 15, y: 15},
                    spacing: 10,
                    z_index: 1080,
                    delay: 1500,
                    timer: 2500,
                    url_target: "_blank",
                    mouse_over: !1,
                    animate: {enter: i, exit: o},
                    template:
                        '<div data-notify="container" class="alert alert-dismissible text-white-50 shadow-sm alert-notify" role="alert">\n' +
                        '    <div class="alert-wrapper-bg bg-{0}"></div>\n' +
                        '    <div class="alert-content-wrapper">\n' +
                        '        <span class="alert-icon text-white" data-notify="icon"></span>\n' +
                        '        <div class="pl-3">\n' +
                        '            <span class="alert-title text-white" data-notify="title">{1}</span>\n' +
                        '            <div data-notify="message" class="alert-text">{2}</div>\n' +
                        '        </div>\n' +
                        '    </div>\n' +
                        '    <button type="button" class="close" data-notify="dismiss" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
                        '</div>'
                })
            })($(this).attr("data-placement"), $(this).attr("data-align"), $(this).attr("data-icon"), $(this).attr("data-type"), $(this).attr("data-animation-in"), $(this).attr("data-animation-out"), $(this).attr("data-title"), $(this).attr("data-message"))
    }))
})();
