import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Group, Input, PasswordInput, Select } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// type TestForm = {
// 	name: string;
// 	email: string;
// 	age: number;
// 	password: string;
// };

const TestFormSchema = yup.object({
  name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First Name"),
  email: yup.string().required(),
  age: yup.number().typeError("Age must be a number").required(),
  password: yup.string().min(8).required(),
  country: yup.string().required(),
  confirmPassword: yup.string().min(8).required().label("Confirm Password"),
  skills: yup.array(yup.boolean()).typeError("Atleast two skills must be selected").min(2, "Atleast two skills must be selected").required(),
});

type TestForm = yup.InferType<typeof TestFormSchema>;

const TestForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TestForm>({
    resolver: yupResolver(TestFormSchema),
  });

  const onSubmitForm = (data: TestForm) => {
    console.log(data);
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline mb-3">Typography Heading</h1>
      <h1>This is heading 1</h1>
      <h2>This is heading 2</h2>
      <h3>This is heading 3</h3>
      <h4>This is heading 4</h4>
      <h5>This is heading 5</h5>
      <h6>This is heading 6</h6>

      <h1 className="text-3xl font-bold underline mb-3">Typography Paragraph</h1>
      <p className="text-fs-lg">This is normal text 1</p>
      <p className="text-fs-md">This is normal text 1</p>
      <p className="text-fs-sm">This is normal text 1</p>
      <p className="text-fs-xs">This is normal text 1</p>

      <div className="mb-5"></div>
      <h1 className="text-3xl font-bold underline mb-3">Mantine Buttons</h1>
      <Group
        gap="md"
        mb="md"
      >
        <Button color="blue.0">New Button</Button>
        <Button color="blue.1">New Button</Button>
        <Button color="blue.2">New Button</Button>
        <Button color="blue.3">New Button</Button>
        <Button color="blue.4">New Button</Button>
        <Button color="blue.5">New Button</Button>
        <Button color="blue.6">New Button</Button>
        <Button color="blue.7">New Button</Button>
        <Button color="blue.8">New Button</Button>
        <Button color="blue.9">New Button</Button>
      </Group>

      <h1 className="text-3xl font-bold underline mb-3">Buttons with tailwind class</h1>
      <Group
        gap="md"
        mb="lg"
      >
        <button className="bg-blue-100 py-1 px-3 rounded-md">Another Button</button>
        <button className="bg-blue-200 py-1 px-3 rounded-md">Another Button</button>
        <button className="bg-blue-300 py-1 px-3 rounded-md">Another Button</button>
        <button className="bg-blue-400 py-1 px-3 rounded-md">Another Button</button>
        <button className="bg-blue-500 py-1 px-3 rounded-md">Another Button</button>
        <button className="bg-blue-600 py-1 px-3 rounded-md">Another Button</button>
        <button className="bg-blue-700 py-1 px-3 rounded-md">Another Button</button>
        <button className="bg-blue-800 py-1 px-3 rounded-md">Another Button</button>
        <button className="custom-btn-class ">Another Button</button>
        <button className="docmedilink-Button-root ">
          <span className="docmedilink-Button-inner">
            <span className="docmedilink-Button-label"> Classed button</span>
          </span>
        </button>
      </Group>
      <div className="w-6/12 mx-auto border border-cyan-200 p-5">
        <h2 className="font-bold underline">Test Form</h2>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Input.Wrapper
            label="Name"
            error={
              <ErrorMessage
                errors={errors}
                name="name"
              />
            }
            onChange={(e) => console.log(e)}
          >
            <Input {...register("name")} />
          </Input.Wrapper>
          <Input.Wrapper
            label="Email"
            error={
              <ErrorMessage
                errors={errors}
                name="email"
              />
            }
          >
            <Input {...register("email")} />
          </Input.Wrapper>
          <Input.Wrapper
            label="Age"
            error={
              <ErrorMessage
                errors={errors}
                name="age"
              />
            }
          >
            <Input
              type="number"
              {...register("age")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Country"
            error={
              <ErrorMessage
                errors={errors}
                name="country"
              />
            }
          >
            <Select
              placeholder="Select a country"
              data={[
                { value: "", label: "Select Country" },
                { value: "bangladesh", label: "Bangladesh" },
                { value: "nepal", label: "Nepal" },
                { value: "pakistan", label: "Pakistan" },
                { value: "bhutan", label: "Bhutan" },
              ]}
              onChange={(value) => setValue("country", value || "", { shouldValidate: true })}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Skills"
            error={
              <ErrorMessage
                errors={errors}
                name="skills"
              />
            }
          >
            <Group>
              <Checkbox
                value="1"
                label="React"
                {...register("skills")}
              />
              <Checkbox
                value="2"
                label="Angular"
                {...register("skills")}
              />
              <Checkbox
                value="3"
                label="Vue"
                {...register("skills")}
              />
              <Checkbox
                value="4"
                label="Remix"
                {...register("skills")}
              />
            </Group>
          </Input.Wrapper>
          <Input.Wrapper
            label="Password"
            error={
              <ErrorMessage
                errors={errors}
                name="password"
              />
            }
          >
            <PasswordInput {...register("password")} />
          </Input.Wrapper>

          <Input.Wrapper
            label="Confirm Password"
            error={
              <ErrorMessage
                errors={errors}
                name="confirmPassword"
              />
            }
          >
            <PasswordInput
              {...register("password")}
              classNames={{
                root: "mb-[5px]",
              }}
            />
          </Input.Wrapper>

          <Button
            type="submit"
            mt="md"
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default TestForm;
