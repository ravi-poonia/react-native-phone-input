import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import PhoneInput from './src';

class App extends Component {
  constructor() {
    super();

    this.state = {
      valid: '',
      type: '',
      value: ''
    };

    this.updateInfo = this.updateInfo.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
  }

  updateInfo() {
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    });
  }

  renderInfo() {
    return (
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Is Valid: </Text>
          <Text style={{ fontWeight: 'bold' }}>{this.state.valid.toString()}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Type: </Text>
          <Text style={{ fontWeight: 'bold' }}>{this.state.type.toString()}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Value: </Text>
          <Text style={{ fontWeight: 'bold' }}>{this.state.value.toString()}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
        />

        <TouchableOpacity onPress={this.updateInfo} style={styles.button}>
          <Text>Get Info</Text>
        </TouchableOpacity>

        {this.renderInfo()}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 10
  },
  container: {
    alignItems: 'center',
    flex: 1,
    padding: 20,
    paddingTop: 60
  }
});

module.exports = App;
