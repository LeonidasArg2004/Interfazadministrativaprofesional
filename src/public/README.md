# Carpeta Public - Marvin Cosmetic

Esta carpeta contiene todos los archivos estáticos públicos del sistema de gestión de Marvin Cosmetic.

## Estructura de Carpetas

```
/public
├── /images
│   ├── /logo          - Logo de la empresa y variantes
│   ├── /products      - Imágenes de productos cosméticos
│   ├── /banners       - Banners promocionales y marketing
│   └── /avatars       - Avatares de usuarios
└── /documents         - Documentos, PDFs y archivos
```

## Cómo usar las imágenes en el código

### Opción 1: Usando ImageWithFallback (Recomendado para nuevas imágenes)
```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback 
  src="/images/logo/logo.png" 
  alt="Marvin Cosmetic Logo"
  className="w-32 h-32"
/>
```

### Opción 2: Importación directa
```tsx
import logo from '/public/images/logo/logo.png';

<img src={logo} alt="Logo" />
```

### Opción 3: Ruta directa (para archivos estáticos)
```tsx
<img src="/images/logo/logo.png" alt="Logo" />
```

## Recomendaciones

### Para el Logo
- **Formato**: PNG con transparencia o SVG
- **Tamaño**: 512x512px (logo completo), 256x256px (icono)
- **Versiones**: Normal, blanco (para fondos oscuros), icono solo

### Para Productos
- **Formato**: JPG o PNG
- **Tamaño**: 800x800px
- **Fondo**: Blanco o transparente
- **Calidad**: Alta resolución para zoom

### Para Banners
- **Formato**: JPG o PNG
- **Tamaño**: 1920x600px (horizontal), 600x800px (vertical)
- **Peso**: Optimizado (máx 500KB)

### Para Avatares
- **Formato**: JPG o PNG
- **Tamaño**: 256x256px
- **Forma**: Cuadrada (el sistema aplica bordes redondeados)

## Optimización de Imágenes

Para mejor rendimiento, optimiza las imágenes antes de subirlas:
- Usa herramientas como TinyPNG o ImageOptim
- Mantén los archivos por debajo de 500KB cuando sea posible
- Usa JPG para fotografías, PNG para logos e iconos
- Considera usar WebP para mejor compresión

## Notas Importantes

- Todas las rutas son relativas a la carpeta `/public`
- Los archivos en esta carpeta son accesibles públicamente
- No guardes información sensible aquí
- Usa nombres descriptivos y sin espacios (ej: `producto-crema-facial.jpg`)
