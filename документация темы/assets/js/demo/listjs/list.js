SortableTable = (function () {
    var e = $('[data-toggle="sortable-table"]'), a = $("[data-sort]");
    e.length && e.each((function () {
        var e;
        e = $(this), new List(e.get(0), (function (e) {
            return {valueNames: e.data("list-values"), listClass: e.data("list-class") ? e.data("list-class") : "list"}
        })(e))
    })), a.on("click", (function () {
        return !1
    }))
})();
