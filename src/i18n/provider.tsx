import React, { createContext, useContext, useEffect, useState } from 'react';
import { initI18n } from './i18n';
import { toAppLanguage, type AppLanguage } from './languageOptions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';

type Ctx = { currentLanguage: AppLanguage; setLanguage: (lng: AppLanguage)=>void };

const I18nCtx = createContext<Ctx>({ currentLanguage: 'ja', setLanguage: ()=>{} });

// init synchronously
initI18n();

export function I18nProvider({ children }:{children:React.ReactNode}){
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(toAppLanguage(i18next.language));

  useEffect(()=>{
    const onChanged = (lng:string)=> setCurrentLanguage(toAppLanguage(lng));
    i18next.on('languageChanged', onChanged);
    (async ()=>{
      const saved = await AsyncStorage.getItem('@nanji.lang') as AppLanguage | null;
      if(saved && saved!==i18next.language){ i18next.changeLanguage(saved); }
    })();
    return ()=>{ i18next.off('languageChanged', onChanged); };
  }, []);

  const setLanguage = (lng: AppLanguage)=>{
    i18next.changeLanguage(lng);
    AsyncStorage.setItem('@nanji.lang', lng).catch(()=>{});
  };

  return <I18nCtx.Provider value={{currentLanguage, setLanguage}}>{children}</I18nCtx.Provider>;
}

export function useI18n(){ return useContext(I18nCtx); }
