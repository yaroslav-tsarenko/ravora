"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCategories = () => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(Array.isArray(d) ? d : [])).catch(console.error);
  };

  useEffect(fetchCategories, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      const url = editId ? `/api/categories/${editId}` : "/api/categories";
      const method = editId ? "PATCH" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      toast.success(editId ? "Category updated" : "Category created");
      setName("");
      setEditId(null);
      setIsOpen(false);
      fetchCategories();
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setIsOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setName("");
    setIsOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={openNew}>Add Category</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            className="admin-item-card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
          >
            <div>
              <span style={{ fontWeight: 600, color: "var(--admin-text)" }}>{cat.name}</span>
              <span style={{ color: "var(--admin-text-muted)", marginLeft: "0.5rem", fontSize: "0.8125rem" }}>
                ({cat._count?.products || 0} products)
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button isIconOnly size="sm" variant="flat" onPress={() => openEdit(cat)}><Pencil size={14} /></Button>
              <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => handleDelete(cat.id)}><Trash2 size={14} /></Button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="admin-modal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="admin-modal-title">{editId ? "Edit" : "Add"} Category</h3>
              <div>
                <label className="admin-label">Name</label>
                <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <Button variant="light" onPress={() => setIsOpen(false)}>Cancel</Button>
                <Button color="primary" onPress={handleSave}>Save</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
