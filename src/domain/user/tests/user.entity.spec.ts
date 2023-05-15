import { User, UserEntity } from "../user.entity";

const userProps: User = {
  name: "John Doe",
  email: "johndoe@email.com",
  password: "123456",
};

const user = new UserEntity(userProps);
console.log(user.toJSON());

describe("UserEntity", () => {
  test("should change email", () => {
    const newEmail = "john@email.com";
    user.updateEmail(newEmail);
    expect(user.toJSON().email).toStrictEqual(newEmail);
  });

  test("should change name", () => {
    const newName = "John Doe Jr.";
    user.updateName(newName);
    expect(user.toJSON().name).toStrictEqual(newName);
  });

  test("should update with a hashed password", () => {
    const newPassword = "1234567";
    const passwordRegex = /^[a-f0-9]{32}\$[a-f0-9]{128}$/;
    user.updatePassword(newPassword);
    expect(user.toJSON().password).toMatch(passwordRegex);
  });
});
