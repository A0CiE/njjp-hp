import React, { createContext, useContext, useEffect, useState } from 'react';
import { initI18n } from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';

type Lang = 'zh'|'en'|'ja';
type Ctx = { currentLanguage: Lang; setLanguage: (lng: Lang)=>void };

const I18nCtx = createContext<Ctx>({ currentLanguage: 'ja', setLanguage: ()=>{} });

// init synchronously
initI18n();

export function I18nProvider({ children }:{children:React.ReactNode}){
  const [currentLanguage, setCurrentLanguage] = useState<Lang>((i18next.language as Lang) || 'en');

  useEffect(()=>{
    const onChanged = (lng:string)=> setCurrentLanguage(lng as Lang);
    i18next.on('languageChanged', onChanged);
    (async ()=>{
      const saved = await AsyncStorage.getItem('@nanji.lang') as Lang | null;
      if(saved && saved!==i18next.language){ i18next.changeLanguage(saved); }
    })();
    return ()=>{ i18next.off('languageChanged', onChanged); };
  }, []);

  const setLanguage = (lng: Lang)=>{
    i18next.changeLanguage(lng);
    AsyncStorage.setItem('@nanji.lang', lng).catch(()=>{});
  };

  return <I18nCtx.Provider value={{currentLanguage, setLanguage}}>{children}</I18nCtx.Provider>;
}

export function useI18n(){ return useContext(I18nCtx); }
