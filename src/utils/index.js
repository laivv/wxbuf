export const getPage = function (context) {
  let p, page
  p = page = context.selectOwnerComponent()
  if (page === null) {
    return context.route ? context : null
  }
  while (p = page.selectOwnerComponent()) {
    page = p
  }
  return page.route ? page : null
}