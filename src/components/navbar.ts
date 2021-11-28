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
<style>
.${this.uniq} {
    position        : fixed;
    top             : 0;
    left            : 0;
    width           : 100%;
    height          : 50px;
    background-color: #fff;
    z-index         : 100;
    box-shadow      : 0 0 5px rgba(0, 0, 0, 0.2);

}
.${this.uniq} > ul {
  display     : flex;
  list-style  : none;
  padding-left: 0;
  margin-left : 0;

 
}
.${this.uniq} > ul > li {
  margin-right: 20px;

  
}
.${this.uniq} > ul > li > a {
  color          : #333;
  text-decoration: none;
  font-size      : 14px;
  font-weight    : bold;

 
}
.${this.uniq} > ul > li > a:hover {
  color: #000;
}
</style>

`
  }
}

export default Navbar
