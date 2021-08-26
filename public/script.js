const modal = document.querySelector(".modal");
const login = document.querySelector(".login");
const overlay = document.querySelector(".overlay");
const overlayLogin = document.querySelector(".overlayLogin");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnsOpenLogin = document.querySelector(".btn--show-login");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const footer = document.querySelector(".footer");
const allSections = document.querySelectorAll(".section");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const imgTarget = document.querySelectorAll("img[data-src]");

const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const openLoginModal = function (e) {
  e.preventDefault();
  login.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  if (!login.classList.contains("hidden")) {
    login.classList.add("hidden");
  }
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnsOpenLogin.addEventListener("click", openLoginModal);

btnCloseModal.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

const message = document.createElement("div");
message.classList.add("cookie-message");

message.innerHTML = `We use cookies for improved functionality and analytics <button class = "btn btn--close-cookie">Got It!</button> `;

header.append(message);

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// tabs.forEach((t) => t.addEventListener("click", () => console.log("tab")));
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

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTarget.forEach((img) => imgObserver.observe(img));

let curslide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach((s, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document.querySelectorAll(".dots__dot").forEach((dot) => {
    dot.classList.remove("dots__dot--active");
  });

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const gotoSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curslide === maxSlide - 1) {
    curslide = 0;
  } else {
    curslide++;
  }

  gotoSlide(curslide);
  activateDot(curslide);
};

const prevSlide = function () {
  if (curslide === 0) {
    curslide = maxSlide - 1;
  } else {
    curslide--;
  }

  gotoSlide(curslide);
  activateDot(curslide);
};

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key == "ArrowLeft") {
    prevSlide();
  }

  e.key == "ArrowRight" && nextSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    gotoSlide(slide);
    activateDot(slide);
  }
});

const init = function () {
  gotoSlide(0);
  createDots();
  activateDot(0);
};

init();
