import axios, { AxiosResponse } from "axios";
import {
  UserRequest,
  UserType,
  FormattedUserType,
} from "@/utils/types/UserType";
import formattedDate from "@/utils/formattedDate";
import api from "../axios";

interface UserResponse {
  message?: string;
  users?: UserType[]; // Array of users (for index endpoint)
  user?: UserType; // Single user (for show/update endpoints)
  error?: string;
  status?: number;
}

/**
 * Format user dates
 */
const formatUserDates = (user: UserType): FormattedUserType => {
  return {
    ...user,
    created_at_formatted: formattedDate(new Date(user.created_at)),
    updated_at_formatted: formattedDate(new Date(user.updated_at)),
    deleted_at_formatted: user.deleted_at
      ? formattedDate(new Date(user.deleted_at))
      : undefined,
  };
};

/**
 * Create a new user
 */
/**
 * Creates a new user with optional avatar upload
 * @param data - User data for creation
 * @param avatarFile - Optional avatar file
 * @returns Promise with operation result
 */
const createUser = async (
  data: UserRequest,
  avatarFile?: File | null
): Promise<{
  status: number;
  message?: string;
  users?: UserType[];
  usersFormatted?: FormattedUserType[];
}> => {
  try {
    const formData = new FormData();

    // Append all user fields
    Object.entries(data).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        (key === "avatar" && avatarFile)
      ) {
        return;
      }
      formData.append(key, String(value));
    });

    // Append avatar file if provided
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const response: AxiosResponse = await api.post("/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const status = response.status;

    const usersFormatted = response.data.users
      ? response.data.users.map(formatUserDates)
      : [];

    return {
      status,
      message: response.data.message,
      users: response.data.users,
      usersFormatted,
    };
  } catch (error) {
    const errorMessages = {
      422: "User gagal dibuat: Data tidak valid",
      403: "Anda tidak memiliki izin untuk membuat user",
      default: "User gagal dibuat: Terjadi kesalahan pada server",
    };

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        (status ? errorMessages[status as keyof typeof errorMessages] : null) ||
        errorMessages.default;

      throw new Error(message);
    }

    throw new Error(
      "User gagal dibuat: Terjadi kesalahan yang tidak diketahui"
    );
  }
};

/**
 * Get all users
 */
const getUsers = async (): Promise<{
  message?: string;
  users: UserType[];
  usersFormatted: FormattedUserType[];
}> => {
  try {
    const response: AxiosResponse<UserResponse> = await api.get("/user");

    // Format dates for display
    const usersFormatted = response.data.users
      ? response.data.users.map(formatUserDates)
      : [];

    return {
      message: response.data.message,
      users: response.data.users || [],
      usersFormatted,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error("Gagal mengambil data kategori");
  }
};

/**
 * Get a specific user by ID
 */
const getUser = async (
  id: string
): Promise<{
  message?: string;
  user?: UserType;
  userFormatted?: FormattedUserType;
}> => {
  try {
    const response: AxiosResponse<UserResponse> = await api.get(`/user/${id}`);

    // Format dates for the user
    const userFormatted = response.data.user
      ? formatUserDates(response.data.user)
      : undefined;

    return {
      message: response.data.message,
      user: response.data.user,
      userFormatted,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle not found error
      if (error.response?.status === 404) {
        throw new Error("Kategori tidak ditemukan");
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error("Gagal mengambil data kategori");
  }
};

/**
 * Update a user
 */
const updateUser = async (
  userId: string,
  data: UserRequest,
  avatarFile?: File | null
): Promise<{
  status: number;
  message?: string;
  user?: UserType;
  userFormatted?: FormattedUserType;
}> => {
  try {
    const formData = new FormData();

    // Append fields from data
    Object.entries(data).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (key === "avatar" && avatarFile)
      ) {
        return;
      }
      formData.append(key, String(value));
    });

    // Append avatar if available
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const response: AxiosResponse = await api.post(
      `/user/${userId}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const status = response.status;

    if (status === 200) {
      const userFormatted = response.data.user
        ? formatUserDates(response.data.user)
        : undefined;

      return {
        status,
        message: response.data.message,
        user: response.data.user,
        userFormatted,
      };
    } else {
      throw new Error(`Unexpected status code: ${status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;

      if (status === 422) {
        throw new Error(msg || "User gagal diperbarui: Data tidak valid");
      }
      if (status === 403) {
        throw new Error("Anda tidak memiliki izin untuk memperbarui user");
      }
      throw new Error(
        msg || "User gagal diperbarui: Terjadi kesalahan pada server"
      );
    }
    throw new Error(
      "User gagal diperbarui: Terjadi kesalahan yang tidak diketahui"
    );
  }
};

/**
 * Delete a user
 */
const deleteUser = async (id: string): Promise<{ message?: string }> => {
  try {
    const response: AxiosResponse<UserResponse> = await api.delete(
      `/user/${id}`
    );

    return {
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle unauthorized errors
      if (error.response?.status === 403) {
        throw new Error("Anda tidak memiliki izin untuk menghapus kategori");
      }
      // Handle not found error
      if (error.response?.status === 404) {
        throw new Error("Kategori tidak ditemukan");
      }
      // Handle validation error (user has related products)
      if (error.response?.status === 422) {
        throw new Error(
          "Kategori ini tidak dapat dihapus karena masih memiliki produk terkait"
        );
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error("Gagal menghapus kategori");
  }
};

const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
