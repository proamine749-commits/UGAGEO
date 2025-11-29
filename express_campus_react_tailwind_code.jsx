/*
ExpressCampus — React + Tailwind single-file app (App.jsx)

What's inside:
- Default export React component (App) that implements the full site SPA
  (Accueil, Statistiques, Messages, Guide, A propos)
- Uses Tailwind classes for styling (no external CSS file required beyond Tailwind config)
- Sample data included so the site runs immediately in dev
- Uses react-router for navigation and recharts for simple charts
- Framer Motion for subtle animations

How to use:
1) Create a new Vite React + Tailwind project (recommended):
   npm create vite@latest express-campus -- --template react
   cd express-campus
   npm install

2) Install additional deps:
   npm install react-router-dom framer-motion recharts

3) Install and configure Tailwind (follow Tailwind + Vite docs). Typical steps:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // add the content paths in tailwind.config.cjs and the @tailwind directives in index.css

4) Replace src/App.jsx with the content of this file and run:
   npm run dev

5) To deploy: use Vercel (recommended) or Netlify/GitHub Pages. Once deployed, paste the public URL
   into Google Sites > Insert > Embed > URL to show it inside an iframe.

-----------------------

NOTE: This is a single-file example for clarity. For a production app,
split components into separate files, add tests, and secure admin endpoints.

*/

import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Sample dataset (you will replace with real data import from Google Sheets or CSV)
const SAMPLE_MESSAGES = [
  { id: 1, place: "Bibliothèque centrale", emotion: "calme", text: "Endroit très calme et lumineux, idéal pour réviser.", date: "2025-11-10" },
  { id: 2, place: "Cafétéria", emotion: "stress", text: "Toujours bondée à midi, bruyante.", date: "2025-11-11" },
  { id: 3, place: "Jardin nord", emotion: "joie", text: "Parfait pour manger dehors et se détendre.", date: "2025-11-12" },
  { id: 4, place: "Amphithéâtre A", emotion: "ennui", text: "Chaises inconfortables et température froide.", date: "2025-11-13" },
  { id: 5, place: "Bibliothèque centrale", emotion: "joie", text: "Personnel accueillant et bons espaces de travail.", date: "2025-11-14" }
];

const EMOJI = { joie: "😊", calme: "🧘", stress: "😬", ennui: "😴" };
const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"];

function formatCountByPlace(messages) {
  const map = {};
  messages.forEach(m => (map[m.place] = (map[m.place] || 0) + 1));
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function formatCountByEmotion(messages) {
  const map = {};
  messages.forEach(m => (map[m.emotion] = (map[m.emotion] || 0) + 1));
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// Top-level layout components
function TopNav() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-teal-400 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">ExprimeTonCampus</Link>
        <nav className="space-x-4">
          <Link to="/stats" className="hover:underline">Statistiques</Link>
          <Link to="/messages" className="hover:underline">Messages</Link>
          <Link to="/guide" className="hover:underline">Comment écrire</Link>
          <Link to="/about" className="hover:underline">À propos</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="max-w-6xl mx-auto p-6 text-sm text-gray-600 flex justify-between">
        <div>© {new Date().getFullYear()} ExprimeTonCampus</div>
        <div>Déployé pour le campus — Intègre via iframe dans Google Sites</div>
      </div>
    </footer>
  );
}

