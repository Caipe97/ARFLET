import { View, Image, } from 'react-native';
import { STAR_FULL, STAR_EMPTY } from './images'
import * as React from 'react'

export function RatingStars(props){
    let goodRating = [...Array(props.rating).keys()];
    let fullStar = goodRating.map((a,i) => {
        return <Image source={STAR_FULL} style={{width: 20, height: 20}}/>;
    })
    let badRating = [...Array(5-(props.rating)).keys()];
    let emptyStar = badRating.map((a,i) => {
        return <Image source={STAR_EMPTY} style={{width: 20, height: 20}}/>;
    })
    return(
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center' ,alignItems: 'center'}}>
            {fullStar}{emptyStar}
        </View>
    )
  }