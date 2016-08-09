(function($) {

	DMAG.dataTable = {
		init: function() {
			$('.datatable').each(function() {
				var table = $(this);
				var options = {
					"info": false,
					"paging": false,
					"searching": false,
					"pageLength": 500
				};
				if (table.data('info')) {
					options['info'] = new Boolean(table.data('info'));
				}
				if (table.data('paging')) {
					options['paging'] = new Boolean(table.data('paging'));
				}
				if (table.data('searching')) {
					options['searching'] = new Boolean(table.data('searching'));
				}
				if (table.data('page-size')) {
					options['pageLength'] = table.data('page-size');
				}
				if (table.data('sort')) {
					var dir = table.data('sort-order') || 'asc';
					var col = new Number(table.data('sort'));
					options['order'] = [col-1, dir];
				}
				var dt = table.dataTable(options);
				var dataTable = $('#' + dt.attr('id')).DataTable();
				var columns = dataTable.settings()[0].aoColumns;
				$.each(columns, function(index, item) {
					var th = $('#DataTables_Table_0 tr th:nth-child(' + (index + 1) + ')');
					var column = this;
					var columnIndex = index;
					var sType = th.data('type') || column.sType;
					if (th.data().hasOwnProperty('nowrap')) {
						$('#DataTables_Table_0 tr td:nth-child(' + (columnIndex + 1) + ')').attr('nowrap','nowrap');
					}
					if (th.hasClass('hidden-tablet')) {
						$('#DataTables_Table_0 tr td:nth-child(' + (columnIndex + 1) + ')').addClass('hidden-tablet');
					}
					if (th.hasClass('hidden-phone')) {
						$('#DataTables_Table_0 tr td:nth-child(' + (columnIndex + 1) + ')').addClass('hidden-phone');
					}
					switch (sType) {
						case "num":
						case "numeric":
							if (columnIndex > 0) {
								$('#DataTables_Table_0 tr td:nth-child(' + (columnIndex + 1) + ')').addClass('text-right');
							}
							break;
						default:
					}
					if (th.data().hasOwnProperty('text-align')) {
						$('#DataTables_Table_0 tr td:nth-child(' + (columnIndex + 1) + ')').addClass(th.data('align'));
					}
				});
			});
		}

	}

})(jQuery);