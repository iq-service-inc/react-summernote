module.exports = function(){
    require('bootstrap/dist/css/bootstrap.min.css')
    require('bootstrap/js/dist/modal')
    require('bootstrap/js/dist/dropdown')
    require('bootstrap/js/dist/tooltip')
    require('summernote/dist/summernote-bs4.css')
    require('summernote/dist/summernote-bs4.min.js')
    
    require('summernote/dist/lang/summernote-zh-TW')
    require('react-summernote/plugin/custom/summernote-custom')
    require('react-summernote/plugin/custom/summernote-toc')
    
    require('react-summernote/plugin/emoji/summernote-ext-emoji-ajax')
    require('react-summernote/plugin/emoji/summernote-ext-emoji-ajax.css')

    require('react-summernote/plugin/formatting/summernote-addclass')
    require('react-summernote/plugin/formatting/summernote-case-converter')
    require('react-summernote/plugin/formatting/summernote-image-captionit')
    require('react-summernote/plugin/formatting/summernote-image-shapes')
    require('react-summernote/plugin/formatting/summernote-list-styles')
    require('react-summernote/plugin/formatting/summernote-list-styles.css')
    require('react-summernote/plugin/formatting/summernote-pagebreak')
    require('react-summernote/plugin/formatting/summernote-video-attributes')

    require('react-summernote/plugin/insert/summernote-at-mention')
    require('react-summernote/plugin/insert/summernote-file')
    require('react-summernote/plugin/insert/summernote-element-template')

    require('react-summernote/plugin/misc/summernoteDrafts')
    require('react-summernote/plugin/misc/summernote-ext-print')
    require('react-summernote/plugin/misc/summernote-text-findnreplace')
    require('react-summernote/plugin/misc/summernote-ext-table')
    require('react-summernote/plugin/misc/summernote-ext-table.css')

    require('react-summernote/plugin/special_characters/summernote-ext-specialchars')

    //require('react-summernote/plugin/syntax/summernote-ext-highlight')
    //require('react-summernote/plugin/syntax/run_prettify')
}