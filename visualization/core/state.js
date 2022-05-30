export let countries = [];
export let season = 'Summer';

let observers = [];

export function addObserver(observer) {
    observers.push(observer);
}

export function addCountry(country) {
    if (!countries.includes(country)) {
        countries.push(country);
        observers.forEach(f => f());
    }
}

export function removeCountry(country) {
    if (countries.includes(country)) {
        countries = countries.filter(c => c !== country);
        console.log('countries', countries)
        observers.forEach(f => f());
    }
}
