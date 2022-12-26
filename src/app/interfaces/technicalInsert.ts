import { User } from "../class/users";
import { Address } from "./address";

export interface TechnicalInsert {
  user: User;
  address: Address;
}