import { getCurrentUser } from "@/service/user";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    user: user?.data,
    isLoading,
    error,
    isAuthenticated: !!user?.data && !error,
    refetch,
  };
}
