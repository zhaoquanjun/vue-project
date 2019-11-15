import Quill from 'quill'
let BlockEmbed = Quill.import('blots/block/embed')
let Link = Quill.import('formats/link')


export default class Video extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('src', this.sanitize(value.url));
    node.setAttribute('controls', 'controls');
    node.setAttribute('width', value.width);
    node.setAttribute('height', value.height);
    node.setAttribute('webkit-playsinline', true);
    node.setAttribute('playsinline', true);
    node.setAttribute('x5-playsinline', true);
    let dragP = document.createElement('p');
    let dragPStyle="position:absolute; top:0; left:0; display:none; border:2px solid rgb(170, 24, 121); border-radius:50%; width:8px; height:8px; cursor:nesw-resize; ";
    dragP.setAttribute('class', 'ql-dragHandler');
    dragP.setAttribute('style', dragPStyle);
    document.getElementsByClassName("ql-editor")[0].append(dragP);
    return node;
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }
}

Video.blotName = 'video';
Video.className = 'ql-video-content';
Video.tagName = 'video';