"use client";

import { useState, type FormEvent } from "react";
import { Lock, Mail, User } from "lucide-react";

import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

const initialFormData: SignUpFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const SignUpBlock = () => {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof SignUpFormData,
    value: string | boolean
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      setIsSuccess(true);
      setFormData(initialFormData);
    } catch {
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Account Created Successfully!
          </CardTitle>
          <CardDescription>
            Please check your email to verify your account before signing in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="w-full"
          >
            Sign Up Another Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <CardContent className="flex flex-col gap-4">
          {errors.general ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {errors.general}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName" required>
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="John"
                value={formData.firstName}
                onChange={(event) =>
                  handleInputChange("firstName", event.target.value)
                }
                error={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                leftIcon={<User />}
                disabled={isLoading}
              />
              {errors.firstName ? (
                <p id="firstName-error" className="text-sm text-destructive">
                  {errors.firstName}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName" required>
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(event) =>
                  handleInputChange("lastName", event.target.value)
                }
                error={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                leftIcon={<User />}
                disabled={isLoading}
              />
              {errors.lastName ? (
                <p id="lastName-error" className="text-sm text-destructive">
                  {errors.lastName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(event) => handleInputChange("email", event.target.value)}
              error={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              leftIcon={<Mail />}
              disabled={isLoading}
            />
            {errors.email ? (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(event) =>
                handleInputChange("password", event.target.value)
              }
              error={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              leftIcon={<Lock />}
              disabled={isLoading}
            />
            {errors.password ? (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(event) =>
                handleInputChange("confirmPassword", event.target.value)
              }
              error={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              leftIcon={<Lock />}
              disabled={isLoading}
            />
            {errors.confirmPassword ? (
              <p
                id="confirmPassword-error"
                className="text-sm text-destructive"
              >
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <Checkbox
            id="acceptTerms"
            label="I agree to the Terms and Conditions and Privacy Policy"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) =>
              handleInputChange("acceptTerms", checked === true)
            }
            error={errors.acceptTerms}
            disabled={isLoading}
          />
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-normal text-foreground no-underline hover:underline"
            >
              Sign In
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUpBlock;
