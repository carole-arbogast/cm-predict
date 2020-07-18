import React from "react";
import styled from "styled-components";
import CustomRadioField from "./CustomRadioField";
import CustomNumberField from "./CustomNumberField";
import CustomCheckboxField from "./CustomCheckboxField";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

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
        };
        return (
          <Form
            onChange={(e) => {
              handleChange(e);
              submitForm();
            }}
          >
            <FormSection>
              <h2>Général</h2>

              <label>Type de ville</label>
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
              <ErrorMessage component={WarningMessage} name="cityType"></ErrorMessage>

              <label>Métier</label>
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
              <ErrorMessage component={WarningMessage} name="job"></ErrorMessage>

              <div>
                <HordesIcon src="/images/r_camp.gif"></HordesIcon>
                <label>Camping effectués</label>
                <CustomNumberField
                  name="previousNights"
                  min="0"
                  max="8"
                  onChange={handleNumberChange}
                />

                <ErrorMessage component={WarningMessage} name="previousNights"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/r_cmplst.gif"></HordesIcon>
                <label>Campeur Pro</label>
                <CustomCheckboxField
                  name="pro"
                  isChecked={values.pro === true}
                ></CustomCheckboxField>
                <ErrorMessage component={WarningMessage} name="pro"></ErrorMessage>
              </div>
            </FormSection>

            <FormSection>
              <h2>Case de camping</h2>
              <div>
                <HordesIcon src="/images/item_tagger.gif"></HordesIcon>
                <label>Distance (km)</label>
                <CustomNumberField name="distance" min="1" max="28" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="distance"></ErrorMessage>
              </div>
              <div>
                <HordesIcon src="/images/small_castle.gif"></HordesIcon>
                <label>Bâtiment</label>
                <Field component="select" name="building">
                  <option value=""> -- </option>
                  {filteredBuildings.map((building) => (
                    <option key={building.name} value={building.name}>
                      {building.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={WarningMessage} name="building"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/r_dcity.gif"></HordesIcon> <label>Nombre de zombies</label>
                <CustomNumberField name="zombies" min="0" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="zombies"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/small_pa.gif"></HordesIcon>
                <label>Nombre d&apos;améliorations</label>
                <CustomNumberField
                  name="improvements"
                  min="0"
                  max="10"
                  onChange={handleNumberChange}
                />

                <ErrorMessage component={WarningMessage} name="improvements"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/item_door.gif"></HordesIcon>
                <label>Nombre d&apos;ODs</label>
                <CustomNumberField name="od" min="0" max="6" onChange={handleNumberChange} />

                <ErrorMessage component={WarningMessage} name="od"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/status_tired.gif"></HordesIcon>
                <label>Nombre de campeurs cachés</label>
                <CustomNumberField name="campers" min="0" max="6" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="campers"></ErrorMessage>
              </div>
            </FormSection>
            <FormSection>
              <h2>Bonus/Malus</h2>

              <div>
                <HordesIcon src="/images/item_smelly_meat.gif"></HordesIcon>
                <label>Toile de tente/pelure de peau</label>
                <CustomNumberField name="tent" min="0" max="9" onChange={handleNumberChange} />
                <ErrorMessage component={WarningMessage} name="tent"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/item_pelle.gif"></HordesIcon>
                <label>Tombe</label>
                <Field type="checkbox" name="tomb"></Field>
                <ErrorMessage component={WarningMessage} name="tomb"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/small_camp.gif"></HordesIcon>
                <label>Nuit</label>
                <Field type="checkbox" name="night"></Field>
                <ErrorMessage component={WarningMessage} name="night"></ErrorMessage>
              </div>

              <div>
                <HordesIcon src="/images/small_lighthouse.gif"></HordesIcon>
                <label>Phare</label>
                <Field type="checkbox" name="lighthouse"></Field>
                <ErrorMessage component={WarningMessage} name="lighthouse"></ErrorMessage>
              </div>

              {currentJob === "capuche" && (
                <div>
                  <label>Mode Furtif (si capuche active)</label>
                  <Field type="checkbox" name="hood"></Field>
                  <ErrorMessage component={WarningMessage} name="hood"></ErrorMessage>
                </div>
              )}

              <div>
                <HordesIcon src="/images/item_out_def_broken.gif"></HordesIcon>
                <label>Ville dévastée</label>
                <Field type="checkbox" name="devastation"></Field>
                <ErrorMessage component={WarningMessage} name="devastation"></ErrorMessage>
              </div>
            </FormSection>
          </Form>
        );
      }}
    </Formik>
  );
}

const WarningMessage = styled.p`
  color: red;
`;

const FormSection = styled.div`
  border-bottom: 1px solid lightgray;
  padding: 1rem;
`;

const HordesIcon = styled.img`
  margin-right: 0.25rem;
`;

export default CampingPredictForm;
