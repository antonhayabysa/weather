import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert} from 'react-native';
import * as Location from 'expo-location';
import Loading from './src/screen/Loading';
import Weather from './src/component/Weather';
import axios from 'axios';

const API_KEY = '5c6b4b5924d744caef76fa22493e85fc';

export default class extends React.Component {

  state = {
    isLoading: true
  }

  getWeather = async (latitude, longitude) => {
    const {data: {main: {temp}, weather}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    this.setState({
      isLoading: false,
      temp,
      condition: weather[0].main,
    });
    console.log(data);
  }

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert('Не могу определить местоположение', "Очень грустно ");
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  render () {
    const {isLoading, temp, condition} = this.state;
    return (
      isLoading ? <Loading /> : <Weather  temp={Math.round(temp)} condition={condition}/>
    );
  }
}
