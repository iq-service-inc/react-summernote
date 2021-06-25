/* https://github.com/DiemenDesign/summernote-pagebreak */
(function(factory) {
    if(typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory(require('jquery'));
    } else {
      factory(window.jQuery);
    }
  }
  (function($) {
    $.extend(true,$.summernote.lang, {
      'en-US': {
        pagebreak: {
          tooltip: 'Page Break'
        }
      },
      'zh-TW': {
        pagebreak: {
          tooltip: '分頁符號'
        }
      }
    });
    $.extend($.summernote.options, {
      pagebreak: {
        icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="M 4,5.5 4,1 l 9,0 0,4.5 -0.750612,0 0,-3.74939 -7.498776,0 0,3.75061 L 4,5.50122 Z M 13,7.75061 13,13 4,13 4,7.75061 l 0.750612,0 0,4.5 7.5,0 0,-4.5 0.749388,0 z m -6,-1.5 1.5,0 L 8.5,7 7,7 7,6.25061 Z m -2.249388,0 1.5,0 0,0.74939 -1.5,0 0,-0.74939 z m 4.5,0 1.5,0 0,0.74939 -1.5,0 0,-0.74939 z m 2.249388,0 1.5,0 L 13,7 11.5,7 11.5,6.25061 Z M 1,4.37469 3.250612,6.62531 1,8.87469 l 0,-4.5 z"/></svg></i>',
        css: '@media all{.note-editable .page-break{position:relative;display:block;width:100%;height:1px;background-color:#ddd;margin:15px 0;}.note-editable .page-break:after{content:"Page-Break";position:absolute;width:100%;height:20px;top:-10px;color:#ddd;-webkit-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;-moz-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-align:center;}}@media print{.note-editable .page-break{display:block;page-break-before:always;}}'
      }
    });
    $.extend($.summernote.plugins, {
      'pagebreak': function(context) {
        var ui      = $.summernote.ui;
        var options = context.options;
        var lang    = options.langInfo;
        var $editable = context.layoutInfo.editable
        var self = this

        if ($('#summernote-pagebreak-style').length == 0) {
          this.css = $('<style>').html(options.pagebreak.css)
          this.css.attr('id', 'summernote-pagebreak-style')
          $("head").append(this.css);
        }

        this.wrapCommand = function (fn) {
          return function() {
              context.invoke("beforeCommand");
              fn.apply(this, arguments);
              context.invoke("afterCommand");
          }
        }
        this.destroy = function () {
            !!this.css && $(this.css).remove()
        };
        context.memo('button.pagebreak',function() {
          var button = ui.button({
            contents: options.pagebreak.icon,
            tooltip:  lang.pagebreak.tooltip,
            container: 'body',
            click: self.wrapCommand(function (e) {
              e.preventDefault();
              if (getSelection().rangeCount > 0) {
                var el = getSelection().getRangeAt(0).commonAncestorContainer.parentNode;
                if ($(el).hasClass('note-editable')) {
                  el = getSelection().getRangeAt(0).commonAncestorContainer;
                }
                if (!$(el).hasClass('page-break')) {
                  if ($(el).next('div.page-break').length < 1)
                    $('<div class="page-break"></div><p><br></p>').insertAfter(el);
                }
              } else {
                if ($editable.find('div').last().attr('class') !== 'page-break')
                  $editable.append('<div class="page-break"></div><p><br></p>');
              }
  
              // Launching this method to force Summernote sync it's content with the bound textarea element
              // context.invoke('editor.insertText','');
            })
          });
          return button.render();
        });
      }
    });
  }));