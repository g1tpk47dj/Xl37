if (typeof window.switchTab !== "function") {
  window.switchTab = function(name) {
    const serviceTab = document.getElementById("serviceTab");
    const profileTab = document.getElementById("profileTab");
    const serviceContent = document.getElementById("serviceContent");
    const profileContent = document.getElementById("profileContent");
    if (serviceTab) serviceTab.classList.remove("active");
    if (profileTab) profileTab.classList.remove("active");
    if (serviceContent) serviceContent.style.display = "none";
    if (profileContent) profileContent.style.display = "none";
    if (name === "service") {
      if (serviceTab) serviceTab.classList.add("active");
      if (serviceContent) serviceContent.style.display = "block";
    } else if (name === "profile") {
      if (profileTab) profileTab.classList.add("active");
      if (profileContent) profileContent.style.display = "block";
    }
  };
}

if (typeof window.toggleDatePicker !== "function") {
  window.toggleDatePicker = function() {
    const picker = document.getElementById("datePicker");
    const dropdown = document.getElementById("dateDropdown");
    if (!picker || !dropdown) return;
    dropdown.classList.toggle("hidden");
    picker.classList.toggle("active");
  };
}

if (typeof window.toggleTimePicker !== "function") {
  window.toggleTimePicker = function() {
    const picker = document.getElementById("timePicker");
    const dropdown = document.getElementById("timeDropdown");
    if (!picker || !dropdown) return;
    dropdown.classList.toggle("hidden");
    picker.classList.toggle("active");
  };
}

if (typeof window.showProductImage !== "function") {
  window.showProductImage = function(product) {
    const card = document.querySelector(`.service-card[data-product="${product}"] img`);
    if (!card) return;
    const overlay = document.createElement("div");
    overlay.className = "image-overlay";
    overlay.style.display = "flex";
    overlay.innerHTML = `
      <div class="close-button" onclick="this.parentNode.remove()">✕</div>
      <img src="${card.src}" alt="${product}">
    `;
    document.body.appendChild(overlay);
  };
}

if (typeof window.changeQuantity !== "function") {
  window.changeQuantity = function(product, diff) {
    const input = document.getElementById(`qty-${product}`);
    const card = document.querySelector(`.service-card[data-product="${product}"]`);
    if (!input || !card) return;
    const min = parseInt(card.dataset.min || "0");
    const max = parseInt(card.dataset.max || "9999");
    let val = parseInt(input.value || "0");
    if (isNaN(val)) val = 0;
    val += diff;
    if (val < 0) val = 0;
    if (min && val < min && val !== 0) val = min;
    if (val > max) val = max;
    input.value = val;
  };
}

if (typeof window.setQuantity !== "function") {
  window.setQuantity = function(product, val) {
    const input = document.getElementById(`qty-${product}`);
    const card = document.querySelector(`.service-card[data-product="${product}"]`);
    if (!input || !card) return;
    const min = parseInt(card.dataset.min || "0");
    const max = parseInt(card.dataset.max || "9999");
    let num = parseInt(val);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (min && num < min && num !== 0) num = min;
    if (num > max) num = max;
    input.value = num;
  };
}

if (typeof window.detectLocation !== "function") {
  window.detectLocation = function() {
    const input = document.getElementById("locationInput");
    const detectBtn = document.getElementById("detectBtn");
    const statusText = document.getElementById("statusText");
    if (!navigator.geolocation) {
      if (input) input.value = "Browser tidak mendukung GPS";
      return;
    }
    if (detectBtn) detectBtn.innerText = "Mendeteksi...";
    if (statusText) statusText.textContent = "Mendeteksi...";
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        if (input) input.value = `${lat}, ${lon}`;
        if (detectBtn) detectBtn.innerText = "Deteksi GPS";
        if (statusText) statusText.textContent = "Ready";
      },
      err => {
        if (input) input.value = "Gagal: " + err.message;
        if (detectBtn) detectBtn.innerText = "Deteksi GPS";
        if (statusText) statusText.textContent = "Ready";
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("detectBtn");
    if (btn) btn.addEventListener("click", () => window.detectLocation());
  });
}
