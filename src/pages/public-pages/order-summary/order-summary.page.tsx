const OrderSummary = () => {
  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text  text-foreground uppercase  text-center">Order Summary</h2>
      <div className="grid md:grid-cols-2 md:gap-[30px] gap-5 pt-12">
        <div className="card bg-opacity-60">
          <div className="md:space-y-10 space-y-5">
            <div className="flex lg:flex-row flex-col gap-5 relative">
              <img
                src="./public/images/injection-1.png"
                className="size-32"
                alt=""
              />
              <div className="lg:w-[calc(100%_-_154px)] ">
                <h6 className="text-xl font-semibold text-foreground font-poppins">Insulin Syringes - 29G 1CC 1/2" (10 pack)</h6>
                <div className="flex items-center gap-2.5 pt-2.5 font-poppins">
                  <span className="text-lg text-foreground">Injection</span>
                  <span className="text-lg text-foreground">|</span>
                  <span className="text-lg text-foreground">Hair Fall</span>
                </div>
              </div>
              <i className="icon-delete text-2xl/none text-danger absolute top-0 right-0 cursor-pointer"></i>
            </div>
            <div className="flex lg:flex-row flex-col gap-5 relative">
              <img
                src="./public/images/injection-3.png"
                className="size-32"
                alt=""
              />
              <div className="lg:w-[calc(100%_-_154px)] ">
                <h6 className="text-xl font-semibold text-foreground font-poppins">Insulin Syringes - 29G 1CC 1/2" (10 pack)</h6>
                <div className="flex items-center gap-2.5 pt-2.5 font-poppins">
                  <span className="text-lg text-foreground">Injection</span>
                  <span className="text-lg text-foreground">|</span>
                  <span className="text-lg text-foreground">Hair Fall</span>
                </div>
              </div>
              <i className="icon-delete text-2xl/none text-danger absolute top-0 right-0 cursor-pointer"></i>
            </div>
          </div>
        </div>
        <div className="card bg-opacity-60">
          <h6 className="card-title with-border text-foreground font-poppins font-semibold md:text-xl text-lg   !border-foreground">Cart Total</h6>
          <div className="h-[calc(100%_-_80px)] overflow-y-auto py-2.5 space-y-6">
            <div className="flex flex-wrap items-center justify-between">
              <span className="text-foreground text-lg inline-block max-w-[226px]">Insulin Syringes - 29G 1CC 1/2" (10 pack) x 2</span>
              <span className="text-foreground text-lg">$ 798.00</span>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <span className="text-foreground text-lg max-w-[226px]">Tirzepatide Injectable Solution, 10 mg</span>
              <span className="text-foreground text-lg">$ 300.00</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-t-foreground pt-2">
            <span className="text-foreground font-poppins font-semibold md:text-xl text-lg   !border-foreground">Total</span>
            <span className="text-foreground font-poppins font-semibold md:text-xl text-lg   !border-foreground"> $ 828.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
