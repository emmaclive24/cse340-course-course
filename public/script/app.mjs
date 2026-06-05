// this mjs script will import the export functions from the other mjs files and call them to initialize
// the functionalities when the page loads

import { initHamburger } from './hambutton.mjs';

import { initDarkMode } from './modetoggle.mjs';

document.addEventListener('DOMContentLoaded', () => {

    initHamburger();

    initDarkMode();

});