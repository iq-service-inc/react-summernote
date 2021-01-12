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
            selector: null
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
                var css = $('<style>').html(`.toc-anchor{position:relative;}.toc-anchor::before{content:"#";opacity:0.6;position:absolute;left:-0.7em;visibility:hidden;}.toc-anchor:hover::before{visibility:visible;}.toc-mark{background-color:yellow;}.toc-mark::before{visibility:visible;}.toc-form-container{max-height:700px;overflow-y:auto;}.toc-form-group{display:flex;}.toc-form-group>.toc-data-id{width:50%;}.toc-form-group>.toc-data-text{width:50%;}`)
                $(document.head).append(css)

                this.$toc = $(`<div class="toc"></div>`)
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
                    <div class="form-group toc-form-group">
                        <b>${lang.toc.message}</b>
                    </div>`,
                    footer: `<button href="#" class="btn btn-primary note-toc-btn">${lang.toc.addtoc}</button>`,
                }).render().appendTo(options.container);
                this.$dialog.find('.modal-body').addClass('toc-form-container')

                $editable.css('padding', '1.5rem')
                $editingArea.on('keydown', function (e) {
                    // toggle anchor
                    var key = e.keyCode,
                        ctrlKey = e.ctrlKey,
                        shiftKey = e.shiftKey
                    if (key == 65 && ctrlKey && shiftKey) { // ctrl + shift + a
                        self.anchor()
                    }
                })
            };

            context.memo('button.markAnchor', function () {
                return ui.button({
                    className: 'btn-mark-anchor',
                    contents: `<i class="note-icon mark-anchor"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                    <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z"/>
                  </svg></i>`,
                    tooltip: lang.toc.markAnchor,
                    click: function (event) {
                        var $target = $(event.target).closest('button')
                        if ($target.find('.toc-mark').length) {
                            $target.find('.mark-anchor').removeClass('toc-mark')
                            $editable.find('.toc-anchor[id]').removeClass('toc-mark')
                        }
                        else {
                            $target.find('.mark-anchor').addClass('toc-mark')
                            $editable.find('.toc-anchor[id]').addClass('toc-mark')
                        }
                    },
                }).render();
            });

            this.anchor = function () {
                var rng = range.create()
                if (!rng) return
                var node = dom.ancestor(rng.commonAncestor(), function (node) {
                    return node && /DIV|P|LI|H[1-7]|SPAN/.test(node.nodeName.toUpperCase())
                })

                if ($editable.find(node).length > 0) {
                    var id = $(node).text()
                    id = id.replace(/[\W\-]/g, '-')
                    if (id.length == 0) return
                    if ($(node).attr('id') === id) {
                        $(node).toggleClass('toc-anchor')
                    }
                    else {
                        var index = 0
                        while ($editable.find(`#${id}${index || ''}`).length) {
                            index += 1
                        }
                        $(node).attr('id', `${id}${index || ''}`).toggleClass('toc-anchor').data('text', id)
                    }
                    if ($toolbar.find('.btn-mark-anchor .toc-mark').length && $(node).hasClass('toc-anchor')) {
                        $(node).addClass('toc-mark')
                    }
                    else {
                        $(node).removeClass('toc-mark')
                    }
                }
            }

            context.memo('button.anchor', function () {
                return ui.button({
                    className: 'anchor',
                    contents: `<i class="note-icon">#</i>`,
                    tooltip: `${lang.toc.insertanchor} (${shortcut})`,
                    click: function (event) {
                        self.anchor()
                    },
                }).render();
            });

            this.showDialog = function () {
                ui.showDialog(this.$dialog)

                var $body = self.$dialog.find('.modal-body')
                var anchors = $editor.find('.toc-anchor[id]')
                if (anchors.length == 0) {
                    $body.html(`
                    <div class="form-group toc-form-group">
                        <b>${lang.toc.message}</b>
                    </div>`)
                    return
                }
                // reset dialog body
                $body.html(`
                <div class="form-group toc-form-group">
                    <b class="toc-data-id">id</b>
                    <b class="toc-data-text">${lang.toc.anchortext}</b>
                </div>`)
                anchors.each((i, d) => {
                    var id = $(d).attr('id'),
                        text = $(d).data('text')

                    var label = $('<label>').text(id).addClass('toc-data-id')
                    var input = $('<input>').attr('value', text).attr('id', id).addClass('toc-data-text')
                    var div = $('<div>').addClass(['form-group', 'toc-form-group']).append(label).append(input)
                    $body.append(div)
                })

                var $btn = self.$dialog.find('.modal-footer .note-toc-btn')
                $btn.click(function (event) {
                    ui.hideDialog(self.$dialog)
                    // reset toc
                    self.$toc.html('')
                    var input = self.$dialog.find('.toc-data-text').not('b')
                    input.each((i, d) => {
                        let text = $(d).val(),
                            id = $(d).attr('id')
    
                        // update anchor text
                        $editor.find(`.toc-anchor#${id}`).data('text', text)

                        // 產生 TOC
                        var anchor = $('<a>').attr('href', '#' + id)
                        anchor.text(text)
                        var li = $('<li>').append(anchor)
                        self.$toc.append(li)
                    })
                })

                ui.onDialogHidden(self.$dialog, function () {
                    $btn.off();
                });
            }

            context.memo('button.toc', function () {
                return ui.button({
                    className: 'toc',
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
            }
        },
    });
}));