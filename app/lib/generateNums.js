// generate number parameters
function generateNum(min, max) {
  return Math.random() * (max - min + 1) + min;
}

// get distance and numbers for region/marker generation
function generateTwoNumsWithDistance(distance, min, max) {
  const num1 = generateNum(min, max);
  const num2 = generateNum(min, max);
  if (num2 - num1 >= 10) {
    return [num1, num2];
  }
  return generateTwoNumsWithDistance(distance, min, max);
}
