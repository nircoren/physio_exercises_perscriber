import { Metadata } from "next";
import SearchInjury from '@/components/Physio/SearchInjury'
import TranslationsProvider from "@/components/i18/TranslationsProvider";
import initTranslations from "@/i18n";
import { I18Props } from "@/types/i18Props";

export const metadata: Metadata = {
  title: "Send exercises to patients",
  description: ""
};

const i18nNamespaces = ["common", "hero", "features_objections", "faq","cta"];

const Home: React.FC<I18Props> = async ({ params: { locale } }) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <main>
      <TranslationsProvider
        namespaces={i18nNamespaces}
        locale={locale}
        resources={resources}
      >
        <SearchInjury locale={locale}/>
      </TranslationsProvider>
    </main>
  );
};

export default Home;
