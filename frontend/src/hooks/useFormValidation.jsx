import { useState } from 'react';
import { z } from 'zod';

// Define schema
const FormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string()).optional(),
  authorEmail: z.string().email("Invalid email address"),
  published: z.boolean().optional(),
  coverImageUrl: z.string().url("Cover image must be a valid URL").optional(),
});

export const useFormValidation = (initialData = {}) => {
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = (formData) => {
    const result = FormSchema.safeParse(formData);

    if (!result.success) {
      const errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  };

  return {
    validationErrors,
    validateForm,
  };
};
