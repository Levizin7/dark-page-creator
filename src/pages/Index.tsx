import HeroSection from "@/components/HeroSection";
import QuickActions from "@/components/QuickActions";
import RecentTransactions from "@/components/RecentTransactions";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <HeroSection />
      <div className="mt-14">
        <QuickActions />
      </div>
      <RecentTransactions />
      <BottomNav />
    </div>
  );
};

export default Index;
