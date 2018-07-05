import React from 'react'
import {View} from 'react-native'
import {Text, Divider} from 'react-native-elements'

const TextHeadings = () => (
    <View style={{padding:15}}>
        <Text h1>Welcome!</Text>
        <Text h2>Heading 2</Text>
        <Text h3>Heading 3</Text>
        <Text h4>Heading 4</Text>
        <Divider style={{backgroundColor:'blue'}}/>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
    </View>)
export default TextHeadings
