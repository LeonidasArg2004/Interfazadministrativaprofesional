import React, { useState } from 'react';
import { useApp } from '../lib/context';
import {
  Upload,
  FileText,
  Image,
  Download,
  Trash2,
  Search,
  File,
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

export const FilesModule: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    file: null as File | null,
  });

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) return;

    const docData = {
      name: formData.name || formData.file.name,
      category: formData.category || 'General',
      date: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(formData.file),
      type: formData.file.type,
    };

    addDocument(docData);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      file: null,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      deleteDocument(id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        name: formData.name || file.name,
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) {
      return <Image className="w-5 h-5 text-blue-400" />;
    } else if (type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-400" />;
    } else {
      return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-1">Gestión de Archivos</h1>
          <p className="text-slate-400">
            Administra documentos y archivos del sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Archivo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Subir Nuevo Archivo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="file" className="text-slate-300">
                  Seleccionar Archivo
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="bg-slate-700/50 border-slate-600 text-white file:text-white"
                  required
                />
                <p className="text-slate-400 mt-2">
                  Formatos permitidos: PDF, Imágenes, Documentos
                </p>
              </div>

              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Nombre del Archivo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Nombre descriptivo"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-slate-300">
                  Categoría
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Productos">Productos</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                    <SelectItem value="Reportes">Reportes</SelectItem>
                    <SelectItem value="Documentación">Documentación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  disabled={!formData.file}
                >
                  Subir Archivo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400">Total de Archivos</p>
              <h3 className="text-white">{documents.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400">Imágenes</p>
              <h3 className="text-white">
                {documents.filter((d) => d.type.includes('image')).length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400">Documentos PDF</p>
              <h3 className="text-white">
                {documents.filter((d) => d.type.includes('pdf')).length}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
      </Card>

      {/* Files list */}
      {documents.length === 0 ? (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-white mb-2">
              No hay archivos subidos
            </h3>
            <p className="text-slate-400 mb-6">
              Comienza subiendo tu primer archivo
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Archivo
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300">Tipo</TableHead>
                <TableHead className="text-slate-300">Nombre</TableHead>
                <TableHead className="text-slate-300">Categoría</TableHead>
                <TableHead className="text-slate-300">Fecha</TableHead>
                <TableHead className="text-slate-300 text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="border-slate-700 hover:bg-slate-700/30"
                >
                  <TableCell>{getFileIcon(doc.type)}</TableCell>
                  <TableCell className="text-white">{doc.name}</TableCell>
                  <TableCell className="text-slate-300">
                    {doc.category}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {new Date(doc.date).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => window.open(doc.url, '_blank')}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
