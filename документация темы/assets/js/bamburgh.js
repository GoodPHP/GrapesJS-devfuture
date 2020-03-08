// Bamburgh Layout


// Collapse sidebar

$((function () {
    $('.toggle-sidebar').click((function () {
        $('body').toggleClass('sidebar-collapsed');
        $('.toggle-sidebar').toggleClass('is-active');
    }))
}));

// Responsive menu

$((function () {
    $('.toggle-sidebar-mobile, .sidebar-mobile-overlay').click((function () {
        $('body').toggleClass('sidebar-open-mobile');
        $('.toggle-sidebar-mobile').toggleClass('is-active');
    }))
}));

// Responsive inner menu

$((function () {
    $('.toggle-inner-sidebar').click((function () {
        var targetSidebar = $(this).attr('data-target');
        $(targetSidebar).toggleClass('sidebar-inner-open');
        $('.sidebar-inner-mobile-overlay').toggleClass('active');
    }))
}));

$((function () {
    $('.sidebar-inner-mobile-overlay').click((function () {
        $(this).removeClass('active');
        $('.app-content--sidebar').removeClass('sidebar-inner-open');
    }))
}));
