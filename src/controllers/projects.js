// importing the db handler for projects page

import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';

import { body, validationResult } from 'express-validator';

// title: trim, ensure not empty, length between 3 and 200.
// description: trim, ensure not empty, length less than 1000.
// location: trim, ensure not empty, length less than 200.
// date: ensure not empty, valid date format.
// organizationId: ensure not empty, valid integer.

const projectValidation = [

    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),
    
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters'),
    
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({ max: 200 })
        .withMessage('Project location cannot exceed 200 characters'),
    
    body('date')
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Please provide a valid date in YYYY-MM-DD format'),
    
    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Please select a valid organization')
    
];

const flashValidationErrors = (req, errors) => {
    errors.array().forEach((error) => {
        req.flash('error', error.msg);
    });
};

// Defining controller functions for the projects page called showProjectsPage

const showProjectsPage = async (req, res) => {

    try {

        const projects = await getAllProjects();

        res.render('projects', { title: 'Service Projects', projects });

    } catch (error) {

        console.error('Error loading projects:', error);

        res.status(500).render('error', { message: 'Unable to load service projects.' });

    }

};

const showUpcomingProjectsPage = async (req, res) => {

    try {

        const number_of_projects = 5;

        const upcomingProjects = await getUpcomingProjects(number_of_projects);

        res.render('upcoming-projects', { title: 'Upcoming Service Projects', upcomingProjects });

    } catch (error) {

        console.error('Error loading upcoming projects:', error);

        res.status(500).render('error', { message: 'Unable to load upcoming projects.' });

    }

};

const showProjectDetailsPage = async (req, res) => {

    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {

        return res.status(404).render('error', { message: 'Project not found' });

    }

    try {

        const project = await getProjectDetails(projectId);

        const categories = await getCategoriesByProjectId(projectId);

        if (!project) {

            return res.status(404).render('error', { message: 'Project not found' });

        }

        res.render('project', { title: project.title, project, categories });

    } catch (error) {

        console.error('Error loading project details:', error);

        res.status(500).render('error', { message: 'Unable to load project details.' });

    }

};

const showNewProjectForm = async (req, res) => {

    try {

        const organizations = await getAllOrganizations();

        res.render('new-project', { title: 'Create New Project', organizations });

    } catch (error) {

        console.error('Error loading new project form:', error);

        res.status(500).render('error', { message: 'Unable to load project creation form.' });

    }

};


// processNewProjectForm. This function should do the following:
// Extract the project data (organizationId, title, description, location, date) from the form submission using req.body.
// Call the createProject model function you created in the previous step, passing all of the necessary parameters.
// After the insertion is complete, set a success flash message.
// Redirect the user back to the main service project list page.

const processNewProjectForm = async (req, res) => {

    const { title, description, location, date } = req.body;

    const organizationId = parseInt(req.body.organizationId, 10);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        flashValidationErrors(req, errors);

        return res.redirect('/new-project');

    }

    if (Number.isNaN(organizationId)) {

        req.flash('error', 'Please select a valid organization.');

        return res.redirect('/new-project');

    }

    try {
        
        const newProjectId = await createProject(title, description, location, date, organizationId);
        
        req.flash('success', 'Project created successfully!');
        
        return res.redirect('/projects');
        
    } catch (error) {
        
        console.error('Error creating project:', error);
        
        req.flash('error', 'Failed to create project. Please try again.');
        
        return res.redirect('/new-project');
        
    }
    
};

const showEditProjectForm = async (req, res) => {

    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    const organizations = await getAllOrganizations();

    const title = 'Edit Project';

    res.render('edit-project', { title, project, organizations });
};

const processEditProjectForm = async (req, res) => {

    // This function will handle the form submission for editing a project
    // It will be similar to processNewProjectForm but will update an existing record instead of creating a new one

    const projectId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {

        // Validation failed - flash error messages

        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit form
        return res.redirect(`/edit-project/${projectId}`);
    }

    // No errors? Great - proceed with updating the project
    
    const { title, description, location, date } = req.body;

    await updateProject(projectId, title, description, location, date);

    // set a flash message to indicate success

    req.flash('success', 'Project updated successfully!');

    res.redirect('/projects');

};

export {
    showProjectsPage, showUpcomingProjectsPage, showProjectDetailsPage,
    showNewProjectForm, processNewProjectForm, projectValidation, 
    showEditProjectForm, processEditProjectForm
};
