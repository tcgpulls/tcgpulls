"use client";

import { Button } from "@/components/catalyst-ui/button";
import { Input } from "@/components/catalyst-ui/input";
import Spinner from "@/components/misc/Spinner";
import { Avatar } from "@/components/catalyst-ui/avatar";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useTranslations } from "use-intl";
import { deriveApolloErrorMessage } from "@/utils/deriveApolloErrorMessage";

export default function ProfileForm() {
  const t = useTranslations("profile-page");
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
    usernameCheckError,
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
            {t("form.title")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
                {t("form.name")}
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
                {t("form.email")}
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
                {t("form.username")}
              </label>
              <Input
                value={formData.username}
                onChange={(e) => handleInputChange(e, "username")}
                className="mt-1"
                placeholder={t("form.username-placeholder")}
              />
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300">
                {t("form.current-image")}
              </label>
              <Avatar
                src={userData?.image}
                alt={t("form.current-image")}
                className="mt-2 h-16 w-16 border border-primary-200 dark:border-primary-600"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutationLoading || !hasChanges()}
              className={`w-full ${mutationLoading || !hasChanges() ? "cursor-auto" : "cursor-pointer"}`}
            >
              {mutationLoading ? <Spinner /> : t("form.save-changes")}
            </Button>

            {/* Error Message */}
            {mutationError && (
              <p className="mt-2 text-xs text-center text-red-500">
                {deriveApolloErrorMessage(mutationError)}
              </p>
            )}
            {usernameCheckError && (
              <p className="mt-2 text-xs text-center text-red-500">
                {usernameCheckError}
              </p>
            )}

            {/* Success Message */}
            {updateSuccess && !mutationError && (
              <p className="mt-2 text-xs text-center text-green-500">
                {t("form.messages.success")}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
