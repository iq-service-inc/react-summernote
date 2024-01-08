/**
 * copy formatting from a selection and apply it to another selection
 * 
 * Process:
 * 1. Select a range which you want to copy formats
 * 2. Click copy formatting button, the button will be active and cursor will be changed
 * 3. Listen to mouseup event, wait for mouse selection
 * 4. When mouseup, call function applyFormatting. When ESC keydown, cancel
 * 5. Clear selection formats. Styled nodes will remove directly, Preseved nodes will remove attributes and styles, other nodes will remove all attributes include styles
 * 6. Apply formats by record formats. Record formats type roughly divided into 4 types: Text, Table and List, Anchor
 * 
 * Record formats structure:
 * {
 *  'TABLE': {
 *      node: tableNode,
 *      nodeName: 'TABLE',
 *      attributes: {...},
 *      styles: {...},
 *      childFormat: {
 *        'TD': [
 *          [ { node: tdNode, nodeName: 'TD', attributes: {...}, styles: {...}, ancestor: trNode, }, ... ],
 *           ...,
 *        ],
 *       'COL': [
 *         [ { node: colNode, nodeName: 'COL', attributes: {...}, styles: {...}, ancestor: colgroupNode, }, ... ],
 *          ...,
 *        ],
 *      }
 *   },
 *  'LIST': {
 *      node: listNode,
 *      nodeName: 'UL',
 *      attributes: {...},
 *      styles: {...},
 *  },
 *  'PUREPARA': {
 *      node: paraNode,
 *      nodeName: 'P',
 *      attributes: {...},
 *      styles: {...},
 *  },
 *  'P': {
 *      node: paraNode,
 *      nodeName: 'P',
 *      attributes: {...},
 *      styles: {...},
 *  },
 *  'SPAN': {
 *      node: spanNode,
 *      nodeName: 'SPAN',
 *      attributes: {...},
 *      styles: {...},
 *      wrapBy: [
 *         { node: styledNode, nodeName: 'B', attributes: {...}, styles: {...}, },
 *          ...,
 *      ],
 *  },
 *  'A': {
 *      node: spanNode,
 *      nodeName: 'A',
 *      attributes: {...},
 *      styles: {...},
 *      wrapBy: [
 *         { node: styledNode, nodeName: 'SPAN', attributes: {...}, styles: {...}, },
 *         { node: styledNode, nodeName: 'B', attributes: {...}, styles: {...}, },
 *          ...,
 *      ],
 *  },
 * }
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
        'copyFormatting': function (context) {
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

            this.applyState = false
            this.recordFormats = []

            const blockTags = ['ADDRESS', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'PRE', 'SECTION', 'HEADER', 'FOOTER', 'NAV', 'ARTICLE', 'ASIDE', 'FIGURE', 'DIALOG', 'HGROUP', 'TIME', 'METER', 'MENU', 'COMMAND', 'KEYGEN', 'OUTPUT', 'PROGRESS', 'DETAILS', 'DATAGRID', 'DATALIST']
            dom.isTextBlock = function (node) { return blockTags.includes(node.nodeName) }
            dom.isNotVoid = function (node) { return !dom.isVoid(node) }
            dom.isCloseRelative = function (nodeA, nodeB) { return $(nodeA).find(nodeB).length || $(nodeA).closest(nodeB).length }
            dom.isTR = dom.makePredByNodeName('TR')
            dom.isCol = dom.makePredByNodeName('COL')
            dom.isColgroup = dom.makePredByNodeName('COLGROUP')

            const formatExcludedAttributes = ['id', 'class', 'src', 'href', 'target', 'style', 'value', 'type', 'disabled']
            const styledTags = ['ACRONYM', 'B', 'BDO', 'BIG', 'CITE', 'CODE', 'DFN', 'EM', 'FONT', 'I', 'INS', 'KBD', 'NOBR', 'Q', 'S', 'SAMP', 'SMALL', 'STRIKE', 'STRONG', 'SUB', 'SUP', 'TT', 'U', 'VAR']
            const preservedListTags = ['UL', 'OL', 'LI']
            const preservedTableTags = ['TD', 'TH', 'TR', 'THEAD', 'TBODY', 'TABLE', 'COLGROUP', 'COL']

            const copyFormattingIcon = [
                '<svg width="16" height="16" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">',
                '<path d="m48,520c37,-11 158,-202 183,-231l282,90c2,50 -54,230 -90,243c-36,14 -412,-90 -375,-102zm422,-526c-17,-4 -28,3 -33,17l-87,191l-114,-35c-13,-4 -25,7 -23,20l22,83l293,93l64,-59c9,-10 5,-25 -7,-30l-108,-33l80,-189c4,-14 6,-24 -8,-29l-79,-30zm-342,525c-21,4 226,67 250,58c24,-9 60,-100 67,-114c7,-14 -55,-7 -116,19c-61,26 -180,33 -201,37l0,0"></path>',
                '</svg>',
            ].join('')
            const copyFormattingCursorIcon = [
                '<svg width="20" height="16" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">',
                '<path d="m19,23.43l0,48.49l58.23,0l0,361.06l-58.23,0l0,48.55l208.67,0l0,-48.55l-58.23,0l0,-361.06l58.23,0l0,-48.49l-208.67,0z" stroke="#ffffff" stroke-width="25"/>',
                '<path d="m207.7,410.74c27.87,-8.29 119.02,-152.16 137.85,-174.01l212.43,67.8c1.51,37.66 -40.68,173.26 -67.79,183.05c-27.12,10.55 -310.36,-67.8 -282.49,-76.84l0,0zm317.89,-396.23c-12.8,-3.01 -21.08,2.26 -24.85,12.81l-65.54,143.87l-85.88,-26.37c-9.8,-3.01 -18.83,5.28 -17.32,15.07l16.58,62.52l220.71,70.06l48.22,-44.45c6.78,-7.53 3.77,-18.83 -5.28,-22.6l-81.36,-24.85l60.26,-142.37c3.01,-10.55 4.52,-18.09 -6.03,-21.84l-59.51,-22.6l0,0.76l0,0l0,-0.01l-0.01,-0.02l0.01,0.02z" stroke="#ffffff" stroke-width="25"/>',
                '<path d="m270.49,399.85c-6,-9.4 66.9,-14.26 122.95,-24.3c56.05,-10.04 134.45,-51.51 124.41,-26.24c-10.04,25.27 -23.16,93.96 -60.26,97.19c-37.1,3.24 -181.1,-37.25 -187.1,-46.65z" fill="#ffffff" stroke="#ffffff"/>',
                '</svg>',
            ].join('')

            this.initialize = function () {
                if ($('#summernote-copyFormatting').length == 0) {
                    this.css = $('<style>').html([
                        '.copyformatting-cursor,',
                        '.copyformatting-cursor * {cursor: url("data:image/svg+xml;base64,',
                        window.btoa(copyFormattingCursorIcon),
                        '"), auto !important; }',
                    ].join(''))
                    this.css.attr('id', 'summernote-copyFormatting')
                    $(document.head).append(this.css)
                }
            }

            this.destroy = function () {
                !!this.css && $(this.css).remove()
            }

            this.events = {
                'summernote.init': (_, layoutInfo) => {
                    layoutInfo.editable.on('mousedown', (event) => {
                        // detach jtable block
                        if (event.which === 1 && this.applyState) {
                            if ('jTable' in modules) {
                                this.$tableBlock = layoutInfo.editingArea.find('.jtable-block').detach()
                            }
                        }
                    })
                    layoutInfo.editable.on('mouseup', (event) => {
                        // mouse left button && apply state is true -> apply
                        if (event.which === 1 && this.applyState) {
                            this.applyFormatting()
                            // recover jtable block
                            if ('jTable' in modules) {
                                this.$tableBlock.appendTo(layoutInfo.editingArea)
                                this.$tableBlock = null
                                context.invoke('jTable.resetTableBlock')
                            }
                        }
                    })
                    layoutInfo.editable.on('keydown', (event) => {
                        // ESC button && apply state is true -> cancel
                        if (event.key == "Escape" && this.applyState) {
                            this.clearRecord()
                        }
                    })
                },
                'summernote.change summernote.disable summernote.dialog.shown summernote.blur': () => {
                    // blur or change -> cancel
                    if (this.applyState) {
                        this.clearRecord()
                    }
                },
            }

            context.memo('button.copyFormatting', function () {
                return ui.button({
                    className: 'btn-copyFormatting',
                    contents: copyFormattingIcon,
                    tooltip: lang.copyFormatting.copyFormatting,
                    click: function (event) {
                        context.invoke('copyFormatting.copyFormatting')
                    },
                }).render();
            })
            this.copyFormatting = function () {
                this.clearRecord()
                if (this.applyState) return
                // range is not collapsed -> extract formatting
                let rng = range.create()
                if (!rng.isCollapsed()) {
                    this.recordFormats = this.extractFormatting(rng)
                    // only if styles is record -> wait for apply
                    if (this.recordFormats) {
                        this.applyState = true
                    }
                    // update toolbar button and cursor icon
                    let copyFormattingBtn = $toolbar.find('.btn-copyFormatting')
                    ui.toggleBtnActive(copyFormattingBtn, this.applyState)
                    $editable.toggleClass('copyformatting-cursor', this.applyState)
                }
            }

            /**
             * extract range nodes format
             */
            this.extractFormatting = function (rng) {
                let formats = {}

                rng = context.invoke('customCleaner.expandEdgePoint', rng.splitText())
                rng.collapse().select()

                let nodes = rng.nodes(dom.isNotVoid, { includeAncestor: true })
                // Extract range nodes formats
                for (let node of nodes) {
                    // 1. Table node
                    if (dom.isTable(node)) {
                        let childFormat = {}
                        // preserve childFormat
                        if (('TABLE' in formats) && formats['TABLE'].node === node) {
                            childFormat = formats['TABLE'].childFormat
                        }
                        let format = {
                            ...this.getNodeFormat(node),
                            childFormat,
                        }
                        formats['TABLE'] = format
                    }
                    // 2. other preserved Table nodes
                    else if (preservedTableTags.includes(node.nodeName)) {
                        let ancestor = dom.ancestor(node, dom.isTable)
                        // init table format
                        if (!('TABLE' in formats) || formats['TABLE'].node !== ancestor) {
                            formats['TABLE'] = {
                                ...this.getNodeFormat(ancestor),
                                childFormat: {}
                            }
                        }
                        let childFormat = formats['TABLE'].childFormat
                        let format = this.getNodeFormat(node)
                        // init node in child fromat
                        if (!childFormat[format.nodeName]) {
                            childFormat[format.nodeName] = []
                        }

                        // Cell node formats
                        if (dom.isCell(format.node)) {
                            // find record formats which ancestor is same as current Cell's ancestor TR
                            let ancestor = dom.ancestor(format.node, dom.isTR)
                            format.ancestor = ancestor
                            let recordFormats = childFormat[format.nodeName].find((cellFormats) => cellFormats[0].ancestor === ancestor)
                            if (recordFormats) recordFormats.push(format)
                            else childFormat[format.nodeName].push([format])
                        }
                        // COL node formats
                        else if (dom.isCol(format.node)) {
                            // find record formats which ancestor is same as current COL's ancestor COLGROUP
                            let ancestor = dom.ancestor(format.node, dom.isColgroup)
                            format.ancestor = ancestor
                            let recordFormats = childFormat[format.nodeName].find((colFormats) => colFormats[0].ancestor === ancestor)
                            if (recordFormats) recordFormats.push(format)
                            else childFormat[format.nodeName].push([format])
                        }
                        else {
                            childFormat[format.nodeName].push([format])
                        }
                    }
                    // 3. List node
                    else if (dom.isList(node)) {
                        let format = this.getNodeFormat(node)
                        formats['LIST'] = format
                    }
                    // 4. Li node
                    else if (dom.isLi(node)) {
                        let format = this.getNodeFormat(node, true)
                        if (!format) continue
                        formats[node.nodeName] = format
                    }
                    // 5. Anchor node
                    else if (dom.isAnchor(node)) {
                        let wrapBy = []
                        // preserve wrapBy
                        if (('A' in formats) &&
                            (formats['A'].node === node ||
                                formats['A'].wrapBy.find((wrapper) => dom.isCloseRelative(node, wrapper.node)))
                        ) {
                            wrapBy = formats['A'].wrapBy
                        }
                        let format = {
                            ...this.getNodeFormat(node),
                            wrapBy,
                        }
                        formats[node.nodeName] = format
                    }
                    // 6. styled tags, span inside Anchor node
                    else if ((styledTags.includes(node.nodeName) || dom.isSpan(node)) && dom.ancestor(node, dom.isAnchor)) {
                        let format = this.getNodeFormat(node, dom.isSpan(node))
                        if (!format) continue
                        // if Anchor format node is this styled node's ancestor
                        // or Anchor format wrapBy include this styled node's ancestor or child
                        // push this styled node to wrapBy
                        if (('A' in formats)
                            &&
                            (dom.ancestor(node, (el) => formats['A'].node === el) ||
                                formats['A'].wrapBy.find((wrapper) => dom.isCloseRelative(node, wrapper.node)))
                        ) {
                            formats['A'].wrapBy = formats['A'].wrapBy.filter((wrapper) => wrapper.nodeName !== node.nodeName)
                            formats['A'].wrapBy.push(format)
                        }
                        // otherwise override Anchor format
                        else {
                            // if this styled node has Anchor ancestor use it
                            let anchorEl = dom.ancestor(node, dom.isAnchor)
                            if (anchorEl) {
                                formats['A'] = {
                                    ...this.getNodeFormat(anchorEl),
                                    wrapBy: [format],
                                }
                            }
                            // otherwise create pseudo Anchor
                            else {
                                formats['A'] = {
                                    node: document.createElement('A'),
                                    nodeName: 'A',
                                    attributes: {},
                                    styles: {},
                                    wrapBy: [format],
                                }
                            }
                        }
                    }
                    // 7. record styled tags format in Span format
                    else if (styledTags.includes(node.nodeName)) {
                        let format = this.getNodeFormat(node)
                        // if Span format node is this styled node's ancestor
                        // or Span format wrapBy include this styled node's ancestor or child
                        // push this styled node to wrapBy
                        if (('SPAN' in formats)
                            &&
                            (dom.ancestor(node, (el) => formats['SPAN'].node === el) ||
                                formats['SPAN'].wrapBy.find((wrapper) => dom.isCloseRelative(node, wrapper.node)))
                        ) {
                            formats['SPAN'].wrapBy = formats['SPAN'].wrapBy.filter((wrapper) => wrapper.nodeName !== node.nodeName)
                            formats['SPAN'].wrapBy.push(format)
                        }
                        // otherwise override Span format
                        else {
                            // if this styled node has Span ancestor use it
                            let spanEl = dom.ancestor(node, dom.isSpan)
                            if (spanEl) {
                                formats['SPAN'] = {
                                    ...this.getNodeFormat(spanEl),
                                    wrapBy: [format],
                                }
                            }
                            // otherwise create pseudo Span
                            else {
                                formats['SPAN'] = {
                                    node: document.createElement('SPAN'),
                                    nodeName: 'SPAN',
                                    attributes: {},
                                    styles: {},
                                    wrapBy: [format],
                                }
                            }
                        }
                    }
                    // 8. Span node
                    else if (dom.isSpan(node)) {
                        let wrapBy = []
                        // preserve wrapBy
                        if (('SPAN' in formats) &&
                            (formats['SPAN'].node === node ||
                                formats['SPAN'].wrapBy.find((wrapper) => dom.isCloseRelative(node, wrapper.node)))
                        ) {
                            wrapBy = formats['SPAN'].wrapBy
                        }
                        let format = {
                            ...this.getNodeFormat(node),
                            wrapBy,
                        }
                        formats[node.nodeName] = format
                    }
                    // 9. Paragraph format
                    else if (dom.isPurePara(node)) {
                        let format = this.getNodeFormat(node, true)
                        if (!format) continue
                        formats[node.nodeName] = format
                        // record PurePara format
                        formats['PUREPARA'] = format
                    }
                    // 10. other nodes
                    else if (dom.isElement(node)) {
                        let format = this.getNodeFormat(node, true)
                        if (!format) continue
                        formats[node.nodeName] = format
                    }
                }

                // table childFormat clear empty formats
                if ('TABLE' in formats) {
                    let childFormat = formats['TABLE'].childFormat
                    // clear empty childFormat
                    Object.keys(childFormat).forEach((nodeName) => {
                        let formatCount = childFormat[nodeName].flat(1).filter((format) => Object.keys(format.attributes).length || Object.keys(format.styles).length).length
                        if (!formatCount) delete childFormat[nodeName]
                    })
                }

                if (Object.keys(formats).length) return formats
                else return null
            }

            /**
             * 1. Clear range nodes format
             * 2. Record node and which format it will apply
             * 3. Apply format to target node
             */
            this.applyFormatting = function () {
                let rng = range.create()
                // range is collapsed -> cancel
                if (rng.isCollapsed()) {
                    this.clearRecord()
                    return
                }

                context.invoke('beforeCommand')
                rng = context.invoke('customCleaner.expandEdgePoint', rng.splitText())
                let nodes = rng.nodes(dom.isNotVoid, { fullyContains: true })

                // Clear range nodes formats
                for (const node of nodes) {
                    // check if node still exist
                    if (!$editable.find(node).length) continue
                    let $node = $(node)

                    // clear by record formats
                    // 1. Table node
                    if (dom.isTable(node)) {
                        if (!('TABLE' in this.recordFormats)) continue
                        let format = this.recordFormats['TABLE']
                        this.clearNodeByFormat($node, format)
                    }
                    // 2. preserved Table nodes
                    else if (preservedTableTags.includes(node.nodeName)) {
                        if (!('TABLE' in this.recordFormats)) continue
                        let tableFormat = this.recordFormats['TABLE']
                        if (!(node.nodeName in tableFormat.childFormat)) continue
                        let childFormat = tableFormat.childFormat[node.nodeName]
                        childFormat.flat(1).forEach((format) => {
                            this.clearNodeByFormat($node, format)
                        })
                    }
                    // 3. List nodes
                    else if (dom.isList(node)) {
                        let format = this.recordFormats['LIST']
                        this.clearNodeByFormat($node, format)
                    }
                    // 4. Li node
                    else if (dom.isLi(node)) {
                        let format = this.recordFormats[node.nodeName]
                        this.clearNodeByFormat($node, format)
                    }
                    // 5. Anchor node
                    else if (dom.isAnchor(node)) {
                        Object.values(node.attributes)
                            .forEach((attr) => {
                                if (!formatExcludedAttributes.includes(attr.name)) $node.removeAttr(attr.name)
                            })
                        // keep text only
                        $node.html(node.textContent)
                    }
                    // 6. other nodes -> clear all attributes include styles
                    else if (dom.isElement(node)) {
                        Object.values(node.attributes)
                            .forEach((attr) => {
                                if (!formatExcludedAttributes.includes(attr.name)) $node.removeAttr(attr.name)
                            })

                        // if styled node or node has empty attributes -> remove node
                        if (styledTags.includes(node.nodeName) ||
                            (!node.hasAttributes() && dom.isTextBlock(node.parentNode) && !dom.isEditable(node.parentNode))
                        ) {
                            if (node.hasChildNodes()) $node.contents().unwrap()
                            else $node.remove()
                        }
                    }
                }

                // Record node and which format it will apply
                let applyFormats = []
                for (let node of nodes) {
                    // check if node still exist
                    if (!$editable.find(node).length) continue
                    let format
                    // 1. Table node
                    if (dom.isTable(node)) {
                        if (!('TABLE' in this.recordFormats)) continue
                        format = this.recordFormats['TABLE']
                        applyFormats.push({ node, format })
                    }
                    // 2. other preserved Table nodes
                    else if (preservedTableTags.includes(node.nodeName)) {
                        if (!('TABLE' in this.recordFormats)) continue
                        let tableFormat = this.recordFormats['TABLE']

                        if (!(node.nodeName in tableFormat.childFormat)) continue

                        // Cell node formats
                        if (dom.isCell(node)) {
                            // find current Cell's ancestor TR index in selected range
                            let currentTR = dom.ancestor(node, dom.isTR)
                            let nodesTR = nodes.filter((el) => dom.isTR(el))
                            // if TR is not in selected range set indexTR to last index
                            let indexTR
                            if (lists.contains(nodesTR, currentTR)) indexTR = nodesTR.findIndex((el) => el === currentTR)
                            else indexTR = nodesTR.length
                            // find current Cell index in selected range
                            let nodeFormats = tableFormat.childFormat[node.nodeName]
                            let cellFormats = nodeFormats[indexTR % nodeFormats.length]
                            let index = nodes.filter((el) => el.nodeName === node.nodeName && dom.ancestor(el, dom.isTR) === currentTR).findIndex((el) => el === node)
                            format = cellFormats[index % cellFormats.length]
                        }
                        // COL node formats
                        else if (dom.isCol(node)) {
                            // find current COL's ancestor COLGROUP index in selected range
                            let currentCOLGROUP = dom.ancestor(node, dom.isColgroup)
                            let nodesCOLGROUP = nodes.filter((el) => dom.isColgroup(el))
                            // if COLGROUP is not in selected range set indexCOLGROUP to last index
                            let indexCOLGROUP
                            if (lists.contains(nodesCOLGROUP, currentCOLGROUP)) indexCOLGROUP = nodesCOLGROUP.findIndex((el) => el === currentCOLGROUP)
                            else indexCOLGROUP = nodesCOLGROUP.length
                            // find current COL index in selected range
                            let index = nodes.filter((el) => el.nodeName === node.nodeName && dom.ancestor(el, dom.isColgroup) === currentCOLGROUP).findIndex((el) => el === node)
                            let nodeFormats = tableFormat.childFormat[node.nodeName]
                            let colFormats = nodeFormats[indexCOLGROUP % nodeFormats.length]
                            format = colFormats[index % colFormats.length]
                        }
                        else {
                            let targetFormats = tableFormat.childFormat[node.nodeName][0]
                            let index = nodes.filter((el) => el.nodeName === node.nodeName).findIndex((el) => el === node)
                            format = targetFormats[index % targetFormats.length]
                        }

                        if (!format) continue
                        applyFormats.push({ node, format })
                    }
                    // 3. List node
                    else if (dom.isList(node)) {
                        if (!('LIST' in this.recordFormats)) continue
                        format = this.recordFormats['LIST']
                        applyFormats.push({
                            node,
                            format,
                            replace: node.nodeName !== format.nodeName
                        })
                    }
                    // 4. Li node
                    else if (dom.isLi(node)) {
                        if (!(node.nodeName in this.recordFormats)) continue
                        format = this.recordFormats[node.nodeName]
                        applyFormats.push({ node, format })
                    }
                    // 5. Anchor node
                    else if (dom.isAnchor(node)) {
                        format = this.recordFormats['A'] || this.recordFormats['SPAN'] || this.recordFormats['PUREPARA']
                        if (!format) continue
                        applyFormats.push({ node, format })
                    }
                    // 6. exactly match nodeName
                    else if (node.nodeName in this.recordFormats) {
                        format = this.recordFormats[node.nodeName]
                        applyFormats.push({ node, format })
                    }
                    // 7. tolerate Paragraph node
                    else if (dom.isPurePara(node)) {
                        format = this.recordFormats['PUREPARA'] || this.recordFormats['SPAN']
                        if (!format) continue
                        applyFormats.push({
                            node,
                            format,
                            replace: format.nodeName !== 'SPAN' && node.nodeName !== format.nodeName
                        })
                    }
                    // 8. tolerate SPAN node
                    else if (dom.isSpan(node)) {
                        format = this.recordFormats['PUREPARA']
                        if (!format) continue
                        applyFormats.push({ node, format })
                    }
                    // 9. tolerate Text node which first element ancestor is TextBlock, Cell, Li or Anchor
                    else if (dom.isText(node) && node.textContent.trim().length &&
                        dom.ancestor(node.parentNode, (el) => dom.isElement(el) && !styledTags.includes(el.nodeName))) {
                        let ancestor = dom.ancestor(node.parentNode, (el) => dom.isElement(el) && !styledTags.includes(el.nodeName))
                        if (!(dom.isTextBlock(ancestor) || dom.isCell(ancestor) || dom.isLi(ancestor) || dom.isAnchor(ancestor))) continue
                        format = this.recordFormats['SPAN'] || this.recordFormats['PUREPARA']
                        if (!format) continue
                        $(node).wrap('<SPAN>')
                        node = node.parentNode
                        applyFormats.push({ node, format })
                    }
                }

                // Apply format to target node
                applyFormats.forEach(({ node, format, replace }) => {
                    // prevent SPAN apply redundant formatting
                    if (dom.isSpan(node)) {
                        // if inside formatted anchor don't apply format
                        if (dom.ancestor(node.parentNode, dom.isAnchor)) {
                            let anchor = dom.ancestor(node.parentNode, dom.isAnchor)
                            if (applyFormats.find((apply) => apply.node === anchor)) {
                                $(node).contents().unwrap('SPAN')
                                return
                            }
                        }
                        // if ancestor has applied format don't apply again
                        else if (applyFormats.find((apply) => apply.node === node.parentNode && apply.format === format)) {
                            $(node).contents().unwrap('SPAN')
                            return
                        }
                    }

                    // replace nodeName or not
                    if (replace) {
                        let $replace = $(`<${format.nodeName}>`)
                            .append($(node).contents())
                        $(node).replaceWith($replace)
                        node = $replace[0]
                    }
                    // apply format
                    $(node).attr(format.attributes).css(format.styles)

                    // add position 'relative' to those who apply position 'absolute'
                    if (format.styles['position'] === 'absolute') {
                        if (!dom.ancestor(node.parentNode, (el) => (dom.isElement(el) && !dom.isEditable(el) && $(el).css('position') === 'relative'))) {
                            let ancestor = dom.ancestor(node.parentNode, dom.isElement)
                            $(ancestor).css('position', 'relative')
                        }
                    }

                    // apply styled tags
                    if ('wrapBy' in format) {
                        format.wrapBy.reverse().forEach((wrapper) => {
                            let $wrapper = $(`<${wrapper.nodeName}>`).attr(wrapper.attributes).css(wrapper.styles)
                            $(node).contents().wrapAll($wrapper)
                        })
                    }
                })
                this.clearRecord()
                rng = context.invoke('editor.createRangeFromList', applyFormats.map(apply => apply.node))
                rng.select()
                context.invoke('editor.setLastRang', rng)
                context.invoke('afterCommand')
            }

            /**
             * clear record fomats
             * also update toolbar button and cursor icon
             */
            this.clearRecord = function () {
                this.applyState = false
                this.recordFormats = []
                let copyFormattingBtn = $toolbar.find('.btn-copyFormatting')
                copyFormattingBtn.blur()
                ui.toggleBtnActive(copyFormattingBtn, this.applyState)
                $editable.toggleClass('copyformatting-cursor', this.applyState)
            }

            /**
             * clear node format
             * if format is specified only clear same attributes and styles
             */
            this.clearNodeByFormat = function ($node, format) {
                if (format) {
                    // remove attributes
                    Object.keys(format.attributes).forEach((attrName) => {
                        if (!$node.attr(attrName) || ($node.attr(attrName) === format.attributes[attrName])) {
                            $node.removeAttr(attrName)
                        }
                    })
                    // remove styles
                    Object.keys(format.styles).forEach((styleName) => {
                        if (!$node.css(styleName) || ($node.css(styleName) === format.styles[styleName])) {
                            $node.css(styleName, "")
                        }
                    })
                }
                else {
                    // remove format by all record foramts
                    let excludedTags = [].concat(preservedListTags, preservedTableTags)
                    Object.values(this.recordFormats)
                        .filter((format) => !excludedTags.includes(format.nodeName))
                        .forEach((format) => {
                            this.clearNodeByFormat($node, format)
                        })
                }
            }

            /**
             * get node format
             */
            this.getNodeFormat = function (node, rejectEmpty) {
                // get node attributes exclude formatExcludedAttributes
                let attr = node.attributes ? Object.values(node.attributes)
                    .reduce((obj, attr) => {
                        if (!formatExcludedAttributes.includes(attr.name)) obj[attr.name] = attr.value
                        return obj
                    }, {})
                    : {}
                // get node styles
                let style = node.attributeStyleMap ? Array.from(node.attributeStyleMap)
                    .reduce((obj, [prop, val]) => {
                        obj[prop] = val.toString()
                        return obj
                    }, {})
                    : {}

                if (rejectEmpty &&
                    !Object.keys(attr).length &&
                    !Object.keys(style).length) {
                    return null
                }

                return {
                    node: node,
                    nodeName: node.nodeName,
                    attributes: attr,
                    styles: style,
                }
            }
        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            copyFormatting: {
                copyFormatting: '複製格式',
            }
        },
        'en-US': {
            copyFormatting: {
                copyFormatting: 'Copy Formatting',
            }
        },
    });
}));