import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { distanceInfo, hiddenCampers, bonusInfo, previousNights } from "../../data/general";
import buildings from "../../data/buildings.json";
import sum from "lodash/sum";
import get from "lodash/get";
import * as yup from 'yup';
import styled from "styled-components";

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

const Schema = yup.object().shape({
  cityType: yup.string().matches(/(RE|Pandé)/).required("Champ requis"),
  job: yup.string().matches(/ermite|capuche|autre/).required("Champ requis"), 
  previousNights: yup.number().min(0, "Le nombre doit être compris entre 0 et 8").max(8, "Le nombre doit être compris entre 0 et 8").required("Champ requis"),
  pro: yup.bool(),
  distance: yup.number().min(1, "Le nombre doit être compris entre 1 et 28").max(28, "Le nombre doit être compris entre 1 et 28").required("Champ requis"),
  zombies: yup.number().min(0, "Le nombre ne peut pas être négatif").required("Champ requis"),
  building: yup.string(),
  improvements: yup.number().min(0, "Le nombre doit être compris entre 0 et 10").max(10, "Le nombre doit être compris entre 0 et 8"),
  od: yup.number().min(0, "Le nombre doit être compris entre 0 et 5").max(5, "Le nombre doit être compris entre 0 et 5"),
  campers: yup.number().min(0, "Le nombre doit être compris entre 0 et 6").max(6, "Le nombre doit être compris entre 0 et 6"),
  tent: yup.number().min(0, "Le nombre doit être compris entre 0 et 9").max(9, "Le nombre doit être compris entre 0 et 9"),
  tomb: yup.bool(),
  night: yup.bool(),
  lighthouse: yup.bool(),
  hood: yup.bool(),
  devastation: yup.bool()
})

