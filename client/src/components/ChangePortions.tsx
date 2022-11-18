import { Ingredient } from '../DataService';

export const calculateAmounts = (
  ingredients: Ingredient[],
  previousPortions: number,
  currentPortions: number = 4
) => {
  const changedAmounts = ingredients.map((each) => {
    if (each.amount == null) {
      return { ...each, amount: 0 };
    } else {
      return {
        ...each,
        amount: ((Number((each.amount * 100) / previousPortions) / 100) * currentPortions).toFixed(
          1
        ),
      };
    }
  });
  return changedAmounts;
};
