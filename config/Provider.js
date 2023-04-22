import React, { Component } from 'react'
import Context from './Context'
import ICONS from '../config/icons'

export default class Provider extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat: null,
            lon: null,
            weather: '',
            time: '',
            user: null
        }
    }
    componentDidMount(){
        // this.ID = setInterval(()=>this.runFunc(), 1000)
    }

    latLonWeather(){
        if(this.state.lat && this.state.lon){
            const url = 'https://api.openweathermap.org/data/2.5/weather'
            // const lat = 43.077366
            // const lon = -85.994053
            const apikey = '2d9959c987449c659ec4f05938290e2a'
            fetch(`${url}?lat=${this.state.lat}&lon=${this.state.lon}&appid=${apikey}&units=imperial`)
            .then(response=>response.json())
            .then(response=>{
                this.setState({weather: `Temp ${response.main.temp}`})
            })
        }
    }

    getWeather(lat, lon){
        const url = 'https://api.openweathermap.org/data/2.5/weather'
        // const lat = 43.077366
        // const lon = -85.994053
        const apikey = '2d9959c987449c659ec4f05938290e2a'
        fetch(`${url}?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`)
        .then(response=>response.json())
        .then(response=>{
            // console.log(response)
            const obj = {
                description: response?.weather[0]?.description ?? '',
                icon: ICONS[response?.weather[0]?.icon] ?? '',
                temp: response?.main?.temp ?? ''
            }
            // console.log(obj)
            this.setState({weather: obj})
            // this.setState({weather: `Temp ${response.main.temp}`})
        })
    }

    getTime(){
        const t = new Date().toLocaleTimeString()
        this.setState({time: t})
    }

    runFunc(){
        this.latLonWeather();
        this.getTime();
    }

    componentWillUnmount(){
        // clearInterval(this.ID)
    }
    render() {
        return (
            <Context.Provider value={{
                weather: this.state.weather,
                time: this.state.time,
                setLatLon: (lat, lon) =>{
                    this.setState({lat, lon})
                },
                weatherInfo: (lat, lon)=>{
                    this.getWeather(lat, lon);
                },
                user: this.state.user,
                setUser: user=>{
                    this.setState({user})
                }
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}
