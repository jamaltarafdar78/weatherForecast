import React, {Component} from 'react';
import ReactDOM from 'react-dom';   
import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient, {gql} from 'apollo-boost';
import Select from 'react-select';

const client = new ApolloClient({
    uri: "/graphql"
})

const UKCitiesArray = [
    'Glasgow',
    'Edinburgh',
    'Bristol',
    'Manchester',
    'London'
]

const UKCitiesSelectOptions = UKCitiesArray.map(city => ({label: city, value:city}));

let selectedCity = UKCitiesSelectOptions[0];

// use levelling to map key main.temp to temp
const getForecast = gql`query($city: String!){forecast(city: $city){temp:_get(path:"main.temp"), dt_txt, weather{icon, description}}}`;

const WeatherIconPath = icon => `https://openweathermap.org/img/w/${icon}.png`

const WeatherIcon = ({icon, description}) => <img src={WeatherIconPath(icon)} alt={description}/>

const Forecasts = ({forecast}) => {
    const rows = forecast.map(({temp, dt_txt, weather}) => <tr key={dt_txt}>
            <td>{dt_txt}</td>
            <td>{temp}</td>
            <td><WeatherIcon {...weather[0]}/></td>
        </tr>
    )

    debugger;

    return (
        <table className="table table-hover">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Temperature (&deg;C)</th>
            <th>Weather</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
}

class App extends Component {
    render() {
      return (
        <div>Hello World</div>
      )
    }
  }


const Loader =  () => (<div>
    <img
        alt="loading"
        src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif"
        style={{ height: 200 }}
    />
</div>);

const ForecastQuery = () => (<Query
    query={getForecast}
    variables={{ city: selectedCity.value }}>{

        ({ loading, error, data, refetch }) => {
            if (error) return <div>Error!</div>

            return (
                <div style={{ textAlign: "center", height: 200 }}>
                    <Select
                        value={selectedCity}
                        onChange={async (selectedOption) => {
                            selectedCity = selectedOption;
                            await refetch({ city: selectedOption.value })
                        }}
                        options={UKCitiesSelectOptions} />
                    {loading ? (<Loader />) : (<Forecasts {...data} />)}
                </div>
            )
        }
    }
</Query>)

const ApolloApp = () => (<ApolloProvider client={client}>
    <ForecastQuery/>
</ApolloProvider>)

ReactDOM.render(<ApolloApp/>, document.getElementById('root'))