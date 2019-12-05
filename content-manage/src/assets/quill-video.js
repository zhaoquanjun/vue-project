import Quill from 'quill'
let BlockEmbed = Quill.import('blots/block/embed')
let Link = Quill.import('formats/link')


export default class Video extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute("style","width:100%;height:100%");
    let video= document.createElement('video');
    video.setAttribute('class','ql-video-content');
    video.setAttribute('vsrc', this.sanitize(value.url));
    video.setAttribute('controls', 'controls');
    video.setAttribute('style',`width:${value.width};height:${value.height};`)
    video.setAttribute('webkit-playsinline', true);
    video.setAttribute('playsinline', true);
    video.setAttribute('x5-playsinline', true);
    video.setAttribute('poster',value.poster)
    let dragP = document.createElement('p');
    let dragPStyle=" ";
    dragP.setAttribute('class', 'ql-dragHandler');
    dragP.setAttribute('style', dragPStyle);
    node.append(video);
    node.append(dragP);
    //document.getElementsByClassName("ql-editor")[0].append(dragP);
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
Video.className = 'ql-video-par';
Video.tagName = 'p';