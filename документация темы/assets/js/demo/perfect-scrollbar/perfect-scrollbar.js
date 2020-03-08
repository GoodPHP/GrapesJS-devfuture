$((function () {
    if ($(".scrollbar-container")[0]) {

        $('.scrollbar-container').each((function () {
            const ps = new PerfectScrollbar($(this)[0], {
                wheelSpeed: 2,
                wheelPropagation: false,
                minScrollbarLength: 20
            });
        }));
    }
}));
