import DashboardHeader from "@/components/DashboardHeader";
import BalanceCard from "@/components/BalanceCard";
import QuickActions from "@/components/QuickActions";
import RecentTransactions from "@/components/RecentTransactions";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <DashboardHeader />
      <BalanceCard />
      <QuickActions />
      <RecentTransactions />
      <BottomNav />
    </div>
  );
};

export default Index;
