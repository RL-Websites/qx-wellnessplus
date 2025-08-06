import { Button } from "@mantine/core";

const Gender = () => {
  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>
      <div className="">
        <h4 className="text-center text-3xl mt-12">May I ask your preferred gender identity?</h4>
        <form className="w-full">
          <div className="text-center mt-10">
            <Button
              size="md"
              type="submit"
              className="bg-primary text-white rounded-xl lg:w-[206px]"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gender;
