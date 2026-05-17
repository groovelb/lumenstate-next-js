import ThemeRegistry from './providers';
import './globals.css';

export const metadata = {
  title: 'Lumenstate',
  description: 'Light defines the space.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
