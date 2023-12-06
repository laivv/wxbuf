export const pages = []
export const components = []

export function addPage(ob) {
  pages.push(ob)
}

export function removePage(ob) {
  const index = pages.indexOf(ob)
  const page = pages[index] || null
  if (index > -1) {
    pages.splice(index, 1)
  }
  return page
}

export function addCom(ob) {
  components.push(ob)
}

export function removeCom(context) {
  const index = components.findIndex(c => c.context === context)
  const com = components.find(c => c.context === context)
  if (index > -1) {
    components.splice(index, 1)
  }
  return com
}