-- creating an organizations table that'll have: Unique identifier (organization_id), Name, 
-- Description, Contact Email and Logo Filename

-- ==================================

-- ORGANIZATIONS TABLE

-- ===================================

CREATE TABLE organizations (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

-- ============================================

-- INSERT SAMPLE DATA INTO THE ORGANIZATION TABLE

-- ============================================

INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives', 'hello@unityserve.org', 'unityserve-logo.png');


SELECT * FROM organizations;


-- ==================================

-- SERVICE PROJECTS TABLE

-- ===================================

CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    
    CONSTRAINT fk_service_project_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organizations(organization_id)
        ON DELETE RESTRICT
);


-- ============================================

-- INSERT SAMPLE DATA INTO THE PROJECTS TABLE

-- ============================================


INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES 
	-- BrightFuture Builders (organization_id = 1)
(1, 'Community Center Construction', 'Building a new multi-purpose community center in the downtown area', 'Downtown Riverside', '2026-06-10'),
(1, 'School Playground Renovation', 'Renovating playgrounds for two local elementary schools', 'Lincoln and Washington Elementary', '2026-07-05'),
(1, 'Low-Income Housing Repair', 'Painting and minor repairs for 15 low-income homes', 'Westside Neighborhood', '2026-05-28'),
(1, 'Bridge Repair Project', 'Repairing pedestrian bridge over the river', 'Riverside Park', '2026-08-15'),
(1, 'Youth Sports Facility Build', 'Constructing a new basketball court and field', 'Eastside Community Park', '2026-06-25'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Community Garden Expansion', 'Expanding the main community garden with 30 new beds', 'Central Community Garden', '2026-05-20'),
(2, 'Urban Farming Workshop Series', 'Teaching sustainable farming techniques to residents', 'GreenHarvest Urban Farm', '2026-07-12'),
(2, 'School Vegetable Garden Project', 'Building vegetable gardens at 3 local schools', 'Multiple School Locations', '2026-06-18'),
(2, 'Farmers Market Setup', 'Setting up weekly sustainable farmers market', 'City Plaza', '2026-08-05'),
(2, 'Composting Education Drive', 'Distributing compost bins and education', 'Various Neighborhoods', '2026-07-22'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Senior Home Cleanup Day', 'Helping seniors clean and organize their homes', 'Multiple Senior Residences', '2026-06-08'),
(3, 'Food Drive & Distribution', 'Large food collection and distribution event', 'UnityServe Warehouse', '2026-05-30'),
(3, 'Back-to-School Supply Drive', 'Collecting and distributing school supplies', 'City Convention Center', '2026-08-10'),
(3, 'Park Beautification Project', 'Cleaning and landscaping city parks', 'Riverside and Memorial Park', '2026-07-15'),
(3, 'Homeless Shelter Support', 'Organizing volunteers for shelter support', 'Hope Shelter Downtown', '2026-06-20');


SELECT * FROM projects;



-- ==================================

-- CATEGORIES TABLE

-- ===================================

CREATE TABLE IF NOT EXISTS categories (
	category_id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE
);

-- ============================================
-- JUNCTION TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE CASCADE
);

-- ============================================
-- INSERT CATEGORIES
-- ============================================
INSERT INTO categories (name)
VALUES
    ('Education'),
    ('Health & Wellness'),
    ('Environment & Sustainability'),
    ('Community Development'),
    ('Infrastructure'),
    ('Food Security')
ON CONFLICT (name) DO NOTHING;

-- ==================================
-- ASSOCIATE PROJECTS WITH CATEGORIES
-- ==================================
-- Each project gets at least one category
INSERT INTO project_categories (project_id, category_id)
VALUES 
    -- BrightFuture Builders Projects
    (1, 5),  -- Community Center Construction → Infrastructure
    (1, 4),  -- Community Center → Community Development
    (2, 4),  -- School Playground → Community Development
    (3, 5),  -- Low-Income Housing → Infrastructure
    (4, 5),  -- Bridge Repair → Infrastructure
    (5, 4),  -- Youth Sports Facility → Community Development

    -- GreenHarvest Growers Projects
    (6, 3),  -- Community Garden → Environment
    (6, 6),  -- Community Garden → Food Security
    (7, 1),  -- Urban Farming Workshop → Education
    (8, 1),  -- School Vegetable Garden → Education
    (8, 3),  -- School Vegetable Garden → Environment
    (9, 6),  -- Farmers Market → Food Security
    (10, 3), -- Composting Education → Environment

    -- UnityServe Volunteers Projects
    (11, 4), -- Senior Home Cleanup → Community Development
    (12, 6), -- Food Drive → Food Security
    (13, 1), -- Back-to-School Supply → Education
    (14, 3), -- Park Beautification → Environment
    (15, 4)  -- Homeless Shelter Support → Community Development
ON CONFLICT (project_id, category_id) DO NOTHING;

SELECT * FROM categories;

SELECT * FROM project_categories;