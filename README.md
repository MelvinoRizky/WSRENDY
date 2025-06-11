# 🚀 RendyWS - Workspace Booking Application

This is a [Next.js](https://nextjs.org) workspace booking application with complete booking flow and real-time statistics.

## ✨ Features

- 🏢 **Workspace Browsing** - Browse available meeting rooms, private offices, and hot desks
- 📅 **Complete Booking Flow** - Book workspaces with date/time selection and duration picker
- 📊 **Real-time Dashboard** - Live statistics with total bookings, monthly counts, and spending
- 🗂️ **Booking History** - Full booking history with delete functionality
- 🔄 **Auto-updating Stats** - Statistics automatically update when bookings are created/deleted
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices

## 🏁 Getting Started

### For First Time Setup

Untuk setup awal atau jika mengalami masalah "next: command not found", jalankan script setup terlebih dahulu:

```bash
# Pastikan script mempunyai permission untuk dieksekusi
chmod +x setup.sh

# Jalankan script setup
./setup.sh
```

### Menjalankan Development Server

Setelah setup selesai, jalankan development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing Complete Booking Flow

1. **Register/Login** at [http://localhost:3000](http://localhost:3000)
2. **Browse Rooms** at [http://localhost:3000/rooms](http://localhost:3000/rooms)
3. **Book a Workspace** - Click "Book Now" on any room
4. **Check Dashboard** - See updated stats and recent bookings
5. **Test History** - View full booking history and test delete functionality

## 🗄️ Data Structure

The application uses localStorage to simulate backend API with the following structure:

### Booking Object:
```javascript
{
  booking_ID: 1672934400000,
  user_id: 1,
  room_name: "Executive Meeting Room A",
  booking_date: "2025-01-05",
  start_time: "09:00",
  duration: 2,
  total_price: 300000,
  status: "confirmed",
  created_at: "2025-01-05T02:34:56.789Z"
}
```

### Stats Object:
```javascript
{
  total_bookings: 5,
  this_month_bookings: 3,
  total_spent: 1200000,
  current_month: 4,
  current_year: 2025
}
```

## 🔧 Backend Integration

For backend developers, check `BOOKING_FLOW_DOCUMENTATION.md` for:
- Complete API endpoint specifications
- Database schema suggestions
- Integration guide from localStorage to real backend
- Data flow architecture

## 📱 Pages Overview

- `/` - Landing page with authentication
- `/rooms` - Browse available workspaces
- `/rooms/[id]` - Room details page
- `/rooms/[id]/book` - Booking form with validation
- `/dashboard` - User dashboard with stats and history

### Troubleshooting

Jika mengalami masalah "next: command not found" saat menjalankan `npm run dev`:
1. Pastikan Node.js terinstal dengan benar
2. Coba jalankan `./setup.sh` untuk memperbaiki masalah
3. Jika masih bermasalah, hapus node_modules dan reinstall: `rm -rf node_modules && npm install`

## 🎯 Key Implementation Details

- **Dynamic Stats**: Automatically calculate and update booking statistics
- **Monthly Reset**: Smart monthly booking count reset with year transitions
- **Delete Management**: Safe deletion with confirmation and stats recalculation
- **Real-time Updates**: All changes reflect immediately without page refresh
- **Clean UI**: Modern design with Tailwind CSS
- **Error Handling**: Graceful error handling throughout the application

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
