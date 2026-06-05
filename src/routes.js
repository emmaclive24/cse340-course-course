// importing all the route controllers functions from the controllers directory for all the pages

import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm,
    organizationValidation, showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import {
    showProjectsPage, showProjectDetailsPage, showUpcomingProjectsPage,
    showNewProjectForm, processNewProjectForm, projectValidation,
    showEditProjectForm, processEditProjectForm
} from './controllers/projects.js';

import {
    showCategoriesPage, showCategoryDetailsPage,
    showAssignCategoriesForm, processAssignCategoriesForm, 
    showNewCategoryForm, processNewCategoryForm,
    showEditCategoryForm, processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

// create the router function to get the pages

const router = express.Router();

// middleware function to make the current year available in all EJS templates

// main routes
router.get('/', showHomePage);

// organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// new organization form route
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// projects routes
router.get('/projects', showProjectsPage);
router.get('/projects/upcoming', showUpcomingProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Route for new project page
router.get('/new-project', showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);
// Route for editing a project
router.get('/edit-project/:id', showEditProjectForm);
// Route to handle the edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// categories routes
router.get('/categories', showCategoriesPage);  
router.get('/categories/:id', showCategoryDetailsPage);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Routes to handle the new category form
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

// Routes to handle the edit category form
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

router.get('/test-error', testErrorPage);

export default router;


