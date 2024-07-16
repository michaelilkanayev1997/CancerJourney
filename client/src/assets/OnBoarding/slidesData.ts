export default (t: (arg0: string) => any) => [
  {
    id: "1",
    title: t("journey"),
    description: t("journey-description"),
    image: require("./Journey.jpg"),
  },
  {
    id: "2",
    title: t("personal-journal"),
    description: t("personal-journal-description"),
    image: require("./Personal Journal.jpeg"),
  },
  {
    id: "3",
    title: t("secure"),
    description: t("secure-description"),
    image: require("./Secure.webp"),
  },
  {
    id: "4",
    title: t("community"),
    description: t("community-description"),
    image: require("./Community.webp"),
  },
];
