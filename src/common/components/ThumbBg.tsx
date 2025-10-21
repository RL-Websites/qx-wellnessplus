interface ThumbBgProps {
  children: React.ReactNode;
}

const ThumbBg = ({ children }: ThumbBgProps) => {
  return <div className="bg-[url(/images/thumb-bg.png)] bg-no-repeat px-8 pt-8 bg-cover rounded-[10px] flex justify-center">{children}</div>;
};

export default ThumbBg;
