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
                        context.invoke("editor.fontSize", $target.val())    // update selection text fontsize
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
                        click: context.createInvokeHandlerAndUpdateState('editor.fontSize')
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
                
                // find button
                var $customFontSize = $toolbar.find('.custom-fontsize-input-group')
                
                // update input value
                var $fontsizeInput = $customFontSize.find('.note-fontsize-input')
                $fontsizeInput.val(fontSize)
                // update unit value
                var $fontSizeUnit = $customFontSize.find('.note-fontsize-unit')
                $fontSizeUnit.text(`px (${fontSize * 0.75}pt)`)
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