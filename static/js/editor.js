var editorTitle = new Quill('#editorTitle')

var editorContent = new Quill('#editorContent', {
  theme: 'bubble',
  modules: {
    toolbar: [
      ['bold', 'italic'],
      ['link', 'image']
    ]
  }
})

document.querySelector('form[edit]').addEventListener('submit', event => {
  const form = event.target
  form.title.value = editorTitle.getContents()
  form.content.value = editorContent.getContents()
  form.published.value = event.explicitOriginalTarget.value
})
