/**
 * patch summernote 0.8.18 module/Buttons.js
 * 
 * override buttons colorPalette function
 * add id for color picker
 * source: https://github.com/summernote/summernote/pull/3910, https://github.com/summernote/summernote/commit/b8234e3cf34ace3b7a3f3db98b3f009690a9ec0e
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
        'patchButtons': function (context) {
            var lists = $.summernote.lists,
                modules = context.modules;

            function colorPalette(className, tooltip, backColor, foreColor) {
                return this.ui.buttonGroup({
                    className: 'note-color ' + className,
                    children: [
                        this.button({
                            className: 'note-current-color-button',
                            contents: this.ui.icon(this.options.icons.font + ' note-recent-color'),
                            tooltip: tooltip,
                            click: (e) => {
                                const $button = $(e.currentTarget);
                                if (backColor && foreColor) {
                                    this.context.invoke('editor.color', {
                                        backColor: $button.attr('data-backColor'),
                                        foreColor: $button.attr('data-foreColor'),
                                    });
                                } else if (backColor) {
                                    this.context.invoke('editor.color', {
                                        backColor: $button.attr('data-backColor'),
                                    });
                                } else if (foreColor) {
                                    this.context.invoke('editor.color', {
                                        foreColor: $button.attr('data-foreColor'),
                                    });
                                }
                            },
                            callback: ($button) => {
                                const $recentColor = $button.find('.note-recent-color');
                                if (backColor) {
                                    $recentColor.css('background-color', this.options.colorButton.backColor);
                                    $button.attr('data-backColor', this.options.colorButton.backColor);
                                }
                                if (foreColor) {
                                    $recentColor.css('color', this.options.colorButton.foreColor);
                                    $button.attr('data-foreColor', this.options.colorButton.foreColor);
                                } else {
                                    $recentColor.css('color', 'transparent');
                                }
                            },
                        }),
                        this.button({
                            className: 'dropdown-toggle',
                            contents: this.ui.dropdownButtonContents('', this.options),
                            tooltip: this.lang.color.more,
                            data: {
                                toggle: 'dropdown',
                            },
                        }),
                        this.ui.dropdown({
                            items: (backColor ? [
                                '<div class="note-palette">',
                                '<div class="note-palette-title">' + this.lang.color.background + '</div>',
                                '<div>',
                                '<button type="button" class="note-color-reset btn btn-light btn-default" data-event="backColor" data-value="transparent">',
                                this.lang.color.transparent,
                                '</button>',
                                '</div>',
                                '<div class="note-holder" data-event="backColor"><!-- back colors --></div>',
                                '<div>',
                                '<button type="button" class="note-color-select btn btn-light btn-default" data-event="openPalette" data-value="backColorPicker-' + this.options.id + '">',
                                this.lang.color.cpSelect,
                                '</button>',
                                '<input type="color" id="backColorPicker-' + this.options.id + '" class="note-btn note-color-select-btn" value="' + this.options.colorButton.backColor + '" data-event="backColorPalette-' + this.options.id + '">',
                                '</div>',
                                '<div class="note-holder-custom" id="backColorPalette-' + this.options.id + '" data-event="backColor"></div>',
                                '</div>',
                            ].join('') : '') +
                                (foreColor ? [
                                    '<div class="note-palette">',
                                    '<div class="note-palette-title">' + this.lang.color.foreground + '</div>',
                                    '<div>',
                                    '<button type="button" class="note-color-reset btn btn-light btn-default" data-event="removeFormat" data-value="foreColor">',
                                    this.lang.color.resetToDefault,
                                    '</button>',
                                    '</div>',
                                    '<div class="note-holder" data-event="foreColor"><!-- fore colors --></div>',
                                    '<div>',
                                    '<button type="button" class="note-color-select btn btn-light btn-default" data-event="openPalette" data-value="foreColorPicker-' + this.options.id + '">',
                                    this.lang.color.cpSelect,
                                    '</button>',
                                    '<input type="color" id="foreColorPicker-' + this.options.id + '" class="note-btn note-color-select-btn" value="' + this.options.colorButton.foreColor + '" data-event="foreColorPalette-' + this.options.id + '">',
                                    '</div>', // Fix missing Div, Commented to find easily if it's wrong
                                    '<div class="note-holder-custom" id="foreColorPalette-' + this.options.id + '" data-event="foreColor"></div>',
                                    '</div>',
                                ].join('') : ''),
                            callback: ($dropdown) => {
                                $dropdown.find('.note-holder').each((idx, item) => {
                                    const $holder = $(item);
                                    $holder.append(this.ui.palette({
                                        colors: this.options.colors,
                                        colorsName: this.options.colorsName,
                                        eventName: $holder.data('event'),
                                        container: this.options.container,
                                        tooltip: this.options.tooltip,
                                    }).render());
                                });
                                /* TODO: do we have to record recent custom colors within cookies? */
                                var customColors = [
                                    ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
                                ];
                                $dropdown.find('.note-holder-custom').each((idx, item) => {
                                    const $holder = $(item);
                                    $holder.append(this.ui.palette({
                                        colors: customColors,
                                        colorsName: customColors,
                                        eventName: $holder.data('event'),
                                        container: this.options.container,
                                        tooltip: this.options.tooltip,
                                    }).render());
                                });
                                $dropdown.find('input[type=color]').each((idx, item) => {
                                    $(item).on('input', function () {
                                        const $chip = $dropdown.find('#' + $(this).data('event')).find('.note-color-btn').first();
                                        const color = this.value.toUpperCase();
                                        $chip.css('background-color', color)
                                            .attr('aria-label', color)
                                            .attr('data-value', color)
                                            .attr('data-original-title', color);
                                    });
                                    $(item).on('change', function () {
                                        const $chip = $dropdown.find('#' + $(this).data('event')).find('.note-color-btn').first();
                                        $chip.click();
                                    });
                                });
                            },
                            click: (event) => {
                                event.stopPropagation();

                                const $parent = $(event.currentTarget);
                                const $button = $(event.target);
                                const eventName = $button.data('event');
                                const value = $button.attr('data-value');


                                if (eventName === 'openPalette') {
                                    const $picker = $parent.find('#' + value);
                                    const $palette = $($parent.find('#' + $picker.data('event')).find('.note-color-row')[0]);

                                    // Shift palette chips
                                    const $chip = $palette.find('.note-color-btn').last().detach();

                                    // Set chip attributes
                                    const color = $picker.val();
                                    $chip.css('background-color', color)
                                        .attr('aria-label', color)
                                        .attr('data-value', color)
                                        .attr('data-original-title', color);
                                    $palette.prepend($chip);
                                    $picker.click();
                                } else {
                                    if (lists.contains(['backColor', 'foreColor'], eventName)) {
                                        const key = eventName === 'backColor' ? 'background-color' : 'color';
                                        const $color = $button.closest('.note-color').find('.note-recent-color');
                                        const $currentButton = $button.closest('.note-color').find('.note-current-color-button');

                                        $color.css(key, value);
                                        $currentButton.attr('data-' + eventName, value);
                                    }
                                    this.context.invoke('editor.' + eventName, value);
                                }
                            },
                        }),
                    ],
                }).render();
            }

            modules.buttons.colorPalette = colorPalette.bind(modules.buttons)
        }
    })
}));
