import React from "react";
import styled from "styled-components";
import CustomRadioField from "./CustomRadioField";
import CustomNumberField from "./CustomNumberField";
import CustomCheckboxField from "./CustomCheckboxField";

import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import CustomSelectField from "./CustomSelectField";
import get from "lodash/get";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";

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
  defence: {
    improvements: number;
    od: number;
    previous: number;
  };
  campers: number;
  tent: number;
  tomb: boolean;
  night: boolean;
  lighthouse: boolean;
  hood: boolean;
  devastation: boolean;
  previousDefence?: number;
}

interface DefenceInfo {
  maxDefence: number;
  currentDefence: number;
  od: number;
  improvements: number;
}

interface Props {
  onSubmit: (values: FormValues) => void;
  filteredBuildings: Building[];
  initialValues: FormValues;
  currentJob: "ermite" | "capuche" | "autre";
  defenceInfo: DefenceInfo;
}

export function CampingPredictForm({
  onSubmit,
  filteredBuildings,
  initialValues,
  currentJob,
  defenceInfo,
}: Props) {
  const Schema = React.useMemo(
    () =>
      yup.object().shape({
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
          .min(0, "Le nombre de campings effectués doit être entre 0 et 8")
          .max(8, "Le nombre de campings effectués doit être entre 0 et 8")
          .required("Champ requis"),
        pro: yup.bool(),
        distance: yup
          .number()
          .min(1, "La distance de la case doit être comprise entre 1 et 28")
          .max(28, "La distance de la case doit être comprise entre 1 et 28")
          .required("Champ requis"),
        zombies: yup
          .number()
          .min(0, "Le nombre de zombies ne peut pas être négatif")
          .required("Champ requis"),
        building: yup.string(),
        defence: yup.object().shape({
          improvements: yup
            .number()
            .min(0, "Le nombre d'améliorations ne peut pas être négatif")
            .max(10, "Il ne peut pas y avoir plus de 10 améliorations simples."),
          od: yup.number().min(0, "Le nombre d'ODs ne peut pas être négatif"),
          previous: yup
            .number()
            .min(0, "Le nombre d'aménagements de la veille ne peut pas être négatif")
            .max(11.6, "Une case ne peut pas dépasser 11.6 points d'améliorations au total."),
        }),
        campers: yup
          .number()
          .min(0, "Le nombre de campeurs doit être compris entre 0 et 6")
          .max(6, "Le nombre de campeurs doit être compris entre 0 et 6"),
        tent: yup
          .number()
          .min(0, "Le nombre de tentes doit être compris entre 0 et 9")
          .max(9, "Le nombre de tentes doit être compris entre 0 et 9"),
        tomb: yup.bool(),
        night: yup.bool(),
        lighthouse: yup.bool(),
        hood: yup.bool(),
        devastation: yup.bool(),
      }),
    []
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={Schema}
    >
      {({ handleChange, submitForm, values, setFieldValue, errors, setErrors, validateForm }) => {
        const handleNumberChange = async (name: string, option: "dec" | "inc", step?: string) => {
          const newFormValues = cloneDeep(values);
          if (option === "dec") {
            const newValue = step
              ? Math.round((get(values, name) - Number(step)) * 10) / 10
              : get(values, name) - 1;

            set(newFormValues, name, newValue);
            setFieldValue(name, newValue);
          } else {
            const newValue = step
              ? Math.round((get(values, name) + Number(step)) * 10) / 10
              : get(values, name) + 1;
            set(newFormValues, name, newValue);
            setFieldValue(name, newValue);
          }
          const errors = await validateForm(newFormValues);
          onSubmit(newFormValues);
          setErrors(errors);
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
              <FlexWrapper wrap>
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
                </FieldGroup>

                <FieldGroup>
                  <Label>
                    <HordesIcon src="/images/r_cmplst.gif"></HordesIcon> Campeur Pro
                  </Label>
                  <CustomCheckboxField
                    name="pro"
                    isChecked={values.pro === true}
                  ></CustomCheckboxField>
                </FieldGroup>
              </FlexWrapper>
              <ErrorMessage component={WarningMessage} name="cityType"></ErrorMessage>
              <ErrorMessage component={WarningMessage} name="pro"></ErrorMessage>
              {errors && errors.previousNights && (
                <WarningMessage>{errors.previousNights}</WarningMessage>
              )}
            </FormSection>
            <SectionHeader>Case de camping</SectionHeader>

            <FormSection>
              <FlexWrapper wrap>
                <FieldGroup>
                  <Label>
                    <HordesIcon src="/images/item_tagger.gif"></HordesIcon> Distance (km)
                  </Label>
                  <CustomNumberField
                    name="distance"
                    min="1"
                    max="28"
                    onChange={handleNumberChange}
                  />
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
                </FieldGroup>

                <FieldGroup>
                  <Label>
                    <HordesIcon src="/images/status_tired.gif"></HordesIcon>Nombre de campeurs
                    cachés
                  </Label>
                  <CustomNumberField name="campers" min="0" max="6" onChange={handleNumberChange} />
                </FieldGroup>
              </FlexWrapper>
              {errors && errors.distance && <WarningMessage>{errors.distance}</WarningMessage>}
              {errors && errors.campers && <WarningMessage>{errors.campers}</WarningMessage>}
              {errors && errors.zombies && <WarningMessage>{errors.zombies}</WarningMessage>}
            </FormSection>

            <SectionHeader>Améliorations</SectionHeader>

            <FormSection>
              <FlexWrapper align="center">
                <div>
                  <FieldGroup>
                    <Label>
                      <HordesIcon src="/images/small_pa.gif"></HordesIcon>Nombre
                      d&apos;améliorations
                    </Label>
                    <CustomNumberField
                      name="defence.improvements"
                      min="0"
                      onChange={handleNumberChange}
                    />
                    {get(errors, "defence.improvements") && (
                      <WarningMessage>{errors.defence.improvements}</WarningMessage>
                    )}
                  </FieldGroup>

                  <FieldGroup>
                    <Label>
                      <HordesIcon src="/images/item_door.gif"></HordesIcon>Nombre d&apos;ODs
                    </Label>
                    <CustomNumberField name="defence.od" min="0" onChange={handleNumberChange} />
                    {get(errors, "defence.od") && (
                      <WarningMessage>{errors.defence.od}</WarningMessage>
                    )}
                  </FieldGroup>

                  {values.previousNights > 0 && (
                    <FieldGroup>
                      <Label>
                        <HordesIcon src="/images/h_city_up.gif"></HordesIcon>Aménagements de la
                        veille
                      </Label>
                      <CustomNumberField
                        name="defence.previous"
                        min="0"
                        max="11.6"
                        step="0.1"
                        onChange={handleNumberChange}
                      />
                      {get(errors, "defence.previous") && (
                        <WarningMessage>{errors.defence.previous}</WarningMessage>
                      )}
                    </FieldGroup>
                  )}
                </div>

                <DefenceRecap>
                  Total :{" "}
                  <Score warning={defenceInfo.currentDefence > defenceInfo.maxDefence}>
                    {defenceInfo.currentDefence}{" "}
                  </Score>{" "}
                  /{Math.round(defenceInfo.maxDefence * 10) / 10}
                </DefenceRecap>
              </FlexWrapper>

              {errors && errors.defence === "string" && (
                <WarningMessage>{errors.defence}</WarningMessage>
              )}
              {defenceInfo.currentDefence > defenceInfo.maxDefence && (
                <WarningMessage>Vous avez trop d&apos;améliorations ou d&apos;OD. </WarningMessage>
              )}

              <p>
                <img src="/images/h_warning.gif" alt="warning"></img> Les ODs doivent être placés
                <em> après</em> les améliorations.
              </p>
            </FormSection>

            <SectionHeader>Bonus/Malus</SectionHeader>

            <FormSection>
              <FlexWrapper wrap>
                <FieldGroup>
                  <Label>
                    <HordesIcon src="/images/item_smelly_meat.gif"></HordesIcon>Tente/pelure
                  </Label>
                  <CustomNumberField name="tent" min="0" max="9" onChange={handleNumberChange} />
                </FieldGroup>

                <FieldGroup>
                  <Label>
                    <HordesIcon src="/images/item_pelle.gif"></HordesIcon>Tombe
                  </Label>
                  <CustomCheckboxField
                    name="tomb"
                    isChecked={values.tomb === true}
                  ></CustomCheckboxField>
                </FieldGroup>

                <FieldGroup>
                  <Label>
                    <HordesIcon src="/images/small_camp.gif"></HordesIcon>Nuit
                  </Label>
                  <CustomCheckboxField
                    name="night"
                    isChecked={values.night === true}
                  ></CustomCheckboxField>
                </FieldGroup>

                <FieldGroup>
                  <Label>
                    <HordesIcon src="/images/small_lighthouse.gif"></HordesIcon>Phare
                  </Label>
                  <CustomCheckboxField
                    name="lighthouse"
                    isChecked={values.lighthouse === true}
                  ></CustomCheckboxField>
                </FieldGroup>

                {currentJob === "capuche" && (
                  <FieldGroup>
                    <Label>Mode Furtif (si capuche active)</Label>
                    <CustomCheckboxField
                      name="hood"
                      isChecked={values.hood === true}
                    ></CustomCheckboxField>
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
                </FieldGroup>
              </FlexWrapper>
              <ErrorMessage component={WarningMessage} name="devastation"></ErrorMessage>
              <ErrorMessage component={WarningMessage} name="hood"></ErrorMessage>
              <ErrorMessage component={WarningMessage} name="lighthouse"></ErrorMessage>
              <ErrorMessage component={WarningMessage} name="night"></ErrorMessage>
              <ErrorMessage component={WarningMessage} name="tomb"></ErrorMessage>
              {errors && errors.tent && <WarningMessage>{errors.tent}</WarningMessage>}
            </FormSection>
          </Form>
        );
      }}
    </Formik>
  );
}

type Alignments = "center" | "flex-start" | "flex-end" | "space-around" | "space-between";
type Direction = "column" | "row";

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
  color: #fb8f2d;
`;

const FormSection = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
`;

const HordesIcon = styled.img`
  margin-right: 0.25rem;
`;

const Score = styled.span<{ warning?: boolean }>`
  color: ${(props) => (props.warning ? "#fb8f2d" : "inherit")};
`;

const FlexWrapper = styled.div<{
  direction?: Direction;
  justify?: Alignments;
  align?: Alignments;
  wrap?: boolean;
}>`
  display: flex;
  justify-content: ${(props) => (props.justify ? props.justify : "flex-start")};
  align-items: ${(props) => (props.align ? props.align : "flex-start")};
  flex-direction: ${(props) => (props.direction ? props.direction : "row")};
  flex-wrap: ${(props) => (props.wrap ? "wrap" : "no-wrap")};
`;

const DefenceRecap = styled.div`
  font-weight: 600;
  background: rgba(41, 48, 66, 1);
  padding: 1rem;
  border: 1px solid grey;
`;

export default CampingPredictForm;
