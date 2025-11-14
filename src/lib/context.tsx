import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  status: 'active' | 'inactive';
}

interface Sale {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Document {
  id: string;
  name: string;
  category: string;
  date: string;
  url: string;
  type: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;
  companyLogo: string;
  updateCompanyLogo: (logo: string) => void;
  currency: string;
  updateCurrency: (currency: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    code: 'PROD-001',
    name: 'Producto Premium A',
    costPrice: 50,
    salePrice: 100,
    stock: 150,
    status: 'active',
  },
  {
    id: '2',
    code: 'PROD-002',
    name: 'Producto Standard B',
    costPrice: 30,
    salePrice: 60,
    stock: 200,
    status: 'active',
  },
];

const mockSales: Sale[] = [
  {
    id: '1',
    date: '2025-11-12',
    productId: '1',
    productName: 'Producto Premium A',
    quantity: 5,
    unitPrice: 100,
    discount: 0,
    total: 500,
  },
  {
    id: '2',
    date: '2025-11-11',
    productId: '2',
    productName: 'Producto Standard B',
    quantity: 10,
    unitPrice: 60,
    discount: 5,
    total: 595,
  },
  {
    id: '3',
    date: '2025-11-10',
    productId: '1',
    productName: 'Producto Premium A',
    quantity: 3,
    unitPrice: 100,
    discount: 0,
    total: 300,
  },
  {
    id: '4',
    date: '2025-11-09',
    productId: '2',
    productName: 'Producto Standard B',
    quantity: 8,
    unitPrice: 60,
    discount: 0,
    total: 480,
  },
  {
    id: '5',
    date: '2025-11-08',
    productId: '1',
    productName: 'Producto Premium A',
    quantity: 12,
    unitPrice: 100,
    discount: 10,
    total: 1190,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [currency, setCurrency] = useState<string>('$');

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const login = (email: string, password: string): boolean => {
    // Mock authentication - only admin can login

    if (email === 'admin@empresa.com' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Administrador',
        email: 'admin@empresa.com',
        role: 'admin',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...product } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = {
      ...sale,
      id: Date.now().toString(),
    };
    setSales(prev => [newSale, ...prev]);

    // Update product stock
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      updateProduct(product.id, { stock: product.stock - sale.quantity });
    }
  };

  const addDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc = {
      ...doc,
      id: Date.now().toString(),
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const updateCompanyLogo = (logo: string) => {
    setCompanyLogo(logo);
  };

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        theme,
        toggleTheme,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        sales,
        addSale,
        documents,
        addDocument,
        deleteDocument,
        companyLogo,
        updateCompanyLogo,
        currency,
        updateCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
