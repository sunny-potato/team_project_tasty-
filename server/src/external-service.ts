export type ApiRecipeInfo = {
  id: number;
  name: string;
  meal_type: string;
  new: boolean;
  popular: boolean;
  description: string;
  servings: number;
  image: string;
};

export type ApiIngredient = {
  ingredients_id: number;
  ingredient: string;
  amount: number;
  unit_id: number;
  unit: string;
};

export type ApiRecipe = {
  recipeInfo: ApiRecipeInfo;
  ingredients: ApiIngredient[];
};

class ExternalService {
  //External API

  //get api key request
  apiKey() {
    return new Promise(async (resolve, reject) => {
      const apiKey: string | undefined = process.env.REACT_API_KEY;
      if (!apiKey) return reject(new Error('Error')); //write something more usefull than that

      resolve(apiKey);
    });
  }

  //Change the value from the api for more ease of acces
  apiData(items: any) {
    //sets inn ingredients from the API acording to the type Ingredient, so that we can use typescript
    function setIngredients(ingrediens: any) {
      let ingredients: ApiIngredient = {
        ingredients_id: ingrediens.id, //from the AIP NOT in relation to the database
        ingredient: ingrediens.name,
        amount: ingrediens.measures.us.amount,
        unit_id: 1, //not really saying anything (can't check cus mySQL not working for me :/)
        unit: ingrediens.measures.us.unitShort,
      };
      return ingredients;
    }
    //sets inn ingredients from the API acording to the type setRecipeInfo, so that we can use typescript
    function setRecipeInfo(recipe: any) {
      let recipeInfo: ApiRecipeInfo = {
        id: recipe.id, //from the AIP NOT in relation to the database
        name: recipe.title,
        meal_type: recipe.diets,
        new: false, //no object from the aip that specified how "new" it is.
        popular: recipe.veryPopular,
        description: recipe.summary, //dangerouslySetInnerHTML={{ __html: recipe.summary}} when pringing it out
        servings: recipe.servings,
        image: recipe.image,
      };
      return recipeInfo;
    }
    //sets inn ingredients from the API acording to the type setRecipe, so that we can use typescript
    function setRecipe(Recipe: any, ingredients: any) {
      let recipe: ApiRecipe = {
        recipeInfo: Recipe,
        ingredients: ingredients,
      };
      return recipe;
    }
    function start() {
      let recipeList: ApiRecipe[] = [];
      {
        items?.map((recipe: any) => {
          let recipeInfo: ApiRecipeInfo = setRecipeInfo(recipe);
          let list: ApiIngredient[] = [];
          {
            recipe.extendedIngredients?.map((ingrediens: any) => {
              list.push(setIngredients(ingrediens));
            });
          }
          recipeList.push(setRecipe(recipeInfo, list));
        });
      }
      return recipeList;
    }

    //what it actually returns
    return new Promise(async (resolve, reject) => {
      const apiData: ApiRecipe[] = start();

      if (!apiData) return reject(new Error('Some objects are missing from the AIP request'));

      resolve(apiData);
    });
  }
}

const externalService = new ExternalService();
export default externalService;
