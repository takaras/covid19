import React, { Fragment } from 'react';
import './App.css';
import Countries from './Components/Countries/Countries';
import {
  LineChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { format, compareAsc } from 'date-fns';

const initialState = {
  countries: '',
  hasData: false,
  country: '',
  confirmedCases: [],
};

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch('https://api.covid19api.com/countries')
      .then((response) => response.json())
      .then((data) => {
        let countriesArr = data.map((country) => {
          return {
            name: country.Country,
            value: country.Slug,
          };
        });
        // Sort array by country name
        countriesArr.sort((a, b) => {
          let comparison = 1;
          if (a.name > b.name) {
            comparison = 1;
          } else if (a.name < b.name) {
            comparison = -1;
          }
          return comparison;
        });
        this.setState({ countries: countriesArr });
      })
      .catch((err) => {
        this.setState({ countries: '' });
      });
  }

  onCountryChange = (event) => {
    const country = event.target.value;
    if (!country) {
      this.setState({ confirmedCases: [], hasData: false, country });
      return false;
    }
    fetch(
      'https://api.covid19api.com/total/country/' +
        country +
        '/status/confirmed'
    )
      .then((response) => response.json())
      .then((data) => {
        let confirmedCases = data
          .filter((item) => {
            return compareAsc(
              new Date(item.Date),
              new Date('2020-02-29T00:00:00Z')
            ) > 0
              ? true
              : false;
          })
          .map((item) => {
            let day = format(new Date(item.Date), 'dd.MM.');
            return {
              cases: item.Cases,
              day,
            };
          });
        this.setState({
          confirmedCases,
          hasData: data.length ? true : false,
          country,
        });
      })
      .catch((err) => this.setState({ confirmedCases: [], hasData: false }));
  };

  render() {
    return (
      <div className="App">
        <h2 className="heading-primary">Covid 19 cases app</h2>
        <p className="intro">
          Select a country to find out the number of confirmed cases in this
          country since 01.03.2020
        </p>
        <Countries
          options={this.state.countries}
          onCountryChange={this.onCountryChange}
        />
        <div className="chart">
          {this.state.hasData ? (
            <Fragment>
              <p className="chart-title">Confirmed cases chart</p>
              <div className="chart-wrapper">
                <ResponsiveContainer height={350}>
                  <LineChart data={this.state.confirmedCases}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <Legend />
                    <XAxis name="Date" dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      name="Confirmed cases"
                      type="monotone"
                      dataKey="cases"
                      stroke="#ff7300"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Fragment>
          ) : this.state.country ? (
            <p className="no-data">
              There are not any available data for this country.
            </p>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

export default App;
