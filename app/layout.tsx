import './globals.css';

import { Figtree } from 'next/font/google';

import { Player, Sidebar } from '@/components';
import {
  ModalProvider,
  SupabaseProvider,
  ToasterProvider,
  UserProvider,
} from '@/providers';
import getSongsByUserId from '@/actions/getSongsByUserId';

const font = Figtree({ subsets: ['latin'] });

export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music',
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
