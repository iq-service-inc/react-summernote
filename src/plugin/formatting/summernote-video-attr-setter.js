/* https://github.com/DiemenDesign/summernote-video-attributes */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
}(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': { /* English */
      videoAttrSetter: {
        dialogTitle: 'Edit Video Attributes',
        href: 'URL',
        autoplay: 'Autoplay',
        loop: 'Loop',
        muted: 'Muted',
        preload: 'Preload',
        auto: 'Auto',
        metadata: 'Metadata',
        none: 'None',
        ok: 'OK'
      }
    },
    'zh-TW': {
      videoAttrSetter: {
        dialogTitle: '編輯影片屬性',
        href: '影片連結 (src)',
        autoplay: '自動播放 (autoplay)',
        loop: '循環播放 (loop)',
        muted: '靜音 (muted)',
        preload: '預載 (preload)',
        auto: '自動 (auto)',
        metadata: '僅屬性 (metadata)',
        none: '不預載 (none)',
        note: 'Note: Not all options are available with all services...',
        ok: '確認'
      }
    }
  });

  var defaults = {
    showAutoplay: true,
    showLoop: true,
    showMute: true,
    showPreload: true,

    editIcon: `<svg style="width:14px; height:14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1 .8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"/></svg>`,

    deleteIcon: `<svg style="width:14px; height:14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.7 23.7 0 0 0 -21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0 -16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg>`
  };

  $.extend($.summernote.options, {
    videoAttrSetter: defaults
  });

  $.extend($.summernote.plugins, {
    'videoAttrSetter': function (context) {
      var self = this,
        ui = $.summernote.ui,
        $editor = context.layoutInfo.editor,
        $editable = context.layoutInfo.editable,
        options = context.options,
        lang = options.langInfo;

      this.initialize = function () {
        var $container = options.dialogsInBody ? $(document.body) : $editor;
        var body =
          '<div class="form-group">' +
          '  <label for="note-video-attributes-href" class="control-label col-xs-3">' + lang.videoAttrSetter.href + '</label>' +
          '  <div class="input-group col-xs-9">';


        var a = options.videoAttrSetter.videoUrls;
        var b = Array.isArray(options.videoAttrSetter.videoUrls);

        if ((options.videoAttrSetter.videoUrls !== undefined) && Array.isArray(options.videoAttrSetter.videoUrls)) {
          body += ' <select class="note-video-attributes-href form-control">';
          options.videoAttrSetter.videoUrls.forEach(element => body += ' <option value="' + element + '">' + element + '</option>');
          body += ' </select>';
        }
        else {
          body += '<input type="text" class="note-video-attributes-href form-control">';
        }

        body += '  </div>' +
          '</div>';

        // 自動播放
        if (options.videoAttrSetter.showAutoplay === true) {
          body += '<div class="form-group clearfix">' +
            '  <div class="control-label col-xs-3"></div>' +
            '  <div class="input-group col-xs-9">' +
            '    <div class="checkbox checkbox-success">' +
            '      <input type="checkbox" id="note-video-attributes-autoplay-checkbox" class="note-video-attributes-autoplay-checkbox">' +
            '      <label for="note-video-attributes-autoplay-checkbox">' + lang.videoAttrSetter.autoplay + '</label>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        }

        // 循環播放
        if (options.videoAttrSetter.showLoop === true) {
          body += '<div class="form-group clearfix">' +
            '  <div class="control-label col-xs-3"></div>' +
            '  <div class="input-group col-xs-9">' +
            '    <div class="checkbox checkbox-success">' +
            '      <input type="checkbox" id="note-video-attributes-loop-checkbox" class="note-video-attributes-loop-checkbox">' +
            '      <label for="note-video-attributes-loop-checkbox">' + lang.videoAttrSetter.loop + '</label>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        }

        // 靜音
        if (options.videoAttrSetter.showMute === true) {
          body += '<div class="form-group clearfix">' +
            '  <div class="control-label col-xs-3"></div>' +
            '  <div class="input-group col-xs-9">' +
            '    <div class="checkbox checkbox-success">' +
            '      <input type="checkbox" id="note-video-attributes-mute-checkbox" class="note-video-attributes-mute-checkbox">' +
            '      <label for="note-video-attributes-mute-checkbox">' + lang.videoAttrSetter.muted + '</label>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        }

        if (options.videoAttrSetter.showPreload === true) {
          body += '<div class="form-group">' +
            '  <label for="note-video-attributes-video-preload" class="control-label col-xs-3">' + lang.videoAttrSetter.preload + '</label>' +
            '  <div class="input-group col-xs-9">' +
            '    <select id="note-video-attributes-preload" class="note-video-attributes-preload form-control col-xs-6" readonly="readonly">' +
            '      <option value="0" selected>' + lang.videoAttrSetter.auto + '</option>' +
            '      <option value="1">' + lang.videoAttrSetter.metadata + '</option>' +
            '      <option value="2">' + lang.videoAttrSetter.none + '</option>' +
            '    </select>' +
            '  </div>' +
            '</div>';
        }

        body += '<div class="form-group">' +
          '  <div class="col-xs-3"></div>' +
          '</div>'
        this.$dialog = ui.dialog({
          title: lang.videoAttrSetter.dialogTitle,
          body: body,
          footer: '<button href="#" class="btn btn-primary note-video-attributes-btn">' + lang.videoAttrSetter.ok + '</button>'
        }).render().appendTo($container);

      };

      this.editBtn = $('<button>').addClass('note-btn btn btn-light btn-sm faq-reference-popover-edit-btn').html(`<i class="note-icon">${options.videoAttrSetter.editIcon}</i>`)

      this.deleteBtn = $('<button>').addClass('note-btn btn btn-light btn-sm faq-reference-popover-delete-btn').html(`<i class="note-icon">${options.videoAttrSetter.deleteIcon}</i>`)

      this.faqRefPopoverDiv = $('<div>').addClass('popover').css({ display: 'none', padding: '5px' })
      this.faqRefPopoverDiv.append(this.editBtn).append(this.deleteBtn)
      this.faqRefPopoverDiv.appendTo('body');

      let element
      let sourceElement
      var videoUrl
      var isAutoPlay
      var isLoop
      var isMuted
      var isPreload

      $(document).on('click', function (event) {
        if (!$(event.target).closest('video').length) {
          self.faqRefPopoverDiv.css({ display: 'none' });
        }
      });

      this.events = {
        'summernote.mousedown': function (we, e) {
          element = e.target;
          sourceElement = element.querySelector('source');
          var srcValue = sourceElement.getAttribute('src');

          var mouseX = e.pageX;
          var mouseY = e.pageY;
          if (element.nodeName.toLowerCase() === 'video') {
            e.preventDefault();
            self.faqRefPopoverDiv.css({ display: 'block', padding: '5px', top: `${mouseY}px`, left: `${mouseX}px` })


            videoUrl = srcValue || ''
            isAutoPlay = $(element).attr('autoplay');
            isLoop = $(element).attr('loop');
            isMuted = $(element).attr('muted') !== undefined;
            isPreload = $(element).attr('preload');
          } else {
            self.faqRefPopoverDiv.css({ display: 'none' })
          }
        }
      }

      this.editBtn.on('click', function (event) {
        ui.showDialog(self.$dialog);

        $videoHref = self.$dialog.find('.note-video-attributes-href'),
          $videoAutoplay = self.$dialog.find('.note-video-attributes-autoplay-checkbox'),
          $videoLoop = self.$dialog.find('.note-video-attributes-loop-checkbox'),
          $videoMute = self.$dialog.find('.note-video-attributes-mute-checkbox'),
          $videoPreload = self.$dialog.find('.note-video-attributes-preload')

        $videoHref.val(videoUrl)
        $videoAutoplay.prop('checked', !!isAutoPlay)
        $videoLoop.prop('checked', !!isLoop)
        $videoMute.prop('checked', !!isMuted)


        switch (isPreload) {
          case 'auto':
            $videoPreload.val('0')
            break;
          case 'metadata':
            $videoPreload.val('1')
            break;
          case 'none':
            $videoPreload.val('2')
            break;

          default:
            $videoPreload.val('0')
            break;
        }

        var preloadStatus = lang.videoAttrSetter.auto

        if ($videoPreload.val() === "0") preloadStatus = lang.videoAttrSetter.auto;
        if ($videoPreload.val() === "1") preloadStatus = lang.videoAttrSetter.metadata;
        if ($videoPreload.val() === "2") preloadStatus = lang.videoAttrSetter.none;

        self.$dialog.find('.note-video-attributes-btn').on('click', function (event) {
          event.preventDefault();

          if (!!$videoHref.val()) {
            $(sourceElement).attr('src', $videoHref.val())
          } else {
            $(sourceElement).attr('src', '')
          }

          if (!!$videoAutoplay.prop('checked')) {
            $(element).attr('autoplay', '')
          } else {
            $(element).removeAttr('autoplay')
          }

          if (!!$videoLoop.prop('checked')) {
            $(element).attr('loop', '')
          } else {
            $(element).removeAttr('loop')
          }

          if (!!$videoMute.prop('checked')) {
            $(element).attr('muted', '')
          } else {
            $(element).removeAttr('muted')
          }

          switch (parseInt($videoPreload.val())) {
            case 0:
              $(element).attr('preload', 'auto')
              break;
            case 1:
              $(element).attr('preload', 'metadata')
              break;
            case 2:
              $(element).attr('preload', 'none')
              break;
            default:
              break;
          }
          ui.hideDialog(self.$dialog);
        });
      })

      this.deleteBtn.on('click', function (event) {
        $(element).remove();
      })
    }
  });
}));