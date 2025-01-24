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

export function passwordValidator(password) {
    if (!password || password.length < 8) {
        return { valid: false, error: "Password must be at least 8 characters long." };
    }
    return { valid: true, success: "Password is valid." };
}

export function nameValidator(name) {
    if (!name || name.length === 0) {
        return { valid: false, error: "Name is invalid." };
    }
    return { valid: true, success: "Name is valid." };
}

export function phoneValidator(phoneNumber) {
    if (!phoneNumber || phoneNumber.length !== 10) {
        return { valid: false, error: "Phone number must be 10 digits long." };
    }
    if (!phoneNumber.startsWith('0')) {
        return { valid: false, error: "Phone number must start with 0." };
    }
    return { valid: true, success: "Phone number is valid." };
}

export function lisenceValidator(lisenceNumber) {
    if (!lisenceNumber || (lisenceNumber.length !== 8 && lisenceNumber.length !== 7)) {
        return { valid: false, error: "Lisence number must be 7-8 digits long." };
    }
    return { valid: true, success: "Lisence number is valid." };
}

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
