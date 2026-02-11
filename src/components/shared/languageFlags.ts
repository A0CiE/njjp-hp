import type { ImageSourcePropType } from 'react-native';

const FALLBACK_CODE = 'en';

const LANGUAGE_FLAG_SOURCES: Record<string, ImageSourcePropType> = {
    en: require('../../assets/flags/us.png'),
    zh: require('../../assets/flags/zh.png'),
    ja: require('../../assets/flags/jp.png'),
};

export const getLanguageFlagSource = (code: string): ImageSourcePropType => {
    return LANGUAGE_FLAG_SOURCES[code] ?? LANGUAGE_FLAG_SOURCES[FALLBACK_CODE];
};
