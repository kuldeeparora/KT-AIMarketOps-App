# 🎨 Kent Traders Design System

## Color Palette

### Primary Colors
- **Blue Primary**: `#3B82F6` (blue-600)
- **Blue Secondary**: `#1D4ED8` (blue-700)
- **Indigo**: `#4F46E5` (indigo-600)

### Background Colors
- **Page Background**: `bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50`
- **Card Background**: `bg-white`
- **Subtle Background**: `bg-gray-50`

### Status Colors
- **Success**: `#10B981` (green-600)
- **Warning**: `#F59E0B` (yellow-500)
- **Error**: `#EF4444` (red-600)
- **Info**: `#3B82F6` (blue-600)

## Typography

### Font Weights
- **Normal**: `font-normal`
- **Medium**: `font-medium`
- **Semibold**: `font-semibold`
- **Bold**: `font-bold`

### Text Sizes
- **Heading Large**: `text-3xl font-bold tracking-tight`
- **Heading Medium**: `text-2xl font-bold tracking-tight`
- **Heading Small**: `text-xl font-semibold tracking-tight`
- **Body Large**: `text-lg font-medium`
- **Body Medium**: `text-base font-normal`
- **Body Small**: `text-sm font-medium`
- **Caption**: `text-xs font-medium uppercase tracking-wide`

## Spacing

### Grid System
- **Small**: `space-y-3` (12px)
- **Medium**: `space-y-4` (16px)
- **Large**: `space-y-6` (24px)
- **Extra Large**: `space-y-8` (32px)

### Padding
- **Small**: `p-3` (12px)
- **Medium**: `p-4` (16px)
- **Large**: `p-6` (24px)

## Components

### Cards
```jsx
// Default Card
<Card title="Card Title">
  Content here
</Card>

// Elevated Card
<Card title="Card Title" variant="elevated">
  Content here
</Card>

// Accent Card
<Card title="Card Title" variant="accent">
  Content here
</Card>
```

### Buttons
```jsx
// Primary Button
<Button>Primary Action</Button>

// Secondary Button
<Button variant="secondary">Secondary Action</Button>

// Outline Button
<Button variant="outline">Outline Action</Button>

// Success Button
<Button variant="success">Success Action</Button>

// Warning Button
<Button variant="warning">Warning Action</Button>
```

### Badges
```jsx
// Status Badges
<Badge status="success">Success</Badge>
<Badge status="warning">Warning</Badge>
<Badge status="critical">Error</Badge>
<Badge status="info">Info</Badge>
```

## Layout Patterns

### Header Navigation
- **Background**: White with shadow
- **Logo**: Gradient blue background with white text
- **Navigation**: Centered with gradient active states
- **User Menu**: Right-aligned with avatar

### Content Areas
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- **Grid**: Responsive grid system
- **Cards**: Elevated with rounded corners

### Data Cards
- **Background**: Gradient backgrounds based on data type
- **Icons**: Colored icons with matching backgrounds
- **Hover Effects**: Scale and shadow transitions
- **Borders**: Matching color borders

## Interactive Elements

### Hover States
- **Cards**: `hover:shadow-lg hover:scale-105`
- **Buttons**: `hover:scale-105 active:scale-95`
- **Navigation**: `hover:text-blue-600 hover:bg-blue-50`

### Transitions
- **Duration**: `transition-all duration-200`
- **Easing**: Default Tailwind easing

## Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Grid Columns
- **Mobile**: `grid-cols-1`
- **Tablet**: `md:grid-cols-2`
- **Desktop**: `lg:grid-cols-3` or `lg:grid-cols-4`

## Accessibility

### Focus States
- **Buttons**: `focus:ring-2 focus:ring-offset-2`
- **Links**: `focus:outline-none focus:ring-2`

### Color Contrast
- **Text**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Clear focus indicators

## Best Practices

### Component Usage
1. **Consistent Spacing**: Use the defined spacing system
2. **Color Consistency**: Use the defined color palette
3. **Typography**: Use the defined text styles
4. **Responsive**: Always consider mobile-first design

### Performance
1. **Optimized Transitions**: Use hardware-accelerated properties
2. **Efficient CSS**: Leverage Tailwind's utility classes
3. **Minimal JavaScript**: Prefer CSS solutions over JS

### Maintainability
1. **Component Composition**: Build complex UIs from simple components
2. **Design Tokens**: Use consistent values for spacing, colors, etc.
3. **Documentation**: Keep this design system updated 