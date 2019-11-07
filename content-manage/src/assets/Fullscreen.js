/**
 * 编辑器的全屏实现
 */
import noScroll from 'no-scroll'

export default class Fullscreen {
    constructor (quill, options = {}) {
        this.quill = quill
        this.options = options
        this.fullscreen = false
        this.editorContainer = this.quill.container.parentNode.parentNode
        this.editorDiv = this.quill.container
    }

    handle() {
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        windowHeight= (windowHeight-100) < 400 ? 400 : windowHeight - 100;
        if (! this.fullscreen) {
            this.fullscreen = true
            this.editorContainer.className = 'ql-editor ql-blank editor-fullscreen'
            this.editorDiv.style.height = windowHeight + 'px';
            noScroll.on()
        }else{
            this.fullscreen = false
            this.editorContainer.className = 'ql-editor ql-blank'
            this.editorDiv.style.height =  '400px';
            noScroll.off()
        }
    }
} 