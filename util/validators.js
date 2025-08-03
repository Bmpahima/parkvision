/**
 * Validates the structure of an email address.
 * @param {string} email - The email to validate.
 * @returns {{ valid: boolean, error?: string, success?: string }}
 */

export function emailValidator(email) {
    if (!email || !email.includes('@')) {
        return { valid: false, error: "Email needs to include @." };
    }
    const subEmail = email.split('@');
    if (!subEmail || !subEmail[1]) {
        return { valid: false, error: "Please enter a valid email." };
    }
    return { valid: true, success: "Email is valid" };
}

/**
 * Validates the strength of a password.
 * @param {string} password - The password to validate.
 * @returns {{ valid: boolean, error?: string, success?: string }}
 */

export function passwordValidator(password) {
    if (!password || password.length < 8) {
        return { valid: false, error: "Password must be at least 8 characters long." };
    }
    return { valid: true, success: "Password is valid." };
}

/**
 * Validates the given name (first or last).
 * @param {string} name - The name to validate.
 * @returns {{ valid: boolean, error?: string, success?: string }}
 */

export function nameValidator(name) {
    if (!name || name.length === 0) {
        return { valid: false, error: "Name is invalid." };
    }
    return { valid: true, success: "Name is valid." };
}

/**
 * Validates a 10-digit Israeli phone number.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {{ valid: boolean, error?: string, success?: string }}
 */

export function phoneValidator(phoneNumber) {
    if (!phoneNumber || phoneNumber.length !== 10) {
        return { valid: false, error: "Phone number must be 10 digits long." };
    }
    if (!phoneNumber.startsWith('0')) {
        return { valid: false, error: "Phone number must start with 0." };
    }
    return { valid: true, success: "Phone number is valid." };
}

/**
 * Validates an Israeli car license plate (7-8 digits).
 * @param {string} lisenceNumber - The license plate number to validate.
 * @returns {{ valid: boolean, error?: string, success?: string }}
 */

export function lisenceValidator(lisenceNumber) {
    if (!lisenceNumber || (lisenceNumber.length !== 8 && lisenceNumber.length !== 7)) {
        return { valid: false, error: "Lisence number must be 7-8 digits long." };
    }
    return { valid: true, success: "Lisence number is valid." };
}

/**
 * Validates all fields required for signing up a user.
 * @param {{
 *   fname: string,
 *   lname: string,
 *   email: string,
 *   password: string,
 *   phoneNumber: string,
 *   lisenceNumber: string
 * }} formData - The form data to validate.
 * @returns {{
 *   valid: boolean,
 *   success?: string,
 *   errors?: Array<Object>,
 *   error?: string
 * }}
 */

export function signUpValidation(formData) {
    try {
        const { fname, lname, email, password, phoneNumber, lisenceNumber } = formData;

        let validationResult = [];

        const fnameResults = nameValidator(fname);
        if (!fnameResults.valid) {
            validationResult.push({ fname: fnameResults.error });
        }

        const lnameResults = nameValidator(lname);
        if (!lnameResults.valid) {
            validationResult.push({ lname: lnameResults.error });
        }

        const emailResults = emailValidator(email);
        if (!emailResults.valid) {
            validationResult.push({ email: emailResults.error });
        }

        const passwordResults = passwordValidator(password);
        if (!passwordResults.valid) {
            validationResult.push({ password: passwordResults.error });
        }

        const phoneResults = phoneValidator(phoneNumber);
        if (!phoneResults.valid) {
            validationResult.push({ phoneNumber: phoneResults.error });
        }

        const lisenceResults = lisenceValidator(lisenceNumber);
        if (!lisenceResults.valid) {
            validationResult.push({ lisenceNumber: lisenceResults.error });
        }

        if (validationResult.length === 0) {
            return { valid: true, success: 'Valid credentials' };
        } else {
            return { valid: false, errors: validationResult };
        }
    } catch (error) {
        console.error("Validation error:", error);
        return { valid: false, error: "An error occurred during validation." };
    }
}

/**
 * Validates login form fields.
 * @param {{ email: string, password: string }} formData - The login form data.
 * @returns {{
 *   valid: boolean,
 *   success?: string,
 *   errors?: Array<Object>,
 *   error?: string
 * }}
 */

export function loginValidation(formData) {
    try {
        const { email, password } = formData;

        let validationResult = [];

        const emailResults = emailValidator(email);
        if (!emailResults.valid) {
            validationResult.push({ email: emailResults.error });
        }

        const passwordResults = passwordValidator(password);
        if (!passwordResults.valid) {
            validationResult.push({ password: passwordResults.error });
        }

        if (validationResult.length === 0) {
            return { valid: true, success: 'Valid credentials' };
        } else {
            return { valid: false, errors: validationResult };
        }
    } catch (error) {
        console.error("Validation error:", error);
        return { valid: false, error: "An error occurred during validation." };
    }
}
