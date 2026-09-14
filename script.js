const menuItems = [
  { category: "starters", name: "Classic Bruschetta", description: "Toasted bread with fresh tomatoes, basil and olive oil", price: "₹320", image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=85", alt: "Classic bruschetta with tomatoes and basil" },
  { category: "starters", name: "Truffle Arancini", description: "Crisp risotto bites, wild mushrooms and parmesan", price: "₹390", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85", alt: "Golden arancini rice balls with greens" },
  { category: "main-course", name: "Creamy Alfredo Pasta", description: "Rich and creamy pasta with Parmesan and herbs", price: "₹450", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=85", alt: "Creamy pasta topped with herbs" },
  { category: "main-course", name: "Grilled Salmon", description: "Perfectly grilled salmon with seasonal vegetables", price: "₹620", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=85", alt: "Grilled salmon with vegetables and lemon" },
  { category: "main-course", name: "Herb-Crusted Chicken", description: "Tender chicken, rosemary jus and roasted roots", price: "₹540", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=85", alt: "Herb-crusted roasted chicken with vegetables" },
  { category: "desserts", name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center", price: "₹380", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476b?auto=format&fit=crop&w=800&q=85", alt: "Chocolate lava cake dusted with sugar" },
  { category: "desserts", name: "Saffron Panna Cotta", description: "Silky vanilla cream with saffron and pistachio", price: "₹340", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85", alt: "Panna cotta with berries and pistachios" },
  { category: "beverages", name: "Rosemary Citrus Fizz", description: "Fresh citrus, rosemary and sparkling water", price: "₹240", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85", alt: "Citrus drink with rosemary and ice" }
];

const menuGrid = document.querySelector("#menu-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const form = document.querySelector("#reservation-form");
const formMessage = document.querySelector("#form-message");
const backToTop = document.querySelector(".back-to-top");

function renderMenu(filter = "all") {
  const visibleItems = filter === "all" ? menuItems : menuItems.filter((item) => item.category === filter);
  menuGrid.innerHTML = visibleItems.map((item, index) => `
    <article class="menu-card" style="animation-delay: ${index * 45}ms">
      <div class="menu-card-image"><img src="${item.image}" alt="${item.alt}" loading="lazy"></div>
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-card-footer">
          <span class="price">${item.price}</span>
          <button class="add-button" type="button" aria-label="Add ${item.name} to your order">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderMenu(button.dataset.filter);
  });
});

function closeMobileMenu() {
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  mobileMenu.classList.remove("open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.classList.toggle("open", isOpen);
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    closeMobileMenu();
  });
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".desktop-nav .nav-link, .mobile-menu .nav-link");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%" });
sections.forEach((section) => observer.observe(section));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, select")];
  const invalidField = fields.find((field) => !field.value.trim() || (field.type === "email" && !field.validity.valid));
  if (invalidField) {
    formMessage.textContent = invalidField.type === "email" ? "Please enter a valid email address." : "Please complete all reservation details.";
    invalidField.focus();
    return;
  }
  formMessage.textContent = "Thank you. Your table request has been received.";
  form.reset();
});

const revealObserver = new IntersectionObserver((entries, observerInstance) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observerInstance.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

renderMenu();
