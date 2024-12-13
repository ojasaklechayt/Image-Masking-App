**Overview**

The backend of the Image-Masking-App handles image processing tasks, including applying masking effects and blending images. Developed with Node.js and Express, it provides a robust API for the frontend to interact with.

**Features**

- **Image Processing API**: Endpoints to handle image uploads, processing, and retrieval.
- **Masking Algorithms**: Implementation of various algorithms to apply masking effects to images.
- **Error Handling**: Robust error handling to manage invalid inputs and processing errors.

**Installation**

To set up the backend locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ojasaklechayt/Image-Masking-App.git
   ```

2. **Navigate to the Backend Directory**:

   ```bash
   cd Image-Masking-App/backend
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Start the Server**:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`.

**API Endpoints**

- `POST /api/upload`: Uploads an image for processing.
- `POST /api/process`: Applies masking effects to the uploaded image.
- `GET /api/result`: Retrieves the processed image.

**Contributing**

Contributions are welcome. Please fork the repository, make your changes, and submit a pull request.

**License**

This project is licensed under the MIT License.
