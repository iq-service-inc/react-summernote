/**
 * options={{
        toolbar: [
            ['popover', ['editPopover', 'removePopover']]
        ],
        commentPopover: {
            className: 'summernote-comment-popover',
            urlPattern: /https?:\/\/(?:[\w\u00a1-\uffff]+\.?)+(?::\d{2,5})?(?:\/[^\s]*)?/,
        }
    }}
 * add comment popover
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
        commentPopover: {
            className: null,
            urlPattern: null,
            titleMaxLength: 100,
            contentMaxLength: 100,
        }
    })
    $.extend($.summernote.plugins, {
        'commentPopover': function (context) {
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

            const titleMaxLength = options.commentPopover.titleMaxLength
            const contentMaxLength = options.commentPopover.contentMaxLength
            const className = options.commentPopover.className || 'summernote-comment-popover'
            const urlPattern = options.commentPopover.urlPattern || /https?:\/\/(?:[\w\u00a1-\uffff]+\.?)+(?::\d{2,5})?(?:\/[^\s]*)?/

            const editPopoverIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path stroke="#000000" fill="#000000" d="m0.93829,4.45171l0,0c0,-1.05081 0.81745,-1.90267 1.82583,-1.90267l0.82992,0l0,0l3.98362,0l7.46929,0c0.48424,0 0.94865,0.20046 1.29106,0.55728c0.34241,0.35682 0.53477,0.84077 0.53477,1.34538l0,4.16198c-4.84747,-0.45484 -6.47103,1.94658 -6.43542,5.20509l-1.18444,0.08376l-3.66816,1.76357l0.10921,-1.67617l-2.92985,-0.0249c-1.00838,0 -1.82583,-0.85185 -1.82583,-1.90267l0,0l0,-2.854l0,0l0,-4.75666l0,0.00001z" id="svg_1"/>
                <path stroke="#000000" fill="#000000" d="m0.93829,4.45171l0,0c0,-1.05081 0.81745,-1.90267 1.82583,-1.90267l0.82992,0l0,0l3.98362,0l7.46929,0c0.48424,0 0.94865,0.20046 1.29106,0.55728c0.34241,0.35682 0.53477,0.84077 0.53477,1.34538l0,4.16198c-4.84747,-0.45484 -6.47103,1.94658 -6.43542,5.20509l-1.18444,0.08376l-4.39442,1.8753l0.83547,-1.7879l-2.92985,-0.0249c-1.00838,0 -1.82583,-0.85185 -1.82583,-1.90267l0,0l0,-2.854l0,0l0,-4.75666l0,0.00001z" id="svg_1"/>
                <rect fill="#ffffff" x="2.85232" y="10.54749" width="6" height="1.40909" id="svg_9" stroke="null"/>
                <rect fill="#ffffff" x="2.85232" y="4.54749" width="12" height="1.40909" id="svg_11" stroke="null"/>
                <rect fill="#ffffff" x="2.85232" y="7.54749" width="9.70833" height="1.40909" id="svg_12" stroke="null"/>
                <path stroke="null" id="svg_2" d="m12.12231,13.33447l2.54791,0l0,-2.54791l2.61367,0l0,2.54791l2.54791,0l0,2.61367l-2.54791,0l0,2.54791l-2.61367,0l0,-2.54791l-2.54791,0l0,-2.61367z" fill="#000000"/>
            </svg>`
            const deletePopoverIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path stroke="#000000" fill="#000000" d="m0.93829,4.45171l0,0c0,-1.05081 0.81745,-1.90267 1.82583,-1.90267l0.82992,0l0,0l3.98362,0l7.46929,0c0.48424,0 0.94865,0.20046 1.29106,0.55728c0.34241,0.35682 0.53477,0.84077 0.53477,1.34538l0,4.16198c-4.84747,-0.45484 -6.47103,1.94658 -6.43542,5.20509l-1.18444,0.08376l-4.39442,1.8753l0.83547,-1.7879l-2.92985,-0.0249c-1.00838,0 -1.82583,-0.85185 -1.82583,-1.90267l0,0l0,-2.854l0,0l0,-4.75666l0,0.00001z" id="svg_1"/>
                <rect fill="#ffffff" x="2.85232" y="10.54749" width="6" height="1.40909" id="svg_9" stroke="null"/>
                <rect fill="#ffffff" x="2.85232" y="4.54749" width="12" height="1.40909" id="svg_11" stroke="null"/>
                <rect fill="#ffffff" x="2.85232" y="7.54749" width="9.70833" height="1.40909" id="svg_12" stroke="null"/>
                <path stroke="null" id="svg_3" d="m12.45892,12.36059l1.80144,-1.80144l1.91364,1.91362l1.91364,-1.91362l1.80145,1.80144l-1.91364,1.91364l1.91364,1.91364l-1.80145,1.80145l-1.91364,-1.91364l-1.91364,1.91364l-1.80144,-1.80145l1.91362,-1.91364l-1.91362,-1.91364z" fill="#000000"/>
            </svg>`

            
            this.initialize = function () {
                if ($('#summernote-comment-popover').length == 0) {
                    this.css = $('<style>').html('.summernote-comment-popover:not([href]){color: #8ac193;}.summernote-comment-popover:not([href]):hover{color: #8ac193; text-decoration: underline}')
                    this.css.attr('id', 'summernote-comment-popover')
                    $(document.head).append(this.css)
                }

                let titleMaxAttr = !!titleMaxLength? `maxlength="${titleMaxLength}"`: ""
                let contentMaxAttr = !!contentMaxLength? `maxlength="${contentMaxLength}"`: ""
                this.$dialog = ui.dialog({
                    title: `${lang.commentPopover.addPopover}`,
                    className: 'summernote-comment-popover-dialog',
                    fade: options.dialogsFade,
                    body: [
                        '<div class="form-group summernote-comment-popover-form-group">',
                        `<label for="summernote-comment-popover-image-url-${options.id}" class="note-form-label" >${lang.commentPopover.imgurl}</label>`,
                        `<input id="summernote-comment-popover-image-url-${options.id}" class="summernote-comment-popover-image-url form-control note-form-control note-input" type="url" pattern="${urlPattern.source}" />`,
                        `<div class="invalid-feedback">${lang.commentPopover.invalidUrl}</div>`,
                        '</div>',
                        '<div class="form-group summernote-comment-popover-form-group">',
                        `<label for="summernote-comment-popover-title-text-${options.id}" class="note-form-label" >${lang.commentPopover.title}</label>`,
                        `<input ${titleMaxAttr} id="summernote-comment-popover-title-text-${options.id}" class="summernote-comment-popover-title-text form-control note-form-control note-input" type="text" />`,
                        `<div class="invalid-feedback">${lang.commentPopover.invalidContent}</div>`,
                        '</div>',
                        '<div class="form-group summernote-comment-popover-form-group">',
                        `<label for="summernote-comment-popover-content-text-${options.id}" class="note-form-label" >${lang.commentPopover.content}</label>`,
                        `<textarea ${contentMaxAttr} id="summernote-comment-popover-content-text-${options.id}" class="summernote-comment-popover-content-text form-control note-form-control note-input" rows="3"></textarea>`,
                        `<div class="invalid-feedback">${lang.commentPopover.invalidContent}</div>`,
                        '</div>',
                    ].join(''),
                    footer: `<button href="#" class="btn btn-primary summernote-comment-popover-btn">${lang.commentPopover.ok}</button>`,
                }).render().appendTo(options.container);
                this.$dialog.find('.modal-body').addClass("summernote-comment-popover-form-container")
            }
            this.destroy = function () {
                !!this.css && $(this.css).remove()
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };

            this.wrapCommand = function (fn) {
                return function () {
                    context.invoke("beforeCommand");
                    fn.apply(this, arguments);
                    context.invoke("afterCommand");
                }
            }

            context.memo('button.editPopover', function () {
                return ui.button({
                    contents: `<i class="note-icon">${editPopoverIcon}</i>`,
                    tooltip: lang.commentPopover.addPopover,
                    click: function () {
                        // console.log(range.create(), context.invoke('editor.getLastRange'))
                        self.showDialog()
                    }
                }).render()
            })

            context.memo('button.removePopover', function () {
                return ui.button({
                    contents: `<i class="note-icon">${deletePopoverIcon}</i>`,
                    tooltip: lang.commentPopover.removePopover,
                    click: function () {
                        self.wrapCommand(self.removePopover())
                        // console.log(context.invoke('editor.getLastRange'))
                    }
                }).render()
            })

            this.showDialog = function () {
                // save range
                var rng = range.create()
                rng.select()
                context.invoke('editor.setLastRange')

                ui.showDialog(self.$dialog)

                // if click ok add popover
                var $okBtn = self.$dialog.find('.modal-footer .summernote-comment-popover-btn')
                $okBtn.on('click', function (event) {
                    event.preventDefault()
                    var $imgurlInput = self.$dialog.find('.modal-body .summernote-comment-popover-image-url')
                    var $titleInput = self.$dialog.find('.modal-body .summernote-comment-popover-title-text')
                    var $contentInput = self.$dialog.find('.modal-body .summernote-comment-popover-content-text')

                    let title = $titleInput.val()
                    let content = $contentInput.val()
                    let imgurl = $imgurlInput.val()

                    // chack input valid
                    let invalidFlag = false
                    if (!$imgurlInput[0].checkValidity()) {
                        $imgurlInput.addClass('is-invalid')
                        invalidFlag = true

                        // hide invalid feedback
                        $imgurlInput.one('keydown change', function (event) {
                            $imgurlInput.removeClass('is-invalid')
                        })
                    }
                    if (!title && !content) {
                        invalidFlag = true

                        // hide invalid feedback
                        var $mixContentInput = self.$dialog.find('.modal-body')
                            .find('.summernote-comment-popover-title-text, .summernote-comment-popover-content-text')
                        $mixContentInput.addClass('is-invalid')
                        $mixContentInput.one('keydown change', function (event) {
                            $mixContentInput.removeClass('is-invalid')
                            $mixContentInput.off()
                        })
                    }
                    if (!invalidFlag) {
                        ui.hideDialog(self.$dialog)
                        self.wrapCommand(self.addPopover(title, content, imgurl))
                        // console.log(context.invoke('editor.getLastRange'))
                    }
                })

                // textarea disable new line
                var $contentTextarea = self.$dialog.find('.modal-body .summernote-comment-popover-content-text')
                $contentTextarea.on('paste', function (event) {
                    setTimeout(() => {
                        $(this).val($(this).val().replace(/[\r\n\v]+/g, ''))
                    }, 1);
                })
                $contentTextarea.on('keyup keypress', function (event) {
                    var keyCode = event.keyCode
                    if (keyCode === 13) {
                        event.preventDefault()
                    }
                })

                // when open dialog update current popover info to input
                ui.onDialogShown(self.$dialog, function () {
                    var $imgurlInput = self.$dialog.find('.modal-body .summernote-comment-popover-image-url')
                    var $titleInput = self.$dialog.find('.modal-body .summernote-comment-popover-title-text')
                    var $contentTextarea = self.$dialog.find('.modal-body .summernote-comment-popover-content-text')

                    var $popover = self.currentPopover()
                    if ($popover) {
                        var dataTitle = $popover.attr('data-title')
                        var title = self.decodeString(dataTitle)
                        $titleInput.val(title)

                        var dataContent = $popover.attr('data-content')
                        var content = self.getAttrContentText(dataContent)
                        $contentTextarea.val(content)
                        var imgurl = self.getAttrContentImg(dataContent)
                        $imgurlInput.val(imgurl)
                    }

                });

                // when close dialog remove button event and restore range
                ui.onDialogHidden(self.$dialog, function () {
                    context.invoke('editor.restoreRange');
                    $okBtn.off();
                    $contentTextarea.off();
                });
            }

            /**
             * encode string to store in html
             * @param {String} str 
             * @returns encoded string
             */
            this.encodeString = function (str) {
                return str.replace(/[\u00A0-\u9999<>\&'"\/]/g, function (i) {
                    return '&#' + i.charCodeAt(0) + ';'
                })
            }

            /**
             * decode string to extract text from html
             * @param {String} str 
             * @returns decoded string
             */
            this.decodeString = function (str) {
                return str.replace(/&#([0-9]+);/g, function (match, $1) {
                    return String.fromCharCode(parseInt($1))
                })
            }

            /**
             * extract content text from formated data-content attribute
             * @param {String} str data-content attribute
             * @returns content text
             */
            this.getAttrContentText = function (str) {
                return this.decodeString(str.match(/<div class="popover-content">(?<content>.*)<\/div>/)?.groups?.content)
            }

            /**
             * extract content image url from formated data-content attribute
             * @param {String} str data-content attribute
             * @returns image url
             */
            this.getAttrContentImg = function (str) {
                return str.match(/<img class="img-fluid popover-image" src="(?<src>.*)" \/>/)?.groups?.src
            }

            /**
             * format content text and image url 
             * @param {String} text content text
             * @param {String} imgurl image url
             * @returns formated html
             */
            this.formatAttrContent = function (text, imgurl) {
                var escapedContent = this.encodeString(text)
                var attr = `<div class="popover-content">${escapedContent}</div>`
                // add img
                if (urlPattern.test(imgurl)) {
                    attr = `<img class="img-fluid popover-image" src="${imgurl}" />` + attr
                }
                return attr
            }

            /**
             * test if end is in node children
             * @param {Node} node 
             * @param {Node} end 
             * @returns {Boolean} whether end node is in this node children
             */
            this.isEndInChild = function (node, end) {
                // check end node is in this node child
                while (node) {
                    if (node === end) return true
                    if (node.nextSibling) node = node.nextSibling
                    else node = node.firstChild
                }
                return false
            }

            /**
             * breadth first traversal nodes
             * @param {Node} start
             * @param {Node} end
             * @param {Function} handler - handle with found node return true will break traversal
             */
            this.walkNodes = function (start, end, handler) {
                let node = start

                while (node) {
                    let isEnd = handler(node)
                    if (isEnd) break

                    // if (node === commonAncestor) break
                    if (node === end) break
                    if (this.isEndInChild(node.firstChild, end)) break

                    // walk through siblings until end or commonAncestor
                    if (node.nextSibling) node = node.nextSibling
                    else node = node.parentNode
                }

            }

            /**
             * Find current popover
             * @returns {jQuery} $popover
             */
            this.currentPopover = function () {
                var rng = context.invoke('editor.getLastRange')
                const endPoint = rng.getEndPoint();
                const startPoint = rng.getStartPoint();
                var start = startPoint.node;
                var end = endPoint.node;

                var $popover = null

                // find popover
                this.walkNodes(start, end, function (node) {
                    let pred = function (node) {
                        return dom.isAnchor(node) && $(node).hasClass(className)
                    }
                    // (ancestor) current node ancestor is popover
                    if (dom.ancestor(node, pred)) {
                        $popover = $(dom.ancestor(node, pred))
                        return true
                    }
                    // (current) current node is popover
                    if (pred(node)) {
                        $popover = $(node)
                        return true
                    }
                    // (child) current node has popover in child
                    if ($(node).find(`a.${className}`).length) {
                        $popover = $(node).find(`a.${className}`)
                        return true
                    }
                    return false
                })

                return $popover
            }

            /**
             * Add popover to current editor selected range
             * @param {string} title Popover Title
             * @param {string} content Popover Content
             */
            this.addPopover = function (title, content, imgurl) {
                var rng = context.invoke('editor.getLastRange')
                if (!rng.isOnEditable()) return

                var $popover = this.currentPopover()
                // if found popover update attribute
                if (!!$popover) {
                    var dataTitle = this.encodeString(title)
                    var dataContent = this.formatAttrContent(content, imgurl)
                    $popover.attr("data-title", dataTitle)
                        .attr("data-content", dataContent)

                    return
                }

                if (rng.isCollapsed()) return

                // if directly select an anchor
                // add attribute on this anchor
                if (rng.isOnAnchor()) {
                    var $anchor = $(dom.ancestor(rng.sc, dom.isAnchor))
                }
                // else wrap all range nodes
                else {
                    // break text node by range offset
                    rng = rng.splitText()

                    const endPoint = rng.getEndPoint();
                    const startPoint = rng.getStartPoint();
                    var start = startPoint.node;
                    var end = endPoint.node;
                    var nodes = [];

                    // expand boundary to single child ancestor
                    start = dom.singleChildAncestor(start, dom.isElement) || start
                    end = dom.singleChildAncestor(end, dom.isElement) || end

                    let isNotTextNode = false
                    this.walkNodes(start, end, function (node) {
                        if (dom.isPurePara(node)) {
                            nodes.push(node)
                        }
                        else if (dom.isInline(node)) {
                            nodes.push(node)
                        }
                        else {
                            // illegal node
                            isNotTextNode = true
                            return true
                        }
                    })

                    // stop if find illegal node
                    if (isNotTextNode) return

                    nodes = lists.unique(nodes)

                    // wrap all nodes
                    var $anchor = $(nodes)
                    $anchor.wrapAll("<a>")
                    $anchor = $anchor.parent()
                }

                // add popover
                $anchor.addClass(className)
                    .attr("tabindex", "0")
                    .attr("data-toggle", "popover")
                    .attr("data-html", "true")
                    .attr("data-trigger", "hover")
                // .attr("data-trigger", "click")

                // format content
                var dataContent = this.formatAttrContent(content, imgurl)
                var dataTitle = this.encodeString(title)
                $anchor.attr("data-title", dataTitle).attr("data-content", dataContent)

                $anchor.popover()

                // reset range
                rng = range.createFromNode($anchor[0])
                context.invoke('editor.setLastRange')
                rng.select()
            }

            /**
             * Remove popover on current range
             */
            this.removePopover = function () {
                var rng = context.invoke('editor.getLastRange')

                var $popover = this.currentPopover()

                // if found popover remove it
                if ($popover && $popover.length) {
                    $popover.popover('dispose')
                    // if <a> has link only remove attr
                    if ($popover.attr('href') || $popover.attr('target')) {
                        $popover.removeClass(className)
                            .removeAttr("tabindex").removeAttr("data-toggle").removeAttr("data-trigger")
                            .removeAttr("data-title").removeAttr("data-content")

                        // reset range
                        rng = range.createFromNode($popover[0])
                        context.invoke('editor.setLastRange', rng)
                        rng.select()
                    }
                    // else unwrap <a>
                    else {
                        let $contents = $popover.contents()
                        $contents.unwrap(`a.${className}`)

                        // reset range
                        rng = context.invoke('editor.createRangeFromList', $contents)
                        rng.select()

                        // normalize paragraph
                        let ancestor = dom.ancestor(rng.commonAncestor(), dom.isElement) || $editable[0]
                        ancestor.normalize()
                        rng = range.create()
                        context.invoke('editor.setLastRange')
                        rng.select()
                    }
                }
            }

        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            commentPopover: {
                addPopover: '新增註解',
                removePopover: '刪除註解',
                imgurl: '圖片連結',
                title: '標題',
                content: '內容',
                ok: '確認',
                invalidUrl: '無效的連結',
                invalidContent: '無標題和內容',
            }
        },
        'en-US': {
            commentPopover: {
                addPopover: 'Add Comment',
                removePopover: 'Remove Comment',
                imgurl: 'Image URL',
                title: 'Title',
                content: 'Content',
                ok: 'OK',
                invalidUrl: 'Invalid Url',
                invalidContent: 'Invalid Title and Content',
            }
        },
    });
}));