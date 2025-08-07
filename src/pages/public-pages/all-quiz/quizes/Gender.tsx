"use client";

import { Button, Radio, Stack, Text } from "@mantine/core";
import { useState } from "react";

const data = [{ name: "Male" }, { name: "Female" }];

const Gender = () => {
  const [value, setValue] = useState("");

  return (
    <div className="lg:pt-16 md:pt-10 pt-4 px-4">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>
      <h4 className="font-poppins font-semibold text-foreground text-center text-3xl mt-12">May I ask your preferred gender identity?</h4>
      <div className="card-common-width mx-auto">
        <form className="w-full mt-6">
          <Radio.Group
            value={value}
            onChange={setValue}
          >
            <Stack
              gap="sm"
              justify="center"
              align="center"
              className="flex-row gap-4"
            >
              {data.map((item) => {
                const isSelected = value === item.name;

                return (
                  <Radio.Card
                    key={item.name}
                    value={item.name}
                    radius="md"
                    className="dml-radiobtn"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Text
                        className="text-foreground"
                        fw={500}
                      >
                        {item.name}
                      </Text>
                      {/* {isSelected && <IconCheck size={16} />} */}
                    </div>
                  </Radio.Card>
                );
              })}
            </Stack>
          </Radio.Group>

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
