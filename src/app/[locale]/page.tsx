import { Metadata } from "next";
import SearchInjury from '@/components/Physio/SearchInjury'
export const metadata: Metadata = {
  title: "שליחת תרגילים למטופלים",
  description: ""};


const wawa: React.FC = async () => {
  return (
    <main>
        <SearchInjury/>
    </main>
  );
};

export default wawa;
