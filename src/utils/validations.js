// @flow
import validator from 'validator';

export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

export function isValidMobileNumber(number: string): boolean {
  return validator.isMobilePhone(number, 'any');
}

export function isValidZipCode(zipCode: string): boolean {
  return validator.isPostalCode(zipCode, 'any');
}

export function isValidOTP(otp: string): boolean {
  return validator.isByteLength(otp, { min: 6, max: 6 });
}
