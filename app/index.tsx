import React, {useRef, useState} from 'react';
import {ScrollView, View, Animated} from 'react-native';

import Header from '../src/components/sections/Header';
import Hero from "../src/components/sections/Hero";
import About from "../src/components/sections/About";
import Categories from "../src/components/sections/Categories";
import Handbook from "../src/components/sections/Handbook";
import Supply from "../src/components/sections/Supply";
import Digital from "../src/components/sections/Digital";
import Founder from "../src/components/sections/Founder";
import Coop from "../src/components/sections/Coop";
import Services from "../src/components/sections/Services";
import Contact from "../src/components/sections/Contact";
import Footer from "../src/components/sections/Footer";
import BrowseWall from "../src/components/sections/BrowseWall";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function Page() {
    const scrollRef = useRef<ScrollView>(null);
    const [offsets, setOffsets] = useState<Record<string, number>>({});

    const onLayout = (id: string) => (e: any) => {
        const y = e.nativeEvent.layout.y as number;
        setOffsets(prev => ({...prev, [id]: y}));
    };
    const scrollToId = (id: string) => {
        const y = offsets[id] ?? 0;
        scrollRef.current?.scrollTo({y, animated: true});
    };

    const scrollY = useRef(new Animated.Value(0)).current;

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <Header onNav={scrollToId}/>
            <AnimatedScrollView ref={scrollRef} contentContainerStyle={{paddingBottom: 24}}
                                onScroll={Animated.event(
                                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                                    {useNativeDriver: true}
                                )} scrollEventThrottle={16}>
                <Hero scrollY={scrollY}/>
                <View onLayout={onLayout('about')}>
                    <About/>
                </View>
                <View onLayout={onLayout('services')}>
                    <Services/>
                </View>
                <View onLayout={onLayout('listing')}>
                    <BrowseWall/>
                </View>
                {/*<View onLayout={onLayout('categories')}>*/}
                {/*    <Categories />*/}
                {/*</View>*/}
                <View onLayout={onLayout('handbook')}>
                    <Handbook scrollY={scrollY}/>
                </View>
                {/*<View onLayout={onLayout('supply')}>*/}
                {/*    <Supply />*/}
                {/*</View>*/}

                {/*<View onLayout={onLayout('digital')}>*/}
                {/*    <Digital />*/}
                {/*</View>*/}
                {/*<View onLayout={onLayout('coop')}>*/}
                {/*    <Coop />*/}
                {/*</View>*/}
                <View onLayout={onLayout('founder')}>
                    <Founder/>
                </View>
                <Contact/>
                <Footer
                    onBackToTop={() =>
                        scrollRef.current?.scrollTo({y: 0, animated: true})
                    }
                />
            </AnimatedScrollView>
        </View>
    );
}
