export function getAgeBand(age: number) {
  if (age >= 21) {
    return "21+";
  }

  if (age >= 18) {
    return "18+";
  }

  if (age >= 16) {
    return "16+";
  }

  return "underage";
}

export function meetsMinimumAge(age: number, requiredAge: number) {
  return age >= requiredAge;
}
