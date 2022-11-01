import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient } from '../DataService';

export const ChangePortions = (portions: number, defaultAmounts: Ingredient[] | undefined) => {
  let newAmounts: Ingredient[] | undefined;

  newAmounts = defaultAmounts?.map((i) => ({
    ...i,
    amount: parseFloat(((i.amount / 4) * portions).toPrecision(2)),
  }));
  return newAmounts;
};
