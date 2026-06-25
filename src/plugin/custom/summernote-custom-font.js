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
                },
                'summernote.change': function () {
                    context.invoke('editor.cleanupBogus', 'fontname')
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
                            var $div = $(event.currentTarget).parent();
                            context.invoke('customFont.updateCurrentStyle', $div)
                        }
                    }),
                ]).render();
                return $customFontBtn
            })

            this.setFontName = function (value) {
                context.invoke("beforeCommand");
                const rng = context.invoke('editor.getLastRange');
                context.invoke('editor.cleanupBogus', 'fontname', true);
                if (rng !== '') {
                    const spans = modules.editor.style.styleNodes(rng);
                    $(spans).css('font-family', value);
                    // merge adjacent sibling spans with identical attributes
                    spans.forEach(function (span) {
                        if (!span.parentNode) return;
                        var next;
                        while ((next = span.nextSibling) &&
                               next.nodeType === 1 && next.tagName === 'SPAN' &&
                               next.attributes.length === span.attributes.length &&
                               Array.prototype.every.call(span.attributes, function (attr) {
                                   return next.getAttribute(attr.name) === attr.value;
                               })) {
                            while (next.firstChild) span.appendChild(next.firstChild);
                            next.parentNode.removeChild(next);
                        }
                    });
                    var liveSpans = spans.filter(function (s) { return !!s.parentNode; });
                    if (rng.isCollapsed()) {
                        // 如果是 collapsed，則要在 span 裡面放入 zero-width 字元，才能讓 caret 顯示出來
                        const firstSpan = $.summernote.lists.head(liveSpans);
                        if (firstSpan && !$.summernote.dom.nodeLength(firstSpan)) {
                            // 如果 span 裡面沒有任何文字，就插入 zero-width 字元，並更新 range
                            // 後面監聽 summernote.change 觸發 cleanupBogus，會把 bogus span 的 zero-width 字元清掉
                            firstSpan.innerHTML = $.summernote.dom.ZERO_WIDTH_NBSP_CHAR;
                            const bogusTextNode = firstSpan.firstChild;
                            const caretOffset = $.summernote.dom.nodeLength(bogusTextNode);
                            // 顯示游標
                            const caretRng = $.summernote.range.create(
                                bogusTextNode,
                                caretOffset,
                                bogusTextNode,
                                caretOffset
                            );
                            context.invoke('editor.setLastRange', caretRng);
                            caretRng.select();
                            $editable.data('fontname-bogus', firstSpan);
                        }
                        else {
                            const liveSpansRng = context.invoke('editor.createRangeFromList', liveSpans);
                            liveSpansRng.select();
                            context.invoke('editor.setLastRange', liveSpansRng);
                        }
                    }
                }

                context.invoke("afterCommand");
            }

            this.updateCurrentStyle = function($container){
                const $cont = $container || context.layoutInfo.toolbar;
                const styleInfo = context.invoke('editor.currentStyle');
                if (styleInfo['font-family']) {
                    const fontNames = styleInfo['font-family'].split(',').map((name) => {
                        return name.replace(/[\'\"]/g, '')
                        .replace(/\s+$/, '')
                        .replace(/^\s+/, '');
                    });
                    const showFontName = lists.find(fontNames, modules.buttons.isFontInstalled.bind(modules.buttons))
                    var updateFontName = { name: showFontName, value: showFontName }
                    $cont.find('.dropdown-fontname a').each((idx, item) => {
                        const $item = $(item);
                        const itemFontNames = $item.data('value').split(',').map((name) => {
                            return name.replace(/[\'\"]/g, '')
                            .replace(/\s+$/, '')
                            .replace(/^\s+/, '');
                        })
                        const itemInstalledFontName = lists.find(itemFontNames, modules.buttons.isFontInstalled.bind(modules.buttons))
                        const isChecked = (itemInstalledFontName + '') === (showFontName + '');
                        if (isChecked) updateFontName = { name:  $item.text(), value: $item.data('value') }
                        $item.toggleClass('checked', isChecked);
                    });
                    $cont.find('.note-current-fontname').text(updateFontName.name).css('font-family', updateFontName.value);
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