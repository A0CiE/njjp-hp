export type AppLanguage = 'zh' | 'ja' | 'en';

export type LanguageOption = {
    code: AppLanguage;
    label: '中文' | '日本語' | 'English';
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' },
];

const FALLBACK_LANGUAGE: AppLanguage = 'en';

export const toAppLanguage = (value: string): AppLanguage => {
    if (value === 'zh' || value === 'ja' || value === 'en') {
        return value;
    }
    return FALLBACK_LANGUAGE;
};

export const getLanguageOption = (value: string): LanguageOption => {
    const lang = toAppLanguage(value);
    return LANGUAGE_OPTIONS.find((option) => option.code === lang) ?? LANGUAGE_OPTIONS[0];
};
