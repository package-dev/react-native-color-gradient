import { Alert, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Slider } from 'react-native-elements';
import * as Colors from './utils'
const WIDTH = Dimensions.get('screen').width
const SQUAREL = WIDTH * 0.2
const SQUARER = WIDTH * 0.8
export default function PickColor({ getColorPicker, initColor = "#000" }) {
    const hsvColor = Colors.hexToHsv(initColor);
    const [color, setColor] = useState(initColor);
    const colorMatrix = createColorMatrix();
    const [h, setH] = useState(hsvColor.h);
    const [s, setS] = useState(hsvColor.s);
    const [v, setV] = useState(hsvColor.v);

    useEffect(() => {
        getColorPicker && getColorPicker(Colors.hsvToHex(h, s, v));
        setColor(Colors.hsvToHex(h, s, v))
    }, [h, s, v]);

    return (
        <View style={styles.container}>
            <View style={{ transform: [{ rotateZ: '-90deg' }], width: WIDTH, height: WIDTH }}>
                {colorMatrix.map((row, index) =>
                    <View key={index} style={{ flexDirection: 'row' }}>
                        {row.map((item, index2) =>
                            <TouchableOpacity onPress={() => {
                                setColor(item);
                                const hsv = (Colors.rgbStringToHsv(item));
                                setH(hsv.h);
                                setS(hsv.s);
                                setV(hsv.v);
                            }}
                                key={index2} style={{ width: WIDTH / 10, height: WIDTH / 10, backgroundColor: item }} />
                        )}
                    </View>
                )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <View style={{ width: SQUAREL, height: SQUAREL, borderRadius: 5, backgroundColor: color }} />
                <View style={{ width: SQUARER, paddingLeft: 10 }}>
                    <Slider value={s} onValueChange={setS} maximumValue={100} />
                    <Slider value={v} onValueChange={setV} maximumValue={100} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});



const createColorMatrix = () => {
    const matrix = [];
    for (let i = 0; i < 10; i++) {
        const row = [];
        for (let j = 0; j < 10; j++) {
            const hue = (i * 10 + j) * 3.6;
            const saturation = 100;
            const value = 100 - j * 10;
            const [r, g, b] = Colors.hsvToRgb(hue, saturation, value);
            row.push(`rgb(${r}, ${g}, ${b})`);
        }
        matrix.push(row);
    }
    return matrix;
};
