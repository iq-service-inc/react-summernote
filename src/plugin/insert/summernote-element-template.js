/**
 * base on
 * [summernote-template](https://github.com/Nanakii/summernote-plugins/tree/master/plugin/template)
 * [summernote-templates](https://github.com/DiemenDesign/summernote-templates)
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
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            template: {
                template: '模版',
                insert: '插入模版',
            }
        },
        'en-US': {
            template: {
                template: 'Template',
                insert: 'Insert Template',
            }
        },
    });

    $.extend($.summernote.options, {
        template: {}
    });

    // Extend plugins for adding templates
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'template': function (context) {
            var ui = $.summernote.ui;
            var lang = context.options.langInfo.template
            var options = context.options.template;
            var defaultOptions = {
                label: lang.template,
                tooltip: lang.insert,
                list: {}
            };
            // Assign default values if not supplied
            for (var propertyName in defaultOptions) {
                if (options.hasOwnProperty(propertyName) === false) {
                    options[propertyName] = defaultOptions[propertyName];
                }
            }

            // add template button
            context.memo('button.template', function () {

                // create button
                var button = ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-toggle',
                        contents: '<span class="template"/> ' + options.label + ' <span class="caret"></span>',
                        tooltip: options.tooltip,
                        data: {
                            toggle: 'dropdown'
                        }
                    }),
                    ui.dropdown({
                        className: 'dropdown-template',
                        items: Object.keys(options.list),
                        click: function (event) {
                            event.preventDefault();

                            var $button = $(event.target);
                            var value = $button.data('value');
                            var node = options.list[value].get(0)
                            context.invoke('editor.insertNode', node);
                        }
                    })
                ]);

                // create jQuery object from button instance.
                return button.render();
            });
        }
    });
}));