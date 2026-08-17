# Postman Testing Checklist

1. Create Product
   - Method: POST
   - URL: http://localhost:3000/api/products
   - Body: { "name": "Gaming Mouse", "description": "High precision gaming mouse with RGB lighting" }

2. Create Duplicate Product
   - Method: POST
   - URL: http://localhost:3000/api/products
   - Body: { "name": "gaming mouse", "description": "Duplicate data" }

3. Get All Products
   - Method: GET
   - URL: http://localhost:3000/api/products

4. Get Product By ID
   - Method: GET
   - URL: http://localhost:3000/api/products/{id}

5. Get Non-existing Product
   - Method: GET
   - URL: http://localhost:3000/api/products/nonexistent-id

6. Delete Product
   - Method: DELETE
   - URL: http://localhost:3000/api/products/{id}

7. Generate Product Tags
   - Method: POST
   - URL: http://localhost:3000/api/products/{id}/generate-tags

8. Invalid Request Validation
   - Method: POST
   - URL: http://localhost:3000/api/products
   - Body: { "name": "", "description": "" }

9. Optional: health check
   - GET http://localhost:3000/health

Capture screenshots of the request builder and response body for each scenario.
