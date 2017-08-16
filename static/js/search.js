search = window.location.search.split('?q=')

if (search[1] === '') {
  alert('no search detect', 'Fill the search field please', 2000)
} else {
  search = search[1].split('+').toString().replace(/,/ig, ' ')
  form = document.querySelectorAll('#search input')
  form.forEach( input => {
    input.setAttribute('class', 'active')
    if (input.placeholder) {
      input.value = search
    }
  })
}
