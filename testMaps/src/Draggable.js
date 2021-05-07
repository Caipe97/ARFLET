import React, {Component} from "react";
import {
    StyleSheet,
    View,
    PanResponder,
    Animated,
    Text,
    Image,
    UIManager
} from "react-native";
import { SEARCH_PLACEHOLDER, SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES } from './images';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Draggable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: true,
            pan: new Animated.ValueXY(),
            position: new Animated.ValueXY(),
            opacity: new Animated.Value(1),
            isDisabled: false,
            setSelectedTransportTypes: props.modifyFunction,
            transportId: props.transportId

        }
        this._val = { x:0,y:0};
        this.state.pan.addListener((value) => this._val = value);
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderMove: (e, gesture) => {
                    this.state.position.setValue({x: gesture.dx, y: gesture.dy});
                    if(this.state.isDraggable) {
                        Animated.event([null, {
                            dx: (this.state.pan.x), dy: this.state.pan.y}], 
                            {useNativeDriver: false})(e, gesture);
                    }
            },
            onPanResponderGrant: (e, gesture) => {
                this.state.pan.setOffset({x: this._val.x, y:this._val.y})
                this.state.pan.setValue({x:0, y:0})                         
            },
            onPanResponderRelease: (e ,gesture) => {
                if(this.isDropArea(gesture)){
                    Animated.parallel([
                        Animated.timing(this.state.opacity, {
                            toValue: (this.state.isDisabled ? 1 : 0.5),
                            duration: 500,
                            useNativeDriver: false,
                            }),
                        Animated.spring(this.state.pan, {
                            toValue: {x: 0, y:0},
                            friction: 20,
                            useNativeDriver: false
                        })
                    ]).start(()=> this.setState(state => ({...state, isDisabled: !this.state.isDisabled})))
                    this.props.modifyFunction();
                }else{
                    Animated.spring(this.state.pan, {
                        toValue: {x: 0, y:0},
                        friction: 10,
                        useNativeDriver: false
                    }).start();
                }
            },
        })

    }

    isDropArea(gesture) {
            return gesture.moveY > 180;
        }
        

    render(){
        const panStyle = {
            transform: this.state.pan.getTranslateTransform(),            
            opacity: this.state.opacity,
            zIndex: 10,
            elevation: 14
        }

        return (
            <Animated.View 
                {...this.PanResponder.panHandlers}
            style={[panStyle,  { margin: 1, zIndex: 10}]}
            >

                <View style={{borderRadius: 100, backgroundColor: this.props.bgColor, width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={this.props.imageSource} style={{  width: 25, height: 25}}/>
                </View>

            </Animated.View>
        )
    }    
}

const styles = StyleSheet.create({
    circle: {
        width: 40,
        height: 60,
        borderRadius: 30,        
    }
});