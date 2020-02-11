console.debug('>>>', document.querySelectorAll('article .content img'))
debugger
Array.from(document.querySelectorAll('article .content img')).forEach(img => {
  const rects = img.getClientRects()[0]
  img.style.width = `${rects.right}px`
  img.style.marginLeft = `-${rects.left / 2}px`
})
