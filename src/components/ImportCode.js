module.exports = function () {
    require('bootstrap/dist/css/bootstrap.min.css')
    require('bootstrap/js/dist/modal')
    require('bootstrap/js/dist/dropdown')
    require('bootstrap/js/dist/tooltip')
    require('bootstrap/js/dist/tab')
    require('bootstrap/js/dist/popover')
    require('bootstrap/js/dist/collapse')
    require('popper.js/dist/popper.min.js')

    require('summernote/dist/summernote-bs4.css')
    require('summernote/dist/summernote-bs4.js')
    // require('summernote/dist/lang/summernote-zh-TW')
    require('../plugin/lang/summernote-zh-TW')

    require('../plugin/custom/summernote-patch-dom')
    require('../plugin/custom/summernote-patch-handle')

    require('../plugin/custom/summernote-custom')
    require('../plugin/custom/summernote-custom-contextmenu')
    require('../plugin/custom/summernote-custom-font')
    require('../plugin/custom/summernote-custom-specialchars')
    require('../plugin/custom/summernote-custom-style')
    require('../plugin/custom/summernote-fontsize-input')
    require('../plugin/custom/summernote-imagemap')
    require('../plugin/custom/summernote-comment-popover')
    require('../plugin/custom/summernote-copy-formatting')
    require('../plugin/custom/summernote-custom-cleaner')
    require('../plugin/custom/summernote-pastehtml')
    require('../plugin/custom/summernote-toc')
    require('../plugin/custom/summernote-view-classlist')
    // require('../plugin/emoji/summernote-ext-emoji-ajax')
    // require('../plugin/emoji/summernote-ext-emoji-ajax.css')
    require('../plugin/formatting/summernote-addclass')
    require('../plugin/formatting/summernote-case-converter')
    require('../plugin/formatting/summernote-image-attributes')
    require('../plugin/formatting/summernote-image-captionit')
    require('../plugin/formatting/summernote-image-shapes')
    require('../plugin/formatting/summernote-list-styles')
    require('../plugin/formatting/summernote-list-styles.css')
    require('../plugin/formatting/summernote-pagebreak')
    require('../plugin/formatting/summernote-video-attr-setter')
    require('../plugin/insert/summernote-at-mention')
    require('../plugin/insert/summernote-file')
    require('../plugin/insert/summernote-element-template')
    // require('../plugin/misc/summernoteDrafts')
    require('../plugin/misc/summernote-ext-print')
    require('../plugin/misc/summernote-text-findnreplace')
    require('../plugin/misc/summernote-ext-table')
    require('../plugin/misc/summernote-ext-table.css')
    // require('../plugin/special_characters/summernote-ext-specialchars')

    //require('react-summernote/plugin/syntax/summernote-ext-highlight')
    //require('react-summernote/plugin/syntax/run_prettify')

}