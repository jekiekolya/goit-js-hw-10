const URL_NAME = 'https://restcountries.com/v3.1/name/';

export default function fetchCountries(name) {
  return fetch(
    `${URL_NAME}${name}?fields=name,capital,population,flags,languages`
  ).then(response => response.json());
}
