import Quill from 'quill'
let Inline = Quill.import('blots/inline')

class Link extends Inline {
  static create(value) {
    let node = super.create(value.Href);
    value.Href = this.sanitize(value.Href);
    node.setAttribute('href', value.Href);
    node.setAttribute('rel', 'noopener noreferrer');
    node.setAttribute('target', value.Target);
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute('href');
  }

  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value) return super.format(name, value);
    value = this.constructor.sanitize(value);
    this.domNode.setAttribute('href', value);
  }
}
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel'];


function sanitize(url, protocols) {
  let anchor = document.createElement('a');
  anchor.href = url;
  let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

export { Link as default, sanitize };