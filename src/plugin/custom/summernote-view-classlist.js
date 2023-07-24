(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}
    (function ($) {
        $.extend($.summernote.options, {
            canViewClasslist: false,
        });
        $.extend($.summernote.plugins, {
            'view-classlist': function (context) {
                var self = this,
                    ui = $.summernote.ui,
                    $note = context.layoutInfo.note,
                    $editor = context.layoutInfo.editor,
                    $editable = context.layoutInfo.editable,
                    options = context.options,
                    lang = options.langInfo;

                if (!options.canViewClasslist) return

                this.events = {
                    'summernote.mousedown': function (we, e) {
                        var el = e.target;
                        var outputText = '';
                        if (!el.classList.contains('note-editable')) {
                            var outputText = `${el.nodeName} class="${el.classList.toString()}"`
                            $editor.find('.note-status-output').html(outputText);
                        } else {
                            $editor.find('.note-status-output').html('');
                        }
                    },
                    'summernote.keydown': function (we, e) {
                        $editor.find('.note-status-output').html('');
                    },
                    'summernote.codeview.toggled': function (we, e) {
                        $editor.find('.note-status-output').html('');
                    },
                }
            }
        });
    }));