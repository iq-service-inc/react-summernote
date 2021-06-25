(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
}(function ($) {
  $.extend(true,$.summernote.lang, {
    'en-US': { /* English */
      findnreplace: {
        tooltip:            `Find 'N Replace`,
        findBtn:            'Find ',
        findPlaceholder:    'Enter the text you want to find...',
        findResult:         ' results found for ',
        findError:          'Nothing entered to find...',
        replaceBtn:         'Replace',
        replacePlaceholder: 'Enter the text to replace the text above or selected...',
        replaceResult:      ', replaced by ',
        replaceError:       'Nothing entered to replace...',
        noneSelected:       'Nothing selected to replace...'
      }
    },
    'zh-TW': {
      findnreplace: {
        tooltip:            `搜尋與取代`,
        findBtn:            '搜尋',
        findPlaceholder:    '搜尋...',
        findResult:         ' 個結果 ',
        findError:          '查無結果',
        replaceBtn:         '取代',
        replacePlaceholder: '取代...',
        replaceResult:      ', 取代成 ',
        replaceError:       '查無結果',
        noneSelected:       '查無結果'
      }
    }
  });
  $.extend($.summernote.options, {
    findnreplace: {
      classHidden: 'note-display-none',
      icon:      '<i class="note-icon" data-toggle="findnreplace"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="12" height="12"><path d="m 5.8,2.3764705 c 0.941176,0 1.811765,0.376471 2.423529,1.011765 l -1.741176,1.741176 4.117647,0 0,-4.117647 -1.411765,1.411765 C 8.317647,1.5529415 7.117647,1.0117645 5.8,1.0117645 c -2.423529,0 -4.423529,1.788236 -4.752941,4.117647 l 1.388235,0 C 2.741176,3.5529415 4.129412,2.3764705 5.8,2.3764705 Z m 3.8588235,6.282353 c 0.4470585,-0.611764 0.7764705,-1.341176 0.8705885,-2.164706 l -1.388236,0 c -0.305882,1.552942 -1.694117,2.752942 -3.364705,2.752942 -0.941177,0 -1.811765,-0.376471 -2.42353,-1.011765 L 5.094118,6.4941175 1,6.4941175 1,10.611765 2.411765,9.2000005 C 3.282353,10.070589 4.482353,10.611765 5.8,10.611765 c 1.058824,0 2.047059,-0.352942 2.847059,-0.9411765 L 11.988235,12.988236 13,11.97647 9.6588235,8.6588235 Z"/></svg></i>'
    }
  });
  $.extend($.summernote.plugins, {
    'findnreplace': function (context) {
      var ui       = $.summernote.ui,
          $note    = context.layoutInfo.note,
          $editor  = context.layoutInfo.editor,
          $toolbar = context.layoutInfo.toolbar,
          $statusbar = context.layoutInfo.statusbar,
          options  = context.options,
          lang     = options.langInfo;

      if ($('#summernote-findnreplace-style').length == 0) {
        this.css = $(`
        <style>
          .findnreplaceToolbar {
            padding: 5px;
            background-color: var(--note-toolbar-background-color) !important;
            border-bottom: var(--note-toolbar-border-width) var(--note-toolbar-border-style) var(--note-toolbar-border-color);
          }
          .findnreplaceToolbar .note-form-group {
            padding: 0;
          }
          .note-display-none {
            display: none !important; }
          
          .note-display-block {
            display: block !important; }
          
          span.note-findnreplace {
            background-color: #ff0; }
        </style>`)
        this.css.attr('id', 'summernote-findnreplace-style')
        this.css.appendTo('head');
      }
      context.memo('button.findnreplace', function() {
        var button = ui.button({
          contents: options.findnreplace.icon,
          container: options.container,
          tooltip:  lang.findnreplace.tooltip,
          placement: options.placement,
          click: function (e) {
            e.preventDefault();
            $editor.find('.note-findnreplace').contents().unwrap('span');
            $toolbar.find('.findnreplaceToolbar').toggleClass(options.findnreplace.classHidden);
            $statusbar.find('.note-status-output').text('');
            if ($note.summernote('createRange').toString()) {
              var selected = $note.summernote('createRange').toString();
              $toolbar.find('.note-findnreplace-find').val(selected);
            }
          }
        });
        return button.render();
      });
      this.initialize = function () {
        this.fnrBody = $(
        '<div class="findnreplaceToolbar note-display-none">' +
          '<div class="note-form-group">' +
            '<input type="text" class="note-findnreplace-find note-input" value="" placeholder="' + lang.findnreplace.findPlaceholder + '">' +
            '<button class="note-findnreplace-find-btn btn btn-default note-btn" style="width:100px;">' + lang.findnreplace.findBtn + '</button>' +
          '</div>' +
          '<div class="note-form-group">' +
            '<input type="text" class="note-findnreplace-replace note-input" value="" placeholder="' + lang.findnreplace.replacePlaceholder + '">' +
            '<button class="note-findnreplace-replace-btn btn btn-default note-btn" style="width:100px;">' + lang.findnreplace.replaceBtn + '</button>' +
          '</div>' +
        '</div>');
        $toolbar.append(this.fnrBody);
        this.show();
      };
      this.findnreplace = function() {
        var $fnrFindBtn    = $toolbar.find('.note-findnreplace-find-btn');
        var $fnrReplaceBtn = $toolbar.find('.note-findnreplace-replace-btn');
        $fnrFindBtn.click(function (e) {
          e.preventDefault();
          $editor.find('.note-findnreplace').contents().unwrap('span');
          var fnrCode    = context.invoke('code');
          var fnrFind    = $toolbar.find('.note-findnreplace-find').val();
          var fnrReplace = $toolbar.find('.note-findnreplace-replace').val();
          var fnrCount   = (fnrCode.match(new RegExp(fnrFind + "(?![^<>]*>)", "gi")) || []).length
          if (fnrFind) {
            $statusbar.find('.note-status-output').text(fnrCount + lang.findnreplace.findResult + "`" + fnrFind + "`");
            var fnrReplaced = fnrCode.replace(new RegExp(fnrFind + "(?![^<>]*>)", "gi"), function(e){return '<span class="note-findnreplace">' + e + '</span>';});
            $note.summernote('code',fnrReplaced);
          } else
            $statusbar.find('.note-status-output').html(lang.findnreplace.findError);
        });
        $fnrReplaceBtn.click(function (e) {
          e.preventDefault();
          $editor.find('.note-findnreplace').contents().unwrap('span');
          var fnrCode    = context.invoke('code');
          var fnrFind    = $toolbar.find('.note-findnreplace-find').val();
          var fnrReplace = $toolbar.find('.note-findnreplace-replace').val();
          var fnrCount   = (fnrCode.match(new RegExp(fnrFind, "gi")) || []).length
          if (fnrFind) {
            $statusbar.find('.note-status-output').text(fnrCount + lang.findnreplace.findResult + "`" + fnrFind + "`" + lang.findnreplace.replaceResult +"`" + fnrReplace + "`");
            var fnrReplaced = fnrCode.replace(new RegExp(fnrFind + "(?![^<>]*>)", "gi"), fnrReplace);
            $note.summernote('code', fnrReplaced);
          } else {
            if (fnrReplace) {
              if ($note.summernote('createRange').toString()) {
                $note.summernote('insertText',fnrReplace);
                $statusbar.find('.note-status-output').text('');
              } else
                $statusbar.find('.note-status-output').html(lang.findnreplace.noneSelected);
            } else
              $statusbar.find('.note-status-output').html(lang.findnreplace.replaceError);
          }
        });
      };
      this.show = function() {
        this.findnreplace();
      };
      this.destroy = function () {
          !!this.css && $(this.css).remove()
          this.fnrBody.remove()
      };
    }
  });
}));
