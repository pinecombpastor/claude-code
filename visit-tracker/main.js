const KEY = "visits";
const $ = id => document.getElementById(id);
let visits = JSON.parse(localStorage.getItem(KEY) || "[]");
$("date").valueAsDate = new Date();

function save() { localStorage.setItem(KEY, JSON.stringify(visits)); render(); }
function daysSince(d) { return Math.floor((Date.now() - new Date(d + "T00:00")) / 864e5); }

function render() {
  const latest = {};
  visits.forEach(v => { if (!latest[v.name] || v.date > latest[v.name].date) latest[v.name] = v; });
  const limit = +$("days").value;
  $("list").innerHTML = Object.values(latest)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(v => {
      const n = daysSince(v.date);
      return `<li><span>${esc(v.name)}<small>${esc(v.note || "")}</small></span>
        <span class="${n >= limit ? "due" : ""}">${n}d ago
        <button class="x" data-n="${esc(v.name)}" title="Remove">✕</button></span></li>`;
    }).join("");
}
function esc(s) { return s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

$("f").onsubmit = e => {
  e.preventDefault();
  visits.push({ name: $("name").value.trim(), date: $("date").value, note: $("note").value.trim() });
  $("name").value = $("note").value = "";
  save();
};
$("days").oninput = render;
$("list").onclick = e => {
  const n = e.target.dataset.n;
  if (n && confirm("Remove " + n + " and all their visits?")) { visits = visits.filter(v => v.name !== n); save(); }
};
render();
