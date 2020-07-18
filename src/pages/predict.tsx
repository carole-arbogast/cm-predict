import React from "react";
import CampingPredictForm from "../components/CampingPredictForm";
import {
  distanceInfo,
  hiddenCampers,
  bonusInfo,
  previousNights,
  scoreDisplays,
} from "../../data/general";
import buildings from "../../data/buildings.json";
import sum from "lodash/sum";
import get from "lodash/get";
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

function Predict() {
  const [currentDistance, setCurrentDistance] = React.useState<number>(0);
  const [currentJob, setCurrentJob] = React.useState<"ermite" | "capuche" | "autre">("autre");
  // const [message, setMessage] = React.useState<string>("");
  const [scoreDifference, setScoreDifference] = React.useState<number>();

  const filteredBuildings = buildings.filter((building) => {
    return (
      building.anywhere ||
      (currentDistance >= building.minDistance && currentDistance <= building.maxDistance)
    );
  });

  const calculateScore = (values: FormValues) => {
    const distance = get(
      distanceInfo.find((e) => e.km === values.distance),
      "bonus",
      0
    );
    const zombies = values.hood ? -(0.6 * values.zombies) : -(1.4 * values.zombies);
    const od = 1.8 * values.od;
    const campers = hiddenCampers[values.campers];
    const improvements = values.improvements;
    const previousNightsMalus =
      values.previousNights > 0 && values.previousNights < 9
        ? previousNights.find((e) => e.nb === values.previousNights)[values.pro ? "cp" : "noob"]
        : 0;

    const currentBonusList = bonusInfo.filter((b) => values[b.name]);

    const getBuildingBonus = () => {
      if (values.building) {
        const match = buildings.find((b) => b.name === values.building);
        if (values.distance >= match.minDistance && values.distance <= match.maxDistance) {
          return match.bonus;
        }
      } else {
        return 0;
      }
    };

    const buildingBonus = getBuildingBonus();

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

  const [score, setScore] = React.useState<number>(calculateScore(initialValues));

  const handleSubmit = (values: FormValues) => {
    setCurrentDistance(values.distance);
    if (values.job !== currentJob) {
      setCurrentJob(values.job);
    }

    const result = calculateScore(values);

    const getDifference = () => {
      if (values.job === "ermite") {
        return result - 20;
      } else {
        return result - 18;
      }
    };
    const diff = getDifference();

    const getDisplayedScore = () => {
      if (values.job === "ermite" && result > 20) {
        return 20;
      } else if (values.job !== "ermite" && result > 18) {
        return 18;
      } else {
        return result;
      }
    };

    const displayedScore = getDisplayedScore();

    setScoreDifference(Math.round(diff * 10) / 10);
    setScore(Math.round(displayedScore * 10) / 10);
  };

  const message = scoreDisplays.filter((display) => {
    return score >= display.range[0] && score < display.range[1];
  })[0].display;

  return (
    <>
      <Title>Camping Predict v2</Title>

      <Wrapper>
        <ResultDisplay>
          <p>
            Score: {score}/{currentJob === "ermite" ? "20" : "18"} (
            {scoreDifference && scoreDifference > 0 ? `+ ${scoreDifference}` : scoreDifference})
          </p>
          <p>
            {score > 0 ? score * 5 : 0}% : {message && message}
          </p>
        </ResultDisplay>
        <FormContainer>
          <Banner src="images/night_outerworld.jpg" alt=""></Banner>
          <CampingPredictForm
            onSubmit={handleSubmit}
            filteredBuildings={filteredBuildings}
            initialValues={initialValues}
            currentJob={currentJob}
          ></CampingPredictForm>
        </FormContainer>
      </Wrapper>
    </>
  );
}

const Title = styled.h1`
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ResultDisplay = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  width: 20%;
  border: 1px solid grey;
  margin-right: 1rem;
  align-self: flex-start;
  padding: 0.5rem;
  background: #372821;
  top: 1rem;

  @media (max-width: 768px) {
    width: 95%;
    margin: 0.75rem auto;
    top: 0;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  padding: 1.5rem;
  width: 65%;
  background: #5c2b20;

  @media (max-width: 768px) {
    width: 95%;
    margin: 0.75rem auto;
  }
`;

const Banner = styled.img`
  align-self: center;
  max-width: 100%;
`;

export default Predict;
