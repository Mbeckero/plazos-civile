
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.82785fa3b8594fdb8d429b0cb3c18694',
  appName: 'plazos-civile',
  webDir: 'dist',
  server: {
    url: 'https://82785fa3-b859-4fdb-8d42-9b0cb3c18694.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'App'
  }
};

export default config;
