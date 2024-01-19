/**
 * options={{
        customFont: {
            fontNames: [
                { name: '新細明體', value: '新細明體, serif' },
                { name: '微軟正黑體', value: '微軟正黑體, sans-serif' },
                { name: '標楷體', value: '標楷體, DFKai-SB, BiauKaiTC' }
            ],
        }
    }}
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
        customFont: {
            fontNames: []
        }
    })
    $.extend($.summernote.plugins, {
        'customFont': function (context) {
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

            const fontNames = options.customFont.fontNames || [
                { name: '新細明體', value: '新細明體, serif' },
                { name: '微軟正黑體', value: '微軟正黑體, sans-serif' },
                { name: '標楷體', value: '標楷體, DFKai-SB, BiauKaiTC' }
            ]

            self.events = {
                'summernote.keyup summernote.mouseup summernote.change': function () {
                    context.invoke('customFont.updateCurrentStyle')
                }
            }

            let $customFontBtn = ui.buttonGroup[ui.button({}), ui.dropdownCheck({})]
            context.memo('button.customFont', () => {
                const styleInfo = context.invoke('editor.currentStyle');
                if (options.addDefaultFonts) {
                    $.each(styleInfo['font-family'].split(','), (idx, fontname) => {
                        fontname = fontname.trim().replace(/['"]+/g, '');  
                        if (context.invoke('buttons.isFontDeservedToAdd',fontname)) {
                            if (fontNames.indexOf(fontname) === -1) {
                                fontNames.push(fontname);
                            }
                        }
                    });
                }

                $customFontBtn = ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-toggle',
                        contents: ui.dropdownButtonContents(
                            '<span class="note-current-fontname"></span>', options
                        ),
                        tooltip: lang.customFont.name,
                        data: {
                            toggle: 'dropdown',
                        },
                    }),
                    ui.dropdownCheck({
                        className: 'dropdown-fontname',
                        checkClassName: options.icons.menuCheck,
                        items: fontNames,
                        title: lang.customFont.name,
                        template: (item) => {
                            if (typeof item === 'object') {
                                return '<span style="font-family: ' + item.value + '">' + item.name + '</span>';
                            } else if (typeof item === 'string') {
                                return '<span style="font-family: ' + item + '">' + item + '</span>';
                            }
                        },
                        click: function (event) {
                            context.createInvokeHandler('customFont.setFontName')(event)
                            context.invoke('customFont.updateCurrentStyle')
                        }
                    }),
                ]).render();
                return $customFontBtn
            })

            this.setFontName = function (value) {
                context.invoke("beforeCommand");
                modules.editor.fontStyling.call(modules.editor, 'font-family', value)
                context.invoke("afterCommand");
            }

            this.updateCurrentStyle = function(){
                const styleInfo = context.invoke('editor.currentStyle');
                if (styleInfo['font-family']) {
                    const fontNames = styleInfo['font-family'].split(',').map((name) => {
                        return name.replace(/[\'\"]/g, '')
                        .replace(/\s+$/, '')
                        .replace(/^\s+/, '');
                    });
                    const showFontName = Array.isArray(fontNames) ? fontNames[0] : fontNames

                    $customFontBtn.find('.dropdown-fontname a').each((idx, item) => {
                        const $item = $(item);
                        const showFontName = typeof fontNames === 'object' ? fontNames[0] : fontNames 
                        const isChecked = ($item.data('value') + '') === (showFontName + '');
                        $item.toggleClass('checked', isChecked);
                    });
                    $customFontBtn.find('.note-current-fontname').text(showFontName).css('font-family', showFontName);
                }
            }
        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            customFont: {
                name: "字體",
            }
        },
        'en-US': {
            customFont: {
                name: "Font",
            }
        },
    });
}));    