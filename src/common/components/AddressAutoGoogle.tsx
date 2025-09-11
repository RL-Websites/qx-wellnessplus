import states from "@/data/state-list.json";
import { getBoundsForState } from "@/utils/getStateBounds";
import { Input } from "@mantine/core";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { IAutoCompleteAddrOutput } from "../api/models/interfaces/Address.model";

interface AddressAutoGooglePropTypes {
  address: string;
  onSelect: (outputAddress: IAutoCompleteAddrOutput) => void;
  isError: boolean;
  isReadonly?: boolean;
  isDisabled?: boolean;
  classname?: string;
  state?: string;
}

const AddressAutoGoogle = forwardRef(function ({ address, onSelect, isError, isReadonly = false, isDisabled = false, classname = "", state }: AddressAutoGooglePropTypes, ref) {
  const [value, setValue] = useState(address || "");
  const [output, setOutput] = useState<IAutoCompleteAddrOutput>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Create or recreate Autocomplete when state changes
  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google) return;

    // Destroy old instance
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    const options: google.maps.places.AutocompleteOptions = {
      types: [],
      componentRestrictions: { country: "us" },
    };

    if (state) {
      const selectedState = states.find((item) => item.StateName === state);
      const stateBounds = getBoundsForState(selectedState?.StateName);
      if (stateBounds) {
        options.bounds = stateBounds;
        options.strictBounds = true;
      }
    }

    // Initialize new Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place) {
        getAddressProps(place);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [state]);

  useEffect(() => {
    initAutocomplete();
  }, [initAutocomplete]);

  useEffect(() => {
    if (address) {
      setValue(address);
    }
  }, [address]);

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

    if (addressObj.geometry && addressObj.geometry.location) {
      const lat = addressObj.geometry.location.lat();
      const lng = addressObj.geometry.location.lng();
      outputAddress.latitude = lat;
      outputAddress.longitude = lng;
    }

    // console.log(addressObj);

    for (let i = 0; i < addressObj.address_components.length; i++) {
      const componentTypes = addressObj.address_components[i].types;
      for (let j = 0; j < componentTypes.length; j++) {
        const addressComponent = componentTypes[j];
        if (addressComponentNames[addressComponent]) {
          const component = addressObj.address_components[i] || null;
          switch (addressComponent) {
            case "locality":
              outputAddress.city = component.long_name;
              break;
            case "administrative_area_level_1":
              outputAddress.state = component.long_name;
              outputAddress.state_short = component.short_name;
              break;
            case "postal_code":
              outputAddress.zip_code = component.long_name;
              break;
            case "street_number":
              outputAddress.street_number = component.long_name;
              break;
            case "route":
              outputAddress.route = component.long_name;
              break;
            case "area_2":
              outputAddress.area_2 = component.long_name;
              break;
            case "country":
              outputAddress.country = component.short_name;
              break;
          }
        }
      }
    }
    // console.log(outputAddress);

    const formattedAddress =
      (outputAddress?.street_number || "") + (outputAddress?.route ? ` ${outputAddress?.route}` : "") + (outputAddress?.area_2 ? ` ${outputAddress?.area_2}` : "");
    // +
    // (outputAddress?.city ? ` ${outputAddress?.city}` : "") +
    // (outputAddress?.state_short ? ` ${outputAddress?.state_short}` : "") +
    // (outputAddress?.zip_code ? ` ${outputAddress?.zip_code}` : "") +
    // (outputAddress?.country ? ` ${outputAddress?.country?.toUpperCase()}` : "");
    setValue(formattedAddress);
    outputAddress.address = formattedAddress;
    onSelect({ ...outputAddress });
    setOutput({ ...outputAddress });
    return { ...outputAddress };
  };

  const handleOnChange = (val: string) => {
    setValue(val);
    if (output !== undefined) {
      const newOutputAddress = { ...output, address: val };
      setOutput(() => ({ ...newOutputAddress }));
      onSelect(newOutputAddress);
    }

    // else {
    //   const newOutputAddress = { address: val };
    //   onSelect(newOutputAddress);
    // }
  };

  return (
    <Input
      key={state || "default-autocomplete"}
      type="text"
      ref={(el) => {
        inputRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }}
      autoComplete="off"
      placeholder=" "
      value={value}
      onChange={(ev) => handleOnChange(ev.target.value)}
      error={isError}
      readOnly={isReadonly}
      disabled={isDisabled}
      aria-autocomplete="none"
      classNames={{
        input: classname,
      }}
    />
  );
});

export default AddressAutoGoogle;
