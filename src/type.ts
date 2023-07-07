interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
const enum mandatoryFields {
  username = "username",
  age = "age",
  hobbies = "hobbies",
}

export { User, mandatoryFields };
