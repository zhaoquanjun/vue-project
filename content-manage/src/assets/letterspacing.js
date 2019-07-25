import Quill from 'quill'
let Parchment = Quill.import('parchment')

class LetterSpacingStyleAttributor extends Parchment.Attributor.Style {

}
let LetterSpacing = new LetterSpacingStyleAttributor('letterspacing', 'letter-spacing', {
    scope: Parchment.Scope.BLOCK,
    whitelist: [false, "5px", "8px", "10px", "15px"]
});

export default LetterSpacing;
