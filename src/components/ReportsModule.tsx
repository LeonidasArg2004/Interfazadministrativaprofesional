import React, { useState } from 'react';
import { useApp } from '../lib/context';
import {
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const ReportsModule: React.FC = () => {
  const { sales, products, currency } = useApp();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate profit for a sale
  const calculateProfit = (sale: any) => {
    const product = products.find((p) => p.id === sale.productId);
    if (!product) return 0;
    const cost = product.costPrice * sale.quantity;
    return sale.total - cost;
  };

  // Get data based on period
  const getWeeklyData = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const daySales = sales.filter((s) => s.date === dateStr);
      const revenue = daySales.reduce((sum, s) => sum + s.total, 0);
      const profit = daySales.reduce((sum, s) => sum + calculateProfit(s), 0);

      return {
        name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        ventas: revenue,
        ganancias: profit,
      };
    });
  };

  const getMonthlyData = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthName = date.toLocaleDateString('es-ES', { month: 'short' });

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthSales = sales.filter((s) => {
        const saleDate = new Date(s.date);
        return saleDate >= monthStart && saleDate <= monthEnd;
      });

      const revenue = monthSales.reduce((sum, s) => sum + s.total, 0);
      const profit = monthSales.reduce((sum, s) => sum + calculateProfit(s), 0);

      return {
        name: monthName,
        ventas: revenue,
        ganancias: profit,
      };
    });
  };

  const getYearlyData = () => {
    return Array.from({ length: 3 }, (_, i) => {
      const year = new Date().getFullYear() - (2 - i);
      const yearSales = sales.filter((s) => {
        const saleDate = new Date(s.date);
        return saleDate.getFullYear() === year;
      });

      const revenue = yearSales.reduce((sum, s) => sum + s.total, 0);
      const profit = yearSales.reduce((sum, s) => sum + calculateProfit(s), 0);

      return {
        name: year.toString(),
        ventas: revenue,
        ganancias: profit,
      };
    });
  };

  const getData = () => {
    switch (period) {
      case 'week':
        return getWeeklyData();
      case 'month':
        return getMonthlyData();
      case 'year':
        return getYearlyData();
      default:
        return getMonthlyData();
    }
  };

  const chartData = getData();

  // Product sales distribution
  const productSalesData = products.map((product) => {
    const productSales = sales.filter((s) => s.productId === product.id);
    const totalSales = productSales.reduce((sum, s) => sum + s.total, 0);
    return {
      name: product.name,
      value: totalSales,
    };
  });

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Total metrics
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalProfit = sales.reduce((sum, s) => sum + calculateProfit(s), 0);
  const totalSales = sales.length;

  const exportToExcel = () => {
    alert('Exportando reportes a Excel... (Funcionalidad de demostración)');
  };

  const exportToPDF = () => {
    alert('Exportando reportes a PDF... (Funcionalidad de demostración)');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-1">Reportes y Estadísticas</h1>
          <p className="text-slate-400">Análisis detallado de tu negocio</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
          <Button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 mb-2">Total de Ventas</p>
              <h2 className="text-white mb-1">
                {currency}{totalRevenue.toFixed(2)}
              </h2>
              <p className="text-slate-400">{totalSales} transacciones</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 mb-2">Ganancia Total</p>
              <h2 className="text-white mb-1">
                {currency}{totalProfit.toFixed(2)}
              </h2>
              <p className="text-slate-400">
                Margen: {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 mb-2">Promedio por Venta</p>
              <h2 className="text-white mb-1">
                {currency}{totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : '0.00'}
              </h2>
              <p className="text-slate-400">Ticket promedio</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="bar" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="bar" className="data-[state=active]:bg-slate-700">
              Gráfico de Barras
            </TabsTrigger>
            <TabsTrigger value="line" className="data-[state=active]:bg-slate-700">
              Gráfico de Líneas
            </TabsTrigger>
            <TabsTrigger value="pie" className="data-[state=active]:bg-slate-700">
              Distribución
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              onClick={() => setPeriod('week')}
              className={
                period === 'week'
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }
            >
              Semana
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              onClick={() => setPeriod('month')}
              className={
                period === 'month'
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }
            >
              Mes
            </Button>
            <Button
              variant={period === 'year' ? 'default' : 'outline'}
              onClick={() => setPeriod('year')}
              className={
                period === 'year'
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }
            >
              Año
            </Button>
          </div>
        </div>

        <TabsContent value="bar" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
            <div className="mb-6">
              <h3 className="text-white mb-1">Comparativa de Ventas y Ganancias</h3>
              <p className="text-slate-400">
                {period === 'week' && 'Últimos 7 días'}
                {period === 'month' && 'Últimos 12 meses'}
                {period === 'year' && 'Últimos 3 años'}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="ventas" fill="#8b5cf6" name="Ventas" />
                <Bar dataKey="ganancias" fill="#3b82f6" name="Ganancias" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
            <div className="mb-6">
              <h3 className="text-white mb-1">Tendencia de Ventas y Ganancias</h3>
              <p className="text-slate-400">
                {period === 'week' && 'Últimos 7 días'}
                {period === 'month' && 'Últimos 12 meses'}
                {period === 'year' && 'Últimos 3 años'}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="Ventas"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="ganancias"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Ganancias"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
            <div className="mb-6">
              <h3 className="text-white mb-1">Distribución de Ventas por Producto</h3>
              <p className="text-slate-400">Total acumulado por cada producto</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={productSalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productSalesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => `${currency}${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Best product */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
        <h3 className="text-white mb-4">Mejor Producto del Periodo</h3>
        <div className="space-y-3">
          {productSalesData
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : index === 1
                        ? 'bg-slate-400/20 text-slate-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white">{product.name}</p>
                    <p className="text-slate-400">
                      {currency}{product.value.toFixed(2)} en ventas
                    </p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
