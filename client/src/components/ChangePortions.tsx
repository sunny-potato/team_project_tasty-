import React, { useState, useEffect } from 'react';
import dataService, { EachUnit, Ingredient } from '../DataService';

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
        amount:
          (Number(((each.amount * 100) / previousPortions).toFixed(3)) / 100) * currentPortions,
      };
    }
  });
  return changedAmounts;
};
