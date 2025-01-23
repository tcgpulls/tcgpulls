"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_PROFILE } from "@/graphql/auth/user/queries";
import { Avatar } from "@/components/catalyst-ui/avatar";
import { Input } from "@/components/catalyst-ui/input";
import { Button } from "@/components/catalyst-ui/button";

type Props = {
  userId: string;
  name: string;
  email: string;
  image: string;
  username: string;
};

export default function ProfileForm({
  userId,
  name,
  email,
  image,
  username: initialUsername,
}: Props) {
  const [username, setUsername] = useState(initialUsername);
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_PROFILE);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const { data: updatedUser } = await updateUser({
        variables: {
          id: userId,
          data: { username },
        },
      });
      console.log(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  }

  return (
    <div className="max-w-lg mt-8 p-6 bg-white rounded-lg shadow-md dark:bg-primary-800">
      <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-6">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
            Name
          </label>
          <Input value={name} readOnly disabled className="mt-1" />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
            Email
          </label>
          <Input value={email} readOnly disabled className="mt-1" />
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
            Username
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1"
            placeholder="Enter your username"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
            Current Image
          </label>
          <Avatar
            src={image}
            alt="Profile Image"
            className="mt-2 h-16 w-16 border border-primary-200 dark:border-primary-600"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-500">Error: {error.message}</p>
        )}
      </form>
    </div>
  );
}
