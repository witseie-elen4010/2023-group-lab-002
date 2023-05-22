# [Consulstation]
## Application Design Review (ADR) Document: Choosing MongoDB as the database for the Consultation Scheduler web application

Date: 18 May 2023

## Status

Accepted

## 1. Introduction

This ADR document outlines the decision to choose MongoDB as the preferred database for our consultation scheduler web application. The database will be responsible for storing user login credentials and consultations in separate collections.

## 2. Alternatives

The following database options were considered for our application:

1. Relational Databases (e.g., MySQL, PostgreSQL): Traditional relational databases are widely used and offer strong data integrity and ACID compliance. However, they may require complex schema design and lack scalability which can result in reduced response times as data sets gets larger. 

2. Document Databases (e.g., MongoDB, CouchDB): Document databases are designed to store, retrieve, and manage semi-structured and unstructured data. They provide flexibility and scalability for evolving data models. MongoDB and CouchDB were the primary document database options considered.

## 3. Decision

MongoDB has been selected as the database for our application. 

## 4. Rationale
This decision was based on the following factors:

- **Scalability and Performance**: MongoDB's horizontal scaling capabilities allow us to handle growing data volumes and load efficiently. This is important for ensuring optimal performance as user registrations may increase over time. 

- **Document Level Atomicity**: MongoDB provides atomic operations at the document level, ensuring data integrity and consistency during updates. This feature is valuable in scenarios where consultations or user credentials may require simultaneous modifications.

- **Community**: MongoDB has a large and active community, offering extensive resources, documentation, and community support.

## 5. Consequences/Risks

- Development Effort: There will be a learning curve for the team as we familiarise ourselves with MongoDB and how to effecticely use its query language. 

- Maintenance and Operations: Proper backup and maintenance processes should be established to ensure the database's availability, reliability, and data integrity.

- Access Control: Anyone with access to the database will be able to view user credentials, which includes their login password. Hashing will need to be implemented to provide security for all user credentials. 

## References

https://www.techtarget.com/searchdatamanagement/definition/relational-database 

https://www.mongodb.com/nosql-explained/nosql-vs-sql#:~:text=One%20of%20the%20most%20frequently,acceptable%20for%20lots%20of%20applications. 