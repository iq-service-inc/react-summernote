/* https://github.com/DiemenDesign/summernote-image-shapes */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
      define(['jquery'],factory)
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory(require('jquery'));
    } else {
      factory(window.jQuery)
    }
  }
  (function ($) {
    $.extend(true,$.summernote.lang, {
      'en-US': {
        imageShapes: {
          tooltip: 'Image Shapes',
          tooltipShapeOptions: ['Responsive', 'Rounded', 'Circle', 'Thumbnail', 'None']
        }
      },
      'zh-TW': {
        imageShapes: {
          tooltip: '圖片外框',
          tooltipShapeOptions: ['自動', '圓角', '圓形', '縮圖', '無']
        }
      },
    });
    $.extend($.summernote.options, {
      imageShapes: {
        icon: '<i class="note-icon-picture"></i>',
        /* Must keep the same order as in lang.imageAttributes.tooltipShapeOptions */
        shapes: ['img-fluid', 'rounded', 'rounded-circle', 'img-thumbnail', '']
      }
    });
    $.extend($.summernote.plugins, {
      'imageShapes': function(context) {
        var ui        = $.summernote.ui,
            $editable = context.layoutInfo.editable,
            options   = context.options,
            lang      = options.langInfo,
            dom = $.summernote.dom,
            modules   = context.modules;
        context.memo('button.imageShapes', function() {
          var button = ui.buttonGroup([
            ui.button({
              className: 'dropdown-toggle',
              contents: options.imageShapes.icon + '&nbsp;&nbsp;<span class="caret"></span>',
              tooltip: lang.imageShapes.tooltip,
              data: {
                toggle: 'dropdown'
              },
              click: function (e) {
                var $target = $(e.target),
                  $toggle = $target.closest('.dropdown-toggle')
                var img = $($editable.data('target')),
                  left = $target.closest('.popover').css('left'),
                  top = $target.closest('.popover').css('top'),
                  height = $target.css('height')
                setTimeout(() => {
                  modules.handle.update(img[0], e)
                  var $popover = $target.closest('.popover'),
                    $dropdown = $toggle.next('.dropdown-menu')
                  $popover.css({
                    left: left,
                    top: top
                  })
                  $dropdown.css({
                    transform: `translate3d(0px, ${height}, 0px)`
                  })
                }, 0);
              }
            }),
            ui.dropdown({
              className: 'dropdown-shape',
              items: lang.imageShapes.tooltipShapeOptions,
              click: function (e) {
                var $button = $(e.target);
                var $img    = $($editable.data('target'));
                var index   = $.inArray(
                  $button.data('value'),
                  lang.imageShapes.tooltipShapeOptions
                );
                $.each(options.imageShapes.shapes, function (index,value) {
                  $img.removeClass(value);
                });
                $img.addClass(options.imageShapes.shapes[index]);
                context.invoke('editor.afterCommand');
              }
            })
          ]);
          return button.render();
        });
      }
    });
  }));