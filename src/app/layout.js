import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'ScoreDraw — Play, Track & Win',
  description: 'A subscription-driven platform combining golf performance tracking, charity fundraising, and monthly draw-based rewards. Play, win, and make a difference.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
