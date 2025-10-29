# Recomiéndame - Sitio Web

Sitio web oficial de Recomiéndame, tu coach nutricional con inteligencia artificial.

## 🚀 Características

- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **Colores Consistentes**: Mantiene la identidad visual de la app móvil
- **Páginas Completas**: Inicio, descarga, términos, contacto y más
- **Formularios Funcionales**: Reset password, verificación de email, eliminación de cuenta
- **SEO Optimizado**: Meta tags y estructura semántica
- **Rendimiento**: Construido con Nuxt.js y Tailwind CSS

## 🎨 Paleta de Colores

### Colores Principales
- **Verde Principal**: `#4CAF50` - Color primario de la marca
- **Verde Claro**: `#81C784` - Acentos y elementos secundarios  
- **Verde Oscuro**: `#2E7D32` - Textos y elementos de contraste
- **Naranja**: `#FF9800` - Elementos de acción y destacados

### Colores de Soporte
- **Fondo**: `#f5f5f5` - Fondo general de la aplicación
- **Blanco**: `#fff` - Tarjetas y elementos principales
- **Grises**: `#333`, `#666`, `#999` - Textos y elementos neutros

## 📱 Páginas Incluidas

### Páginas Principales
- **`/`** - Página de inicio con hero, características y CTA
- **`/download`** - Descarga de la app con enlaces a stores
- **`/contact`** - Formulario de contacto y información

### Páginas de Soporte
- **`/terms`** - Términos y condiciones completos
- **`/reset-password`** - Formulario para restablecer contraseña
- **`/verify-email`** - Verificación de correo electrónico
- **`/delete-account`** - Proceso de eliminación de cuenta

## 🛠 Tecnologías

- **Nuxt.js 3** - Framework Vue.js para aplicaciones web
- **Tailwind CSS** - Framework de CSS utilitario
- **Vue 3** - Framework JavaScript reactivo
- **TypeScript** - Tipado estático para JavaScript

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
recomiendame-pelis/
├── assets/
│   └── css/
│       └── main.css          # Estilos globales y Tailwind
├── layouts/
│   └── default.vue           # Layout principal con navegación
├── pages/
│   ├── index.vue            # Página de inicio
│   ├── download.vue         # Descarga de la app
│   ├── contact.vue          # Contacto
│   ├── terms.vue            # Términos y condiciones
│   ├── reset-password.vue   # Restablecer contraseña
│   ├── verify-email.vue     # Verificar email
│   └── delete-account.vue   # Eliminar cuenta
├── nuxt.config.ts           # Configuración de Nuxt
├── tailwind.config.js       # Configuración de Tailwind
└── package.json             # Dependencias del proyecto
```

## 🎯 Funcionalidades Implementadas

### Formularios Interactivos
- ✅ Formulario de contacto con validación
- ✅ Reset de contraseña con estados de carga
- ✅ Verificación de email con polling
- ✅ Eliminación de cuenta con confirmaciones

### Componentes Reutilizables
- ✅ Navegación responsive con menú móvil
- ✅ Footer completo con enlaces
- ✅ Botones con estados de carga
- ✅ Mensajes de éxito y error

### SEO y Accesibilidad
- ✅ Meta tags optimizados por página
- ✅ Estructura semántica HTML
- ✅ Navegación accesible por teclado
- ✅ Contraste de colores adecuado

## 🔧 Personalización

### Colores
Los colores están definidos en `tailwind.config.js` y pueden modificarse fácilmente:

```javascript
colors: {
  primary: {
    500: '#4CAF50', // Verde principal
    // ... otros tonos
  },
  secondary: {
    500: '#FF9800', // Naranja
    // ... otros tonos
  }
}
```

### Componentes
Los estilos de componentes están en `assets/css/main.css`:

```css
.btn-primary {
  @apply bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-soft hover:shadow-medium;
}
```

## 📱 Responsive Design

El sitio está optimizado para:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🔗 Enlaces Importantes

- **App Store**: Configurar enlace real en `pages/download.vue`
- **Google Play**: Configurar enlace real en `pages/download.vue`
- **API Endpoints**: Configurar en los formularios para funcionalidad real

## 📞 Soporte

Para soporte técnico o consultas sobre el sitio web:
- Email: hola@recomiendamecoach.com
- Formulario de contacto: `/contact`

---

Desarrollado con ❤️ para Recomiéndame