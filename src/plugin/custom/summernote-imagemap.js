/**
 * options={{
        toolbar: [
            ['insert', ['imageMap']]
        ],
        imageMap: {
            maxArea: 30,
        }
    }}
 * image map 
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
    $.fn.attrFloat = function (attr, value) {
        if (typeof attr == 'string' && !value) {
            return parseFloat(parseFloat(this.attr(attr)).toFixed(4))
        }
        else if (typeof attr == 'object') {
            Object.keys(attr).forEach((key) => {
                let value = parseFloat(parseFloat(attr[key]).toFixed(4))
                this.attr(key, value)
            })
            return this
        }
        else {
            return this.attr(attr, parseFloat(parseFloat(value).toFixed(4)))
        }
    }
    $.extend($.summernote.options, {
        imageMap: {
            maxArea: 30,
        }
    })
    $.extend($.summernote.plugins, {
        'imageMap': function (context) {
            var range = $.summernote.range;
            var dom = $.summernote.dom;
            var lists = $.summernote.lists;
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

            const maxArea = options.imageMap.maxArea

            this.toggleImageButtonDisplay = () => {
                const $targetImg = $editingArea.find('.note-handle .note-control-selection').data('target')
                const hasTargetImg = !!$targetImg && $targetImg.length
                $toolbar.find('.summernote-image-display').toggle(hasTargetImg)
            }
            this.events = {
                'summernote.mousedown': (we, e) => {
                    const isImage = dom.isImg(e.target)
                    if (isImage) {
                        const $img = $(e.target)
                        const mapId = $img.attr('usemap')?.substring(1)
                        const $targetImgMap = $editingArea.find(`map[name="${mapId}"`)
                        const imageMap = new ImageMap(mapId, $img, $targetImgMap)
                        imageMap.resizeImageMap()
                    }
                },
                'summernote.change': () => {
                    const $img = $editingArea.find('.note-handle .note-control-selection').data('target')
                    if (!!$img && $img.length) {
                        const mapId = $img.attr('usemap')?.substring(1)
                        const $targetImgMap = $editingArea.find(`map[name="${mapId}"`)
                        const imageMap = new ImageMap(mapId, $img, $targetImgMap)
                        imageMap.resizeImageMap()
                    }
                },
            }

            this.initialize = function () {
                if ($('#summernote-imagemap').length == 0) {
                    this.css = $('<style>').html([
                        '.note-editable map[name] { position: relative; }',
                        '.note-editable map[name]:after { content: "ImgMap"; position: absolute; writing-mode: vertical-lr; opacity: 0.7; }',

                        '.summernote-imagemap-dialog .modal-dialog { max-width: 95vw; max-height: calc(100vh - 3.5rem); }',
                        '.summernote-imagemap-dialog .modal-header { max-height: 5rem; }',
                        '.summernote-imagemap-dialog .modal-body { padding: 0; }',
                        '.summernote-imagemap-dialog .modal-body:after { content: ""; width: 100%; height: 0.5rem; display: block; background: #8080801d; border-top: 1px solid rgba(0,0,0,.125); }',

                        '.summernote-imagemap-toolbar { padding: 2px; max-height: 3rem; }',
                        '.summernote-imagemap-toolbar .summernote-imagemap-alert { position: absolute; z-index: 2; top: 100%; margin-top: 3px; left: 3px; right: 3px }',
                        '.summernote-imagemap-toolbar .note-toolbar-text { height: 2em; align-items: center; }',
                        '.summernote-imagemap-toolbar button:disabled { color: #6c757d; }',

                        '.summernote-imagemap-editor { display: flex; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr { display: flex; position: relative; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr .togglebtn { z-index: 1; width: 5px; margin-left: 15px; transition: margin-left .35s ease; background: #f8f9fa; border-left: 1px solid #DDD; border-right: 1px solid #DDD; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr .togglebtn.show { margin-left: 0px; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr .togglebtn button { position: relative; top: calc(50% - 35px); right: 15px; width: 35px; height: 35px; line-height: 1.8; border-radius: 50%; font-weight: 700; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr .togglebtn.show button.toggle-show { display: none; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr .togglebtn:not(.show) button.toggle-hide { display: none; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr-content { position: relative; height: 100%; min-width: 100px; width: 250px; padding: 1.5em; }',
                        '.summernote-imagemap-editor .summernote-imagemap-attr-content .summernote-imagemap-attr-btngroup button { margin-right: 5px; margin-bottom: 5px; text-align: center; }',

                        '.summernote-imagemap-editor .summernote-imagemap-imgeditor { flex: 1; display: flex; max-height: calc(100vh - 8rem); min-height: 300px; overflow: auto; }',
                        '.summernote-imagemap-editor .summernote-imagemap-container { position: relative; padding: 5px; margin: auto; }',

                        '.summernote-imagemap-svg { width: 100%; height:100%; position: absolute; top: 0; left: 0; bottom: 0; right: 0; }',
                        '.summernote-imagemap-svg g > * { fill: #8e8e8e; stroke: #2f2f2f; stroke-width: 2px; opacity: 0.7; }',
                        '.summernote-imagemap-svg g > :not(circle.resize-point) { cursor: move }',
                        '.summernote-imagemap-svg g > circle.resize-point { opacity: 0.9; }',
                        '.summernote-imagemap-svg g > circle.resize-point-lt,',
                        '.summernote-imagemap-svg g > circle.resize-point-rb { cursor: nwse-resize; }',
                        '.summernote-imagemap-svg g > circle.resize-point-lb,',
                        '.summernote-imagemap-svg g > circle.resize-point-rt { cursor: nesw-resize; }',
                        '.summernote-imagemap-svg g:active > :not(text) ,',
                        '.summernote-imagemap-svg g:has(.active) > :not(text) { fill: #2196f3; stroke: #1769aa; }',
                        '.summernote-imagemap-svg text { stroke-width: 0px; fill: black; }',
                    ].join(''))
                    this.css.attr('id', 'summernote-imagemap')
                    $(document.head).append(this.css)
                }
                var $container = options.dialogsInBody ? $(document.body) : $editor
                this.$dialog = ui.dialog({
                    title: `${lang.imageMap.editImageMap}`,
                    className: 'summernote-imagemap-dialog',
                    fade: options.dialogsFade,
                    body: [
                        '<div class="summernote-imagemap-toolbar note-toolbar card-header">',
                        '</div>',
                        '<div class="summernote-imagemap-editor">',
                        '</div>',
                    ].join(''),
                }).render().appendTo($container);
                this.$dialog.find('.modal-dialog').addClass('modal-xl')
            }
            this.destroy = function () {
                !!this.css && $(this.css).remove()
            };

            this.wrapCommand = function (fn) {
                return function () {
                    context.invoke("beforeCommand");
                    fn.apply(this, arguments);
                    context.invoke("afterCommand");
                }
            }

            context.memo('button.imageMap', function () {
                let imageMapIcon = `<svg width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="m928.73232,829.54628l-867.21297,0c-28.00285,0 -50.70397,-22.70112 -50.70397,-50.70397l0,-632.56134c0,-28.00285 22.70112,-50.70397 50.70397,-50.70397l867.21297,0c28.00285,0 50.70397,22.70112 50.70397,50.70397l0,632.56134c0,28.00285 -22.70112,50.70397 -50.70397,50.70397zm-6.23104,-620.65621c0,-62.36984 -51.04622,-56.46679 -114.0158,-56.46679l-627.08769,0c-62.96958,0 -114.0158,-5.90305 -114.0158,56.46679l0,451.71454c0,62.36905 51.04622,112.92962 114.0158,112.92962l627.08769,0c62.96958,0 114.0158,-50.56057 114.0158,-112.92962l0,-451.71454z" fill="#000" fill-rule="evenodd"></path>
                <path d="m767.1477,672.80969c35.35968,52.35423 9.58384,41.11379 -57.20992,41.11379l-455.7455,0c-66.8722,0 -98.45206,8.33288 -70.11646,-47.5215l109.87471,-217.32038c28.26113,-55.8734 81.72212,-59.58905 118.7891,-8.31783l108.26724,149.91263l30.24571,-59.66431c28.30232,-55.85438 80.39511,-58.74055 115.77618,-6.40771l100.11895,148.20533l-0.00001,-0.00002z"></path>
                <path fill="#ffffff" d="m761.01931,656.85011c-208.86903,-302.88165 -247.68157,-333.93169 -247.68157,-445.19433c0,-152.37521 123.62516,-276.00037 276.00036,-276.00037s276.00036,123.62516 276.00036,276.00037c0,111.26264 -38.81254,142.31268 -247.68157,445.19433c-13.65627,19.83753 -42.9813,19.83753 -56.78132,0l0.14375,0z"></path>
                <path fill="#000000" d="m766.04696,594.15151c-171.78709,-249.10902 -203.70899,-274.64654 -203.70899,-366.15598c0,-125.323 101.67715,-227.00015 227.00015,-227.00015s227.00015,101.67715 227.00015,227.00015c0,91.50944 -31.9219,117.04695 -203.70899,366.15598c-11.23178,16.31564 -35.35054,16.31564 -46.70055,0l0.11823,0zm23.29116,-271.57258c52.25733,0 94.5834,-42.32607 94.5834,-94.5834s-42.32607,-94.5834 -94.5834,-94.5834s-94.5834,42.32607 -94.5834,94.5834s42.32607,94.5834 94.5834,94.5834z"></path>
              </svg>`
                return ui.button({
                    className: 'summernote-image-display',
                    contents: `<i class="note-icon">${imageMapIcon}</i>`,
                    tooltip: lang.imageMap.imageMap,
                    click: function () {
                        self.showDialog().then(({ $img, $map }) => {
                            context.invoke('beforeCommand')
                            let rng = range.createFromNode($img[0])
                            context.invoke('editor.setLastRange', rng)
                            context.invoke('afterCommand')
                        })
                    }
                }).render()
            })

            this.showDialog = function () {
                return $.Deferred((deferred) => {
                    var $imgMapEditor = this.$dialog.find('.summernote-imagemap-editor')
                    var $imgMapToolbar = this.$dialog.find('.summernote-imagemap-toolbar')

                    const $targetImg = $editingArea.find('.note-handle .note-control-selection').data('target')
                    const mapId = $targetImg.attr('usemap')?.substring(1)
                    const $targetImgMap = $editingArea.find(`map[name="${mapId}"`)

                    var editImgMap = new EditImageMap(
                        mapId,
                        $targetImg,
                        $targetImgMap,
                        $imgMapEditor,
                        $imgMapToolbar,
                    )

                    ui.onDialogShown(this.$dialog, () => {
                        editImgMap.init()
                        context.triggerEvent('dialog.shown')

                    })

                    this.$dialog.one('hide.bs.modal', function () {
                        editImgMap.applyMap()
                        deferred.resolve({
                            $img: editImgMap.originImageMap.$img,
                            $map: editImgMap.originImageMap.$map,
                        })
                    })

                    // when close dialog remove button event and restore range
                    ui.onDialogHidden(this.$dialog, function () {
                        editImgMap.destroy()
                        if (deferred.state() === 'pending') {
                            deferred.reject();
                        }
                    });
                    ui.showDialog(this.$dialog)
                }).promise()
            }


            class ImageMap {
                constructor(id, $img, $map) {
                    this.id = id || this.randomId()
                    this.$img = $img
                    this.width = $img.width()
                    this.height = $img.height()
                    this.$map = $map
                }

                init() {
                    // this.$img.attr({ width: this.width, height: this.height })
                    this.$img.css({ width: `${this.width}px`, height: `${this.height}px` })

                    if (!this.$map.length) {
                        this.$map = $('<map>').attr('name', `${this.id}`)
                        this.$map.insertAfter(this.$img)
                        this.$img.attr('usemap', `#${this.id}`)
                        this.$map.attr('data-map-width', this.width)
                        this.$map.attr('data-map-height', this.height)
                    }

                    var mapWidth = this.$map.attrFloat('data-map-width')
                    var mapHeight = this.$map.attrFloat('data-map-height')
                    if (mapWidth !== this.width || mapHeight !== this.height) {
                        this.resizeImageMap()
                    }
                }

                /**
                 * Resize map coordinates by current map width and height
                 */
                resizeImageMap() {
                    var mapWidth = this.$map.attrFloat('data-map-width')
                    var mapHeight = this.$map.attrFloat('data-map-height')
                    this.$map.find('area').toArray().forEach((area) => {
                        let coords = $(area).attr('coords')
                        let coordsPercent = coords.split(',')
                            .map((value, index) => {
                                return index % 2 === 0 ? // y or x?
                                    (parseInt(value, 10) / mapWidth) * this.width
                                    : (parseInt(value, 10) / mapHeight) * this.height
                            })
                            .join(',')

                        $(area).attr('coords', coordsPercent)
                    })
                    this.$map.attr('data-map-width', this.width)
                    this.$map.attr('data-map-height', this.height)
                }

                /**
                 * Create random id (radix 36: a-z, 0-9)
                 * @returns {String} id
                 */
                randomId() {
                    return Date.now().toString(36) + Math.random().toString(36).substring(2)
                }

                /**
                 * Add area to map
                 * @param {'rect'|'circle'|'poly'} shape Current only implement rect
                 * @param {String} coords 
                 * @returns {JQuery} $area
                 */
                addArea(shape, coords) {
                    let defaultCoords = `${this.width / 2},${this.height / 2},${this.width / 2 + this.width / 3},${this.height / 2 + this.height / 3}`
                    let $area = $('<area>').attr({
                        'shape': shape,
                        'coords': coords || defaultCoords,
                    })
                    this.$map.append($area)

                    return $area
                }

                /**
                 * Get area coords by object
                 * @param {JQuery} $area 
                 * @param {'rect'|'circle'|'poly'} shape Current only implement rect
                 * @returns coordsObj
                 */
                getCoords($area, shape) {
                    let coordsArr = $area.attr('coords').split(',')
                        .map(v => parseInt(v, 10))
                    switch (shape) {
                        case 'rect':
                            return {
                                left: coordsArr[0],
                                top: coordsArr[1],
                                right: coordsArr[2],
                                bottom: coordsArr[3],
                            }
                        case 'circle':
                        case 'poly':
                    }
                }
            }

            class EditImageMap extends ImageMap {
                constructor(id, $img, $map, $editor, $toolbar) {
                    super(id, $img, $map)

                    this.$editor = $editor
                    this.$toolbar = $toolbar
                }

                init() {
                    super.init()
                    this.originImageMap = new ImageMap(this.id, this.$img, this.$map)

                    this.id = `${this.id}-edit` || this.randomId()

                    this.initAttrEditor()
                    this.initImgEditor()
                    this.initToolbar()

                    this.renderSvg()
                }

                /**
                 * Initial Toolbar
                 */
                initToolbar() {
                    let rectIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <rect stroke="#000000" fill="none" id="svg_1" height="8.68468" width="13.59878" y="5.60704" x="3.16221"/>
                    <ellipse stroke="#000000" ry="1.75858" rx="1.75858" id="svg_4" cy="5.64647" cx="3.25446" fill="#ffffff"/>
                    <ellipse stroke="#000000" ry="1.75858" rx="1.75858" id="svg_6" cy="5.64647" cx="16.78071" fill="#ffffff"/>
                    <ellipse stroke="#000000" ry="1.75858" rx="1.75858" id="svg_7" cy="14.35353" cx="3.21929" fill="#ffffff"/>
                    <ellipse stroke="#000000" ry="1.75858" rx="1.75858" id="svg_8" cy="14.35353" cx="16.78071" fill="#ffffff"/>
                    </svg>`

                    let $rectBtn = ui.button({
                        contents: `<i class="note-icon">${rectIcon}</i>`,
                        tooltip: lang.imageMap.rect,
                    }).render()
                        .appendTo(this.$toolbar)
                        .wrap('<div class="note-btn-group btn-group">')

                    this.$deletBtn = ui.button({
                        contents: `<i class="note-icon-trash">`,
                        tooltip: lang.imageMap.delete,
                    }).render()
                        .prop('disabled', true)
                        .appendTo(this.$toolbar)
                        .wrap('<div class="note-btn-group btn-group">')

                    $alert = $(`<div class="summernote-imagemap-alert alert alert-danger fade" role="alert">${lang.imageMap.tooManyArea}</div>`)
                    $alert.prependTo(this.$toolbar)
                    $alert.hide()

                    $rectBtn.on('click', () => {
                        if (this.$svg.find('g').length < maxArea) {
                            let $area = this.addArea('rect')
                            let $group = this.renderAreaSvg($area)
                            this.updateToolbar()
                            $group.trigger('mousedown')
                            this.updateAttrEditor($area)
                        }
                        else {
                            $alert.show().addClass('show')
                            setTimeout(() => {
                                $alert.hide().removeClass('show')
                            }, 5000)
                        }
                    })
                    this.$deletBtn.on('click', () => {
                        let $target = this.$activeElement
                        if (!$target) return
                        let $area = $target.data('area')
                        if (!$area) return
                        $area.remove()
                        $target.closest('g').remove()
                        this.$activeElement = undefined
                        this.updateAttrEditor()
                        this.updateToolbar()
                    })

                    this.$areaCount = $('<span>')
                        .appendTo(this.$toolbar)
                        .wrap('<div class="note-btn-group btn-group font-weight-bold ml-2 note-toolbar-text">')
                    this.updateToolbar()

                    let $hint = $('<small>').text(lang.imageMap.hint)
                        .addClass(['text-muted', 'font-italic'])
                        .prependTo(this.$toolbar)
                        .wrap('<div class="note-btn-group btn-group mr-3 note-toolbar-text float-right">')
                }

                /**
                 * Initial attribute editor
                 */
                initAttrEditor() {
                    let $attr = $('<div>')
                        .addClass(['summernote-imagemap-attr'])
                    this.$editor.append($attr)

                    let $attrCollapse = $('<div>')
                        .addClass(['collapse', 'width', 'show'])
                        .attr('id', `attr-collapse-${this.id}`)
                        .appendTo($attr)

                    let $attrContent = $('<div>')
                        .addClass('summernote-imagemap-attr-content')
                        .appendTo($attrCollapse)

                    this.$title = $('<input>')
                        .addClass(['summernote-imagemap-attr-title', 'form-control', 'form-control-sm'])
                        .appendTo($attrContent)
                        .wrap('<div class="form-group"></div>')
                        .before(`<label for="summernote-imagemap-title-${this.id}" class="note-form-label">${lang.imageMap.title}</label>`)

                    this.$alt = $('<input>')
                        .addClass(['summernote-imagemap-attr-alt', 'form-control', 'form-control-sm'])
                        .attr('id', `summernote-imagemap-alt-${this.id}`)
                        .appendTo($attrContent)
                        .wrap('<div class="form-group"></div>')
                        .before(`<label for="summernote-imagemap-alt-${this.id}" class="note-form-label">${lang.imageMap.alt}</label>`)

                    this.$href = $('<input>')
                        .addClass(['summernote-imagemap-attr-href', 'form-control', 'form-control-sm'])
                        .appendTo($attrContent)
                        .wrap('<div class="form-group"></div>')
                        .before(`<label for="summernote-imagemap-href-${this.id}" class="note-form-label">${lang.imageMap.href}</label>`)

                    var $modifyBtnGroup = $('<div>')
                        .addClass(['summernote-imagemap-attr-btngroup', 'text-center'])
                        .appendTo($attrContent)

                    this.$cancelBtn = $('<button>')
                        .text(lang.imageMap.cancel)
                        .addClass(['btn', 'btn-sm', 'btn-outline-primary'])
                        .attr({'type': 'button'})
                        .appendTo($modifyBtnGroup)
                    this.$cancelBtn.on('click', (event) => {
                        let $target = this.$activeElement
                        let $area = $target.data('area')
                        this.updateAttrEditor($area)
                    })

                    this.$saveBtn = $('<button>')
                        .text(lang.imageMap.save)
                        .addClass(['btn', 'btn-sm', 'btn-primary'])
                        .attr({'type': 'button'})
                        .appendTo($modifyBtnGroup)
                    this.$saveBtn.on('click', (event) => {
                        let $target = this.$activeElement
                        if (!$target) return
                        let $area = $target.data('area')
                        if (!$area) return

                        // update area attribute
                        $area.attr({
                            'title': this.$title.val(),
                            'alt': this.$alt.val(),
                            'href': this.$href.val(),
                        })

                        // update active svg element title
                        this.$activeElement.siblings('text').text(this.$title.val())
                    })

                    var $toggle = $('<div>').addClass(['note-btn-group', 'togglebtn', 'show'])
                        .appendTo($attr)
                        .append(
                            ui.button({
                                className: "toggle-hide",
                                contents: "<",
                                tooltip: lang.imageMap.hide,
                                data: {
                                    toggle: "collapse",
                                    target: `#attr-collapse-${this.id}`,
                                }
                            }).render()
                        )
                        .append(
                            ui.button({
                                className: "toggle-show",
                                contents: ">",
                                tooltip: lang.imageMap.collapse,
                                data: {
                                    toggle: "collapse",
                                    target: `#attr-collapse-${this.id}`,
                                }
                            }).render()
                        )

                    $attrCollapse.on('hide.bs.collapse', function () {
                        $toggle.removeClass('show')
                    })

                    $attrCollapse.on('show.bs.collapse', function () {
                        $toggle.addClass('show')
                    })

                    this.updateAttrEditor()
                }

                /**
                 * Initial Image Editor
                 * 
                 * on 'mousedown' svg -> clear active element and update attribute editor
                 */
                initImgEditor() {
                    var $imgeditor = $('<div>').addClass('summernote-imagemap-imgeditor')
                    this.$editor.append($imgeditor)
                    var $container = $('<div>').addClass('summernote-imagemap-container')
                    $imgeditor.append($container)

                    this.$img = this.$img.clone()
                        .addClass('summernote-imagemap-img')
                        .attr('usemap', `#${this.id}`)
                        .appendTo($container)

                    this.$map = this.$map.clone()
                        .addClass('summernote-imagemap-map')
                        .attr('name', `${this.id}`)
                        .appendTo($container)

                    this.$svg = this.createSvgElement('svg')
                        .attr({
                            height: this.height,
                            width: this.width,
                            "viewBox": `0 0 ${this.width} ${this.height}`,
                        }).addClass('summernote-imagemap-svg')
                        .appendTo($container)

                    this.$svg.on('mousedown', (event) => {
                        if (this.$activeElement) {
                            this.$activeElement.removeClass('active')
                            this.$activeElement = undefined
                        }
                        this.updateAttrEditor()
                        this.updateToolbar()
                    })

                }

                /**
                 * Update toolbar content
                 */
                updateToolbar() {
                    this.$areaCount.text(`${lang.imageMap.currentArea}: ${this.$map.find('area').length}/${maxArea}`)

                    if (this.$activeElement) {
                        this.$deletBtn.prop('disabled', false)
                    }
                    else {
                        this.$deletBtn.prop('disabled', true)
                    }
                }

                /**
                 * Update attribute edtior inputs
                 * @param {JQuery} $area 
                 */
                updateAttrEditor($area) {
                    if (!!$area && $area.length) {
                        this.$title
                            .val($area.attr('title') || "")
                            .prop('disabled', false)
                        this.$alt
                            .val($area.attr('alt') || "")
                            .prop('disabled', false)
                        this.$href
                            .val($area.attr('href') || "")
                            .prop('disabled', false)
                        this.$cancelBtn.prop('disabled', false)
                        this.$saveBtn.prop('disabled', false)
                    }
                    else {
                        this.$title.val("").prop('disabled', true)
                        this.$alt.val("").prop('disabled', true)
                        this.$href.val("").prop('disabled', true)
                        this.$cancelBtn.prop('disabled', true)
                        this.$saveBtn.prop('disabled', true)
                    }
                }

                /**
                 * Apply editor map to real map
                 */
                applyMap() {
                    if (this.$map.find('area').length) {
                        let $map = this.$map.clone().attr('name', `${this.originImageMap.id}`)
                        this.originImageMap.$map.replaceWith($map)
                    }
                    else {
                        this.originImageMap.$map.remove()
                    }
                }

                /**
                 * destroy editor content
                 */
                destroy() {
                    this.$toolbar.empty()
                    this.$editor.empty()
                }

                /**
                 * Render svg elements by map areas
                 */
                renderSvg() {
                    this.$map.find('area').toArray().forEach((area) => {
                        this.renderAreaSvg($(area))
                    })
                }

                /**
                 * render single svg element with a map area
                 * @param {JQuery} $area 
                 * @returns {JQuery} $group
                 * 
                 * on 'mousedown' $group -> bring element to front, update active element, update attr editor
                 */
                renderAreaSvg($area) {
                    var $group = this.createSvgElement('g')
                    let shape = $area.attr('shape')
                    const coords = this.getCoords($area, shape)
                    let $element
                    switch (shape) {
                        case 'rect':
                            $element = new EditSvgRect($area, coords, $group, this.$svg)
                            break;
                    }

                    $group.on('mousedown', (event) => {
                        event.stopPropagation()

                        // remove old element active class
                        if (this.$activeElement) {
                            this.$activeElement.removeClass('active')
                        }

                        // add active class and record element to this.$activeElement
                        $element.addClass('active')
                        this.$activeElement = $element
                        // update AttrEditor Inputs and Toolbar
                        this.updateAttrEditor($area)
                        this.updateToolbar()

                        // bring to front
                        if (!$group.is(':last-child')) {
                            $group.parent().append($group)
                        }
                    })

                    this.$svg.append($group)
                    return $group
                }

                // svg is xml format
                createSvgElement(tag) {
                    var element = document.createElementNS('http://www.w3.org/2000/svg', tag)
                    return $(element)
                }
            }

            class EditSvgElement {
                constructor($area, coords, $group, $svg) {
                    this.$svg = $svg
                    this.$area = $area
                    this.$group = $group
                    this.$element = this.makeSvg(coords)

                    return this.$element
                }

                /**
                 * Implement all types Area in svg element
                 * @param {JQuery} $area 
                 * @param {JQuery} $group 
                 * @param {Object} coords 
                 */
                makeSvg($area, $group, coords) { }


                // svg is xml format
                createSvgElement(tag) {
                    var element = document.createElementNS('http://www.w3.org/2000/svg', tag)
                    return $(element)
                }

                /**
                 * create move event on target
                 * @param {JQuery} $target 
                 * @param {(event: Event, $target: JQuery, pos: {x, y}) => void} moveCallback trigger callback when move
                 * @param {(event: Event, $target: JQuery) => void} endCallback trigger callback when move end
                 */
                moveEvent($target, moveCallback, endCallback) {
                    $target.on('mousedown', (event) => {
                        event.preventDefault()

                        $target.addClass('move-active')

                        var svg = this.$svg[0]
                        let domPoint = new DOMPointReadOnly(event.clientX, event.clientY)
                        let pStart = domPoint.matrixTransform(svg.getScreenCTM().inverse())
                        let x = $target.attrFloat('x') || $target.attrFloat('cx')
                        let y = $target.attrFloat('y') || $target.attrFloat('cy')
                        const pOffset = {
                            x: pStart.x - x,
                            y: pStart.y - y,
                        }

                        const onMouseMove = (event) => {
                            let domPoint = new DOMPointReadOnly(event.clientX, event.clientY)
                            let pEnd = domPoint.matrixTransform(svg.getScreenCTM().inverse())
                            let pos = {
                                x: pEnd.x - pOffset.x,
                                y: pEnd.y - pOffset.y,
                            }

                            if (typeof moveCallback === 'function') {
                                moveCallback(event, $target, pos)
                            }
                        }

                        this.$svg.on('mousemove', onMouseMove)
                            .one('mouseup', (event) => {
                                event.preventDefault()
                                $target.removeClass('move-active')
                                this.$svg.off('mousemove', onMouseMove)

                                if (typeof endCallback === 'function') {
                                    endCallback(event, $target)
                                }
                            })
                    })
                }
            }

            class EditSvgRect extends EditSvgElement {
                constructor($area, coords, $group, $svg) {
                    super($area, coords, $group, $svg)
                }

                /**
                 * Get rect position
                 * @returns {JQuery} $rect
                 * @returns {{left, top, right, bottom}}
                 */
                getRectPosition($rect) {
                    return {
                        left: $rect.attrFloat('x'),
                        top: $rect.attrFloat('y'),
                        right: $rect.attrFloat('x') + $rect.attrFloat('width'),
                        bottom: $rect.attrFloat('y') + $rect.attrFloat('height'),
                    }
                }

                /**
                 * Get rect 4 corners
                 * @returns {JQuery} $rect
                 * @returns {{lt, lb, rt, rb}}
                 */
                getRectCorners($rect) {
                    const rectPos = this.getRectPosition($rect)
                    return {
                        'lt': { x: rectPos.left, y: rectPos.top },
                        'lb': { x: rectPos.left, y: rectPos.bottom },
                        'rt': { x: rectPos.right, y: rectPos.top },
                        'rb': { x: rectPos.right, y: rectPos.bottom },
                    }
                }

                /**
                 * Create rect svg associated with area
                 * @param {{left, top, right, bottom}} coords 
                 * @returns {JQuery} $rect
                 * 
                 * $rect on 'mousemove' -> move rect and update points
                 */
                makeSvg(coords) {
                    this.$rect = this.createSvgElement('rect')
                        .attrFloat({
                            x: coords.left, y: coords.top,
                            width: coords.right - coords.left,
                            height: coords.bottom - coords.top,
                        })
                        .data('area', this.$area)
                        .appendTo(this.$group)

                    this.$title = this.createSvgElement('text')
                        .text(this.$area.attr('title'))
                        .attr({
                            "text-anchor": "start",
                            "font-size": "1em",
                            dy: "1em",
                        })
                        .appendTo(this.$group)
                    this.updateTitlePosition()

                    this.makeRectPoints(this.$rect)

                    moveCallback = (event, $target, newPos) => {
                        this.moveRect(newPos)
                    }

                    // nmove on rect
                    this.moveEvent(
                        this.$rect,
                        moveCallback,
                        (event, $target) => {
                            this.syncArea(this.$rect)
                        }
                    )

                    // move on title
                    this.moveEvent(
                        this.$title,
                        moveCallback,
                        (event, $target) => {
                            this.syncArea(this.$rect)
                        }
                    )

                    return this.$rect
                }

                /**
                 * update title position
                 */
                updateTitlePosition() {
                    const pos = this.getRectPosition(this.$rect)
                    this.$title.attrFloat({
                        x: pos.left + 5,
                        y: pos.top + 5,
                    })
                }

                /**
                 * move rect to new position
                 * @param {{x,y}} newPos end pos after move
                 */
                moveRect(newPos) {
                    const { x, y } = newPos
                    this.$rect.attrFloat({ x, y })
                    this.updateRectPoints(this.$rect)
                    this.updateTitlePosition()
                }

                /**
                 * Update points with current rect position
                 */
                updateRectPoints() {
                    const corners = this.getRectCorners(this.$rect)
                    Object.keys(corners).forEach((key, index) => {
                        let { x, y } = corners[key]
                        let $point = this.points[index]
                        $point.attrFloat({ cx: x, cy: y }).attr('class', `resize-point resize-point-${key} resize-point-${key[0]} resize-point-${key[1]}`)
                    })
                }

                /**
                 * Sync svg <rect> and map <area>
                 */
                syncArea() {
                    const pos = this.getRectPosition(this.$rect)
                    let { left, top, right, bottom } = pos
                    this.$area.attr('coords', `${left},${top},${right},${bottom}`)
                }

                /**
                 * Create rect point on 4 corner
                 * 
                 * points on 'mousemove' -> resize rect and update points
                 */
                makeRectPoints() {
                    const corners = this.getRectCorners(this.$rect)

                    this.points = []
                    // create points
                    Object.keys(corners).forEach((key) => {
                        let { x, y } = corners[key]
                        let $point = this.createSvgElement('circle')
                            .attrFloat({ cx: x, cy: y, r: 5 })
                            .addClass(['resize-point', `resize-point-${key}`, `resize-point-${key[0]}`, `resize-point-${key[1]}`])
                            .insertAfter(this.$rect)
                        this.points.push($point)
                    })

                    moveCallback = (event, $point, newPos) => {
                        this.resizeRect($point, newPos)
                        this.updateTitlePosition()
                    }

                    // points event onmove resize rect
                    this.points.forEach(($point, index) => {
                        this.moveEvent(
                            $point,
                            moveCallback,
                            (event, $target) => {
                                this.syncArea(this.$rect)
                            }
                        )
                    })
                }

                /**
                 * Resize rect by moving points
                 * @param {JQuery} $point moving point
                 * @param {{x,y}} newPos end pos after move
                 */
                resizeRect($point, newPos) {
                    var { left, top, right, bottom } = this.getRectPosition(this.$rect)

                    var activeCorner = ''
                    if ($point.hasClass('resize-point-l')) {    // left
                        if (newPos.x > right) {
                            activeCorner += 'r'
                            // reverse x
                            left = right
                            right = newPos.x
                        }
                        else {
                            activeCorner += 'l'
                            left = newPos.x
                        }
                    }
                    else if ($point.hasClass('resize-point-r')) {   // right
                        if (newPos.x < left) {
                            activeCorner += 'l'
                            // reverse x
                            right = left
                            left = newPos.x
                        }
                        else {
                            activeCorner += 'r'
                            right = newPos.x
                        }
                    }

                    if ($point.hasClass('resize-point-t')) {// top
                        if (newPos.y > bottom) {
                            activeCorner += 'b'
                            // reverse y
                            top = bottom
                            bottom = newPos.y
                        }
                        else {
                            activeCorner += 't'
                            top = newPos.y
                        }
                    }
                    else if ($point.hasClass('resize-point-b')) {  // bottom
                        if (newPos.y < top) {
                            activeCorner += 't'
                            // reverse y
                            bottom = top
                            top = newPos.y
                        }
                        else {
                            activeCorner += 'b'
                            bottom = newPos.y
                        }
                    }

                    this.$rect.attrFloat({
                        x: left,
                        y: top,
                        width: right - left,
                        height: bottom - top,
                    })

                    const corners = this.getRectCorners(this.$rect)

                    // update active point pos and class
                    $point.attrFloat({ cx: newPos.x, cy: newPos.y })
                        .attr('class', `resize-point resize-point-${activeCorner} resize-point-${activeCorner[0]} resize-point-${activeCorner[1]} move-active`)

                    let filterPoints = this.points.filter(($p) => !$p.hasClass('move-active'))

                    // update other points pos and class
                    Object.keys(corners).filter((key) => key !== activeCorner)
                        .forEach((key, index) => {
                            let { x, y } = corners[key]
                            let $p = filterPoints[index]
                            $p.attrFloat({ cx: x, cy: y })
                                .attr('class', `resize-point resize-point-${key} resize-point-${key[0]} resize-point-${key[1]}`)
                        })
                }
            }
        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            imageMap: {
                imageMap: '影像地圖',
                editImageMap: '插入影像地圖',
                rect: '矩形',
                delete: '刪除',
                cancel: '取消',
                save: '儲存',
                tooManyArea: '區域已達數量上限',
                hide: '收合',
                collapse: '展開',
                currentArea: '當前區域數',
                title: '提示文字 (title)',
                alt: '備註 (alt)',
                href: '超連結 (href)',
                hint: '關閉對話框後自動套用當前修改',
            }
        },
        'en-US': {
            imageMap: {
                imageMap: 'imageMap',
                editImageMap: 'edit image map',
                rect: 'Rect',
                delete: 'Delete',
                cancel: 'Cancel',
                save: 'Save',
                tooManyArea: 'Too many area',
                hide: 'hide',
                collapse: 'Collapse',
                currentArea: 'Current Area',
                title: 'title',
                alt: 'alt',
                href: 'href',
                hint: 'Close dialog will automatically apply current changes',
            }
        },
    });
}));