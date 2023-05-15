import { User } from "../../domain/user/user.entity";
import { writeFile } from "fs/promises";

export interface IUserRepository {
  insert(user: User): Promise<string | User>;
  exists(email: string): Promise<boolean>;
  findAll(): Promise<User[]>;
  exportToCSV(): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private users: User[] = [];

  async insert(user: User): Promise<string | User> {
    if (!this.exists(user.email)) {
      this.users.push(user);
      return user;
    } else {
      return "User already exists";
    }
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async exists(email: string): Promise<boolean> {
    return this.users.some((user) => user.email === email);
  }

  async exportToCSV(): Promise<void> {
    const csvData = this.convertToCSV(this.users);
    await writeFile("users.csv", csvData);
  }

  private convertToCSV(objArray: Record<string, string>[]): string {
    const headers = Object.keys(objArray[0]);
    const rows = objArray.map((obj) =>
      headers.map((header: string) => obj[header])
    );
    const csvArray = [headers, ...rows];
    const csvString = csvArray.map((row) => row.join(",")).join("\n");
    return csvString;
  }
}
