import { goToSnapshot } from "./scapper.js";
import { saveCurrent, STORAGE } from "./storage.js";

export function addFloatingToolbar() {
  const toolbar = document.createElement("div");
  toolbar.style = `
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 10000;
    `;

  const createButton = (text, color, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style = `
            background: ${color};
            color: white;
            padding: 10px 16px;
            border: none;
            border-radius: 6px 0 0 6px;
            cursor: pointer;
            font-size: 14px;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
        `;
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateX(-5px)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateX(0)";
    });
    btn.onclick = onClick;
    return btn;
  };

  const startBtn = createButton("🚛 Start Automation", "#28a745", () => {
    localStorage.setItem(STORAGE.runFlag, "true");
    localStorage.removeItem(STORAGE.rangeSetFlag);
    goToSnapshot();
  });

  const stopBtn = createButton("🛑 Stop Automation", "#dc3545", () => {
    Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
    alert("🛑 FMCSA Automation stopped.");
  });

  toolbar.appendChild(startBtn);
  toolbar.appendChild(stopBtn);
  document.body.appendChild(toolbar);
}

export function showRangeForm() {
  const overlay = document.createElement("div");
  overlay.style = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.5); z-index: 9998;
    `;
  document.body.appendChild(overlay);

  const box = document.createElement("div");
  box.style = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #fff; border-radius: 12px; padding: 24px 32px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 9999;
        font-family: 'Segoe UI', sans-serif; min-width: 300px;
    `;

  box.innerHTML = `
        <h2 style="margin-top: 0; font-size: 20px; margin-bottom: 16px;">FMCSA MX/MC Range</h2>
        <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 6px;">Start:</label>
            <input id="startNum" type="number" value="1680500" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
        </div>
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px;">End:</label>
            <input id="endNum" type="number" value="1680505" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
        </div>
        <button id="startScan" style="padding: 10px 16px; border: none; border-radius: 6px;
                background-color: #007bff; color: white; font-size: 14px; cursor: pointer;">
            ▶ Start
        </button>
    `;

  document.body.appendChild(box);

  document.getElementById("startScan").addEventListener("click", () => {
    const start = parseInt(document.getElementById("startNum").value);
    const end = parseInt(document.getElementById("endNum").value);
    if (isNaN(start) || isNaN(end) || start > end) {
      alert("❌ Invalid range.");
      return;
    }
    localStorage.setItem(STORAGE.rangeKey, JSON.stringify({ start, end }));
    saveCurrent(start);
    localStorage.setItem(STORAGE.rangeSetFlag, "true");
    location.reload();
  });
}
