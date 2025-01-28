"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_IS_USERNAME_TAKEN,
  GET_USER_BY_ID,
  UPDATE_USER_PROFILE,
} from "@/graphql/auth/user/queries";
import { useSession } from "next-auth/react";
import { useTranslations } from "use-intl";
import toast from "react-hot-toast";
import { deriveApolloErrorMessage } from "@/utils/deriveApolloErrorMessage";

type FormData = {
  name: string;
  email: string;
  username: string;
};

export function useProfileForm() {
  const t = useTranslations();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [checkUsername, { loading: usernameCheckLoading }] = useLazyQuery(
    GET_IS_USERNAME_TAKEN,
    {
      fetchPolicy: "network-only",
    },
  );

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  });

  const [updateUser, { loading: mutationLoading, error: mutationError }] =
    useMutation(UPDATE_USER_PROFILE, {
      // If you want to handle errors in your code vs. thrown:
      errorPolicy: "all",
    });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
  });
  const [initialData, setInitialData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    if (data?.user) {
      const loaded = {
        name: data.user.name ?? "",
        email: data.user.email ?? "",
        username: data.user.username ?? "",
      };
      setFormData(loaded);
      setInitialData(loaded);
    }
  }, [data]);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    field: keyof FormData,
  ) {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function hasChanges() {
    return (
      formData.name !== initialData.name ||
      formData.email !== initialData.email ||
      formData.username !== initialData.username
    );
  }

  async function isUsernameTaken() {
    if (formData.username !== initialData.username) {
      const { data } = await checkUsername({
        variables: { username: formData.username },
      });
      if (data?.user?.id) {
        // Instead of storing local error, let's just toast here:
        toast.error(t("common.errors.username-taken"));
        return true;
      }
    }
    return false;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!userId) {
      toast.error("No user ID found.");
      return;
    }

    if (!hasChanges()) {
      // maybe toast a quick "No changes" or just do nothing
      return;
    }

    // Check username
    if (await isUsernameTaken()) {
      return; // Already toasted
    }

    try {
      const res = await updateUser({
        variables: {
          id: userId,
          data: {
            username: formData.username,
          },
        },
      });

      // If the mutation has GraphQL errors in `errorPolicy: "all"`, you can check here:
      if (res.errors && res.errors.length > 0) {
        // Show a toast for the first error
        toast.error(res.errors[0].message);
        return;
      }

      // If success, do a refetch
      await refetch();
      setInitialData(formData);

      toast.success(t("profile-page.form.messages.success"));
    } catch (err) {
      console.error("Error updating user:", err);

      if (mutationError) {
        const errorMessage = await deriveApolloErrorMessage(mutationError);
        toast.error(errorMessage);
      } else {
        toast.error(t("common.errors.generic"));
      }
    }
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    hasChanges,
    mutationError,
    mutationLoading,
    queryLoading,
    queryError,
    userData: data?.user,
    usernameCheckLoading,
  };
}
