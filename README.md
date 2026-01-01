# Product Landing Pages App

Next.js landing pages for BaaWA Accessories products with conversion-optimized designs.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Component Library**: Powered by shadcn/ui for beautiful, accessible components
- **Conversion Optimized**: Strategic layouts designed to maximize sales
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Media Rich**: Support for product images and videos
- **Form Integration**: WhatsApp order integration for seamless customer communication

## 📦 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/baawa1/product-landing-pages-app.git
cd product-landing-pages-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
landing-page/
├── app/
│   ├── product/
│   │   └── megir/
│   │       └── page.tsx       # MEGIR watch product page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/
│   └── ui/                    # shadcn/ui components
├── public/
│   └── products/
│       └── megir/             # MEGIR product images & videos
├── lib/
│   └── utils.ts               # Utility functions
└── README.md
```

## 🎨 Adding a New Product Page

1. Create a new folder in `app/product/[product-name]/`
2. Add `page.tsx` with your product component
3. Upload product media to `public/products/[product-name]/`
4. Follow the conversion-optimized structure:
   - Hero section with video/image
   - Problem/solution sections
   - Product gallery
   - Features & specifications
   - Social proof (testimonials)
   - FAQ section
   - Order form

## 📸 Media Guidelines

### Images
- Place in `/public/products/[product-name]/`
- Reference as `/products/[product-name]/image.jpg`
- Optimize images before upload (WebP recommended)

### Videos
- Supported formats: MP4
- Use HTML5 video tag with `autoPlay`, `muted`, `loop`, `playsInline`
- Correct aspect ratios for best display

## 🎯 Conversion Features

- **Smooth Scrolling**: All CTA buttons scroll smoothly to order form
- **Mobile Optimized**: Large, thumb-friendly buttons with proper padding
- **Trust Signals**: Warranty badges, physical store location, testimonials
- **Visual Proof**: Multiple product angles, unboxing videos, packaging shots
- **WhatsApp Integration**: Direct order placement via WhatsApp

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy

### Build for Production

```bash
npm run build
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.ts` to customize:
- Primary colors
- Font families
- Spacing & sizing
- Border radius

### Components
All UI components are in `components/ui/` and can be customized individually.

## 📞 Contact

**BaaWA Accessories**
- WhatsApp: +234-806-260-5012
- Email: Sales@baawa.ng
- Location: Abeokuta, Ogun State, Nigeria

## 📄 License

MIT License - feel free to use this project for your own product pages.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Next.js](https://nextjs.org/) team for the incredible framework
- [Vercel](https://vercel.com/) for seamless deployment

---

**Built with ❤️ for BaaWA Accessories**
