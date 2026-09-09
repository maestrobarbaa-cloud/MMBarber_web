"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Plus,
  Play,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Code2,
  Sparkles,
  FlaskConical,
  ChevronRight,
  Globe,
  Lock,
  Star,
} from "lucide-react";
import "./3d-lab.css";

// ─── Typy ────────────────────────────────────────────────────────────────────
interface Project3D {
  id: string;
  name: string;
  description: string;
  route: string;
  status: "active" | "draft" | "archived";
  tags: string[];
  createdAt: string;
  isPublic: boolean;
  thumbnail: string; // emoji jako placeholder
}

// ─── Výchozí projekty ────────────────────────────────────────────────────────
const defaultProjects: Project3D[] = [
  {
    id: "physics-demo",
    name: "Mafia City Drive",
    description: "Arkádová jízda autem po temném mafiánském městě. Sbírejte zlaté mince a vyhněte se zdem!",
    route: "/physics-demo",
    status: "active",
    tags: ["Game", "Three.js", "Rapier", "Physics"],
    createdAt: "2026-09-07",
    isPublic: true,
    thumbnail: "🎾",
  },
  {
    id: "barber-experience",
    name: "Barber 3D Experience",
    description:
      "Interaktivní 3D scéna s barber shop předměty. Nůžky, strojek, křeslo a holící štětec ve vesmírném prostředí.",
    route: "/3d-experience",
    status: "active",
    tags: ["Three.js", "React Three Fiber", "Drei", "WebGL"],
    createdAt: "2026-09-06",
    isPublic: false,
    thumbnail: "✂️",
  },
];

