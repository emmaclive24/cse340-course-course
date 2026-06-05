// importing the db handler for categories page

import {
  getAllCategories, getCategoryById,
  getProjectsByCategoryId, getCategoriesByProjectId,
  updateCategoryAssignments, createCategory, updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for category form
// Define validation rules for category form

const categoryValidation = [

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
];

// Defining controller functions for the homepage called showCategoriesPage

const showCategoriesPage = async (req, res) => {
    
  // Implementation for showing categories page
  
    const categories = await getAllCategories();

  // console.log('Retrieved categories:', categories);

    const title = 'Service Categories';

    res.render('categories', { title, categories });
    
};

/**
 * show single category details page
 */

const showCategoryDetailsPage = async (req, res) => {

  const { id } = req.params;
  
  const category = await getCategoryById(id);

  const projects = await getProjectsByCategoryId(id);

  /**
  * checking if the category exists, if not render an error page with a 404 status code and a message "Category not found"
  */

  if (!category) {
        return res.status(404).render('error', { 
            message: 'Category not found' 
        });
    }

    const title = category.category_name;

    res.render('category', { 
        title, 
        category, 
        projects 
    });

};

 
// Create a new function showAssignCategoriesForm.
// Get the projectId from the request parameters.
// This function should retrieve the project details using the existing getProjectDetails model function.
// (You will likely need to add this to your list of imports from the project model file).
// It should also retrieve all categories using the existing getAllCategories model function.
// Additionally, it should retrieve the categories currently assigned to the project using the existing
// getCategoriesByProjectId model function. (You will likely need to add this to your list of imports
// from the categories model file.)
// It should set the title variable to be, "Assign Categories to Project"
// Finally, it should render a view assign-categories (to be created in the next step)
// and pass the project details, all categories, and the assigned categories to the view.

const showAssignCategoriesForm = async (req, res) => { 

  const { projectId } = req.params;

  const project = await getProjectDetails(projectId);

  const categories = await getAllCategories();

  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = 'Assign Categories to Project';

  res.render('assign-categories', { 
    title, 
    project, 
    categories, 
    assignedCategories 
  });

};

// Create a new function processAssignCategoriesForm.
// Get the projectId from the request parameters.
// Get the selected category IDs from the request body.
// (Assume the form field name is categories and it will be an array of selected category IDs.)
// This function should call the updateCategoryAssignments model function you created in the previous step,
// passing in the projectId and the array of selected category IDs. (You will likely need to add this to your
// list of imports from the categories model file.)
// Set a success flash message.
// Redirect the user back to the project details page /project/{projectId}.

const processAssignCategoriesForm = async (req, res) => { 

  const { projectId } = req.params;

  let selectedCategoryIds = req.body.categories || [];
    
    // Ensure it's always an array and convert to numbers
    if (!Array.isArray(selectedCategoryIds)) {

        selectedCategoryIds = [selectedCategoryIds];

    }
    
    // Convert to integers (important for SQL)
    const categoryIdsArray = selectedCategoryIds

        .map(id => parseInt(id, 10))

        .filter(id => !isNaN(id));

    try {
        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');

        res.redirect(`/project/${projectId}`);

    } catch (error) {

        console.error(error);

        req.flash('error', 'Failed to update categories.');

        res.redirect(`/project/${projectId}`);

    }
  
};

// create functions that will process the new-category form after insertion had been made
// and functions to show the new and edit category forms

const showNewCategoryForm = async (req, res) => {
  const title = 'Create New Category';
  res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {

  const { name } = req.body || {};

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.redirect('/new-category');

  }

  try {

    const newCategoryId = await createCategory(name);
    req.flash('success', 'Category created successfully!');
    return res.redirect('/categories');

  } catch (error) {

    console.error('Error creating category:', error);
    req.flash('error', 'Failed to create category. Please try again.');
    return res.redirect('/new-category');
  }
};

const showEditCategoryForm = async (req, res) => {

  const { id } = req.params;

  const category = await getCategoryById(id);

  if (!category) {
    return res.status(404).render('error', { 
      message: 'Category not found' 
    });
  }

  const title = 'Edit Category';

  res.render('edit-category', { title, category });
  
 };

const processEditCategoryForm = async (req, res) => {

  const { id } = req.params;

  const { name } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach((error) => {

      req.flash('error', error.msg);

    });

    return res.redirect(`/edit-category/${id}`);
  }

  try {

    await updateCategory(id, name);
    req.flash('success', 'Category updated successfully!');
    return res.redirect('/categories');

  } catch (error) {

    console.error('Error updating category:', error);
    req.flash('error', 'Failed to update category. Please try again.');
    return res.redirect(`/edit-category/${id}`);
  }

 };


export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
};

