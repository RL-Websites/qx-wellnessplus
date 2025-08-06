interface ThumbBgProps {
  children: React.ReactNode;
}

const ThumbBg = ({ children }: ThumbBgProps) => {
  return <div className="bg-[url(./public/images/thumb-bg.png)] bg-no-repeat p-8 bg-cover rounded-[20px]">{children}</div>;
};

export default ThumbBg;