// Pages
function Home({ messages }) {
  const topPlaces = useMemo(() => formatCountByPlace(messages).sort((a, b) => b.value - a.value).slice(0, 3), [messages]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-2">Exprime ton campus</h1>
        <p className="text-gray-600 mb-4">Découvre où tes pairs se sentent bien, stressés ou inspirés — et participe en déposant un message dans nos boîtes.</p>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {topPlaces.map((p, i) => (
            <div key={p.name} className="p-4 border rounded-lg">
              <div className="text-xs text-gray-500">Top {i + 1}</div>
              <div className="font-semibold text-lg">{p.name}</div>
              <div className="text-sm text-gray-600">{p.value} mention(s)</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link to="/messages" className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-95">Voir les messages</Link>
          <a href="#" className="bg-white border px-4 py-2 rounded-lg">Comment participer ?</a>
        </div>
      </motion.section>

      <section className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold mb-2">Carte (prototype)</h3>
          <div className="h-56 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center text-gray-400">Insère ici une image de plan ou une carte interactive</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold mb-2">Participer</h3>
          <p className="text-sm text-gray-600">Tu peux déposer un message dans les boîtes sur le campus ou utiliser le formulaire de l'équipe (page équipe).</p>
        </div>
      </section>
    </main>
  );
}

function Stats({ messages }) {
  const byPlace = formatCountByPlace(messages);
  const byEmotion = formatCountByEmotion(messages);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-bold mb-4">Lieux les plus mentionnés</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byPlace} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {byPlace.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-bold mb-4">Répartition des émotions</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byEmotion} dataKey="value" nameKey="name" outerRadius={90} label>
                  {byEmotion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm md:col-span-2">
          <h2 className="font-bold mb-4">Détails & filtres</h2>
          <p className="text-sm text-gray-600">Prototype : vous pourrez remplacer ces contrôles par des requêtes sur Google Sheets, APIs ou une base de données afin d'activer des filtres réels.</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <button className="px-3 py-1 rounded bg-slate-100">Joie</button>
            <button className="px-3 py-1 rounded bg-slate-100">Calme</button>
            <button className="px-3 py-1 rounded bg-slate-100">Stress</button>
            <button className="px-3 py-1 rounded bg-slate-100">Afficher tout</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function MessagesPage({ messages, onSelect }) {
  const [filter, setFilter] = useState("");
  const filtered = messages.filter(m => !filter || m.place.toLowerCase().includes(filter.toLowerCase()) || m.emotion === filter);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="font-bold mb-4">Messages déposés</h2>
        <div className="mb-4 flex gap-2">
          <input placeholder="Filtrer par lieu" value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded w-72" />
          <button onClick={() => setFilter("")} className="px-3 py-1 bg-slate-100 rounded">Réinitialiser</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(m => (
            <article key={m.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{m.place}</div>
                  <div className="text-xs text-gray-500">{m.date} • {EMOJI[m.emotion] || m.emotion}</div>
                </div>
                <button onClick={() => onSelect(m)} className="text-sm px-3 py-1 bg-indigo-50 rounded">Voir</button>
              </div>
              <p className="mt-3 text-gray-700">{m.text}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function Guide() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="font-bold mb-4">Comment décrire un lieu</h2>
        <p className="text-sm text-gray-600">Conseils rapides pour écrire un message utile et clair :</p>
        <ul className="mt-3 list-disc pl-5 text-gray-700">
          <li>Commence par le lieu : bâtiment / cafétéria / parc.</li>
          <li>Décris l'ambiance : calme, bruyant, lumineux, sombre.</li>
          <li>Explique pourquoi : confort des chaises, température, personnel.</li>
          <li>Donne une émotion : joie, stress, calme, ennui.</li>
          <li>Sois bref mais précis — cela aide les statistiques.</li>
        </ul>

        <h3 className="mt-4 font-semibold">Exemples</h3>
        <div className="mt-2 grid md:grid-cols-2 gap-3">
          <div className="p-3 border rounded">❤️ « J’aime la bibliothèque : calme et lumière naturelle. »</div>
          <div className="p-3 border rounded">😬 « La cafétéria est trop bruyante et étouffante à midi. »</div>
        </div>
      </div>
    </main>
  );
}

function About() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="font-bold mb-4">À propos du projet</h2>
        <p className="text-sm text-gray-600">Ce projet collecte, anonymise et visualise les ressentis des étudiants à propos des lieux du campus. Les messages sont envoyés par boîte physique ou numérique, puis traités par l'équipe.</p>
        <h3 className="mt-4 font-semibold">Confidentialité</h3>
        <p className="text-sm text-gray-600">Les messages publiés sont anonymisés. Les messages originaux sont stockés dans un Google Sheet accessible uniquement à l'équipe.</p>
      </div>
    </main>
  );
}

// Modal viewer for a selected message (simple implementation)
function MessageModal({ selected, onClose }) {
  if (!selected) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-lg max-w-xl w-full">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-lg">{selected.place}</div>
            <div className="text-xs text-gray-500">{selected.date} • {EMOJI[selected.emotion] || selected.emotion}</div>
          </div>
          <button onClick={onClose} className="text-gray-500">Fermer</button>
        </div>
        <p className="mt-4 text-gray-700">{selected.text}</p>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate ? useNavigate() : null;

  // Admin import simulation: you can replace this by reading a Google Sheet or uploading a CSV
  function importMessages(newMessages) {
    setMessages(prev => [...newMessages, ...prev]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <TopNav />
      <Routes>
        <Route path="/" element={<Home messages={messages} />} />
        <Route path="/stats" element={<Stats messages={messages} />} />
        <Route path="/messages" element={<MessagesPage messages={messages} onSelect={m => setSelected(m)} />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home messages={messages} />} />
      </Routes>

      <Footer />
      <MessageModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
