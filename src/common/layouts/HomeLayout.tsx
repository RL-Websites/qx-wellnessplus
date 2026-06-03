import HomeHeader from "./Components/HomeHeader";

interface homeLayoutProps {
  children: React.ReactNode;
}
const HomeLayout = ({ children }: homeLayoutProps) => {
  return (
    <div className="site-main-bg home-safe-area">
      <div className="container mx-auto">
        <HomeHeader />
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
