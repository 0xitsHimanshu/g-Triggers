'use client';

import { useEffect } from 'react';

export default function HideGlobalNavbar() {
  useEffect(() => {
    document.body.classList.add('widget-page');
    return () => {
      document.body.classList.remove('widget-page');
    };
  }, []);
  return null;
}
