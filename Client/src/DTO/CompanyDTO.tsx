class CompanyDTO {
  private _id: number;
  private _email: string;
  private _password: string;
  private _company: string;
  private _role: string;
  private _createdAt: string;

  constructor(
    id: number,
    email: string,
    password: string,
    company: string,
    role: string,
    createdAt: string
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._company = company;
    this._role = role;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }
  set password(value: string) {
    this._password = value;
  }

  get company(): string {
    return this._company;
  }
  set company(value: string) {
    this._company = value;
  }

  get role(): string {
    return this._role;
  }
  set role(value: string) {
    this._role = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }
  set createdAt(value: string) {
    this._createdAt = value;
  }
}

export default CompanyDTO