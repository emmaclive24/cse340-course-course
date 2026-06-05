// this file queries the database for all categories with projects count
//  and renders the categories page with the retrieved data.

import db from './db.js';

/**
 * Get all categories
 * Array of category objects
 */

const getAllCategories = async () => {

    const query = `

        SELECT 

            category_id,

            name AS category_name

        FROM categories

        ORDER BY name ASC;

    `;

    const result = await db.query(query);

    return result.rows;

};

/**
 * Get a single category by ID
 */

const getCategoryById = async (categoryId) => {

    const query = `

        SELECT 

            category_id,

            name AS category_name

        FROM categories

        WHERE category_id = $1;

    `;

    const result = await db.query(query, [categoryId]);

    return result.rows[0] || null;

};

/**
 * 
 * Get all categories for a given service project
 * 
 */

const getCategoriesByProjectId = async (projectId) => {

    const query = `
    
        SELECT
        
            c.category_id,
            
            c.name AS category_name
        
        FROM categories c

        JOIN project_categories pc ON c.category_id = pc.category_id

        WHERE pc.project_id = $1
        
        ORDER BY c.name ASC;

        `;
    
    const result = await db.query(query, [projectId]);

    return result.rows;

 };


/**
 * 
 * Get all service projects for a given category
 * 
 */

const getProjectsByCategoryId = async (categoryId) => {

    const query = `

        SELECT
            
            p.project_id,
            
            p.title,

            p.description,
            
            p.location,
            
            p.project_date AS date,
            
            o.name AS organization_name

        FROM projects p

        JOIN organizations o ON p.organization_id = o.organization_id

        JOIN project_categories pc ON p.project_id = pc.project_id

        WHERE pc.category_id = $1

        ORDER BY p.project_date DESC;

    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

/**
 * Get all categories with the number of projects in each
 * Useful for categories page / dashboard
 */

const getCategoriesWithCount = async () => {

    const query = `

        SELECT 

            c.category_id,

            c.name AS category_name,

            COUNT(pc.project_id) AS project_count

        FROM categories c

        LEFT JOIN project_categories pc ON c.category_id = pc.category_id

        GROUP BY c.category_id, c.name

        ORDER BY c.name ASC;

    `;

    const result = await db.query(query);

    return result.rows;

};

// this function assigns a category to a project in the many-to-many relationship table

const assignCategoryToProject = async (categoryId, projectId) => {

    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2)
    `;
    await db.query(query, [categoryId, projectId]);
};

// updateCategoryAssignments that updates the categories assigned to a project

const updateCategoryAssignments = async (projectId, categoryIds) => {

    // First, delete existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1
    `;
    await db.query(deleteQuery, [projectId]);

    // Then, insert the new category assignments
    const insertQueries = categoryIds.map((categoryId) => {
        const query = `
            INSERT INTO project_categories (category_id, project_id)
            VALUES ($1, $2)
        `;
        return db.query(query, [categoryId, projectId]);
    });

    await Promise.all(insertQueries);
};

// functions for inserting new categories and functions for editing existing categories

const createCategory = async (name) => {

    const query = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id
    `;

    const result = await db.query(query, [name]);

    // check if the insert was successful and return the new category ID

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    // check if the process.env is true in the ENABLE_SQL_LOGGING

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }

    // return the result of the query, which includes the new category ID
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {

    const query = `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id
    `;

    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};

export { 
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    getCategoriesWithCount,
    assignCategoryToProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};