// ─── Formulář pro nový projekt ────────────────────────────────────────────────
function NewProjectModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (p: Project3D) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    route: "",
    tags: "",
    thumbnail: "🎮",
    isPublic: false,
  });

  const emojis = ["🎮", "✂️", "🚗", "🏠", "🌌", "🎲", "💈", "🔮", "🎭", "🌊"];

  const handleSubmit = () => {
    if (!form.name || !form.route) return;
    const project: Project3D = {
      id: crypto.randomUUID(),
      name: form.name,
      description: form.description,
      route: form.route.startsWith("/") ? form.route : `/${form.route}`,
      status: "draft",
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString().split("T")[0],
      isPublic: form.isPublic,
      thumbnail: form.thumbnail,
    };
    onAdd(project);
    onClose();
  };

  return (
    <motion.div
      className="lab-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lab-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lab-modal__header">
          <FlaskConical className="lab-modal__icon" />
          <h2>Nový 3D projekt</h2>
        </div>

        <div className="lab-modal__body">
          {/* Thumbnail emoji */}
          <div className="lab-field">
            <label>Ikona projektu</label>
            <div className="lab-emoji-picker">
              {emojis.map((e) => (
                <button
                  key={e}
                  className={`lab-emoji ${form.thumbnail === e ? "lab-emoji--active" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, thumbnail: e }))}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="lab-field">
            <label>Název projektu *</label>
            <input
              className="lab-input"
              placeholder="Např. Barbershop Universe"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="lab-field">
            <label>Popis</label>
            <textarea
              className="lab-input lab-textarea"
              placeholder="Co scéna zobrazuje, jak funguje..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="lab-field">
            <label>Route (URL cesta) *</label>
            <input
              className="lab-input lab-input--mono"
              placeholder="/3d-muj-projekt"
              value={form.route}
              onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))}
            />
          </div>

          <div className="lab-field">
            <label>Tagy (oddělené čárkou)</label>
            <input
              className="lab-input"
              placeholder="Three.js, Physics, WebGL"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
          </div>

          <div className="lab-field lab-field--row">
            <label>Veřejně přístupné</label>
            <button
              className={`lab-toggle ${form.isPublic ? "lab-toggle--on" : ""}`}
              onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))}
            >
              <span className="lab-toggle__thumb" />
            </button>
          </div>
        </div>

        <div className="lab-modal__footer">
          <button className="lab-btn lab-btn--ghost" onClick={onClose}>
            Zrušit
          </button>
          <button
            className="lab-btn lab-btn--primary"
            onClick={handleSubmit}
            disabled={!form.name || !form.route}
          >
            <Plus size={16} />
            Vytvořit projekt
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Karta projektu ───────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onDelete,
  onTogglePublic,
  onOpen,
}: {
  project: Project3D;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string) => void;
  onOpen: (route: string) => void;
}) {
  const statusColors: Record<string, string> = {
    active: "#4ade80",
    draft: "#c8a96e",
    archived: "#6b7280",
  };
  const statusLabels: Record<string, string> = {
    active: "Aktivní",
    draft: "Draft",
    archived: "Archivováno",
  };

  return (
    <motion.div
      className="lab-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
    >
      <div className="lab-card__thumbnail">{project.thumbnail}</div>

      <div className="lab-card__body">
        <div className="lab-card__top">
          <h3 className="lab-card__title">{project.name}</h3>
          <span
            className="lab-card__status"
            style={{ color: statusColors[project.status] }}
          >
            <span
              className="lab-card__status-dot"
              style={{ background: statusColors[project.status] }}
            />
            {statusLabels[project.status]}
          </span>
        </div>

        <p className="lab-card__desc">{project.description}</p>

        <div className="lab-card__route">
          <Code2 size={12} />
          <code>{project.route}</code>
        </div>

        {project.tags.length > 0 && (
          <div className="lab-card__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="lab-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="lab-card__footer">
          <span className="lab-card__date">📅 {project.createdAt}</span>
          <div className="lab-card__actions">
            <button
              className="lab-icon-btn"
              title={project.isPublic ? "Veřejné" : "Soukromé"}
              onClick={() => onTogglePublic(project.id)}
            >
              {project.isPublic ? (
                <Globe size={15} className="text-green-400" />
              ) : (
                <Lock size={15} className="text-gray-500" />
              )}
            </button>
            <button
              className="lab-icon-btn lab-icon-btn--danger"
              title="Smazat"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 size={15} />
            </button>
            <button
              className="lab-icon-btn lab-icon-btn--primary"
              title="Otevřít scénu"
              onClick={() => onOpen(project.route)}
            >
              <Play size={15} />
              Otevřít
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hlavní stránka ───────────────────────────────────────────────────────────
export default function Lab3DPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project3D[]>(defaultProjects);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const handleAdd = (p: Project3D) => setProjects((ps) => [p, ...ps]);
  const handleDelete = (id: string) =>
    setProjects((ps) => ps.filter((p) => p.id !== id));
  const handleTogglePublic = (id: string) =>
    setProjects((ps) =>
      ps.map((p) => (p.id === id ? { ...p, isPublic: !p.isPublic } : p))
    );

  return (
    <div className="lab-page">
      {/* ── Pozadí grid ── */}
      <div className="lab-bg">
        <div className="lab-bg__grid" />
        <div className="lab-bg__glow lab-bg__glow--1" />
        <div className="lab-bg__glow lab-bg__glow--2" />
      </div>

      <div className="lab-container">
        {/* ── Header ── */}
        <div className="lab-header">
          <div className="lab-header__left">
            <div className="lab-header__icon">
              <FlaskConical size={28} />
            </div>
            <div>
              <div className="lab-header__badge">
                <Sparkles size={11} />
                VÝVOJOVÝ KOUTEK
              </div>
              <h1 className="lab-header__title">3D Lab</h1>
              <p className="lab-header__subtitle">
                Spravuj a vytvářej interaktivní 3D projekty pro MMBARBER web
              </p>
            </div>
          </div>
          <button className="lab-btn lab-btn--primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Nový projekt
          </button>
        </div>

        {/* ── Rychlé tipy ── */}
        <div className="lab-tips">
          <div className="lab-tip">
            <span className="lab-tip__icon">⌨️</span>
            <span>
              Otevři CommandPalette (<kbd>Ctrl+K</kbd>) a napiš{" "}
              <kbd className="lab-kbd">vyvoj3d</kbd>
            </span>
          </div>
          <div className="lab-tip">
            <span className="lab-tip__icon">🔗</span>
            <span>
              Přímý odkaz:{" "}
              <code className="lab-code">/3d-experience</code>
            </span>
          </div>
          <div className="lab-tip">
            <span className="lab-tip__icon">📦</span>
            <span>
              Stack: <strong>Three.js</strong> +{" "}
              <strong>React Three Fiber</strong> + <strong>Drei</strong>
            </span>
          </div>
        </div>

        {/* ── Statistiky ── */}
        <div className="lab-stats">
          <div className="lab-stat">
            <Box size={20} className="lab-stat__icon" />
            <div>
              <div className="lab-stat__value">{projects.length}</div>
              <div className="lab-stat__label">Projektů celkem</div>
            </div>
          </div>
          <div className="lab-stat">
            <Star size={20} className="lab-stat__icon lab-stat__icon--gold" />
            <div>
              <div className="lab-stat__value">
                {projects.filter((p) => p.status === "active").length}
              </div>
              <div className="lab-stat__label">Aktivních</div>
            </div>
          </div>
          <div className="lab-stat">
            <Globe size={20} className="lab-stat__icon lab-stat__icon--green" />
            <div>
              <div className="lab-stat__value">
                {projects.filter((p) => p.isPublic).length}
              </div>
              <div className="lab-stat__label">Veřejných</div>
            </div>
          </div>
        </div>

        {/* ── Filtry ── */}
        <div className="lab-filters">
          {(["all", "active", "draft"] as const).map((f) => (
            <button
              key={f}
              className={`lab-filter ${filter === f ? "lab-filter--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Vše" : f === "active" ? "Aktivní" : "Draft"}
            </button>
          ))}
        </div>

        {/* ── Projekty ── */}
        <motion.div className="lab-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onTogglePublic={handleTogglePublic}
                onOpen={(route) => router.push(route)}
              />
            ))}
            {filteredProjects.length === 0 && (
              <motion.div
                className="lab-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FlaskConical size={48} className="lab-empty__icon" />
                <p>Žádné projekty v této kategorii</p>
                <button
                  className="lab-btn lab-btn--primary"
                  onClick={() => setShowModal(true)}
                >
                  <Plus size={16} />
                  Přidat první projekt
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <NewProjectModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
        )}
      </AnimatePresence>
    </div>
  );
}
