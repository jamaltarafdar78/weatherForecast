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

const getForecast = gql`query($city: String!){forecast(city: $city){main{temp}, dt}}`;

const Forecast = ({temp}) => <div>
    <div>{temp}</div>
</div>

const Forecasts = ({forecast}) => {
   const items = forecast ? forecast.map((item) => <li key={item.dt}>
        {item.main.temp}
    </li>)
    : <div>No found</div>

    return (
        <div>
            <Select options={UKCitiesSelectOptions}/>
            <ul>{items}</ul>
        </div>
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
    variables={{city: 'Glasgow'}}>{
    
    ({loading, error, data, refetch}) => {
        if (error) return <div>Error!</div>

        return (
            <div style={{ textAlign: "center", height: 200 }}>
                {loading ? (<Loader />) : (<Forecasts {...data} />)} 
            </div>
        )
        
    }
}</Query>)

const ApolloApp = () => (<ApolloProvider client={client}>
    <ForecastQuery/>
</ApolloProvider>)

ReactDOM.render(<ApolloApp/>, document.getElementById('root'))