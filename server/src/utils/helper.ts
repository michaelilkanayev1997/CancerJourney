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

export const timesPerDayToHours = (timesPerDay: string): string[] => {
  switch (timesPerDay) {
    case "Once a day":
      return ["08:00"];
    case "2 times a day":
      return ["08:00", "14:00"];
    case "3 times a day":
      return ["08:00", "14:00", "18:00"];
    case "4 times a day":
      return ["06:00", "10:00", "14:00", "18:00"];
    case "5 times a day":
      return ["06:00", "10:00", "14:00", "18:00", "22:00"];
    case "6 times a day":
      return ["06:00", "10:00", "14:00", "18:00", "22:00", "02:00"];
    default:
      throw new Error("Invalid timesPerDay value.");
  }
};
