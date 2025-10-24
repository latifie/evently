/**
 * @description Contains the different roles that a user can have in the application.
 * These roles are used to manage access control and authorization.
 * Index defines permissions level (lowest = highest permissions).
 * @type {Object}
 * @property {string} ADMIN - The role for administrative users with elevated privileges.
 * @property {string} ORGANIZER - The role for users who can create & manage their own events.
 * @property {string} USER - The role for regular users with standard access.
 */
export enum userRoles {
  ADMIN = "admin",
  ORGANIZER = "organizer",
  USER = "user",
}
