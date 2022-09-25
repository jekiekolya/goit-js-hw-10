import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

// Getting Ref
const ref = {
  input: document.querySelector('input'),
};
// Variables
const DEBOUNCE_DELAY = 300;

//Add event listener to input
ref.input.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(e) {
  const findValue = e.target.value.trim();
  if (findValue === '') return;

  const nameOfficial = [];
  const capital = [];
  const population = [];
  const flagsSvg = [];
  const languages = [];

  fetchCountries(findValue)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        throw new Error(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      return countries;
    })
    .then(countries => {
      if (countries.status === 404) {
        Notify.failure('Oops, there is no country with that name', {
          fontAwesomeIconStyle: 'shadow',
        });
        throw new Error('Oops, there is no country with that name');
      }
      return countries;
    })
    .then(countries => {
      for (const country of countries) {
        nameOfficial.push(country.name.official);
        capital.push(country.capital[0]);
        population.push(country.population);
        flagsSvg.push(country.flags.svg);
        languages.push(Object.values(country.languages));
      }
    })
    .then(r => {
      console.log(nameOfficial, capital, population, flagsSvg, languages);
    })
    .catch(error => console.error(error));
}
