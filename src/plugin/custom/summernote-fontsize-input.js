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
            customFontSize: function (value) {
                this.customFontSize = this.wrapCommand((value) => {
                    const unit = 'px';
                    return this.fontStyling('font-size', value + unit);
                });
                this.customFontSize(value);
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
                modules = modules = context.modules,
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
                        let $target = $(event.target)
                        const styleInfo = context.invoke('editor.currentStyle')
                        const fontSize = styleInfo['font-size']
                        $target.val(fontSize)   // restore value
                        context.invoke("afterCommand")
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
                            const fontSize = $(e.target).data('value');
                            const selection = window.getSelection();

                            if (selection.rangeCount > 0) {
                                // Get selection range
                                const range = selection.getRangeAt(0);
                                const span = document.createElement('span');
                                span.style.fontSize = `${fontSize}px`;

                                // Extract selected content
                                const selectedContent = range.extractContents();

                                // Traverse the child nodes and modify the font size uniformly
                                function applyFontSizeToChildren(element) {
                                    Array.from(element.children).forEach(child => {
                                        child.style.fontSize = `${fontSize}px`;
                                        applyFontSizeToChildren(child);  // 遞迴處理子層
                                    });
                                }

                                // Add selected text to new span tag
                                span.appendChild(selectedContent);

                                // Recursively process child nodes within span tag
                                applyFontSizeToChildren(span);

                                // Insert modified content
                                range.insertNode(span);
                                context.invoke('editor.customFontSize', fontSize);
                            } else {
                                // Modify the entire line when no selection is made
                                context.invoke('editor.customFontSize', fontSize);
                            }
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

            // update toolbar px/pt value
            this.updateFontsizeInput = function () {
                // get current font size
                const styleInfo = context.invoke('editor.currentStyle');
                const fontSize = styleInfo['font-size'];
                const fontUnit = styleInfo['font-size-unit'][0]

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
            }


            this.destroy = function () {
                !!this.$css && $(this.$css).remove()
            };
        }
    })

}));