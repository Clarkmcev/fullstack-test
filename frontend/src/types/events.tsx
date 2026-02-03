export enum EventTypeEnum {
  Wedding = "Wedding",
  Birthday = "Birthday",
  Conference = "Conference",
  Concert = "Concert",
  Festival = "Festival",
  Workshop = "Workshop",
  Seminar = "Seminar",
  Meetup = "Meetup",
  Fundraiser = "Fundraiser",
  Exhibition = "Exhibition",
}

export type Event = {
  type: EventTypeEnum | null;
  description: string | null;
  budget: number | null;
  numberOfPersons: number | null;
  date: string | null;
};
