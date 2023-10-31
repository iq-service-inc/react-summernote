/**
 * summernote-ext-table
 * https://github.com/ksy11/summernote-ext-table 
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    // add table / table col resize start
    var JTablePlugin = function (context) {
        var self = this,
            dom = $.summernote.dom,
            ui = $.summernote.ui,
            modules = context.modules,
            options = context.options,
            $editable = context.layoutInfo.editable,
            lang = options.langInfo,
            $mergeDialog,
            $tableInfoDialog;

        var userAgent = navigator.userAgent,
            isMSIE = /MSIE|Trident/i.test(userAgent),
            isEdge = /Edge\/\d+/.test(userAgent),
            isFF = !isEdge && /firefox/i.test(userAgent),
            isFF = !isEdge && /firefox/i.test(userAgent),
            isPhantom = /PhantomJS/i.test(userAgent),
            isWebkit = !isEdge && /webkit/i.test(userAgent),
            isChrome = !isEdge && /chrome/i.test(userAgent),
            isSafari = !isEdge && /safari/i.test(userAgent) && (!/chrome/i.test(userAgent))

        var tableResize = {
            pressed        : false,
            rightFlag      : false,
            bottomFlag     : false,
            currentTableEl : undefined,
            currentTrEl    : undefined,
            firstTdEl      : undefined,
            colEl          : undefined,
            currentTdEl    : undefined,
            currentTdLeft  : undefined,
            currentTdRight : undefined,
            currentTdTop   : undefined,
            currentTdBottom: undefined,
            startX         : undefined,
            startWidth     : undefined,
            startY         : undefined,
            startHeight    : undefined,
            contenteditable: false
        };

        var tableBlock = {
            pressed          : false,
            currentTableEl   : undefined,
            currentTdEl      : undefined,
            currentTdLeft    : undefined,
            currentTdRight   : undefined,
            currentTdTop     : undefined,
            currentTdBottom  : undefined,
            currentTdPosition: {
                row: undefined,
                col: undefined,
            },
            width            : undefined,
            height           : undefined,
            top              : undefined,
            left             : undefined,
            effect           : {
                row: {
                    start: undefined,
                    end  : undefined,
                },
                col: {
                    start: undefined,
                    end  : undefined,
                },
            },
        };

        var addRowCol = [
            ui.button({
                className: 'btn-md',
                contents : ui.icon(options.icons.rowAbove),
                tooltip  : lang.table.addRowAbove,
                container: options.container,
                click    : context.createInvokeHandler('jTable.jAddRow', 'top'),
            }),
            ui.button({
                className: 'btn-md',
                contents : ui.icon(options.icons.rowBelow),
                tooltip  : lang.table.addRowBelow,
                container: options.container,
                click    : context.createInvokeHandler('jTable.jAddRow', 'bottom'),
            }),
            ui.button({
                className: 'btn-md',
                contents : ui.icon(options.icons.colBefore),
                tooltip  : lang.table.addColLeft,
                container: options.container,
                click    : context.createInvokeHandler('jTable.jAddCol', 'left'),
            }),
            ui.button({
                className: 'btn-md',
                contents : ui.icon(options.icons.colAfter),
                tooltip  : lang.table.addColRight,
                container: options.container,
                click    : context.createInvokeHandler('jTable.jAddCol', 'right'),
            })
        ];

        var deleteRowCol = [
            ui.button({
                className: 'btn-md',
                contents : ui.icon(options.icons.rowRemove),
                tooltip  : lang.table.delRow,
                container: options.container,
                click    : context.createInvokeHandler('jTable.jDeleteRow'),
            }),
            ui.button({
                className: 'btn-md',
                contents : ui.icon(options.icons.colRemove),
                tooltip  : lang.table.delCol,
                container: options.container,
                click    : context.createInvokeHandler('jTable.jDeleteCol'),
            })
        ];

        /**
         * recover table popover after click dropdown
         * @param {jQuery.Event} event 
         */
        self.recoverPopover = function (event) {
            var $button = $(event.target).closest('button'),
                $toggle = $button.closest('.dropdown-toggle')
            var rng = modules.editor.getLastRange.call(modules.editor)
            var cell = dom.ancestor(rng.ec, dom.isCell)

            if ($button.closest('.popover').length) {
                var left = $button.closest('.popover').css('left'),
                    top = $button.closest('.popover').css('top'),
                    height = $button.outerHeight()
                setTimeout(() => {
                    modules.tablePopover.update(cell)
                    var $popover = $button.closest('.popover'),
                        $dropdown = $toggle.next('.dropdown-menu')
                    $popover.css({
                        left: left,
                        top: top
                    })
                    $dropdown.css({
                        transform: `translate3d(0px, ${height}px, 0px)`
                    })
                }, 0);
            }
        }

        context.memo('button.jAddDeleteRowCol', function () {
            return ui.buttonGroup({
                className: 'jtable-add-del-row-col jtable-display',
                children : [
                    ui.button({
                        className: 'dropdown-toggle',
                        contents : ui.dropdownButtonContents(ui.icon(options.icons.rowAbove), options),
                        tooltip  : lang.jTable.addDeleteRowCOl,
                        container: options.container,
                        data     : {
                            toggle: 'dropdown',
                        },
                        click    : function (event) {
                            var $parent = $(this).closest('.jtable-add-del-row-col');
                            var $btns = $parent.find('.btn-md');

                            var hasSpan = false;

                            var rng = modules.editor.getLastRange.call(modules.editor);
                            if (rng.isCollapsed() && rng.isOnCell()) {
                                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                                hasSpan = (cell.rowSpan > 1) || (cell.colSpan > 1);

                                if (!hasSpan) {
                                    var $table = $(cell).closest('table');
                                    var $tr = $(cell).closest('tr');
                                    var trIndex = $tr[0].rowIndex;

                                    var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
                                    var matrixTable = vTable.getMatrixTable();
                                    var tdList = matrixTable[trIndex];

                                    var currentTdIndex = 0;
                                    for (var colIndex = 0; colIndex < tdList.length; colIndex++) {
                                        var virtualTd = tdList[colIndex];
                                        if (!virtualTd.isVirtual && cell == virtualTd.baseCell) currentTdIndex = colIndex;
                                        if (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1) {
                                            hasSpan = true;
                                        }
                                    }

                                    for (var rowIndex = 0; rowIndex < matrixTable.length; rowIndex++) {
                                        var virtualTd = matrixTable[rowIndex][currentTdIndex];
                                        if (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1) {
                                            hasSpan = true;
                                        }
                                    }
                                }
                            }

                            $btns.toggleClass('disabled', hasSpan);
                            $btns.attr('disabled', hasSpan);

                            var $btnGroup = $parent.find('.jtable-add-row-col-button-group, .jtable-del-row-col-button-group');
                            var $message = $parent.find('.jtable-dropdown-message');
                            var $dropdown = $parent.find('.jtable-add-del-row-col-dropdown');
                            if (hasSpan) {
                                $btnGroup.hide();
                                $message.show();
                            } else {
                                $btnGroup.show();
                                $message.hide();
                                $dropdown.css('width', '');
                            }

                            self.recoverPopover(event)
                        },
                    }),
                    ui.dropdown({
                        className: 'jtable-add-del-row-col-dropdown',
                        children : [
                            ui.button({
                                className: 'jtable-dropdown-message',
                                contents : lang.jTable.message,
                                container: options.container,
                                // callback : function($node) {
                                //     console.log($node);
                                // },
                            }),
                            ui.buttonGroup({
                                className: 'jtable-add-row-col-button-group',
                                children : addRowCol,
                            }),
                            ui.buttonGroup({
                                className: 'jtable-del-row-col-button-group',
                                children : deleteRowCol,
                            })
                        ]
                    }),
                ]
            }).render();
        });

        self.jAddRow = function (position) {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {
                self.beforeCommand();

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                self.addRow(cell, position)

                self.afterCommand();
            }
        };

        self.addRow = function (cell, position) {
            var currentTr = $(cell).closest('tr');
            var trAttributes = self.recoverAttributes(currentTr);
            var html = $('<tr' + trAttributes + '></tr>');

            var vTable = new TableResultAction(cell, TableResultAction.where.Row,
                TableResultAction.requestAction.Add, $(currentTr).closest('table')[0]);
            var actions = vTable.getActionList();

            for (var idCell = 0; idCell < actions.length; idCell++) {
                var currentCell = actions[idCell];
                var tdAttributes = self.recoverAttributes(currentCell.baseCell);
                switch (currentCell.action) {
                    case TableResultAction.resultAction.AddCell:
                        html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
                        break;
                    case TableResultAction.resultAction.SumSpanCount: {
                        if (position === 'top') {
                            var baseCellTr = currentCell.baseCell.parent;
                            var isTopFromRowSpan = (!baseCellTr ? 0 : currentCell.baseCell.closest('tr').rowIndex) <= currentTr[0].rowIndex;
                            if (isTopFromRowSpan) {
                                var newTd = $('<div></div>').append($('<td' + tdAttributes + '>' + dom.blank + '</td>').removeAttr('rowspan')).html();
                                html.append(newTd);
                                break;
                            }
                        }
                        var rowspanNumber = parseInt(currentCell.baseCell.rowSpan, 10);
                        rowspanNumber++;
                        currentCell.baseCell.setAttribute('rowSpan', rowspanNumber);
                    }
                        break;
                }
            }

            if (position === 'top') {
                currentTr.before(html);
            } else {
                var cellHasRowspan = (cell.rowSpan > 1);
                if (cellHasRowspan) {
                    var lastTrIndex = currentTr[0].rowIndex + (cell.rowSpan - 2);
                    $($(currentTr).parent().find('tr')[lastTrIndex]).after($(html));
                    return;
                }
                currentTr.after(html);
            }
        }

        self.jAddCol = function (position) {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {
                self.beforeCommand();

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                self.addCol(cell, position)

                self.afterCommand();
            }
        };

        self.addCol = function (cell, position) {
            var row = $(cell).closest('tr');
            var colgroup = $(row).closest('table').find('colgroup').children('col');
            var tdIndex = row.children().index($(cell));

            var vTable = new TableResultAction(cell, TableResultAction.where.Column,
                TableResultAction.requestAction.Add, $(row).closest('table')[0]);
            var actions = vTable.getActionList();

            for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
                var currentCell = actions[actionIndex];
                var tdAttributes = self.recoverAttributes(currentCell.baseCell);
                switch (currentCell.action) {
                    case TableResultAction.resultAction.AddCell:
                        if (position === 'right') {
                            $(currentCell.baseCell).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
                        } else {
                            $(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
                        }
                        break;
                    case TableResultAction.resultAction.SumSpanCount:
                        var colspanNumber = parseInt(currentCell.baseCell.colSpan, 10);
                        colspanNumber++;
                        currentCell.baseCell.setAttribute('colSpan', colspanNumber);
                        break;
                }
            }

            if (colgroup.length) {
                /**
                 * expand colgroup col span
                 */
                for (let index = 0; index < colgroup.length; index++) {
                    var col = colgroup[index];
                    var span = col.span
                    col.span = 1
                    while (span > 1) {
                        $(col).after($(col).prop('outerHTML'))
                        span = span - 1
                    }
                }

                var baseCol = colgroup[tdIndex];
                var colAttributes = self.recoverAttributes(baseCol);
                var $col = $('<col' + colAttributes + '/>');
                $col.width(100);
                if (position === 'right') {
                    $(baseCol).after($col[0]);
                } else {
                    $(baseCol).before($col[0]);
                }
            }
        }

        self.jDeleteRow = function () {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {
                self.beforeCommand();

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                var row = $(cell).closest('tr');
                var cellPos = row.children('td, th').index($(cell));
                var rowPos = row[0].rowIndex;


                var vTable = new TableResultAction(cell, TableResultAction.where.Row,
                    TableResultAction.requestAction.Delete, $(row).closest('table')[0]);
                var actions = vTable.getActionList();

                for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
                    if (!actions[actionIndex]) {
                        continue;
                    }

                    var baseCell = actions[actionIndex].baseCell;
                    var virtualPosition = actions[actionIndex].virtualTable;
                    var hasRowspan = (baseCell.rowSpan && baseCell.rowSpan > 1);
                    var rowspanNumber = (hasRowspan) ? parseInt(baseCell.rowSpan, 10) : 0;
                    switch (actions[actionIndex].action) {
                        case TableResultAction.resultAction.Ignore:
                            continue;
                        case TableResultAction.resultAction.AddCell: {
                            var nextRow = row.next('tr')[0];
                            if (!nextRow) {
                                continue;
                            }
                            var cloneRow = row[0].cells[cellPos];
                            if (hasRowspan) {
                                if (rowspanNumber > 2) {
                                    rowspanNumber--;
                                    nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                                    nextRow.cells[cellPos].setAttribute('rowSpan', rowspanNumber);
                                    nextRow.cells[cellPos].innerHTML = '';
                                } else if (rowspanNumber === 2) {
                                    nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                                    nextRow.cells[cellPos].removeAttribute('rowSpan');
                                    nextRow.cells[cellPos].innerHTML = '';
                                }
                            }
                        }
                            continue;
                        case TableResultAction.resultAction.SubtractSpanCount:
                            if (hasRowspan) {
                                if (rowspanNumber > 2) {
                                    rowspanNumber--;
                                    baseCell.setAttribute('rowSpan', rowspanNumber);
                                    if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                                        baseCell.innerHTML = '';
                                    }
                                } else if (rowspanNumber === 2) {
                                    baseCell.removeAttribute('rowSpan');
                                    if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                                        baseCell.innerHTML = '';
                                    }
                                }
                            }
                            continue;
                        case TableResultAction.resultAction.RemoveCell:
                            // Do not need remove cell because row will be deleted.
                            continue;
                    }
                }
                row.remove();

                self.afterCommand();
            }
        };

        self.jDeleteCol = function () {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {
                self.beforeCommand();

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                var row = $(cell).closest('tr');
                var cellPos = row.children('td, th').index($(cell));
                var colgroup = $(row).closest('table').find('colgroup').children('col');
                var tdIndex = row.children().index($(cell));

                var vTable = new TableResultAction(cell, TableResultAction.where.Column,
                    TableResultAction.requestAction.Delete, $(row).closest('table')[0]);
                var actions = vTable.getActionList();

                for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
                    if (!actions[actionIndex]) {
                        continue;
                    }
                    switch (actions[actionIndex].action) {
                        case TableResultAction.resultAction.Ignore:
                            continue;
                        case TableResultAction.resultAction.SubtractSpanCount: {
                            var baseCell = actions[actionIndex].baseCell;
                            var hasColspan = (baseCell.colSpan && baseCell.colSpan > 1);
                            if (hasColspan) {
                                var colspanNumber = (baseCell.colSpan) ? parseInt(baseCell.colSpan, 10) : 0;
                                if (colspanNumber > 2) {
                                    colspanNumber--;
                                    baseCell.setAttribute('colSpan', colspanNumber);
                                    if (baseCell.cellIndex === cellPos) {
                                        baseCell.innerHTML = '';
                                    }
                                } else if (colspanNumber === 2) {
                                    baseCell.removeAttribute('colSpan');
                                    if (baseCell.cellIndex === cellPos) {
                                        baseCell.innerHTML = '';
                                    }
                                }
                            }
                        }
                            continue;
                        case TableResultAction.resultAction.RemoveCell:
                            dom.remove(actions[actionIndex].baseCell, true);
                            continue;
                    }
                }

                if (colgroup.length) {
                    var baseCol = colgroup[tdIndex];
                    $(baseCol).remove();
                }

                self.afterCommand();
            }
        };

        self.recoverAttributes = function (el) {
            var resultStr = '';

            if (!el) {
                return resultStr;
            }

            var attrList = el.attributes || [];

            for (var i = 0; i < attrList.length; i++) {
                if (attrList[i].name.toLowerCase() === 'id') {
                    continue;
                }

                if (attrList[i].name.toLowerCase() === 'span' && el.tagName.toLowerCase() == 'col') {
                    continue
                }

                if (attrList[i].specified) {
                    resultStr += ' ' + attrList[i].name + '=\'' + attrList[i].value + '\'';
                }
            }

            return resultStr;
        }

        self.beforeCommand = function () {
            modules.editor.beforeCommand.call(modules.editor);
        };
        self.afterCommand = function () {
            modules.editor.afterCommand.call(modules.editor);
        };

        context.memo('button.jTable', function () {
            return ui.buttonGroup([
                ui.button({
                    className: 'dropdown-toggle',
                    contents : ui.dropdownButtonContents(ui.icon(options.icons.table), options),
                    tooltip  : lang.table.table,
                    container: options.container,
                    data     : {
                        toggle: 'dropdown',
                    },
                    click: function (event) {
                        self.recoverPopover(event)
                    }
                }),
                ui.dropdown({
                    title    : lang.table.table,
                    className: 'note-table',
                    items    : [
                        '<div class="note-dimension-picker">',
                        '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>',
                        '<div class="note-dimension-picker-highlighted"></div>',
                        '<div class="note-dimension-picker-unhighlighted"></div>',
                        '</div>',
                        '<div class="note-dimension-display">1 x 1</div>',
                    ].join(''),
                }),
            ], {
                callback: function ($node) {
                    var $catcher = $node.find('.note-dimension-picker-mousecatcher');
                    $catcher.css({
                        width : options.insertTableMaxSize.col + 'em',
                        height: options.insertTableMaxSize.row + 'em',
                    }).mousedown(context.createInvokeHandler("jTable.insertTable"))
                        .on('mousemove', modules.buttons.tableMoveHandler.bind(context));
                },
            }).render();
        });

        self.insertTable = function (dim) {
            self.beforeCommand();

            var dimension = dim.split('x');
            var rng = modules.editor.getLastRange().deleteContents();
            var tableDivEl = self.createTable(dimension[0], dimension[1], options);
            rng.insertNode(tableDivEl);

            self.afterCommand();
        };

        self.createTable = function (colCount, rowCount, options) {
            var colgroup = [];
            var colgroupHTML;
            var tds = [];
            var tdHTML;

            for (var idxCol = 0; idxCol < colCount; idxCol++) {
                tds.push('<td>' + dom.blank + '</td>');
                colgroup.push('<col style="width: 100px;"/>');
            }
            colgroupHTML = '<colgroup>' + colgroup.join('') + '</colgroup>';
            tdHTML = tds.join('');

            var trs = [];
            var trHTML;
            for (var idxRow = 0; idxRow < rowCount; idxRow++) {
                trs.push('<tr>' + tdHTML + '</tr>');
            }
            trHTML = trs.join('');

            var $table = $('<table class="jtable-expanded" style="width: auto !important;">' + colgroupHTML + trHTML + '</table>');
            if (options && options.tableClassName) {
                $table.addClass(options.tableClassName);
            }

            return $table[0];
        };

        context.memo('button.jBorderColor', function () {
            return self.colorPalette('note-color-table-border', lang.jTable.borderColor, self.jBorderColor);
        });

        self.jBorderColor = function (borderColor) {
            self.beforeCommand();

            var cell = tableBlock.currentTdEl;
            if (!cell) return self.afterCommand()

            var $cell = $(cell);
            $cell.closest('table').find('td, th').css('border', '1px solid ' + borderColor);

            // resetTableBlock($cell);

            self.afterCommand();
        };

        context.memo('button.jBackcolor', function () {
            return self.colorPalette('note-color-back', lang.color.background, self.color);
        });

        self.color = function (backColor) {
            self.beforeCommand();
            
            var cell = tableBlock.currentTdEl;
            if (!cell) return self.afterCommand()

            var $cell = $(cell);
            var $table = $cell.closest('table');

            var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
            var matrixTable = vTable.getMatrixTable();

            var effectRow = tableBlock.effect.row;
            var effectCol = tableBlock.effect.col;
            for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
                for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
                    var virtualTd = matrixTable[rowIndex][colIndex];
                    $(virtualTd.baseCell).css('background-color', backColor);
                }
            }

            // resetTableBlock($cell);

            self.afterCommand();
        };

        self.colorPalette = function (className, tooltip, callbackFnc) {
            return ui.buttonGroup({
                className: 'note-color jtable-display ' + className,
                children : [
                    ui.button({
                        className: 'note-current-color-button note-table-color',
                        contents : ui.icon(options.icons.font + ' note-recent-color'),
                        tooltip  : tooltip,
                        container: options.container,
                        click    : function (e) {
                            const $button = $(e.currentTarget);
                            const value = $button.attr('data-backColor');
                            callbackFnc(value);
                        },
                        callback : function ($button) {
                            const $recentColor = $button.find('.note-recent-color');
                            $recentColor.css('background-color', className == 'note-color-table-border' ? '#000000' : options.colorButton.backColor);
                            $button.attr('data-backColor', className == 'note-color-table-border' ? '#000000' : options.colorButton.backColor);
                            $recentColor.css('color', 'transparent');
                        },
                    }),
                    ui.button({
                        className: 'dropdown-toggle',
                        contents : ui.dropdownButtonContents('', options),
                        tooltip  : lang.color.more,
                        container: options.container,
                        data     : {
                            toggle: 'dropdown',
                        },
                        click: function (event) {
                            self.recoverPopover(event)
                        }
                    }),
                    ui.dropdown({
                        items   : ([
                            '<div class="note-palette">',
                            '<div class="note-palette-title">' + tooltip + '</div>',
                            '<div>',
                            '<button type="button" class="note-color-reset btn btn-light" data-event="backColor" data-value="inherit">',
                            lang.color.transparent,
                            '</button>',
                            '</div>',
                            '<div class="note-holder" data-event="backColor"/>',
                            '<div>',
                            // '<button type="button" class="note-color-select btn btn-light" data-event="openPalette" data-value="backColorPicker">',
                            // lang.color.cpSelect,
                            // '</button>',
                            // '<input type="color" id="backColorPicker" class="note-btn note-color-select-btn" value="' + options.colorButton.backColor + '" data-event="backColorPalette">',
                            // '</div>',
                            // '<div class="note-holder-custom" id="backColorPalette" data-event="backColor"/>',
                            // '</div>',
                        ].join('')),
                        callback: function ($dropdown) {
                            $dropdown.find('.note-holder').each(function (idx, item) {
                                const $holder = $(item);
                                $holder.append(ui.palette({
                                    colors    : options.colors,
                                    colorsName: options.colorsName,
                                    eventName : $holder.data('event'),
                                    container : options.container,
                                    tooltip   : options.tooltip,
                                    container : options.container,
                                }).render());
                            });
                            /* TODO: do we have to record recent custom colors within cookies? */
                            var customColors = [
                                ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
                            ];
                            $dropdown.find('.note-holder-custom').each(function (idx, item) {
                                const $holder = $(item);
                                $holder.append(ui.palette({
                                    colors    : customColors,
                                    colorsName: customColors,
                                    eventName : $holder.data('event'),
                                    container : options.container,
                                    tooltip   : options.tooltip,
                                    container : options.container,
                                }).render());
                            });
                            $dropdown.find('input[type=color]').each(function (idx, item) {
                                $(item).change(function () {
                                    const $chip = $dropdown.find('#' + $(this).data('event')).find('.note-color-btn').first();
                                    const color = this.value.toUpperCase();
                                    $chip.css('background-color', color)
                                        .attr('aria-label', color)
                                        .attr('data-value', color)
                                        .attr('data-original-title', color);
                                    $chip.click();
                                });
                            });
                        },
                        click   : function (event) {
                            // event.stopPropagation();

                            const $parent = $(this).closest('.note-popover').find('.note-dropdown-menu');
                            const $button = $(event.target);
                            const eventName = $button.data('event');
                            const value = $button.attr('data-value');

                            if (eventName === 'openPalette') {
                                const $picker = $parent.find('#' + value);
                                const $palette = $($parent.find('#' + $picker.data('event')).find('.note-color-row')[0]);

                                // Shift palette chips
                                const $chip = $palette.find('.note-color-btn').last().detach();

                                // Set chip attributes
                                const color = $picker.val();
                                $chip.css('background-color', color)
                                    .attr('aria-label', color)
                                    .attr('data-value', color)
                                    .attr('data-original-title', color);
                                $palette.prepend($chip);
                                $picker.click();
                            } else {
                                // eventName == 'backColor'
                                const key = eventName === 'backColor' ? 'background-color' : 'color';
                                const $color = $button.closest('.note-color').find('.note-recent-color');
                                const $currentButton = $button.closest('.note-color').find('.note-current-color-button');

                                $color.css(key, value);
                                $currentButton.attr('data-' + eventName, value);
                                callbackFnc(value);
                            }
                        },
                    }),
                ],
            }).render();
        };

        self.setCellHorizontalAlign = function (position) {
            self.beforeCommand();

            var cell = tableBlock.currentTdEl;
            var $cell = $(cell);
            var $table = $cell.closest('table');

            var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
            var matrixTable = vTable.getMatrixTable();

            var effectRow = tableBlock.effect.row;
            var effectCol = tableBlock.effect.col;
            for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
                for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
                    var virtualTd = matrixTable[rowIndex][colIndex];
                    $(virtualTd.baseCell).css('text-align', position);
                }
            }

            // resetTableBlock($cell);

            self.afterCommand();
        };

        self.setCellVerticalAlign = function (position) {
            self.beforeCommand();
            
            var cell = tableBlock.currentTdEl;
            var $cell = $(cell);
            var $table = $cell.closest('table');

            var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
            var matrixTable = vTable.getMatrixTable();

            var effectRow = tableBlock.effect.row;
            var effectCol = tableBlock.effect.col;
            for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
                for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
                    var virtualTd = matrixTable[rowIndex][colIndex];
                    $(virtualTd.baseCell).css('vertical-align', position);
                }
            }

            // resetTableBlock($cell);

            self.afterCommand();
        };

        var horizontal = [
            ui.button({
                contents : ui.icon(options.icons.alignLeft),
                tooltip  : lang.paragraph.left,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellHorizontalAlign', 'left'),
            }),
            ui.button({
                contents : ui.icon(options.icons.alignCenter),
                tooltip  : lang.paragraph.center,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellHorizontalAlign', 'center'),
            }),
            ui.button({
                contents : ui.icon(options.icons.alignRight),
                tooltip  : lang.paragraph.right,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellHorizontalAlign', 'right'),
            }),
            ui.button({
                contents : ui.icon(options.icons.alignJustify),
                tooltip  : lang.paragraph.justify,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellHorizontalAlign', 'justify'),
            })
        ];
        var vertical = [
            ui.button({
                className: 'jtable-vertical-align-btn-top',
                contents : ui.icon(options.icons.alignJustify),
                tooltip  : lang.jTable.align.top,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellVerticalAlign', 'top'),
            }),
            ui.button({
                className: 'jtable-vertical-align-btn-middle',
                contents : ui.icon(options.icons.alignJustify),
                tooltip  : lang.jTable.align.middle,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellVerticalAlign', 'middle'),
            }),
            ui.button({
                className: 'jtable-vertical-align-btn-bottom',
                contents : ui.icon(options.icons.alignJustify),
                tooltip  : lang.jTable.align.bottom,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellVerticalAlign', 'bottom'),
            }),
            ui.button({
                className: 'jtable-vertical-align-btn-baseline',
                contents : ui.icon(options.icons.alignJustify),
                tooltip  : lang.jTable.align.baseline,
                container: options.container,
                click    : context.createInvokeHandler('jTable.setCellVerticalAlign', 'baseline'),
            })
        ];

        context.memo('button.jAlign', function () {
            return ui.buttonGroup([
                ui.button({
                    className: 'dropdown-toggle jtable-display',
                    contents : ui.dropdownButtonContents(ui.icon(options.icons.alignLeft), options),
                    tooltip  : lang.paragraph.paragraph,
                    container: options.container,
                    data     : {
                        toggle: 'dropdown',
                    },
                    click: function (event) {
                        self.recoverPopover(event)
                    }
                }),
                ui.dropdown({
                    className: 'jtable-align-dropdown',
                    children : [
                        ui.buttonGroup({
                            className: 'jtable-horizontal-align-button-group',
                            children : horizontal,
                        }),
                        ui.buttonGroup({
                            className: 'jtable-vertical-align-button-group',
                            children : vertical,
                        })
                    ]
                }),
            ], {
                callback: function ($node) {
                    // console.log($node);
                },
            }).render();
        });

        context.memo('button.jAutoFit', function () {
            var icon = {
                IconAutofitContents: `<svg width="16" height="20" viewBox="0 0 20 25" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="null" d="m0.40456,23.71451l0,-15.4604l5.98412,0l1.2128,0l4.79816,0l1.21167,0l5.98412,0l0,15.4604l-19.19087,0l0,0zm13.20675,-1.18003l4.79577,0l0,-3.56933l-4.79577,0l0,3.56933zm4.79577,-4.75652l0,-3.56102l-4.79577,0l0,3.56102l4.79577,0zm-10.80559,4.75652l4.79816,0l0,-3.56933l-4.79816,0l0,3.56933zm4.79816,-4.75652l0,-3.56102l-4.79816,0l0,3.56102l4.79816,0zm-10.80406,4.75652l4.7931,0l0,-3.56933l-4.7931,0l0,3.56933zm4.7931,-4.75652l0,-3.56102l-4.7931,0l0,3.56102l4.7931,0zm-4.7931,-8.32662l0,3.57783l4.7931,0l0,-3.57783l-4.7931,0zm6.0059,0l0,3.57783l4.79816,0l0,-3.57783l-4.79816,0zm6.00982,0l0,3.57783l4.79577,0l0,-3.57783l-4.79577,0z" class="cls-1" fill="#000" fill-rule="evenodd"/>
                    <line stroke="#000" x1="0.99834" y1="1.28549" x2="0.99834" y2="7.9574" id="svg_6"/>
                    <line stroke="#000" x1="19.04735" y1="1.28549" x2="19.04735" y2="7.9574" id="svg_5"/>
                    <line stroke="#000" x1="6.61898" y1="4.69242" x2="1.08942" y2="4.69242" id="svg_4"/>
                    <line stroke="#000" x1="18.96992" y1="4.69242" x2="13.44035" y2="4.69242" id="svg_3"/>
                    <line stroke="#007fff" x1="7.64112" y1="2.12549" x2="12.35887" y2="6.84324" id="svg_2"/>
                    <line stroke="#007fff" x1="12.40457" y1="2.07979" x2="7.68682" y2="6.79754" id="svg_1"/>
                </svg>`,
                IconAutofitWindow: `<svg width="16" height="20" viewBox="0 0 20 25" xmlns="http://www.w3.org/2000/svg">
                <text stroke-width="0" font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="7" id="svg_3" y="7" x="6.51394" stroke="#007fff" fill="#007fff">%</text>
                    <path stroke="null" id="svg_4" d="m0.17556,24.29515l0,-15.82937l6.12694,0l1.24175,0l4.91267,0l1.24058,0l6.12694,0l0,15.82937l-19.64887,0l0,0zm13.52193,-1.20819l4.91022,0l0,-3.65452l-4.91022,0l0,3.65452zm4.91022,-4.87004l0,-3.64601l-4.91022,0l0,3.64601l4.91022,0zm-11.06347,4.87004l4.91267,0l0,-3.65452l-4.91267,0l0,3.65452zm4.91267,-4.87004l0,-3.64601l-4.91267,0l0,3.64601l4.91267,0zm-11.0619,4.87004l4.90749,0l0,-3.65452l-4.90749,0l0,3.65452zm4.90749,-4.87004l0,-3.64601l-4.90749,0l0,3.64601l4.90749,0zm-4.90749,-8.52534l0,3.66321l4.90749,0l0,-3.66321l-4.90749,0zm6.14923,0l0,3.66321l4.91267,0l0,-3.66321l-4.91267,0zm6.15325,0l0,3.66321l4.91022,0l0,-3.66321l-4.91022,0z" class="cls-1" fill="#000" fill-rule="evenodd"/>
                    <line stroke="#000" x1="0.78351" y1="1.33085" x2="0.78351" y2="8.16198" id="svg_1"/>
                    <line stroke="#000" x1="19.26327" y1="1.33085" x2="19.26327" y2="8.16198" id="svg_2"/>
                    <line stroke="#000" x1="6.53829" y1="4.81908" x2="0.87676" y2="4.81908" id="svg_9"/>
                    <line stroke="#000" x1="19.18399" y1="4.81909" x2="13.52246" y2="4.81909" id="svg_10"/>
                </svg>`,
                IconFixedColumnWidth: `<svg width="16" height="20" viewBox="0 0 20 25" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="null" id="svg_4" d="m0.49693,23.60655l0,-15.31157l5.92652,0l1.20113,0l4.75197,0l1.2,0l5.92652,0l0,15.31157l-19.00613,0l0,0zm13.07961,-1.16867l4.7496,0l0,-3.53497l-4.7496,0l0,3.53497zm4.7496,-4.71073l0,-3.52674l-4.7496,0l0,3.52674l4.7496,0zm-10.70157,4.71073l4.75197,0l0,-3.53497l-4.75197,0l0,3.53497zm4.75197,-4.71073l0,-3.52674l-4.75197,0l0,3.52674l4.75197,0zm-10.70005,4.71073l4.74696,0l0,-3.53497l-4.74696,0l0,3.53497zm4.74696,-4.71073l0,-3.52674l-4.74696,0l0,3.52674l4.74696,0zm-4.74696,-8.24647l0,3.54339l4.74696,0l0,-3.54339l-4.74696,0zm5.94809,0l0,3.54339l4.75197,0l0,-3.54339l-4.75197,0zm5.95197,0l0,3.54339l4.7496,0l0,-3.54339l-4.7496,0z" class="cls-1" fill="#000" fill-rule="evenodd"/>
                    <line stroke="#000" x1="0.88616" y1="1.39345" x2="0.88616" y2="8.00112" id="svg_1"/>
                    <line stroke="#000" x1="18.76142" y1="1.39345" x2="18.76142" y2="8.00112" id="svg_2"/>
                    <line stroke="#007fff" x1="2.92815" y1="4.38208" x2="2.92815" y2="7.32357" id="svg_14"/>
                    <line stroke="#007fff" x1="5.19084" y1="4.38208" x2="5.19084" y2="7.32357" id="svg_15"/>
                    <line stroke="#007fff" x1="7.45353" y1="4.38208" x2="7.45353" y2="7.32357" id="svg_16"/>
                    <line stroke="#007fff" x1="9.71623" y1="4.38208" x2="9.71623" y2="7.32357" id="svg_17"/>
                    <line stroke="#007fff" x1="11.97892" y1="4.38208" x2="11.97892" y2="7.32357" id="svg_22"/>
                    <line stroke="#007fff" x1="14.24161" y1="4.38208" x2="14.24161" y2="7.32357" id="svg_23"/>
                    <line stroke="#007fff" x1="16.5043" y1="4.38208" x2="16.5043" y2="7.32357" id="svg_27"/>
                    <line stroke="#000" x1="18.67122" y1="7.4828" x2="1.11211" y2="7.4828" id="svg_13"/>
                </svg>`
            }
            return ui.buttonGroup([
                ui.button({
                    className: 'dropdown-toggle jtable-display',
                    contents :`<i class="note-icon jtable-icon-autofit-contents">${icon.IconAutofitContents}</i>`,
                    tooltip  : lang.jTable.autofit.autofit,
                    container: options.container,
                    data     : {
                        toggle: 'dropdown',
                    },
                    click: function (event) {
                        self.recoverPopover(event)
                    }
                }),
                ui.dropdown({
                    className: 'jtable-autofit-dropdown',
                    children : [
                        ui.buttonGroup([
                            ui.button({
                                className: 'note-btn-jtable-autofit-contents',
                                contents : `<i class="note-icon jtable-icon-autofit-contents">${icon.IconAutofitContents}</i>`,
                                tooltip  : lang.jTable.autofit.contents,
                                container: options.container,
                                click    : context.createInvokeHandler('jTable.autofitContents'),
                            }),
                            ui.button({
                                className: 'note-btn-jtable-autofit-window',
                                contents : `<i class="note-icon jtable-icon-autofit-window">${icon.IconAutofitWindow}</i>`,
                                tooltip  : lang.jTable.autofit.window,
                                container: options.container,
                                click    : context.createInvokeHandler('jTable.autofitWindow'),
                            }),
                            ui.button({
                                className: 'note-btn-jtable-fixed-column-width',
                                contents : `<i class="note-icon jtable-icon-fixed-column-width">${icon.IconFixedColumnWidth} </i>`,
                                tooltip  : lang.jTable.autofit.fixed,
                                container: options.container,
                                click    : context.createInvokeHandler('jTable.fixedColumnWidth'),
                            }),
                        ])
                    ]
                }),
            ]).render();
        });

        self.autofitContents = function () {
            self.beforeCommand()
            var rng = modules.editor.getLastRange.call(modules.editor)
            var $table = $(dom.ancestor(rng.ec, dom.isTable))
            $table.find('colgroup col').css('width', '')
            self.afterCommand()
        }

        self.autofitWindow = function () {
            self.beforeCommand()
            var rng = modules.editor.getLastRange.call(modules.editor)
            var $table = $(dom.ancestor(rng.ec, dom.isTable))
            $table.css('width', '100%')
            self.afterCommand()
        }

        self.fixedColumnWidth = function () {
            self.beforeCommand()
            var rng = modules.editor.getLastRange.call(modules.editor)
            var $table = $(dom.ancestor(rng.ec, dom.isTable))
            $table.css('overflow-wrap', 'anywhere')
            self.afterCommand()
        }


        var mergeBody = [
            '<div class="form-group">',
            '<label for="jtable-cell-merge-col' + options.id + '" class="note-form-label jtable-merge-label">' + lang.jTable.merge.colspan + '</label>',
            '<input id="jtable-cell-merge-col' + options.id + '" class="note-input jtable-merge-input jtable-merge-col-input" type="number" name="col"/>',
            '<span class="jtable-merge-hint-span">(min : <span class="jtable-merge-hint-col-min">1</span> / max : <span class="jtable-merge-hint-col-max">1</span>)</span>',
            '</div>',
            '<div class="form-group jtable-merge-row-info-div">',
            '<label for="jtable-cell-merge-row' + options.id + '" class="note-form-label jtable-merge-label">' + lang.jTable.merge.rowspan + '</label>',
            '<input id="jtable-cell-merge-row' + options.id + '" class="note-input jtable-merge-input jtable-merge-row-input" type="number" name="row"/>',
            '<span class="jtable-merge-hint-span">(min : <span class="jtable-merge-hint-row-min">1</span> / max : <span class="jtable-merge-hint-row-max">1</span>)</span>',
            '</div>',
        ].join('');
        var mergeFooter = '<input type="button" href="#" class="btn btn-primary note-btn note-btn-primary jtable-merge-btn" value="' + lang.jTable.merge.merge + '" disabled>';

        $mergeDialog = ui.dialog({
            title : lang.jTable.merge.merge,
            fade  : options.dialogsFade,
            body  : mergeBody,
            footer: mergeFooter,
        }).render().appendTo(options.container);
        $mergeDialog.find('.note-modal-content').width(340);
        $mergeDialog.find('.note-modal-body').css('padding', '20px 20px 10px 20px');

        var cellSplit = [
            ui.button({
                contents : ui.icon('note-icon-table-merge'),
                tooltip  : lang.jTable.merge.merge,
                container: options.container,
                click    : context.createInvokeHandler('jTable.cellMerge'),
            }),
            ui.button({
                className: 'note-btn-jtable-cell-split',
                contents : ui.icon('note-icon-table-cell-split'),
                tooltip  : lang.jTable.merge.split,
                container: options.container,
                click    : context.createInvokeHandler('jTable.cellSplit'),
            }),
        ];

        context.memo('button.jMerge', function () {
            return ui.buttonGroup({
                className: 'jtable-display',
                children: [
                    ui.button({
                        className: 'dropdown-toggle jtable-cell-split-dropdown-toggle',
                        contents : ui.dropdownButtonContents(ui.icon('note-icon-table-merge'), options),
                        tooltip  : lang.jTable.merge.merge,
                        container: options.container,
                        data     : {
                            toggle: 'dropdown',
                        },
                        click    : function (event) {
                            var $parent = $(this).parent();
                            var $cellSplitBtn = $parent.find('.note-btn-jtable-cell-split');

                            var cellHasSpan = false;

                            var rng = modules.editor.getLastRange.call(modules.editor);
                            if (rng.isCollapsed() && rng.isOnCell()) {
                                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                                cellHasSpan = (cell.rowSpan > 1) || (cell.colSpan > 1);
                            }

                            $cellSplitBtn.toggleClass('disabled', !cellHasSpan);
                            $cellSplitBtn.attr('disabled', !cellHasSpan);
                            self.recoverPopover(event)
                        },
                    }),
                    ui.dropdown({
                        className: 'jtable-cell-split-dropdown',
                        children : [
                            ui.buttonGroup({
                                className: 'jtable-cell-split-button-group',
                                children : cellSplit,
                            })
                        ]
                    }),
                ],
            }).render();
        });

        self.cellMerge = function () {
            if(options.jTable.mergeMode == 'drag') {
                self.dragCellMerge();
            } else {
                self.mergeDialogShow();
            }
        };

        self.dragCellMerge = function () {
            var cell = tableBlock.currentTdEl;
            var $cell = $(cell);
            var $table = $cell.closest('table');

            var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
            var matrixTable = vTable.getMatrixTable();

            var effectRow = tableBlock.effect.row;
            var effectCol = tableBlock.effect.col;

            if(effectRow.start == effectRow.end && effectCol.start == effectCol.end){
                resetTableBlock($cell);
                return true;
            }

            for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
                for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
                    var virtualTd = matrixTable[rowIndex][colIndex];
                    cellUnMerge(virtualTd.baseCell);
                }
            }

            var cellData = getMergeCellData(cell);

            var data = {
                trIndex : cellData.trIndex,
                colIndex: cellData.colIndex,
                current : {
                    col: cellData.current.col,
                    row: cellData.current.row,
                },
                merge   : {
                    col: parseInt(effectCol.end - effectCol.start + 1, 10),
                    row: parseInt(effectRow.end - effectRow.start + 1, 10),
                },
                effect  : {
                    col: cellData.effect.col,
                    row: cellData.effect.row,
                },
            };

            var mergeCell = matrixTable[effectRow.start][effectCol.start];
            tableCellMerge(mergeCell.baseCell, data);

            resetTableBlock($cell);


        };

        self.mergeDialogShow = function () {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                var cellData = getMergeCellData(cell);
                modules.tablePopover.hide();
                context.invoke('editor.saveRange');
                showMergeDialog(cellData).then(function (data) {
                    // [workaround] hide dialog before restore range for IE range focus
                    ui.hideDialog($mergeDialog);
                    context.invoke('editor.restoreRange');

                    var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                    tableCellMerge(cell, data);

                }).fail(function () {
                    context.invoke('editor.restoreRange');
                });
            }
        };

        function tableCellMerge(cell, data) {
            self.beforeCommand();
            var $cell = $(cell);
            var colRemoveCount = data.merge.col - data.current.col;
            var rowRemoveCount = data.merge.row - data.current.row;

            $cell.prop("colspan", data.merge.col);

            for (var i = 0; i < colRemoveCount; i++) {
                $(data.effect.col[i]).remove();
            }

            $cell.prop("rowspan", data.merge.row);
            for (var i = 0; i < rowRemoveCount; i++) {
                var effectCell = data.effect.row[i];
                if (colRemoveCount > 0) {
                    for (var j = 0; j < colRemoveCount; j++) {
                        $(effectCell).next().remove();
                    }
                }
                $(effectCell).remove();
            }

            var $table = $cell.closest('table');
            var $trList = $table.children('tr');
            if(!$trList.length) $trList = $table.children('tbody').children('tr');
            for(var i = 0; i < $trList.length; i++) {
                var $tr = $($trList[i]);
                var $cellList = $tr.find('td, th');
                if(!$cellList.length)   $tr.remove();
            }

            self.afterCommand();
        }

        function showMergeDialog(cellData) {
            return $.Deferred(function (deferred) {
                var $spanCountInput = $mergeDialog.find('.jtable-merge-input');
                var $colInput = $mergeDialog.find('.jtable-merge-col-input');
                var $colMinSapn = $mergeDialog.find('.jtable-merge-hint-col-min');
                var $colMaxSapn = $mergeDialog.find('.jtable-merge-hint-col-max');

                var $rowInput = $mergeDialog.find('.jtable-merge-row-input');
                var $rowMinSapn = $mergeDialog.find('.jtable-merge-hint-row-min');
                var $rowMaxSapn = $mergeDialog.find('.jtable-merge-hint-row-max');

                var $mergeBtn = $mergeDialog.find('.jtable-merge-btn');

                $colInput.val(cellData.current.col);
                $colMinSapn.text(cellData.current.col);
                $colMaxSapn.text(cellData.max.col);

                $rowInput.val(cellData.current.row);
                $rowMinSapn.text(cellData.current.row);
                $rowMaxSapn.text(cellData.max.row);

                ui.onDialogShown($mergeDialog, function () {
                    context.triggerEvent('dialog.shown');

                    $spanCountInput.on('input paste propertychange', function () {
                        var toggleBtnFlag = false;
                        var col = parseInt($colInput.val(), 10);
                        var row = parseInt($rowInput.val(), 10);

                        if (col == cellData.current.col && row == cellData.current.row) {
                            toggleBtnFlag = false;
                        } else if (col >= cellData.current.col && col <= cellData.max.col
                            && row >= cellData.current.row && row <= cellData.max.row) {
                            toggleBtnFlag = true;
                        }

                        ui.toggleBtn($mergeBtn, toggleBtnFlag);
                    });

                    $mergeBtn.click(function (event) {
                        event.preventDefault();
                        deferred.resolve({
                            trIndex : cellData.trIndex,
                            colIndex: cellData.colIndex,
                            current : {
                                col: cellData.current.col,
                                row: cellData.current.row,
                            },
                            merge   : {
                                col: parseInt($colInput.val(), 10),
                                row: parseInt($rowInput.val(), 10),
                            },
                            effect  : {
                                col: cellData.effect.col,
                                row: cellData.effect.row,
                            },
                        });
                    });

                    // bindEnterKey($imageUrl, $imageBtn);
                });

                ui.onDialogHidden($mergeDialog, function () {
                    $spanCountInput.off();
                    $mergeBtn.off();
                    ui.toggleBtn($mergeBtn, false);

                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                });

                ui.showDialog($mergeDialog);
            });
        }

        self.cellSplit = function () {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {
                self.beforeCommand();

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                cellUnMerge(cell);

                self.afterCommand();
            }
        };

        function cellUnMerge(cell){
            var $cell = $(cell);

            var $table = $cell.closest('table');
            var $tr = $cell.closest('tr');
            var currentColspan = parseInt(cell.colSpan, 10);
            var currentRowspan = parseInt(cell.rowSpan, 10);
            var insertColTdCount = currentColspan - 1;
            var startTrIndex = $tr[0].rowIndex;
            var endTrIndex = startTrIndex + currentRowspan - 1;

            var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
            var matrixTable = vTable.getMatrixTable();
            var colCount = vTable.getColCount();

            var insertFlag = false;
            var targetCell = [];
            for (var rowIndex = startTrIndex; rowIndex <= endTrIndex; rowIndex++) {
                var row = matrixTable[rowIndex];
                for (var colIndex = 0; colIndex < row.length; colIndex++) {
                    if (insertFlag && cell != row[colIndex].baseCell && !row[colIndex].isVirtual) {
                        targetCell.push(row[colIndex].baseCell);
                        if (rowIndex == startTrIndex) {
                            for (var i = 0; i < insertColTdCount; i++) {
                                $(row[colIndex].baseCell).before($('<td/>'))
                            }
                        } else {
                            for (var i = 0; i < currentColspan; i++) {
                                $(row[colIndex].baseCell).before($('<td/>'))
                            }
                        }
                        break;
                    }
                    if (cell == row[colIndex].baseCell) {
                        insertFlag = true;
                    }
                    if (insertFlag && colIndex == row.length - 1) {
                        var baseCell = row[colIndex].baseCell;
                        // current Cell is last Cell
                        if (rowIndex == startTrIndex) {
                            for (var i = 0; i < insertColTdCount; i++) {
                                $(baseCell).after($('<td/>'))
                            }
                        } else {
                            var $trList = $table.children('tr');
                            if(!$trList.length) $trList = $trList.children('tbody').children('tr');
                            baseCell = $($trList[rowIndex]).children().last();
                            for (var i = 0; i < currentColspan; i++) {
                                $(baseCell).after($('<td/>'))
                            }
                        }
                    }
                }
                insertFlag = false;
            }

            $cell.prop("colspan", 1);
            $cell.prop("rowspan", 1);
        }

        function getMergeCellData(cell) {
            var $table = $(cell).closest('table');
            var $tr = $(cell).closest('tr');
            var trIndex = $tr[0].rowIndex;

            var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
            var matrixTable = vTable.getMatrixTable();

            var tdList = matrixTable[trIndex];
            var tdIndex = 0;
            var countFlag = false;
            var maxCol = 1;
            var effectCol = [];

            if (cell.rowSpan > 1) {
                maxCol = cell.colSpan;
            } else {
                for (var colIndex = 0; colIndex < tdList.length; colIndex++) {
                    var virtualTd = tdList[colIndex];
                    if (countFlag) {
                        effectCol.push(virtualTd.baseCell);
                        maxCol++;
                    }
                    if (!countFlag && cell == virtualTd.baseCell) {
                        tdIndex = colIndex;
                        countFlag = true;
                    } else if (countFlag && (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1)) {
                        maxCol--;
                        effectCol.pop();
                        countFlag = false;
                    }
                }
            }

            countFlag = false;
            var maxRow = 1;
            var effectRow = [];

            if (cell.colSpan > 1) {
                maxRow = cell.rowSpan;
            } else {
                for (var rowIndex = 0; rowIndex < matrixTable.length; rowIndex++) {
                    var virtualTd = matrixTable[rowIndex][tdIndex];
                    if (countFlag) {
                        effectRow.push(virtualTd.baseCell);
                        maxRow++;
                    }
                    if (!countFlag && cell == virtualTd.baseCell) {
                        countFlag = true;
                    } else if (countFlag && (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1)) {
                        maxRow--;
                        effectRow.pop();
                        countFlag = false;
                    }
                }
            }

            return {
                trIndex: trIndex,
                tdIndex: tdIndex,
                current: {
                    col: cell.colSpan,
                    row: cell.rowSpan,
                },
                max    : {
                    col: maxCol,
                    row: maxRow,
                },
                effect : {
                    col: effectCol,
                    row: effectRow,
                },
            };
        }


        var tableInfoBody = [
            '<div class="form-group form-group-jtable-table-info-margin">',
            '<div class="jtable-table-info-margin-top-bottom"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-top"><span>px</span></div>',
            '<div class="jtable-table-info-margin-middle">',
            '<div class="jtable-table-info-margin-left"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-left"><span>px</span></div>',
            '<div class="jtable-table-info-margin-center"><b>Table</b><br><span class="jtable-table-info-width">0</span> X <span class="jtable-table-info-height">0</span></div>',
            '<div class="jtable-table-info-margin-right"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-right"><span>px</span></div>',
            '</div>',
            '<div class="jtable-table-info-margin-top-bottom"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-bottom"><span>px</span></div>',
            '</div>',
        ].join('');
        var tableInfoFooter = '<input type="button" href="#" class="btn btn-primary note-btn note-btn-primary jtable-apply-btn" value="' + lang.jTable.apply + '" >';

        $tableInfoDialog = ui.dialog({
            title : lang.table.table + ' ' + lang.jTable.info.margin,
            fade  : options.dialogsFade,
            body  : tableInfoBody,
            footer: tableInfoFooter,
        }).render().appendTo(options.container);
        // $tableInfoDialog.find('.note-modal-content').width(340);
        $tableInfoDialog.find('.note-modal-body').css('padding', '20px 20px 10px 20px');

        context.memo('button.jTableInfo', function () {
            return ui.button({
                className: 'jtable-display',
                contents : ui.icon('note-icon-table-margin'),
                tooltip  : lang.table.table + ' ' + lang.jTable.info.margin,
                container: options.container,
                click    : context.createInvokeHandler('jTable.tableInfoDialogShow'),
            }).render();
        });

        self.tableInfoDialogShow = function () {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                var $table = $(cell).closest('table');

                modules.tablePopover.hide();

                showTableInfoDialog($table).then(function (data) {
                    // [workaround] hide dialog before restore range for IE range focus
                    ui.hideDialog($tableInfoDialog);
                    context.invoke('editor.restoreRange');

                    $table.css('margin', data.join(' '))

                }).fail(function () {
                    context.invoke('editor.restoreRange');
                });
            }
        };

        function showTableInfoDialog($table) {
            return $.Deferred(function (deferred) {
                var $applyBtn = $tableInfoDialog.find('.jtable-apply-btn');
                var $marginInput = $tableInfoDialog.find('.jtable-table-info-margin-input');
                var $marginTopInput = $tableInfoDialog.find('.jtable-table-info-margin-input-top');
                var $marginLeftInput = $tableInfoDialog.find('.jtable-table-info-margin-input-left');
                var $marginRightInput = $tableInfoDialog.find('.jtable-table-info-margin-input-right');
                var $marginBottomInput = $tableInfoDialog.find('.jtable-table-info-margin-input-bottom');

                var $tableWidthtSpan = $tableInfoDialog.find('.jtable-table-info-width');
                var $tableHeightSpan = $tableInfoDialog.find('.jtable-table-info-height');

                $marginTopInput.val(parseInt($table.css('margin-top'), 10));
                $marginLeftInput.val(parseInt($table.css('margin-left'), 10));
                $marginRightInput.val(parseInt($table.css('margin-right'), 10));
                $marginBottomInput.val(parseInt($table.css('margin-bottom'), 10));

                $tableWidthtSpan.text($table.width());
                $tableHeightSpan.text($table.height());

                ui.onDialogShown($tableInfoDialog, function () {
                    context.triggerEvent('dialog.shown');

                    $marginInput.on('input paste propertychange', function () {
                        var toggleBtnFlag = true;
                        var top = parseInt($marginTopInput.val(), 10);
                        var left = parseInt($marginLeftInput.val(), 10);
                        var right = parseInt($marginRightInput.val(), 10);
                        var bottom = parseInt($marginBottomInput.val(), 10);

                        if (top < 0 || left < 0 || right < 0 || bottom < 0) {
                            toggleBtnFlag = false;
                        }

                        ui.toggleBtn($applyBtn, toggleBtnFlag);
                    });

                    $applyBtn.click(function (event) {
                        context.invoke('beforeCommand')
                        event.preventDefault();

                        deferred.resolve([
                            parseInt($marginTopInput.val(), 10) + 'px',
                            parseInt($marginRightInput.val(), 10) + 'px',
                            parseInt($marginBottomInput.val(), 10) + 'px',
                            parseInt($marginLeftInput.val(), 10) + 'px'
                        ]);

                        context.invoke('afterCommand')
                    });

                });

                ui.onDialogHidden($mergeDialog, function () {
                    $marginInput.off();
                    $applyBtn.off();
                    ui.toggleBtn($applyBtn, false);

                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                });

                ui.showDialog($tableInfoDialog);
            });
        }

        context.memo('button.jWidthHeightReset', function () {
            return ui.button({
                className: 'jtable-display',
                contents : ui.icon('note-icon-table-width-height-reset'),
                tooltip  : lang.table.table + ' ' + lang.jTable.areaReset,
                container: options.container,
                click    : context.createInvokeHandler('jTable.jWidthHeightReset'),
            }).render();
        });

        self.jWidthHeightReset = function () {
            var rng = modules.editor.getLastRange.call(modules.editor);
            if (rng.isCollapsed() && rng.isOnCell()) {
                self.beforeCommand();

                var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                var $table = $(cell).closest('table');
                $table.removeAttr('width');
                $table.removeAttr('height');
                $table.css('width', 'auto');
                $table.css('height', '');

                var $cell = $table.find('tr, td, th');
                $cell.removeAttr('width');
                $cell.removeAttr('height');
                $cell.css('width', '');
                $cell.css('height', '');

                var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
                var colCount = vTable.getColCount();

                $table.find('colgroup:first').remove();
                var $colgroup = $('<colgroup/>');
                for (var colIndex = 0; colIndex < colCount; colIndex++) {
                    $colgroup.append('<col style="width: 100px;"/>');
                }
                $table.prepend($colgroup);

                self.afterCommand();
            }
        };

        self.expandColgroup = function (colgroup) {
            /**
             * expand colgroup col span
             */
            var innerHTML = '',
                table = colgroup.closest('table')

            for (let index = 0; index < colgroup.length; index++) {
                var col = colgroup[index];
                var span = col.span
                col.removeAttribute('width')
                // set col width from computed width to prevent resizing
                var oldWidth = col.offsetWidth
                var oldHeight = col.offsetHeight
                var attr = `style="width:${oldWidth}px; height:${oldHeight}px"`
                while (span > 0) {
                    innerHTML = innerHTML.concat(`<col ${attr} />`)
                    span = span - 1
                }
            }
            colgroup.closest('colgroup').html(innerHTML)

            // let table width be controlled by colgroup element
            table.removeAttr('width')
            table.css('width', '')
            table.css('table-layout', 'fixed')
        }

        self.events = {
            'summernote.init': function (_, layoutInfo) {
                layoutInfo.editingArea.append('<div class="jtable-block"><div/>');
                layoutInfo.toolbar.find('.jtable-display').hide()
                
                /**
                 * copy table
                 */
                layoutInfo.editingArea.on('keydown', function(event) {
                    if ((event.metaKey || event.ctrlKey) && ( String.fromCharCode(event.which).toLowerCase() === 'c') ) {
                        var $this = $(event.target),
                            $block = $this.closest('.note-editing-area').find('.jtable-block')
                        if ($block.css('display') == 'block') {
                            var table = tableBlock.currentTableEl,
                                effect = tableBlock.effect,
                                vTable = new TableResultAction(this, undefined, undefined, table),
                                virtualTable = vTable.getVirtualTable()

                            var newTable = document.createElement('table')
                            newTable.className = table.className
                            // IE will miss colgroup => regenerate colgroup after paste
                            $(newTable).toggleClass('jtable-expanded', false)
                            
                            var colgroup = document.createElement('colgroup'),
                                col = $(table).find('colgroup col')
                            for (let index = 0; index < virtualTable[0].length; index++) {
                                const td = virtualTable[0][index];
                                var new_col = document.createElement('col'),
                                    width = !!col[index].style.width? col[index].style.width : td.baseCell.style.width
                                new_col.style.width = width
                                colgroup.appendChild(new_col)
                            }
                            newTable.appendChild(colgroup)

                            for (let r = effect.row.start; r <= effect.row.end; r++) {
                                const row = virtualTable[r];
                                var tr = document.createElement('tr')
                                for (let c = effect.col.start, i = 0; c <= effect.col.end; c++, i++) {
                                    const cell = row[c];
                                    if (cell.isVirtual) continue
                                    // IE will miss colgroup so set width in tr
                                    tr.style.width = colgroup.childNodes[i].style.width
                                    $(tr).append(cell.baseCell.outerHTML)
                                }
                                newTable.appendChild(tr)
                            }

                            $this.closest('.note-editor').after(newTable)
                            
                            var range = $.summernote.range.createFromNode(newTable)
                            range.select()
                            document.execCommand('copy')

                            $(newTable).remove()
                        }
                    }
                })
                /**
                 * expand colgroup after paste
                 * row height => each td
                 * col width => colgroup
                 */
                layoutInfo.editingArea.on('paste', '.note-editable', function (event) {
                    var $this = $(event.target).closest('.note-editable')
                    setTimeout(function() {
                        var expandTable = $this.find('table').not('.jtable-expanded')
                        for (let t = 0; t < expandTable.length; t++) {
                            const table = $(expandTable[t]);
                            if (!table.children('colgroup').children('col').length) {
                                var vTable = new TableResultAction(this, undefined, undefined, expandTable[t]);
                                var virtualTable = vTable.getVirtualTable();
                                var colgroup = document.createElement('colgroup')
                                for (let index = 0; index < virtualTable[0].length; index++) {
                                    const td = virtualTable[0][index];
                                    var col = document.createElement('col'),
                                        width = td.baseCell.style.width
                                    if (td.baseCell.colSpan > 1) {
                                        var pattern = width.match(/([0-9]*)([a-z]*$)/)
                                        width = pattern[1]/td.baseCell.colSpan + pattern[2]
                                    }
                                    col.style.width = width
                                    colgroup.appendChild(col)
                                }
                                table.prepend(colgroup)
                            }
                            else {
                                var colgroup = table.children('colgroup').children('col')
                                self.expandColgroup(colgroup)
                                table.toggleClass('jtable-expanded', true)
                            }

                        }
                    }, 1);
                })
                /**
                 * paste cells
                 */
                layoutInfo.editingArea.on('paste', '.note-editable', function (event) {
                    setTimeout(function() {
                        var $this = $(event.target).closest('.note-editable'),
                            $block = $this.closest('.note-editing-area').find('.jtable-block');

                        if (!tableBlock.currentTableEl || !$block[0] || $block[0].style.display == 'none') return true

                        var $p_Table = $this.find('table.jtable-paste')
                        if (!$p_Table.length) {
                            $p_Table = $(event.target).find('table')
                        }
                        if (!$p_Table.length) return true
                        $p_Table.remove()

                        var $p_cell = $p_Table.find('tr, td, th'),
                            p_vTable = new TableResultAction($p_cell, undefined, undefined, $p_Table[0]),
                            p_matrixTable = p_vTable.getMatrixTable(),
                            p_rows = p_matrixTable.length,
                            p_cols = p_matrixTable[0].length
                        
                        var b_table = tableBlock.currentTableEl,
                            b_cell = tableBlock.currentTdEl,
                            effectRow = tableBlock.effect.row,
                            effectCol = tableBlock.effect.col,
                            rows = effectRow.end - effectRow.start + 1,
                            cols = effectCol.end - effectCol.start + 1

                        var type = 0
                        if (p_rows == rows && p_cols == cols) type = 1  // completely match rows & columns
                        else if (p_cols > cols || p_rows > rows) type = 2    // need to add cols or rows
                        else type = 0   // replace by cell ignore rows & columns
                        
                        if (type > 0) {
                            if (type == 2) {
                                // new col
                                for (let index = cols; index < p_cols; index++) {
                                    // self.jAddCol('right')
                                    self.addCol(b_cell, 'right')
                                }
                                cols = p_cols
    
                                // new row
                                for (let index = rows; index < p_rows; index++) {
                                    // self.jAddRow('bottom')
                                    self.addRow(b_cell, 'bottom')
                                }
                                rows = p_rows
                            }

                            // replace by row & column
                            var vTable = new TableResultAction(b_cell, undefined, undefined, b_table),
                                matrixTable = vTable.getMatrixTable();

                            for (let i = 0; i < rows; i++) {
                                var row = matrixTable[i + effectRow.start],
                                    p_row = p_matrixTable[i].filter(cell => !cell.isVirtual);
                                for (let j = 0; j < cols; j++) {
                                    var cell = row[j + effectCol.start]
                                    if (!cell || !p_row[j]) continue
                                    cell.baseCell.innerText = p_row[j].baseCell.innerText
                                }
                            }
                        }
                        else {
                            // replace by cell ignore rows & columns
                            var p_cells = [],
                                cellIndex = 0
                            // expand matrixTable
                            for (let p_rIndex = 0; p_rIndex < p_matrixTable.length; p_rIndex++) {
                                const rows = p_matrixTable[p_rIndex];
                                for (let p_cIndex = 0; p_cIndex < rows.length; p_cIndex++) {
                                    const cell = rows[p_cIndex];
                                    p_cells.push(cell)
                                }
                            }
                            // replace by cell
                            for (let i = 0; i < rows; i++) {
                                var $row = b_table.rows[i + effectRow.start]
                                for (let j = 0; j < cols; j++, cellIndex++) {
                                    var cell = $row.cells[j + effectCol.start]
                                    if (!p_cells[cellIndex]) break
                                    cell.innerText = p_cells[cellIndex].baseCell.innerText
                                }
                            }
                        }

                        $block.hide()
                    }, 1);
                })
                layoutInfo.editingArea.on('click', function (event) {
                    var $jtable = $(event.target).closest('.note-editor').find('.note-toolbar .jtable-display'),
                        $block = $(event.target).closest('.note-editable').next('.jtable-block')
                    if ($block.css('display') == 'none')
                        $jtable.hide()
                })
                layoutInfo.editingArea.on('click', '.note-editable table', function (event) {
                    var $target = $(event.target).closest('td');
                    if (!$target.length) $target = $(event.target).closest('th');
                    if ($target.length) modules.tablePopover.update($target[0]);

                    var $jtable = $(event.target).closest('.note-editor').find('.note-toolbar .jtable-display')
                    $jtable.show()
                    event.stopPropagation()
                });
                /**
                 * change cursor when hover on table border
                 */
                layoutInfo.editingArea.on('mouseleave', '.note-editable tr', function (event) {
                    if (tableBlock.pressed) return true
                    if (tableResize.pressed) return true
                    var $this = $(this),
                        cursor = $this.closest('.note-editing-area').css('cursor')

                    if (cursor == 'row-resize' || cursor == 'col-resize')
                        $this.closest('.note-editing-area').css('cursor', 'auto');
                });
                layoutInfo.editingArea.on('mousemove', '.note-editable td,th', function (event) {
                    if (tableBlock.pressed) return true
                    if (tableResize.pressed) return true
                    var $this = $(this),
                        $table = $this.closest('table'),
                        $tr = $this.closest('tr'),
                        targetLeft = $this.offset().left,
                        targetWidth = $this.outerWidth(),
                        targetRight = targetLeft + targetWidth,
                        targetTop = $tr.offset().top,
                        targetHeight = $this.outerHeight(),
                        targetBottom = targetTop + targetHeight;

                    var rightFlag = false;
                    if (targetRight - 5 <= event.pageX) {
                        rightFlag = true;
                    }
                    var bottomFlag = false;
                    if (targetBottom - 5 <= event.pageY) {
                        bottomFlag = true;
                    }

                    var cursor;
                    if (rightFlag) {
                        cursor = 'col-resize';
                    } else if (bottomFlag) {
                        cursor = 'row-resize';
                    } else {
                        cursor = 'auto'
                    }

                    $this.closest('.note-editing-area').css('cursor', cursor);
                });
                /**----- */

                /**
                 * get table block info
                 */
                layoutInfo.editingArea.on('mousedown', 'td', function (event) {
                    if (tableBlock.pressed) return true;
                    var $this = $(this);
                    resetTableBlock($this);

                    if (tableResize.pressed) return true;

                    var $table = $this.closest('table');
                    var targetTop = $this.offset().top;
                    var targetLeft = $this.offset().left;
                    var targetWidth = $this.outerWidth();
                    var targetHeight = $this.outerHeight();
                    var targetRight = targetLeft + targetWidth;
                    var targetBottom = targetTop + targetHeight;

                    var cellPosition = getCellPosition(this, $table[0]);

                    tableBlock = {
                        pressed          : true,
                        currentTableEl   : $table[0],
                        currentTdEl      : this,
                        currentTdLeft    : targetLeft,
                        currentTdRight   : targetRight,
                        currentTdTop     : targetTop,
                        currentTdBottom  : targetBottom,
                        currentTdPosition: {
                            row: cellPosition.row,
                            col: cellPosition.col,
                        },
                        width            : targetRight,
                        height           : targetBottom,
                        top              : targetTop,
                        left             : targetLeft,
                        effect           : {
                            row: {
                                start: cellPosition.row,
                                end  : cellPosition.row,
                            },
                            col: {
                                start: cellPosition.col,
                                end  : cellPosition.col,
                            },
                        },
                    };

                    event.stopPropagation();
                    // remove this to make content selectable
                    // if (isMSIE) {
                    //     $table.toggleClass('unselectable', true)
                    //     $table.attr('unselectable', 'on')
                    // }
                });

                layoutInfo.editingArea.on('mouseup', 'td', function (event) {
                    var $this = $(this);
                    if (!tableBlock.pressed) return true;

                    var $table = $this.closest('table');
                    var cellPosition = getCellPosition(this, $table[0]);
                    var currentTdElIsEnd = tableBlock.currentTdPosition.row < cellPosition.row || tableBlock.currentTdPosition.col < cellPosition.col

                    var targetTop = currentTdElIsEnd ? tableBlock.currentTdTop : $this.offset().top;
                    var targetLeft = currentTdElIsEnd ? tableBlock.currentTdLeft : $this.offset().left;
                    var targetWidth = $this.outerWidth();
                    var targetHeight = $this.outerHeight();
                    var targetRight = currentTdElIsEnd ? tableBlock.currentTdRight : targetLeft + targetWidth;
                    var targetBottom = currentTdElIsEnd ? tableBlock.currentTdBottom : targetTop + targetHeight;

                    tableBlock = {
                        ...tableBlock,
                        pressed: false,
                        currentTableEl: currentTdElIsEnd ? tableBlock.currentTableEl : $table[0],
                        currentTdEl: currentTdElIsEnd ? tableBlock.currentTdEl : this,
                        currentTdLeft: targetLeft,
                        currentTdRight: targetRight,
                        currentTdTop: targetTop,
                        currentTdBottom: targetBottom,
                        currentTdPosition: {
                            row: cellPosition.row,
                            col: cellPosition.col,
                        },
                        width: targetRight,
                        height: targetBottom,
                        top: targetTop,
                        left: targetLeft,
                    };

                    var $target = $(event.target).closest('td');
                    if (!$target.length) $target = $(event.target).closest('th');
                    if ($target.length) modules.tablePopover.update($target[0]);
                });
                
                /**
                 * select table cell
                 */
                layoutInfo.editingArea.on('mousemove', '.note-editable', function (event) {
                    if (!tableBlock.pressed) return true;
                    modules.tablePopover.hide();

                    var $this = $(event.target).closest('td');
                    if (!$this.length) $this = $(event.target).closest('th');
                    var $block = $this.closest('.note-editing-area').find('.jtable-block');
                    if ($this.length) {
                        var $table = $this.closest('table');
                        var targetTop = $this.offset().top;
                        var targetLeft = $this.offset().left;
                        var targetWidth = $this.outerWidth();
                        var targetHeight = $this.outerHeight();
                        var targetRight = targetLeft + targetWidth;
                        var targetBottom = targetTop + targetHeight;

                        var cellPosition = getCellPosition($this[0], $table[0]);

                        var colPos = tableBlock.effect.col;
                        var rowPos = tableBlock.effect.row;

                        if (tableBlock.currentTdLeft >= targetLeft) {
                            tableBlock.left = targetLeft;
                            tableBlock.width = tableBlock.currentTdRight - targetLeft;
                            colPos.end = tableBlock.currentTdPosition.col;
                            colPos.start = cellPosition.col;
                        } else {
                            tableBlock.width = targetRight - tableBlock.left;
                            colPos.end = cellPosition.col;
                        }

                        if (tableBlock.currentTdTop >= targetTop) {
                            tableBlock.top = targetTop;
                            tableBlock.height = tableBlock.currentTdBottom - targetTop;
                            rowPos.end = tableBlock.currentTdPosition.row;
                            rowPos.start = cellPosition.row;
                        } else {
                            tableBlock.height = targetBottom - tableBlock.top;
                            rowPos.end = cellPosition.row;
                        }

                        $block.show();
                        $block.offset({
                            left: tableBlock.left,
                            top : tableBlock.top,
                        });
                        $block.css({
                            width : tableBlock.width,
                            height: tableBlock.height,
                        });

                    }
                });
                /**
                 * when onblur table hide jtable-block(cell selection)
                 */
                layoutInfo.editingArea.on('mousedown', '.note-editable', function (event) {
                    var $block = $(event.target).closest('.note-editable').next('.jtable-block')
                    $block.hide()
                })

                layoutInfo.editingArea.on('mousemove mousedown touchstart', '.note-editable', function (event) {
                    if (!tableBlock.pressed) return true;
                    // content inside a cell should be selectable
                    // event.preventDefault();
                });

                /**
                 * reset table pressed and update table popover
                 */
                layoutInfo.editingArea.on('mouseup', '.note-editable', function (event) {
                    if (isMSIE) {
                        var $table = $('table.unselectable');
                        $table.toggleClass('unselectable', false)
                        $table.attr('unselectable', 'off')
                    }

                    if (!tableBlock.pressed) return true;
                    tableBlock.pressed = false;
                    
                    // var $target = $(event.target).closest('td');
                    // if (!$target.length) $target = $(event.target).closest('th');
                    // if ($target.length) modules.tablePopover.update($target[0]);

                });

                // 拿來比對新的 table
                var oldTable = null;

                // 每次透過 popover 向左向右增加 column 時補上 <colgroup> 內的 <col>
                function fillInColgroup() {
                    var $this = $(this);
                    var $table = $this.closest('.note-editor').find('table');
                    var vTable = new TableResultAction(undefined, undefined, undefined, $table[0]);
                    var virtualTable = vTable.getVirtualTable();

                    // 標記那些欄位有增加，但若只是 colspan 加大則無法判斷
                    var tableMark = virtualTable.map((tr, trIndex) => {
                        return tr.map((td) => {
                            return oldTable[trIndex].reduce((acc, oldTd) => {
                                if (oldTd.baseCell === td.baseCell) return true
                                return acc 
                            }, false)
                        })
                    })

                    var copyTableMark = [...tableMark]
                    var tbody = $table.children('tbody')

                    // 確認 table 那些欄位出錯了，正常一次只能增加一個 column
                    var errorTdIdxList = copyTableMark.reduce((errorIdxList, tr, trIdx) => {
                        var tdIdxStart = -1
                        var tdIdxEnd = -1
                        var hasError = false
                        tr.forEach((td, idx) => {
                            if (tdIdxStart === -1 && td === false) tdIdxStart = idx
                            if (tdIdxStart > -1 && td === false && tdIdxStart + 1 === idx) {
                                hasError = true
                                tdIdxEnd = idx
                            } 
                            if (tdIdxEnd > -1 && td === false && tdIdxEnd + 1 === idx) {
                                tdIdxEnd = idx
                            } 
                        });

                        if (hasError) {
                            // 把不正確的 table 都先濾掉
                            tableMark = tableMark.reduce((list, tr, trIndex) => {
                                if (trIndex === trIdx) {
                                    var newList = tableMark[trIdx].filter((td, idx) => {
                                        return !(idx >= tdIdxStart && idx <= tdIdxEnd)
                                    })
                                    return [...list, newList]
                                }
                                return [...list, tr]
                            }, [])

                            if (!tbody[0]) return
                            tbody[0].childNodes[trIdx].childNodes[tdIdxStart].remove()
                            tbody[0].childNodes[trIdx].childNodes[tdIdxStart].colSpan = tbody[0].childNodes[trIdx].childNodes[tdIdxStart].colSpan + 1
                        }

                        return [...errorIdxList, { tdIdxStart, tdIdxEnd, hasError }]
                    }, [])

                    // 哪一個 tr 內的 td 最多，就拿哪一個當標準
                    var maxTdOfTr = tableMark.reduce((acc, tr, trIdx) => {
                        if (tr.length >= acc.length) {
                            var haveChange = tr.reduce((change, td) => {
                                return !td || change
                            }, false)
                            if (haveChange) {
                                return {
                                    trIdx,
                                    length: tr.length
                                }
                            }
                        }
                        return acc
                    }, { trIdx: -1, length: 0 })

                    var colgroup = $table.children('colgroup').children('col')
                    var colgroupIdx = 0
                    if (!tableMark[maxTdOfTr.trIdx]) return
                    var colgroupHTML = tableMark[maxTdOfTr.trIdx].reduce((acc, td) => {
                        if (!td) return acc + `<col style="width: 100px;" />`
                        var newColgroupHTML = acc + colgroup[colgroupIdx].outerHTML
                        colgroupIdx++
                        return newColgroupHTML
                    }, '')

                    colgroup.closest('colgroup').html(colgroupHTML)                    
                    resetTableBlock($table);
                }

                // 每次透過 popover 減少 column 時也一併減少 <colgroup> 內的 <col>
                function deleteColOfColgroup() {
                    var $this = $(this);
                    var $table = $this.closest('.note-editor').find('table');
                    var vTable = new TableResultAction(undefined, undefined, undefined, $table[0]);
                    var virtualTable = vTable.getVirtualTable();

                    var tableMark = oldTable.map((tr, trIndex) => {
                        return tr.map((td) => {
                            return virtualTable[trIndex].reduce((acc, oldTd) => {
                                if (oldTd.baseCell === td.baseCell) return true
                                return acc 
                            }, false)
                        })
                    })

                    var maxTdOfTr = tableMark.reduce((acc, tr, trIdx) => {
                        if (tr.length >= acc.length) {
                            var haveChange = tr.reduce((change, td) => {
                                return !td || change
                            }, false)
                            if (haveChange) {
                                return {
                                    trIdx,
                                    length: tr.length
                                }
                            }
                        }
                        return acc
                    }, { trIdx: -1, length: 0 })

                    var colgroup = $table.children('colgroup').children('col')
                    if (!tableMark[maxTdOfTr.trIdx]) return
                    var colgroupHTML = tableMark[maxTdOfTr.trIdx].reduce((acc, td, tdIdx) => {
                        if (!!td) {
                            return acc + colgroup[tdIdx].outerHTML
                        } 
                        return acc
                    }, '')
                    colgroup.closest('colgroup').html(colgroupHTML)
                    resetTableBlock($table);
                }

                layoutInfo.editor.on('click', '[aria-label="Add column left"]', fillInColgroup)
                layoutInfo.editor.on('click', '[aria-label="左方插入欄"]', fillInColgroup)

                layoutInfo.editor.on('click', '[aria-label="Add column right"]', fillInColgroup)
                layoutInfo.editor.on('click', '[aria-label="右方插入欄"]', fillInColgroup)

                layoutInfo.editor.on('click', '[aria-label="Delete column"]', deleteColOfColgroup)
                layoutInfo.editor.on('click', '[aria-label="刪除欄"]', deleteColOfColgroup)


                /**
                 * get table resize info
                 */
                layoutInfo.editingArea.on('mousedown', 'td', function (event) {
                    var $this = $(this);
                    var $table = $this.closest('table');
                    var vTable = new TableResultAction(this, undefined, undefined, $table[0]);
                    var virtualTable = vTable.getVirtualTable();
                    oldTable = virtualTable
                    
                    var $tr = $this.closest('tr');
                    var targetLeft = $this.offset().left;
                    var targetWidth = $this.outerWidth();
                    var targetRight = targetLeft + targetWidth;
                    var targetTop = $tr.offset().top;
                    var targetHeight = $this.outerHeight();
                    var targetBottom = targetTop + targetHeight;

                    var rightFlag = false;
                    if (targetRight - 5 <= event.pageX) {
                        rightFlag = true;
                    }
                    var bottomFlag = false;
                    if (targetBottom - 5 <= event.pageY) {
                        bottomFlag = true;
                    }

                    var contenteditable = $this.closest('.note-editable').prop('contenteditable');

                    if (!rightFlag && !bottomFlag) {
                        resetTableResizeCursor($this, contenteditable);
                        resetTableResize();
                        return;
                    }

                    modules.tablePopover.hide();

                    var cursor;
                    if (rightFlag) {
                        cursor = 'col-resize';
                    } else {
                        cursor = 'row-resize';
                    }

                    $this.closest('.note-editing-area').css('cursor', cursor);
                    $this.closest('.note-editable').removeAttr('contenteditable');

                    /**
                     * expand colgroup col span
                     * select current level only
                     */
                    var colgroup = $table.children('colgroup').children('col')
                    self.expandColgroup(colgroup)

                    /**
                     * remove td width turn into <col> width
                     */
                    var tds = $table.find('td')
                    for (let index = 0; index < tds.length; index++) {
                        var td = tds[index];
                        if (!!td.width) td.width = ''
                        if (!!td.style.width) td.style.width = ''
                    }
                    
                    var trIndex = $tr[0].rowIndex;

                    var cellHasColspan = (this.colSpan > 1);
                    var tdList = virtualTable[trIndex];
                    for (var colIndex = 0; colIndex < tdList.length; colIndex++) {
                        var virtualTd = tdList[colIndex];
                        if (this == virtualTd.baseCell) break;
                    }
                    if (cellHasColspan) {
                        colIndex += this.colSpan - 1;
                    }

                    var firstTdEl = virtualTable[0][colIndex].baseCell;
                    var colEl = $table.find('colgroup:first col')[colIndex];
                    var startWidth = $this.width();
                    if (colEl) {
                        startWidth = $(colEl).width();
                    }

                    tableResize = {
                        pressed        : true,
                        rightFlag      : rightFlag,
                        bottomFlag     : bottomFlag,
                        currentTableEl : $table[0],
                        currentTrEl    : $tr[0],
                        firstTdEl      : firstTdEl,
                        colEl          : colEl,
                        currentTdEl    : this,
                        currentTdLeft  : targetLeft,
                        currentTdRight : targetRight,
                        currentTdTop   : targetTop,
                        currentTdBottom: targetBottom,
                        startX         : event.pageX,
                        startWidth     : startWidth,
                        startY         : event.pageY,
                        startHeight    : $this.height(),
                        contenteditable: contenteditable
                    };

                    // prevent default selection
                    if (isMSIE) {
                        $table.toggleClass('unselectable', true)
                        $table.attr('unselectable', 'on')
                    }

                    resetTableBlock($this);

                    event.stopPropagation();
                });
                /**
                 * table resize
                 */
                layoutInfo.editingArea.on('mousemove', '.note-editable', function (event) {
                    if (!tableResize.pressed) return true;
                    var $this = $(this);
                    var targetLeft = tableResize.currentTdLeft;
                    var targetTop = tableResize.currentTdTop;

                    if (tableResize.rightFlag) {
                        if (!(targetLeft + 1 <= event.pageX)) {
                            resetTableResizeCursor($this, tableResize.contenteditable);
                            resetTableResize();
                            return true;
                        }

                        var resizeTargetEl = tableResize.firstTdEl;
                        if (tableResize.colEl) {
                            resizeTargetEl = tableResize.colEl;
                        }
                        var width = tableResize.startWidth + (event.pageX - tableResize.startX);
                        execTableResize('width', $(resizeTargetEl), width);
                    }

                    else if (tableResize.bottomFlag) {
                        if (!(targetTop + 1 <= event.pageY)) {
                            resetTableResizeCursor($this, tableResize.contenteditable);
                            resetTableResize();
                            return true;
                        }

                        var resizeTargetEl = tableResize.currentTrEl;
                        var height = tableResize.startHeight + (event.pageY - tableResize.startY);
                        execTableResize('height', $(resizeTargetEl), height);
                    }

                });
                layoutInfo.editingArea.on('mousemove mousedown touchstart', '.note-editable', function (event) {
                    if (!tableResize.pressed) return true;
                    event.preventDefault();
                });
                /**
                 * reset table resize info
                 */
                layoutInfo.editingArea.on('mouseup', '.note-editable', function (event) {
                    var $table = $('table.unselectable');
                    $table.toggleClass('unselectable', false)
                    $table.attr('unselectable', 'off')

                    if (!tableResize.pressed) return true;
                    context.invoke('beforeCommand')
                    resetTableResizeCursor($(this), tableResize.contenteditable);
                    resetTableResize();
                    context.invoke("afterCommand")
                });
            },
        };

        self.initialize = function () {
        };

        self.destroy = function () {
            ui.hideDialog($mergeDialog);
            $mergeDialog.remove();

            ui.hideDialog($tableInfoDialog);
            $tableInfoDialog.remove();
        };


        function execTableResize(type, $resizeTargetEl, size) {
            switch (type) {
                case 'width':
                    $resizeTargetEl.width(size);
                    break;
                case 'height':
                    $resizeTargetEl.children().height(size);
                    break;
            }
        }

        function resetTableResizeCursor($this, contenteditable) {
            $this.closest('.note-editing-area').css('cursor', 'auto');
            $this.closest('.note-editable').prop('contenteditable', contenteditable);
        }

        function resetTableResize() {
            tableResize = {
                pressed        : false,
                rightFlag      : false,
                bottomFlag     : false,
                currentTableEl : undefined,
                firstTdEl      : undefined,
                colEl          : undefined,
                currentTdEl    : undefined,
                currentTdLeft  : undefined,
                currentTdRight : undefined,
                currentTdTop   : undefined,
                currentTdBottom: undefined,
                startX         : undefined,
                startWidth     : undefined,
                startY         : undefined,
                startHeight    : undefined,
                contenteditable: false
            };
        }

        function resetTableBlock($this) {
            tableBlock = {
                pressed          : false,
                currentTableEl   : undefined,
                currentTdEl      : undefined,
                currentTdLeft    : undefined,
                currentTdRight   : undefined,
                currentTdTop     : undefined,
                currentTdBottom  : undefined,
                currentTdPosition: {
                    row: undefined,
                    col: undefined,
                },
                width            : undefined,
                height           : undefined,
                top              : undefined,
                left             : undefined,
                effect           : {
                    row: {
                        start: undefined,
                        end  : undefined,
                    },
                    col: {
                        start: undefined,
                        end  : undefined,
                    },
                },
            };

            var $block = $this.closest('.note-editing-area').find('.jtable-block');
            $block.hide();
        }

        function getCellPosition(cellEl, tableEl) {
            var vTable = new TableResultAction(cellEl, undefined, undefined, tableEl);
            var matrixTable = vTable.getMatrixTable();
            for (var rowIndex = 0; rowIndex < matrixTable.length; rowIndex++) {
                var virtualTr = matrixTable[rowIndex];
                for (var colIndex = 0; colIndex < virtualTr.length; colIndex++) {
                    var virtualTd = matrixTable[rowIndex][colIndex];
                    if (virtualTd.baseCell == cellEl) {
                        return {
                            row: rowIndex,
                            col: colIndex,
                        };
                    }
                }

            }
        }

    };
    // add table / table col resize end


    // 'TableResultAction' copy 'summernote-0.8.16\src\js\base\editing\Table.js'
    /**
     * @class Create a virtual table to create what actions to do in change.
     * @param {object} startPoint Cell selected to apply change.
     * @param {enum} where  Where change will be applied Row or Col. Use enum: TableResultAction.where
     * @param {enum} action Action to be applied. Use enum: TableResultAction.requestAction
     * @param {object} domTable Dom element of table to make changes.
     */
    var TableResultAction = function (startPoint, where, action, domTable) {
        const _startPoint = {'colPos': 0, 'rowPos': 0};
        const _virtualTable = [];
        const _actionCellList = [];
        const _matrixTable = [];

        /// ///////////////////////////////////////////
        // Private functions
        /// ///////////////////////////////////////////

        /**
         * Set the startPoint of action.
         */
        function setStartPoint() {
            if (!startPoint || !startPoint.tagName || (startPoint.tagName.toLowerCase() !== 'td' && startPoint.tagName.toLowerCase() !== 'th')) {
                // Impossible to identify start Cell point
                return;
            }
            _startPoint.colPos = startPoint.cellIndex;
            if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== 'tr') {
                // Impossible to identify start Row point
                return;
            }
            _startPoint.rowPos = startPoint.parentElement.rowIndex;
        }

        /**
         * Define virtual table position info object.
         *
         * @param {int} rowIndex Index position in line of virtual table.
         * @param {int} cellIndex Index position in column of virtual table.
         * @param {object} baseRow Row affected by this position.
         * @param {object} baseCell Cell affected by this position.
         * @param {bool} isSpan Inform if it is an span cell/row.
         */
        function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
            const objPosition = {
                'baseRow'  : baseRow,
                'baseCell' : baseCell,
                'isRowSpan': isRowSpan,
                'isColSpan': isColSpan,
                'isVirtual': isVirtualCell,
            };
            if (!_virtualTable[rowIndex]) {
                _virtualTable[rowIndex] = [];
            }
            _virtualTable[rowIndex][cellIndex] = objPosition;
        }

        /**
         * Create action cell object.
         *
         * @param {object} virtualTableCellObj Object of specific position on virtual table.
         * @param {enum} resultAction Action to be applied in that item.
         */
        function getActionCell(virtualTableCellObj, resultAction, virtualRowPosition, virtualColPosition) {
            return {
                'baseCell'    : virtualTableCellObj.baseCell,
                'action'      : resultAction,
                'virtualTable': {
                    'rowIndex' : virtualRowPosition,
                    'cellIndex': virtualColPosition,
                },
            };
        }

        /**
         * Recover free index of row to append Cell.
         *
         * @param {Array} _table _virtualTable / _matrixTable.
         * @param {int} rowIndex Index of row to find free space.
         * @param {int} cellIndex Index of cell to find free space in table.
         */
        function recoverCellIndex(_table, rowIndex, cellIndex) {
            if (!_table[rowIndex]) {
                return cellIndex;
            }
            if (!_table[rowIndex][cellIndex]) {
                return cellIndex;
            }

            let newCellIndex = cellIndex;
            while (_table[rowIndex][newCellIndex]) {
                newCellIndex++;
                if (!_table[rowIndex][newCellIndex]) {
                    return newCellIndex;
                }
            }
        }

        /**
         * Recover info about row and cell and add information to virtual table.
         *
         * @param {object} row Row to recover information.
         * @param {object} cell Cell to recover information.
         */
        function addCellInfoToVirtual(row, cell) {
            const cellIndex = recoverCellIndex(_virtualTable, row.rowIndex, cell.cellIndex);
            const cellHasColspan = (cell.colSpan > 1);
            const cellHasRowspan = (cell.rowSpan > 1);
            const isThisSelectedCell = (row.rowIndex === _startPoint.rowPos && cell.cellIndex === _startPoint.colPos);
            setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false);

            // Add span rows to virtual Table.
            const rowspanNumber = cell.attributes.rowSpan ? parseInt(cell.attributes.rowSpan.value, 10) : 0;
            if (rowspanNumber > 1) {
                for (let rp = 1; rp < rowspanNumber; rp++) {
                    const rowspanIndex = row.rowIndex + rp;
                    adjustStartPoint(rowspanIndex, cellIndex, cell, isThisSelectedCell);
                    setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan, true);
                }
            }

            // Add span cols to virtual table.
            const colspanNumber = cell.attributes.colSpan ? parseInt(cell.attributes.colSpan.value, 10) : 0;
            if (colspanNumber > 1) {
                for (let cp = 1; cp < colspanNumber; cp++) {
                    const cellspanIndex = recoverCellIndex(_virtualTable, row.rowIndex, (cellIndex + cp));
                    adjustStartPoint(row.rowIndex, cellspanIndex, cell, isThisSelectedCell);
                    setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true, true);
                }
            }
        }

        /**
         * Process validation and adjust of start point if needed
         *
         * @param {int} rowIndex
         * @param {int} cellIndex
         * @param {object} cell
         * @param {bool} isSelectedCell
         */
        function adjustStartPoint(rowIndex, cellIndex, cell, isSelectedCell) {
            if (rowIndex === _startPoint.rowPos && _startPoint.colPos >= cell.cellIndex && cell.cellIndex <= cellIndex && !isSelectedCell) {
                _startPoint.colPos++;
            }
        }

        /**
         * Create virtual table of cells with all cells, including span cells.
         */
        function createVirtualTable() {
            const rows = domTable.rows;
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const cells = rows[rowIndex].cells;
                for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                    addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
                }
            }
        }

        /**
         * Get action to be applied on the cell.
         *
         * @param {object} cell virtual table cell to apply action
         */
        function getDeleteResultActionToCell(cell) {
            switch (where) {
                case TableResultAction.where.Column:
                    if (cell.isColSpan) {
                        return TableResultAction.resultAction.SubtractSpanCount;
                    }
                    break;
                case TableResultAction.where.Row:
                    if (!cell.isVirtual && cell.isRowSpan) {
                        return TableResultAction.resultAction.AddCell;
                    } else if (cell.isRowSpan) {
                        return TableResultAction.resultAction.SubtractSpanCount;
                    }
                    break;
            }
            return TableResultAction.resultAction.RemoveCell;
        }

        /**
         * Get action to be applied on the cell.
         *
         * @param {object} cell virtual table cell to apply action
         */
        function getAddResultActionToCell(cell) {
            switch (where) {
                case TableResultAction.where.Column:
                    if (cell.isColSpan) {
                        return TableResultAction.resultAction.SumSpanCount;
                    } else if (cell.isRowSpan && cell.isVirtual) {
                        return TableResultAction.resultAction.Ignore;
                    }
                    break;
                case TableResultAction.where.Row:
                    if (cell.isRowSpan) {
                        return TableResultAction.resultAction.SumSpanCount;
                    } else if (cell.isColSpan && cell.isVirtual) {
                        return TableResultAction.resultAction.Ignore;
                    }
                    break;
            }
            return TableResultAction.resultAction.AddCell;
        }

        /**
         * Create matrix table of cells with all cells, including span cells.
         */
        function createMatrixTable() {
            const rows = domTable.rows;
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const cells = rows[rowIndex].cells;
                for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                    addCellInfoToMatrix(rows[rowIndex], cells[cellIndex]);
                }
            }
        }

        /**
         * Define matrix table position info object.
         *
         * @param {int} rowIndex Index position in line of matrix table.
         * @param {int} cellIndex Index position in column of matrix table.
         * @param {object} baseRow Row affected by this position.
         * @param {object} baseCell Cell affected by this position.
         * @param {bool} isRowSpan Inform if it is an span row.
         * @param {bool} isColSpan Inform if it is an span cell.
         * @param {bool} isVirtualCell Inform if it is an virtual cell.
         */
        function setMatrixTable(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
            const objPosition = {
                'baseRow'  : baseRow,
                'baseCell' : baseCell,
                'isRowSpan': isRowSpan,
                'isColSpan': isColSpan,
                'isVirtual': isVirtualCell,
            };
            if (!_matrixTable[rowIndex]) {
                _matrixTable[rowIndex] = [];
            }

            _matrixTable[rowIndex][cellIndex] = objPosition;
        }

        /**
         * Recover info about row and cell and add information to matrix table.
         *
         * @param {object} row Row to recover information.
         * @param {object} cell Cell to recover information.
         */
        function addCellInfoToMatrix(row, cell) {
            const rowIndex = row.rowIndex;
            const cellIndex = recoverCellIndex(_matrixTable, row.rowIndex, cell.cellIndex);
            const cellHasRowspan = (cell.rowSpan > 1);
            const cellHasColspan = (cell.colSpan > 1);
            setMatrixTable(rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false);

            const rowspanNumber = cell.rowSpan;
            const colspanNumber = cell.colSpan;

            if (cellHasColspan) {
                for (let colCount = 1; colCount < colspanNumber; colCount++) {
                    setMatrixTable(rowIndex, cellIndex + colCount, row, cell, cellHasRowspan, cellHasColspan, true);
                }
            }

            if (cellHasRowspan) {
                for (let rowCount = 1; rowCount < rowspanNumber; rowCount++) {
                    setMatrixTable(rowIndex + rowCount, cellIndex, row, cell, cellHasRowspan, cellHasColspan, true);
                    if (cellHasColspan) {
                        for (let colCount = 1; colCount < colspanNumber; colCount++) {
                            setMatrixTable(rowIndex + rowCount, cellIndex + colCount, row, cell, cellHasRowspan, cellHasColspan, true);
                        }
                    }
                }
            }

        }

        function init() {
            setStartPoint();
            createVirtualTable();
            createMatrixTable();
        }

        /// ///////////////////////////////////////////
        // Public functions
        /// ///////////////////////////////////////////

        /**
         * Recover array os what to do in table.
         */
        this.getActionList = function () {
            const fixedRow = (where === TableResultAction.where.Row) ? _startPoint.rowPos : -1;
            const fixedCol = (where === TableResultAction.where.Column) ? _startPoint.colPos : -1;

            let actualPosition = 0;
            let canContinue = true;
            while (canContinue) {
                const rowPosition = (fixedRow >= 0) ? fixedRow : actualPosition;
                const colPosition = (fixedCol >= 0) ? fixedCol : actualPosition;
                const row = _virtualTable[rowPosition];
                if (!row) {
                    canContinue = false;
                    return _actionCellList;
                }
                const cell = row[colPosition];
                if (!cell) {
                    canContinue = false;
                    return _actionCellList;
                }

                // Define action to be applied in this cell
                let resultAction = TableResultAction.resultAction.Ignore;
                switch (action) {
                    case TableResultAction.requestAction.Add:
                        resultAction = getAddResultActionToCell(cell);
                        break;
                    case TableResultAction.requestAction.Delete:
                        resultAction = getDeleteResultActionToCell(cell);
                        break;
                }
                _actionCellList.push(getActionCell(cell, resultAction, rowPosition, colPosition));
                actualPosition++;
            }

            return _actionCellList;
        };

        /**
         * Return _virtualTable
         */
        this.getVirtualTable = function () {
            return _virtualTable;
        };

        /**
         * Return _matrixTable
         */
        this.getMatrixTable = function () {
            return _matrixTable;
        };

        /**
         * Return Column count
         */
        this.getColCount = function () {
            let columnCount = 0;
            for (let i = 0; i < _matrixTable.length; i++) {
                let row = _matrixTable[i];
                if (columnCount <= row.length) columnCount = row.length;
            }
            return columnCount;
        };


        init();
    };
    /**
     *
     * Where action occours enum.
     */
    TableResultAction.where = {'Row': 0, 'Column': 1};
    /**
     *
     * Requested action to apply enum.
     */
    TableResultAction.requestAction = {'Add': 0, 'Delete': 1};
    /**
     *
     * Result action to be executed enum.
     */
    TableResultAction.resultAction = {
        'Ignore'           : 0,
        'SubtractSpanCount': 1,
        'RemoveCell'       : 2,
        'AddCell'          : 3,
        'SumSpanCount'     : 4
    };


    // Extends summernote
    $.extend(true, $.summernote.options, {
        jTable: {
            mergeMode: 'drag',  // drag || dialog
        },
    });
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            jTable: {
                borderColor    : '外框顏色',
                merge          : {
                    merge  : '合併儲存格',
                    colspan: '欄',
                    rowspan: '列',
                    split  : '取消合併儲存格',
                },
                align          : {
                    top     : '靠上對齊',
                    middle  : '置中對齊',
                    bottom  : '靠下對齊',
                    baseline: 'baseline',
                },
                info           : {
                    info  : 'table info',
                    margin: '邊界'
                },
                autofit: {
                    autofit: '自動調整',
                    contents: '自動調整成內容大小',
                    window: '自動調整成視窗大小',
                    fixed: '固定欄寬',
                },
                apply          : '套用',
                addDeleteRowCOl: '欄/列(插入/刪除)',
                areaReset      : '清除格式',
                message        : '<b>取消合併儲存格才可使用</br>',
            }
        },
        'en-US': {
            jTable: {
                borderColor    : 'Border color',
                merge          : {
                    merge  : 'cell merge',
                    colspan: 'colspan',
                    rowspan: 'rowspan',
                    split  : 'cell split',
                },
                align          : {
                    top     : 'top',
                    middle  : 'middle',
                    bottom  : 'bottom',
                    baseline: 'baseline',
                },
                info           : {
                    info  : 'table info',
                    margin: 'margin'
                },
                autofit: {
                    autofit: 'autofit',
                    contents: 'autofit contents',
                    window: 'autofit window',
                    fixed: 'fixed column',
                },
                apply          : 'apply',
                addDeleteRowCOl: 'Row/Col(Add/Del)',
                areaReset      : 'area Reset',
                message        : '<b>Available after unmerge<br/>current or surrounding cells</br>',
            }
        },
        'ko-KR': {
            jTable: {
                borderColor    : '선색',
                merge          : {
                    merge  : '셀 합치기',
                    colspan: '가로',
                    rowspan: '세로',
                    split  : '셀 나누기',
                },
                align          : {
                    top     : '위쪽 정렬',
                    middle  : '가운데 정렬',
                    bottom  : '아래쪽 정렬',
                    baseline: '기본 정렬',
                },
                info           : {
                    info  : '테이블 정보',
                    margin: '여백'
                },
                apply          : '적용',
                addDeleteRowCOl: '행/열(추가/삭제)',
                areaReset      : '넓이/높이 초기화',
                message        : '<b>현재 또는 주위 셀<br/>병합 해제 후 사용 가능</b>',
            }
        },
    });
    $.extend(true, $.summernote, {
        plugins: {
            jTable: JTablePlugin,
        },
    });
}));
