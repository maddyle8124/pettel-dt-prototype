// ===============================
// PETTEL - Main JavaScript
// Filter & Rendering Logic
// ===============================

// ===== STATE MANAGEMENT =====
let currentFilters = {
  petType: [],
  personality: [],
  specialNeeds: [],
  experienceLevel: [],
  diet: [],
  environment: [],
  availability: []
};

let allSitters = [];
let filteredSitters = [];

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN');
}

// ===== FILTER LOGIC =====
function matchesFilters(sitter, filters) {
  // Check petType
  if (filters.petType.length > 0) {
    const hasMatch = filters.petType.some(pet => sitter.petType.includes(pet));
    if (!hasMatch) return false;
  }

  // Check personality
  if (filters.personality.length > 0) {
    const hasMatch = filters.personality.some(p => sitter.personality.includes(p));
    if (!hasMatch) return false;
  }

  // Check specialNeeds
  if (filters.specialNeeds.length > 0) {
    const hasMatch = filters.specialNeeds.some(need => sitter.specialNeeds.includes(need));
    if (!hasMatch) return false;
  }

  // Check experienceLevel (exact match)
  if (filters.experienceLevel.length > 0) {
    if (!filters.experienceLevel.includes(sitter.experienceLevel)) {
      return false;
    }
  }

  // Check diet
  if (filters.diet.length > 0) {
    const hasMatch = filters.diet.some(d => sitter.diet.includes(d));
    if (!hasMatch) return false;
  }

  // Check environment (exact match)
  if (filters.environment.length > 0) {
    if (!filters.environment.includes(sitter.environment)) {
      return false;
    }
  }

  // Check availability
  if (filters.availability.length > 0) {
    const hasMatch = filters.availability.some(avail => sitter.availability.includes(avail));
    if (!hasMatch) return false;
  }

  return true;
}

function applyFilters() {
  showLoading();

  // Simulate network delay for better UX
  setTimeout(() => {
    filteredSitters = allSitters.filter(sitter => matchesFilters(sitter, currentFilters));
    renderListings();
    hideLoading();
  }, 300);
}

const debouncedApplyFilters = debounce(applyFilters, 300);

// ===== RENDERING =====
function createListingCard(sitter) {
  const petTypeLabels = sitter.petType.map(pet => pet === 'cat' ? '🐱' : '🐶').join(' ');
  
  const card = document.createElement('a');
  card.href = `detail.html?id=${sitter.id}`;
  card.className = 'listing-card';
  card.innerHTML = `
    <div class="listing-card__image">
      <img src="${sitter.image}" alt="${sitter.name}" loading="lazy">
    </div>
    <div class="listing-card__content">
      <div>
        <div class="listing-card__type">${sitter.type}</div>
        <div class="listing-card__name">${sitter.name}</div>
        <div class="listing-card__status">${sitter.status}</div>
        <div class="listing-card__amenities">${sitter.amenities.slice(0, 3).join(' · ')}</div>
        <div class="listing-card__tags" style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;">
          <span style="font-size: 14px;">${petTypeLabels}</span>
        </div>
      </div>
      <div class="listing-card__bottom">
        <div class="listing-card__rating">
          <span>${sitter.rating}</span>
          <span class="star">★</span>
          <span class="count">(${sitter.reviewCount.toLocaleString('vi-VN')} đánh giá)</span>
        </div>
        <div class="listing-card__price">${formatPrice(sitter.price)} VND <span>/ ngày</span></div>
      </div>
      <div class="listing-card__favorite" aria-label="Yêu thích">
        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>
    </div>
  `;

  // Add favorite button functionality
  const favoriteBtn = card.querySelector('.listing-card__favorite');
  favoriteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    favoriteBtn.classList.toggle('active');
  });

  return card;
}

function renderListings() {
  const container = document.getElementById('listings-container');
  const countElement = document.getElementById('listings-count');
  const noResults = document.getElementById('no-results');

  container.innerHTML = '';

  if (filteredSitters.length === 0) {
    noResults.style.display = 'flex';
    countElement.textContent = 'Không có kết quả';
  } else {
    noResults.style.display = 'none';
    countElement.textContent = `${filteredSitters.length}+ Sitter ở Đà Nẵng`;

    filteredSitters.forEach(sitter => {
      const card = createListingCard(sitter);
      container.appendChild(card);
    });
  }
}

function showLoading() {
  document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

// ===== EVENT HANDLERS =====
function setupFilterToggle() {
  const toggleBtn = document.getElementById('toggle-filters-btn');
  const filtersPanel = document.getElementById('advanced-filters');

  toggleBtn.addEventListener('click', () => {
    filtersPanel.classList.toggle('open');
  });
}

function setupFilterCheckboxes() {
  const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const filterType = e.target.dataset.filter;
      const value = e.target.value;

      if (e.target.checked) {
        if (!currentFilters[filterType].includes(value)) {
          currentFilters[filterType].push(value);
        }
      } else {
        currentFilters[filterType] = currentFilters[filterType].filter(v => v !== value);
      }

      // Real-time filter? Uncomment below to enable
      // debouncedApplyFilters();
    });
  });
}

function setupFilterActions() {
  const applyBtn = document.getElementById('apply-filters-btn');
  const clearBtn = document.getElementById('clear-filters-btn');

  applyBtn.addEventListener('click', () => {
    applyFilters();
  });

  clearBtn.addEventListener('click', () => {
    // Clear all filters
    currentFilters = {
      petType: [],
      personality: [],
      specialNeeds: [],
      experienceLevel: [],
      diet: [],
      environment: [],
      availability: []
    };

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Apply cleared filters
    applyFilters();
  });
}

// ===== INITIALIZATION =====
function init() {
  // Check if sittersData is available (from data.js)
  if (typeof sittersData === 'undefined') {
    console.error('sittersData not found. Make sure data.js is loaded.');
    return;
  }

  // Initialize data
  allSitters = [...sittersData];
  filteredSitters = [...sittersData];

  // Setup UI
  setupFilterToggle();
  setupFilterCheckboxes();
  setupFilterActions();

  // Initial render with loading simulation
  showLoading();
  setTimeout(() => {
    renderListings();
    hideLoading();
  }, 500);
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
