// Bootstrap Tooltips

$((function () {

    // Regular

    $('[data-toggle="tooltip"]').tooltip();

    // Advanced

    $('.tooltip-custom').each((function () {
        $(this).tooltip(
            {
                html: true,
                title: $('#' + $(this).data('tip')).html()
            });
    }));
}));


$(document).on('inserted.bs.tooltip', (function (e) {
    var tooltip = $(e.target).data('bs.tooltip');
    $(tooltip.tip).addClass($(e.target).data('tooltip-class'));
}));


// Bootstrap Popovers

$((function () {

    // Regular

    $('[data-toggle="popover"]').popover();

    // Advanced

    $('.popover-custom').each((function () {
        $(this).popover(
            {
                html: true,
                content: function () {
                    return $('#' + $(this).data('tip')).html();
                }
            });
    }));
}));

$(document).on('inserted.bs.popover', (function (e) {
    var popover = $(e.target).data('bs.popover');
    $(popover.tip).addClass($(e.target).data('popover-class'));
}));


// Bootstrap popover close on outside click

$('body').on('click', (function (e) {
    $('[data-rel="popover-close-outside"]').each((function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    }));
}));

// Remove href functionality from href="#"

$('a[href="#"]').click((function (a) {
    a.preventDefault()
}));

