(function injectManifestAndSW(){
  
  const manifest = {
    name: "",
    short_name: "",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#0d9488",
    icons: [
      { src: "https://blogger.googleusercontent.com/img/a/AVvXsEjGm9YUozPW_PIZmLevm5fmLFqlPKukVPHxSF37uXOK9eZ9mPNsY9rr06wVSZd4iawwShVHMFUriPWDHpK8SMu1xV7150i1zanZCS3AHOF_XkUmZZd8-p14aZgxC35ztuESd-o5Kh2WYHbEsxqgaCcSkDKPjS7ldcjhGJG30s-MUJpQ018mwqNR42ZwT8w", sizes: "192x192", type: "image/png" },
      { src: "https://blogger.googleusercontent.com/img/a/AVvXsEiwW1LPHoHW_ExhW0j8mWdtLJhdoLAmt0XtQIIhkIRZ0zg1eUnESdQmb7GFUbDul5AWLnOtZBovxDp5AafQT-9WsGDfzDRm545qeVQXkLMQ0A3QS-mNJ87y1cqQWR5YiFBhtRhbR4mUhT8ZYURxTXWh5926cb-omvhBVzw4sBWC1zg1YWYCgHiJUwmsrx4", sizes: "512x512", type: "image/png" }
    ]
  };
  const mfBlob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
  const mfUrl  = URL.createObjectURL(mfBlob);
  const link   = document.createElement("link");
  link.rel = "manifest"; link.href = mfUrl;
  document.head.appendChild(link);

  
  if ("serviceWorker" in navigator) {
    const swCode = `
      self.addEventListener('install', e => self.skipWaiting());
      self.addEventListener('activate', e => clients.claim());
    `;
    const swBlob = new Blob([swCode], { type: "application/javascript" });
    const swUrl  = URL.createObjectURL(swBlob);
    navigator.serviceWorker.register(swUrl).catch(console.warn);
  }
})();


let deferredPrompt = null;
let installPrompted = false;
let firstUserGestureDone = false;


function createInstallBanner() {
  if (document.getElementById("pwa-install-banner")) return;

  const wrap = document.createElement("div");
  wrap.id = "pwa-install-banner";
  wrap.style.cssText = "position:fixed;left:0;right:0;bottom:12px;z-index:99999;display:flex;justify-content:center;pointer-events:none;";
  wrap.innerHTML = `
    <div style="pointer-events:auto;background:#fff;border:1px solid #e5e7eb;box-shadow:0 8px 24px rgba(0,0,0,.12);
                border-radius:14px;padding:12px 14px;max-width:420px;width:94%;display:flex;align-items:center;gap:12px;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif">
     
      <div style="width:40px;height:40px;border-radius:12px;background:#e6fffb;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 3v12"/>
          <path d="M7 10l5 5 5-5"/>
          <rect x="4" y="16" width="16" height="5" rx="2" ry="2" fill="#0d9488" stroke="none" opacity=".12"/>
        </svg>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Instal sebagai Aplikasi</div>
        <div style="font-size:12px;color:#475569">Aktifkan lokasi dan Instal untuk pengalaman terbaik</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
          <button id="pwa-install-later" type="button"
  style="display:none;background:#fff;border:1px solid #e5e7eb;color:#0f172a;border-radius:10px;padding:7px 12px;font-size:12px;cursor:pointer">
  Nanti
</button>

       
       <button id="pwa-install-cta" type="button"
          style="background:#0d9488;border:0;color:#fff;border-radius:30px;padding:6px 5px;font-size:11px;font-weight:700;cursor:pointer;min-width:75px">Install</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  
  const btnInstall = document.getElementById("pwa-install-cta");
  const btnLater   = document.getElementById("pwa-install-later");

  btnLater.addEventListener("click", () => {
    removeBanner();
    localStorage.setItem("pwa_install_dismissed_at", String(Date.now()));
  });

  btnInstall.addEventListener("click", async () => {
    
    if (btnInstall.dataset.busy === "1") return;
    btnInstall.dataset.busy = "1";

   
    const originalText = btnInstall.textContent;
    btnInstall.textContent = "Proses..";
    btnInstall.style.opacity = "0.85";
    btnInstall.style.cursor = "wait";
    btnInstall.disabled = true;

    try {
      await triggerInstallPrompt(); 
    } catch (err) {
      
      alert("Install belum tersedia. Pastikan:\n• Sudah ada interaksi (klik/scroll)\n• Belum terpasang sebelumnya\n• Akses via HTTPS/Chrome/Edge Android");
    } finally {
      
      if (document.getElementById("pwa-install-banner")) {
        btnInstall.textContent = originalText;
        btnInstall.style.opacity = "1";
        btnInstall.style.cursor = "pointer";
        btnInstall.disabled = false;
        btnInstall.dataset.busy = "";
      }
    }
  });
}

function removeBanner(){
  const el = document.getElementById("pwa-install-banner");
  if (el) el.remove();
}

async function triggerInstallPrompt() {
  if (!deferredPrompt) throw new Error("No deferredPrompt");
  if (installPrompted)  return;

  installPrompted = true;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;

  
  removeBanner();

  
  console.log("[PWA] userChoice:", choice && choice.outcome);
}


window.addEventListener("beforeinstallprompt", (e) => {
  
  e.preventDefault();
  deferredPrompt = e;

  
  const lastDismiss = Number(localStorage.getItem("pwa_install_dismissed_at") || 0);
  if (Date.now() - lastDismiss < 24 * 60 * 60 * 1000) return;

  createInstallBanner();

  
  if (firstUserGestureDone && !installPrompted) {
    setTimeout(() => { triggerInstallPrompt().catch(()=>{}); }, 350);
  }
});


window.addEventListener("appinstalled", () => {
  console.log("[PWA] installed");
  removeBanner();
});


["click","touchstart","keydown","scroll"].forEach(evt => {
  window.addEventListener(evt, () => { firstUserGestureDone = true; }, { once:true, passive:true });
});


function isIosSafari() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) &&
         /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
if (isIosSafari() && !window.navigator.standalone) {
  
  setTimeout(() => {
    if (!document.getElementById("pwa-install-banner")) {
      createInstallBanner();
      const btn = document.getElementById("pwa-install-cta");
      btn.textContent = "Cara Pasang";
      btn.onclick = () => {
        alert('Di iPhone/iPad:\n1) Ketuk ikon Share (kotak panah ke atas)\n2) Pilih "Add to Home Screen"');
      };
    }
  }, 900);
}
