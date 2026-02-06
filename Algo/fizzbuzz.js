const rules = [
  { divisor: 3, label: 'Fizz' },
  { divisor: 5, label: 'Buzz' },
];

/**
 * Applique les règles FizzBuzz à un nombre
 * @param {number} n - Nombre à évaluer
 * @param {Array} customRules - Règles à appliquer (optionnel).
 *   L'ordre des règles définit l'ordre de concaténation des labels.
 * @returns {string} - Résultat FizzBuzz
 */
const fizzBuzz = (n, customRules = rules) => {
  const result = customRules.reduce((acc, { divisor, label }) => {
    return n % divisor === 0 ? acc + label : acc;
  }, '');

  return result || String(n);
};

/**
 * Génère la séquence FizzBuzz de 1 à n
 * @param {number} n - Limite supérieure
 * @returns {string[]} - Tableau des résultats
 */
const fizzBuzzRange = (n) => {
  return Array.from({ length: n }, (_, i) => fizzBuzz(i + 1));
};

// Tests
console.assert(fizzBuzz(3) === 'Fizz', 'Divisible par 3');
console.assert(fizzBuzz(5) === 'Buzz', 'Divisible par 5');
console.assert(fizzBuzz(15) === 'FizzBuzz', 'Divisible par 3 et 5');
console.assert(fizzBuzz(7) === '7', 'Non divisible');

// Exécution
const N = 100;
fizzBuzzRange(N).forEach((value, index) => {
  console.log(`${index + 1}: ${value}`);
});

module.exports = { fizzBuzz, fizzBuzzRange, rules };
