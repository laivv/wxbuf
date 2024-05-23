export const getPage = function (context) {
  let p
  while (p = context.selectOwnerComponent()) {
    context = p
  }
  return context.route ? context : null
}