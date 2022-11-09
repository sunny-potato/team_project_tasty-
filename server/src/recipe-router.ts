import express, { response } from 'express';
import recipeService, { Ingredient } from './recipe-service';

// Express router containing recipe methods:
const router = express.Router();

// get recipe with given id
router.get('/recipe/:id', (request, response) => {
  const id = Number(request.params.id);
  recipeService
    .getRecipe(id)
    .then((recipe) =>
      recipe ? response.send(recipe) : response.status(404).send('Recipe not found')
    )
    .catch((error) => response.status(500).send(error));
});

// get all recipies
router.get('/recipe', (request, response) => {
  recipeService
    .getAllRecipies()
    .then((recipes) => response.send(recipes))
    .catch((error) => response.status(500).send(error));
});

// add new recipe
/* Ex. request body: (id will be set when recipe is created)
    {
        recipeInfo: {
          id: 0,
          name: "New name",
          meal_type: "type",
          new: true,
          popular: false,
          description:
            "Lorem ipsum dolor sit .....",
        },
        ingredients: [
          { ingredient_id: 2, ingredient: "", amount: 3.5, unit_id: 2, unit: "" },
          { ingredient_id: 1, ingredient: "", amount: 1.5, unit_id: 2, unit: "" }
        ]
    } 
   Ex. response body: { id: 6 }*/
router.post('/recipe', (request, response) => {
  const data = request.body;
  if (!(data.recipeInfo && data.ingredients))
    response.status(400).send('Recipe info or ingredients list is missing');
  else if (!(data.recipeInfo.name && data.recipeInfo.name.length != 0))
    response.status(400).send('Recipe name is missing');
  else if (!(data.ingredients[0].ingredients_id && data.ingredients[0].unit_id))
    response.status(400).send('Ingredient or unit id is missing');
  else
    recipeService
      .create(data)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
});

// update given recipe
router.put('/recipe', (request, response) => {
  const data = request.body.data;
  const test = data.ingredients.some(
    (ingredient: Ingredient) =>
      ingredient.ingredients_id == undefined || ingredient.unit_id == undefined
  );
  console.log('test', test);
  console.log('express', data);
  if (!(data.recipeInfo && data.ingredients))
    response.status(400).send('Recipe info or ingredients list is missing');
  else if (!(data.recipeInfo.id && typeof data.recipeInfo.id == 'number'))
    response.status(400).send('Recipe id is missing');
  else if (!(data.recipeInfo.name && data.recipeInfo.name.length != 0))
    response.status(400).send('Recipe name is missing');
  // else if (test) response.status(400).send('Ingredient or unit id is missing');
  else if (!(data.ingredients[0].ingredients_id && data.ingredients[0].unit_id))
    response.status(400).send('Ingredient or unit id is missing');
  else
    recipeService
      .update(data)
      .then((_result) => response.send())
      .catch((error) => response.status(500).send(error));
});

// delete recipe with given id
router.delete('/recipe/:id', (request, response) => {
  recipeService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

// get all ingredients
router.get('/ingredient', (request, response) => {
  recipeService
    .getAllIngredents()
    .then((ingredients) => response.send(ingredients))
    .catch((error) => response.status(500).send(error));
});

// add new ingredient with given name
// ex. request body: { ingredient : "New ingredient" }
// ex. response body: { id : 26 }
router.post('/ingredient', (request, response) => {
  const data = request.body;
  if (data && data.ingredient && data.ingredient.length != 0)
    recipeService
      .createIngredient(data.ingredient)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing ingredient');
});

// update ingredient
router.put('/ingredient', (request, response) => {
  const data = request.body;
  if (data && typeof data.id == 'number' && typeof data.ingredient == 'string')
    recipeService
      .updateIngredient(data.id, data.ingredient)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing ingredient or ingredient id');
});

// delete ingredient with given id
router.delete('/ingredient/:id', (request, response) => {
  recipeService
    .deleteIngredient(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

// get all units
router.get('/unit', (request, response) => {
  recipeService
    .getAllUnits()
    .then((units) => response.send(units))
    .catch((error) => response.status(500).send(error));
});

// add new unit with given name
// ex. request body: { unit : "New unit" }
// ex. response body: { id : 9 }
router.post('/unit', (request, response) => {
  const data = request.body;
  if (data && data.unit && data.unit.length != 0)
    recipeService
      .createUnit(data.unit)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing ingredient');
});

// update unit
router.put('/unit', (request, response) => {
  const data = request.body;
  if (data && typeof data.id == 'number' && typeof data.unit == 'string')
    recipeService
      .updateUnit(data.id, data.unit)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing unit or unit id');
});

// delete unit with given id
router.delete('/unit/:id', (request, response) => {
  recipeService
    .deleteUnit(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default router;
