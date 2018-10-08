USE sakila;

# 1a. Display the first and last names of all actors from the table `actor`.

SELECT 
    first_name, last_name
FROM
    actor;

# 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column `Actor Name`.

SELECT 
    CONCAT(UPPER(first_name), ' ', UPPER(last_name)) AS 'Actor Name'
FROM
    actor;

# 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." 

SELECT 
    actor_id, first_name, last_name
FROM
    actor 
WHERE
    first_name = 'Joe'; 

# 2b. Find all actors whose last name contain the letters `GEN`:

SELECT * FROM actor WHERE last_name LIKE "%GEN%";

# 2c. Find all actors whose last names contain the letters `LI`. This time, order the rows by last name and first name, in that order:

SELECT 
    actor_id, last_name, first_name
FROM
    actor
WHERE
    last_name LIKE '%LI%'
ORDER BY last_name, first_name;

# 2d. Using `IN`, display the `country_id` and `country` columns of the following countries: Afghanistan, Bangladesh, and China:

SELECT 
    country_id, country
FROM
    country
WHERE
    country IN ('Afghanistan' , 'Bangladesh', 'China');

# 3a. Create a column in the table `actor` named `description` and use the data type `BLOB`.

ALTER TABLE actor 
ADD COLUMN description BLOB DEFAULT NULL;

# 3b. Delete the `description` column.

ALTER TABLE actor
DROP COLUMN description;

# 4a. List the last names of actors, as well as how many actors have that last name.

SELECT 
    last_name, COUNT(first_name) AS 'Number of Actors'
FROM
    actor
GROUP BY last_name;

# 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors.

SELECT 
    last_name, COUNT(first_name) AS 'Number of Actors'
FROM
    actor
GROUP BY last_name
HAVING COUNT(first_name) > 1; 


# 4c. The actor `HARPO WILLIAMS` was accidentally entered in the `actor` table as `GROUCHO WILLIAMS`. Write a query to fix the record.

UPDATE actor
SET first_name = 'HARPO'
WHERE last_name = 'WILLIAMS' AND first_name = 'GROUCHO';

# 4d. In a single query, if the first name of the actor is currently `HARPO`, change it to `GROUCHO`.

UPDATE actor
SET first_name = 'GROUCHO'
WHERE last_name = 'WILLIAMS' AND first_name = 'HARPO';

# 5a. You cannot locate the schema of the `address` table. Which query would you use to re-create it?

SHOW CREATE TABLE address;

CREATE TABLE `address` (
   `address_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
   `address` varchar(50) NOT NULL,
   `address2` varchar(50) DEFAULT NULL,
   `district` varchar(20) NOT NULL,
   `city_id` smallint(5) unsigned NOT NULL,
   `postal_code` varchar(10) DEFAULT NULL,
   `phone` varchar(20) NOT NULL,
   `location` geometry NOT NULL,
   `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`address_id3`),
   KEY `idx_fk_city_id` (`city_id`),
   SPATIAL KEY `idx_location` (`location`),
   CONSTRAINT `fk_address_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`) ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=606 DEFAULT CHARSET=utf8;

# 6a. Use `JOIN` to display the first and last names, as well as the address, of each staff member. Use the tables `staff` and `address`:

SELECT 
    s.first_name, s.last_name, a.address
FROM
    staff s
        JOIN
    address a ON s.address_id = a.address_id;


# 6b. Use `JOIN` to display the total amount rung up by each staff member in August of 2005. Use tables `staff` and `payment`.

SELECT 
    CONCAT(s.first_name, ' ', s.last_name) AS 'Staff Name',
    SUM(p.amount) AS 'Total Amount'
FROM
    staff s
        INNER JOIN
    payment p ON s.staff_id = p.staff_id
WHERE
    YEAR(p.payment_date) = 2005
	AND MONTH(p.payment_date) = 08
GROUP BY s.staff_id;    

# 6c. List each film and the number of actors who are listed for that film. Use tables `film_actor` and `film`. Use inner join.

SELECT 
    f.title, COUNT(fa.actor_id) AS 'Number of Actors'
FROM
    film f
        INNER JOIN
    film_actor fa ON fa.film_id = f.film_id
GROUP BY f.film_id;

# 6d. How many copies of the film `Hunchback Impossible` exist in the inventory system?

