/**
 * options={{
        customContextMenu: {
            className: 'summernote-custom-contextmenu',
            menuBtns: [
                [
                    { key: 'cut', name: lang.customContextMenu.cut, },
                ],
                [
                    {
                        key: 'jDeleteRowCol', name: lang.jTable.deleteCell,
                        contents: ui.icon(options.icons.rowRemove),
                        toggle: 'table',
                        submenu: [
                            { key: 'jDeleteRow', name: lang.table.delRow, },
                            { key: 'jDeleteCol', name: lang.table.delCol, },
                        ]
                    },
                ]
            ],
            onContextMenuOpen: function (contextMenu) {
                // toggle button
            },
            shouldInitialize: true,
        }
    }}
 * add button to custom context menu
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
    $.extend($.summernote.options, {
        customContextMenu: {
            className: null,
            menuBtns: null,
            onContextMenuOpen: null,
            shouldInitialize: true,
        }
    })
    $.extend($.summernote.plugins, {
        'customContextMenu': function (context) {
            var range = $.summernote.range;
            var dom = $.summernote.dom;
            var lists = $.summernote.lists;
            var self = this,
                ui = $.summernote.ui,
                $note = context.layoutInfo.note,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                $toolbar = context.layoutInfo.toolbar,
                $statusbar = context.layoutInfo.statusbar,
                modules = context.modules,
                options = context.options,
                lang = options.langInfo;

            this.clipboardPermission = false
            this.listenButtons = []

            const menuBtns = options.customContextMenu.menuBtns ||
                [
                    [
                        { key: 'cut', name: lang.customContextMenu.cut, },
                        { key: 'copy', name: lang.customContextMenu.copy, },
                        { key: 'paste', name: lang.customContextMenu.paste, },
                        { key: 'pasteUnformat', name: lang.customContextMenu.pasteUnformat, },
                    ],
                    [
                        { key: 'link', name: lang.link.insert, shorcut: 'linkDialog.show' },
                        { key: 'jInsertTableDialog', name: lang.jTable.table.insertTable },
                        {
                            key: 'jDeleteRowCol', name: lang.jTable.deleteCell,
                            contents: ui.icon(options.icons.rowRemove),
                            toggle: 'table',
                            submenu: [
                                { key: 'jDeleteRow', name: lang.table.delRow, },
                                { key: 'jDeleteCol', name: lang.table.delCol, },
                            ]
                        },
                        { key: 'jCellMerge', name: lang.jTable.merge.merge, toggle: 'table' },
                        { key: 'jCellSplit', name: lang.jTable.merge.split, toggle: 'table' },
                    ],
                ]

            const className = options.customContextMenu.className || 'summernote-custom-contextmenu'
            const onContextMenuOpen = options.customContextMenu.onContextMenuOpen ||
                function toggleCellSplitBtn(contextMenu) {
                    var rng = range.create()
                    rng.isOnTable = rng.makeIsOn(dom.isTable)
                    if (rng.isOnTable()) {
                        var $cellSplitBtn = $(contextMenu).find('.note-btn-jtable-cell-split');
                        var cellHasSpan = false;
                        if (rng.isCollapsed() && rng.isOnCell()) {
                            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
                            cellHasSpan = (cell.rowSpan > 1) || (cell.colSpan > 1);
                        }
                        $cellSplitBtn.toggleClass('disabled', !cellHasSpan);
                        $cellSplitBtn.attr('disabled', !cellHasSpan);
                    }
                }
            const shouldInitialize = options.customContextMenu.shouldInitialize

            const icon = {
                cut: `
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path transform="rotate(-90 256 256)" d="M256 192l-39.5-39.5c4.9-12.6 7.5-26.2 7.5-40.5C224 50.1 173.9 0 112 0S0 50.1 0 112s50.1 112 112 112c14.3 0 27.9-2.7 40.5-7.5L192 256l-39.5 39.5c-12.6-4.9-26.2-7.5-40.5-7.5C50.1 288 0 338.1 0 400s50.1 112 112 112s112-50.1 112-112c0-14.3-2.7-27.9-7.5-40.5L499.2 76.8c7.1-7.1 7.1-18.5 0-25.6c-28.3-28.3-74.1-28.3-102.4 0L256 192zm22.6 150.6L396.8 460.8c28.3 28.3 74.1 28.3 102.4 0c7.1-7.1 7.1-18.5 0-25.6L342.6 278.6l-64 64zM64 112a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48 240a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                </svg>
                `,
                copy: `
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/>
                </svg>
                `,
                paste: `
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M160 0c-23.7 0-44.4 12.9-55.4 32H48C21.5 32 0 53.5 0 80V400c0 26.5 21.5 48 48 48H192V176c0-44.2 35.8-80 80-80h48V80c0-26.5-21.5-48-48-48H215.4C204.4 12.9 183.7 0 160 0zM272 128c-26.5 0-48 21.5-48 48V448v16c0 26.5 21.5 48 48 48H464c26.5 0 48-21.5 48-48V256H416c-17.7 0-32-14.3-32-32V128H320 272zM160 40a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm256 88v96h96l-96-96z"/>
                </svg>
                `,
                pasteUnformat: `
                <svg height="1em" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="m160,0c-23.7,0 -44.4,12.9 -55.4,32l-56.6,0c-26.5,0 -48,21.5 -48,48l0,320c0,26.5 21.5,48 48,48l144,0l0,-272c0,-44.2 35.8,-80 80,-80l48,0l0,-16c0,-26.5 -21.5,-48 -48,-48l-56.6,0c-11,-19.1 -31.7,-32 -55.4,-32zm112,128c-26.5,0 -48,21.5 -48,48l0,272l0,16c0,26.5 21.5,48 48,48l192,0c26.5,0 48,-21.5 48,-48l0,-208l-96,0c-17.7,0 -32,-14.3 -32,-32l0,-96l-64,0l-48,0zm-112,-88a24,24 0 1 1 0,48a24,24 0 1 1 0,-48zm256,88l0,96l96,0l-96,-96z" id="svg_1"/>
                    <path stroke="null" fill="#ffffff" id="svg_2" d="m382.98661,405.82251l4.88408,12.27724l1.62774,3.8446c1.50319,3.22499 2.2541,5.82882 2.2541,7.81322c0,2.23279 -0.9191,4.07342 -2.75436,5.51876c-1.83803,1.44759 -6.55565,2.17043 -14.15113,2.17043l0,13.76624l84.27902,0l0,-13.76624c-3.92462,0 -8.01415,-1.30243 -12.27274,-3.90644c-4.25755,-2.60452 -9.0164,-10.35538 -14.2755,-23.25309l-53.22258,-130.21878l-14.65208,0l-52.22051,130.34229c-7.26342,18.02569 -16.23859,27.03602 -26.92413,27.03602l0,13.76624l56.10235,0l0,-13.76624c-6.26117,0 -10.76937,-0.80633 -13.52459,-2.41814c-2.75522,-1.6125 -4.13249,-4.44376 -4.13249,-8.49518c0,-2.397 1.16784,-6.5307 3.50595,-12.40162l3.25634,-8.30932l52.22051,0zm-26.79889,-64.48909l21.16407,50.22728l-41.20049,0l20.03642,-50.22728z" xmlns="http://www.w3.org/2000/svg"/>
                </svg>
                `,
            }

            this.shouldInitialize = function () {
                return shouldInitialize && !lists.isEmpty(menuBtns)
            }

            this.events = {
                'summernote.init': function (_, layoutInfo) {
                    layoutInfo.editable.on('contextmenu', function (event) {
                        event.preventDefault()
                        self.update(event)
                    })
                    layoutInfo.editable.on('mousedown', function (event) {
                        self.hide()
                    })
                },
                'summernote.change summernote.scroll summernote.disable summernote.dialog.shown': () => {
                    this.hide();
                },
                'summernote.blur': (we, event) => {
                    this.hide();
                },
            }

            this.styleMenuButton = function ({ key, name, shorcut, contents = null, submenu, toggle }) {
                var btn = context.memo(`button.${key}`)
                if (!btn) {
                    btn = function () {
                        return ui.button({
                            contents: contents || key,
                            tooltip: name || key,
                        }).render()
                    }
                }
                var $btn = typeof btn === 'function' ? btn(context) : btn
                $btn.find('i').addClass(['float-left', 'mr-2'])
                // remove button tooltip
                $btn.tooltip('dispose')
                    .addClass(['dropdown-item', 'align-items-center', `${className}-btn`])
                    .append(`<span>${name}</span>`)
                if (!!toggle) {
                    $btn.addClass(`${toggle}-toggle-btn`)
                }
                if (submenu) {
                    $btn.append(`<span class="float-right ml-2 dropdown-submenu-toggle-icon note-icon-caret"></span>`)
                }
                else {
                    $btn.append(`<span class="float-right ml-2">${context.invoke('buttons.representShortcut', shorcut || key)}</span>`)
                }
                return $btn
            }

            this.initialize = function () {
                if ($('#summernote-custom-contextmenu').length == 0) {
                    style = [
                        '.summernote-custom-contextmenu.dropdown-menu .dropdown-submenu {left: 100%; top: 100%; margin-top: -2.5rem;}',
                        '.summernote-custom-contextmenu.dropdown-menu .dropdown-submenu-toggle .dropdown-submenu-toggle-icon.note-icon-caret::before{transform: rotate(270deg) translateX(2px);}',
                    ].join('')
                    this.css = $('<style>').html(style)
                    this.css.attr('id', 'summernote-custom-contextmenu')
                    $(document.head).append(this.css)
                }

                this.$contextMenu = ui.popover({
                    className: `${className} dropdown-menu`,
                    contents: [
                        '<div class="arrow"></div>',
                        '<div class="dropdown-menu-content d-flex flex-column"></div>'
                    ].join('')
                }).render().appendTo(options.container);

                const $content = this.$contextMenu.find('.dropdown-menu-content')
                menuBtns.forEach((group, idx, array) => {
                    // add contextmenu button
                    group.forEach((btn) => {
                        if (btn.submenu) {
                            var $btn = this.styleMenuButton(btn)
                            var $submenu = $('<div></div>').addClass([`${className}`, 'dropdown-menu', 'dropdown-submenu'])
                            $btn.addClass(['dropdown-submenu-toggle', 'position-relative']).appendTo($content)
                            $submenu.appendTo($btn)

                            btn.submenu.forEach((b) => {
                                var $b = this.styleMenuButton(b)
                                $b.appendTo($submenu)
                            })
                            $btn.on('mouseenter', function (event) {
                                $(event.currentTarget).find('.dropdown-submenu').show()
                            })
                            $btn.on('mouseleave', function (event) {
                                $(event.currentTarget).find('.dropdown-submenu').hide()
                            })
                            this.listenButtons.push($btn)
                        }
                        else {
                            this.styleMenuButton(btn).appendTo($content)
                        }
                    })
                    if (idx === array.length - 1) return
                    // add group divider
                    $content.append('<div class="dropdown-divider"></div>')
                })

                this.$contextMenu.on('mousedown', (event) => { event.preventDefault() })
            }

            this.destroy = function () {
                !!this.css && $(this.css).remove()
                this.$contextMenu.off();
                this.$contextMenu.remove();
                this.listenButtons.forEach(($btn) => {
                    $btn.off()
                })
            };

            this.wrapCommand = function (fn) {
                return function () {
                    context.invoke("beforeCommand");
                    fn.apply(this, arguments);
                    context.invoke("afterCommand");
                }
            }

            /**
             * Toggle context menu Table button
             */
            this.toggleTableButton = function () {
                var rng = range.create()
                rng.isOnTable = rng.makeIsOn(dom.isTable)
                let disabled = !rng.isOnTable()
                $editor.find('.table-toggle-btn').prop('disabled', disabled)
                modules.tablePopover.hide()
            }
            /**
             * Toggle context menu Anchor button
             */
            this.toggleAnchorButton = function () {
                var rng = range.create()
                let disabled = !rng.isOnAnchor()
                $editor.find('.anchor-toggle-btn').prop('disabled', disabled)
                modules.linkPopover.hide()
            }
            /**
             * Toggle context menu List button
             */
            this.toggleListButton = function () {
                var rng = range.create()
                let disabled = !rng.isOnList()
                $editor.find('.list-toggle-btn').prop('disabled', disabled)
            }
            /**
             * Toggle context menu Img button
             */
            this.toggleImgButton = function () {
                var rng = range.create()
                rng.isOnImg = rng.makeIsOn(dom.isImg)
                let disabled = !rng.isOnImg()
                $editor.find('.img-toggle-btn').prop('disabled', disabled)
                modules.imagePopover.hide()
            }

            this.update = function (event) {
                // Prevent focusing on editable when invoke('code') is executed
                if (!context.invoke('editor.hasFocus')) {
                    this.hide();
                    return;
                }

                // toggle button
                this.toggleTableButton()
                this.toggleAnchorButton()
                this.toggleListButton()
                this.toggleImgButton()

                const pos = { left: event.pageX, top: event.pageY }
                const containerOffset = $(options.container).offset();
                pos.top -= containerOffset.top;
                pos.left -= containerOffset.left;

                this.$contextMenu.css({
                    display: 'block',
                    left: pos.left,
                    top: pos.top,
                });

                if (typeof onContextMenuOpen === 'function') {
                    onContextMenuOpen(this.$contextMenu)
                }
            }

            this.hide = function () {
                this.$contextMenu.hide();
                this.$contextMenu.find('.dropdown-submenu').hide()
            }

            this.cut = function () {
                document.execCommand('cut')
            }

            this.copy = function () {
                document.execCommand('copy')
                context.triggerEvent('copy', event)
            }

            /**
             * Dispatch custom paste event
             * @param {DataTransfer} dt clipboardData
             */
            this.dispatchPasteEvent = function (dt) {
                const pasteEvent = new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    clipboardData: dt,
                })
                var rng = context.invoke('editor.getLastRange')
                rng.sc.dispatchEvent(pasteEvent)
            }

            this.paste = async () => {
                const contents = await navigator.clipboard.read()
                const dt = new DataTransfer()
                for (const item of contents) {
                    var type = 'text/plain'
                    var data = ''
                    // clipboard API allow MIME types: text/plain, text/html, image/png
                    // prefer text/html
                    if (item.types.includes('text/html')) {
                        type = 'text/html'
                        const blob = await item.getType('text/html')
                        data = await blob.text()
                        context.invoke('editor.pasteHTML', data)
                    }
                    // only paste image no text image/png
                    else if (item.types.includes('image/png')) {
                        type = 'image/png'
                        const blob = await item.getType('image/png')
                        // blob to file
                        data = [new File([blob], 'image.png', { type: 'image/png' })]
                        // trigger callbacks onImageUpload
                        context.invoke('editor.insertImagesOrCallback', data)
                    }
                    // only paste text text/plain
                    else {
                        type = 'text/plain'
                        const blob = await item.getType('text/plain')
                        data = await blob.text()
                        context.invoke('editor.pasteHTML', data)
                    }
                    dt.items.add(data, type)
                }

                this.dispatchPasteEvent(dt)
            }
            this.pasteUnformat = async () => {
                const text = await navigator.clipboard.readText()

                // summernote insertText will break nodes
                // context.invoke('editor.insertText', text)

                // create text node
                const selection = window.getSelection()
                selection.deleteFromDocument()
                selection.getRangeAt(0).insertNode(document.createTextNode(text))
                selection.collapseToEnd()

                const dt = new DataTransfer()
                dt.items.add(text, 'text/plain')
                this.dispatchPasteEvent(dt)
            }

            context.memo('button.cut', function () {
                return ui.button({
                    className: "note-btn-cut",
                    contents: `<i class="note-icon">${icon.cut}</i>`,
                    tooltip: lang.customContextMenu.cut + context.invoke('buttons.representShortcut', 'cut'),
                    click: self.wrapCommand(self.cut)
                }).render()
            })
            context.memo('button.copy', function () {
                return ui.button({
                    className: "note-btn-copy",
                    contents: `<i class="note-icon">${icon.copy}</i>`,
                    tooltip: lang.customContextMenu.copy + context.invoke('buttons.representShortcut', 'copy'),
                    click: self.wrapCommand(self.copy)
                }).render()
            })
            context.memo('button.paste', function () {
                return ui.button({
                    className: "note-btn-paste",
                    contents: `<i class="note-icon">${icon.paste}</i>`,
                    tooltip: lang.customContextMenu.paste + context.invoke('buttons.representShortcut', 'paste'),
                    click: self.wrapCommand(self.paste)
                }).render()
            })
            context.memo('button.pasteUnformat', function () {
                return ui.button({
                    className: "note-btn-pasteUnformat",
                    contents: `<i class="note-icon">${icon.pasteUnformat}</i>`,
                    tooltip: lang.customContextMenu.pasteUnformat + context.invoke('buttons.representShortcut', 'pasteUnformat'),
                    click: self.wrapCommand(self.pasteUnformat)
                }).render()
            })

        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            customContextMenu: {
                copy: '複製',
                cut: '剪下',
                paste: '貼上',
                pasteUnformat: '貼上純文字',
                clipboardPermissionDenied: '未授權剪貼簿權限',
            },
        },
        'en-US': {
            customContextMenu: {
                copy: 'Copy',
                cut: 'Cut',
                paste: 'Paste',
                pasteUnformat: 'Paste Text',
                clipboardPermissionDenied: 'Clipboard Permission Denied',
            },
        },
    });
}));