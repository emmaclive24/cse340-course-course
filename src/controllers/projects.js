import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Validation rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Project title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Project description is required')
        .isLength({ max: 1000 }).withMessage('Project description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Project location is required')
        .isLength({ max: 200 }).withMessage('Project location cannot exceed 200 characters'),
    body('date')
        .notEmpty().withMessage('Project date is required')
        .isISO8601().withMessage('Please provide a valid date in YYYY-MM-DD format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Please select a valid organization')
];

// Helper: flash all validation errors
const flashValidationErrors = (req, errors) => {
    errors.array().forEach((error) => req.flash('error', error.msg));
};

// 1. All projects list
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Our Service Projects', projects });
    } catch (error) {
        next(error);
    }
};

// 2. Upcoming projects
const showUpcomingProjectsPage = async (req, res, next) => {
    try {
        const upcomingProjects = await getUpcomingProjects(5);
        res.render('upcoming-projects', { title: 'Upcoming Service Projects', upcomingProjects });
    } catch (error) {
        next(error);
    }
};

// 3. Project details
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesByProjectId(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('project', { title: project.title, project, categories });
    } catch (error) {
        next(error);
    }
};

// 4. New project form
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', { title: 'Create New Project', organizations });
    } catch (error) {
        next(error);
    }
};

// 5. Process new project
const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            flashValidationErrors(req, errors);
            return res.redirect('/new-project');
        }

        const { title, description, location, date } = req.body;
        const organizationId = parseInt(req.body.organizationId, 10);

        await createProject(title, description, location, date, organizationId);
        req.flash('success', 'Project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

// 6. Edit project form
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('edit-project', { title: 'Edit Project', project, organizations });
    } catch (error) {
        next(error);
    }
};

// 7. Process edit project - FIXED: now includes organizationId
const processEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach((error) => req.flash('error', error.msg));
            return res.redirect(`/edit-project/${projectId}`);
        }

        const { title, description, location, date } = req.body;
        const organizationId = parseInt(req.body.organizationId, 10);

        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showProjectsPage,
    showUpcomingProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};
