import React, {Component} from 'react'
import {ButtonGroup} from 'react-native-elements'

export default class QuestionTypeChooser extends Component {
    static navigationOptions = {title: 'Create Question'};

    constructor(props) {
        super(props)
        this.state = {selectedIndex: 2}
        this.updateIndex = this.updateIndex.bind(this)
    }

    updateIndex(selectedIndex) {
        this.setState({selectedIndex})
    }

    render() {
        const buttons = ['Multiple Choice',
            'Fill in the blank', 'Essay', 'True or\nfalse']
        const {selectedIndex} = this.state
        return (
            <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{height: 75}}/>
        )
    }
}
