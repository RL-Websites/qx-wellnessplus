import HomeHeader from "./Components/HomeHeader";

interface homeLayoutProps {
  children: React.ReactNode;
}
const HomeLayout = ({ children }: homeLayoutProps) => {
  return (
    <div className="site-main-bg  lg:pt-16 pt-10 lg:pb-24 pb-10">
      <div className="container mx-auto">
        <HomeHeader />
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
