import { Avatar, Button, Combobox, Loader, ScrollArea, TextInput, useCombobox } from "@mantine/core";
import { useRef, useState } from "react";

function getAsyncData(searchQuery: string, signal: AbortSignal) {
  const searchItem = [
    { name: "Jenna Ortega", email: "jennaortega@gmail.com" },
    { name: "Jean Paul", email: "jeanpaul@gmail.com" },
    { name: "Markos Jeremy Linch", email: "jeremylinch@gmail.com" },
    { name: "Jefferson Cole", email: "jeffersoncole@gmail.com" },
    { name: "Jenine Robinson", email: "jeninerobinson@gmail.com" },
    { name: "Yeasin arafat", email: "yeaisn3423@gmail.com" },
    { name: "Megan Fox", email: "meganfoxwe4@gmail.com" },
    { name: "Serna Wiliams", email: "sernawills34@gmail.com" },
  ];

  return new Promise<{ name: string; email: string }[]>((resolve, reject) => {
    signal.addEventListener("abort", () => {
      reject(new Error("Request aborted"));
    });

    setTimeout(() => {
      resolve(
        searchItem
          .filter(
            (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      );
    }, Math.random() * 1000);
  });
}

function highlightText(text: string, highlight: string) {
  if (!highlight) return text;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span
        key={index}
        className="font-bold"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

function CommonExistingPatient() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ name: string; email: string }[] | null>(null);
  const [value, setValue] = useState("");
  const [empty, setEmpty] = useState(false);
  const abortController = useRef<AbortController>();

  const fetchOptions = (query: string) => {
    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);

    getAsyncData(query, abortController.current.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
        setEmpty(result.length === 0);
        abortController.current = undefined;
      })
      .catch(() => {});
  };

  const options = (data || []).map((item) => (
    <Combobox.Option
      value={item.name}
      key={item.email}
    >
      <div className="grid grid-cols-2">
        <span className="text-fs-sm text-foreground">{highlightText(item.name, value)}</span>
        <span className="text-fs-sm text-foreground">{highlightText(item.email, value)}</span>
      </div>
    </Combobox.Option>
  ));

  return (
    <div className="max-w-[625px] mx-auto my-[100px]">
      <div className=" text-center">
        <h6 className="lg:h2 md:h3 sm:h4 pb-[30px] text-foreground">Search Existing Patient</h6>
      </div>
      <Combobox
        onOptionSubmit={(optionValue) => {
          setValue(optionValue);
          combobox.closeDropdown();
        }}
        withinPortal={false}
        store={combobox}
        classNames={{
          dropdown: "border-0 !shadow-dml-box-shadow p-0",
          option: "px-4 py-2",
        }}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Search by name or email"
            value={value}
            onChange={(event) => {
              setValue(event.currentTarget.value);
              fetchOptions(event.currentTarget.value);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => {
              combobox.openDropdown();
              if (data === null) {
                fetchOptions(value);
              }
            }}
            onBlur={() => combobox.closeDropdown()}
            rightSection={loading && <Loader size={18} />}
            leftSection={<i className="icon-search text-2xl/none"></i>}
            classNames={{
              input: "pl-12 !text-lg",
              section: "pl-4",
            }}
          />
        </Combobox.Target>

        <Combobox.Dropdown hidden={data === null}>
          {options.length > 0 ? (
            <>
              <div className="grid grid-cols-2 px-4 py-2 border-b border-grey-low">
                <span className="text-fs-xs">Name</span>
                <span className="text-fs-xs">email</span>
              </div>
              <ScrollArea.Autosize
                type="always"
                mah={200}
                scrollbarSize={6}
              >
                {options}
              </ScrollArea.Autosize>
            </>
          ) : (
            <Combobox.Empty>
              <div className="flex flex-col items-center py-10">
                <Avatar
                  src="/images/empty-combo.png"
                  size="80px"
                  radius="0"
                />
                <p className="text-fs-md text-foreground pt-4 pb-8">Sorry! No Result Found</p>
                <Button
                  size="sm-2"
                  px={30}
                >
                  Prescribe a New Patient
                </Button>
              </div>
            </Combobox.Empty>
          )}
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
}

export default CommonExistingPatient;
