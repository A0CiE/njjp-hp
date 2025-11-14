import { Stack } from 'expo-router';
import React from 'react';
import { I18nProvider } from '../src/i18n/provider';
export default function Layout(){
  return (
    <I18nProvider>
      <Stack screenOptions={{ headerShown:false }} />
    </I18nProvider>
  );
}
