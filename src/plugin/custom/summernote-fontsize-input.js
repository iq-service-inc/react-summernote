/**
 * options={{
        toolbar: [
            ['words', ['fontsizeInput']]
        ],
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
    if ($.summernote && $.summernote.options.modules.editor && $.summernote.options.modules.editor.prototype) {
        $.extend($.summernote.options.modules.editor.prototype, {
            cleanupBogus: function (type, force) {
                // 如果 bogus span 已不存在，就清掉 data 標記
                const bogusSpan = this.$editable.data(type + '-bogus');
                if (!bogusSpan || !bogusSpan.parentNode) {
                    this.$editable.removeData(type + '-bogus');
                    return;
                }

                // 如果已經沒有 zero-width 字元，也清掉 data 標記
                const ZERO_WIDTH_NBSP_CHAR = $.summernote.dom.ZERO_WIDTH_NBSP_CHAR;
                const text = bogusSpan.textContent || '';
                if (text.indexOf(ZERO_WIDTH_NBSP_CHAR) === -1) {
                    this.$editable.removeData(type + '-bogus');
                    return;
                }

                // 只有在「目前還是同一個 collapsed caret，且內容只剩 zero-width 字元」時才保留
                const rng = this.getLastRange();
                const shouldKeepBogus = !force &&
                    text === ZERO_WIDTH_NBSP_CHAR &&
                    rng !== '' && rng.isCollapsed() &&
                    bogusSpan.contains(rng.sc);

                if (shouldKeepBogus) {
                    return;
                }

                // 其他情況都清掉 bogus span
                const offset = text.indexOf(ZERO_WIDTH_NBSP_CHAR);
                const shouldUpateRange = (offset > -1 && rng.sc === bogusSpan.firstChild && rng.so > offset);
                bogusSpan.textContent = text.replace(ZERO_WIDTH_NBSP_CHAR, '');
                // 如果原本的 range 在 bogus span 裡面，需要更新 range 的位置
                if (shouldUpateRange) {
                    const caretRng = $.summernote.range.create(bogusSpan.firstChild, rng.eo, bogusSpan.firstChild, rng.eo);
                    caretRng.select();
                    this.setLastRange(caretRng);
                }
                this.$editable.removeData(type + '-bogus');
            },
            customFontSize: function (value) {
                const unit = 'px';
                const rng = this.getLastRange();
                this.cleanupBogus('fontsize', true);
                if (rng !== '') {
                    const spans = this.style.styleNodes(rng);
                    $(spans).css('font-size', value + unit);
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
                            this.setLastRange(caretRng.select());
                            this.$editable.data('fontsize-bogus', firstSpan);
                        }
                        else {
                            this.setLastRange(
                                this.createRangeFromList(liveSpans).select()
                            );
                        }
                    }
                }
            }
        });
    }
    $.extend($.summernote.options, {
        fontsizeInput: {
            max: 200,
            min: 5,
            sizes: ['8', '9', '10', '11', '12', '14', '16', '18', '26', '42', '74']
        }
    });
    $.extend($.summernote.plugins, {
        'fontsizeInput': function (context) {
            var range = $.summernote.range;
            var dom = $.summernote.dom;
            var self = this,
                ui = $.summernote.ui,
                $note = context.layoutInfo.note,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                $editingArea = context.layoutInfo.editingArea,
                $toolbar = context.layoutInfo.toolbar,
                $statusbar = context.layoutInfo.statusbar,
                modules = context.modules,
                options = context.options,
                lang = options.langInfo;
            this.$document = $(document);

            var maxFontSize = options.fontsizeInput.max
            var minFontSize = options.fontsizeInput.min
            var fontSizes = options.fontsizeInput.sizes.length ? options.fontsizeInput.sizes : options.fontSizes

            this.initialize = function () {
                // remove input number spin button
                if ($(`#input-spin-buton`).length == 0) {
                    this.$css = $('<style>').html(`input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {-webkit-appearance: none;margin: 0;} input[type=number] {-moz-appearance: textfield;}`)
                    this.$css.attr('id', `input-spin-buton`)
                    $(document.head).append(this.$css)
                }

                // init toolbar px/pt value
                context.invoke('fontsizeInput.updateFontsizeInput')
            };


            context.memo('button.fontsizeInput', () => {
                // input-group
                var $customFontSize = $(`<div>`)
                    .addClass(["input-group", "custom-fontsize-input-group"])

                // input
                var $fontsizeInput = $(`<input max="${maxFontSize}" min="${minFontSize}" type=number />`)
                    .addClass("note-fontsize-input")
                    .attr("step", "any")
                    .css({
                        "width": "3em",
                        "line-height": "1em",
                        "text-align": "center",
                        "border": "1px solid #ced4da",
                        "border-radius": "0.2rem 0 0 0.2rem",
                        "font-size": "13px"
                    })

                // input event
                $fontsizeInput.on('focus', function (event) {   // keep selection in editor
                    context.invoke("editor.saveRange")
                })
                $fontsizeInput.on('blur', function (event) {    // restore selection in editor
                    context.invoke("editor.restoreRange")
                })
                $fontsizeInput.on('keydown', function (event) {
                    if (event.keyCode === 13) { // Enter
                        context.invoke("beforeCommand")
                        event.preventDefault()
                        let $target = $(event.target)
                        let value = parseFloat($target.val())
                        // update selection text fontsize
                        if (value < minFontSize) {  // lower than minFontSize
                            context.invoke("editor.customFontSize", minFontSize)
                        }
                        else if (value > maxFontSize) { // higher than maxFontSize
                            context.invoke("editor.customFontSize", maxFontSize)
                        }
                        else {
                            context.invoke("editor.customFontSize", value)
                        }
                        context.invoke("afterCommand")
                    }
                    else if (event.keyCode === 27) {    // ESC
                        context.invoke("beforeCommand")
                        event.preventDefault()
                    }
                })
                $customFontSize.append($fontsizeInput)


                // dropdown
                var $fontSizeDropdown = ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-toggle note-fontsize-unit',
                        tooltip: lang.font.size,
                        contents: 'px',
                        data: {
                            toggle: 'dropdown',
                        },
                    }),
                    ui.dropdownCheck({
                        className: 'dropdown-fontsize dropdown-menu-right',
                        checkClassName: options.icons.menuCheck,
                        items: fontSizes,
                        template: function (item) {
                            return `${item}px (${item * 0.75}pt)`
                        },
                        title: lang.font.size,
                        click: function (e) {
                            e.preventDefault();
                            context.invoke("beforeCommand");
                            const fontSize = $(e.target).closest('[data-value]').data('value');
                            context.invoke('editor.customFontSize', fontSize);
                            context.invoke("afterCommand");
                        }
                    }),
                ]).render();
                $fontSizeDropdown.addClass('input-group-append')
                $customFontSize.append($fontSizeDropdown)

                return $customFontSize
            });


            this.wrapCommand = function (fn) {
                return function () {
                    context.invoke("beforeCommand");
                    fn.apply(this, arguments);
                    context.invoke("afterCommand");
                }
            }

            this.updateFontsizeInputByValue = function (value) {
                let fontSize, fontUnit
                if (typeof value === 'string') {
                    fontSize = parseFloat(value.replace(/[^0-9.]/g, ''))
                    fontUnit = value.replace(/[^a-zA-Z]/g, '') || 'px'
                }
                else if (typeof value === 'number') {
                    fontSize = value
                    fontUnit = 'px'
                }
                else {
                    return
                }

                // find button
                var $customFontSize = $toolbar.find('.custom-fontsize-input-group')

                // update input value
                var $fontsizeInput = $customFontSize.find('.note-fontsize-input')
                $fontsizeInput.val(fontUnit == 'px' ? fontSize : Math.round(fontSize / 0.75))
                // update unit value
                var $fontSizeUnit = $customFontSize.find('.note-fontsize-unit')
                $fontSizeUnit.text(fontUnit == 'px' ? `px (${this.customConversion(fontSize)}pt)` : `px (${fontSize}pt)`)

                // remove dropdown checked
                $customFontSize.find('.dropdown-item.checked').removeClass('checked');

                const matchedItem = fontUnit == 'px' ? $customFontSize.find(`.dropdown-item[data-value="${fontSize}"]`) : $customFontSize.find(`.dropdown-item[data-value="${Math.round(fontSize / 0.75)}"]`);

                // if current fronSize matching fontsizeInput.size list, add checked class
                if (matchedItem.length > 0) {
                    matchedItem.addClass('checked');
                }
            }

            this.updateFontsizeInput = function (target) {
                let styleInfo = {}
                if (target) {
                    styleInfo = context.invoke("editor.styleFromNode", target)
                }
                else {
                    styleInfo = context.invoke('editor.currentStyle');
                }

                this.updateFontsizeInputByValue(styleInfo['font-size-unit']['input'])
            }

            // px to pt, unit value conversion
            this.customConversion = function (value) {
                const conversionValue = value * 0.75 * 10;
                // Get the first digit of the decimal point
                const firstDecimalDigit = Math.floor(conversionValue) % 10;
                if (firstDecimalDigit === 5) {
                    return Math.floor(conversionValue) / 10;
                }
                return Math.round(conversionValue / 10);
            }

            this.events = {
                'summernote.keyup summernote.mouseup summernote.change': function () {
                    context.invoke('fontsizeInput.updateFontsizeInput')
                },
                'summernote.change': function () {
                    context.invoke('editor.cleanupBogus', 'fontsize')
                }
            }


            this.destroy = function () {
                !!this.$css && $(this.$css).remove()
            };
        }
    })

}));