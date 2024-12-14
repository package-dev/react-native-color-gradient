import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ViewProps } from 'react-native';
import React, { Component } from 'react';
import Slider from './Slider';
import * as Colors from './utils'
const WIDTH = Dimensions.get('screen').width

interface PickerProps {
    getColorPicker?: (color: string) => void
    initColor: string
    numberColumn: number
    numberRow: number
    style?: ViewProps['style']
    width: number


}
interface PickerState {
    h: number
    s: number
    v: number
    color: string

}
export class Picker extends Component<PickerProps, PickerState> {
    colorMatrix: Array<any[]>
    squarel: number
    squarer: number
    static defaultProps = {
        initColor: '#000',
        numberColumn: 10,
        numberRow: 10,
        width: WIDTH

    };
    constructor(props: PickerProps) {
        super(props)
        this.colorMatrix = this.createColorMatrix()
        const color = props.initColor
        const hsvColor = Colors.hexToHsv(color)
        this.state = {
            h: hsvColor.h,
            s: hsvColor.s,
            v: hsvColor.v,
            color: color
        }
        this.squarel = this.props.width * 0.2
        this.squarer = this.props.width * 0.8
        this.setS = this.setS.bind(this)
        this.setV = this.setV.bind(this)
        this.setH = this.setH.bind(this)
        console.debug('res', this.props.width)
        console.debug('res', this.squarel)
        console.debug('res', this.squarer)
    }
    createColorMatrix = () => {
        const matrix: any[] = [];
        for (let i = 0; i < this.props.numberColumn; i++) {
            const row: string[] = [];
            for (let j = 0; j < this.props.numberRow; j++) {
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

    onPressItem(color: string) {
        const hsv = Colors.rgbStringToHsv(color)
        this.setState({
            h: hsv.h,
            s: hsv.s,
            v: hsv.v,
            color: color
        })
    }
    setH(h: number) { this.setState({ h }) }
    setV(v: number) { this.setState({ v }) }
    setS(s: number) { this.setState({ s }) }
    componentDidUpdate(prevProps: Readonly<PickerProps>, prevState: Readonly<PickerState>, snapshot?: any): void {
        const { h, s, v } = this.state;
        if (prevState.h !== h || prevState.s !== s || prevState.v !== v) {
            const hexColor = Colors.hsvToHex(h, s, v);
            if (this.props.getColorPicker) {
                this.props.getColorPicker(hexColor);
            }
            this.setState({ color: hexColor });
        }
    }
    render() {
        const { s, v, h, color } = this.state
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={{ transform: [{ rotateZ: '-90deg' }], width: this.props.width, height: this.props.width }}>
                    {this.colorMatrix.map((row, index) =>
                        <View key={index} style={{ flexDirection: 'row' }}>
                            {row.map((item, index2) =>
                                <TouchableOpacity onPress={() => this.onPressItem(item)}
                                    key={index2} style={{ width: this.props.width / this.props.numberColumn, height: this.props.width / this.props.numberRow, backgroundColor: item }} />
                            )}
                        </View>
                    )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ width: this.squarel, height: this.squarel, borderRadius: 5, backgroundColor: color }} />
                    <View style={{ width: this.squarer, paddingLeft: 10 }}>
                        <Slider value={s} onValueChange={this.setS} maximumValue={100} />
                        <Slider value={v} onValueChange={this.setV} maximumValue={100} />
                        {/* <Slider value={h} onValueChange={this.setH} maximumValue={100} /> */}
                    </View>
                </View>
            </View>
        )
    }
}

export default Picker
const styles = StyleSheet.create({
    container: { flex: 1 }
});
