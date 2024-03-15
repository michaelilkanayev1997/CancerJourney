export const generateToken = (lenght: number) => {
  let otp = "";

  for (let i = 0; i < lenght; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit;
  }
  return otp;
};

export const verifyGoogleToken = async (token: string) => {
  try {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await response.json();

    return user;
  } catch (error) {
    return error;
  }
};

// Remove space & LowerCase
export const sanitizeFolderName = (folderName: string) => {
  return folderName.toLowerCase().replace(/\s+/g, "");
};
