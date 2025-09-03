// Cryptographically secure random number generator
const getSecureRandomInt = (max: number): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
};

// Fisher-Yates shuffle with cryptographically secure randomness
const secureshuffle = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateTemporaryPassword = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  let password = "";

  // Ensure at least one character from each category
  password += uppercase[getSecureRandomInt(uppercase.length)];
  password += lowercase[getSecureRandomInt(lowercase.length)];
  password += numbers[getSecureRandomInt(numbers.length)];
  password += symbols[getSecureRandomInt(symbols.length)];

  // Fill remaining length with random characters
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < 12; i++) {
    password += allChars[getSecureRandomInt(allChars.length)];
  }

  // Shuffle the password using cryptographically secure randomness
  return secureshuffle(password.split("")).join("");
};

export const formatUserRole = (role: string): string => {
  return role
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getUserInitials = (
  firstName: string,
  lastName: string
): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};