import React, { Component } from 'react';
import { TextInput, TouchableOpacity, View, TextInputProps, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import Country from './country';
import PhoneNumber from './phoneNumber';

class PhoneInput extends Component {
  static setCustomCountriesData(json) {
    Country.setCustomCountriesData(json);
  }

  constructor(props, context) {
    super(props, context);

    const { countriesList, initialCountry, value = '' } = this.props;
    const countryData = PhoneNumber.getCountryDataByCode(initialCountry);
    const dialCode = (countryData && countryData.dialCode) || '';

    if (countriesList) {
      Country.setCustomCountriesData(countriesList);
    }

    const inputValue = this.constructNumber({
      iso2: initialCountry,
      dialCode,
      value: this.prepareValue({ value, dialCode })
    });

    this.state = {
      iso2: initialCountry,
      dialCode,
      inputValue,
      countryModal: false
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value && value !== this.state.inputValue) {
      this.updateFlagAndFormatNumber(value);
    }
  }

  constructNumber = ({ dialCode, value, iso2 }) => {
    const { useCountryCode, autoFormat } = this.props;
    const number = `+${dialCode}${value}`;
    if (autoFormat) {
      const formatted = this.format(number, iso2);
      return useCountryCode ? formatted : formatted.replace(`+${dialCode}`, '');
    }
    return useCountryCode ? number : value;
  };

  prepareValue = ({ dialCode, value = '' }) => {
    const clearedValue = value.replace(/\s/gm, '');
    return clearedValue.replace(`+${dialCode}`, '');
  };

  onChangePhoneNumber = (number) => {
    this.updateFlagAndFormatNumber(number, () => {
      if (this.props.onChangePhoneNumber) {
        this.props.onChangePhoneNumber(number);
      }
    });
  };

  toggleCountryModal = () => this.setState({ countryModal: !this.state.countryModal });

  onPressFlag = () => {
    if (this.props.onPressFlag) {
      this.props.onPressFlag();
    }
    this.toggleCountryModal();
  };

  getCountryCode = () => this.state.dialCode;

  getAllCountries = () => PhoneNumber.getAllCountries();

  getDialCode = () => this.state.dialCode;

  getValue = () => this.state.inputValue;

  getNumberType = () => PhoneNumber.getNumberType(this.state.inputValue, this.state.iso2);

  getISOCode = () => this.state.iso2;

  isValidNumber = () => {
    const { inputValue, iso2 } = this.state;
    if (inputValue < 3) {
      return false;
    }
    return PhoneNumber.isValidNumber(inputValue, iso2);
  };

  format = (text, iso2) => PhoneNumber.format(text, iso2);

  updateFlagAndFormatNumber = (number, actionAfterSetState = null) => {
    const { useCountryCode, allowZeroAfterCountryCode } = this.props;
    const { dialCode, iso2 } = this.state;

    let newInputValue = number;
    let newDialCode = dialCode;
    let newIso2 = iso2;

    if (useCountryCode) {
      const isoCode = PhoneNumber.getCountryCodeOfNumber(number);
      if (isoCode !== iso2) {
        if (isoCode) {
          newIso2 = isoCode;
          const countryData = PhoneNumber.getCountryDataByCode(newIso2);
          newDialCode = countryData ? countryData.dialCode : dialCode;
        } else {
          newIso2 = '';
          newDialCode = '';
        }
      }
      newInputValue = this.prepareValue({
        dialCode: newDialCode,
        value: number
      });
    }

    const formatted = this.constructNumber({
      dialCode: newDialCode,
      value: newInputValue,
      iso2: newIso2
    });

    const inputValue = allowZeroAfterCountryCode
      ? formatted
      : this.possiblyEliminateZeroAfterCountryCode(formatted);

    this.setState(
      {
        inputValue,
        dialCode: newDialCode,
        iso2: newIso2
      },
      actionAfterSetState
    );
  };

  possiblyEliminateZeroAfterCountryCode = (number) => {
    const { dialCode } = this.state;
    const formatted = this.prepareValue({ value: number, dialCode });

    return formatted.startsWith('0') ? `+${dialCode}${formatted.replace(/0/gm, '')}` : number;
  };

  focus = () => this.inputPhone.focus();

  blur = () => this.inputPhone.blur();

  selectCountry = ({ cca2: iso2, callingCode }) => {
    if (this.state.iso2 !== iso2) {
      const countryData = PhoneNumber.getCountryDataByCode(iso2);
      const { inputValue, dialCode } = this.state;

      if (countryData) {
        this.setState(
          {
            iso2,
            dialCode: countryData.dialCode,
            inputValue: this.constructNumber({
              iso2,
              dialCode: countryData.dialCode,
              value: this.prepareValue({
                value: inputValue,
                dialCode
              })
            })
          },
          () => {
            if (this.props.onSelectCountry) {
              this.props.onSelectCountry(iso2);
            }
          }
        );
      }
    }
  };

  render() {
    const { iso2, inputValue, countryModal } = this.state;
    const {
      disabled,
      countryPickerProps,
      style,
      shouldShowCountryPicker,
      useCountryCode,
      textStyle,
      textComponent,
      flagSize,
      offset,
      textProps
    } = this.props;

    const { onClose, ...restPickerProps } = countryPickerProps;

    const TextComponent = textComponent || TextInput;

    console.log('-----> iso2', iso2);

    return (
      <View style={[styles.container, style]}>
        {shouldShowCountryPicker && useCountryCode && (
          <TouchableOpacity onPress={this.onPressFlag} disabled={disabled}>
            <Flag
              countryCode={iso2.toUpperCase()}
              withEmoji={true}
              withFlagButton={true}
              flagSize={flagSize}
            />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, marginLeft: offset || 10 }}>
          <TextComponent
            ref={(ref) => {
              this.inputPhone = ref;
            }}
            editable={!disabled}
            autoCorrect={false}
            style={[styles.text, textStyle]}
            onChangeText={(text) => {
              this.onChangePhoneNumber(text);
            }}
            keyboardType="phone-pad"
            underlineColorAndroid="rgba(0,0,0,0)"
            value={inputValue}
            {...textProps}
          />
        </View>

        {shouldShowCountryPicker && useCountryCode && (
          <CountryPicker
            {...restPickerProps}
            onSelect={this.selectCountry}
            translation="eng"
            visible={countryModal}
            // cca2={cca2}
            withFilter
            withCallingCode
            onClose={() => {
              this.toggleCountryModal();
              if (onClose) {
                onClose();
              }
            }}
          />
        )}
      </View>
    );
  }
}

const styleType = PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]);

PhoneInput.propTypes = {
  textComponent: PropTypes.func,
  initialCountry: PropTypes.string,
  onChangePhoneNumber: PropTypes.func,
  value: PropTypes.string,
  style: styleType,
  flagStyle: styleType,
  textStyle: styleType,
  offset: PropTypes.number,
  textProps: PropTypes.shape(TextInputProps),
  disabled: PropTypes.bool,
  allowZeroAfterCountryCode: PropTypes.bool,
  shouldShowCountryPicker: PropTypes.bool,
  useCountryCode: PropTypes.bool,
  autoFormat: PropTypes.bool,
  countryPickerProps: PropTypes.object
};

PhoneInput.defaultProps = {
  initialCountry: 'us',
  disabled: false,
  allowZeroAfterCountryCode: true,
  shouldShowCountryPicker: true,
  useCountryCode: true,
  autoFormat: true,
  offset: 0,
  flagSize: 20,
  countryPickerProps: {}
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
    // borderWidth:1,
  },
  text: {
    height: 20,
    justifyContent: 'center',
    padding: 0
  }
});

export default PhoneInput;
