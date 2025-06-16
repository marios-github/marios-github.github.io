const form = document.getElementById("log-form");
const logList = document.getElementById("log-list");

function getLogs() {
  return JSON.parse(localStorage.getItem("logs") || "[]");
}

function saveLogs(logs) {
  localStorage.setItem("logs", JSON.stringify(logs));
}

function renderLogs() {
  logList.innerHTML = "";
  const logs = getLogs();
  logs.forEach((log, index) => {
    const li = document.createElement("li");
    li.textContent = `${log.date} - Ansia: ${log.ansia}, Nodo: ${log.nodo}, Energia: ${log.energia}, Rivotril: ${log.rivotril}, Note: ${log.note}`;
    logList.appendChild(li);
  });
}

form.onsubmit = function (e) {
  e.preventDefault();
  const log = {
    date: new Date().toLocaleDateString(),
    ansia: document.getElementById("ansia").value,
    nodo: document.getElementById("nodo").value,
    energia: document.getElementById("energia").value,
    rivotril: document.getElementById("rivotril").value,
    note: document.getElementById("note").value,
  };
  const logs = getLogs();
  logs.push(log);
  saveLogs(logs);
  renderLogs();
  form.reset();
};

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

renderLogs();