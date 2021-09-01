const modal = document.querySelector(".modal");
const login = document.querySelector(".login");
const developer = document.querySelector(".developers");
const overlay = document.querySelector(".overlay");

const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnCloseLogin = document.querySelector(".btn--close-login");
const btnsOpenLogin = document.querySelector(".btn--show-login");

const btnCloseDeveloper = document.querySelector(".btn--close-developers");
const btnsOpenDeveloper = document.querySelector(".btn--show-developers");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");


////// Function to open Register Modal /////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

////// Function to open Login Modal //////
const openLoginModal = function (e) {
  e.preventDefault();
  login.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

///// Function to open Developer Modal /////
const openDeveloperModal = function (e) {
  e.preventDefault();
  developer.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

////// Fuction to close any modal if currently displayed //////
const commonClose = function () {
  modal.classList.add("hidden");
  login.classList.add("hidden");
  developer.classList.add("hidden");
  overlay.classList.add("hidden");
};

////// Opens and Close Register Modal /////
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", commonClose);

//////  Opens and Close Login Modal /////
btnsOpenLogin.addEventListener("click", openLoginModal);
btnCloseLogin.addEventListener("click",commonClose);

///// Open and Close Developer Modal /////
btnsOpenDeveloper.addEventListener("click",openDeveloperModal);
btnCloseDeveloper.addEventListener("click",commonClose);

///// Open and Close Overlay Background when modal is open ///// 
overlay.addEventListener("click", commonClose);


document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    commonClose();
  }
});

///// smooth scrolling for entire body /////
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

///// when clicked on any nav_link .. it scrolls smoothly to that link //////
document.querySelector(".nav__links").addEventListener("click", function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

////// Switches tabs and add animation to tabs //////
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

////// Blurrs remaining items in navbar when hover on any item in navbar //////
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});


////// Sticks nav-bar to Top //////
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
