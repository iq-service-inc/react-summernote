module.exports = function(){
    require('bootstrap/dist/css/bootstrap.min.css')
    require('bootstrap/js/dist/modal')
    require('bootstrap/js/dist/dropdown')
    require('bootstrap/js/dist/tooltip')
    require('summernote/dist/summernote-bs4.css')
    require('summernote/dist/summernote-bs4.min.js')
    
    require('summernote/dist/lang/summernote-zh-TW')
    require('react-summernote/src/plugin/custom/summernote-custom')
    require('react-summernote/src/plugin/custom/summernote-toc')
    
    require('react-summernote/src/plugin/emoji/summernote-ext-emoji-ajax')
    require('react-summernote/src/plugin/emoji/summernote-ext-emoji-ajax.css')

    require('react-summernote/src/plugin/formatting/summernote-addclass')
    require('react-summernote/src/plugin/formatting/summernote-case-converter')
    require('react-summernote/src/plugin/formatting/summernote-image-captionit')
    require('react-summernote/src/plugin/formatting/summernote-image-shapes')
    require('react-summernote/src/plugin/formatting/summernote-list-styles')
    require('react-summernote/src/plugin/formatting/summernote-list-styles.css')
    require('react-summernote/src/plugin/formatting/summernote-pagebreak')
    require('react-summernote/src/plugin/formatting/summernote-video-attributes')

    require('react-summernote/src/plugin/insert/summernote-at-mention')
    require('react-summernote/src/plugin/insert/summernote-file')
    require('react-summernote/src/plugin/insert/summernote-element-template')

    require('react-summernote/src/plugin/misc/summernoteDrafts')
    require('react-summernote/src/plugin/misc/summernote-ext-print')
    require('react-summernote/src/plugin/misc/summernote-text-findnreplace')
    require('react-summernote/src/plugin/misc/summernote-ext-table')
    require('react-summernote/src/plugin/misc/summernote-ext-table.css')

    require('react-summernote/src/plugin/special_characters/summernote-ext-specialchars')

    require('react-summernote/src/plugin/syntax/summernote-ext-highlight')
    require('react-summernote/src/plugin/syntax/run_prettify')
}