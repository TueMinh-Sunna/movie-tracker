export function isBlank(value) {
  return !String(value ?? "").trim();
}

export function isValidEmail(email) {
  const value = String(email ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateSignupForm({
  username,
  email,
  password,
  confirmPassword,
}) {
  const fieldErrors = {};

  const trimmedUsername = String(username ?? "").trim();
  const trimmedEmail = String(email ?? "").trim();

  if (!trimmedUsername) {
    fieldErrors.username = "Username is required.";
  } else if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
    fieldErrors.username = "Username must be between 3 and 50 characters.";
  }

  if (!trimmedEmail) {
    fieldErrors.email = "Email is required.";
  } else if (!isValidEmail(trimmedEmail)) {
    fieldErrors.email = "Please enter a valid email address.";
  } else if (trimmedEmail.length > 100) {
    fieldErrors.email = "Email must be at most 100 characters.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  } else if (password.length < 6 || password.length > 100) {
    fieldErrors.password = "Password must be between 6 and 100 characters.";
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return fieldErrors;
}

export function validateLoginForm({ usernameOrEmail, password }) {
  const fieldErrors = {};

  const trimmedUsernameOrEmail = String(usernameOrEmail ?? "").trim();

  if (!trimmedUsernameOrEmail) {
    fieldErrors.usernameOrEmail = "Username or email is required.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  } else if (password.length < 6 || password.length > 100) {
    fieldErrors.password = "Password must be between 6 and 100 characters.";
  }

  return fieldErrors;
}

export function validateCommentForm(content) {
  const fieldErrors = {};
  const trimmedContent = String(content ?? "").trim();

  if (!trimmedContent) {
    fieldErrors.content = "Comment content is required.";
  } else if (trimmedContent.length > 1000) {
    fieldErrors.content = "Comment must be at most 1000 characters.";
  }

  return fieldErrors;
}

export function validatePersonalRating(value) {
  const trimmedValue = String(value ?? "").trim();

  if (trimmedValue === "") {
    return "";
  }

  const parsed = Number(trimmedValue);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
    return "Personal rating must be a whole number from 1 to 10.";
  }

  return "";
}