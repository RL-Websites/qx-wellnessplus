import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, PasswordInput } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const registrationSchema = yup.object({
  firstName: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .label("First Name"),
  lastName: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .label("Last Name"),
  emailAddress: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .label("Email")
    .email(),
  password: yup
    .string()
    .required("You need to add a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one upper case special character")
    .label("Password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

type registrationSchemaType = yup.InferType<typeof registrationSchema>;

const RegistrationPage = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [queryParams, setQueryParams] = useSearchParams();
  const [doctorDetails, setDoctorDetails] = useState<any>({});
  const uid = queryParams.get("u_id");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<registrationSchemaType>({
    resolver: yupResolver(registrationSchema),
  });

  const passwordValue = watch("password");

  const onSubmit = (data: registrationSchemaType) => {
    const finalData = { ...data, ...{ type: "admin", u_id: uid } };
    console.log(finalData);
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text  text-foreground uppercase  text-center">Registration</h2>
      <form
        className="w-full "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card-common card-common-width flex flex-col lg:gap-7 md:gap-5 gap-3">
          <p className="font-semibold lg:text-3xl md:text-xl text-base text-foreground ">Registration Details</p>
          <Input.Wrapper
            label="First Name"
            required
            error={errors.firstName?.message ? errors.firstName?.message : false}
            classNames={{
              label: "!text-sm md:!text-base lg:!text-lg",
            }}
          >
            <Input
              type="text"
              {...register("firstName")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Last Name"
            required
            error={errors.lastName?.message ? errors.lastName?.message : false}
            classNames={{
              label: "!text-sm md:!text-base lg:!text-lg",
            }}
          >
            <Input
              type="text"
              {...register("lastName")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Email Address"
            required
            error={errors.emailAddress?.message ? errors.emailAddress?.message : false}
            classNames={{
              label: "!text-sm md:!text-base lg:!text-lg",
            }}
          >
            <Input
              type="email"
              {...register("emailAddress")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Password"
            mt="12"
            required
            error={errors.password?.message ? errors.password?.message : false}
            classNames={{
              label: "!text-sm !md:text-base !lg:text-lg",
            }}
          >
            <PasswordInput
              visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
              {...register("password")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Confirm password"
            mt="12"
            required
            error={errors.confirmPassword?.message ? errors.confirmPassword?.message : false}
            classNames={{
              label: "!text-sm !md:text-base !lg:text-lg",
            }}
          >
            <PasswordInput
              visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
              {...register("confirmPassword")}
            />
          </Input.Wrapper>
        </div>
        <div className="text-center mt-10">
          <Button
            size="md"
            type="submit"
            className="bg-primary text-white rounded-xl lg:w-[206px]"
          >
            Register Now
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