function Predict() {
  const [currentDistance, setCurrentDistance] = React.useState<number>(0);

  const filteredBuildings = buildings.filter((building) => {
    return (
      building.anywhere ||
      (currentDistance >= building.minDistance && currentDistance <= building.maxDistance)
    );
  });

  const initialValues: FormValues = {
    cityType: "RE",
    job: "autre",
    previousNights: 0,
    pro: false,
    distance: 1,
    zombies: 0,
    building: "",
    improvements: 0,
    od: 0,
    campers: 0,
    tent: 0,
    tomb: false,
    night: false,
    lighthouse: false,
    hood: false,
    devastation: false,
  };

  const calculateScore = (values: FormValues) => {
    const distance = get(distanceInfo.find((e) => e.km === values.distance), "bonus", 0);
    const zombies = values.hood ? -(0.6 * values.zombies) : -(1.4 * values.zombies);
    const od = 1.8 * values.od;
    const campers = hiddenCampers[values.campers];
    const improvements = values.improvements;
    const previousNightsMalus =
      values.previousNights > 0 && values.previousNights < 9
        ? previousNights.find((e) => e.nb === values.previousNights)[values.pro ? "cp" : "noob"]
        : 0;

    const currentBonusList = bonusInfo.filter((b) => values[b.name]);

    const buildingBonus = values.building
      ? buildings.find((b) => b.name === values.building).bonus
      : 0;

    const cityType = values.cityType === "Pandé" ? -10 : 0;

    const totalBonus = currentBonusList.reduce((acc, next) => {
      if (typeof values[next.name] === "number") {
        acc = acc + values[next.name] * next.bonus;
        return acc;
      } else if (typeof values[next.name] === "boolean") {
        acc = acc + next.bonus;
        return acc;
      } else {
        return acc;
      }
    }, 0);

    const result = sum([
      distance,
      zombies,
      od,
      campers,
      totalBonus,
      improvements,
      buildingBonus,
      previousNightsMalus,
      cityType,
    ]);
    return result;
  };

  const [score, setScore] = React.useState<number>(calculateScore(initialValues));

  const handleSubmit = (values: FormValues) => {
    setCurrentDistance(values.distance);

    const result = calculateScore(values);

    setScore(result);
  };

  return (
    <>
      <h1>Camping Predict v2</h1>
      <p>Score: {score}/20</p>
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
        {({ handleChange, submitForm }) => (
          <Form
            onChange={(e) => {
              handleChange(e);
              submitForm();
            }}
          >
            <h2>Général</h2>

            <label>Type de ville</label>
            <div>
              <Field type="radio" name="cityType" value="RE"></Field>
              <label>RE</label>

              <Field type="radio" name="cityType" value="Pandé"></Field>
              <label>Pandé</label>
            </div>
            <ErrorMessage component={WarningMessage} name="cityType"></ErrorMessage>

            <label>Métier</label>
            <div>
              <Field type="radio" name="job" value="ermite"></Field>
              <label>Ermite</label>

              <Field type="radio" name="job" value="capuche"></Field>
              <label>Capuche</label>

              <Field type="radio" name="job" value="autre"></Field>
              <label>Autre</label>
            </div>
            <ErrorMessage component={WarningMessage} name="job"></ErrorMessage>

            <div>
              <label>Camping effectués</label>
              <Field type="number" name="previousNights" min="0" max="8"></Field>
              <ErrorMessage component={WarningMessage} name="previousNights"></ErrorMessage>
            </div>
            

            <div>
              <label>Campeur Pro</label>
              <Field type="checkbox" name="pro"></Field>
              <ErrorMessage component={WarningMessage} name="pro"></ErrorMessage>

            </div>

            <h2>Case de camping</h2>
            <div>
              <label>Distance (km)</label>
              <Field type="number" name="distance" min="1" max="28"></Field>
              <ErrorMessage component={WarningMessage} name="distance"></ErrorMessage>

            </div>
            <div>
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
              <label>Nombre de zombies</label>
              <Field type="number" name="zombies" min="0"></Field>
              <ErrorMessage component={WarningMessage} name="zombies"></ErrorMessage>

            </div>

            <div>
              <label>Nombre d'améliorations</label>
              <Field type="number" name="improvements" min="0" max="10"></Field>
              <ErrorMessage component={WarningMessage} name="improvements"></ErrorMessage>

            </div>

            <div>
              <label>Nombre d'ODs</label>
              <Field type="number" name="od" min="0" max="5"></Field>
              <ErrorMessage component={WarningMessage} name="od"></ErrorMessage>

            </div>

            <div>
              <label>Nombre de campeurs cachés</label>
              <Field type="number" name="campers" max="6"></Field>
              <ErrorMessage component={WarningMessage} name="campers"></ErrorMessage>

            </div>

            <h2>Bonus/Malus</h2>

            <div>
              <label>Toile de tente/pelure de peau</label>
              <Field type="number" name="tent"></Field>
              <ErrorMessage component={WarningMessage} name="tent"></ErrorMessage>

            </div>

            <div>
              <label>Tombe</label>
              <Field type="checkbox" name="tomb"></Field>
              <ErrorMessage component={WarningMessage} name="tomb"></ErrorMessage>

            </div>

            <div>
              <label>Nuit</label>
              <Field type="checkbox" name="night"></Field>
              <ErrorMessage component={WarningMessage} name="night"></ErrorMessage>

            </div>

            <div>
              <label>Phare</label>
              <Field type="checkbox" name="lighthouse"></Field>
              <ErrorMessage component={WarningMessage} name="lighthouse"></ErrorMessage>

            </div>

            <div>
              <label>Capuche</label>
              <Field type="checkbox" name="hood"></Field>
              <ErrorMessage component={WarningMessage} name="hood"></ErrorMessage>

            </div>

            <div>
              <label>Ville dévastée</label>
              <Field type="checkbox" name="devastation"></Field>
              <ErrorMessage component={WarningMessage} name="devastation"></ErrorMessage>

            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

const WarningMessage= styled.p`
  color: red;
`

export default Predict;
