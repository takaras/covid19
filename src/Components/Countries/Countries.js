import React, { Fragment } from 'react';
// import './Countries.css';

const Countries = ({ options, onCountryChange }) => {
  let optionsArr = [{ name: 'Select a country', value: '' }, ...options].map(
    (option) => {
      return (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      );
    }
  );

  return (
    <Fragment>
      <select
        className="custom-select"
        name="country"
        onChange={onCountryChange}
      >
        {optionsArr}
      </select>
    </Fragment>
  );
};

export default Countries;
