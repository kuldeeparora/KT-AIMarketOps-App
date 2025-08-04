# CSS Import Rules Documentation

## 📋 Overview

This document explains the comprehensive @import rules implemented in the admin dashboard stylesheets for advanced features.

## 🎯 Import Structure

### 1. **Primary Stylesheet** (`globals.css`)
Contains the main @import rules at the top of the file:

```css
/* Google Fonts - Primary Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Google Fonts - Monospace for Code/Data */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');

/* Google Fonts - Display Fonts for Headers */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap');

/* Icon Libraries */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Two+Tone');
@import url('https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.css');
@import url('https://unpkg.com/lucide@latest/dist/umd/lucide.css');

/* Charting and Data Visualization */
@import url('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.css');

/* Table Components */
@import url('https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css');
@import url('https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css');

/* Form Components */
@import url('https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
@import url('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');

/* Notification Components */
@import url('https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css');

/* Animation Libraries */
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

/* Code Highlighting */
@import url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css');

/* Theming */
@import url('https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2.4.8/dist/css-vars-ponyfill.min.css');
```

### 2. **Utilities Stylesheet** (`utilities.css`)
Contains advanced utility classes for the implemented features:

- AI Features styling
- Financial Management styling
- SEO Features styling
- Analytics Dashboard styling
- Automation Features styling
- Marketing & Advertising styling
- Integration Features styling

### 3. **Comprehensive Imports** (`imports.css`)
Contains all external resource imports organized by category:

- Google Fonts (Primary, Monospace, Display)
- Icon Libraries (Font Awesome, Material Icons, Feather, Lucide)
- Charting and Data Visualization
- Table and Data Components
- Form Components
- Notification and Alert Components
- Animation Libraries
- Code Highlighting
- Theming and Customization
- Utility Libraries
- File Handling
- Editor Components
- Map and Location
- Accessibility
- Performance Optimization
- Security
- Monitoring and Analytics

## 🚀 Font Stack Implementation

### Primary Font Stack
```css
html {
  font-family: 'Inter', 'Roboto', 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
}
```

### Monospace Font Stack
```css
code, pre, .font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}
```

### Display Font Stack
```css
h1, h2, h3, .font-display {
  font-family: 'Playfair Display', 'Merriweather', Georgia, serif;
}
```

## 🎨 Advanced Feature Styling

### AI Features
```css
.ai-feature-card {
  @apply bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-6;
}

.ai-feature-icon {
  @apply w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center;
}
```

### Financial Management
```css
.financial-card {
  @apply bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-lg p-6;
}

.profit-positive {
  @apply text-green-600 font-semibold;
}
```

### SEO Features
```css
.seo-score-excellent {
  @apply text-green-600 bg-green-50 border-green-200;
}

.seo-rank-top {
  @apply bg-green-100 text-green-800;
}
```

## 📊 Performance Optimizations

### Font Loading
```css
/* Preload critical fonts */
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>
```

### Lazy Loading
```css
/* Lazy Loading for Images */
@import url('https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js');
```

## 🔧 Usage Examples

### Using Font Classes
```html
<!-- Primary font -->
<p class="font-sans">This uses Inter font</p>

<!-- Monospace font -->
<code class="font-mono">This uses JetBrains Mono</code>

<!-- Display font -->
<h1 class="font-display">This uses Playfair Display</h1>
```

### Using Feature-Specific Classes
```html
<!-- AI Feature Card -->
<div class="ai-feature-card">
  <div class="ai-feature-icon">
    <i class="fas fa-robot"></i>
  </div>
  <h3>AI Assistant</h3>
</div>

<!-- Financial Card -->
<div class="financial-card">
  <h3>Revenue</h3>
  <p class="profit-positive">$50,000</p>
</div>

<!-- SEO Score -->
<div class="seo-score-excellent">
  <span>95/100</span>
</div>
```

### Using Animation Classes
```html
<!-- Fade in animation -->
<div class="fade-in">Content fades in</div>

<!-- Slide up animation -->
<div class="slide-up">Content slides up</div>

<!-- Scale in animation -->
<div class="scale-in">Content scales in</div>
```

## 📱 Responsive Design

### Responsive Utilities
```css
.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

.responsive-flex {
  @apply flex flex-col md:flex-row lg:flex-row xl:flex-row;
}

.responsive-text {
  @apply text-sm md:text-base lg:text-lg xl:text-xl;
}
```

## 🌙 Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  .dark-mode-auto {
    @apply bg-gray-900 text-gray-100;
  }
  
  .dark-mode-auto .card {
    @apply bg-gray-800 border-gray-700;
  }
}
```

## ♿ Accessibility Features

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus-visible {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}
```

## 🎯 Custom Properties

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --info-color: #06b6d4;
  
  --border-radius: 0.5rem;
  --transition-duration: 0.2s;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

## 📋 Best Practices

1. **Load Critical Resources First**: Google Fonts and essential icons
2. **Use CDN for Performance**: All external resources use CDN
3. **Implement Fallbacks**: Multiple font stacks for reliability
4. **Optimize for Performance**: Lazy loading and preloading
5. **Maintain Accessibility**: Screen reader support and focus management
6. **Support Dark Mode**: Automatic dark mode detection
7. **Responsive Design**: Mobile-first approach
8. **Print Styles**: Optimized for printing

## 🔄 Maintenance

### Adding New Fonts
1. Add @import rule to `globals.css`
2. Update font stack in base styles
3. Test across browsers

### Adding New Icons
1. Add @import rule for icon library
2. Create utility classes if needed
3. Update documentation

### Adding New Components
1. Create feature-specific classes in `utilities.css`
2. Follow naming conventions
3. Include responsive variants
4. Add accessibility features

## 🚀 Performance Monitoring

Monitor the following metrics:
- Font loading time
- Icon rendering performance
- Animation smoothness
- Responsive breakpoint effectiveness
- Accessibility compliance

## 📚 Resources

- [Google Fonts](https://fonts.google.com/)
- [Font Awesome](https://fontawesome.com/)
- [Material Icons](https://material.io/icons/)
- [Feather Icons](https://feathericons.com/)
- [Lucide Icons](https://lucide.dev/)
- [Chart.js](https://www.chartjs.org/)
- [DataTables](https://datatables.net/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [Animate.css](https://animate.style/)
- [Prism.js](https://prismjs.com/) 