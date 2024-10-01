const validator = require('validator');

function validateUserInput({ name, number, address, city, state, postal_code, country }, isNewUser) {
    const errors = [];

    if (isNewUser) {
        if (!name || validator.isEmpty(name.trim())) {
            errors.push('Name is required');
        }
    }

    if (!number || !validator.isMobilePhone(number, 'any')) {
        errors.push('Valid phone number is required');
    }

    if (!address || validator.isEmpty(address.trim())) {
        errors.push('Address is required');
    }

    if (!city || validator.isEmpty(city.trim())) {
        errors.push('City is required');
    }

    if (!state || validator.isEmpty(state.trim())) {
        errors.push('State is required');
    }

    if (!postal_code || !validator.isLength(postal_code, { min: 5, max: 6 })) {
        errors.push('Postal code must be between 5 and 6 characters');
    }

    if (!country || validator.isEmpty(country.trim())) {
        errors.push('Country is required');
    }

    return errors;
}

module.exports = {
    validateUserInput
};
