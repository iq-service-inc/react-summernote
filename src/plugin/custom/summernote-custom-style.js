/**
 * options={{
        customStyle: {
            maxStyle: 5,
            storeKey: 'summernote-stylelist',
            onGetList: () => {
                let list = [
                    { name: 'style1', styles: { 'font-family': 'Comic Sans MS', 'font-style': 'italic', 'color': '#007bff' } },
                    { name: 'style2', styles: { 'font-size': '24px', 'font-weight': 'bold', 'color': '#ffc107' } },
                    { name: 'style3', styles: { 'font-size': '10px', 'font-weight': 'bold', 'font-style': 'italic', 'color': '#ff9c00' } },
                    { name: 'style4', styles: { 'font-size': '40px', 'color': '#634aa5' } },
                    { name: 'style5', styles: { 'text-decoration': 'line-through', 'color': '#E76363' } },
                ]
                return list
            },
            onSave: (list) => list,
        }
    }}
 * let user create custom styles and save styles to localStorage
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
        customStyle: {
            maxStyle: 5,
            storeKey: 'summernote-stylelist',
            // onGetList: () => list,
            // onSave: (list) => list,
        }
    })
    $.extend($.summernote.plugins, {
        'customStyle': function (context) {
            var self = this,
                ui = $.summernote.ui,
                range = $.summernote.range,
                dom = $.summernote.dom,
                lists = $.summernote.lists,
                $note = context.layoutInfo.note,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                $toolbar = context.layoutInfo.toolbar,
                $statusbar = context.layoutInfo.statusbar,
                modules = context.modules,
                options = context.options,
                lang = options.langInfo;

            const maxStyle = options.customStyle.maxStyle || 5
            const storeKey = options.customStyle.storeKey || 'summernote-stylelist'
            const activeClassName = 'summernote-customStyle-active'

            this.styleList = []

            this.randomId = function () {
                let id = Date.now().toString(36) + Math.random().toString(36).substring(2)
                if (this.styleList.find(item => item.id === id)) id = this.randomId()
                return id
            }

            /**
             * check styleList validity
             */
            this.validStyleList = function () {
                if (this.styleList.length > maxStyle) {
                    this.styleList = this.styleList.slice(0, maxStyle)
                }
                this.styleList = this.styleList.map(item => {
                    let styles = {}
                    if (item.styles) {
                        const validStyles = cmds.map(item => item.key)
                        Object.keys(item.styles).map(key => {
                            if (validStyles.includes(key)) {
                                styles[key] = item.styles[key]
                            }
                        })
                    }
                    return {
                        name: item.name || 'styleName',
                        id: item.id || this.randomId(),
                        styles,
                    }
                })
            }

            /**
             * get styleList from localStorage (use 'storeKey' as keyname)
             * if 'onGetList' is defined it will call 'onGetList' function first
             * 
             * onGetList: () => styleList
             * 'onGetList' function will return styleList
             * if returned styleList is exist it will be saved to localStorage and retrieve later
             * otherwise styleList use empty array
             */
            this.getStyleList = async function () {
                if (typeof options.customStyle.onGetList === 'function') {
                    let list = await options.customStyle.onGetList() || []
                    if (!!list && list.length) {
                        list.map(item => {
                            return {
                                ...item,
                                id: item.id || this.randomId()
                            }
                        })
                        localStorage.setItem(storeKey, JSON.stringify(list))
                    }
                }
                try {
                    this.styleList = JSON.parse(localStorage.getItem(storeKey)) || []
                } catch (error) {
                    this.styleList = []
                }
                this.validStyleList()
            }

            /**
             * save styleList to localStorage (use 'storeKey' as keyname)
             * if 'onSave' is defined it will call 'onSave' function first
             * 
             * onSave: (styleList) => styleList
             * 'onSave' function will receive current styleList as parameter and return styleList
             * if returned styList is exist it will be saved to localStorage and retrieve later
             * otherwise current styleList will be saved
             */
            this.saveStyleList = async function () {
                let list = this.styleList
                if (typeof options.customStyle.onSave === 'function') {
                    list = await options.customStyle.onSave(this.styleList) || list
                    if (!!list && list.length) {
                        list.map(item => {
                            return {
                                ...item,
                                id: item.id || this.randomId()
                            }
                        })
                    }
                }
                localStorage.setItem(storeKey, JSON.stringify(list))
                try {
                    this.styleList = JSON.parse(localStorage.getItem(storeKey)) || []
                } catch (error) {
                    this.styleList = []
                }
                this.validStyleList()
            }

            this.initialize = async function () {
                if ($('#summernote-customStyle').length == 0) {
                    this.css = $('<style>').html([
                        '.dropdown-custom-style-list { max-width: 15rem; }',
                        '.dropdown-custom-style-list .dropdown-item { text-overflow: ellipsis; overflow: hidden; text-wrap: nowrap; }',

                        '.summernote-customStyle-dialog .modal-body { display: flex; padding: 0; padding-bottom: 0.3rem; max-height: calc(100vh - 8rem); min-height: 300px; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-list-container { overflow-y: auto; min-width: 150px; width: 25%; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-list .summernote-customStyle-item, ',
                        '.summernote-customStyle-dialog .summernote-customStyle-list .summernote-customStyle-addStyle { display: inline-flex; padding: 0.5rem 1.25rem; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-list .summernote-customStyle-item .summernote-customStyle-text-container { flex-grow: 1; margin: auto; text-overflow: ellipsis; overflow: hidden; text-wrap: nowrap; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-list .summernote-customStyle-item .summernote-customStyle-item-delete { border-radius: 50%; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-list .summernote-customStyle-item  i.note-icon-menu-check { visibility: hidden; color: #00bfff; margin: auto 0.25rem auto 0; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-list .summernote-customStyle-item.summernote-customStyle-active i.note-icon-menu-check { visibility: visible; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-divider { border-right: 1px solid #dee2e6; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-editor, ',
                        '.summernote-customStyle-dialog .summernote-customStyle-editor-tip { flex: 1; display: flex; flex-direction: column; max-height: calc(100vh - 8rem); min-height: 300px; overflow: auto; }',
                        '.summernote-customStyle-dialog .summernote-customStyle-editor .summernote-customStyle-toolbar { border-top: 1px solid rgba(0,0,0,.125); }',
                        '.summernote-customStyle-dialog .summernote-customStyle-editor .summernote-customStyle-preview { height: calc(100% - 2.5em); min-height: 200px; }',
                    ].join(''))
                    this.css.attr('id', 'summernote-customStyle')
                    $(document.head).append(this.css)
                }
                var $container = options.dialogsInBody ? $(document.body) : $editor
                this.$dialog = ui.dialog({
                    title: `${lang.customStyle.editStyleList}`,
                    className: 'summernote-customStyle-dialog',
                    fade: options.dialogsFade,
                    body: [].concat(
                        [
                            '<div class="summernote-customStyle-list-container">',
                            '<div class="d-flex justify-content-center border-bottom bg-light">',
                            `<span class="mr-2">${lang.customStyle.count}</span>`,
                            '<span class="summernote-customStyle-list-count font-weight-bold"></span>',
                            '</div>',
                            '<div class="list-group list-group-flush summernote-customStyle-list">',
                            '<button type="button" class="summernote-customStyle-addStyle list-group-item list-group-item-action bg-light">',
                            '<b class="mr-1">+</b>',
                            `<span>${lang.customStyle.addStyle}</span>`,
                            '</button>',
                            '</div>',
                            '</div>',
                        ],
                        ['<div class="summernote-customStyle-divider"></div>'],
                        [
                            '<div class="summernote-customStyle-editor note-editor">',

                            '<div class="form-inline px-3 py-2">',
                            '<div class="note-form-group form-group">',
                            `<label for="styleName-${options.id}" class="control-label note-form-label mr-3">${lang.customStyle.styleName}</label>`,
                            `<input type="text" class="summernote-customStyle-styleName form-control note-form-control note-input" id="styleName-${options.id}">`,
                            '</div>',
                            '<div class="note-form-group form-group flex-grow-1">',
                            `<small class="text-muted font-italic ml-auto">${lang.customStyle.hint}</small>`,
                            '</div>',
                            '</div>',

                            '<div class="summernote-customStyle-toolbar note-toolbar card-header">',
                            '</div>',

                            '<div class="px-3 py-2 flex-grow-1">',
                            `<label class="control-label note-form-label">${lang.customStyle.stylePreview}</label>`,
                            '<div class="summernote-customStyle-preview form-control note-form-control"></div>',
                            '</div>',

                            '</div>',
                            '<div class="summernote-customStyle-editor-tip" style="display: none">',
                            `<p class="font-italic text-muted m-auto">${lang.customStyle.noStyleSelected}</p>`,
                            '</div>',
                        ]).join(''),
                }).render().appendTo($container);
                this.$dialog.find('.modal-dialog').addClass('modal-xl')

                this.loadingDropdownList()
                await this.getStyleList()
                this.initDropdown()
                this.initList()
                this.initEditor()
            }
            this.destroy = function () {
                !!this.css && $(this.css).remove()
                this.$dialog.remove()
            }

            this.initDropdown = function () {
                let menu = this.generateDropdownMenu()
                let $dropdown = $toolbar.find('.dropdown-custom-style-list')
                $dropdown.empty().append(menu)
                this.dropdownEvent($dropdown)
            }
            this.initList = function () {
                let $addStyleBtn = this.$dialog.find('.summernote-customStyle-addStyle')
                $addStyleBtn.on('click', (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (this.styleList.length + 1 > maxStyle) return
                    this.$dialog.find(`.${activeClassName}`).removeClass(activeClassName)
                    let $item = this.newStyle()
                    $item.addClass(activeClassName)
                    this.updateEditor()
                    this.updateListCount()
                })

                if (this.styleList.length) {
                    // add style items to list
                    this.styleList.forEach((item, index) => {
                        let $item = this.newStyle(item)
                        // initial active item
                        if (index == 0) {
                            $item.addClass(activeClassName)
                        }
                    })
                }
                this.updateListCount()
            }

            /**
             * 'colorPalette' copy from 'summernote-v0.8.18/src/js/base/module/Buttons.js' modify click event
             */
            this.colorPalette = function(className, tooltip, backColor, foreColor) {
                return ui.buttonGroup({
                    className: 'note-color ' + className,
                    children: [
                        ui.button({
                            className: 'note-current-color-button',
                            contents: ui.icon(options.icons.font + ' note-recent-color'), 
                            tooltip: tooltip,
                            click: (e) => {
                                const $button = $(e.currentTarget);
                                if (backColor && foreColor) {
                                    context.invoke('customStyle.foreColor', $button.attr('data-foreColor'));
                                    context.invoke('customStyle.backColor', $button.attr('data-backColor'));
                                } else if (backColor) {
                                    context.invoke('customStyle.backColor', $button.attr('data-backColor'));
                                } else if (foreColor) {
                                    context.invoke('customStyle.foreColor', $button.attr('data-foreColor'));
                                }
                            },
                            callback: ($button) => {
                                const $recentColor = $button.find('.note-recent-color');
                                if (backColor) {
                                $recentColor.css('background-color', options.colorButton.backColor);
                                $button.attr('data-backColor', options.colorButton.backColor);
                                }
                                if (foreColor) {
                                $recentColor.css('color', options.colorButton.foreColor);
                                $button.attr('data-foreColor', options.colorButton.foreColor);
                                } else {
                                $recentColor.css('color', 'transparent');
                                }
                            },
                        }),
                        ui.button({
                            className: 'dropdown-toggle',
                            contents: ui.dropdownButtonContents('', options),
                            tooltip: lang.customStyle.more,
                            data: {
                                toggle: 'dropdown',
                            },
                        }),
                        ui.dropdown({
                            items: (backColor ? [
                                '<div class="note-palette">',
                                '<div class="note-palette-title">' + lang.customStyle.background + '</div>',
                                '<div>',
                                    '<button type="button" class="note-color-reset btn btn-light btn-default" data-event="backColor" data-value="transparent">',
                                    lang.customStyle.transparent,
                                    '</button>',
                                '</div>',
                                '<div class="note-holder" data-event="backColor"><!-- back colors --></div>',
                                '<div>',
                                    '<button type="button" class="note-color-select btn btn-light btn-default" data-event="openPalette" data-value="backColorPicker-' + options.id + '">',
                                    lang.customStyle.cpSelect,
                                    '</button>',
                                '<input type="color" id="backColorPicker-' + options.id + '" class="note-btn note-color-select-btn" value="' + options.colorButton.backColor + '" data-event="backColorPalette-' + options.id + '">',
                                '</div>',
                                '<div class="note-holder-custom" id="backColorPalette-' + options.id + '" data-event="backColor"></div>',
                                '</div>',
                                ].join('') : '') +
                                (foreColor ? [
                                '<div class="note-palette">',
                                '<div class="note-palette-title">' + lang.customStyle.foreground + '</div>',
                                '<div>',
                                    '<button type="button" class="note-color-reset btn btn-light btn-default" data-event="removeFormat" data-value="foreColorPicker-' + options.id + '">',
                                    lang.customStyle.resetToDefault,
                                    '</button>',
                                '</div>',
                                '<div class="note-holder" data-event="foreColor"><!-- fore colors --></div>',
                                '<div>',
                                    '<button type="button" class="note-color-select btn btn-light btn-default" data-event="openPalette" data-value="foreColorPicker-' + options.id + '">',
                                    lang.customStyle.cpSelect,
                                    '</button>',
                                    '<input type="color" id="foreColorPicker-' + options.id + '" class="note-btn note-color-select-btn" value="' + options.colorButton.foreColor + '" data-event="foreColorPalette-' + options.id + '">',
                                '</div>',
                                '<div class="note-holder-custom" id="foreColorPalette-' + options.id + '" data-event="foreColor"></div>',
                                '</div>',
                                ].join('') : ''),
                            callback: ($dropdown) => {
                                $dropdown.find('.note-holder').each((idx, item) => {
                                    const $holder = $(item);
                                    $holder.append(ui.palette({
                                        colors: options.colors,
                                        colorsName: options.colorsName,
                                        eventName: $holder.data('event'),
                                        container: options.container,
                                        tooltip: options.tooltip,
                                    }).render());
                                });
                                var customColors = [['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']];
                                $dropdown.find('.note-holder-custom').each((idx, item) => {
                                    const $holder = $(item);
                                    $holder.append(ui.palette({
                                        colors: customColors,
                                        colorsName: customColors,
                                        eventName: $holder.data('event'),
                                        container: options.container,
                                        tooltip: options.tooltip,
                                    }).render());
                                });
                                $dropdown.find('input[type=color]').each((idx, item) => {
                                    $(item).on('input', function() {
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

                                const $menu = $(event.currentTarget);
                                const $button = $(event.target);
                                const eventName = $button.data('event');
                                const value = $button.attr('data-value');
                    
                                if (eventName === 'openPalette') { 
                                    console.log(value)
                                    const $picker = $menu.find('#' + value);
                                    const $palette = $($menu.find('#' + $picker.data('event')).find('.note-color-row')[0]);
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
                                    context.invoke('customStyle.' + eventName, value);
                                }
                            },
                        })
                    ]
                }).render();
            }

            this.initEditor = function () {
                let $customStyleEditor = this.$dialog.find('.summernote-customStyle-editor')
                let $customStyleToolbar = $customStyleEditor.find('.summernote-customStyle-toolbar')

                // styleName input
                $customStyleEditor.find('.summernote-customStyle-styleName').on('input', (e) => {
                    let item = this.getCurrentItem()
                    item['name'] = e.target.value
                    this.updateList()
                    this.updateEditor()
                })

                // fontname button
                let $fontNameBtn = context.memo('button.customFont')()
                $fontNameBtn.find('.dropdown-menu').css({
                    'max-height': '15rem',
                    'overflow-y': 'auto',
                }).off('click').on('click', (e) => {
                    context.invoke('customStyle.fontName', $(e.target).closest('[data-value]').attr('data-value'))
                })

                // fontsize input dropdown
                let fontSizeEvent = (e) => {
                    let $target = $(e.target)
                    let value = parseFloat($target.closest('[data-value]').attr('data-value'))
                    if (value < options.fontsizeInput.min) {
                        value = options.fontsizeInput.min
                    }
                    else if (value > options.fontsizeInput.max) {
                        value = options.fontsizeInput.max
                    }

                    context.invoke("customStyle.fontSize", value + 'px')
                }
                let fontSizeInputEvent = (e) => {
                    if (event.keyCode === 13) { // Enter
                        let value = parseFloat($(e.target).val())
                        if (value < options.fontsizeInput.min) {
                            context.invoke("customStyle.fontSize", options.fontsizeInput.min + 'px')
                        }
                        else if (value > options.fontsizeInput.max) {
                            context.invoke("customStyle.fontSize", options.fontsizeInput.max + 'px')
                        }
                        else {
                            context.invoke("customStyle.fontSize", value + 'px')
                        }
                    }
                    else if (event.keyCode === 27) {    // ESC
                        e.preventDefault()
                        e.stopPropagation()
                        let item = this.getCurrentItem()
                        let value = (item.styles['font-size']).replace(/[^\d\.]/g, '') || ''
                        $(e.target).val(value)
                    }
                }
                let $fontSizeInput = context.memo('button.fontsizeInput')()
                $fontSizeInput.find('.dropdown-menu').css({
                    'max-height': '15rem',
                    'overflow-y': 'auto',
                }).off('click').on('click', fontSizeEvent)
                $fontSizeInput.find('.note-fontsize-input').addClass('note-input-fontsize').off().on('keydown', fontSizeInputEvent)

                // fontstyles buttons
                let fontStyleBtns = (['bold', 'italic', 'strikethrough']).map((value) => {
                    let $btn = context.memo(`button.${value}`)()
                    $btn.off('click').on('click', (e) => {
                        context.invoke(`customStyle.${value}`)
                        e.currentTarget.blur()
                    })
                    return $btn
                })

                let $forecolorBtn = this.colorPalette('note-color-fore-btn', lang.customStyle.foreground, false, true)
                let $backcolorBtn = this.colorPalette('note-color-back-btn', lang.customStyle.background, true, false)

                // add buttons to toolbar
                $('<div class="note-btn-group btn-group">').append($fontNameBtn).appendTo($customStyleToolbar)
                $('<div class="note-btn-group btn-group">').append($fontSizeInput).appendTo($customStyleToolbar)
                $('<div class="note-btn-group btn-group">').append(fontStyleBtns).appendTo($customStyleToolbar)
                $('<div class="note-btn-group btn-group">').append($forecolorBtn, $backcolorBtn).appendTo($customStyleToolbar)

                $customStyleToolbar.find('button.note-btn,button.note-color-btn').each((_, domBtn) => {
                    let $btn = $(domBtn)
                    $btn.tooltip('dispose').tooltip({
                        container: this.$dialog,
                        trigger: 'hover',
                        placement: 'bottom',
                    })
                })

                this.updateEditor()
            }

            /**
             * toolbar buttons and its commands
             */
            const cmds = [
                { name: 'bold', key: 'font-weight', value: 'bold', type: 'toggle' },
                { name: 'italic', key: 'font-style', value: 'italic', type: 'toggle' },
                { name: 'strikethrough', key: 'text-decoration', value: 'line-through', type: 'toggle' },
                { name: 'foreColor', key: 'color', value: 'black', type: 'color' },
                { name: 'backColor', key: 'background-color', value: '#FFFF00', type: 'color' },
                { name: 'fontSize', key: 'font-size', value: '16px', type: 'input' },
                { name: 'fontName', key: 'font-family', value: 'system-ui', type: 'dropdown' },
            ]
            cmds.forEach(cmd => {
                this[cmd.name] = ((cmd) => {
                    return (value) => {
                        let item = this.getCurrentItem()
                        if (item) {
                            if (cmd.type === 'toggle' && item.styles[cmd.key] === cmd.value) {
                                delete item.styles[cmd.key]
                            }
                            else {
                                item.styles[cmd.key] = value || cmd.value
                            }
                            this.updateList()
                            this.updateEditor()
                        }
                    }
                })(cmd)
            })

            /**
             * removeFormat will called by color palatte
             */
            this.removeFormat = function () {
                let item = this.getCurrentItem()
                if (item) {
                    delete item.styles['color']
                    this.updateList()
                    this.updateEditor()
                }
            }

            /**
             * create new style or create based on data
             */
            this.newStyle = function (data) {
                let item = data
                if (!data) {
                    item = { name: 'styleName', id: this.randomId(), styles: {} }
                    this.styleList.push(item)
                }

                // create related element
                let $item = $('<button type="button" class="summernote-customStyle-item list-group-item list-group-item-action">')
                    .attr({
                        'aria-label': item.name,
                        'data-value': item.id,
                    })
                let $checkIcon = $('<i class="note-icon-menu-check"></i>')
                let $styleText = $('<span class="summernote-customStyle-text">')
                    .css(item.styles)
                    .text(item.name)
                if ($styleText.css('font-size')) {
                    // set item font-size min 5px, max 1.5rem
                    let currentFontSize = $styleText.css('font-size')
                    $styleText.css('font-size', `clamp(5px, ${currentFontSize}, 1.5rem)`)
                }
                let $textContainer = $('<div class="summernote-customStyle-text-container">').append($styleText)
                let $delBtn = $('<button type="button" class="note-btn btn btn-sm btn-light summernote-customStyle-item-delete">')
                    .append('<i class="note-icon-trash">')
                $item.append($checkIcon, $textContainer, $delBtn)

                // insert $item befor addStyle button in dialog style list
                let $addStyleBtn = this.$dialog.find('.summernote-customStyle-addStyle')
                $item.insertBefore($addStyleBtn)

                // click $item will change active list item and update editor data
                $item.on('click', (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.$dialog.find(`.${activeClassName}`).removeClass(activeClassName)
                    $(e.currentTarget).addClass(activeClassName)
                    this.updateEditor()
                })
                // click delete button will remove related $item data from styleList
                // after delete will update style list and editor
                $item.find('.summernote-customStyle-item-delete').on('click', (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.styleList = this.styleList.filter(newItem => newItem.id !== item.id)
                    this.updateList()
                    this.updateEditor()
                })

                return $item
            }

            /**
             * update dialog style list
             */
            this.updateList = function () {
                let $customStyleList = this.$dialog.find('.summernote-customStyle-list')
                $customStyleList.find('.summernote-customStyle-item[data-value]').each((_, domItem) => {
                    let $item = $(domItem)
                    let item = this.styleList.find(item => item.id === $item.attr('data-value'))
                    if (item) {
                        // update $item data
                        $item.attr({
                            'aria-label': item.name,
                            'data-value': item.id,
                        })
                        let $styleText = $item.find('.summernote-customStyle-text')
                            .removeAttr('style').css(item.styles)
                            .text(item.name)
                        if ($styleText.css('font-size')) {
                            let currentFontSize = $styleText.css('font-size')
                            $styleText.css('font-size', `clamp(5px, ${currentFontSize}, 1.5rem)`)
                        }
                    }
                    else {
                        // if $item data is not exist in styleList remove it
                        $item.remove()
                    }
                })
                this.updateListCount()
            }

            /**
             * update style list count and toggle addStyle button disabled property
             */
            this.updateListCount = function () {
                let $count = this.$dialog.find('.summernote-customStyle-list-count')
                $count.text(`${this.styleList.length}/${maxStyle}`)

                if (this.styleList.length < maxStyle) {
                    this.$dialog.find('.summernote-customStyle-addStyle').prop('disabled', false)
                }
                else {
                    this.$dialog.find('.summernote-customStyle-addStyle').prop('disabled', true)
                }
            }

            this.getCurrentItem = function () {
                let $customStyleEditor = this.$dialog.find('.summernote-customStyle-editor')
                let id = $customStyleEditor.attr('data-value')
                let item = this.styleList.find(item => item.id === id)
                return item
            }

            this.updateToolbar = function (styles) {
                let $customStyleToolbar = this.$dialog.find('.summernote-customStyle-toolbar')
                let type, $target
                cmds.forEach(cmd => {
                    type = cmd.type
                    switch (type) {
                        case 'toggle':
                            $target = $customStyleToolbar.find(`.note-btn-${cmd.name.toLowerCase()}`)
                            $target.toggleClass('active', styles[cmd.key] === cmd.value)
                            break;
                        case 'color':   // color is 'recent color' not 'current color'
                            // $target = $customStyleToolbar.find(`.note-color-${cmd.name.toLowerCase()}`)
                            // $target.attr(`data-${cmd.name}`, styles[cmd.key])
                            // $target.find('.note-recent-color').css(cmd.key, styles[cmd.key])
                            break;
                        case 'input':
                            $target = $customStyleToolbar.find(`.note-input-${cmd.name.toLowerCase()}`)
                            // $target.val((styles[cmd.key] || cmd.value).replace(/[^\d\.]/g, ''))
                            $target.val(styles[cmd.key]?.replace(/[^\d\.]/g, ''))
                            break;
                        case 'dropdown':
                            $target = $customStyleToolbar.find(`.dropdown-${cmd.name.toLowerCase()}`)
                            let value = styles[cmd.key] || cmd.value
                            $target.val(value)
                            $target.find('.checked').removeClass('checked')
                            let $currentItem = $target.find(`[data-value="${value}"]`)
                            $currentItem.addClass('checked')
                            let $text = $target.prev('.dropdown-toggle').find('span')
                            $text.text($currentItem.text()).css(cmd.key, value)
                            break;
                    }
                    if (cmd.name === 'fontSize') {  // fontSize include input and dropdown
                        $target = $customStyleToolbar.find(`.dropdown-${cmd.name.toLowerCase()}`)
                        $target.find('.checked').removeClass('checked')
                        let $fontSizeUnit = $target.prev('.dropdown-toggle.note-fontsize-unit')
                        let value = $customStyleToolbar.find(`.note-input-${cmd.name.toLowerCase()}`).val()
                        if (value) {
                            $target.val(value)
                            $target.find(`[data-value="${value}"]`).addClass('checked')
                            $fontSizeUnit.text(`px (${value * 0.75}pt)`)
                        }
                        else {
                            $target.val('')
                            $fontSizeUnit.text('px')
                        }
                    }
                })
            }

            this.updateEditor = function () {
                let $customStyleEditor = this.$dialog.find('.summernote-customStyle-editor')
                let $customStyleEditorTip = this.$dialog.find('.summernote-customStyle-editor-tip')
                let $customStyleList = this.$dialog.find('.summernote-customStyle-list')
                let $current = $customStyleList.find(`.${activeClassName}`)
                if ($current.length) {
                    let id = $current.attr('data-value')
                    let item = this.styleList.find(item => item.id === id)
                    $customStyleEditor.attr('data-value', id)
                    // update input styleName value
                    $customStyleEditor.find('.summernote-customStyle-styleName').val(item.name)
                    // update preview
                    let $styledText = $('<span>').text(item.name).removeAttr('style').css(item.styles)
                    $customStyleEditor.find('.summernote-customStyle-preview').empty().append($styledText)
                    // update Toolbar
                    this.updateToolbar(item.styles)

                    $customStyleEditor.show()
                    $customStyleEditorTip.hide()
                }
                else {
                    $customStyleEditor.hide()
                    $customStyleEditorTip.show()
                }
            }

            /**
             * generate dropdown menu based on current styleList
             */
            this.generateDropdownMenu = function () {
                let list = this.styleList.length ?
                    this.styleList.map((item) => {
                        var $styleText = $('<span>').css(item.styles).text(item.name)
                        if ($styleText.css('font-size')) {
                            // set item font-size min 5px, max 1.5rem
                            let currentFontSize = $styleText.css('font-size')
                            $styleText.css('font-size', `clamp(5px, ${currentFontSize}, 1.5rem)`)
                        }
                        var $dropdownItem = $('<a>').addClass('dropdown-item')
                            .attr({
                                'href': '#',
                                'role': 'listitem',
                                'aria-label': item.name,
                                'data-value': item.id,
                            }).append($styleText)
                        return $dropdownItem.prop('outerHTML')
                    }).join('')
                    : `<a class="dropdown-item disabled font-italic">${lang.customStyle.emptyStyleList}</a>`
                let divider = '<div class="dropdown-divider"></div>'
                let edit = [
                    `<a class="dropdown-item custom-style-edit" href="#" role="listitem" aria-label="${lang.customStyle.editStyleList}">`,
                    `<b class="note-icon-pencil mr-1 align-text-bottom text-secondary" style="font-size: 0.8em;"></b>`,
                    `<span>${lang.customStyle.editStyleList}</span>`,
                    '</a>',
                ].join('')
                let menu = list + divider + edit
                return menu
            }

            this.loadingDropdownList = function () {
                let content = '<div class="dropdown-item disabled">Loading...<span class="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span></div>'
                $toolbar.find('.dropdown-custom-style-list').html(content)
            }

            const styleIcon = [
                '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512">',
                '<path d="m251.4,305.33l11.65,29.28l3.88,9.17c3.59,7.69 5.38,13.9 5.38,18.63c0,5.33 -2.19,9.72 -6.57,13.16c-4.39,3.45 -15.63,5.17 -33.75,5.17l0,32.84l201.03,0l0,-32.84c-9.36,0 -19.12,-3.1 -29.27,-9.31c-10.15,-6.21 -21.51,-24.7 -34.05,-55.47l-126.96,-310.61l-34.95,0l-124.56,310.91c-17.32,42.99 -38.74,64.48 -64.22,64.48l0,32.84l133.83,0l0,-32.84c-14.94,0 -25.69,-1.93 -32.26,-5.76c-6.57,-3.85 -9.86,-10.6 -9.86,-20.26c0,-5.72 2.79,-15.58 8.37,-29.58l7.77,-19.82l124.56,0l0,0.01l-0.01,0.01zm-63.92,-153.82l50.49,119.8l-98.27,0l47.8,-119.8l-0.01,0l-0.01,0z"></path>',
                '<path d="m409.56,324.63c-32.25,11.24 -58.6,32.06 -63.17,81.32c-1.04,9.07 -1.02,12.56 -3.59,17.42c-6.67,9.92 -29.32,12.1 -56.7,11.66c20.32,51.34 63.83,84.96 137.62,64.48c62.16,-17.26 94.87,-64.97 77.5,-127.54c-0.7,-2.53 -1.96,-4.83 -2.89,-7.22l-88.75,-40.01l-0.02,-0.08l0,-0.01l0,-0.01l0,-0.01zm163.45,-307.23c-12.44,3.45 -22.56,12.17 -29.17,22.65c-125.88,196.02 -142.37,204.3 -130.13,248.36c3.11,11.22 8.8,21.19 15.92,29.72l64.36,29.07c6.3,-0.16 12.63,-0.85 19.03,-2.64c50.85,-14.12 69.99,-59.57 114.66,-258.08c2.79,-13.47 4.58,-27.66 0.92,-40.82c-6.58,-23.67 -32.55,-34.63 -55.56,-28.24l-0.01,-0.01l0,-0.01l-0.02,0z" fill="#007fff" transform="rotate(-1.3553199768066406 458.3787384033203,260.6096954345703)"></path>',
                '</svg>'
            ].join('')
            context.memo('button.customStyle', function () {
                return ui.buttonGroup({
                    children: [
                        ui.button({
                            className: 'dropdown-toggle custom-style-list',
                            contents: styleIcon,
                            tooltip: lang.customStyle.customStyle,
                            data: {
                                toggle: 'dropdown',
                            },
                        }),
                        ui.dropdownCheck({
                            className: 'dropdown-custom-style-list',
                            items: '<div class="dropdown-item disabled">Loading...<span class="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span></div>'
                        }),
                    ]
                }).render()
            });

            this.dropdownEvent = function ($dropdown) {
                $dropdown.find("a.dropdown-item").not(".custom-style-edit").each(function () {
                    $(this).on('click', function (e) {
                        e.preventDefault();
                        context.invoke("customStyle.updateStyleType", $(this).attr("data-value"))
                    });
                });
                $dropdown.find("a.dropdown-item.custom-style-edit").on('click', function (e) {
                    e.preventDefault();
                    context.invoke('customStyle.openEditStyleDialog')
                })
            }

            this.openEditStyleDialog = async function () {
                context.invoke('editor.saveRange');
                this.showEditStyleDialog().then(async () => {
                    context.invoke('editor.restoreRange');
                    this.loadingDropdownList()
                    await this.saveStyleList()
                    let menu = this.generateDropdownMenu()
                    let $dropdown = $toolbar.find('.dropdown-custom-style-list')
                    $dropdown.empty().append(menu)
                    this.dropdownEvent($dropdown)
                })
            }
            this.showEditStyleDialog = function () {
                return $.Deferred((deferred) => {
                    ui.onDialogShown(this.$dialog, function () {
                        context.triggerEvent('dialog.shown');
                    });
                    ui.onDialogHidden(this.$dialog, function () {
                        deferred.resolve()
                    });
                    ui.showDialog(this.$dialog);
                });
            }

            /**
             * 'fontStyling' copy from 'summernote-v0.8.18/src/js/base/module/Editor.js' parameter change to object
             */
            this.fontStyling = function (styles) {
                const rng = context.invoke('editor.getLastRange');

                if (rng !== '') {
                    const spans = modules.editor.style.styleNodes(rng);
                    $editor.find('.note-status-output').html('');
                    $(spans).css(styles);

                    // [workaround] added styled bogus span for style
                    //  - also bogus character needed for cursor position
                    const KEY_BOGUS = 'bogus'
                    if (rng.isCollapsed()) {
                        const firstSpan = lists.head(spans);
                        if (firstSpan && !dom.nodeLength(firstSpan)) {
                            firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
                            range.createFromNode(firstSpan.firstChild).select();
                            context.invoke('editor.setLastRange');
                            $editable.data(KEY_BOGUS, firstSpan);
                        }
                    } else {
                        context.invoke('editor.setLastRange',
                            context.invoke('editor.createRangeFromList', spans).select()
                        )
                    }
                } else {
                    const noteStatusOutput = $.now();
                    $editor.find('.note-status-output').html('<div id="note-status-output-' + noteStatusOutput + '" class="alert alert-info">' + lang.output.noSelection + '</div>');
                    setTimeout(function () { $('#note-status-output-' + noteStatusOutput).remove(); }, 5000);
                }
            }
            this.updateStyleType = function (id) {
                let styles = this.styleList.find(item => item.id === id)['styles']
                context.invoke('customStyle.fontStyling', styles)
            }
        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            customStyle: {
                customStyle: '自訂樣式',
                emptyStyleList: '尚未添加樣式',
                count: '樣式數量',
                editStyleList: '設定樣式',
                addStyle: '新增樣式',
                styleName: '樣式名稱',
                hint: '關閉對話框自動儲存樣式設定',
                stylePreview: '樣式預覽',
                noStyleSelected: '請選擇樣式',
                foreground: '字型顏色',
                resetToDefault: '預設',
                cpSelect: 'Select',
                background: '字型背景',
                transparent: '透明',
                more: '更多'
            }
        },
        'en-US': {
            customStyle: {
                customStyle: 'Custom Style',
                emptyStyleList: 'No styles added',
                count: 'Style Count',
                editStyleList: 'Edit Style',
                addStyle: 'Add Style',
                styleName: 'Style Name',
                hint: 'Close dialog will automatically save style settings',
                stylePreview: 'Style Preview',
                noStyleSelected: 'Please Select One Style',
                foreground: 'Text Color',
                resetToDefault: 'Reset to default',
                cpSelect: 'Select',
                background: 'Background Color',
                transparent: 'Transparent',
                more: 'More Color'
            }
        },
    });
}));