import { FC } from "react";
import { FontAwesome } from "@expo/vector-icons";

import colors from "@utils/colors";

interface Props {
  privateIcon: boolean;
}

const PasswordVisibilityIcon: FC<Props> = ({ privateIcon }) => {
  return privateIcon ? (
    <FontAwesome name="eye-slash" size={19} color={colors.PRIMARY_BTN} />
  ) : (
    <FontAwesome name="eye" size={19} color={colors.PRIMARY_BTN} />
  );
};

export default PasswordVisibilityIcon;
