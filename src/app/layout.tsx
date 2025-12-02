import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChildVids - Safe Videos for Kids',
  description: 'A safe video platform for children with content filtering by age and category',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <a href="/" className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl">🎬</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                ChildVids
              </h1>
            </a>
            <p className="text-center text-purple-100 mt-1 sm:mt-2 text-sm sm:text-base">
              Safe & Fun Videos for Kids
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white mt-12">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-purple-100 text-sm">
              © {new Date().getFullYear()} ChildVids. Safe content for children.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
