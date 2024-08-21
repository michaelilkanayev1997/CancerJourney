import { useTranslation } from "react-i18next";

interface CancerTypeRibbon {
  [key: string]: number; // Use `number` since `require()` returns a number for local assets
}

export const cancerTypeRibbon: CancerTypeRibbon = {
  bone: require("@assets/CancerType/bone-cancer.png"),
  breast: require("@assets/CancerType/breast-cancer.png"),
  lung: require("@assets/CancerType/lung-cancer.png"),
  appendix: require("@assets/CancerType/appendix-cancer.png"),
  brain: require("@assets/CancerType/brain-cancer.png"),
  bladder: require("@assets/CancerType/bladder-cancer.png"),
  blood: require("@assets/CancerType/blood-cancer.png"),
  kidney: require("@assets/CancerType/kidney-cancer.png"),
  childhood: require("@assets/CancerType/childhood-cancer.png"),
  colorectal: require("@assets/CancerType/colorectal-cancer.png"),
  "gallbladder-and-bile-duct": require("@assets/CancerType/gallbladder-and-bile-duct-cancer.png"),
  gastric: require("@assets/CancerType/gastric-cancer.png"),
  gynecological: require("@assets/CancerType/gynecological-cancer.png"),
  "head-and-neck": require("@assets/CancerType/head-and-neck-cancer.png"),
  liver: require("@assets/CancerType/liver-cancer.png"),
  pancreatic: require("@assets/CancerType/pancreatic-cancer.png"),
  prostate: require("@assets/CancerType/prostate-cancer.png"),
  skin: require("@assets/CancerType/skin-cancer.png"),
  testicular: require("@assets/CancerType/testicular-cancer.png"),
  thyroid: require("@assets/CancerType/thyroid-cancer.png"),
  other: require("@assets/CancerType/other-cancer.png"),
};

export const cancerTypes = [
  {
    label: "Breast Cancer",
    value: "breast",
    imageUrl: require("@assets/CancerType/breast-cancer.png"),
  },
  {
    label: "Brain Cancer",
    value: "brain",
    imageUrl: require("@assets/CancerType/brain-cancer.png"),
  },
  {
    label: "Appendix Cancer",
    value: "appendix",
    imageUrl: require("@assets/CancerType/appendix-cancer.png"),
  },
  {
    label: "bladder Cancer",
    value: "bladder",
    imageUrl: require("@assets/CancerType/bladder-cancer.png"),
  },
  {
    label: "Blood Cancer",
    value: "blood",
    imageUrl: require("@assets/CancerType/blood-cancer.png"),
  },
  {
    label: "Kidney Cancer",
    value: "kidney",
    imageUrl: require("@assets/CancerType/kidney-cancer.png"),
  },
  {
    label: "Bone Cancer",
    value: "bone",
    imageUrl: require("@assets/CancerType/bone-cancer.png"),
  },
  {
    label: "Childhood Cancer",
    value: "childhood",
    imageUrl: require("@assets/CancerType/childhood-cancer.png"),
  },
  {
    label: "Colorectal Cancer",
    value: "colorectal",
    imageUrl: require("@assets/CancerType/colorectal-cancer.png"),
  },
  {
    label: "Gallbladder & Bile Duct Cancer",
    value: "gallbladder-and-bile-duct",
    imageUrl: require("@assets/CancerType/gallbladder-and-bile-duct-cancer.png"),
  },
  {
    label: "Gastric Cancer",
    value: "gastric",
    imageUrl: require("@assets/CancerType/gastric-cancer.png"),
  },
  {
    label: "Gynecological Cancer",
    value: "gynecological",
    imageUrl: require("@assets/CancerType/gynecological-cancer.png"),
  },
  {
    label: "Head & Neck Cancer",
    value: "head-and-neck",
    imageUrl: require("@assets/CancerType/head-and-neck-cancer.png"),
  },
  {
    label: "Liver Cancer",
    value: "liver",
    imageUrl: require("@assets/CancerType/liver-cancer.png"),
  },
  {
    label: "Lung Cancer",
    value: "lung",
    imageUrl: require("@assets/CancerType/lung-cancer.png"),
  },
  {
    label: "Pancreatic Cancer",
    value: "pancreatic",
    imageUrl: require("@assets/CancerType/pancreatic-cancer.png"),
  },
  {
    label: "Prostate Cancer",
    value: "prostate",
    imageUrl: require("@assets/CancerType/prostate-cancer.png"),
  },
  {
    label: "Skin Cancer",
    value: "skin",
    imageUrl: require("@assets/CancerType/skin-cancer.png"),
  },
  {
    label: "Testicular Cancer",
    value: "testicular",
    imageUrl: require("@assets/CancerType/testicular-cancer.png"),
  },
  {
    label: "Thyroid Cancer",
    value: "thyroid",
    imageUrl: require("@assets/CancerType/thyroid-cancer.png"),
  },
  {
    label: "Other",
    value: "other",
    imageUrl: require("@assets/CancerType/other-cancer.png"),
  },
];

export const userTypes = {
  patient: "Fighter (Patient)",
  family: "Family member",
  friend: "Supporter (Friend)",
  professional: "Health care pro",
  caregiver: "Caregiver",
  other: "Other",
} as const;

export type UserTypeKey = keyof typeof userTypes;

export const useTranslatedUserTypes = () => {
  const { t } = useTranslation();

  return {
    patient: t("fighter-(patient)"),
    family: t("family-member"),
    friend: t("supporter-(friend)"),
    professional: t("health-care-pro"),
    caregiver: t("caregiver"),
    other: t("other"),
  } as const;
};
