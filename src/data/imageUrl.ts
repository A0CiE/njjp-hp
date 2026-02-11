export const withImageSize = (rawUrl: string | null | undefined, size: number): string => {
    const base = (rawUrl || '').trim();
    if (!base) {
        return '';
    }

    const rounded = Math.max(1, Math.round(size));
    const sizeToken = `s${rounded}`;

    const [withoutHash, hash = ''] = base.split('#', 2);
    const sizedUrl = /([?&])sz=[^&#]*/i.test(withoutHash)
        ? withoutHash.replace(/([?&])sz=[^&#]*/i, `$1sz=${sizeToken}`)
        : `${withoutHash}${withoutHash.includes('?') ? '&' : '?'}sz=${sizeToken}`;

    return hash ? `${sizedUrl}#${hash}` : sizedUrl;
};
