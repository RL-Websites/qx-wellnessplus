"use client";

import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { selectedStateAtom } from "@/common/states/state.atom";
import states from "@/data/state-list.json";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Select } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const CurrentStateSchema = yup.object({
  state: yup.string().required("Please select a state").label("State"),
});

export type CurrentStateSchemaType = yup.InferType<typeof CurrentStateSchema>;

interface ICurrentProps {
  onNext: (data: CurrentStateSchemaType & { inEligibleUser?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CurrentStateSchemaType;
  direction?: "forward" | "backward"; // ✅ Add this
}

export default function CurrentState({ onNext, onBack, defaultValues, direction }: ICurrentProps) {
  const [globalState, setGlobalState] = useAtom(selectedStateAtom); // Jotai global state
  const [stateSearchVal, setStateSearchVal] = useState<string>("");

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);
  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, animationDelay);
  };

  const handleFormSubmit = (data: CurrentStateSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext({
        ...data,
      });
    }, animationDelay); // ✅ Matches animation duration (400ms + 100ms delay)
  };

  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CurrentStateSchemaType>({
    defaultValues: {
      state: defaultValues?.state || globalState || "",
    },
    resolver: yupResolver(CurrentStateSchema),
  });

  const state = watch("state");

  // keep global state in sync when form changes
  useEffect(() => {
    if (state) {
      setGlobalState(state);
    }
  }, [state, setGlobalState]);
  const handleStateChange = (value: string | null, option: any) => {
    if (errors.state) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("state", value || "");
        if (value) {
          setStateSearchVal(option?.label || "");
          clearErrors("state");
          setGlobalState(value);
        }
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("state", value || "");
      if (value) {
        setStateSearchVal(option?.label || "");
        setGlobalState(value);
      }
    }
  };
  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className={`heading-text text-foreground uppercase text-center  ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>Current State</h2>

      <div className={`card-common card-common-width relative z-10 delay-1000 duration-500 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}>
        <form
          id="currentStateForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Select
            label="State"
            withAsterisk
            classNames={{
              wrapper: "bg-grey-btn rounded-md",
              error: isErrorFading ? "error-fade-out" : "animate-pulseFade",
            }}
            rightSection={<i className="icon-down-arrow text-sm"></i>}
            searchable
            searchValue={stateSearchVal}
            onSearchChange={setStateSearchVal}
            value={state}
            className="w-full"
            data={states?.map((item) => ({
              value: item?.StateName,
              label: item?.StateName,
            }))}
            error={getErrorMessage(errors.state?.message)}
            onChange={handleStateChange}
          />
        </form>
      </div>

      <div className={`flex justify-center gap-6 pt-8 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
        <Button
          variant="outline"
          className="w-[200px] animated-btn"
          onClick={handleBackClick}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px] animated-btn"
          form="currentStateForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
