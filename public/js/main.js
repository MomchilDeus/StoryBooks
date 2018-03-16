$(document).ready( () => {
    $('.button-collapse').sideNav()
    $('select').material_select()

    // CKEDITOR.replace('body', {
    //     plugins: 'wysiwygarea,toolbar,basicstyles,link'
    // })
    const editor = new Jodit('#editor', {
        defaultMode: Jodit.MODE_SPLIT
    });
    
    // Props docs
    // https://xdsoft.net/jodit/doc/#-config
})