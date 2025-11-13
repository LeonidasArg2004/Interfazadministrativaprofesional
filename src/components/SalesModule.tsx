import React, { useState } from 'react';
import { useApp } from '../lib/context';
import {
  Plus,
  Download,
  Search,
  Calendar,
  Filter,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const SalesModule: React.FC = () => {
  const { sales, products, addSale, currency } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    discount: '',
  });

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || sale.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const subtotal = selectedProduct
    ? selectedProduct.salePrice * parseFloat(formData.quantity || '0')
    : 0;
  const discount = parseFloat(formData.discount || '0');
  const total = subtotal - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) return;

    const saleData = {
      date: new Date().toISOString().split('T')[0],
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: parseInt(formData.quantity),
      unitPrice: selectedProduct.salePrice,
      discount: parseFloat(formData.discount || '0'),
      total: total,
    };

    addSale(saleData);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
      discount: '',
    });
  };

  const exportToExcel = () => {
    alert('Exportando ventas a Excel... (Funcionalidad de demostración)');
  };

  const exportToPDF = () => {
    alert('Exportando ventas a PDF... (Funcionalidad de demostración)');
  };

  const totalSalesAmount = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItemsSold = filteredSales.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-1">Registro de Ventas</h1>
          <p className="text-slate-400">Gestiona tus transacciones de venta</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Venta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Venta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product" className="text-slate-300">
                    Seleccionar Producto
                  </Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, productId: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Elige un producto" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {products
                        .filter((p) => p.status === 'active')
                        .map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {currency}{product.salePrice} (Stock: {product.stock})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProduct && (
                  <Card className="bg-slate-700/30 border-slate-600 p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Precio Unitario</p>
                        <p className="text-white">
                          {currency}{selectedProduct.salePrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Stock Disponible</p>
                        <p className="text-white">{selectedProduct.stock}</p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-slate-300">
                      Cantidad
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedProduct?.stock || 0}
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                      disabled={!selectedProduct}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount" className="text-slate-300">
                      Descuento (Opcional)
                    </Label>
                    <Input
                      id="discount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      disabled={!selectedProduct}
                    />
                  </div>
                </div>

                {selectedProduct && formData.quantity && (
                  <Card className="bg-purple-500/10 border-purple-500/30 p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Subtotal:</span>
                        <span className="text-white">
                          {currency}{subtotal.toFixed(2)}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Descuento:</span>
                          <span className="text-orange-400">
                            -{currency}{discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-slate-600">
                        <span className="text-white">Total:</span>
                        <span className="text-green-400">
                          {currency}{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    disabled={!selectedProduct || !formData.quantity}
                  >
                    Registrar Venta
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 p-6">
          <p className="text-slate-400 mb-2">Total en Ventas</p>
          <h2 className="text-white">
            {currency}{totalSalesAmount.toFixed(2)}
          </h2>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 p-6">
          <p className="text-slate-400 mb-2">Artículos Vendidos</p>
          <h2 className="text-white">{totalItemsSold}</h2>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 w-52 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-slate-700/50">
              <TableHead className="text-slate-300">Fecha</TableHead>
              <TableHead className="text-slate-300">Producto</TableHead>
              <TableHead className="text-slate-300">Cantidad</TableHead>
              <TableHead className="text-slate-300">P. Unitario</TableHead>
              <TableHead className="text-slate-300">Descuento</TableHead>
              <TableHead className="text-slate-300">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow
                key={sale.id}
                className="border-slate-700 hover:bg-slate-700/30"
              >
                <TableCell className="text-slate-300">
                  {new Date(sale.date).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell className="text-white">{sale.productName}</TableCell>
                <TableCell className="text-slate-300">{sale.quantity}</TableCell>
                <TableCell className="text-slate-300">
                  {currency}{sale.unitPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-orange-400">
                  {sale.discount > 0 ? `${currency}${sale.discount.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell className="text-green-400">
                  {currency}{sale.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
