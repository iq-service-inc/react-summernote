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
    $.extend($.summernote.plugins, {
        'custom': function (context) {
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

            this.wrapCommand = function (fn) {
                return function() {
                    context.invoke("beforeCommand");
                    fn.apply(this, arguments);
                    context.invoke("afterCommand");
                }
            }
            /**
             * "customUL" insert Unordered List
             * add style on ul
             */
            context.memo('button.customUL', function () {
                return ui.button({
                    className: 'custom-ul',
                    contents: ui.icon(options.icons.unorderedlist),
                    tooltip: lang.lists.unordered + modules.buttons.representShortcut.call(modules.buttons, 'insertUnorderedList'),
                    click: self.wrapCommand(function (event) {
                        modules.editor.bullet.insertUnorderedList()
                        var rng = range.create()
                        $(rng.sc).closest('ul').css('padding-left', '40px')
                    }),
                }).render();
            });

            this.events = {
                'summernote.init': function (_, layoutInfo) {
                    /**
                     * toolbar close color palette
                     */
                    layoutInfo.toolbar.on('mousedown', '.note-color-btn', function (event) {
                        var $target = $(event.target).closest('.dropdown-menu')
                        $target.dropdown(false)
                    })
                }
            }
        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            // table popover ???????????? release ????????? plugin ??????
            // commit: 9f80ec892ce40d3fed3c239436d0e3ec16afd50f
            table: {
                table: '??????',
                addRowAbove: '???????????????',
                addRowBelow: '???????????????',
                addColLeft: '???????????????',
                addColRight: '???????????????',
                delRow: '?????????',
                delCol: '?????????',
                delTable: '????????????',
            }
        },
    });
}));