// Datatables init

Datatables = (function () {
    var e = $('[data-toggle="datatable"]');
    e.DataTable({
        responsive: true,
        autoFill: true,
        keys: true,
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "dom": '<"row"<"col-md-6 d-flex align-items-center"B><"col-md-6 d-flex align-items-center" f><"col-md-12"<"divider"> i>><t><"table-footer-wrapper" <"divider"> <"row"<"col-md-6 d-flex align-items-center" l><"col-md-6 d-flex align-items-center" p>>>',
        buttons: [
            'copy'
        ],

        "columnDefs": [{
            "targets": 'no-sort',
            "orderable": false,
        }]
    });
})();
