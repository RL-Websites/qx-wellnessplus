"use client";

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

  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, 420);
  };

  const handleFormSubmit = (data: CurrentStateSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext({
        ...data,
      });
    }, 750); // ✅ Matches animation duration (400ms + 100ms delay)
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

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2
        className={`heading-text text-foreground uppercase text-center  ${
          isExiting ? "animate-title-exit" : isBackExiting ? "animate-title-exit-back" : direction === "forward" ? "animate-title-enter-right" : "animate-title-enter-left"
        }`}
      >
        Current State
      </h2>

      <div
        className={`card-common card-common-width relative z-10 delay-1000 duration-500 ${
          isExiting ? "animate-content-exit" : isBackExiting ? "animate-content-exit-back" : direction === "forward" ? "animate-content-enter-right" : "animate-content-enter-left"
        }`}
      >
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
              error: "animate-fadeInUp",
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
            onChange={(value, option) => {
              setValue("state", value || "");
              if (value) {
                setStateSearchVal(option?.label || "");
                clearErrors("state");
                setGlobalState(value); // update global state immediately
              }
            }}
          />
        </form>
      </div>

      <div
        className={`flex justify-center gap-6 pt-8 ${
          isExiting ? "animate-btns-exit" : isBackExiting ? "animate-btns-exit-back" : direction === "forward" ? "animate-btns-enter-right" : "animate-btns-enter-left"
        }`}
      >
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
