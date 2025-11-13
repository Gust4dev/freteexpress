import AsyncSelect from "react-select/async";
import { useAuth } from "../hooks/useAuth";
import { searchCities, CityOption } from "../api/utils";

let debounceTimer: number;

const loadOptions = (
  inputValue: string,
  callback: (options: CityOption[]) => void
) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchCities(inputValue).then((options) => {
      callback(options);
    });
  }, 300);
};

export default function CityAsyncSelect({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: CityOption | null;
  onChange: (option: CityOption | null) => void;
}) {
  const { darkMode } = useAuth();

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      placeholder={placeholder}
      value={value}
      onChange={(option) => onChange(option as CityOption | null)}
      isClearable
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          borderColor: darkMode ? "#374151" : "#e5e7eb",
          borderRadius: "0.5rem",
          boxShadow: state.isFocused
            ? "0 0 0 4px rgba(37, 99, 235, 0.08)"
            : "none",
          "&:hover": {
            borderColor: darkMode ? "#4b5563" : "#d1d5db",
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          borderRadius: "0.5rem",
          zIndex: 20,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? darkMode
              ? "#374151"
              : "#f3f4f6"
            : "transparent",
          color: darkMode ? "#e5e7eb" : "#1f2937",
          "&:active": {
            backgroundColor: darkMode ? "#4b5563" : "#e5e7eb",
          },
        }),
        input: (base) => ({
          ...base,
          color: darkMode ? "#e5e7eb" : "#1f2937",
        }),
        singleValue: (base) => ({
          ...base,
          color: darkMode ? "#e5e7eb" : "#1f2937",
        }),
        placeholder: (base) => ({
          ...base,
          color: darkMode ? "#6b7280" : "#9ca3af",
        }),
      }}
    />
  );
}