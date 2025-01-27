"use client";

import { Button } from "@/components/catalyst-ui/button";
import { Input } from "@/components/catalyst-ui/input";
import Spinner from "@/components/misc/Spinner";
import { Avatar } from "@/components/catalyst-ui/avatar";
import { useProfileForm } from "@/hooks/useProfileForm";

export default function ProfileForm() {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    hasChanges,
    updateSuccess,
    mutationError,
    mutationLoading,
    queryLoading,
    queryError,
    userData,
  } = useProfileForm();

  if (queryError) return <p>Error: {queryError.message}</p>;

  return (
    <div className="max-w-lg mt-8 p-6 bg-white rounded-lg shadow-md dark:bg-primary-800">
      {queryLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-6">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange(e, "name")}
                readOnly
                disabled
                className="mt-1"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
                Email
              </label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange(e, "email")}
                readOnly
                disabled
                className="mt-1"
              />
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
                Username
              </label>
              <Input
                value={formData.username}
                onChange={(e) => handleInputChange(e, "username")}
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
                src={userData?.image}
                alt="Profile Image"
                className="mt-2 h-16 w-16 border border-primary-200 dark:border-primary-600"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutationLoading || !hasChanges()}
              className={`w-full ${mutationLoading || !hasChanges() ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {mutationLoading ? <Spinner /> : "Save Changes"}
            </Button>

            {/* Error Message */}
            {mutationError && (
              <p className="mt-2 text-sm text-red-500">
                Error: {mutationError.message}
              </p>
            )}

            {/* Success Message */}
            {updateSuccess && !mutationError && (
              <p className="mt-2 text-sm text-green-500">
                Profile updated successfully!
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
