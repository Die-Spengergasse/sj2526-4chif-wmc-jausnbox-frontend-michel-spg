import { Ingredients } from "./Ingredients";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  duration: number;
  image?: string;
  instructions: string;
  ingredients: Ingredients[];
}