/**
 * options={{
        toolbar: [
            ['insert', ['pasteHTML']]
        ]
    }}
 * add comment popover
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
    $.extend($.summernote.plugins, {
        'pasteHTML': function (context) {
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

            this.initialize = function () {
                this.$dialog = ui.dialog({
                    title: `${lang.pasteHTML.htmlEditor}`,
                    className: 'summernote-pastehtml-dialog',
                    fade: options.dialogsFade,
                    body: [
                        '<div class="form-group summernote-pastehtml-form-group">',
                        `<label for="summernote-pastehtml-code-${options.id}" class="note-form-label" >${lang.pasteHTML.code}</label>`,
                        `<textarea id="summernote-pastehtml-code-${options.id}" class="summernote-pastehtml-code form-control note-form-control note-input" rows="8"></textarea>`,
                        '</div>',
                    ].join(''),
                    footer: `<button href="#" class="btn btn-primary summernote-pastehtml-btn">${lang.pasteHTML.ok}</button>`,
                }).render().appendTo(options.container);
                this.$dialog.find('.modal-body').addClass("summernote-pastehtml-form-container")
            }

            const addCodeIcon = `<svg width="16" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                <path stroke="null" d="m713.56285,838.52321l0,-127.60965l225.83353,-198.9153l-225.83353,-198.91648l0,-127.60497l306.74749,281.48247l0,90.07679l-306.74749,281.48715zm-709.87318,-371.56393l306.744,-281.48247l0,127.60497l-225.83004,198.91648l225.83004,198.9153l0,127.60965l-306.744,-281.48715l0,-90.07679z" id="svg_1"/>
                <rect transform="rotate(90 513.889 512)" stroke="null" id="svg_6" height="546.88892" width="82.22222" y="238.55554" x="472.77779" fill="#010202"/>
                <rect stroke="null" id="svg_7" height="546.88892" width="82.22222" y="238.55554" x="472.77779" fill="#010202"/>
            </svg>`

            context.memo('button.pasteHTML', function () {
                return ui.button({
                    contents: `<i class="note-icon">${addCodeIcon}</i>`,
                    tooltip: lang.pasteHTML.insertHTML,
                    click: function () {
                        self.showDialog()
                    }
                }).render()
            })

            this.showDialog = function () {
                // save range
                context.invoke('editor.saveRange')

                ui.showDialog(self.$dialog)

                // if click ok pasteHTML
                var $okBtn = self.$dialog.find('.modal-footer .summernote-pastehtml-btn')
                $okBtn.on('click', function (event) {
                    event.preventDefault()
                    var $codeInput = self.$dialog.find('.modal-body .summernote-pastehtml-code')
                    let code = $codeInput.val()
                    ui.hideDialog(self.$dialog)
                    context.invoke('editor.pasteHTML', code)
                    $codeInput.val("")
                })

                // when close dialog remove button event and restore range
                ui.onDialogHidden(self.$dialog, function () {
                    context.invoke('editor.restoreRange');
                    $okBtn.off();
                });
            }

        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            pasteHTML: {
                insertHTML: "插入 HTML",
                htmlEditor: "HTML 編輯器",
                code: "程式碼",
                ok: "確認",
            }
        },
        'en-US': {
            pasteHTML: {
                insertHTML: "Insert HTML",
                htmlEditor: "HTML Editor",
                code: "Code",
                ok: "OK",
            }
        },
    });
}));    