SELECT f.title, COUNT(i.inventory_id) AS 'Number of Copies'
FROM inventory i
JOIN film f
ON f.film_id = i.film_id
WHERE f.title = 'HUNCHBACK IMPOSSIBLE';

# 6e. Using the tables `payment` and `customer` and the `JOIN` command, list the total paid by each customer. List the customers alphabetically by last name:

SELECT 
    c.first_name,
    c.last_name,
    SUM(p.amount) AS 'Total Amount Paid'
FROM
    customer c
        JOIN
    payment p ON c.customer_id = p.customer_id
GROUP BY c.customer_id
ORDER BY c.last_name;

# 7a. Use subqueries to display the titles of movies starting with the letters `K` and `Q` whose language is English.

SELECT 
    title AS 'English movies (K & Q)'
FROM
    film
WHERE
    title LIKE 'k%'
        OR title LIKE 'Q%'
        AND language_id IN (SELECT 
            language_id
        FROM
            language
        WHERE
            UPPER(name) = 'ENGLISH');

# 7b. Use subqueries to display all actors who appear in the film `Alone Trip`.

SELECT 
    first_name, last_name
FROM
    actor
WHERE
    actor_id IN (SELECT 
            actor_id
        FROM
            film_actor
        WHERE
            film_id IN (SELECT 
                    film_id
                FROM
                    film
                WHERE
                    UPPER(title) = 'ALONE TRIP'));

# 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. 

SELECT 
    first_name, last_name, email
FROM
    customer cu
        JOIN
    address a ON cu.address_id = a.address_id
        JOIN
    city ci ON a.city_id = ci.city_id
        JOIN
    country cy ON ci.country_id = cy.country_id
WHERE
    UPPER(country) = 'CANADA';

# 7d. dentify all movies categorized as _family_ films.

SELECT 
    f.title AS 'Family Films'
FROM
    film f
        JOIN
    film_category fc ON f.film_id = fc.film_id
        JOIN
    category c ON fc.category_id = c.category_id
WHERE
    c.name = 'Family';

# 7e. Display the most frequently rented movies in descending order.

SELECT 
    f.title, COUNT(r.rental_id) AS 'number of times rented'
FROM
    film f
        JOIN
    inventory i ON f.film_id = i.film_id
        JOIN
    rental r ON r.inventory_id = i.inventory_id
GROUP BY f.film_id
ORDER BY COUNT(r.rental_id) DESC;

# 7f. Write a query to display how much business, in dollars, each store brought in.

SELECT 
    s.store_id, SUM(p.amount) AS 'Earnings (Dollars)'
FROM
    payment p
        JOIN
    rental r ON p.rental_id = r.rental_id
        JOIN
    inventory i ON i.inventory_id = r.inventory_id
        JOIN
    store s ON s.store_id = i.store_id
GROUP BY s.store_id;

# 7g. Write a query to display for each store its store ID, city, and country.

SELECT 
    s.store_id, ci.city, co.country
FROM
    store s
        JOIN
    address a ON s.address_id = a.address_id
        JOIN
    city ci ON a.city_id = ci.city_id
        JOIN
    country co ON ci.country_id = co.country_id;

# 7h. List the top five genres in gross revenue in descending order. 

SELECT 
    c.name AS 'Genre', SUM(p.amount) AS 'Gross Revenue'
FROM
    category c
        JOIN
    film_category fc ON c.category_id = fc.category_id
        JOIN
    inventory i ON fc.film_id = i.film_id
        JOIN
    rental r ON i.inventory_id = r.inventory_id
        JOIN
    payment p ON r.rental_id = p.rental_id
GROUP BY c.name
ORDER BY SUM(p.amount) DESC
LIMIT 5;

# 8a. Use the solution from the problem above to create a view.

CREATE VIEW top_five_genres AS
    SELECT 
        c.name AS 'Genre', SUM(p.amount) AS 'Gross Revenue'
    FROM
        category c
            JOIN
        film_category fc ON c.category_id = fc.category_id
            JOIN
        inventory i ON fc.film_id = i.film_id
            JOIN
        rental r ON i.inventory_id = r.inventory_id
            JOIN
        payment p ON r.rental_id = p.rental_id
    GROUP BY c.name
    ORDER BY SUM(p.amount) DESC
    LIMIT 5;


# 8b. How would you display the view that you created in 8a?

SELECT * FROM top_five_genres;

# 8c. Write a query to delete it the view `top_five_genres`.

DROP VIEW top_five_genres;
