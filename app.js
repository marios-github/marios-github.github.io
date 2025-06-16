const SUPABASE_URL = "https://jhhgmabujgkwvvscbfbr.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY_HERE"; // Replace manually after download
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) document.getElementById("auth-error").innerText = error.message;
  else location.reload();
}

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) document.getElementById("auth-error").innerText = error.message;
  else alert("Controlla la tua email per completare la registrazione.");
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

window.onload = async function () {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadLogs();
  }
};

document.getElementById("log-form").onsubmit = async function (e) {
  e.preventDefault();
  const log = {
    f1: document.getElementById("ansia").value,
    f2: document.getElementById("nodo").value,
    f3: document.getElementById("energia").value,
    f4: document.getElementById("rivotril").value,
    f5: document.getElementById("note").value,
    date: new Date().toISOString().split("T")[0]
  };
  await supabase.from("logs").insert([log]);
  loadLogs();
  document.getElementById("log-form").reset();
};

async function loadLogs() {
  const { data, error } = await supabase.from("logs").select("*").order("date", { ascending: false });
  if (error) {
    alert("Errore nel caricamento dei dati.");
    return;
  }
  const tbody = document.querySelector("#log-table tbody");
  tbody.innerHTML = "";
  const last7 = data.slice(0, 7).reverse();
  const last30 = data.slice(0, 30).reverse();

  for (const row of data) {
    const tr = tbody.insertRow();
    tr.insertCell().innerText = row.date;
    tr.insertCell().innerText = row.f1;
    tr.insertCell().innerText = row.f2;
    tr.insertCell().innerText = row.f3;
    tr.insertCell().innerText = row.f4;
    tr.insertCell().innerText = row.f5;
  }

  drawChart("weeklyChart", last7);
  drawChart("monthlyChart", last30);
}

function drawChart(canvasId, logs) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: logs.map(r => r.date),
      datasets: [
        { label: "Ansia", data: logs.map(r => r.f1), borderWidth: 2 },
        { label: "Nodo", data: logs.map(r => r.f2), borderWidth: 2 },
        { label: "Energia", data: logs.map(r => r.f3), borderWidth: 2 }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 10 } }
    }
  });
}