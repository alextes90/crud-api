import { mandatoryFields } from "../type";

interface ValidBody {
  username: string;
  age: number;
  hobbies: string[];
}

export const bodyValidator = (body: ValidBody) => {
  const isAllFieldsInBody = (body: ValidBody) =>
    mandatoryFields.username in body &&
    mandatoryFields.hobbies in body &&
    mandatoryFields.age in body &&
    Object.keys(body).length === 3;

  const isCorrectFieldsType = ({ username, hobbies, age }: ValidBody) => {
    let isCorrect = true;
    if (
      !(
        typeof username === "string" &&
        Array.isArray(hobbies) &&
        typeof age === "number"
      )
    ) {
      isCorrect = false;
    }
    if (hobbies.length > 0 && Array.isArray(hobbies)) {
      hobbies.forEach((hobby) => {
        if (typeof hobby === "string") return;
        isCorrect = false;
      });
    }
    return isCorrect;
  };

  const isCorrectBody = isAllFieldsInBody(body) && isCorrectFieldsType(body);

  return isCorrectBody;
};
