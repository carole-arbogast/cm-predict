import React from "react";
import styled from "styled-components";
import CustomRadioField from "./CustomRadioField";
import CustomNumberField from "./CustomNumberField";
import CustomCheckboxField from "./CustomCheckboxField";

import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import CustomSelectField from "./CustomSelectField";

const Schema = yup.object().shape({
  cityType: yup
    .string()
    .matches(/(RE|Pandé)/)
    .required("Champ requis"),
  job: yup
    .string()
    .matches(/ermite|capuche|autre/)
    .required("Champ requis"),
  previousNights: yup
    .number()
    .min(0, "Le nombre doit être compris entre 0 et 8")
    .max(8, "Le nombre doit être compris entre 0 et 8")
    .required("Champ requis"),
  pro: yup.bool(),
  distance: yup
    .number()
    .min(1, "Le nombre doit être compris entre 1 et 28")
    .max(28, "Le nombre doit être compris entre 1 et 28")
    .required("Champ requis"),
  zombies: yup.number().min(0, "Le nombre ne peut pas être négatif").required("Champ requis"),
  building: yup.string(),
  improvements: yup
    .number()
    .min(0, "Le nombre doit être compris entre 0 et 10")
    .max(10, "Le nombre doit être compris entre 0 et 10"),
  od: yup
    .number()
    .min(0, "Le nombre doit être compris entre 0 et 6")
    .max(6, "Le nombre doit être compris entre 0 et 6"),
  campers: yup
    .number()
    .min(0, "Le nombre doit être compris entre 0 et 6")
    .max(6, "Le nombre doit être compris entre 0 et 6"),
  tent: yup
    .number()
    .min(0, "Le nombre doit être compris entre 0 et 9")
    .max(9, "Le nombre doit être compris entre 0 et 9"),
  tomb: yup.bool(),
  night: yup.bool(),
  lighthouse: yup.bool(),
  hood: yup.bool(),
  devastation: yup.bool(),
});

interface Building {
  name: string;
  anywhere?: boolean;
  bonus: number;
}

interface FormValues {
  cityType: "RE" | "Pandé";
  job: "ermite" | "capuche" | "autre";
  previousNights: number;
  pro: boolean;
  distance: number;
  zombies: number;
  building: string;
  improvements: number;
  od: number;
  campers: number;
  tent: number;
  tomb: boolean;
  night: boolean;
  lighthouse: boolean;
  hood: boolean;
  devastation: boolean;
}

interface Props {
  onSubmit: (values: FormValues) => void;
  filteredBuildings: Building[];
  initialValues: FormValues;
  currentJob: "ermite" | "capuche" | "autre";
}

