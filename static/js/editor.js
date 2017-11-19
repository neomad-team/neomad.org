  const quill = new Quill('#editor', {
    modules: {
      toolbar: [   
        ['image', 'code-block'],
        ['clean'] 
      ]
    },
    theme: 'bubble'
  });

  document.querySelector('form[edit]').addEventListener('submit', event => {
    const form = event.target
    form.title.value = document.querySelector('#editor h1').innerHTML
    form.content.value = document.querySelector('#editor div').innerHTML
    form.published.value = event.explicitOriginalTarget.value
  })
