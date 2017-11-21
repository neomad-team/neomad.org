const title = document.querySelector('[name=title]')
const content = new Quill('.content', {
  theme: 'bubble',
  modules: {
    toolbar: [
      ['bold', 'italic'],
      ['link', 'image']
    ]
  }
})

title.setAttribute('contenteditable', true)

document.querySelector('form[edit]').addEventListener('submit', event => {
  const form = event.target
  form.title.value = title.innerHTML
  form.content.value = content.getContents()
  form.published.value = event.explicitOriginalTarget.value
})
