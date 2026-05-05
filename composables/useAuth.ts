interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export const useAuth = () => {
  const user = useState<User | null>("auth_user", () => null);
  const loading = useState("auth_loading", () => true);

  const fetchUser = async () => {
    try {
      const data = await $fetch<{ user: User }>("/api/auth/me");
      user.value = data.user;
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    const data = await $fetch<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    user.value = {
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    } as User;
    return data;
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    user.value = null;
    navigateTo("/login");
  };

  const isAdmin = computed(() => user.value?.role === "ADMIN");

  return { user, loading, fetchUser, login, logout, isAdmin };
};
