Below is a detailed `README.md` for your published package, showcasing the features, usage examples, and code snippets for each utility function in your library.

---

# @kamal-commits/node-common-utils

**Common Utility Package for Node.js**  
A collection of reusable utility functions and middleware for Node.js projects, including MongoDB operations, authentication, email handling, and logging.

## Installation

Install the package using npm:

```bash
npm install @kamal-commits/node-common-utils
```

---

## Features

- **CRUD Operations**: Simplify MongoDB document operations.
- **Authentication**: Middleware for JWT authentication.
- **Logging**: Configurable logging using Winston.
- **Email**: Flexible email sending utility.
- **Pagination**: Easily implement pagination for large datasets.

---

## Utilities

### 1. **CRUD Operations**

#### Create a Document

```javascript
import { createDocument } from "@kamal-commits/node-common-utils";

const user = await createDocument(UserModel, { name: "John Doe", email: "john@example.com" });
```

#### Find a Document by ID

```javascript
import { findById } from "@kamal-commits/node-common-utils";

const user = await findById("userId", UserModel, ["posts"]);
```

#### Update a Document by ID

```javascript
import { updateById } from "@kamal-commits/node-common-utils";

const updatedUser = await updateById("userId", UserModel, { name: "Jane Doe" }, ["posts"]);
```

#### Delete a Document by ID

```javascript
import { deleteById } from "@kamal-commits/node-common-utils";

const isDeleted = await deleteById("userId", UserModel);
```

#### Get All Documents with Pagination

```javascript
import { getAllDocumentAndSendResponse } from "@kamal-commits/node-common-utils";

router.get("/", async (req, res) => {
	await getAllDocumentAndSendResponse(req, res, UserModel);
});
```

---

### 2. **Authentication**

#### Authenticate JWT Token

```javascript
import { authenticateToken } from "@kamal-commits/node-common-utils";

app.use(authenticateToken(process.env.JWT_SECRET, "users"));
```

---

### 3. **Logging**

#### Basic Logging

```javascript
import { logger } from "@kamal-commits/node-common-utils";

logger.info("This is an informational message");
logger.error("This is an error message");
```

#### Add MongoDB Transport

```javascript
import { logger, addMongoDBTransport } from "@kamal-commits/node-common-utils";

addMongoDBTransport("mongodb://localhost:27017/logs", logger, "application_logs");
```

---

### 4. **Email Utility**

#### Send Email

```javascript
import sendEmail from "@kamal-commits/node-common-utils";

await sendEmail(
	{
		host: "smtp.gmail.com",
		port: 587,
		auth: {
			user: "your-email@gmail.com",
			pass: "your-email-password",
		},
	},
	"sender@example.com",
	"recipient@example.com",
	"Subject of the Email",
	"Plain text body of the email",
	"<p>HTML body of the email</p>",
	[{ filename: "attachment.txt", path: "./attachment.txt" }]
);
```

---

## Contributions

Feel free to contribute to this library by creating issues or submitting pull requests on the [GitHub repository](https://github.com/kamal-commits/node-common-utils).

---

## License

This project is licensed under the ISC License.

---

### Support

If you encounter any issues, please open an issue on the [GitHub repository](https://github.com/kamal-commits/node-common-utils/issues).

---

By including detailed usage examples and references to your utility functions, this `README.md` will provide a clear and comprehensive guide for users of your library.
