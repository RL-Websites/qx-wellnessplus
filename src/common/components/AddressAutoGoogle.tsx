import { Input } from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { IAutoCompleteAddrOutput } from "../api/models/interfaces/Address.model";

interface AddressAutoGooglePropTypes {
  address: string;
  onSelect: (outputAddress: IAutoCompleteAddrOutput) => void;
  isError: boolean;
  isReadonly?: boolean;
  isDisabled?: boolean;
  classname?: string;
}

const AddressAutoGoogle = forwardRef(function ({ address, onSelect, isError, isReadonly = false, isDisabled = false, classname = "" }: AddressAutoGooglePropTypes, ref) {
  const { ref: fieldRef, autocompleteRef } = usePlacesWidget({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      getAddressProps(place);
    },
    options: {
      types: [],
    },
  });

  useEffect(() => {
    if (address) {
      setValue(address);
      // autocompleteRef.current.setPlace(address);
    }
  }, [address]);

  const [value, setValue] = useState("");
  // const [selectedAddrObj, setSelectedAddrObj] = useState();

  // useEffect(() => {
  //   console.log(selectedAddrObj);
  // }, [selectedAddrObj]);

  const getAddressProps = (addressObj) => {
    const addressComponentNames = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_1: "short_name",
      country: "short_name",
      postal_code: "short_name",
    };

    const outputAddress: IAutoCompleteAddrOutput = {} as IAutoCompleteAddrOutput;
    outputAddress.address = addressObj.formatted_address;
    setValue(addressObj.formatted_address);
    for (let i = 0; i < addressObj.address_components.length; i++) {
      const addressComponent = addressObj.address_components[i].types[0];
      if (addressComponentNames[addressComponent]) {
        const componentValue = addressObj.address_components[i].long_name || null;
        switch (addressComponent) {
          case "locality":
            outputAddress.city = componentValue;
            break;
          case "administrative_area_level_1":
            outputAddress.state = componentValue;
            break;
          case "postal_code":
            outputAddress.zip_code = componentValue;
            break;
        }
      }
    }
    onSelect(outputAddress);
    return outputAddress;
  };

  return (
    <Input
      type="text"
      ref={fieldRef}
      autoComplete="off"
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      error={isError}
      readOnly={isReadonly}
      disabled={isDisabled}
      autocomplete="new-password"
      placeholder="Enter your address"
      aria-autocomplete="none"
      classNames={{
        input: classname,
      }}
    />
  );
});

export default AddressAutoGoogle;
