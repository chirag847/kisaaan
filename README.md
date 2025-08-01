# Farmers Marketplace 🌾

A modern digital marketplace connecting farmers directly with buyers for grain trading. Built with Next.js frontend and Express.js backend with MongoDB.

## 🌟 Features

### For Farmers
- **Digital Grain Listings**: Upload grain details with photos, quantity (in quintals), and pricing
- **Quality Verification**: Showcase grain quality with sample images and descriptions
- **Direct Communication**: Connect with buyers through built-in messaging system
- **Secure Payments**: Receive payments through Razorpay integration
- **Inventory Management**: Track available quantities and sales

### For Buyers
- **Advanced Search**: Filter grains by type, location, quality, price, and organic certification
- **Quality Assessment**: View detailed grain information and sample photos
- **Direct Contact**: Message farmers and exchange contact information
- **Secure Transactions**: Complete purchases with secure payment processing
- **Deal Management**: Track purchase history and delivery status

### Platform Features
- **User Authentication**: Secure registration and login for farmers and buyers
- **Role-based Access**: Different interfaces and permissions for farmers vs buyers
- **Responsive Design**: Mobile-friendly interface with nature-themed UI
- **Real-time Notifications**: Toast notifications for actions and updates
- **Quality Assurance**: Rating and verification system for users

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Type-safe backend development
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Razorpay** - Payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Razorpay account for payment integration

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Farmer2
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/farmers-marketplace
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 📁 Project Structure

```
Farmer2/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation middleware
│   │   └── server.ts       # Server entry point
│   ├── uploads/            # File upload directory
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Green**: Nature-inspired greens (#22c55e family)
- **Earth Tones**: Warm browns and oranges (#f1610d family)
- **Field Colors**: Natural field greens (#8ba05e family)

### UI Principles
- **Nature-themed**: Agricultural imagery and earth-tone colors
- **User-friendly**: Intuitive navigation for farmers and tech-savvy users
- **Mobile-first**: Responsive design for rural connectivity
- **Accessibility**: WCAG compliant design patterns

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation with express-validator
- **File Upload Security**: Restricted file types and sizes
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing

## 💳 Payment Integration

- **Razorpay**: Secure payment processing for Indian market
- **Order Management**: Payment tracking and verification
- **Deal Status**: Automated status updates based on payment
- **Refund Support**: Built-in refund handling capabilities

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@farmersmarketplace.com or create an issue in the repository.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from agricultural and marketplace platforms
- Thanks to the farming community for inspiration and feedback
# kisaaan
