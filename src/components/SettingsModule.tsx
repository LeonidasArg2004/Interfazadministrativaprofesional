import React, { useState } from 'react';
import { useApp } from '../lib/context';
import {
  Save,
  Upload,
  Lock,
  Globe,
  Palette,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner@2.0.3';

export const SettingsModule: React.FC = () => {
  const { theme, toggleTheme, currency, updateCurrency, companyLogo, updateCompanyLogo } = useApp();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Mock password change
    toast.success('Contraseña actualizada correctamente');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateCompanyLogo(url);
      toast.success('Logo actualizado correctamente');
    }
  };

  const handleSaveCurrency = () => {
    updateCurrency(selectedCurrency);
    toast.success('Configuración guardada correctamente');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-1">Configuración del Sistema</h1>
        <p className="text-slate-400">Personaliza tu experiencia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Logo */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white">Logo de la Empresa</h3>
              <p className="text-slate-400">Personaliza tu marca</p>
            </div>
          </div>

          <div className="space-y-4">
            {companyLogo && (
              <div className="flex justify-center p-4 bg-slate-700/30 rounded-lg">
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="max-h-32 object-contain"
                />
              </div>
            )}

            <div>
              <Label htmlFor="logo" className="text-slate-300">
                Subir nuevo logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="bg-slate-700/50 border-slate-600 text-white file:text-white mt-2"
              />
            </div>
          </div>
        </Card>

        {/* Theme */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white">Apariencia</h3>
              <p className="text-slate-400">Cambia el tema visual</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-purple-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
                <div>
                  <p className="text-white">Modo Oscuro</p>
                  <p className="text-slate-400">
                    {theme === 'dark' ? 'Activado' : 'Desactivado'}
                  </p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </Card>

        {/* Regional Settings */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white">Configuración Regional</h3>
              <p className="text-slate-400">Moneda y formato</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="currency" className="text-slate-300">
                Símbolo de Moneda
              </Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="$">$ - Dólar (USD)</SelectItem>
                  <SelectItem value="€">€ - Euro (EUR)</SelectItem>
                  <SelectItem value="£">£ - Libra (GBP)</SelectItem>
                  <SelectItem value="¥">¥ - Yen (JPY)</SelectItem>
                  <SelectItem value="MXN$">MXN$ - Peso Mexicano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSaveCurrency}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white">Seguridad</h3>
              <p className="text-slate-400">Cambiar contraseña</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-slate-300">
                Nueva Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white mt-2"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white mt-2"
                placeholder="Repite la contraseña"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Actualizar Contraseña
            </Button>
          </form>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white mb-2">
              Información del Sistema
            </h3>
            <p className="text-slate-300">
              Sistema de Gestión de Producción y Ventas v1.0
            </p>
            <p className="text-slate-400 mt-1">
              Para soporte técnico, contacta al administrador del sistema
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
