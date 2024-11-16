'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';

export function TestNotifications() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Adiciona algumas notificações de teste
    addNotification({
      title: 'Bem-vindo!',
      message: 'Bem-vindo ao sistema de notificações'
    });
    
    addNotification({
      title: 'Nova atualização',
      message: 'O sistema foi atualizado'
    });
  }, [addNotification]);

  return null;
} 