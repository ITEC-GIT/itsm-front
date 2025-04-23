import React, { useEffect, useState } from "react";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { SaveButton } from "../../components/form/stepsButton";

const SettingSection = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="col-md-6">
    <div className="p-4 border rounded shadow-sm h-100">
      <h5 className="fw-bold mb-1">{title}</h5>
      {subtitle && <p className="text-muted mb-3">{subtitle}</p>}
      {children}
    </div>
  </div>
);

const SettingsPage = () => {
  const [isModified, setIsModified] = useState(false);

  const ThemeOptions = ["Light", "Dark"].map((lang, index) => ({
    label: lang,
    value: index,
  }));
  const languageOptions = ["English", "French", "Portuguese"].map(
    (lang, index) => ({
      label: lang,
      value: index,
    })
  );

  const countries = [
    { name: "Angola", code: "AO", lat: -11.2027, lng: 17.8739 },
  ];

  const countryOptions = countries.map((country, index) => ({
    label: country.name,
    value: index,
  }));

  const [theme, setTheme] = useState(ThemeOptions[0]);

  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [selectedCountryDetails, setSelectedCountryDetails] = useState(
    countries[0]
  );

  const [language, setLanguage] = useState(languageOptions[2]);

  useEffect(() => {
    const filteredCountry = countries.filter(
      (country: any) => country.name === selectedCountry.label
    )[0];
    console.log(filteredCountry);
    setSelectedCountryDetails(filteredCountry);
  }, [selectedCountry]);

  useEffect(() => {
    const isThemeChanged = theme.value !== ThemeOptions[0].value;
    const isLanguageChanged = language.value !== languageOptions[2].value;
    const isCountryChanged = selectedCountry.value !== countryOptions[0].value;

    setIsModified(isThemeChanged || isLanguageChanged || isCountryChanged);
  }, [theme, language, selectedCountry]);

  const handleSave = () => {
    setIsModified(false);
  };

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div className="col-12">
            <div className="symbol symbol-50px ">
              <h2>⚙️ Settings</h2>
              <span className="text-muted fs-6">
                Create and manage user roles and permissions
              </span>
            </div>

            <div className="row g-4">
              <SettingSection
                title="🌗 Theme"
                subtitle="Choose interface style"
              >
                <CustomReactSelect
                  options={ThemeOptions}
                  value={theme}
                  onChange={(selected) =>
                    setTheme(selected as (typeof ThemeOptions)[0])
                  }
                  isClearable={false}
                />
              </SettingSection>

              <SettingSection
                title="🌐 Language"
                subtitle="Select your preferred language"
              >
                <CustomReactSelect
                  options={languageOptions}
                  value={language}
                  onChange={(selected) => setLanguage(selected)}
                  isClearable={false}
                />
              </SettingSection>

              <SettingSection
                title="🌍 Country"
                subtitle="Set your country and location"
              >
                <CustomReactSelect
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(selected) => setSelectedCountry(selected)}
                  isClearable={false}
                />

                <div className="row mt-5">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      📍 Latitude
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedCountryDetails.lat}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      📍 Longitude
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedCountryDetails.lng}
                      readOnly
                    />
                  </div>
                </div>
              </SettingSection>
            </div>
          </div>
          {isModified && (
            <div className="d-flex justify-content-end mt-4">
              <SaveButton onClick={handleSave} />
            </div>
          )}
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

const SettingsPageWrapper = () => {
  return <SettingsPage />;
};

export { SettingsPageWrapper };
