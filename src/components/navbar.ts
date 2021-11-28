class Navbar {
  links: string[]
  parent: HTMLElement
  uniq: string

  constructor(links: string[], parent = document.body) {
    this.links = links
    this.parent = parent
    this.uniq = `navbar-${Math.floor(Math.random() * 10000)}`
    this.render()
  }

  set setLinks(links: string[]) {
    this.links = links
    this.render()
  }

  render(): void {
    this.parent.innerHTML = `<nav class="relative flex items-center justify-between sm:h-10 lg:justify-start">
    <ul class="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
        ${this.links.map((link) => `<li><a href="${link}">${link}</a></li>`).join('')}
    </ul>
</nav>
`
  }
}

export default Navbar
