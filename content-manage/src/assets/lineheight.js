import Quill from 'quill'
let Parchment = Quill.import('parchment')

class LineHeightStyleAttributor extends Parchment.Attributor.Style {

}
let LineHeight = new LineHeightStyleAttributor('lineheight', 'line-height', {
    scope: Parchment.Scope.BLOCK,
    whitelist: [false, "10px", "18px", "20px", "32px"]
});

export default LineHeight;
