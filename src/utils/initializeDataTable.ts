// function initializeDataTable(tableId, options = {}) {
//   const defaultOptions = {
//     info: false,
//     scrollX: true,
//     scrollCollapse: true,
//     dom: '<"top">flprt<"clear">',
//     fixedHeader: {
//       header: true,
//       topOffset: 100,
//     },
//     initComplete: function () {
//       var api = this.api();
//       var placeholderText = "Search...";
//       $(".custom-pagination div.dt-container div.dt-search input").attr(
//         "placeholder",
//         placeholderText
//       );
//       if (api.page.info().pages <= 1) {
//         $(".dt-paging").hide();
//       }
//     },
//     columnDefs: [],
//   };

//   const finalOptions = $.extend(true, {}, defaultOptions, options);

//   $(tableId).DataTable(finalOptions);
// }
