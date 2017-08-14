url = window.location.href

searchField = url.split('?q=')

if (searchField[1] === '') {
  alert('no search detect', 'Fill the search field please', 2000)
} else {
  search = searchField[1].replace('+', ' ')

  form = document.querySelectorAll('#search input')
  form.forEach( input => {
    if (input.placeholder) {
      input.value = search
    }
  })
}
