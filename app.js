const PIN = "5273";

window.onload = function() {
  if (!localStorage.getItem("pin-validated")) {
    document.getElementById("pin-protect").style.display = "block";
  } else {
    showApp();
  }

  const now = new Date();
  const lastEntry = JSON.parse(localStorage.getItem("logs") || "[]").slice(-1)[0];
  if (!lastEntry || new Date(lastEntry.date).toDateString() !== now.toDateString()) {
    if (now.getHours() >= 14) {
      alert("Hai compilato il log di oggi?");
    }
  }
};

function checkPIN() {
  const input = document.getElementById("pin-input").value;
  if (input === PIN) {
    localStorage.setItem("pin-validated", true);
    showApp();
  } else {
    document.getElementById("pin-error").innerText = "PIN errato.";
  }
}

function showApp() {
  document.getElementById("pin-protect").style.display = "none";
  document.getElementById("app").style.display = "block";
  renderLogs();
  renderCharts();
}

const form = document.getElementById("log-form");
form.onsubmit = function (e) {
  e.preventDefault();
  const log = {
    date: new Date().toISOString().split("T")[0],
    ansia: document.getElementById("ansia").value,
    nodo: document.getElementById("nodo").value,
    energia: document.getElementById("energia").value,
    rivotril: document.getElementById("rivotril").value,
    note: document.getElementById("note").value,
  };
  const logs = getLogs();
  logs.push(log);
  saveLogs(logs);
  form.reset();
  renderLogs();
  renderCharts();
};

function getLogs() {
  return JSON.parse(localStorage.getItem("logs") || "[]");
}

function saveLogs(logs) {
  localStorage.setItem("logs", JSON.stringify(logs));
}

function renderLogs() {
  const tbody = document.querySelector("#log-table tbody");
  tbody.innerHTML = "";
  const logs = getLogs();
  logs.forEach(log => {
    const row = tbody.insertRow();
    row.insertCell(0).innerText = log.date;
    row.insertCell(1).innerText = log.ansia;
    row.insertCell(2).innerText = log.nodo;
    row.insertCell(3).innerText = log.energia;
    row.insertCell(4).innerText = log.rivotril;
    row.insertCell(5).innerText = log.note;
  });
}

function renderCharts() {
  const logs = getLogs();
  const last7 = logs.slice(-7);
  const last30 = logs.slice(-30);

  const makeChart = (canvasId, dataSet) => {
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: dataSet.map(d => d.date),
        datasets: [
          {
            label: "Ansia",
            data: dataSet.map(d => d.ansia),
            borderWidth: 2
          },
          {
            label: "Nodo",
            data: dataSet.map(d => d.nodo),
            borderWidth: 2
          },
          {
            label: "Energia",
            data: dataSet.map(d => d.energia),
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 10
          }
        }
      }
    });
  };

  makeChart("weeklyChart", last7);
  makeChart("monthlyChart", last30);
}

function exportData() {
  const logs = getLogs();
  const header = "Data,Ansia,Nodo, Energia, Rivotril, Note\n";
  const rows = logs.map(l => `${l.date},${l.ansia},${l.nodo},${l.energia},${l.rivotril},"${l.note.replace(/"/g, '""')}"`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "monitor_ansia.csv";
  link.click();
}