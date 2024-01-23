export const generateToken = (lenght: number) => {
  let otp = "";

  for (let i = 0; i < lenght; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit;
  }
  return otp;
};
