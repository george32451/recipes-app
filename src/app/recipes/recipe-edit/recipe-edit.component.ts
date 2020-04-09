import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = !!params.id;
      this.initForm();
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  get ingredientControls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  private initForm() {
    const formDefaults = {
      name: '',
      imagePath: '',
      description: '',
      recipeIngredients: new FormArray([])
    };

    if (this.editMode) {
      this.recipeService.getRecipeById(this.id).subscribe(recipe => {
        formDefaults.name = recipe.name;
        formDefaults.imagePath = recipe.imagePath;
        formDefaults.description = recipe.description;

        if (recipe.ingredients) {
          recipe.ingredients.forEach(ingredient => {
            formDefaults.recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ingredient.name, Validators.required),
                amount: new FormControl(
                  ingredient.amount,
                  [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]
                )
              })
            );
          });
        }
      });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(formDefaults.name, Validators.required),
      imagePath: new FormControl(formDefaults.imagePath, Validators.required),
      description: new FormControl(formDefaults.description, Validators.required),
      ingredients: formDefaults.recipeIngredients
    });
  }
}
