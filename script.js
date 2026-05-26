// ============================================================
// SomaSquish — interactivity
// ============================================================

// ---- Pricing data ----
const PLANS = [
  { name: 'Monthly',   months: 1,  discount: 0,    badge: null,           note: 'Cancel anytime' },
  { name: '3 Months',  months: 3,  discount: 0.10, badge: null,           note: 'Prepaid' },
  { name: '6 Months',  months: 6,  discount: 0.20, badge: 'Best value',   note: 'Prepaid' },
];

const BASE = { ship: 35, pickup: 30 };

const PERKS = {
  ship:   '🚚 Shipped to your door',
  pickup: '🚗 Free local SOMA pickup',
};

function fmt(n) {
  // Drop trailing .00 so prices read clean ($28, $31.50)
  return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
}

function renderPlans(mode) {
  const base = BASE[mode];
  const grid = document.getElementById('planGrid');
  if (!grid) return;

  grid.innerHTML = PLANS.map((plan) => {
    const perMonth = base * (1 - plan.discount);
    const total = perMonth * plan.months;
    const fullPrice = base * plan.months;
    const save = fullPrice - total;
    const featured = plan.badge === 'Most popular';

    const saveLine = plan.discount > 0
      ? `Save ${Math.round(plan.discount * 100)}% · ${fmt(save)}`
      : '&nbsp;';

    const billedLine = plan.months > 1
      ? `${fmt(total)} billed once`
      : `${fmt(total)} billed monthly`;

    return `
      <div class="plan-card${featured ? ' featured' : ''}">
        ${plan.badge ? `<span class="plan-badge">${plan.badge}</span>` : ''}
        <div class="plan-name">${plan.name}</div>
        <div class="plan-save">${saveLine}</div>
        <div class="plan-price">
          <span class="amount">${fmt(perMonth)}</span>
          <span class="per">/mo</span>
        </div>
        <div class="plan-billed">${billedLine}</div>
        <ul>
          <li>3–4 premium squishies / month</li>
          <li>Surprise reveal insert</li>
          <li>${PERKS[mode]}</li>
          <li>${plan.note}</li>
        </ul>
        <a href="#waitlist" class="btn ${featured ? 'btn-primary' : 'btn-ghost'}">
          ${plan.months > 1 ? 'Prepay & save' : 'Subscribe'}
        </a>
      </div>`;
  }).join('');
}

// ---- Delivery toggle ----
function initToggle() {
  const buttons = document.querySelectorAll('.toggle-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderPlans(btn.dataset.mode);
    });
  });
}

// ---- Mobile nav ----
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-nav');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// ---- Waitlist form (POC: no backend) ----
function initWaitlist() {
  const form = document.getElementById('waitlistForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (!email.value || !email.checkValidity()) {
      email.focus();
      return;
    }
    form.reset();
    if (note) {
      note.hidden = false;
      note.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderPlans('ship');
  initToggle();
  initMobileNav();
  initWaitlist();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
