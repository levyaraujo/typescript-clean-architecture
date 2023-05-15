import crypto from "crypto";

export type User = {
  name: string;
  email: string;
  password: string;
};

export class UserEntity {
  private name: string;
  private email: string;
  private password: string;

  constructor(props: User) {
    this.name = props.name;
    this.email = props.email;
    this.password = this.hashPassword(props.password);
  }

  updateName(name: string): void {
    this.name = name;
  }

  updateEmail(email: string): void {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/i;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email");
    }
    this.email = email;
  }

  updatePassword(password: string): void {
    this.password = this.hashPassword(password);
  }

  toJSON(): User {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return [salt, hash].join("$");
  }
}
