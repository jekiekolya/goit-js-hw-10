import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

// Getting Ref
const ref = {
  input: document.querySelector('input'),
  list: document.querySelector('ul'),
  box: document.querySelector('.country-info'),
};
// Variables
const DEBOUNCE_DELAY = 300;
let stringMarkup = '';
let nameOfficial;
let capital;
let population;
let flagsSvg;
let languages;

//Add event listener to input
ref.input.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(e) {
  const findValue = e.target.value.trim();
  ref.list.innerHTML = '';
  ref.box.innerHTML = '';
  if (findValue === '') return;

  fetchCountries(findValue)
    .then(countries => {
      checkAmountCountry(countries);
      return countries;
    })
    .then(countries => {
      checkError(countries);
      return countries;
    })
    .then(countries => {
      if (countries.length > 1) {
        getListCountry(countries);
        return;
      }
      return countries;
    })
    .then(countries => {
      getInfoCountry(countries);
      createBoxMarkup(nameOfficial, capital, population, flagsSvg, languages);
    })
    .catch(error => console.error(error));
}

// Create markup for list (result between 2-10)
function createListMarkup(nameOfficial, flagsSvg) {
  stringMarkup += `<li><img src="${flagsSvg}" alt="Flag - ${nameOfficial}" width="50px" /><p>${nameOfficial}</p></li>`;
}

// Create markup for box (One country)
function createBoxMarkup(
  nameOfficial,
  capital,
  population,
  flagsSvg,
  languages
) {
  stringMarkup = `<div class="country-info-box"><div class="country-title">
        <img src="${flagsSvg}" alt="flag - ${nameOfficial}" width="50px" />
        <h2>${nameOfficial}</h2>
      </div>
      <div class="country-desc">
        <p><span>Capital: </span>${capital}</p>
        <p><span>Population: </span>${population}</p>
        <p><span>Languages: </span>${languages}</p>
      </div></div>`;
  ref.box.innerHTML = stringMarkup;
}

// Function for checking amount countries
function checkAmountCountry(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    throw new Error(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}

// Function for checking error 404 (Not found)
function checkError(countries) {
  if (countries.status === 404) {
    Notify.failure('Oops, there is no country with that name', {
      fontAwesomeIconStyle: 'shadow',
    });
    throw new Error('Oops, there is no country with that name');
  }
}

// Function for getting list with country
function getListCountry(countries) {
  stringMarkup = '';
  for (const country of countries) {
    nameOfficial = country.name.official;
    flagsSvg = country.flags.svg;
    createListMarkup(nameOfficial, flagsSvg);
  }
  ref.list.innerHTML = stringMarkup;
}

// Function for getting values for box
function getInfoCountry(countries) {
  nameOfficial = countries[0].name.official;
  capital = countries[0].capital[0];
  population = countries[0].population;
  flagsSvg = countries[0].flags.svg;
  languages = Object.values(countries[0].languages).join(', ');
}
