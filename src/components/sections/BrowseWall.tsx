import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ImageSourcePropType, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { layout, metrics, typeScale } from '../../theme';
import { loadListingProducts, type RuntimeListingProduct } from '../../data/listingProductsRuntime';

type TileImage = {
    id: string;
    code: string;
    source: ImageSourcePropType;
    tint: string;
};

type TileProps = {
    tile: TileImage;
    size: number;
    onPress: () => void;
};

const TILE_TINTS = [
    'rgba(5, 7, 11, 0.28)',
    'rgba(19, 8, 12, 0.24)',
    'rgba(6, 20, 16, 0.26)',
    'rgba(9, 12, 24, 0.25)',
    'rgba(20, 11, 3, 0.24)',
    'rgba(6, 7, 9, 0.22)',
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const hashString = (value: string): number => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return hash >>> 0;
};

const pickTint = (key: string): string => TILE_TINTS[hashString(key) % TILE_TINTS.length];

const makeTiles = (pool: TileImage[], count: number, seedBase: number): TileImage[] => {
    if (pool.length === 0 || count <= 0) {
        return [];
    }

    const out: TileImage[] = [];
    let seed = seedBase >>> 0;

    for (let i = 0; i < count; i += 1) {
        seed = (1664525 * seed + 1013904223) >>> 0;
        const idx = seed % pool.length;
        const picked = pool[idx];
        out.push({
            id: `${picked.id}-${i}-${seed}`,
            code: picked.code,
            source: picked.source,
            tint: picked.tint,
        });
    }

    return out;
};

const hashToTilt = (id: string) => {
    const hash = hashString(id);
    const x = (((hash & 0xff) / 255) * 2 - 1) * 0.9;
    const y = ((((hash >> 8) & 0xff) / 255) * 2 - 1) * 0.9;
    return { x, y };
};

function ReflectiveTile({ tile, size, onPress }: TileProps) {
    const tiltX = useRef(new Animated.Value(0)).current;
    const tiltY = useRef(new Animated.Value(0)).current;
    const hover = useRef(new Animated.Value(0)).current;

    const { x, y } = useMemo(() => hashToTilt(tile.id), [tile.id]);

    const activate = () => {
        Animated.parallel([
            Animated.spring(tiltX, {
                toValue: x,
                useNativeDriver: true,
                friction: 7,
                tension: 120,
            }),
            Animated.spring(tiltY, {
                toValue: y,
                useNativeDriver: true,
                friction: 7,
                tension: 120,
            }),
            Animated.timing(hover, {
                toValue: 1,
                duration: 260,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const reset = () => {
        Animated.parallel([
            Animated.spring(tiltX, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 105,
            }),
            Animated.spring(tiltY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 105,
            }),
            Animated.timing(hover, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const tiltStyle = {
        transform: [
            { perspective: 900 },
            {
                rotateX: tiltX.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['8deg', '-8deg'],
                }),
            },
            {
                rotateY: tiltY.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['-8deg', '8deg'],
                }),
            },
            {
                scale: hover.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.035],
                }),
            },
        ],
    };

    const shineStyle = {
        opacity: hover.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.52],
        }),
        transform: [
            {
                translateX: hover.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-size * 0.8, size * 0.9],
                }),
            },
            { skewX: '-16deg' },
        ],
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onHoverIn={activate}
            onHoverOut={reset}
            onPressIn={activate}
            onPressOut={reset}
            style={[styles.tile, { width: size, height: size }, tiltStyle as any]}
        >
            <Animated.Image source={tile.source} resizeMode="cover" style={styles.tileImage} />
            <View style={[styles.tileTint, { backgroundColor: tile.tint }]} />
            <View style={styles.tileShade} />

            <Animated.View style={[styles.tileShine, shineStyle as any]}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)', 'rgba(255,255,255,0)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFillObject}
                />
            </Animated.View>
        </AnimatedPressable>
    );
}

