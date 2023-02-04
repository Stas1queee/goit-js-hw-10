import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const START_URL = 'https://restcountries.com/v2/name/';

refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('ul'),
  container: document.querySelector('.country-info'),
};


const MAX_COUNTRIES = 10;
let input = '';

// слухаємо інпут 
refs.input.addEventListener(
  'input',
  debounce(e => {
    input = e.target.value.trim(' ');
    inputClear();
    if (!input) {
      return;
    };
    fetchCountries(START_URL, input)
      .then(data => {
        if (data.length > MAX_COUNTRIES) {
          return Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length > 1) {
          refs.list.insertAdjacentHTML('beforeend', markupCountries(data));
        } else if (data.length === 1) {
          refs.container.insertAdjacentHTML('beforeend', markupCountry(data));
        }
      })
      .catch();
  }, DEBOUNCE_DELAY)
);

// окремі функціі очистки і створення розмітки
function inputClear() {
      refs.list.innerHTML = '';
      refs.container.innerHTML = '';
}
function markupCountries(items) {
  return items
    .map(
      item => `<li><img src="${item.flag}" alt="flag" width="40" height ="30">
            <p>  ${item.name}</p></li>`
    )
    .join('');
}
function markupCountry(item) {
  return item
    .map(
      country => `<div class ="wraper">
    <img src="${country.flag}" alt="flag" width="70" height ="40">
            <h2>  ${country.name}</h2></div><p><b>Capital: </b>${
        country.capital
      }</p>
            <p><b>Population: </b>${country.population}</p>
            <p><b>Languages: </b>${country.languages
              .map(lang => lang.name)
              .join(', ')}</p>`
    )
    .join('');
}
