// importing the db handler for organizations page

import {
    getAllOrganizations, getOrganizationDetails,
    createOrganization, updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

import { body, validationResult } from 'express-validator';


// Define validation and sanitization rules for organization form
// Define validation rules for organization form

const organizationValidation = [

    body('name')

        .trim()

        .notEmpty()

        .withMessage('Organization name is required')

        .isLength({ min: 3, max: 150 })

        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')

        .trim()

        .notEmpty()

        .withMessage('Organization description is required')

        .isLength({ max: 500 })

        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
    
        .normalizeEmail()
        
        .notEmpty()
        
        .withMessage('Contact email is required')
        
        .isEmail()
        
        .withMessage('Please provide a valid email address')
        
];

// Defining controller functions for the homepage called showOrganizationsPage

const showOrganizationsPage = async (req, res) => {

    // Implementation for showing organizations page
    
    const organizations = await getAllOrganizations();

    // console.log('Retrieved organizations:', organizations);

    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });

};

// adding a new controller function for showing the details of an organization when its
//  name is clicked on the organizations page

const showOrganizationDetailsPage = async (req, res) => {

    const { id } = req.params;
    
    console.log(`🔍 [ORG] Looking for organization ID: ${id}`);

    const organization = await getOrganizationDetails(id);
    const projects = await getProjectsByOrganizationId(id);

    console.log(`✅ [ORG] Organization found:`, organization ? 'YES' : 'NO');
    if (organization) {
        console.log(`   Name: ${organization.name}`);
    }

    if (!organization) {
        console.log(`❌ [ORG] Organization ID ${id} NOT found`);
        return res.status(404).render('error', { 
            message: `Organization with ID ${id} not found` 
        });
    }

    const title = organization.name || 'Organization Details';

    res.render('organization', { title, organization, projects });
};

const showNewOrganizationForm = (req, res) => {

    const title = 'Add New Organization';

    res.render('new-organization', { title });

};

// new controller for processing the POST form submission

const processNewOrganizationForm = async (req, res) => {

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {

        // Validation failed - loop through errors
        results.array().forEach((error) => {

            req.flash('error', error.msg);

        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organizations/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {

    const organizationId = req.params.id;

    const organization = await getOrganizationDetails(organizationId);

    const title = 'Edit Organization';

    res.render('edit-organization', { title, organization });
};

const processEditOrganizationForm = async (req, res) => {

    // This function will handle the form submission for editing an organization
    // It will be similar to processNewOrganizationForm but will update an existing record instead of creating a new one

    const organizationId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {

        // Validation failed - flash error messages

        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit form
        return res.redirect(`/edit-organization/${organizationId}`);
    }

    // No errors? Great - proceed with updating the organization
    
    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

    // set a flash message to indicate success

    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organizations/${organizationId}`);

};

export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm };