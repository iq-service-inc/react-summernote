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
                var $container = options.dialogsInBody ? $(document.body) : $editor
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
                }).render().appendTo($container);
                this.$dialog.find('.modal-body').addClass("summernote-pastehtml-form-container")
            }

            const addCodeIcon = `<svg width="18" height="20" viewBox="0 0 960 1024" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                <path d="m511.69998,5.70723l-381.55822,0c-6.0869,0 -12.09865,2.36713 -16.38202,6.76322c-4.2458,4.28337 -6.76322,10.29512 -6.76322,16.41959l0,967.51581c0,6.0869 2.36713,11.91078 6.76322,16.34445c4.39609,4.35851 10.1824,6.72564 16.38202,6.72564l689.99854,0c6.0869,0 11.91078,-2.32955 16.30687,-6.72564c4.39609,-4.39609 6.83836,-10.21998 6.83836,-16.34445l0,-643.82071c0.81896,-67.22951 -32.58427,-182.43133 -101.93881,-252.5846c-69.35455,-70.15328 -174.66041,-95.258 -229.64674,-94.29331zm285.21994,967.44067l-643.70807,0l0,-921.22535l358.5257,0l0,0.07515c29.68144,-1.83876 55.65456,28.98915 71.60684,65.29623c15.95227,36.30708 9.88372,78.09333 11.48183,98.17124c116.67889,-13.4411 199.18445,15.31674 201.98098,130.31917l0.15029,627.36356l-0.03757,0z" fill="#000000"/>
                <text transform="matrix(1 0 0 1 0 0)" font-weight="900" font-style="italic" text-anchor="start" font-size="400" y="936.95129" x="195.82736" stroke-width="0" fill="#000000">
                <tspan x="195.82736" y="569.988">HT</tspan>
                <tspan x="195.82736" y="940.45129">ML</tspan>
                </text>
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