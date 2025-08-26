import type CompanyDTO from "./CompanyDTO";

class ModulesDTO {
  private _id: number;
  private _company: CompanyDTO;
  private _analytics: boolean;
  private _timeTracker: boolean;
  private _calendar: boolean;
  private _companyNews: boolean;

  constructor(
    id: number,
    company: CompanyDTO,
    analytics: boolean,
    timeTracker: boolean,
    calendar: boolean,
    companyNews: boolean
  ) {
    this._id = id;
    this._company = company;
    this._analytics = analytics;
    this._timeTracker = timeTracker;
    this._calendar = calendar;
    this._companyNews = companyNews;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get company(): CompanyDTO {
    return this._company;
  }
  set company(value: CompanyDTO) {
    this._company = value;
  }

  get analytics(): boolean {
    return this._analytics;
  }
  set analytics(value: boolean) {
    this._analytics = value;
  }

  get timeTracker(): boolean {
    return this._timeTracker;
  }
  set timeTracker(value: boolean) {
    this._timeTracker = value;
  }

  get calendar(): boolean {
    return this._calendar;
  }
  set calendar(value: boolean) {
    this._calendar = value;
  }

  get companyNews(): boolean {
    return this._companyNews;
  }
  set companyNews(value: boolean) {
    this._companyNews = value;
  }
}

export default ModulesDTO