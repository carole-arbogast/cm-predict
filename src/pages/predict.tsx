import React from "react";
import { Formik, Form, Field } from "formik";
import { distanceInfo, hiddenCampers, bonusInfo, previousNights } from "../../data/general";
import buildings from "../../data/buildings.json";
import sum from "lodash/sum";

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
    const distance = distanceInfo.find((e) => e.km === values.distance).bonus;
    const zombies = -(1.4 * values.zombies);
    const od = 1.8 * values.od;
    const campers = hiddenCampers[values.campers];
    const improvements = values.improvements;
    const previousNightsMalus =
      values.previousNights > 0
        ? previousNights.find((e) => e.nb === values.previousNights)[values.pro ? "cp" : "noob"]
        : 0;

    const currentBonusList = bonusInfo.filter((b) => values[b.name]);

    const buildingBonus = values.building
      ? buildings.find((b) => b.name === values.building).bonus
      : 0;

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
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
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

            <label>Métier</label>
            <div>
              <Field type="radio" name="job" value="ermite"></Field>
              <label>Ermite</label>

              <Field type="radio" name="job" value="capuche"></Field>
              <label>Capuche</label>

              <Field type="radio" name="job" value="autre"></Field>
              <label>Autre</label>
            </div>
            <div>
              <label>Camping effectués</label>
              <Field type="number" name="previousNights" max="10"></Field>
            </div>

            <div>
              <label>Campeur Pro</label>
              <Field type="checkbox" name="pro"></Field>
            </div>

            <h2>Case de camping</h2>
            <div>
              <label>Distance (km)</label>
              <Field type="number" name="distance" max="28"></Field>
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
            </div>

            <div>
              <label>Nombre de zombies</label>
              <Field type="number" name="zombies"></Field>
            </div>

            <div>
              <label>Nombre d'améliorations</label>
              <Field type="number" name="improvements" max="10"></Field>
            </div>

            <div>
              <label>Nombre d'ODs</label>
              <Field type="number" name="od" max="5"></Field>
            </div>

            <div>
              <label>Nombre de campeurs cachés</label>
              <Field type="number" name="campers" max="6"></Field>
            </div>

            <h2>Bonus/Malus</h2>

            <div>
              <label>Toile de tente/pelure de peau</label>
              <Field type="number" name="tent"></Field>
            </div>

            <div>
              <label>Tombe</label>
              <Field type="checkbox" name="tomb"></Field>
            </div>

            <div>
              <label>Nuit</label>
              <Field type="checkbox" name="night"></Field>
            </div>

            <div>
              <label>Phare</label>
              <Field type="checkbox" name="lighthouse"></Field>
            </div>

            <div>
              <label>Capuche</label>
              <Field type="checkbox" name="hood"></Field>
            </div>

            <div>
              <label>Ville dévastée</label>
              <Field type="checkbox" name="devastation"></Field>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Predict;
