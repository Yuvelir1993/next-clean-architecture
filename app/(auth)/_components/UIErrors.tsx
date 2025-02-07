import { FormErrors } from "@/app/lib/definitions";

interface UIErrorProps {
  errors: FormErrors;
}

function isErrorObject(
  errors: FormErrors
): errors is { name?: string[]; email?: string[]; password?: string[] } {
  return !Array.isArray(errors);
}

const UIError: React.FC<UIErrorProps> = ({ errors }) => {
  if (
    Array.isArray(errors) &&
    errors.every((error) => typeof error === "string")
  ) {
    return (
      <ul>
        {errors.map((error, index) => (
          <li className="text-red-500" key={index}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  if (isErrorObject(errors)) {
    return (
      <ul>
        {errors.name && (
          <li className="bg-red-100 text-red-800 p-4 rounded-md">
            Name errors: {errors.name.join(", ")}
          </li>
        )}
        {errors.email && <li>Email errors: {errors.email.join(", ")}</li>}
        {errors.password && (
          <li>Password errors: {errors.password.join(", ")}</li>
        )}
      </ul>
    );
  }

  return null;
};

export default UIError;
