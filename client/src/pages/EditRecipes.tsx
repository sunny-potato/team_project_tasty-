import React from 'react';
import { useParams } from 'react-router-dom';

export function EditRecipes() {
  const params = useParams();
  const id: string = params.id;

  return (
    <div>
      <h1>Site to edit the recipes</h1>
    </div>
  );
}
