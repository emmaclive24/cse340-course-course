import express from 'express';
import { showHomePage } from './controllers/index.js';
import { 
  showOrganizationsPage, 
  showOrganizationDetailsPage, 
  showNewOrganizationForm, 
  processNewOrganizationForm, 
  organizationValidation, 
  showEditOrganizationForm, 
  processEditOrganizationForm 
} from './controllers/organizations.js';
import { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showUpcomingProjectsPage, 
  showNewProjectForm, 
  processNewProjectForm, 
  projectValidation, 
  showEditProjectForm, 
  processEditProjectForm 
} from './controllers/projects.js';
import { 
  showCategoriesPage, 
  showCategoryDetailsPage, 
  showAssignCategoriesForm, 
  processAssignCategoriesForm, 
  showNewCategoryForm, 
  processNewCategoryForm, 
  showEditCategoryForm, 
  processEditCategoryForm, 
  categoryValidation 
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Main routes
router.get('/', showHomePage);

// Organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Projects routes
router.get('/projects', showProjectsPage);
router.get('/projects/upcoming', showUpcomingProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Categories routes
router.get('/categories', showCategoriesPage);
router.get('/categories/:id', showCategoryDetailsPage);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

router.get('/test-error', testErrorPage);

export default router;