export function CampingPredictForm({
  onSubmit,
  filteredBuildings,
  initialValues,
  currentJob,
}: Props) {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={Schema}
    >
      {({ handleChange, submitForm, values, setFieldValue }) => {
        const handleNumberChange = (name: string, option: "dec" | "inc") => {
          if (option === "dec") {
            setFieldValue(name, values[name] - 1);
          } else {
            setFieldValue(name, values[name] + 1);
          }
          submitForm();
        };
        return (
          <Form
            onChange={(e) => {
              handleChange(e);
              submitForm();
            }}
          >
            <SectionHeader>Général</SectionHeader>

            <FormSection>
              <FieldGroup>
                <Label>Type de ville</Label>
                <div>
                  <CustomRadioField
                    name="cityType"
                    img="/images/r_explor.gif"
                    value="RE"
                    isChecked={values.cityType === "RE"}
                  ></CustomRadioField>

                  <CustomRadioField
                    name="cityType"
                    img="/images/r_cannib.gif"
                    value="Pandé"
                    isChecked={values.cityType === "Pandé"}
                  ></CustomRadioField>
                </div>
              </FieldGroup>
              <ErrorMessage component={WarningMessage} name="cityType"></ErrorMessage>

              <FieldGroup>
                <Label>Métier</Label>
                <div>
                  <CustomRadioField
                    name="job"
                    img="/images/r_jermit.gif"
                    value="ermite"
                    label="Ermite"
                    isChecked={values.job === "ermite"}
                  ></CustomRadioField>

                  <CustomRadioField
                    name="job"
                    img="/images/item_vest_on.gif"
                    value="capuche"
                    label="Éclaireur"
                    isChecked={values.job === "capuche"}
                  ></CustomRadioField>

                  <CustomRadioField
                    name="job"
                    img="/images/class_1.gif"
                    value="autre"
                    label="Autre"
                    isChecked={values.job === "autre"}
                  ></CustomRadioField>
                </div>
              </FieldGroup>
              <ErrorMessage component={WarningMessage} name="job"></ErrorMessage>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/r_camp.gif"></HordesIcon> Camping effectués
                </Label>
                <CustomNumberField
                  name="previousNights"
                  min="0"
                  max="8"
                  onChange={handleNumberChange}
                />

                <ErrorMessage component={WarningMessage} name="previousNights"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/r_cmplst.gif"></HordesIcon> Campeur Pro
                </Label>
                <CustomCheckboxField
                  name="pro"
                  isChecked={values.pro === true}
                ></CustomCheckboxField>
                <ErrorMessage component={WarningMessage} name="pro"></ErrorMessage>
              </FieldGroup>
            </FormSection>
            <SectionHeader>Case de camping</SectionHeader>

            <FormSection>
              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/item_tagger.gif"></HordesIcon> Distance (km)
                </Label>
                <CustomNumberField name="distance" min="1" max="28" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="distance"></ErrorMessage>
              </FieldGroup>
              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/small_castle.gif"></HordesIcon> Bâtiment
                </Label>
                <CustomSelectField
                  options={filteredBuildings.map((b) => b.name)}
                  onFieldChange={(value) => {
                    setFieldValue("building", value);
                    submitForm();
                  }}
                  value={values.building}
                />
                <ErrorMessage component={WarningMessage} name="building"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/r_dcity.gif"></HordesIcon>Nombre de zombies
                </Label>
                <CustomNumberField name="zombies" min="0" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="zombies"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/small_pa.gif"></HordesIcon>Nombre d&apos;améliorations
                </Label>
                <CustomNumberField
                  name="improvements"
                  min="0"
                  max="10"
                  onChange={handleNumberChange}
                />

                <ErrorMessage component={WarningMessage} name="improvements"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/item_door.gif"></HordesIcon>Nombre d&apos;ODs
                </Label>
                <CustomNumberField name="od" min="0" max="6" onChange={handleNumberChange} />

                <ErrorMessage component={WarningMessage} name="od"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/status_tired.gif"></HordesIcon>Nombre de campeurs cachés
                </Label>
                <CustomNumberField name="campers" min="0" max="6" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="campers"></ErrorMessage>
              </FieldGroup>
            </FormSection>
            <SectionHeader>Bonus/Malus</SectionHeader>

            <FormSection>
              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/item_smelly_meat.gif"></HordesIcon>Tente/pelure
                </Label>
                <CustomNumberField name="tent" min="0" max="9" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="tent"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/item_pelle.gif"></HordesIcon>Tombe
                </Label>
                <CustomCheckboxField
                  name="tomb"
                  isChecked={values.tomb === true}
                ></CustomCheckboxField>
                <ErrorMessage component={WarningMessage} name="tomb"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/small_camp.gif"></HordesIcon>Nuit
                </Label>
                <CustomCheckboxField
                  name="night"
                  isChecked={values.night === true}
                ></CustomCheckboxField>
                <ErrorMessage component={WarningMessage} name="night"></ErrorMessage>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/small_lighthouse.gif"></HordesIcon>Phare
                </Label>
                <CustomCheckboxField
                  name="lighthouse"
                  isChecked={values.lighthouse === true}
                ></CustomCheckboxField>
                <ErrorMessage component={WarningMessage} name="lighthouse"></ErrorMessage>
              </FieldGroup>

              {currentJob === "capuche" && (
                <FieldGroup>
                  <Label>Mode Furtif (si capuche active)</Label>
                  <CustomCheckboxField
                    name="hood"
                    isChecked={values.hood === true}
                  ></CustomCheckboxField>
                  <ErrorMessage component={WarningMessage} name="hood"></ErrorMessage>
                </FieldGroup>
              )}

              <FieldGroup>
                <Label>
                  <HordesIcon src="/images/item_out_def_broken.gif"></HordesIcon>Ville dévastée
                </Label>
                <CustomCheckboxField
                  name="devastation"
                  isChecked={values.devastation === true}
                ></CustomCheckboxField>
                <ErrorMessage component={WarningMessage} name="devastation"></ErrorMessage>
              </FieldGroup>
            </FormSection>
          </Form>
        );
      }}
    </Formik>
  );
}

const SectionHeader = styled.h2`
  margin: 0.75rem 0;
`;
const FieldGroup = styled.div`
  margin: 0.75rem 2.5rem 0.75rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  display: inline-block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const WarningMessage = styled.p`
  color: red;
`;

const FormSection = styled.div`
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  background: rgba(0, 0, 0, 0.1);
`;

const HordesIcon = styled.img`
  margin-right: 0.25rem;
`;

export default CampingPredictForm;
