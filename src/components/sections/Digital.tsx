import React, {useMemo} from 'react';
import {
    View,
    Text,
    useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import Stage from '../layout/Stage';
import styles from '../styles/pageStyles';
import { typeScale } from '../../theme';

const Digital: React.FC = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const sizes = {
        h2: typeScale.h2(width),
        h3: typeScale.h3(width),
        lead: typeScale.lead(width),
    };

    const blocks = useMemo(()=>{
        const raw = t('digital.blocks', { returnObjects:true }) as unknown;
        return Array.isArray(raw) ? raw as { title:string; items:string[] }[] : [];
    }, [t]);

    return (
        <Stage bg="light" align="center" valign="middle" slim>
            <View>
                <Text
                    style={[
                        styles.h2,
                        {
                            textAlign: 'center',
                            fontSize: sizes.h2,
                            lineHeight: Math.round(sizes.h2 * 1.18),
                        },
                    ]}
                >
                    {t('digital.title')}
                </Text>

                <View style={styles.dList}>
                    {blocks.map((blk) => (
                        <View key={blk.title} style={styles.dItem}>
                            <View style={styles.dThumb} />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.dTitle,
                                        { fontSize: sizes.h3, textAlign: 'left' },
                                    ]}
                                >
                                    {blk.title}
                                </Text>
                                {blk.items.map((it, idx) => (
                                    <Text
                                        key={idx}
                                        style={[
                                            styles.lead,
                                            { fontSize: sizes.lead, textAlign: 'left' },
                                        ]}
                                    >
                                        • {it}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </Stage>
    );
}

export default Digital;
