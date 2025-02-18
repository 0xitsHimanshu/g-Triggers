// app/widget/layout.tsx
import { ReactNode } from 'react';
import HideGlobalNavbar from '@/components/HideGlobalNavbar';

export default function WidgetLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <title>Widget</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background: transparent;
          }
          /* Hide any global navbar when on widget pages */
          body.widget-page nav {
            display: none !important;
          }
        `}</style>
      </head>
      <body>
        <HideGlobalNavbar />
        {children}
      </body>
    </html>
  );
}
