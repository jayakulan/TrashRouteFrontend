// Customer validation utilities
export class CustomerValidator {
  
  // Validation rules
  static rules = {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      messages: {
        required: 'Full name is required',
        minLength: 'Full name must be at least 2 characters long',
        maxLength: 'Full name cannot exceed 50 characters',
        pattern: 'Full name can only contain letters and spaces'
      }
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      messages: {
        required: 'Email address is required',
        pattern: 'Please enter a valid email address'
      }
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      messages: {
        required: 'Password is required',
        minLength: 'Password must be at least 8 characters long',
        maxLength: 'Password cannot exceed 128 characters',
        pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
    },
    confirmPassword: {
      required: true,
      messages: {
        required: 'Please confirm your password',
        mismatch: 'Passwords do not match'
      }
    },
    phoneNumber: {
      required: true,
      exactLength: 10,
      pattern: /^0[27]\d{8}$/,
      messages: {
        required: 'Phone number is required',
        exactLength: 'Phone number must be exactly 10 digits',
        pattern: 'Phone number must start with 07 or 02 and be exactly 10 digits'
      }
    },
    address: {
      required: true,
      minLength: 10,
      maxLength: 200,
      messages: {
        required: 'Address is required',
        minLength: 'Address must be at least 10 characters long',
        maxLength: 'Address cannot exceed 200 characters'
      }
    }
  };

  /**
   * Validate a single field
   */
  static validateField(fieldName, value, formData = {}) {
    const rule = this.rules[fieldName];
    if (!rule) return { isValid: true, errors: [] };

    const errors = [];

    // Required check
    if (rule.required && (!value || value.trim() === '')) {
      errors.push(rule.messages.required);
      return { isValid: false, errors };
    }

    // Skip other validations if field is empty and not required
    if ((!value || value.trim() === '') && !rule.required) {
      return { isValid: true, errors: [] };
    }

    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(rule.messages.minLength);
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(rule.messages.maxLength);
    }

    if (rule.exactLength && value.length !== rule.exactLength) {
      errors.push(rule.messages.exactLength);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.messages.pattern);
    }

    // Special validation for confirm password
    if (fieldName === 'confirmPassword' && value !== formData.password) {
      errors.push(rule.messages.mismatch);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  /**
   * Calculate password strength
   */
  static calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    if (score <= 4) return 'strong';
    return 'very-strong';
  }

  /**
   * Sanitize input data
   */
  static sanitizeData(data) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case 'fullName':
          sanitized[key] = this.sanitizeName(value);
          break;
        case 'email':
          sanitized[key] = this.sanitizeEmail(value);
          break;
        case 'password':
        case 'confirmPassword':
          // Don't sanitize passwords
          sanitized[key] = value;
          break;
        case 'phoneNumber':
          sanitized[key] = this.sanitizePhoneNumber(value);
          break;
        case 'address':
          sanitized[key] = this.sanitizeAddress(value);
          break;
        default:
          sanitized[key] = this.sanitizeGeneral(value);
      }
    }
    
    return sanitized;
  }

  /**
   * Sanitize name
   */
  static sanitizeName(name) {
    return name.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z\s]/g, '');
  }

  /**
   * Sanitize email
   */
  static sanitizeEmail(email) {
    return email.trim().toLowerCase();
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhoneNumber(phone) {
    return phone.replace(/\D/g, '');
  }

  /**
   * Sanitize address
   */
  static sanitizeAddress(address) {
    return address.trim().replace(/\s+/g, ' ');
  }

  /**
   * General sanitization
   */
  static sanitizeGeneral(value) {
    return value.trim();
  }

  /**
   * Validate entire form
   */
  static validateForm(formData) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, rule] of Object.entries(this.rules)) {
      const value = formData[fieldName] || '';
      const validation = this.validateField(fieldName, value, formData);
      
      if (!validation.isValid) {
        errors[fieldName] = validation.errors[0]; // Take first error
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  /**
   * Get field error message
   */
  static getFieldError(fieldName, value, formData = {}) {
    const validation = this.validateField(fieldName, value, formData);
    return validation.errors[0] || '';
  }

  /**
   * Check if field is valid
   */
  static isFieldValid(fieldName, value, formData = {}) {
    const validation = this.validateField(fieldName, value, formData);
    return validation.isValid;
  }

  /**
   * Get password strength color
   */
  static getPasswordStrengthColor(strength) {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-blue-500';
      case 'very-strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }

  /**
   * Get password strength text
   */
  static getPasswordStrengthText(strength) {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      case 'very-strong': return 'Very Strong';
      default: return 'Very Weak';
    }
  }
}

export default CustomerValidator; 