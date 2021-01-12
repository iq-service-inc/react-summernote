
/*
 * @package summernoteDrafts.js
 * @version 1.0
 * @author Jessica González <suki@missallsunday.com>
 * @copyright Copyright (c) 2017, Jessica González
 * @license https://opensource.org/licenses/MIT MIT
 */

(function () {
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            define(['jquery'], factory);
        } else if (typeof module === 'object' && module.exports) {
            module.exports = factory(require('jquery'));
        } else {
            factory(window.jQuery);
        }
    })(function ($) {
        $.extend($.summernote.options, {
            sDrafts: {
                storePrefix: 'sDrafts',
                dateFormat: null,
                saveIcon: null,
                loadIcon: null
            }
        });
        $.extend($.summernote.lang['en-US'], {
            sDrafts: {
                save: 'Save Draft',
                load: 'Load Drafts',
                select: 'select the draft you want to load',
                provideName: 'Provide a name for this draft',
                saved: 'Draft was successfully saved',
                loaded: 'Draft was successfully loaded',
                deleteAll: 'Delete all drafts',
                noDraft: 'The selected draft couldn\'t be loaded, try again or select another one',
                nosavedDrafts: 'There aren\'t any drafts saved',
                deleteDraft: 'delete',
                youSure: 'Are you sure you want to do this?'
            }
        });
        $.extend($.summernote.lang['zh-TW'], {
            sDrafts: {
                save: '儲存草稿',
                load: '載入草稿',
                select: '選擇要載入的草稿',
                provideName: '輸入草稿名稱',
                saved: '成功儲存草稿',
                loaded: '成功載入草告',
                deleteAll: '刪除所有草稿',
                noDraft: '無法載入選擇的草稿，重試或選擇其他草稿',
                nosavedDrafts: '目前尚無儲存的草稿',
                deleteDraft: '刪除',
                youSure: '確定要刪除所有草稿？'
            }
        });
        $.extend($.summernote.plugins, {
            'sDraftsSave': function (context) {
                var $editor, lang, options, ui;
                ui = $.summernote.ui;
                options = context.options;
                lang = options.langInfo.sDrafts;
                $editor = context.layoutInfo.editor;
                console.log(options.sDrafts)
                context.memo('button.sDraftsSave', function () {
                    var button;
                    button = ui.button({
                        contents: options.sDrafts.saveIcon || `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-bookmark" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"/>
                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                    </svg>`,
                        tooltip: lang.save,
                        click: function (e) {
                            e.preventDefault();
                            context.invoke('sDraftsSave.show');
                            return false;
                        }
                    });
                    return button.render();
                });
                this.initialize = (function (_this) {
                    return function () {
                        var $container, body, footer;
                        $container = options.dialogsInBody ? $(document.body) : $editor;
                        body = "<div class='form-group'><label>" + lang.provideName + "</label><input class='note-draftName form-control' type='text' /></div>";
                        footer = "<button href='#' class='btn btn-primary note-link-btn'>" + lang.save + "</button>";
                        _this.$dialog = ui.dialog({
                            className: 'link-dialog',
                            title: lang.save,
                            fade: options.dialogsFade,
                            body: body,
                            footer: footer
                        }).render().appendTo($container);
                    };
                })(this);
                this.destroy = (function (_this) {
                    return function () {
                        ui.hideDialog(_this.$dialog);
                        _this.$dialog.remove();
                    };
                })(this);
                this.show = (function (_this) {
                    return function () {
                        var $saveBtn;
                        ui.showDialog(_this.$dialog);
                        return $saveBtn = _this.$dialog.find('.note-link-btn').click(function (e) {
                            var draftName;
                            e.preventDefault;
                            draftName = _this.$dialog.find('.note-draftName').val();
                            _this.saveDraft(draftName);
                            return false;
                        });
                    };
                })(this);
                this.saveDraft = (function (_this) {
                    return function (name) {
                        var body, isoDate, keyName;
                        isoDate = new Date().toISOString();
                        if (name == null) {
                            name = isoDate;
                        }
                        keyName = options.sDrafts.storePrefix + '-' + name;
                        body = context.code();
                        store.set(keyName, {
                            name: name,
                            sDate: isoDate,
                            body: body
                        });
                        alert(lang.saved);
                        _this.destroy();
                    };
                })(this);
            }
        });
        return $.extend($.summernote.plugins, {
            'sDraftsLoad': function (context) {
                var $editor, draft, drafts, fn, htmlList, key, lang, options, ui;
                ui = $.summernote.ui;
                options = context.options;
                lang = options.langInfo.sDrafts;
                $editor = context.layoutInfo.editor;
                drafts = [];
                store.each(function (value, key) {
                    if (typeof key === 'string' && key.indexOf(options.sDrafts.storePrefix) >= 0) {
                        return drafts[key] = value;
                    }
                });
                htmlList = '';
                fn = function () {
                    var fDate;
                    fDate = options.sDrafts.dateFormat && typeof options.sDrafts.dateFormat === 'function' ? options.sDrafts.dateFormat(draft.sDate) : draft.sDate;
                    return htmlList += "<li class='list-group-item'><a href='#' class='note-draft' data-draft='" + key + "'>" + draft.name + " - <small>" + fDate + "</small></a><a href='#' class='label label-danger pull-right delete-draft' data-draft='" + key + "' style='float:right;'>" + lang.deleteDraft + "</a></li>";
                };
                for (key in drafts) {
                    draft = drafts[key];
                    fn();
                }
                context.memo('button.sDraftsLoad', function () {
                    var button;
                    button = ui.button({
                        contents: options.sDrafts.loadIcon || `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journals" viewBox="0 0 16 16">
                        <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                        <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"/>
                    </svg>`,
                        tooltip: lang.load,
                        click: function (e) {
                            e.preventDefault();
                            context.invoke('sDraftsLoad.show');
                            return false;
                        }
                    });
                    return button.render();
                });
                this.initialize = (function (_this) {
                    return function () {
                        var $container, body, footer;
                        $container = options.dialogsInBody ? $(document.body) : $editor;
                        body = htmlList.length ? "<h4>" + lang.select + "</h4><ul class='list-group'>" + htmlList + "</ul>" : "<h4>" + lang.nosavedDrafts + "</h4>";
                        footer = htmlList.length ? "<button href='#' class='btn btn-primary deleteAll'>" + lang.deleteAll + "</button>" : "";
                        _this.$dialog = ui.dialog({
                            className: 'link-dialog',
                            title: lang.load,
                            fade: options.dialogsFade,
                            body: body,
                            footer: footer
                        }).render().appendTo($container);
                    };
                })(this);
                this.destroy = (function (_this) {
                    return function () {
                        ui.hideDialog(_this.$dialog);
                        _this.$dialog.remove();
                    };
                })(this);
                this.show = (function (_this) {
                    return function () {
                        var $deleteAllDrafts, $deleteDraft, $selectedDraft, self;
                        ui.showDialog(_this.$dialog);
                        self = _this;
                        $selectedDraft = _this.$dialog.find('.note-draft').click(function (e) {
                            var data, div;
                            e.preventDefault;
                            div = document.createElement('div');
                            key = $(this).data('draft');
                            data = drafts[key];
                            if (data) {
                                div.innerHTML = data.body;
                                context.invoke('editor.insertNode', div);
                                alert(lang.loaded);
                            } else {
                                alert(lang.noDraft);
                            }
                            self.destroy();
                            return false;
                        });
                        $deleteDraft = _this.$dialog.find('a.delete-draft').click(function (e) {
                            var data;
                            if (confirm(lang.youSure)) {
                                key = $(this).data('draft');
                                data = drafts[key];
                                if (data) {
                                    store.remove(key);
                                    self = $(this);
                                    return self.parent().hide('slow', function () {
                                        $(this).remove();
                                    });
                                } else {
                                    return alert(lang.noDraft);
                                }
                            }
                        });
                        $deleteAllDrafts = _this.$dialog.find('button.deleteAll').click(function (e) {
                            var fn1, selfButton, uiDialog;
                            selfButton = $(this);
                            if (confirm(lang.youSure)) {
                                fn1 = function () {
                                    return store.remove(key);
                                };
                                for (key in drafts) {
                                    draft = drafts[key];
                                    fn1();
                                }
                                return uiDialog = self.$dialog.find('ul.list-group').hide('slow', function () {
                                    $(this).replaceWith("<h4>" + lang.nosavedDrafts + "</h4>");
                                    selfButton.hide('slow');
                                });
                            }
                        });
                    };
                })(this);
            }
        });
    });

}).call(this);