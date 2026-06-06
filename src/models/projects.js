import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location,
               p.date, p.organization_id, o.name AS organization_name
        FROM service_project p
        JOIN organizations o ON p.organization_id = o.organization_id
        ORDER BY p.date DESC;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date
        FROM service_project p
        WHERE p.organization_id = $1
        ORDER BY p.date DESC;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location,
               p.date, p.organization_id, o.name AS organization_name
        FROM service_project p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

// FIXED: now includes p.organization_id so edit form and detail page work correctly
const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location,
               p.date, p.organization_id, o.name AS organization_name
        FROM service_project p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `;
    const result = await db.query(query, [title, description, location, date, organizationId]);
    if (result.rows.length === 0) throw new Error('Failed to create project');
    return result.rows[0].project_id;
};

// FIXED: now includes organizationId parameter so org changes are saved
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_project
        SET title = $1, description = $2, location = $3,
            date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id
    `;
    const result = await db.query(query, [title, description, location, date, organizationId, projectId]);
    if (result.rows.length === 0) throw new Error('Project not found');
    return result.rows[0].project_id;
};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
};
