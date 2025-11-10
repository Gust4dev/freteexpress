import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/auth";
import Spinner from "./Spinner";

export default function ProfileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, token, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    role: user?.role || "driver",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any)?.phone || "",
        role: user.role || "driver",
      });
    }
  }, [user, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateMe({
        name: profile.name,
        phone: profile.phone,
        role: profile.role,
      });

      login(token || "", updatedUser, true);
      setEditing(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Falha ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any)?.phone || "",
        role: user.role || "driver",
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed top-0 right-0 z-50 h-full w-[340px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-gray-400">Perfil</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Informações básicas
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={editing ? handleCancel : () => setEditing(true)}
                className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700"
              >
                {editing ? "Cancelar" : "Editar"}
              </button>
              <button
                onClick={onClose}
                className="text-sm px-3 py-1 rounded-full bg-white dark:bg-gray-700 shadow"
              >
                Fechar
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold">
                {(profile.name || "U")[0]}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {profile.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 capitalize">
                  {profile.role}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500">Nome</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className={`input-field ${
                  !editing && "opacity-80 cursor-not-allowed"
                }`}
                readOnly={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500">E-mail</label>
              <input
                name="email"
                value={profile.email}
                className="input-field opacity-80 cursor-not-allowed"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500">Telefone</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className={`input-field ${
                  !editing && "opacity-80 cursor-not-allowed"
                }`}
                readOnly={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500">Função</label>
              <select
                name="role"
                value={profile.role}
                onChange={handleChange}
                className={`input-field ${
                  !editing && "opacity-80 cursor-not-allowed"
                }`}
                disabled={!editing}
              >
                <option value="client">Cliente</option>
                <option value="driver">Entregador</option>
              </select>
            </div>

            {error && <div className="text-red-500 text-sm pt-2">{error}</div>}

            {editing && (
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Salvar"}
                </button>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
