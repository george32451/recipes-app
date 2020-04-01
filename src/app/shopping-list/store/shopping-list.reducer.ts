import { Ingredient } from '../../common/models/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      const existingIngredientIndex = state.ingredients
        .findIndex(ing => ing.name.toLowerCase() === action.payload.name.toLowerCase());
      const newIngredients = existingIngredientIndex > -1 ? [ ...state.ingredients ] : null;

      if (newIngredients) {
        newIngredients[existingIngredientIndex] = {
          ...newIngredients[existingIngredientIndex],
          amount: newIngredients[existingIngredientIndex].amount + action.payload.amount
        };
      }

      return {
        ...state,
        ingredients: newIngredients ? newIngredients : [...state.ingredients, action.payload]
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredientsCopy = [...state.ingredients];
      ingredientsCopy[state.editedIngredientIndex] = action.payload;

      return {
        ...state,
        ingredients: ingredientsCopy,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((_, index) => index !== state.editedIngredientIndex),
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.payload] },
        editedIngredientIndex: action.payload,
      };

    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };

    default:
      return state;
  }
}
