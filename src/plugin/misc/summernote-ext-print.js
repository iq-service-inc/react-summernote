(function (factory) {
    /* global define */
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
    // Extends lang for print plugin.
    $.extend(true, $.summernote.lang, {
      'en-US': {
        print: {
          print: 'Print'
        }
      },
      'ko-KR': {
        print: {
          print: '인쇄'
        }
      },
      'pt-BR': {
        print: {
          print: 'Imprimir'
        }
      },
      'zh-TW': {
        print: {
          print: '列印'
        }
      }
    });
  
    // Extends plugins for print plugin.
    $.extend($.summernote.plugins, {
      /**
       * @param {Object} context - context object has status of editor.
       */
      'print': function (context) {
        var self = this;
  
        // ui has renders to build ui elements.
        //  - you can create a button with `ui.button`
        var ui = $.summernote.ui;
        var $editor = context.layoutInfo.editor;
        var options = context.options;
        var lang = options.langInfo;
  
        var isFF = function () {
          const userAgent = navigator.userAgent;
          const isEdge = /Edge\/\d+/.test(userAgent);
          return !isEdge && /firefox/i.test(userAgent)
        }
  
        var fillContentAndPrint = function($frame, content) {
          $frame.contents().find('body').html(content);
  
          setTimeout(function () {
            $frame[0].contentWindow.focus();
            $frame[0].contentWindow.print();
            $frame.remove();
            $frame = null;
          }, 250);
        }
  
        var getPrintframe = function ($container) {
          var $frame = $(
            '<iframe name="summernotePrintFrame"' +
            'width="0" height="0" frameborder="0" src="about:blank" style="visibility:hidden">' +
            '</iframe>');
          $frame.appendTo($editor.parent());
  
          var $head = $frame.contents().find('head');
          if (options.print && options.print.stylesheetUrl) {
            // Use dedicated styles
            var css = document.createElement('link');
            css.href = options.print.stylesheetUrl;
            css.rel = 'stylesheet';
            css.type = 'text/css';
            $head.append(css);
          } else {
            // Inherit styles from document
            $('style, link[rel=stylesheet]', document).each(function () {
              $head.append($(this).clone());
            });
          }
          // pagebreak plugin
          $head.append('<style>@media all{body .page-break{position:relative;display:block;width:100%;height:1px;background-color:#ddd;margin:15px 0;}body .page-break:after{content:"Page-Break";position:absolute;width:100%;height:20px;top:-10px;color:#ddd;-webkit-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;-moz-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-align:center;}}@media print{body .page-break{display:block;page-break-before:always;}body .page-break:after{visibility:hidden}}</style>')
          return $frame;
        };
  
        // add print button
        context.memo('button.print', function () {
          // create button
          var button = ui.button({
            // contents: '<i class="fa fa-print"/> ' + lang.print.print,
            contents: `<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
            </svg></i>`,
            tooltip: lang.print.print,
            container: options.container,
            click: function () {
              var $frame = getPrintframe();
              var content = context.invoke('code');
  
              if (isFF()) {
                $frame[0].onload = function () {
                  fillContentAndPrint($frame, content);
                };
              } else {
                fillContentAndPrint($frame, content);
              }
            }
          });
          return button.render();
        });
      }
    });
  }));