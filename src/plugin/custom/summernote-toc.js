/**
 * options={{
        toolbar: [
            ['toc', ['anchor', 'toc', 'markAnchor']]
        ],
    }}
 * insert anchor shortcut: (ctrl + shift + a)
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
        toc: {
            selector: null,
            prefix: null
        }
    });
    $.extend($.summernote.plugins, {
        'toc': function (context) {
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

            var prefix = options.toc.prefix || 'summernote'

            var isMac = navigator.appVersion.indexOf('Mac') > -1
            var shortcut = 'CTRL+SHIFT+A';
                
            if (isMac) {
                shortcut = 'CMD+⇧+A'
            }
            else {
                shortcut = 'CTRL+SHIFT+A';
            }

            var linkicon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
            </svg>`

            this.initialize = function () {
                if ($(`#${prefix}-toc-style`).length == 0) {
                    this.css = $('<style>').html(`.${prefix}-toc-anchor{position:relative;}.${prefix}-toc-anchor::before{content:"#";opacity:0.6;position:absolute;left:-0.7em;visibility:hidden;}.${prefix}-toc-anchor:hover::before{visibility:visible;}`)
                    this.css.attr('id', `${prefix}-toc-style`)
                    $(document.head).append(this.css)
                }

                if ($(`#${prefix}-toc-temp-style`).length == 0) {
                    this.tempcss = $('<style>').html(`.${prefix}-toc-mark{background-color:yellow;}.${prefix}-toc-mark::before{visibility:visible;}.${prefix}-toc-form-container{max-height:700px;overflow-y:auto;}.${prefix}-toc-form-group{display:flex;}.${prefix}-toc-form-group>.${prefix}-toc-data-id{width:50%;}.${prefix}-toc-form-group>.${prefix}-toc-data-text{width:50%;}`)
                    this.tempcss.attr('id', `${prefix}-toc-temp-style`)
                    $(document.head).append(this.tempcss)
                }

                this.$toc = $(`<div class="${prefix}-toc"></div>`)
                if (!!options.toc.selector) {
                    $(options.toc.selector).append(this.$toc);
                }
                else {
                    $toolbar.append(this.$toc);
                }

                this.$dialog = ui.dialog({
                    title: `${lang.toc.editAnchortext}`,
                    fade: options.dialogsFade,
                    body: `
                    <div class="form-group ${prefix}-toc-form-group">
                        <b>${lang.toc.message}</b>
                    </div>`,
                    footer: `<button href="#" class="btn btn-primary ${prefix}-toc-btn">${lang.toc.addtoc}</button>`,
                }).render().appendTo(options.container);
                this.$dialog.find('.modal-body').addClass(`${prefix}-toc-form-container`)

                $editingArea.css('display', 'flex').css('flex-direction', 'row')
                $editable.css('width', '100%')

                this.$editAnchorContainer = $(`<div style="background-color:rgba(0,0,0,.03);border-right: 1px solid rgba(0,0,0,.125); width:30em; overflow-y:auto; " class="${prefix}-edit-anchor-container"><div style="width:20em;" class="${prefix}-edit-anchor"></div></div>`)
                $editingArea.prepend(this.$editAnchorContainer)
                this.$editAnchorContainer.hide()
                this.$editAnchor = $editingArea.find(`.${prefix}-edit-anchor`)
                this.$editAnchor.css('padding', '1em 0')

                $editable.css('padding', '1.5rem')
            };

            this.wrapCommand = function (fn) {
                return function() {
                    context.invoke("beforeCommand");
                    fn.apply(this, arguments);
                    context.invoke("afterCommand");
                }
            }

            this.events = {
                'summernote.init': function (_, layoutInfo) {
                    layoutInfo.editable.on('keyup', function(event) {
                        if (event.keyCode === 8) { //key backspace
                            setTimeout(() => {
                                var code = context.invoke('code')
                                if (code.length == 0) {
                                    context.invoke('pasteHTML', '<p><br></p>')
                                }
                            }, 1);
                        }
                    })

                    layoutInfo.editable.on('keydown', function (e) {
                        // toggle anchor
                        var key = e.keyCode,
                            ctrlKey = e.ctrlKey,
                            shiftKey = e.shiftKey
                        if (key == 65 && ctrlKey && shiftKey) { // ctrl + shift + a
                            context.invoke("beforeCommand")
                            self.anchor()
                            context.invoke("afterCommand")
                        }
                    })

                    layoutInfo.statusbar.on('mousedown', (event) => {   // resize height of edit anchor area
                        EDITABLE_PADDING = 24
                        event.preventDefault();
                        event.stopPropagation();
                  
                        const onMouseMove = (event) => {
                            let height = $editable.outerHeight()
                            self.$editAnchorContainer.height(height)
                        };
                  
                        self.$document.on('mousemove', onMouseMove).one('mouseup', () => {
                            self.$document.off('mousemove', onMouseMove);
                        });
                    });
                },
                'summernote.enter': function () {   // insert paragraph
                    setTimeout(() => {
                        context.invoke("beforeCommand")
                        var rng = range.create()
                        var node = dom.ancestor(rng.commonAncestor(), function (node) {
                            return node && $(node).hasClass(`${prefix}-toc-anchor`)
                        }) || $(rng.sc).find(`.${prefix}-toc-anchor`)
                        // remove duplicated anchor
                        if(!!node && $editable.find(`#${$(node).attr('id')}`).length > 0) {
                            $(node).removeAttr('id').removeAttr('data-anchortext').removeClass([`${prefix}-toc-anchor`, `${prefix}-toc-mark`])
                        }
                        context.invoke("afterCommand");
                    }, 1);
                },
                'summernote.codeview.toggled': function () {    // toggle edit anchor area
                    let codeview = context.invoke('codeview.isActivated');
                    if (codeview) {
                        self.displayEdit = self.$editAnchorContainer.css('display') == 'none'
                        self.$editAnchorContainer.hide()
                    }
                    else {
                        !self.displayEdit && self.$editAnchorContainer.show()
                        self.resetEditAnchor()
                    }
                },
                'summernote.change': function () {
                    self.resetHeight()
                }
            }

            this.resetHeight = function () {
                // set edit anchor area height
                let height = $editable.outerHeight()
                self.$editAnchorContainer.height(height)
            }

            this.resetEditAnchor = function ($target) {
                self.resetHeight()

                // reset anchor list
                var anchors = $editor.find(`.${prefix}-toc-anchor[id]`)
                self.$editAnchor.html('<ul>')
                anchors.each((i, d) => {
                    var id = $(d).attr('id'),
                        text = $(d).attr('data-anchortext')

                    var $anchor = $('<a>').text(text).attr('href', '#' + id).css('flex', '2').css('align-self', 'center').css('overflow', 'hidden').css('text-overflow', 'ellipsis').css('white-space', 'nowrap')
                    var $input = $('<input>').attr('value', text).addClass(`${prefix}-toc-data-text`)
                    var $edit = $('<button>').text('編輯').addClass(['btn', 'btn-primary'])
                    var $del = $('<button>').text('移除').addClass(['btn', 'btn-primary'])
                    var $check = $('<button>').text('確認').addClass(['btn', 'btn-primary'])
                    var $cancel = $('<button>').text('取消').addClass(['btn', 'btn-primary'])
                    var $btncontainer = $('<div>').append([$edit, $check, $cancel, $del])
                                        .css('flex', '2').css('display', 'flex').css('justify-content', 'space-evenly')
                    var $div = $('<li>').addClass(['form-group', `${prefix}-toc-form-group`]).append([$anchor, $input, $btncontainer])
                    self.$editAnchor.find('ul').append($div)

                    function viewmode() {
                        $anchor.show()
                        $edit.show()
                        $del.show()
                        $input.hide()
                        $check.hide()
                        $cancel.hide()
                    }

                    function editmode() {
                        $anchor.hide()
                        $edit.hide()
                        $del.hide()
                        $input.show()
                        $check.show()
                        $cancel.show()
                    }

                    viewmode()

                    $edit.click(function (event) {
                        editmode()
                    })

                    $input.on('keydown', function (event) {
                        if (event.keyCode === 13){
                            context.invoke("beforeCommand")
                            event.preventDefault()
                            $editor.find(`.${prefix}-toc-anchor#${id}`).attr('data-anchortext', $input.val())
                            self.resetEditAnchor()
                            viewmode()
                            context.invoke("afterCommand")
                        }
                        
                        if (event.keyCode === 27){
                            viewmode()
                        }
                    })

                    $check.click(self.wrapCommand(function (event) {
                        $editor.find(`.${prefix}-toc-anchor#${id}`).attr('data-anchortext', $input.val())
                        // $anchor.text($input.val())
                        self.resetEditAnchor()
                        viewmode()
                    }))
                    
                    $cancel.click(function (event) {
                        viewmode()
                    })

                    $del.click(self.wrapCommand(function (event) {
                        $editor.find(`#${id}`).removeClass([`${prefix}-toc-anchor`, `${prefix}-toc-mark`]).removeAttr('data-anchortext').removeAttr('id')
                        self.resetEditAnchor()
                    }))

                    // remove event when close edit anchor area
                    !!$target && $target.bind('hideEditAnchor', function () {
                        $edit.off()
                        $del.off()
                        $input.off()
                        $check.off()
                        $cancel.off()
                    });
                })
            }

            context.memo('button.editAnchor', function () {
                return ui.button({
                    className: `${prefix}-btn-edit-anchor`,
                    contents: `<i class="note-icon ${prefix}-mark-anchor"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                  </svg></i>`,
                    tooltip: lang.toc.editAnchor,
                    click: function (event) {
                        var $target = $(event.target).closest('button')
                        
                        // toggle edit anchor area
                        self.$editAnchorContainer.animate({'width': 'toggle'})
                        $target.toggleClass(`${prefix}-show-edit-anchor`)
                        if ($target.hasClass(`${prefix}-show-edit-anchor`)) {
                            // create custom event
                            $target.on('hideEditAnchor')
                            self.resetEditAnchor($target)
                        }
                        else {
                            $target.trigger('hideEditAnchor')
                            $target.off('hideEditAnchor')
                        }
                        
                    },
                }).render();
            });

            context.memo('button.markAnchor', function () {
                return ui.button({
                    className: `${prefix}-btn-mark-anchor`,
                    contents: `<i class="note-icon ${prefix}-mark-anchor"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                    <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z"/>
                  </svg></i>`,
                    tooltip: lang.toc.markAnchor,
                    click: self.wrapCommand(function (event) {
                        var $target = $(event.target).closest('button')
                        if ($target.find(`.${prefix}-toc-mark`).length) {
                            $target.find(`.${prefix}-mark-anchor`).removeClass(`${prefix}-toc-mark`)
                            $editable.find(`.${prefix}-toc-anchor[id]`).removeClass(`${prefix}-toc-mark`)
                        }
                        else {
                            $target.find(`.${prefix}-mark-anchor`).addClass(`${prefix}-toc-mark`)
                            $editable.find(`.${prefix}-toc-anchor[id]`).addClass(`${prefix}-toc-mark`)
                        }
                    }),
                }).render();
            });

            this.anchor = function () {
                var rng = range.create()
                if (!rng) return
                var node = dom.ancestor(rng.commonAncestor(), function (node) {
                    return node && /DIV|P|LI|H[1-7]|SPAN/.test(node.nodeName.toUpperCase())
                })

                if ($editable.find(node).length > 0) {
                    var text = $(node).text(),
                        id = $(node).text()
                    id = id.replace(/[\s!"#\$%&'\(\)\*\+,\.\/:;<=>\?@\[\]\^`\{\|\}~]/g, '-')
                    // 空白段落消除錨點
                    if (id.length == 0) {
                        $(node).removeClass([`${prefix}-toc-anchor`, `${prefix}-toc-mark`])
                        self.resetEditAnchor()
                        return
                    }
                    if ($(node).attr('id') === id) {
                        $(node).toggleClass(`${prefix}-toc-anchor`)
                    }
                    else {
                        var index = 0
                        while ($editable.find(`#${id}${index || ''}`).length) {
                            index += 1
                        }
                        $(node).attr('id', `${id}${index || ''}`).toggleClass(`${prefix}-toc-anchor`).attr('data-anchortext', text)
                    }
                    if ($toolbar.find(`.${prefix}-btn-mark-anchor .${prefix}-toc-mark`).length && $(node).hasClass(`${prefix}-toc-anchor`)) {
                        $(node).addClass(`${prefix}-toc-mark`)
                    }
                    else {
                        $(node).removeClass(`${prefix}-toc-mark`)
                    }
                }
                self.resetEditAnchor()
            }

            context.memo('button.anchor', function () {
                return ui.button({
                    className: `${prefix}-anchor`,
                    contents: `<i class="note-icon">#</i>`,
                    tooltip: `${lang.toc.insertanchor} (${shortcut})`,
                    click: self.wrapCommand(function (event) {
                        self.anchor()
                    }),
                }).render();
            });

            this.resetTOC = function () {
                self.$toc.html('')
                $editor.find(`.${prefix}-toc-anchor`).each((i, d) => {
                    let text = $(d).attr('data-anchortext'),
                        id = $(d).attr('id')
                    
                    // 產生 TOC
                    var anchor = $('<a>').attr('href', '#' + id)
                    anchor.text(text)
                    var li = $('<li>').append(anchor)
                    self.$toc.append(li)
                })
            }

            this.showDialog = function () {
                ui.showDialog(this.$dialog)

                var $body = self.$dialog.find('.modal-body')
                var anchors = $editor.find(`.${prefix}-toc-anchor[id]`)
                if (anchors.length == 0) {
                    $body.html(`
                    <div class="form-group ${prefix}-toc-form-group">
                        <b>${lang.toc.message}</b>
                    </div>`)
                    return
                }
                // reset dialog body
                $body.html(`
                <div class="form-group ${prefix}-toc-form-group">
                    <b class="${prefix}-toc-data-id">id</b>
                    <b class="${prefix}-toc-data-text">${lang.toc.anchortext}</b>
                </div>`)
                anchors.each((i, d) => {
                    var id = $(d).attr('id'),
                        text = $(d).attr('data-anchortext')

                    var label = $('<label>').text(id).addClass(`${prefix}-toc-data-id`)
                    var input = $('<input>').attr('value', text).attr('id', id).addClass(`${prefix}-toc-data-text`)
                    var div = $('<div>').addClass(['form-group', `${prefix}-toc-form-group`]).append(label).append(input)
                    $body.append(div)
                })

                var $btn = self.$dialog.find(`.modal-footer .${prefix}-toc-btn`)
                $btn.click(self.wrapCommand(function (event) {
                    ui.hideDialog(self.$dialog)
                    // reset toc
                    var input = self.$dialog.find(`.${prefix}-toc-data-text`).not('b')
                    input.each((i, d) => {
                        let text = $(d).val(),
                            id = $(d).attr('id')
    
                        // update anchor text
                        $editor.find(`.${prefix}-toc-anchor#${id}`).attr('data-anchortext', text)
                    })
                    self.resetTOC()
                    self.resetEditAnchor()
                }))

                ui.onDialogHidden(self.$dialog, function () {
                    $btn.off();
                });
            }

            context.memo('button.toc', function () {
                return ui.button({
                    className: `${prefix}-toc`,
                    contents: `<i class="note-icon">${linkicon}</i>`,
                    tooltip: lang.toc.addtoc,
                    click: function (event) {
                        context.invoke('editor.saveRange');

                        self.showDialog()

                        context.invoke('editor.restoreRange');
                    },
                }).render();
            });

            self.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
                this.$editAnchorContainer.remove()
                !!this.tempcss && $(this.tempcss).remove()
            };
        }
    })

    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            toc: {
                anchor: '錨點',
                toc: '目錄',
                anchortext: '錨點文字',
                editAnchortext: '編輯錨點文字',
                addtoc: '新增目錄',
                insertanchor: '插入錨點',
                message: '目前尚無錨點',
                markAnchor: '檢視錨點',
                editAnchor: '編輯錨點',
            }
        },
        'en-US': {
            toc: {
                anchor: 'anchor',
                toc: 'toc',
                anchortext: 'anchor text',
                editAnchortext: 'Edit anchor text',
                addtoc: 'add toc',
                insertanchor: 'insert anchor',
                message: 'Cannot find any anchor',
                markAnchor: 'mark anchor',
                editAnchor: 'edit anchor',
            }
        },
    });
}));