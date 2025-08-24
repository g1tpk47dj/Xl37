document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("detectBtn");
  const input = document.getElementById("locationInput");
  const statusText = document.getElementById("statusText");

  if (btn) {
    btn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        if (input) input.value = "Browser tidak mendukung GPS";
        return;
      }
      if (btn) btn.innerText = "Mendeteksi...";
      if (statusText) statusText.textContent = "Mendeteksi...";

      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);
          if (input) input.value = `${lat}, ${lon}`;
          if (btn) btn.innerText = "Deteksi GPS";
          if (statusText) statusText.textContent = "Ready";
        },
        err => {
          if (input) input.value = "Gagal: " + err.message;
          if (btn) btn.innerText = "Deteksi GPS";
          if (statusText) statusText.textContent = "Ready";
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
      );
    });
  }
});
