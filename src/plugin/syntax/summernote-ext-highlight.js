/*!
 * summernote highlight plugin
 * http://www.hyl.pw/
 *
 * Released under the MIT license
 */
(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals: jQuery
        factory(window.jQuery);
    }
}(function ($) {
    $.extend(true, $.summernote.lang, {
        'en-US': {
            highlight: {
                tooltip: 'highlight code',
                select: 'Select language',
                code: 'Enter the code fragment',
                ok: 'OK',
                insert: 'Insert code',
            }
        },
        'zh-TW': {
            highlight: {
                tooltip: '插入程式碼',
                select: '選擇語言',
                code: '輸入程式碼片段',
                ok: '確認',
                insert: '插入程式碼',
            }
        },
    });
    
    // Extends plugins for adding highlight.
    //  - plugin is external module for customizing.
    $.extend($.summernote.plugins, {

        /**
         * @param {Object} context - context object has status of editor.
         */
        'highlight': function (context) {

            var self = this;

            var ui = $.summernote.ui;
            var $editor = context.layoutInfo.editor;
            var options = context.options;
            var lang = options.langInfo;

            // add button

            context.memo('button.highlight', function () {
                // create button
                var button = ui.button({
                    contents: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-code" viewBox="0 0 16 16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"/>
                  </svg>`,
                    tooltip: lang.highlight.tooltip,
                    click: function () {
                        self.show()
                    }
                });

                // create jQuery object from button instance.
                var $highlight = button.render();
                return $highlight;
            });

            this.createDialog = function () {

                var $box = $('<div />');
                var $selectGroup = $('<div class="form-group" />');
                var $textGroup = $('<div class="form-group" />');
                var $select = $('<select class="form-control ext-highlight-select" />');

                var languages = [
                    "bsh", "c", "cc", "cpp", "cs", "csh", "cyc", "cv", "htm", "html", "java",
                    "js", "m", "mxml", "perl", "pl", "pm", "py", "rb", "sh", "xhtml", "xml",
                    "xsl"
                ];

                for (var i = 0; i < languages.length; i++) {
                    $select.append('<option value="' + languages[i] + '">' + languages[i] + '</option>');
                }

                var $label = $('<label />');
                $label.html(lang.highlight.select);
                $box.append($selectGroup.append($label));
                $box.append($selectGroup.append($select));

                var $label = $('<label />');
                $label.html(lang.highlight.code);
                var $textarea = $('<textarea class="ext-highlight-code form-control" rows="10" />');

                $box.append($textGroup.append($label));
                $box.append($textGroup.append($textarea));

                return $box.html();
            };

            this.createCodeNode = function (code, select) {
                var $code = $('<code>');
                $code.html(PR.prettyPrintOne(code, select));
                $code.addClass('lang-' + select);

                var $pre = $('<pre>');
                $pre.html($code)
                $pre.addClass('prettyprint').addClass('linenums');

                return $pre[0];
            };

            this.showHighlightDialog = function (codeInfo) {
                return $.Deferred(function (deferred) {
                    var $extHighlightCode = self.$dialog.find('.ext-highlight-code');
                    var $extHighlightBtn = self.$dialog.find('.ext-highlight-btn');
                    var $extHighlightSelect = self.$dialog.find('.ext-highlight-select');

                    ui.onDialogShown(self.$dialog, function () {

                        $extHighlightCode.val(codeInfo);

                        $extHighlightCode.on('input', function () {
                            ui.toggleBtn($extHighlightBtn, $extHighlightCode.val() != '');
                            codeInfo = $extHighlightCode.val();
                        });

                        $extHighlightBtn.one('click', function (event) {
                            event.preventDefault();
                            //转义后的html
                            $code = $extHighlightCode.val().replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; });
                            //插入的代码类型
                            $type = $extHighlightSelect.val();
                            deferred.resolve(self.createCodeNode($code, $type));
                        });
                    });

                    ui.onDialogHidden(self.$dialog, function () {
                        $extHighlightBtn.off('click');
                        if (deferred.state() === 'pending') {
                            deferred.reject();
                        }
                    });

                    ui.showDialog(self.$dialog);
                });
            };

            this.getCodeInfo = function () {
                var text = context.invoke('editor.getSelectedText');
                return '';
            };

            this.show = function () {
                var codeInfo = self.getCodeInfo();
                context.invoke('editor.saveRange');
                this.showHighlightDialog(codeInfo).then(function (codeInfo) {
                    self.$dialog.modal('hide');
                    context.invoke('editor.restoreRange');

                    if (codeInfo) {
                        context.invoke('editor.insertNode', codeInfo);
                    }
                });
            };

            //// This events will be attached when editor is initialized.
            //this.event = {
            //    // This will be called after modules are initialized.
            //    'summernote.init': function (we, e) {
            //        console.log('summernote initialized', we, e);
            //    },
            //    // This will be called when user releases a key on editable.
            //    'summernote.keyup': function (we, e) {
            //        console.log('summernote keyup', we, e);
            //    }
            //};
            //
            //// This method will be called when editor is initialized by $('..').summernote();
            //// You can create elements for plugin
            this.initialize = function () {
                var $container = options.dialogsInBody ? $(document.body) : $editor;

                var body = [
                    '<button href="#" class="btn btn-primary ext-highlight-btn disabled" disabled>',
                    `${lang.highlight.ok}`,
                    '</button>'
                ].join('');

                this.$dialog = ui.dialog({
                    className: 'ext-highlight',
                    title: lang.highlight.insert,
                    body: this.createDialog(),
                    footer: body,
                    //callback: function ($node) {
                    //    $node.find('.modal-body').css({
                    //        'max-height': 300,
                    //        'overflow': 'scroll'
                    //    });
                    //}
                }).render().appendTo($container);
            };

            // This methods will be called when editor is destroyed by $('..').summernote('destroy');
            // You should remove elements on `initialize`.
            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };
        }
    });
}));
