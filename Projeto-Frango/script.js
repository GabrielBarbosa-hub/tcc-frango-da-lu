/* =====================================================
   Frango Assado da Lú — frango.js
   JavaScript ES6+: menu mobile, navbar ao rolar e
   validação do formulário de contato.
   ===================================================== */

class Navbar {
  constructor(navbarEl, menuToggleEl, navLinksEl) {
    this.navbar = navbarEl;
    this.menuToggle = menuToggleEl;
    this.navLinks = navLinksEl;
    this.mobileBreakpoint = 1024;

    this.bindEvents();
    this.updateScrollState();
  }

  bindEvents() {
    this.menuToggle?.addEventListener("click", () => this.toggleMenu());

    this.navLinks
      ?.querySelectorAll("a")
      .forEach((link) =>
        link.addEventListener("click", () => this.closeMenu()),
      );

    window.addEventListener("scroll", () => this.updateScrollState(), {
      passive: true,
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > this.mobileBreakpoint) this.closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closeMenu();
    });
  }

  toggleMenu() {
    const isOpen = this.navLinks.classList.toggle("open");
    this.menuToggle.classList.toggle("open", isOpen);
    this.menuToggle.setAttribute("aria-expanded", String(isOpen));
  }

  closeMenu() {
    this.navLinks.classList.remove("open");
    this.menuToggle.classList.remove("open");
    this.menuToggle.setAttribute("aria-expanded", "false");
  }

  updateScrollState() {
    this.navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
}

class ContactForm {
  constructor(formEl) {
    this.form = formEl;
    this.fields = {
      nome: this.form.querySelector("#nome"),
      telefone: this.form.querySelector("#telefone"),
      mensagem: this.form.querySelector("#mensagem"),
    };
    this.errorEls = {
      nome: this.form.querySelector("#erro-nome"),
      telefone: this.form.querySelector("#erro-telefone"),
      mensagem: this.form.querySelector("#erro-mensagem"),
    };
    this.successEl = document.getElementById("formSucesso");

    this.validators = {
      nome: (value) => (value.trim() ? "" : "Por favor, informe seu nome."),
      telefone: (value) => this.validarTelefone(value),
      mensagem: (value) =>
        value.trim() ? "" : "Por favor, escreva sua mensagem.",
    };

    this.bindEvents();
  }

  validarTelefone(value) {
    if (!value.trim()) return "Por favor, informe seu telefone.";
    const digitos = value.replace(/\D/g, "");
    const valido = digitos.length >= 10 && digitos.length <= 11;
    return valido ? "" : "Informe um telefone válido com DDD.";
  }

  bindEvents() {
    this.form.addEventListener("submit", (event) => this.handleSubmit(event));

    Object.entries(this.fields).forEach(([name, field]) => {
      field?.addEventListener("input", () => this.clearError(name));
    });
  }

  validate() {
    const erros = Object.entries(this.fields).map(([name, field]) => {
      const mensagem = this.validators[name](field.value);
      this.setError(name, mensagem);
      return mensagem;
    });

    return erros.every((mensagem) => mensagem === "");
  }

  setError(name, mensagem) {
    const span = this.errorEls[name];
    if (span) span.textContent = mensagem;
  }

  clearError(name) {
    this.setError(name, "");
  }

  handleSubmit(event) {
    event.preventDefault();
    this.successEl.classList.remove("show");

    if (!this.validate()) return;

    /* Sem backend conectado: confirma visualmente o envio */
    this.successEl.classList.add("show");
    this.form.reset();
    this.successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const navbarEl = document.getElementById("navbar");
  const menuToggleEl = document.getElementById("menuToggle");
  const navLinksEl = document.getElementById("navlinks");
  const formEl = document.getElementById("formContato");

  if (navbarEl && menuToggleEl && navLinksEl) {
    new Navbar(navbarEl, menuToggleEl, navLinksEl);
  }

  if (formEl) {
    new ContactForm(formEl);
  }
});