const BrowseWall: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const [products, setProducts] = useState<RuntimeListingProduct[]>([]);
    const drift = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const rows = await loadListingProducts();
                if (!cancelled) {
                    setProducts(rows);
                }
            } catch {
                if (!cancelled) {
                    setProducts([]);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const safeWidth = Math.max(320, Math.round(width || 1200));
    const safeHeight = Math.max(640, Math.round(height || 900));
    const isMobile = safeWidth <= metrics.bpSm;
    const titleSize = typeScale.h2(safeWidth);

    const gap = 1;
    const baseColumns = isMobile ? Math.max(4, Math.floor(safeWidth / 88)) : Math.max(8, Math.floor(safeWidth / 112));
    const baseTileSize = Math.max(72, Math.floor((safeWidth - gap * (baseColumns - 1)) / baseColumns));
    const desiredTileSize = Math.floor(baseTileSize * 1.5);
    const minColumns = isMobile ? 2 : 4;
    const candidateColumnsA = Math.max(minColumns, Math.floor((safeWidth + gap) / (desiredTileSize + gap)));
    const candidateColumnsB = Math.max(minColumns, candidateColumnsA + 1);
    const tileSizeFor = (columns: number) => Math.max(72, Math.floor((safeWidth - gap * (columns - 1)) / columns));
    const tileA = tileSizeFor(candidateColumnsA);
    const tileB = tileSizeFor(candidateColumnsB);
    const columns = Math.abs(tileA - desiredTileSize) <= Math.abs(tileB - desiredTileSize) ? candidateColumnsA : candidateColumnsB;
    const tileSize = tileSizeFor(columns);

    const roughWallHeight = Math.max(380, Math.min(640, Math.round(safeHeight * (isMobile ? 0.46 : 0.58))));
    const visibleRows = Math.max(3, Math.floor((roughWallHeight + gap) / (tileSize + gap)));
    const wallHeight = visibleRows * tileSize + gap * (visibleRows - 1);
    const bufferCols = Math.max(4, Math.ceil(columns * 0.75));
    const loopCols = Math.max(4, Math.ceil(columns * 0.55));
    const rowLoopDistance = (tileSize + gap) * loopCols;
    const legacyLoopRows = Math.max(4, Math.ceil(visibleRows * 0.6));
    const legacyLoopDistance = (tileSize + gap) * legacyLoopRows;
    const driftDurationMs = Math.max(
        36000,
        Math.round(((22000 * rowLoopDistance) / Math.max(1, legacyLoopDistance)) * 3),
    );

    const sourcePool = useMemo<TileImage[]>(() => {
        return products
            .map((item, index) => {
                const uri = (item.imageUrl || '').trim();
                if (!uri) {
                    return null;
                }

                return {
                    id: `${item.code || 'item'}-${index}`,
                    code: item.code,
                    source: { uri } as ImageSourcePropType,
                    tint: pickTint(item.code || String(index)),
                };
            })
            .filter((tile): tile is TileImage => tile !== null);
    }, [products]);

    const rowTiles = useMemo(() => {
        return Array.from({ length: visibleRows }, (_, rowIndex) => {
            const base = makeTiles(
                sourcePool,
                columns + bufferCols,
                (rowIndex + 1) * 7919 + columns * 131 + sourcePool.length * 53,
            );
            const direction: 'left' | 'right' = rowIndex % 2 === 0 ? 'right' : 'left';

            const leftTail = base.slice(0, loopCols).map((tile, tileIndex) => ({
                ...tile,
                id: `${tile.id}-lt-${rowIndex}-${tileIndex}`,
            }));
            const rightHead = base.slice(Math.max(0, base.length - loopCols)).map((tile, tileIndex) => ({
                ...tile,
                id: `${tile.id}-rh-${rowIndex}-${tileIndex}`,
            }));

            return {
                id: `wall-row-${rowIndex}`,
                direction,
                tiles: direction === 'left' ? [...base, ...leftTail] : [...rightHead, ...base],
            };
        });
    }, [bufferCols, columns, loopCols, sourcePool, visibleRows]);

    useEffect(() => {
        if (rowLoopDistance <= 0) {
            return;
        }

        drift.setValue(0);
        const animation = Animated.loop(
            Animated.timing(drift, {
                toValue: 1,
                duration: driftDurationMs,
                useNativeDriver: true,
            }),
        );
        animation.start();

        return () => {
            animation.stop();
        };
    }, [drift, driftDurationMs, rowLoopDistance]);

    return (
        <View style={styles.section}>
            <View style={styles.headingWrap}>
                <View style={styles.headRow}>
                    <Text style={[styles.title, { fontSize: titleSize, lineHeight: Math.round(titleSize * 1.16) }]}>
                        {t('browse_wall.title')}
                    </Text>

                    <Pressable style={styles.ctaBtn} onPress={() => router.push('/listing')}>
                        <Text style={styles.ctaText}>{t('browse_wall.cta')}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={[styles.wallFrame, { height: wallHeight }]}>
                <View style={styles.wallGrid}>
                    {rowTiles.map((row, rowIndex) => {
                        const translateX = drift.interpolate({
                            inputRange: [0, 1],
                            outputRange:
                                row.direction === 'left'
                                    ? [0, -rowLoopDistance]
                                    : [-rowLoopDistance, 0],
                        });

                        return (
                            <View key={row.id} style={[styles.rowViewport, rowIndex < rowTiles.length - 1 ? styles.rowGap : null]}>
                                <Animated.View style={[styles.rowStrip, { transform: [{ translateX: translateX as any }] }]}>
                                    {row.tiles.map((tile) => (
                                        <ReflectiveTile
                                            key={tile.id}
                                            tile={tile}
                                            size={tileSize}
                                            onPress={() =>
                                                router.push(tile.code ? `/p/${encodeURIComponent(tile.code)}` : '/listing')
                                            }
                                        />
                                    ))}
                                </Animated.View>
                            </View>
                        );
                    })}
                </View>

                <LinearGradient
                    pointerEvents="none"
                    colors={['rgba(0,0,0,0.62)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.68)']}
                    locations={[0, 0.28, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                    pointerEvents="none"
                    colors={['rgba(0,0,0,0.34)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.34)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#07090d',
        paddingTop: 56,
        paddingBottom: 54,
    },
    headingWrap: {
        width: '100%',
        maxWidth: layout.maxWidth,
        alignSelf: 'center',
        paddingHorizontal: 18,
        marginBottom: 16,
    },
    headRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 10,
    },
    title: {
        color: '#F5F7FB',
        fontWeight: '900',
        flex: 1,
    },
    ctaBtn: {
        height: 38,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(247,248,251,0.3)',
        backgroundColor: 'rgba(247,248,251,0.08)',
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        color: '#F7F8FB',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    wallFrame: {
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#080b10',
    },
    wallGrid: {
        flex: 1,
    },
    rowViewport: {
        flex: 1,
        overflow: 'hidden',
        width: '100%',
    },
    rowGap: {
        marginBottom: 1,
    },
    rowStrip: {
        flexDirection: 'row',
    },
    tile: {
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#0f1218',
        marginRight: 1,
    },
    tileImage: {
        width: '100%',
        height: '100%',
    },
    tileTint: {
        ...StyleSheet.absoluteFillObject,
    },
    tileShade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(8, 12, 20, 0.12)',
    },
    tileShine: {
        position: 'absolute',
        top: -40,
        bottom: -40,
        left: -70,
        right: -70,
    },
});

export default BrowseWall;
