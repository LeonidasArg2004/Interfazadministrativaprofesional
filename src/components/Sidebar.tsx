import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onLogout,
  collapsed,
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'files', label: 'Archivos', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div
      className={cn(
        'h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo y Nombre de la Empresa */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700/50 px-4">
        <div className="flex items-center gap-3">
          {/* Contenedor del Logo con efecto glassmorphism */}
          <motion.div
            className="relative w-10 h-10 bg-gradient-to-br from-[#1a936f] to-[#88d498] rounded-lg flex items-center justify-center shadow-lg shadow-[#1a936f]/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Efecto de brillo interno */}
            <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm" />

            {/* Icono temporal - puedes reemplazar con tu logo */}
            <Sparkles className="w-6 h-6 text-white relative z-10" />

            {/* Efecto de pulso */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-[#88d498]/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <span className="text-white font-semibold">Marvin Cosmetic</span>
              <span className="text-xs text-[#88d498]">Sistema de Gestión</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                'hover:bg-slate-800',
                isActive && 'bg-gradient-to-r from-[#1a936f]/20 to-[#88d498]/20 border border-[#1a936f]/30',
                collapsed ? 'justify-center' : ''
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5',
                  isActive ? 'text-[#88d498]' : 'text-slate-400'
                )}
              />
              {!collapsed && (
                <span
                  className={cn(
                    isActive ? 'text-white' : 'text-slate-400'
                  )}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={onLogout}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
            'hover:bg-red-500/10 text-red-400',
            collapsed ? 'justify-center' : ''
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>

      {/* Toggle collapse button */}
      <button
        onClick={onToggleCollapse}
        className="h-12 border-t border-slate-700/50 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};