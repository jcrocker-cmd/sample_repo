/* ============================================================
   1. THEME TOGGLE (persisted in localStorage)
   ============================================================ */
var THEME_KEY = 'portfolio-theme';
var themeBtn = document.getElementById('themeBtn');
var themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (err) {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    /* storage blocked - theme just will not persist */
  }
}

var savedTheme = readStoredTheme();
if (savedTheme === 'dark' || savedTheme === 'light') {
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  applyTheme('dark');
} else {
  applyTheme('light');
}

themeBtn.addEventListener('click', function () {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
});

/* ============================================================
   2. MOBILE NAV
   ============================================================ */
var burger = document.getElementById('burger');
var navLinks = document.getElementById('navLinks');

function closeMenu() {
  navLinks.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', function () {
  var isOpen = navLinks.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks.addEventListener('click', function (event) {
  if (event.target.tagName === 'A') {
    closeMenu();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

/* ============================================================
   3. PROJECT CARDS
   ============================================================ */
var PROJECTS = [
  {
    title: 'Project One',
    blurb: 'Placeholder description of what this project does and the problem it solved.',
    tags: ['Tag A', 'Tag B', 'Tag C'],
    demo: '#',
    code: '#'
  },
  {
    title: 'Project Two',
    blurb: 'Placeholder description. Keep it to one or two sentences per card.',
    tags: ['Tag A', 'Tag D'],
    demo: '#',
    code: '#'
  },
  {
    title: 'Project Three',
    blurb: 'Placeholder description of the third project in the grid.',
    tags: ['Tag B', 'Tag E', 'Tag F'],
    demo: '#',
    code: '#'
  },
  {
    title: 'Project Four',
    blurb: 'Placeholder description. Swap these entries for your real work.',
    tags: ['Tag C', 'Tag G'],
    demo: '#',
    code: '#'
  },
  {
    title: 'Project Five',
    blurb: 'Placeholder description of a client or side project.',
    tags: ['Tag A', 'Tag H'],
    demo: '#',
    code: '#'
  },
  {
    title: 'Project Six',
    blurb: 'Placeholder description. Delete any cards you do not need.',
    tags: ['Tag D', 'Tag I'],
    demo: '#',
    code: '#'
  }
];

function buildProjectCard(project) {
  var article = document.createElement('article');
  article.className = 'card project reveal';

  var thumb = document.createElement('div');
  thumb.className = 'project__thumb';
  thumb.textContent = 'IMAGE';
  article.appendChild(thumb);

  var body = document.createElement('div');
  body.className = 'project__body';

  var heading = document.createElement('h3');
  heading.textContent = project.title;
  body.appendChild(heading);

  var blurb = document.createElement('p');
  blurb.textContent = project.blurb;
  body.appendChild(blurb);

  var chips = document.createElement('ul');
  chips.className = 'chips';
  for (var i = 0; i < project.tags.length; i++) {
    var chip = document.createElement('li');
    chip.className = 'chip';
    chip.textContent = project.tags[i];
    chips.appendChild(chip);
  }
  body.appendChild(chips);

  var links = document.createElement('div');
  links.className = 'project__links';

  var demoLink = document.createElement('a');
  demoLink.href = project.demo;
  demoLink.textContent = 'Live demo';
  links.appendChild(demoLink);

  var codeLink = document.createElement('a');
  codeLink.href = project.code;
  codeLink.textContent = 'Source';
  links.appendChild(codeLink);

  body.appendChild(links);
  article.appendChild(body);

  return article;
}

var projectsGrid = document.getElementById('projectsGrid');
for (var p = 0; p < PROJECTS.length; p++) {
  projectsGrid.appendChild(buildProjectCard(PROJECTS[p]));
}

/* ============================================================
   4. REVEAL ON SCROLL
   ============================================================ */
var revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('is-visible');
        revealObserver.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.12 });

  for (var r = 0; r < revealItems.length; r++) {
    revealObserver.observe(revealItems[r]);
  }
} else {
  for (var f = 0; f < revealItems.length; f++) {
    revealItems[f].classList.add('is-visible');
  }
}

/* ============================================================
   5. SCROLL SPY
   ============================================================ */
var spyLinks = navLinks.querySelectorAll('a[href^="#"]');
var sections = [];

for (var s = 0; s < spyLinks.length; s++) {
  var id = spyLinks[s].getAttribute('href');
  if (id.length > 1) {
    var target = document.querySelector(id);
    if (target) {
      sections.push({ link: spyLinks[s], element: target });
    }
  }
}

function updateActiveLink() {
  var marker = window.scrollY + 120;
  var activeIndex = -1;

  for (var i = 0; i < sections.length; i++) {
    if (sections[i].element.offsetTop <= marker) {
      activeIndex = i;
    }
  }

  for (var j = 0; j < sections.length; j++) {
    if (j === activeIndex) {
      sections[j].link.classList.add('is-active');
    } else {
      sections[j].link.classList.remove('is-active');
    }
  }
}

var spyTicking = false;
window.addEventListener('scroll', function () {
  if (spyTicking) {
    return;
  }
  spyTicking = true;
  window.requestAnimationFrame(function () {
    updateActiveLink();
    spyTicking = false;
  });
});
updateActiveLink();

/* ============================================================
   6. CONTACT FORM VALIDATION (client-side only, no backend)
   ============================================================ */
var form = document.getElementById('contactForm');
var submitBtn = document.getElementById('submitBtn');
var formNote = document.getElementById('formNote');

function setError(fieldName, message) {
  var slot = document.querySelector('[data-error-for="' + fieldName + '"]');
  slot.textContent = message;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(values) {
  var errors = {};

  if (values.name.length < 2) {
    errors.name = 'Please enter your name.';
  }
  if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (values.message.length < 10) {
    errors.message = 'Message needs at least 10 characters.';
  }

  return errors;
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  var values = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };

  setError('name', '');
  setError('email', '');
  setError('message', '');
  formNote.textContent = '';

  var errors = validateForm(values);
  var errorKeys = Object.keys(errors);

  if (errorKeys.length > 0) {
    for (var i = 0; i < errorKeys.length; i++) {
      setError(errorKeys[i], errors[errorKeys[i]]);
    }
    document.getElementById(errorKeys[0]).focus();
    return;
  }

  // No backend wired up. Disable the button so a double-click cannot resubmit.
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  window.setTimeout(function () {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
    formNote.textContent = 'Thanks - this is a demo form, so nothing was actually sent.';
  }, 700);
});

/* ============================================================
   7. FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
