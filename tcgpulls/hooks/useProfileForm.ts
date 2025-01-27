import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_USER_BY_ID,
  UPDATE_USER_PROFILE,
} from "@/graphql/auth/user/queries";
import { useSession } from "next-auth/react";

type FormData = {
  name: string;
  email: string;
  username: string;
};

export function useProfileForm() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 1) Fetch existing user data
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  });

  // 2) Mutation for updating
  const [updateUser, { loading: mutationLoading, error: mutationError }] =
    useMutation(UPDATE_USER_PROFILE);

  // 3) We'll keep both `formData` (current edits) and `initialData` (last saved)
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

  // 4) For showing a success message if update completes
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // 5) Populate both formData and initialData once we have the user
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

  // Single handler for multiple fields
  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    field: keyof FormData,
  ) {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setUpdateSuccess(false); // reset if user types again
  }

  // Helper to see if anything changed compared to initialData
  function hasChanges() {
    return (
      formData.name !== initialData.name ||
      formData.email !== initialData.email ||
      formData.username !== initialData.username
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;

    // If no changes, skip the request
    if (!hasChanges()) {
      return;
    }

    setUpdateSuccess(false);
    try {
      // Right now we only update username,
      // but you can extend this if you allow more fields to be updated.
      await updateUser({
        variables: {
          id: userId,
          data: {
            username: formData.username,
          },
        },
      });

      // If successful:
      await refetch();
      setInitialData(formData); // New baseline
      setUpdateSuccess(true); // Show success
    } catch (err) {
      console.error("Error updating user:", err);
    }
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    hasChanges,
    updateSuccess, // For success message
    mutationError,
    mutationLoading,
    queryLoading,
    queryError,
    userData: data?.user,
  };
}
