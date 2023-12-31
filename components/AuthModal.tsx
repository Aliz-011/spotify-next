'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import Modal from './Modal';
import useAuthModal from '@/hooks/useAuthModal';

const AuthModal = () => {
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  const { isOpen, onClose } = useAuthModal();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Modal
      title="Welcome Back!"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        socialLayout="horizontal"
        supabaseClient={supabaseClient}
        theme="dark"
        providers={['google', 'facebook']}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22c55e',
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
