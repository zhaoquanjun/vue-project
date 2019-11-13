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
Video.className = 'ql-video';
Video.tagName = 'video';