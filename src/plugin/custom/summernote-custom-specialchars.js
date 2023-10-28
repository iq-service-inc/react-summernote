(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals: jQuery
        factory(window.jQuery);
    }
}(function ($) {
    /**
    * @class plugin.customSpecialChar
    *
    * Special Characters Plugin
    *
    * ### load script
    *
    * ```
    * < script src="plugin/summernote-custom-specialchar.js"></script >
    * ```
    *
    * ### use a plugin in toolbar
    * ```
    *    $("#editor").summernote({
    *    ...
    *    toolbar : [
    *        ['group', [ 'customSpecialChar' ]]
    *    ]
    *    ...    
    *    });
    * ```
    */
    $.extend($.summernote.plugins, {
        'customSpecialChar': function (context) {

            // core functions: range, dom
            var range = $.summernote.range;
            var dom = $.summernote.dom;
            var ui = $.summernote.ui,
                $note = context.layoutInfo.note,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                $toolbar = context.layoutInfo.toolbar,
                $statusbar = context.layoutInfo.statusbar,
                options = context.options,
                lang = options.langInfo;


            var common = [
                '，', '、', '。', '．', '？', '！', '；', '︰', '‧', '‥', '﹐', '﹒', '˙', '&middot;', '&lsquo;', '&rsquo;', '&ldquo;', '&rdquo;', '〝', '〞', '‵', '&prime;', '〃', '～', '＄', '％', '＠', '＆', '＃', '＊',
            ]

            var LRbrackets = [
                '（', '）', '「', '」', '〔', '〕', '｛', '｝', '〈', '〉', '『', '』', '《', '》', '【', '】', '﹙', '﹚', '﹝', '﹞', '﹛', '﹜',
            ]

            var UDbrackets = [
                '︵', '︶', '﹁', '﹂', '︹', '︺', '︷', '︸', '︿', '﹀', '﹃', '﹄', '︽', '︾', '︻', '︼',
            ]

            var math = [
                '＋', '－', '&times;', '&divide;', '＝', '&ne;', '≒', '&infin;', '&plusmn;', '&radic;', '＜', '＞', '﹤', '﹥', '≦', '≧', '&cap;', '&cup;', 'ˇ', '&perp;', '&ang;', '∟', '⊿', '㏒', '㏑', '&int;', '∮', '∵', '&there4;', '╳', '﹢',
            ]

            var special = [
                '&uarr;', '&darr;', '&larr;', '&rarr;', '↖', '↗', '↙', '↘', '㊣', '◎', '○', '●', '&oplus;', '⊙', '○', '●', '△', '▲', '☆', '★', '◇', '◆', '□', '■', '▽', '▼', '&sect;', '￥', '〒', '￠', '￡', '※', '♀', '♂',
            ]

            var specialCharMap = {
                common: { name: lang.customSpecialChar.common, set: common },
                LRbrackets: { name: lang.customSpecialChar.LRbrackets, set: LRbrackets },
                UDbrackets: { name: lang.customSpecialChar.UDbrackets, set: UDbrackets },
                math: { name: lang.customSpecialChar.math, set: math },
                special: { name: lang.customSpecialChar.special, set: special }
            }

            this.initialize = function () {
                var body = '<div class="form-group row-fluid">' +
                    this.makeSpecialCharSetTable()[0].outerHTML +
                    '</div>';

                this.$dialog = ui.dialog({
                    className: 'note-specialchar-dialog',
                    // Set the title for the Dialog. Note: We don't need to build the markup for the Modal
                    // Header, we only need to set the Title.
                    title: lang.customSpecialChar.select,

                    // Set the Body of the Dialog.
                    body: body,

                    // This adds the Modal to the DOM.
                }).render().appendTo($editor);
            }
            this.destroy = function () {
                this.$dialog.remove()
            }
            /**
             * @member plugin.specialChar
             * @private
             * @param {jQuery} $editable
             * @return {String}
             */
            this.getTextOnRange = function () {
                $editable.focus();

                var rng = range.create();

                // if range on anchor, expand range with anchor
                if (rng.isOnAnchor()) {
                    var anchor = dom.ancestor(rng.sc, dom.isAnchor);
                    rng = range.createFromNode(anchor);
                }

                return rng.toString();
            };

            /**
             * Make Special Characters Table
             *
             * @member plugin.specialChar
             * @private
             * @return {jQuery}
             */
            this.makeSpecialCharSetTable = function () {
                var $table = $("<div/>").attr("id", "specialCharTable").addClass(['list-group', 'list-group-flush'])

                $.map(specialCharMap, function (obj, key) {
                    var $name = $("<h5/>").text(obj['name'])
                    var $set = $("<div/>").append($name).addClass(['list-group-item', 'btn-group'])

                    $.each(obj['set'], function (idx, text) {
                        var $block = $("<button/>")
                            .css({
                                "width": "35px",
                                "border-radius": "0",
                                "display": "inline-block",
                                "border": "1px solid #ced4da",
                            })
                            .addClass(["note-specialchar-node", `char-${idx}`, "btn", "btn-outline-dark"])
                            .attr("title", text)
                            .attr("id", "char-" + idx);
                        $block.append(text)
                        $set.append($block)
                    })

                    $table.append($set)
                })

                return $table;
            };

            /**
             * Show Special Characters and set event handlers on dialog controls.
             *
             * @member plugin.specialChar
             * @private
             * @param {jQuery} $dialog
             * @param {Object} text
             * @return {Promise}
             */
            this.showSpecialCharDialog = function (text) {
                var $specialCharDialog = this.$dialog
                return $.Deferred(function (deferred) {
                    // var $specialCharDialog = $dialog.find('.note-specialchar-dialog');
                    var $specialCharNode = $specialCharDialog.find('.note-specialchar-node');
                    $specialCharDialog.one('shown.bs.modal', function () {
                        $specialCharNode.on('click', function (event) {
                            event.preventDefault();
                            console.log(event.currentTarget)
                            deferred.resolve(decodeURIComponent(event.currentTarget.title));
                            $specialCharDialog.modal('hide');
                        });
                    }).one('hidden.bs.modal', function () {
                        $specialCharNode.off('click');
                        if (deferred.state() === 'pending') {
                            deferred.reject();
                        }
                    }).modal('show');

                    $editable.blur();
                });
            };

            this.show = function (text) {
                this.showSpecialCharDialog(text).then(function (selectChar) {
                    // when ok button clicked

                    // restore range
                    context.invoke('editor.restoreRange');

                    // build node
                    var $node = $('<span></span>').html(selectChar)[0];
                    //var $node = $(selectChar)[0];

                    if ($node) {
                        // insert character node
                        context.invoke('editor.insertNode', $node);
                    }
                }).fail(function () {
                    // when cancel button clicked
                    context.invoke('editor.restoreRange');
                });
            }
            context.memo('button.customSpecialChar', function () {
                var button = ui.button({
                    contents: 'á',
                    container: options.container,
                    tooltip: lang.customSpecialChar.specialChar,
                    placement: options.placement,
                    click: function (e) {
                        e.preventDefault();
                        var currentSpecialChar = context.invoke('customSpecialChar.getTextOnRange');

                        // save current range
                        context.invoke('editor.saveRange', $editable);

                        context.invoke('customSpecialChar.show', currentSpecialChar)
                    }
                });
                return button.render();
            });
        }
    })

    $.extend(true, $.summernote.lang, {
        'en-US': {
            customSpecialChar: {
                specialChar: 'Special Characters',
                select: 'Select Special characters',
                common: "Common Used Characters",
                LRbrackets: "Left Right Brackets",
                UDbrackets: "UP Down Brackets",
                math: "Math Characters",
                special: "Special Icon",
            }
        },
        'zh-TW': {
            customSpecialChar: {
                specialChar: '特殊字元',
                select: '插入特殊字元',
                common: "常用符號",
                LRbrackets: "左右括號",
                UDbrackets: "上下括號",
                math: "數學符號",
                special: "特殊圖形",
            }
        },
    });
}));
