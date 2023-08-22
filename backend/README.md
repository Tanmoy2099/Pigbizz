## 18-08-2023

1. auto assign medicine jobs to user.
2. auto breeding medicine jobs to user.
3. medicine details statistics for admin dashboard.
4. feed details statistics for admin dashboard.
5. graph data apis.


## 10-08-2023

1. farm user job card api,
2. auto assign feeding jobs to user.
3. admin can assign jobs to farm user.
4. edit pig details to create sold pig (api)

## 12-07-2023

1. row added in settings table.
2. in settings table, fill emailType with one of three values (smtp, gmail, sendgrid)
   1. for email_type = smtp. fill email_smtp_host, email_smtp_port, email_smtp_username, email_smtp_password
   2. for email_type = gmail. fill email_smtp_username, email_smtp_password
   3. for email_type = sendgrid. fill sendgrid_password
3. forgot password api, reset password api, (not attaching user details with login response) [done]

## 07-07-2023

1. seeding data is added.
2. prisma schema is modified.
3. vaccination form api is modified.
4. emergency medicine api form is modified.
5. feed planer api is modified.
6. To fill all the necessary data into the databse run "npm run seed"

## 23-06-2023

1. CRUD apis for feed inventory

## 22-06-2023

1. feed planer done
2. working on feed inventory

## 16-06-2023

1.  emergency medicine get the data with pagination
2.       get api for single data with the id in the params of url
3.  add api for emergency medicine data in the database which is pending by deafult
4.  update api for emergency medicine data with the new data, keeping the id
5.  delete api for emergency medicine data.
6.  inventory medicine get the data with pagination
7.  add api for inventory medicine data in the database which is pending by deafult
8.  update api for inventory medicine data with the new data, keeping the id
9.  delete api for inventory medicine data.
10. get api to get the status to inventory.
11. settings table in the database is added, and also get api, which has the data of pagination limit, low stock limit. please refer to the prisma.schema file.

## 09-06-2023

1. Emergency Medicine details post, put, delete, update apis
2. Assign Medicine details post, put, delete, update apis
3. medicine type apis and prisma configuration

## 02-06-2023

1. add assign medicine api
2. get specific or all assign medicine data api
3. update medicine details api
4. delete medicine api
5. medicine type apis and prisma configuration

## 26-05-2023

1. add batch page is added where batch number can be added.
2. list of existing batch numbers can be viewed in this page.
3. Deletion of pig details api in the backend is completed.

## Getting Started

First, run the development server:
npm run migrate

```bash
npm run dev
npm run migrate

TO RUN IN PRODUCTION
npm run build
npm start

TO FILL THE NECESSARY DATA INTO THE DATABASE
npm run seed
```

"npm run migrate" to migrate to database
"npm run pstudio" to open the database in prisma interface

Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.
