import { useTranslation } from "react-i18next";

export const Events = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.home.welcome_message")}</h1>
    </div>
  );
};
